import { useStore } from "../store";

function PipelineNameInput() {

    const currentPipelineName = useStore((state) => state.currentPipelineName);
    const setCurrentPipelineName = useStore((state) => state.setCurrentPipelineName);
    const isAutoSaved = useStore((state) => state.isAutoSaved);
    const canEdit = useStore((state) => state.canEdit);

    return (
        <div className="items-center flex flex-col sm:flex-row sm:mb-0 mb-2">
            {canEdit && (
                <>
                    <p className={`text-xs flex font-normal sm:mr-3 mb-3 sm:mb-0 ${isAutoSaved ? "text-blue-600" : "text-gray-400"}`}>
                        {isAutoSaved ? "Saved" : "Idle"}
                    </p>

                    <input
                    autoFocus
                        type="text"
                        value={currentPipelineName}
                        onChange={(e) => setCurrentPipelineName(e.target.value)}
                        placeholder="Pipeline name"
                        className="font-semibold px-2 py-2 sm:py-1 border-b border-gray-400 focus:outline-none bg-transparent sm:text-sm sm:min-w-20 max-w-full"
                    />
                </>
            )}
        </div>
    )
}

export default PipelineNameInput
