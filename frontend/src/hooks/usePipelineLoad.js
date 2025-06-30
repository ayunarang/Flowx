import { useEffect } from "react";
import { useStore } from "../store";
import { supabase } from "../supabaseClient";

export default function usePipelineLoad({ pipelineId }) {
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const setPipelineId = useStore((state) => state.setPipelineId);

  useEffect(() => {
    if (!pipelineId) return;

    const loadPipeline = async () => {
      if (!pipelineId) return;

      const { data, error } = await supabase
        .from("pipelines")
        .select("id, data")
        .eq("id", pipelineId)
        .single();

      if (error || !data) {
        console.error("Failed to load pipeline:", error);
        return;
      }

      const { nodes, edges } = data.data || {};

      setNodes(nodes || []);
      setEdges(edges || []);
      setPipelineId(data.id);

      console.log("Pipeline reloaded from DB:", data.id);
    };

    loadPipeline();
  }, [pipelineId, setNodes, setEdges, setPipelineId]);
}
