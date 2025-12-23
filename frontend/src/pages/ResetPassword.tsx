import React, { useState, useEffect } from "react";
import { Lock, Building2 } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";

interface ResetPasswordProps {
  onNavigate: (path: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Read uid + token from query string: /reset-password?uid=...&token=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uidParam = params.get("uid") || "";
    const tokenParam = params.get("token") || "";

    setUid(uidParam);
    setToken(tokenParam);

    if (!uidParam || !tokenParam) {
      setError("Invalid or missing reset link.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!uid || !token) {
      setError("Invalid or missing reset link.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/password-reset/confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          token,
          new_password: password,
        }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setError(data.detail || "Could not reset password. The link may be expired.");
      } else {
        setStatus("Password has been reset successfully. You can now log in.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }}>
              <Building2 size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold" style={{ color: 'var(--text)' }}>BizManager</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Reset password</h1>
          <p style={{ color: 'var(--muted)' }}>
            Choose a new password for your account.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            {status && (
              <p className="text-sm text-green-600 text-center">{status}</p>
            )}

            <Input
              type="password"
              label="New password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <Input
              type="password"
              label="Confirm new password"
              placeholder="Repeat new password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Reset password"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <button
              onClick={() => onNavigate("/login")}
              className="font-medium hover:underline"
              style={{ color: 'var(--secondary)' }}
            >
              Back to login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
