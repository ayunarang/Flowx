import { RefreshCwIcon } from "lucide-react";
import { useStore } from "../store";


const ResetButton = ({isDrawer, styles}) => {
    const setNodes = useStore((state) => state.setNodes)
    const setEdges = useStore((state) => state.setEdges)

    const handleReset = () => {
        setNodes([])
        setEdges([])
    }
    return (
        <button
            onClick={handleReset}
            className={`${(isDrawer) ? styles : "flex items-center gap-1  text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1"} `}>
            <RefreshCwIcon className="h-6 sm:h-5 w-6 sm:w-5" />
            <span className={!isDrawer && "hidden md:block"}>
                Reset
            </span>
        </button>
    )
}

export default ResetButton


