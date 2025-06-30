import { useEffect } from "react";

export function useLocalDraftAutosave({ nodes, edges, user , delay}) {
  useEffect(() => {
    if (user) return;

    if (!nodes && !edges) return;

    const handler = setTimeout(() => {
      localStorage.setItem("pipeline_draft", JSON.stringify({ nodes, edges }));
      console.log("[Autosave] Draft saved to localStorage ");
    }, delay);

    return () => clearTimeout(handler);
  }, [nodes, edges, user, delay]);
}
