import { useEffect, useRef } from "react";
import { useStore } from "../store";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function usePipelineSaveBeforeSignin({
  user,
  pipelineId,
  delay,
  shareToken,
}) {
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const setPipelineId = useStore((state) => state.setPipelineId);
  const pipelineName = useStore((state) => state.currentPipelineName);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  //
  // LOCAL RELOAD: skip if shared mode
  //
  useEffect(() => {
    if (user || pipelineId) return;
    if (shareToken) {
      console.log(
        "[Bootstrap] Skipping local draft handover: shared mode active."
      );
      return;
    }

    const saved = sessionStorage.getItem("pipeline_draft");
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        if (savedNodes && savedEdges) {
          console.log("[Bootstrap] Restoring local draft:", {
            savedNodes,
            savedEdges,
          });
          setNodes(savedNodes);
          setEdges(savedEdges);
        }
      } catch (err) {
        console.error("[Bootstrap] Failed to parse local draft:", err);
      }
    }
  }, [user, pipelineId, setNodes, setEdges, shareToken]);

  //
  // LOCAL AUTOSAVE: skip if shared mode
  //
  useEffect(() => {
    if (user || pipelineId) return;
    if (shareToken) {
      console.log(
        "[Bootstrap] Skipping local draft autosave: shared mode active."
      );
      return;
    }

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      sessionStorage.setItem("pipeline_draft", JSON.stringify({ nodes, edges }));
      console.log("[Bootstrap] Local draft autosaved.");
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [nodes, edges, user, pipelineId, delay, shareToken]);

  //
  // HANDOVER: skip if shared mode
  //
  useEffect(() => {
    if (!user) return;
    if (shareToken) {
      console.log(
        "[Bootstrap] Skipping local draft handover: shared mode active."
      );
      return;
    }

    const saved = sessionStorage.getItem("pipeline_draft");
    if (!saved) return;

    try {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
      if (!savedNodes || !savedEdges) return;

      console.log("[Bootstrap] Found local draft after sign-in, syncing...");

      setNodes(savedNodes);
      setEdges(savedEdges);

      const syncToSupabase = async () => {
        if (!pipelineId) {
          const { data, error } = await supabase
            .from("pipelines")
            .insert({
              owner_id: user.id,
              name: pipelineName || "Untitled Pipeline",
              data: { nodes: savedNodes, edges: savedEdges },
              access_level: "public",
            })
            .select()
            .single();

          if (error) {
            console.error("[Bootstrap] Failed to create pipeline:", error);
            toast.error("Failed to sync local draft.");
            return;
          }

          setPipelineId(data.id);
          navigate(`/pipeline/${data.id}`);
          console.log(
            "[Bootstrap] New pipeline created from local draft:",
            data.id
          );
        } else {
          const { error } = await supabase
            .from("pipelines")
            .update({ data: { nodes: savedNodes, edges: savedEdges } })
            .eq("id", pipelineId);

          if (error) {
            console.error("[Bootstrap] Failed to update pipeline:", error);
            toast.error("Failed to sync local draft.");
            return;
          }

          console.log(
            "[Bootstrap] Local draft merged to existing pipeline:",
            pipelineId
          );
        }

        sessionStorage.removeItem("pipeline_draft");
      };

      syncToSupabase();
    } catch (err) {
      console.error("[Bootstrap] Error parsing local draft:", err);
    }
  }, [
    user,
    pipelineId,
    setNodes,
    setEdges,
    setPipelineId,
    pipelineName,
    navigate,
    shareToken,
  ]);
}
