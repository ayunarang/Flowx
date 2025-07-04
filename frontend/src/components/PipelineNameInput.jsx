import { useState, useEffect } from "react";
import { useStore } from "../store";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Pencil, CheckLineIcon } from "lucide-react";
import { useUpdatePipelineName } from "../hooks/useUpdatePipelineName";

export default function PipelineNameInput() {
  const currentPipelineName = useStore((state) => state.currentPipelineName);
  const setCurrentPipelineName = useStore((state) => state.setCurrentPipelineName);
  const isAutoSaved = useStore((state) => state.isAutoSaved);
  const canEdit = useStore((state) => state.canEdit);
  const { updatePipelineName } = useUpdatePipelineName();

  const { id: pipelineId, token: shareToken } = useParams();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPipelineName = async () => {
      if (!pipelineId && !shareToken) return;

      let data, error;

      if (pipelineId) {
        const result = await supabase
          .from("pipelines")
          .select("name")
          .eq("id", pipelineId)
          .single();

        data = result.data;
        error = result.error;
      } else if (shareToken) {
        const result = await supabase
          .from("pipeline_shared")
          .select("pipelines(name)")
          .eq("share_token", shareToken)
          .single();

        data = result.data?.pipelines;
        error = result.error;
      }

      if (error) {
        console.error("Failed to fetch pipeline name:", error);
        return;
      }
      if (data?.name) {
        setCurrentPipelineName(data.name);
      }
    };

    fetchPipelineName();
  }, [pipelineId, shareToken, setCurrentPipelineName]);

  const handleEditClick = () => {
    if (isEditing) {
      updatePipelineName(currentPipelineName);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="items-start sm:items-center flex flex-col sm:flex-row sm:mb-0 mb-2">
      {canEdit && (
        <>
          <p
            className={`text-xs flex font-normal sm:mr-3 mb-3 sm:mb-0 ${isAutoSaved ? "text-blue-600" : "text-gray-500"
              }`}
          >
            {isAutoSaved ? "Saved" : "Idle"}
          </p>

          <div className="relative flex items-center w-[75%] sm:w-fit gap-1">
            <input
              type="text"
              value={currentPipelineName}
              onChange={(e) => setCurrentPipelineName(e.target.value)}
              placeholder="Pipeline name"
              readOnly={!isEditing}
              className={`font-semibold px-2 py-2 sm:py-1 border border-gray-400 focus:outline-none bg-transparent sm:text-sm sm:min-w-36 w-full max-w-full ${isEditing ? "text-black" : "text-gray-500 cursor-not-allowed bg-white"
                }`}
            />

            <button
              onClick={handleEditClick}
              type="button"
              className="absolute right-0.5 top-1/2-translate-y-1/2w-10 h-7 bg-white flex items-center justify-center text-gray-5 hover:text-black transition-colors"
              title={isEditing ? "Save" : "Edit"}
            >
              {isEditing ? (
                <CheckLineIcon className="w-4 h-4 mx-2" />
              ) : (
                <Pencil className="w-4 h-4 mx-2" />
              )}

            </button>

          </div>
        </>
      )}
    </div>
  );
}
