// src/pages/Profile.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { User as UserIcon, Mail, Lock } from "lucide-react";

interface ProfileProps {
  onNavigate: (path: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    onNavigate("/login");
    return null;
  }

  // Optional: if later you add user.avatar, you can show it here
  const initial = user.username?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md">
        <Card className="p-6">
          {/* Profile picture + name */}
          <div className="flex items-center gap-4 mb-6">
            {/* Profile image: replace this block with an <img> when you have user.avatar */}
            <div className="w-16 h-16 rounded-full bg-secondary-10 flex items-center justify-center">
              {/* If you have an avatar URL on user, use: 
                  <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> */}
              <span className="text-xl font-bold" style={{ color: 'var(--secondary)' }}>
                {initial}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {user.username}
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Your BizManager account</p>
            </div>
          </div>

          {/* Basic info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Email</p>
                <p className="text-sm" style={{ color: 'var(--text)' }}>
                  {user.email || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("/businesses")}
            >
              Back to dashboard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate("/forgot-password")}
              className="flex items-center gap-2"
            >
              <Lock size={16} />
              Reset password
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
