
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
    rounded-md sm:border sm:border-gray-200 gap-2
    bg-white text-black
    ${collapsed
          ? 'sm:p-0 py-2 px-1 min-w-20 sm:min-w-fit max-w-fit sm:w-fit text-center'
          : 'p-1.5 sm:min-w-fit'
        }
    text-xs font-medium sm:shadow-subtle
  `}


      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      {/* Collapsed + small screens */}
      <div
        className={`
    ${collapsed ? 'flex' : 'hidden'} 
    sm:hidden 
    items-center justify-center border border-gray-300 rounded-md p-2
  `}
      >
        {collapsed && getIconForType(type, 20, 'text-canvas-ink')}
      </div>

      {/* Collapsed + large screens */}
      <div
        className={`
    hidden 
    ${collapsed ? 'sm:flex' : ''} 
    items-center justify-center border border-gray-300 rounded-md p-2
  `}
      >
        {collapsed && getIconForType(type, 18, 'text-canvas-ink')}
      </div>

      {/* Not collapsed */}
      <div
        className={`
    ${!collapsed ? 'flex' : 'hidden'}
    items-center justify-center border border-gray-300 rounded-md p-1
  `}
      >
        {!collapsed && getIconForType(type, 16, 'text-canvas-ink')}
      </div>

      {collapsed ? (
        <span className="text-sm sm:text-xs text-center sm:hidden whitespace-nowrap text-canvas-ink">{label}</span>
      ) : (
        <span className="leading-none break-words text-canvas-ink">{label}</span>
      )}
    </div>
  );
};

