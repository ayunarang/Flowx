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
<div
  className="
    bg-white
    w-[clamp(250px,30vw,300px)]
    rounded-xl border shadow-deep 
    p-[clamp(0.5rem,2vw,1rem)]
    text-[clamp(0.75rem,1vw,1rem)]
  "
>
      <div className="mb-2">
        <span className="text-xl font-medium">{title}</span>
      </div>
      <div className="bg-[#f0f0f0] p-3 rounded-lg text-lg">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor={`node-${data.id}`} className="text-sm mb-1">
              Name
            </label>
            <input
              id={`node-${data.id}`}
              type="text"
              value={currName}
              onChange={handleNameChange}
              className="px-2 py-1 rounded border"
            />
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
