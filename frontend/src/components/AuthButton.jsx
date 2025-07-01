import { supabase } from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import AuthModal from '../layouts/AuthModal';
import { useStore } from '../store';

export default function AuthButton() {
  const { user } = useAuth();
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const isAuthModalOpen = useStore((state) => state.isAuthModalOpen);
  const setPipelineId = useStore((state) => state.setPipelineId);
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const setCanEdit = useStore((state) => state.setCanEdit);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setPipelineId(null);
    setNodes([]);
    setEdges([]);
    setCanEdit(true);
    window.location.href = '/';
  };

  return (
    <>
      {user ? (
        <button
          onClick={handleSignOut}
          className="
            bg-gray-700 text-white rounded
          text-[10px] sm:text-sm
          font-medium
          px-2 py-1 sm:px-2 sm:py-1          "
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => setAuthModalOpen(true)}
          className="
            bg-blue-600 text-white rounded
            sm:text-sm text-[10px]
          font-medium
          px-2 py-1 sm:px-2 sm:py-1          "
        >
          Sign In
        </button>
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

