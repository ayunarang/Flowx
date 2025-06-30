import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";
import { useState } from "react";

export const MathNode = ({ id, data }) => {
  const [operation, setoperation] = useState("");

  const handleOperationChange = (e) => {
    const filtered = e.target.value.replace(/[^+\-*/]/g, "");
    setoperation(filtered);
  };

  const content = (
    <input
      type="text"
      value={operation}
      onChange={handleOperationChange}
      placeholder="+ - * /"
    />
  );

  return (
    <CustomNode
      title="Operation"
            data={data}

      content={content}
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-operator1`,
          style: { top: `${100 / 3}%` },
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-operator2`,
          style: { top: `${200 / 3}%` },
        },
        { type: "source", position: Position.Right, id: `${id}-calculation` },
      ]}
    />
  );
};
