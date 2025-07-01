import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href,
      },
    });

    if (error) {
      console.error("Supabase sign-in error:", error);
      setMessage(error.message);
    } else {
      setMessage("Check your email for your magic link!");
    }

    setLoading(false);

    setTimeout(() => {
      setEmail("");
      setMessage("");
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-xl sm:rounded-lg md:p-6 p-3 md:w-80 w-60">
        <h2 id="auth-modal-title" className="text-lg font-bold mb-4">
          Sign In
        </h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-400 px-3 py-2 rounded md:text-base text-sm"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-canvaPurple hover:bg-canvaPurple-hover active:bg-canvaPurple-active text-white px-3 py-2 rounded font-medium"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>
        {message && (
          <p className="mt-3 text-sm text-green-700">{message}</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-800 bg-gray-100 md:px-3 md:py-2 px-2 py-1 rounded-lg active:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
