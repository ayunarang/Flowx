import { useEffect, useRef, useState } from "react";
import { Position, useUpdateNodeInternals } from "reactflow";
import { CustomNode } from "../components/CustomNode";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z0-9_\-$]+)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.name || "text");

  const [variables, setVariables] = useState([]);
  const updateNodeInternals = useUpdateNodeInternals();

  const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    addEdgeManually: state.addEdgeManually,
    updateNodeField: state.updateNodeField,
  });

  const { nodes, edges, addEdgeManually, updateNodeField } = useStore(
    selector,
    shallow
  );

  const handleTextChange = (e) => {
    const value = e.target.value;
    setCurrText(value);
    updateNodeField(id, "name", value);
  };

  useEffect(() => {
    const matches = [...currText.matchAll(VARIABLE_REGEX)];
    const vars = matches.map((match) => match[1]);
    setVariables([...variables, ...vars]);
  }, [currText]);

  useEffect(() => {
    updateNodeInternals(id);
    variables.forEach((variable) => {
      const sourceNode = nodes.find((n) => n.data?.name === variable);
      if (!sourceNode) return;

      const sourceId = sourceNode.id;

      const edgeExists = edges.some(
        (e) =>
          e.source === sourceId &&
          e.target === id &&
          e.targetHandle === `${id}-${variable}`
      );

      if (!edgeExists) {
        const newEdge = {
          source: sourceId,
          sourceHandle: `${sourceId}-value`,
          target: id,
          targetHandle: `${id}-${variable}`,
        };

        addEdgeManually(newEdge);
      }
    });
  }, [variables, id, updateNodeInternals]);

  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  const content = (
    <label>
      Text
      <textarea
        ref={textareaRef}
        value={currText}
        onChange={handleTextChange}
        rows={1}
        style={{
          resize: "none",
          overflow: "hidden",
        }}
      />
    </label>
  );

  const handles = [
    ...Array.from(variables).map((variable, idx) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${variable}`,
      style: {
        top: `${(idx + 1) * 25}px`,
      },
    })),
    {
      type: "source",
      position: Position.Right,
      id: `${id}-output`,
    },
  ];

  return <CustomNode title="Text" content={content} handles={handles}       data={data}
/>;
};
