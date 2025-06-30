import { useState } from "react";
import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";

export const ConstantNode = ({ id, data }) => {
  const [Constant, setConstant] = useState("");

  const handleConstantChange = (e) => {
    setConstant(e.target.value);
  };

  const content = (
    <input
      type="text"
      value={Constant}
      onChange={handleConstantChange}
      placeholder="Any constant"
    />
  );

  return (
    <CustomNode
      title="Constant"
      content={content}
            data={data}

      handles={[
        {
          type: "source",
          position: Position.Right,
          id: `${id}-useConstant`,
        },
      ]}
    />
  );
};
