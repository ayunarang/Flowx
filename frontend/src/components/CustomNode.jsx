import { Handle } from "reactflow";
import { useStore } from "../store";
import { useState } from "react";

export const CustomNode = ({ data, title, content, handles }) => {
  const [currName, setCurrName] = useState(data?.name || data?.nodeType);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    updateNodeField(data.id, "name", value);
  };

  return (
    <div className="bg-white min-w-72 max-w-md h-auto rounded-xl border-white border shadow-deep">
      <div className="ml-3 my-3">
        <span className="text-xl font-medium">{title}</span>
      </div>
      <div className="bg-[#f0f0f0] p-2.5 mx-3 mb-4 rounded-lg text-lg">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label>Name</label>

            <input type="text" value={currName} onChange={handleNameChange} />
          </div>

          {content}
        </div>
      </div>

      {(handles || []).map((handle, idx) => (
        <Handle key={idx} {...handle} className="handle-styles" />
      ))}
    </div>
  );
};
