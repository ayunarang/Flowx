import { useState } from 'react';
import { supabase } from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import AuthModal from '../layouts/AuthModal';

export default function AuthButton() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
          onClick={() => setShowModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Sign In
        </button>
      )}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
