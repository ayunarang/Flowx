
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
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
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
      ),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        return node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node;
      }),
    });
  },

  addEdgeManually: (connection) => {
    set({
      edges: addEdge(
        {
          id: `e-${connection.source}-${connection.target}-${Date.now()}`,
          ...connection,
          type: "smoothstep",
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
      ),
    });
  },
}));
