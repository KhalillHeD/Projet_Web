import React, { useState } from 'react';
import { Mail, Lock, User, Building2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { registerUser } from "../services/auth";

interface SignupProps {
  onNavigate: (path: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');                // username
  const [email, setEmail] = useState('');              // email
  const [password, setPassword] = useState('');        // password
  const [confirmPassword, setConfirmPassword] = useState(''); // confirm
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side checks
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const createdUser = await registerUser({
        username: name.trim(),
        email: email.trim(),
        password,
        password2: confirmPassword,
      });

      // Expect at least username/email back
      if (!createdUser || !createdUser.username) {
        setError("Registration failed on server.");
        return;
      }

      // Success → go to businesses
      onNavigate("/businesses");

    } catch (err: any) {
      console.error("Registration error:", err);

      // DRF typical field errors
      if (err?.email) {
        const msg = Array.isArray(err.email) ? err.email[0] : String(err.email);
        setError(msg);
      } else if (err?.username) {
        const msg = Array.isArray(err.username) ? err.username[0] : String(err.username);
        setError(msg);
      } else if (err?.non_field_errors) {
        const msg = Array.isArray(err.non_field_errors)
          ? err.non_field_errors[0]
          : String(err.non_field_errors);
        setError(msg);
      } else if (err?.detail) {
        setError(String(err.detail));
      } else if (err && typeof err === "object") {
        // Generic: show first field error (password, password2, etc.)
        const keys = Object.keys(err);
        if (keys.length > 0) {
          const key = keys[0];
          const value = (err as any)[key];
          const msg = Array.isArray(value) ? value[0] : String(value);
          setError(msg);
        } else {
          setError("Registration failed. Please check your input.");
        }
      } else {
        setError("Registration failed. Try another email or username.");
      }
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Create Account</h1>
          <p style={{ color: 'var(--muted)' }}>Start managing your business today</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-center text-sm" style={{ color: 'var(--error)' }}>{error}</p>
            )}

            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={20} />}
              required
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-gray-300"
                  style={{ accentColor: 'var(--secondary)' }}
                  required
                />
                <span>
                  I agree to the{" "}
                  <button type="button" className="hover:underline" style={{ color: 'var(--secondary)' }}>
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="hover:underline" style={{ color: 'var(--secondary)' }}>
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("/login")}
              className="font-medium hover:underline"
            >
              <span style={{ color: 'var(--secondary)' }}>Sign in</span>
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