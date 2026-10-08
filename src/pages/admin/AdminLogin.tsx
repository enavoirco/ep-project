import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { BrandLogo } from '../../components/common/BrandLogo.tsx';

interface AdminLoginProps {
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <BrandLogo variant="full" theme="light" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
            Admin CRM Authentication
          </h1>
          <p className="text-xs text-[#747474]">
            Secure Outdoor Operations & Lead Management System &bull; Kalaburagi
          </p>
        </div>

        {/* Login form card */}
        <div className="p-8 rounded-sm bg-white border border-[#E3E3E0] shadow-sm space-y-6">
          {error && (
            <div className="p-3 rounded-xs bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474]">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#747474] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  placeholder="admin@bhagyalaxmi.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#747474] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to CRM Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#747474]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Role-Based Access Control & Bull; JWT Encrypted</span>
        </div>
      </div>
    </div>
  );
};
