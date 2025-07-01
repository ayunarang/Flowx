import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useAuth from "../hooks/useAuth";
import AuthModal from "./AuthModal";
import { PipelineUI } from "./PipelineUI";
import { PipelineToolbar } from "../components/Toolbar";
import { HeaderBar } from "../components/HeaderBar";
import { useStore } from "../store";

export default function SharePage() {
  const { token } = useParams();
  const { user } = useAuth();
  const setNodesAndEdges = useStore((state) => state.setNodesAndEdges);

  const [shareRow, setShareRow] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const setCanEdit = useStore((state) => state.setCanEdit);


  useEffect(() => {
    if (!token) return;

    const loadShare = async () => {
      const { data, error } = await supabase
        .from("pipeline_shared")
        .select("*, pipelines(*)")
        .eq("share_token", token)
        .single();

      if (error || !data) {
        alert("Invalid or expired link");
        return;
      }

      setShareRow(data);

      if (data.pipelines?.data) {
        const { nodes, edges } = data.pipelines.data;
        setNodesAndEdges(nodes || [], edges || []);
      }

      if (
        user &&
        data.user_id === null &&
        data.recipient_email &&
        user.email &&
        data.recipient_email === user.email
      ) {
        await supabase
          .from("pipeline_shared")
          .update({ user_id: user.id })
          .eq("id", data.id);
      }

      if (data.access === "edit") {
        setCanEdit(!!user); 
      } else {
        setCanEdit(false);
      }
    };

    loadShare();
  }, [token, user, setNodesAndEdges]);

  const handleEditClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
  };

  if (!shareRow) {
    return <div>Loading shared pipeline...</div>;
  }

  const canRenderToolbar = shareRow.access === "edit";

  return (
    <div className="relative h-screen w-screen">
      <HeaderBar />
      <PipelineUI/>

      {canRenderToolbar && (
        <div className="absolute top-0 left-0 z-10">
          <PipelineToolbar onEditClick={handleEditClick} />
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
