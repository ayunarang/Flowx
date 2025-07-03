import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useStore } from '../store';
import { CheckIcon, CopyIcon } from 'lucide-react'

export default function ShareModal() {
  const pipelineId = useStore((state) => state.currentPipelineId);
  const nodes = useStore((state) => state.nodes);
  const [email, setEmail] = useState('');
  const [access, setAccess] = useState('view');
  const [link, setLink] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const setShareModalOpen = useStore((state) => state.setShareModalOpen);
  const isShareModalOpen = useStore((state) => state.isShareModalOpen);



  if (!isShareModalOpen || nodes.length === 0) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    setShareModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title">
      <div className="bg-white rounded-xl sm:rounded-lg sm:p-6 p-4 md:w-80 w-72">
        <h2 id="auth-modal-title" className="text-lg font-bold mb-4">
          Share Pipeline
        </h2>

        <p className="text-sm mb-4 text-canvas-ink">
          <strong>Note:</strong> Anyone with the link can <em>always view</em> your pipeline.
          The recipient below will have the specified access level.
        </p>

        <input
          type="email"
          placeholder="Recipient's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-400 px-3 py-2 rounded md:text-base text-sm mb-5"
          disabled={isLocked}
        />

        <div className='flex gap-2 w-full mb-5'>
          {['view', 'edit'].map((option) => {
            const isActive = access === option;
            return (
              <button
                key={option}
                onClick={() => !isLocked && setAccess(option)}
                disabled={isLocked}
                className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border w-full
              transition-colors duration-200 
              ${isActive
                    ? 'border-canvaPurple text-canvaPurple bg-white'
                    : 'border-gray-200 text-gray-500 bg-white'
                  }
              ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
            `}
              >
                <span className="text-sm font-medium text-center w-full">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>

              </button>)
          })}
        </div>

        <button
          onClick={handleShare}
          className={`w-full text-white px-3 py-2 rounded font-medium ${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-canvaPurple active:bg-canvaPurple-active text-white'}`}
          disabled={isLocked}
        >
          {isLocked ? "Link Generated" : "Generate Link"}
        </button>

        {link && (
          <div className="mt-2">
            <input
              type="text"
              readOnly
              value={link}
              className="border px-3 py-2 mb-2 w-full text-sm sm:text-base"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-canvaPurple flex items-center justify-center align-middle gap-3 text-white rounded w-full"
            >
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              {copied ? (
                <CheckIcon height={16} width={16} />
              ) : (
                <CopyIcon height={16} width={16} />
              )}
            </button>
          </div>
        )}

        <button
          onClick={closeModal}
          className="mt-1.5 px-4 py-2 active:bg-gray-300 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
