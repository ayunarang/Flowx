import { useEffect, useRef } from "react";
import { useStore } from "../store";
import { useSavePipeline } from "./useSavePipeline";

export function useAutoSavePipeline({
  nodes,
  edges,
  user,
  pipelineId,
  delay,
  shareToken,
}) {
  const { savePipeline } = useSavePipeline();
  const timeoutRef = useRef(null);
  const setAutoSaved = useStore((state) => state.setAutoSaved);

  useEffect(() => {
    if (!user) return;
    if (shareToken) {
      console.log("[AutoSave] Skipping autosave: shared mode active.");
      return;
    }

    const shouldAutoSave = nodes.length > 0 || edges.length > 0;
    if (!shouldAutoSave) return;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      savePipeline(user, { showToast: false });

      setAutoSaved(true);

      setTimeout(() => {
        setAutoSaved(false);
      }, 3000);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [
    JSON.stringify(nodes),
    JSON.stringify(edges),
    user,
    pipelineId,
    delay,
    shareToken,
  ]);
}
