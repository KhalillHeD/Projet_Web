import React, { useState } from "react";
import { Mail, Building2 } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";

interface ForgotPasswordProps {
  onNavigate: (path: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    try {
        const res = await fetch("http://localhost:8000/api/auth/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        });

        if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Something went wrong. Please try again.");
        } else {
        setStatus("If an account exists with that email, a reset link has been sent.");
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Forgot password</h1>
          <p style={{ color: 'var(--muted)' }}>
            Enter your email and a reset link will be sent to you.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-center" style={{ color: 'var(--error)' }}>{error}</p>
            )}
            {status && (
              <p className="text-sm text-center" style={{ color: 'var(--success)' }}>{status}</p>
            )}

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
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

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate("/")}
            className="text-gray-600 transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            <span style={{ color: 'var(--secondary)' }}>Back to home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
