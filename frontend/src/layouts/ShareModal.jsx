import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useStore } from '../store';

export default function ShareModal({ isOpen, onClose }) {
  const pipelineId = useStore((state) => state.currentPipelineId);

  const [email, setEmail] = useState('');
  const [access, setAccess] = useState('view');
  const [link, setLink] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!pipelineId) {
      alert("No pipeline ID found. Please save your pipeline first.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter a valid recipient email.");
      return;
    }

    if (!["view", "edit"].includes(access)) {
      alert("Invalid access level.");
      return;
    }

    const share_token = crypto.randomUUID();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.trim())
      .maybeSingle();

    const { error: insertError } = await supabase.from("pipeline_shared").insert({
      pipeline_id: pipelineId,
      user_id: user?.id || null,
      recipient_email: user ? null : email.trim(),
      access,
      share_token,
    });

    if (insertError) {
      console.error("Failed to insert pipeline share:", insertError);
      alert("Failed to share pipeline.");
      return;
    }

    const shareLink = `${window.location.origin}/share/${share_token}`;
    setLink(shareLink);
    setIsLocked(true);
  };

  const closeModal = () => {
    setEmail('');
    setAccess('view');
    setLink('');
    setIsLocked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl mb-4">Share Pipeline</h2>

        <p className="text-sm mb-4 text-gray-600">
          <strong>Note:</strong> Anyone with the link can <em>always view</em> your pipeline.
          The recipient below will have the specified access level.
        </p>

        <input
          type="email"
          placeholder="Recipient's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 mb-2 w-full"
          disabled={isLocked}
        />

        <select
          value={access}
          onChange={(e) => setAccess(e.target.value)}
          className="border px-3 py-2 mb-4 w-full"
          disabled={isLocked}
        >
          <option value="view">View Only</option>
          <option value="edit">Edit</option>
        </select>

        <button
          onClick={handleShare}
          className={`px-4 py-2 rounded w-full ${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'}`}
          disabled={isLocked}
        >
          {isLocked ? "Link Generated" : "Generate Link"}
        </button>

        {link && (
          <div className="mt-4">
            <input
              type="text"
              readOnly
              value={link}
              className="border px-3 py-2 mb-2 w-full"
            />
            <button
              onClick={() => navigator.clipboard.writeText(link)}
              className="px-4 py-2 bg-gray-700 text-white rounded w-full"
            >
              Copy Link
            </button>
          </div>
        )}

        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-gray-300 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
