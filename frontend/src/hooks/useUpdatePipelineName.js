import { useStore } from "../store";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import useAuth from "./useAuth";

export const useUpdatePipelineName = () => {
  const pipelineId = useStore((state) => state.currentPipelineId);
  const setCurrentPipelineName = useStore(
    (state) => state.setCurrentPipelineName
  );
  const user = useAuth();

  const updatePipelineName = async (newName) => {
    if (!user) {
      toast.error("User not found.");
      return;
    }
    if (!pipelineId) {
      toast.error(
        "Start creating a pipeline first, you can name it after your pipeline is auto-saved to database."
      );
      setCurrentPipelineName("Untitled Pipeline");
      return;
    }

    const { error } = await supabase
      .from("pipelines")
      .update({ name: newName })
      .eq("id", pipelineId);

    if (error) {
      console.error("[UpdatePipelineName] Error:", error);
      toast.error("Failed to update pipeline name in database.");

    } else {
      setCurrentPipelineName(newName);
      toast.success("Pipeline name updated!");
    }
  };

  return { updatePipelineName };
};
