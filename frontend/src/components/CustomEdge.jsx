import { getSmoothStepPath } from "reactflow";
import { useStore } from "../store";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const disconnectEdge = useStore((state) => state.disconnectEdge);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 50, 
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={40}
        height={40}
        x={labelX - 20}
        y={labelY - 20}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <button
          className="bg-black rounded-full w-9 h-9 sm:w-8 sm:h-8 flex justify-center"
          onClick={(e) => {
            e.stopPropagation();
            disconnectEdge(id);
          }}
        >
          <span className="text-white font-bold sm:text-xl text-2xl">x</span>
        </button>
      </foreignObject>
    </>
  );
}
