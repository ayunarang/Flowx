
import { useState } from "react";
import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";

export const OutputNode = ({ id, data }) => {
  const [outputType, setOutputType] = useState(data.outputType || "Text");

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  const content = (
    <div className="flex flex-col">
      <label>Type:</label>
      <select value={outputType} onChange={handleTypeChange}>
        <option value="Text">Text</option>
        <option value="File">Image</option>
      </select>
    </div>
  );

  return (
    <CustomNode
      title="Output"
      content={content}
      data={data}
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-value`,
        },
      ]}
    />
  );
};
