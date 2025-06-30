import { useState } from 'react';
import ShareModal from '../layouts/ShareModal'; 

export default function ShareButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
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
