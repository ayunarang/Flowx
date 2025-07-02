import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";
import { useState } from "react";

export const ConditionNode = ({ id, data }) => {
  const [condition, setcondition] = useState("true");

  const content = (
    <select
      value={condition}
      onChange={(e) => setcondition(e.target.value === "true")}
    >
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  );

  return (
    <CustomNode
      title="Condition"
      content={content}
      data={data}

      handles={[

        { type: "target", position: Position.Left, id: `${id}-statement` },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-true`,
          style: { top: `${100 / 3}%` },
        },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-false`,
          style: { top: `${200 / 3}%` },
        },

      ]}
    />
  );
};
