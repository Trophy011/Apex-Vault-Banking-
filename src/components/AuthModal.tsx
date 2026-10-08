import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { bankStore, ADMIN_EMAIL, ADMIN_PASSWORD } from '../lib/bankStore.ts';
import { BankUser } from '../lib/types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: BankUser) => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check for Admin Login (managementofficails001@gmail.com / smart446688)
    // "Make the admin portal details isn't visible in the login page"
    // "make sure there's no 2 steps authentication for the admin while trying to login"
    if (mode === 'login' && cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      if (password === ADMIN_PASSWORD) {
        setLoading(true);
        try {
          let adminUser = bankStore.getUserByEmail(ADMIN_EMAIL);
          if (!adminUser) {
            adminUser = await bankStore.fetchUserByEmailAsync(ADMIN_EMAIL);
          }
          if (adminUser) {
            setLoading(false);
            onSuccess(adminUser);
            onClose();
          } else {
            const registeredAdmin = bankStore.registerUser(ADMIN_EMAIL, 'Apex Central Operator');
            bankStore.updateUserProfile(registeredAdmin.uid, { role: 'admin' });
            setLoading(false);
            onSuccess(registeredAdmin);
            onClose();
          }
        } catch {
          setLoading(false);
        }
        return;
      } else {
        setError('Invalid banking credentials or unauthorized operator access code.');
        return;
      }
    }

    if (mode === 'forgot_password') {
      if (!cleanEmail) {
        setError('Please enter your account email address.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setResetSuccess(true);
      }, 1000);
      return;
    }

    if (mode === 'register') {
      if (!displayName.trim()) {
        setError('Full legal name is required for regulatory KYC compliance.');
        return;
      }
      if (!cleanEmail || !password) {
        setError('Please provide a valid email and password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        // Create user with 0.00 balance ("make sure new users has 0 balance")
        const newUser = bankStore.registerUser(cleanEmail, displayName);
        setLoading(false);
        onSuccess(newUser);
        onClose();
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Failed to initialize account.');
      }
      return;
    }

    // Standard Customer Login across any device
    if (mode === 'login') {
      if (!cleanEmail || !password) {
        setError('Please enter your email and password.');
        return;
      }

      setLoading(true);
      try {
        let user = bankStore.getUserByEmail(cleanEmail);
        if (!user) {
          // Fetch from Firestore cloud to restore state from other devices
          user = await bankStore.fetchUserByEmailAsync(cleanEmail);
        }
        if (!user) {
          // If first time customer logging in with sample credentials, register with 0 balance
          user = bankStore.registerUser(cleanEmail, cleanEmail.split('@')[0]);
        }
        setLoading(false);
        onSuccess(user);
        onClose();
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Failed to retrieve account data.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const googleUser = result.user;
      const userEmail = googleUser.email?.toLowerCase() || '';

      // If logging in through Google, look up in cloud or local
      let user = bankStore.getUserByEmail(userEmail);
      if (!user) {
        user = await bankStore.fetchUserByEmailAsync(userEmail);
      }
      if (!user) {
        // New user has 0 balance
        user = bankStore.registerUser(
          userEmail,
          googleUser.displayName || 'Apex Client',
          googleUser.uid
        );
        if (userEmail === ADMIN_EMAIL.toLowerCase()) {
          bankStore.updateUserProfile(user.uid, { role: 'admin' });
        }
      }

      setLoading(false);
      onSuccess(user);
      onClose();
    } catch {
      setLoading(false);
      setError('Google Sign-In was cancelled or could not be completed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-5 sm:p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2.5 sm:mb-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-300" />
          </div>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-1.5">
            Demo &amp; Simulation Sandbox
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Apex Online Banking</h2>
          <p className="text-[11px] sm:text-xs text-blue-200 mt-0.5">Fintech Prototype &amp; Interactive Virtual Ledger Showcase</p>
        </div>

        {/* Tab switch for login / register */}
        {mode !== 'forgot_password' && (
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'text-blue-700 border-b-2 border-blue-700 bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'text-blue-700 border-b-2 border-blue-700 bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Open New Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'forgot_password' ? (
            <div>
              {resetSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Recovery Instructions Dispatched</h3>
                  <p className="text-sm text-slate-500 mt-2">
                    If an account matching <strong className="text-slate-800">{email}</strong> exists, a secure verification link has been sent to your inbox.
                  </p>
                  <button
                    onClick={() => {
                      setMode('login');
                      setResetSuccess(false);
                    }}
                    className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  >
                    Return to Banking Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center mb-5">
                    <h3 className="text-base font-bold text-slate-900">Reset Your Access Credentials</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your verified banking email to receive an official password recovery link.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? 'Dispatching Verification...' : 'Send Recovery Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-xs font-medium text-slate-500 hover:text-blue-700 cursor-pointer pt-2"
                  >
                    Back to Log In
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. Alexander Vance"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Banking Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="account@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Security Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot_password')}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                    >
                      Forgotten password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <span>Securing Session...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Authorize & Enter Bank' : 'Complete Account Opening'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">or sign in with</span>
                </div>
              </div>

              {/* Google Sign-in */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Secure Identity</span>
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  🔒 Simulated Fintech Demonstration • Strictly for testing &amp; portfolio showcase purposes. Never enter real banking or sensitive personal passwords.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
