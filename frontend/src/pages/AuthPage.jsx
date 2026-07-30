import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LexisLogo } from '../components/icons';

const AuthPage = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Email format validation
  const validateEmail = (val) => {
    if (!val) {
      setEmailError('Email is required');
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password length validation
  const validatePassword = (val) => {
    if (!val) {
      setPasswordError('Password is required');
      return false;
    }
    if (val.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Password confirmation validation
  const validateConfirmPassword = (val) => {
    if (!isLogin && val !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Run validation on inputs change
  useEffect(() => {
    if (email) validateEmail(email);
  }, [email]);

  useEffect(() => {
    if (password) validatePassword(password);
    if (confirmPassword) validateConfirmPassword(confirmPassword);
  }, [password, confirmPassword, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Final checks
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = isLogin || validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      const message = typeof detail === 'string' 
        ? detail 
        : detail?.error?.message || 'An unexpected authentication error occurred.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormInvalid = 
    !email || 
    !password || 
    !!emailError || 
    !!passwordError || 
    (!isLogin && (!confirmPassword || !!confirmPasswordError)) ||
    isSubmitting;

  return (
    <div className="auth-page">
      {/* LEFT PANE — Dark Hero Editorial Brand (50%) */}
      <div className="auth-brand-pane bg-[#0a0b0d] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Dark Gradient Plate */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0052ff]/10 via-transparent to-black pointer-events-none" />

        {/* Top Brand Tag */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0052ff] flex items-center justify-center text-white shadow-lg">
            <LexisLogo size={20} />
          </div>
          <span className="font-sans text-xl tracking-tight font-medium text-white">Cv-Insight</span>
        </div>

        {/* Floating Product UI Mockup Card (Coinbase Dark Elevated Pattern) */}
        <div className="relative z-10 my-auto py-8">
          <h1 className="font-sans text-4xl lg:text-5xl font-normal tracking-[#-1.5px] leading-tight text-white mb-6">
            Quietly confident document intelligence.
          </h1>
          
          <div className="bg-[#16181c] border border-white/10 rounded-[24px] p-6 lg:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#05b169]" />
                <span className="font-mono text-xs text-white/70 uppercase tracking-widest">RAG Engine Online</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#0052ff]/20 text-[#0052ff] border border-[#0052ff]/30">Gemini 1.5 Pro</span>
            </div>
            
            <p className="text-sm text-[#a8acb3] leading-relaxed mb-4">
              "Extract citations, search dense legal indexes, and synthesize answer passages with sub-second latency."
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">SOC 2 TYPE II</span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">AES-256</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#7c828a]">
          <span>© 2026 Cv-Insight Systems Inc.</span>
          <span className="font-mono">v2.4.0 • Institutional</span>
        </div>
      </div>

      {/* RIGHT PANE — Form Panel (50%) */}
      <div className="auth-form-pane flex items-center justify-center p-6 md:p-12 bg-white dark:bg-[#0a0b0d]">
        <div className="auth-form-container w-full max-width-[420px] max-w-md flex flex-col gap-6">
          {/* Header Inside Form */}
          <div className="auth-form-header text-center flex flex-col items-center">
            <div className="px-4 py-1.5 rounded-full border border-[#dee1e6] dark:border-[#212327] bg-[#f7f7f7] dark:bg-[#16181c] inline-flex items-center gap-2 mb-4">
              <LexisLogo size={14} />
              <span className="font-mono text-xs tracking-wider text-[#0a0b0d] dark:text-white uppercase">CV-INSIGHT AUTH</span>
            </div>
            <h2 className="font-sans text-3xl font-normal tracking-tight text-[#0a0b0d] dark:text-white">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-[#5b616e] dark:text-[#a8acb3] mt-1">
              {isLogin ? 'Sign in to access your secure document workspace' : 'Get started with instant vector search and AI analysis'}
            </p>
          </div>

          {/* Info message banner */}
          {location.state?.message && !serverError && (
            <div className="p-4 rounded-xl bg-[#05b169]/10 border border-[#05b169]/30 text-[#05b169] text-sm flex items-center gap-3" role="status">
              <span>✅</span>
              <span>{location.state.message}</span>
            </div>
          )}

          {/* Toast Error Banner */}
          {serverError && (
            <div className="p-4 rounded-xl bg-[#cf202f]/10 border border-[#cf202f]/30 text-[#cf202f] text-sm flex items-center gap-3" role="alert">
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Form Controls */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-[#5b616e] dark:text-[#a8acb3]">EMAIL ADDRESS</label>
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 px-4 bg-white dark:bg-[#16181c] border ${emailError ? 'border-[#cf202f]' : 'border-[#dee1e6] dark:border-[#212327]'} rounded-[12px] text-sm text-[#0a0b0d] dark:text-white outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 transition-all`}
                required
              />
              {emailError && (
                <span className="text-xs text-[#cf202f] font-medium mt-0.5">
                  {emailError}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-[#5b616e] dark:text-[#a8acb3]">PASSWORD</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-12 pl-4 pr-16 bg-white dark:bg-[#16181c] border ${passwordError ? 'border-[#cf202f]' : 'border-[#dee1e6] dark:border-[#212327]'} rounded-[12px] text-sm text-[#0a0b0d] dark:text-white outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 transition-all`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 font-mono text-xs text-[#5b616e] hover:text-[#0a0b0d] dark:hover:text-white px-2 py-1 rounded-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              {passwordError && (
                <span className="text-xs text-[#cf202f] font-medium mt-0.5">
                  {passwordError}
                </span>
              )}
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="font-mono text-xs uppercase tracking-wider text-[#5b616e] dark:text-[#a8acb3]">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-12 px-4 bg-white dark:bg-[#16181c] border ${confirmPasswordError ? 'border-[#cf202f]' : 'border-[#dee1e6] dark:border-[#212327]'} rounded-[12px] text-sm text-[#0a0b0d] dark:text-white outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 transition-all`}
                  required
                />
                {confirmPasswordError && (
                  <span className="text-xs text-[#cf202f] font-medium mt-0.5">
                    {confirmPasswordError}
                  </span>
                )}
              </div>
            )}

            {/* Submit Button - Coinbase Pill */}
            <button
              type="submit"
              className="w-full h-12 bg-[#0052ff] hover:bg-[#003ecc] disabled:bg-[#a8b8cc] text-white rounded-full font-semibold text-base transition-all duration-150 flex items-center justify-center gap-2 mt-2 shadow-sm cursor-pointer disabled:cursor-not-allowed"
              disabled={isFormInvalid}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Section */}
          <div className="flex items-center justify-center gap-2 text-sm mt-2">
            <span className="text-[#5b616e] dark:text-[#a8acb3]">
              {isLogin ? "Don't have an account?" : 'Already registered?'}
            </span>
            <button
              type="button"
              className="text-[#0052ff] hover:underline font-medium"
              onClick={() => {
                setIsLogin(!isLogin);
                setServerError('');
                setEmailError('');
                setPasswordError('');
                setConfirmPasswordError('');
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
