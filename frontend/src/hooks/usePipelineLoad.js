import { useEffect } from "react";
import { useStore } from "../store";
import { supabase } from "../supabaseClient";
import useAuth from "./useAuth";

export default function usePipelineLoad({ pipelineId, shareToken }) {
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const setPipelineId = useStore((state) => state.setPipelineId);
  const setCanEdit = useStore((state) => state.setCanEdit);

  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (shareToken) {
        const { data, error } = await supabase
          .from("pipeline_shared")
          .select("*, pipelines(*)")
          .eq("share_token", shareToken)
          .single();

        if (error || !data) {
          console.error("Invalid share link:", error);
          setCanEdit(false);
          return;
        }

        const { pipelines, access, user_id, recipient_email } = data;

        setNodes(pipelines.data?.nodes || []);
        setEdges(pipelines.data?.edges || []);
        setPipelineId(pipelines.id);

        if (
          user &&
          !user_id &&
          recipient_email &&
          user.email === recipient_email
        ) {
          await supabase
            .from("pipeline_shared")
            .update({ user_id: user.id })
            .eq("id", data.id);
        }

        const canEdit =
          access === "edit" &&
          user &&
          (user.id === user_id || user.email === recipient_email);
        setCanEdit(canEdit);

        console.log(
          "Shared pipeline loaded:",
          pipelines.id,
          "Editable:",
          canEdit
        );
      } else if (pipelineId) {
        const { data, error } = await supabase
          .from("pipelines")
          .select("id, data, owner_id")
          .eq("id", pipelineId)
          .single();

        if (error || !data) {
          console.error("Failed to load pipeline:", error);
          setCanEdit(false);
          return;
        }

        setNodes(data.data?.nodes || []);
        setEdges(data.data?.edges || []);
        setPipelineId(data.id);

        if (!user) {
          console.warn("User not signed in: owner check deferred.");
          setCanEdit(false);
        } else {
          const isOwner = user.id === data.owner_id;
          setCanEdit(isOwner);
          console.log("Owned pipeline loaded:", data.id, "Editable:", isOwner);
        }
      } else {
        setCanEdit(true);
      }
    };

    load();
  }, [pipelineId, shareToken, user]);
}
