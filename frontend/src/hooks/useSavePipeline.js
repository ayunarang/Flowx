import { useStore } from "../store";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

export const useSavePipeline = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const pipelineId = useStore((state) => state.currentPipelineId);
  const setPipelineId = useStore((state) => state.setPipelineId);
  const pipelineName = useStore((state) => state.currentPipelineName);

  const savePipeline = async (
    user,
    { showToast = true, saveAsNew = false } = {}
  ) => {
    if (!user) {
      if (showToast) toast.error("You must be signed in to save.");
      return;
    }

    if (nodes.length === 0 && edges.length === 0) {
      if (showToast) toast.error("Pipeline is empty.");
      return;
    }

    try {
      if (saveAsNew || !pipelineId) {
        const { data, error } = await supabase
          .from("pipelines")
          .insert({
            owner_id: user.id,
            name: pipelineName || "Untitled Pipeline",
            data: { nodes, edges },
            access_level: "public",
          })
          .select()
          .single();

        if (error) throw error;

        setPipelineId(data.id);

        window.history.pushState({}, "", `/pipeline/${data.id}`);

        if (showToast) toast.success("Pipeline saved as new!");
      } else {
        const { error } = await supabase
          .from("pipelines")
          .update({ data: { nodes, edges } })
          .eq("id", pipelineId);

        if (error) throw error;

        if (showToast) toast.success("Pipeline updated!");
      }
    } catch (err) {
      console.error("[SavePipeline] Error:", err);
      if (showToast) toast.error("Pipeline save failed.");
    }
  };

  return { savePipeline };
};
