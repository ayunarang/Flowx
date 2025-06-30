import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useStore } from '../store';

export default function ShareModal({ isOpen, onClose }) {
    const pipelineId = useStore((state) => state.currentPipelineId);

    const [email, setEmail] = useState('');
    const [access, setAccess] = useState('view');
    const [link, setLink] = useState('');

    if (!isOpen) return null;

    console.log(pipelineId)



    const handleShare = async () => {
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        const share_token = crypto.randomUUID();

        if (user) {
            await supabase.from("pipeline_shared").insert({
                pipeline_id: pipelineId,
                user_id: user.id,
                access,
                share_token
            });
        } else {
            await supabase.from("pipeline_shared").insert({
                pipeline_id: pipelineId,
                recipient_email: email,
                access,
                share_token
            });
        }

        const shareLink = `${window.location.origin}/share/${share_token}`;
        setLink(shareLink);
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl mb-4">Share Pipeline</h2>

                <input
                    type="email"
                    placeholder="Recipient's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-3 py-2 mb-2 w-full"
                />

                <select
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                    className="border px-3 py-2 mb-4 w-full"
                >
                    <option value="view">View</option>
                    <option value="edit">Edit</option>
                </select>

                <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Generate Link
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
                            className="px-4 py-2 bg-gray-700 text-white rounded"
                        >
                            Copy Link
                        </button>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-300 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
