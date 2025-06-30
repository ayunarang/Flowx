import { useStore } from "../store";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useSavePipeline = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const pipelineId = useStore((state) => state.currentPipelineId);
  const setPipelineId = useStore((state) => state.setPipelineId);

  const navigate = useNavigate();

  const savePipeline = async (user) => {
    if (!user) {
      console.error("User not signed in");
      return;
    }

    if (nodes.length === 0 && edges.length === 0) {
      toast.error("No pipeline data to save.");
      return;
    }

    try {
      if (!pipelineId) {
        const { data, error } = await supabase
          .from("pipelines")
          .insert({
            owner_id: user.id,
            name: "My Pipeline",
            data: { nodes, edges },
            access_level: "public",
          })
          .select()
          .single();

        if (error) throw error;

        setPipelineId(data.id);
        navigate(`/pipeline/${data.id}`);
        toast.success("Pipeline created successfully!");
      } else {
        const { error } = await supabase
          .from("pipelines")
          .update({
            data: { nodes, edges },
          })
          .eq("id", pipelineId);

        if (error) throw error;

        toast.success("Pipeline updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save pipeline.");
    }
  };

  return { savePipeline };
};
