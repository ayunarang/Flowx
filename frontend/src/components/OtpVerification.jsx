import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";

export default function OtpVerification({
  email,
  onSuccess,
  setMessage,
  cooldown,
  setCooldown,
}) {
  const numInputs = 6;
  const [otp, setOtp] = useState(new Array(numInputs).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < numInputs - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^[0-9]+$/.test(paste)) return;

    const pasteDigits = paste.slice(0, numInputs).split("");
    const newOtp = [...otp];
    for (let i = 0; i < numInputs; i++) {
      newOtp[i] = pasteDigits[i] || "";
    }
    setOtp(newOtp);

    const nextIndex =
      pasteDigits.length < numInputs ? pasteDigits.length : numInputs - 1;
    inputsRef.current[nextIndex].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = otp.join("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      console.error("Supabase OTP verify error:", error);
      setMessage(error.message);
    } else {
      setMessage("You are now signed in!");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      console.error("Supabase resend OTP error:", error);
      setMessage(error.message);
    } else {
      setMessage("A new OTP has been sent to your email.");
      setCooldown(60); 
    }

    setLoading(false);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="flex justify-between space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="md:w-10 w-8 md:h-12 h-10 border border-gray-400 rounded-md text-center text-xl focus:outline-none"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-canvaPurple hover:bg-canvaPurple-hover active:bg-canvaPurple-active text-white px-3 py-2 rounded font-medium"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p className="text-xs text-gray-600 text-center">
          Didn’t receive code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={cooldown > 0 || loading}
            className="text-canvaPurple font-semibold disabled:text-canvas-charcoal"
          >
            Resend OTP
          </button>{" "}
          {cooldown > 0 && <span>({cooldown}s)</span>}
        </p>
      </form>
    </div>
  );
}
