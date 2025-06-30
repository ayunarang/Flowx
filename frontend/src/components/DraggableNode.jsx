// draggableNode.js

import { getIconForType } from "../utils/getIcon";

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
<div
  className="cursor-grab min-w-10 flex items-center justify-center flex-col rounded-md bg-white text-black border-gray-200 border px-2 py-1.5 text-sm font-medium shadow-subtle "
  onDragStart={(event) => onDragStart(event, type)}
  onDragEnd={(event) => (event.target.style.cursor = 'grab')}
  draggable
>
  <div className="flex items-center self-start space-x-2">
    <div className="w-3 h-3 flex items-center justify-center border border-gray-300 rounded-md p-4">
      {getIconForType(type)}
    </div>
    <span className="leading-none">{label}</span>
  </div>
</div>

  );
};
