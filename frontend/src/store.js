import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  currentPipelineId: null,
  currentPipelineName: "Untitled Pipeline",
  isAuthModalOpen: false,
  isShareModalOpen: false,
  isAutoSaved: false,
  canEdit: true,

  history: {
    past: [],
    present: { nodes: [], edges: [] },
    future: [],
  },

  setCanEdit: (flag) => set({ canEdit: flag }),
  setPipelineId: (id) => set({ currentPipelineId: id }),
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  setShareModalOpen: (isOpen) => set({ isShareModalOpen: isOpen }),
  setCurrentPipelineName: (name) => set({ currentPipelineName: name }),
  setAutoSaved: (isSaved) => set({ isAutoSaved: isSaved }),

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  saveToHistory: (nodes, edges) => {
    const { history } = get();
    const safeNodes = Array.isArray(nodes) ? nodes : get().nodes;
    const safeEdges = Array.isArray(edges) ? edges : get().edges;

    const newPast = [...history.past, history.present];
    const newPresent = { nodes: [...safeNodes], edges: [...safeEdges] };

    set({
      history: {
        past: newPast,
        present: newPresent,
        future: [],
      },
    });
  },

  setNodes: (nodes) => {
    set({ nodes });
    get().saveToHistory(nodes, get().edges);
  },
  setEdges: (edges) => {
    set({ edges });
    get().saveToHistory(get().nodes, edges);
  },
  setNodesAndEdges: (nodes, edges) => {
    set({ nodes, edges });
    get().saveToHistory(nodes, edges);
  },

  addNode: (node) => {
    const newNodes = [...get().nodes, node];
    set({ nodes: newNodes });
    get().saveToHistory(newNodes, get().edges);
  },

  onNodesChange: (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: newNodes });
    get().saveToHistory(newNodes, get().edges);
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    const newNodes = get().nodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
        : node
    );
    set({ nodes: newNodes });
    get().saveToHistory(newNodes, get().edges);
  },

  onEdgesChange: (changes) => {
    const newEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: newEdges });
    get().saveToHistory(get().nodes, newEdges);
  },

  onConnect: (connection) => {
    const newEdges = addEdge(
      {
        ...connection,
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        type: "custom",
        data: { disconnectEdge: get().disconnectEdge },
        animated: true,
        markerEnd: {
          type: MarkerType.Arrow,
          height: 10,
          width: 10,
          color: "#302d34",
        },
        style: {
          stroke: "#302d34",
          strokeWidth: 1,
          strokeDasharray: "15 4",
        },
      },
      get().edges
    );

    set({ edges: newEdges });
    get().saveToHistory(get().nodes, newEdges);
  },

  disconnectEdge: (edgeId) => {
    const newEdges = get().edges.filter((edge) => edge.id !== edgeId);
    set({ edges: newEdges });
    get().saveToHistory(get().nodes, newEdges);
  },

  addEdgeManually: (connection) => {
    const newEdges = addEdge(
      {
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        ...connection,
        type: "custom",
        data: { disconnectEdge: get().disconnectEdge },
        animated: true,
        markerEnd: {
          type: MarkerType.Arrow,
          height: 10,
          width: 10,
          color: "#302d34",
        },
        style: {
          stroke: "#302d34",
          strokeWidth: 1,
          strokeDasharray: "15 4",
        },
      },
      get().edges
    );

    set({ edges: newEdges });
    get().saveToHistory(get().nodes, newEdges);
  },

  undo: () => {
    const { history } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    const newFuture = [history.present, ...history.future];

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: {
        past: newPast,
        present: previous,
        future: newFuture,
      },
    });
  },

  redo: () => {
    const { history } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);
    const newPast = [...history.past, history.present];

    set({
      nodes: next.nodes,
      edges: next.edges,
      history: {
        past: newPast,
        present: next,
        future: newFuture,
      },
    });
  },

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,
}));
