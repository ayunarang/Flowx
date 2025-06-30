import { useState } from 'react';
import ShareModal from '../layouts/ShareModal';
import useAuth from '../hooks/useAuth';
import { useStore } from '../store';
import { useSavePipeline } from '../hooks/useSavePipeline';

export default function ShareButton() {
  const [showModal, setShowModal] = useState(false);
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const { user } = useAuth();
  const { savePipeline } = useSavePipeline();

  const handleShare = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    await savePipeline(user);

    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Share
      </button>

      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
