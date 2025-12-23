import React, { useState } from "react";
import { Mail, Lock, Building2 } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  onNavigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // we'll use this as username
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // backend expects "username", so we send identifier as username
      await login(identifier, password);
      onNavigate("/businesses");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error");
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--muted)' }}>Sign in to manage your business</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-center" style={{ color: 'var(--error)' }}>{error}</p>
            )}

            <Input
              type="text"
              label="Username"
              placeholder="Your username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              icon={<Mail size={20} />}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: 'var(--secondary)' }}
                />
                <span style={{ color: 'var(--muted)' }}>Remember me</span>
              </label>
            <button
              type="button"
              className="hover:underline"
              onClick={() => onNavigate("/forgot-password")}
              style={{ color: 'var(--secondary)' }}
            >
              Forgot password?
            </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("/signup")}
              className="font-medium hover:underline"
            >
              <span style={{ color: 'var(--secondary)' }}>Sign up</span>
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
