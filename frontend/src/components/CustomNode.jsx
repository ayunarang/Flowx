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
<div id="custom-node"
  className="
    bg-white
    w-[clamp(400px,60vw,500px)]
    aspect-[4/3]
    rounded-xl border border-gray-400 shadow-deep 
    text-[clamp(0.75rem,1vw,1rem)]
    flex flex-col  
    md:w-[clamp(280px,50vw,300px)]
    md:p-4 
    md:text-[clamp(0.75rem,1vw,1rem)]
    p-6
  "
>
  <div className="mb-2">
    <span className="text-3xl md:text-xl font-medium">{title}</span>
  </div>

  <div className="bg-[#f0f0f0] p-6 md:p-3 rounded-lg text-lg flex-1 flex flex-col">
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex flex-col custom-node-heading">
        <label htmlFor={`node-${data.id}`} className="mb-1">
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
      <div className="custom-node-content">{content}</div>
    </div>
  </div>

  {(handles || []).map((handle, idx) => (
    <Handle key={idx} {...handle} className="handle-styles" />
  ))}
</div>

  );
};
