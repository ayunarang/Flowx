import { supabase } from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import AuthModal from '../layouts/AuthModal';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function AuthButton() {
  const { user } = useAuth();
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const isAuthModalOpen = useStore((state) => state.isAuthModalOpen);
  const setPipelineId = useStore((state) => state.setPipelineId);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    setPipelineId(null);

    navigate('/');
  };

  return (
    <>
      {user ? (
        <button
          onClick={handleSignOut}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Sign In
        </button>
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
