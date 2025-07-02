import { useState, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";
import { InputNode } from "../nodes/InputNode";
import { LLMNode } from "../nodes/LlmNode";
import { OutputNode } from "../nodes/OutputNode";
import { TextNode } from "../nodes/TextNode";
import { ConditionNode } from "../nodes/ConditionNode";
import { MathNode } from "../nodes/MathNode";
import { ConstantNode } from "../nodes/ConstantNode";
import { APINode } from "../nodes/ApiNode";
import { AuthNode } from "../nodes/AuthNode";
import { usePipelineSaveBeforeSignin } from "../hooks/usePipelineSaveBeforeSignin";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import { useAutoSavePipeline } from "../hooks/useAutoSave";
import usePipelineLoad from "../hooks/usePipelineLoad";
import { useClearPipelineOnInvalidRoute } from "../hooks/useClearPipelineOnInvalidRoute";

import "reactflow/dist/style.css";
import AuthModal from "./AuthModal";
import ShareModal from "./ShareModal";
import Spinner from "../components/Spinner";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  ifElse: ConditionNode,
  operation: MathNode,
  constant: ConstantNode,
  api: APINode,
  auth: AuthNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({ reactFlowWrapper }) => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { id: pipelineId, token: shareToken } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { isLoading: pipelineLoading } = usePipelineLoad({ pipelineId, shareToken });
  const [hasFitView, setHasFitView] = useState(false);
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const isAuthModalOpen = useStore((state) => state.isAuthModalOpen);
  const setShareModalOpen = useStore((state) => state.setShareModalOpen);
  const isShareModalOpen = useStore((state) => state.isShareModalOpen);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, name: nodeID, nodeType: type });
  const getNodeById = (id) => nodes.find((n) => n.id === id);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event?.dataTransfer?.getData("application/reactflow");
      if (!data) return;

      const appData = JSON.parse(data);
      const type = appData?.nodeType;
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      };

      addNode(newNode);
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);


  useClearPipelineOnInvalidRoute();
  useAutoSavePipeline({ nodes, edges, user, pipelineId, delay: 5000, shareToken });
  usePipelineSaveBeforeSignin({ user, pipelineId, delay: 3000, shareToken });

  const getMinZoom = () => {
    const width = window.innerWidth;
    if (width < 480) return 0.22;
    if (width < 768) return 0.3;
    return 0.5;
  };

  useEffect(() => {
    if (!reactFlowInstance) return;

    if (nodes.length > 1 && !hasFitView) {
      reactFlowInstance.fitView({ padding: 0.8, minZoom: getMinZoom() });
      setHasFitView(true);
    }

    if (nodes.length <= 1 && hasFitView) {
      setHasFitView(false);
    }
  }, [reactFlowInstance, nodes.length, hasFitView]);

  useEffect(() => {
    if (!reactFlowInstance) return;

    const handleResize = () => {
      if (hasFitView && nodes.length > 1) {
        reactFlowInstance.fitView({ padding: 0.8, minZoom: getMinZoom() });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [reactFlowInstance, nodes.length, hasFitView]);



  if (authLoading || pipelineLoading) {
    return <Spinner />;
  }

  return (
    <div
      ref={reactFlowWrapper}
      className="w-screen h-screen overflow-hidden relative"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}

        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        minZoom={getMinZoom()}
        maxZoom={4}
        isValidConnection={(connection) => {
          const sourceNode = getNodeById(connection.source);
          const targetNode = getNodeById(connection.target);
          const targetHandle = connection.targetHandle;

          if (targetNode?.type === "text") {
            const match = targetHandle?.match(/-([a-zA-Z0-9_$]+-\d+)$/);
            const expectedVariable = match?.[1];
            return sourceNode?.data?.name === expectedVariable;
          }

          return true;
        }}
      >
        <Background gap={gridSize} variant="dots" color="#060606" />
        <Controls position="top-right" className="no-export" style={{ top: "4rem" }} />
        <MiniMap position="bottom-right" className="no-export hidden md:block" />
      </ReactFlow>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} />

    </div>
  );
};
