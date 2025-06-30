import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for your magic link!');
    }
    setLoading(false);

    setTimeout(() => {
      setEmail('');
      setMessage('');
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-3 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
