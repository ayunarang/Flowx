import { useState } from 'react';
import ShareModal from '../layouts/ShareModal';
import useAuth from '../hooks/useAuth';
import { useStore } from '../store';
import { useSavePipeline } from '../hooks/useSavePipeline';
import {Share2Icon} from 'lucide-react'

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
        className="
          bg-green-600 text-white
          rounded
          text-[10px]  sm:text-sm
          font-medium
          px-2 py-1 sm:px-2 sm:py-1 flex items-center gap-1
        "
      >
         <span className="text-lg">
            <Share2Icon height={14} width={14} />
          </span>
          <span className="hidden md:block">Share</span>
      </button>

      <ShareModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

