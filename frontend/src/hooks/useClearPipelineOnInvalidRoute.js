import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "../store";

export function useClearPipelineOnInvalidRoute() {
  const location = useLocation();
  const setNodes = useStore((s) => s.setNodes);
  const setEdges = useStore((s) => s.setEdges);
  const setPipelineId = useStore((s) => s.setPipelineId);

  useEffect(() => {
    const isSharedView = location.pathname.startsWith("/share/");
    const isPipelineView = location.pathname.startsWith("/pipeline/");
    const localStoredDraft = localStorage.getItem("pipeline_draft");

    if (!isSharedView && !isPipelineView) {
      if (localStoredDraft) {
        console.log(
          "[PipelineCleanup] Detected local draft → Keeping local pipeline data."
        );
      } else {
        console.log(
          "[PipelineCleanup] Clearing pipeline data: not shared/owned view and no local draft."
        );
        setNodes([]);
        setEdges([]);
        setPipelineId(null);
      }
    }
  }, [location.pathname, setNodes, setEdges, setPipelineId]);
}
