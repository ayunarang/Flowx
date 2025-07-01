import { useState, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";
import { InputNode } from "../nodes/InputNode";
import { LLMNode } from "../nodes/LlmNode";
import { OutputNode } from "../nodes/OutputNode";
import { TextNode } from "../nodes/TextNode";
import "reactflow/dist/style.css";
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
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, name: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        if (typeof type === "undefined" || !type) {
          return;
        }

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
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const { user } = useAuth();
  const { id: pipelineId, token: shareToken } = useParams();

  useClearPipelineOnInvalidRoute();

  useAutoSavePipeline({ nodes, edges, user, pipelineId, delay: 5000, shareToken });
  usePipelineLoad({ pipelineId, shareToken });

  usePipelineSaveBeforeSignin({ user, pipelineId, delay: 3000, shareToken });

  return (
    <div ref={reactFlowWrapper} style={{ width: "100wv", height: "100vh" }} className="bg-[#f7f7f7]">
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
        <Controls position="top-right" className="no-export" />
        <MiniMap position="bottom-right" className="no-export" />
      </ReactFlow>
    </div>
  );
};
