
import { useState } from "react";
import { Position } from "reactflow";
import { CustomNode } from "../components/CustomNode";

export const InputNode = ({ id, data }) => {
  const [inputType, setInputType] = useState(data.inputType || "Text");
  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  const content = (
    <div className="flex flex-col">
      <label>Type</label>
      <select value={inputType} onChange={handleTypeChange}>
        <option value="Text">Text</option>
        <option value="File">File</option>
      </select>
    </div>
  );

  return (
    <CustomNode
      title="Input"
      content={content}
      handles={[
        { type: "source", position: Position.Right, id: `${id}-value` },
      ]}
      data={data}
    />
  );
};
