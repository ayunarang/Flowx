
import { getIconForType } from "../utils/getIcon";

export const DraggableNode = ({ type, label, collapsed = false }) => {
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
      className={`
    cursor-grab
    flex ${collapsed ? "flex-col items-center justify-center" : "flex-row items-center"}
    rounded-md sm:border sm:border-gray-200 sm:gap-2 gap-0.5
    bg-white text-black
    ${collapsed
          ? 'sm:p-0 py-1 px-1.5 w-full sm:w-fit text-center'
          : 'p-1.5 sm:min-w-fit'
        }
    text-xs font-medium sm:shadow-subtle
  `}


      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <div className={` flex items-center justify-center border border-gray-300 rounded-md ${collapsed ? 'p-1 sm:p-2' : 'p-1'}`}>
        {collapsed ? getIconForType(type, 20) : getIconForType(type, 16)}
      </div>
      {collapsed ? (
        <span className="text-[8px] sm:text-xs text-center sm:hidden whitespace-nowrap">{label}</span>
      ) : (
        <span className="leading-none break-words">{label}</span>
      )}
    </div>
  );
};

