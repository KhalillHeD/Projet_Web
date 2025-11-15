import React, { useState } from 'react';
import { Mail, Lock, User, Building2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

interface SignupProps {
  onNavigate: (path: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/businesses');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#1A6AFF]/10 via-[#3E8BFF]/5 to-transparent">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-xl flex items-center justify-center">
              <Building2 size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-[#0B1A33]">BizManager</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0B1A33] mb-2">Create Account</h1>
          <p className="text-gray-600">Start managing your business today</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="text-sm text-gray-600">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#1A6AFF] focus:ring-[#1A6AFF]" required />
                <span>
                  I agree to the{' '}
                  <button type="button" className="text-[#1A6AFF] hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-[#1A6AFF] hover:underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => onNavigate('/login')} className="text-[#1A6AFF] font-medium hover:underline">
              Sign in
            </button>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <button onClick={() => onNavigate('/')} className="text-gray-600 hover:text-[#1A6AFF] transition-colors">
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};
