import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import OtpVerification from "../components/OtpVerification";
import { toast } from "sonner";
import { useStore } from "../store";
import useAuth from "../hooks/useAuth";

export default function AuthModal() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const isAuthModalOpen = useStore((state) => state.isAuthModalOpen);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setAuthModalOpen(false);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isAuthModalOpen) return null;


  const handleSendOtp = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      console.error("Supabase sign-in error:", error);
      setMessage(error.message);
      toast.error(error.message);
    } else {
      setMessage("Check your email for your OTP code and enter it below.");
      setShowOtpInput(true);
      toast.success("OTP sent! Please check your email.");
      setCooldown(60);
    }

    setLoading(false);
  };

  const handleOtpSuccess = () => {
    setEmail("");
    setShowOtpInput(false);
    setMessage("");
    setAuthModalOpen(false);
  };

  const handleModalClose = () => {
    setEmail("");
    setShowOtpInput(false);
    setMessage("");
    setAuthModalOpen(false);
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-xl sm:rounded-lg sm:p-6 p-4 md:w-80 w-72">
        <h2 id="auth-modal-title" className="text-lg font-bold mb-4">
          Sign In
        </h2>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-400 px-3 py-2 rounded md:text-base text-sm"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={showOtpInput}
          />
          {!showOtpInput && (
            <button
              type="submit"
              className="w-full bg-canvaPurple hover:bg-canvaPurple-hover active:bg-canvaPurple-active text-white px-3 py-2 rounded font-medium"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}
        </form>

        {message && (
          <p className="mt-3 text-xs px-2 py-1 bg-canvas-sky text-canvas-ink">
            {message}
          </p>
        )}

        {showOtpInput && (
          <OtpVerification
            email={email}
            onSuccess={handleOtpSuccess}
            setMessage={setMessage}
            cooldown={cooldown}
            setCooldown={setCooldown}
          />
        )}

        <button
          onClick={handleModalClose}
          className="mt-4 text-sm text-gray-800 bg-gray-100 md:px-3 md:py-2 px-2 py-1 rounded-lg active:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
