
import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";

export const LLMNode = ({ id, data }) => {
  const content = <span>This is a LLM.</span>;

  return (
    <CustomNode
      title="LLM"
      content={content}
            data={data}

      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-system`,
          style: { top: `${100 / 3}%` },
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-prompt`,
          style: { top: `${200 / 3}%` },
        },
        { type: "source", position: Position.Right, id: `${id}-response` },
      ]}
    />
  );
};
