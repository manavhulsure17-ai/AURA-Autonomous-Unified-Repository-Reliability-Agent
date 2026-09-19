import React, { useState, useRef, useEffect } from 'react';
import { AuthUser } from '../types';
import { loginUser, registerUser, DEFAULT_USERS } from '../utils/authStorage';
import { useTheme } from '../context/ThemeContext';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState<string>('');
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // References for the 4 PIN input boxes
  const pinInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const fullPin = pinDigits.join('');

  // Clear messages on mode switch
  const switchMode = (newMode: 'signin' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPinDigits(['', '', '', '']);
    setTimeout(() => {
      pinInputRefs[0].current?.focus();
    }, 50);
  };

  // Handle digit typing in 4-box PIN
  const handlePinChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const nextDigits = [...pinDigits];
      nextDigits[index] = '';
      setPinDigits(nextDigits);
      setErrorMessage(null);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 4).split('');
      const nextDigits = ['', '', '', ''];
      pasted.forEach((char, i) => {
        if (i < 4) nextDigits[i] = char;
      });
      setPinDigits(nextDigits);
      setErrorMessage(null);
      const nextFocus = Math.min(pasted.length, 3);
      pinInputRefs[nextFocus].current?.focus();
      return;
    }

    const nextDigits = [...pinDigits];
    nextDigits[index] = cleanVal[cleanVal.length - 1]; // take last typed digit
    setPinDigits(nextDigits);
    setErrorMessage(null);

    // Auto-advance to next box
    if (index < 3) {
      pinInputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!pinDigits[index] && index > 0) {
        // focus previous and clear it
        pinInputRefs[index - 1].current?.focus();
        const nextDigits = [...pinDigits];
        nextDigits[index - 1] = '';
        setPinDigits(nextDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      pinInputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      pinInputRefs[index + 1].current?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleQuickFill = (demoEmail: string, demoPin: string) => {
    setEmail(demoEmail);
    setPinDigits(demoPin.split(''));
    setMode('signin');
    setErrorMessage(null);
    setSuccessMessage('Credentials loaded. Press Sign In to continue.');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (fullPin.length !== 4) {
      setErrorMessage('Please enter a 4-digit PIN.');
      pinInputRefs[Math.min(fullPin.length, 3)].current?.focus();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'signin') {
        const result = loginUser(email, fullPin);
        if (result.success && result.user) {
          setSuccessMessage(`Welcome back, ${result.user.name || result.user.email}!`);
          setTimeout(() => {
            onLoginSuccess(result.user!);
          }, 450);
        } else {
          setErrorMessage(result.message);
          setIsLoading(false);
        }
      } else {
        const result = registerUser(email, fullPin);
        if (result.success && result.user) {
          setSuccessMessage('Registration successful! Redirecting to platform...');
          setTimeout(() => {
            onLoginSuccess(result.user!);
          }, 500);
        } else {
          setErrorMessage(result.message);
          setIsLoading(false);
        }
      }
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#080d18] text-[#dde2f3] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Delicate background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-[#00f0ff]/10 via-[#7c4dff]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#00f0ff]/5 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Delicate Card Container */}
      <div className="w-full max-w-md bg-[#101726]/90 backdrop-blur-xl border border-[#232d3f] rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        {/* Top-right theme toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#1a202c] text-[#849495] hover:text-[#00f0ff] border border-transparent hover:border-[#3b494b]/30 transition-all cursor-pointer flex items-center justify-center"
          title={resolvedTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-[18px]">
            {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Delicate Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1c2738] to-[#0c1322] border border-[#00f0ff]/30 flex items-center justify-center mb-3 shadow-[0_0_16px_rgba(0,240,255,0.15)]">
            <span className="material-symbols-outlined text-[#00f0ff] text-2xl">
              shield_lock
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-[#f0f4fc] tracking-tight flex items-center gap-1.5">
            <span>AURA</span>
            <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
              Access Gate
            </span>
          </h1>

          <p className="text-xs text-[#9aa8be] mt-1 font-light">
            Simple, delicate authentication with Email and 4-digit PIN
          </p>
        </div>

        {/* Minimalist Tab Toggle: Sign In vs Register */}
        <div className="grid grid-cols-2 p-1 bg-[#090d16] border border-[#1e2736] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#1b2434] text-[#00f0ff] shadow-sm border border-[#00f0ff]/20 font-semibold'
                : 'text-[#8494a5] hover:text-[#dde2f3]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-[#1b2434] text-[#00f0ff] shadow-sm border border-[#00f0ff]/20 font-semibold'
                : 'text-[#8494a5] hover:text-[#dde2f3]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>New User Register</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-[#3b1219]/80 border border-[#ff6b81]/40 text-[#ffb4ab] text-xs flex items-start gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-sm text-[#ff6b81] shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1 leading-relaxed">
              {errorMessage}
              {mode === 'signin' && errorMessage.includes('Switch to "Register"') && (
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="block mt-1 text-[#00f0ff] font-medium underline underline-offset-2 hover:text-[#7ef7ff]"
                >
                  Click here to register with {email || 'this email'}
                </button>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-[#0e2c22]/80 border border-[#65f2b5]/40 text-[#65f2b5] text-xs flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-sm text-[#65f2b5]">
              check_circle
            </span>
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input Field */}
          <div>
            <label className="block text-xs font-medium text-[#b0bdcf] mb-1.5 flex items-center justify-between">
              <span>Email ID</span>
              <span className="text-[10px] text-[#6b7b92] font-mono">Required</span>
            </label>

            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#6b7b92]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="name@company.com"
                className="w-full bg-[#0b101c] border border-[#222d3e] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#dde2f3] placeholder-[#4e5d73] focus:outline-none focus:border-[#00f0ff]/60 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all font-sans"
              />
            </div>
          </div>

          {/* 4-Digit PIN Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#b0bdcf] flex items-center gap-1">
                <span>4-Digit PIN</span>
                {mode === 'register' && (
                  <span className="text-[10px] text-[#00f0ff] font-mono">(Choose any 4 digits)</span>
                )}
              </label>

              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-[#8494a5] hover:text-[#00f0ff] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {showPin ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showPin ? 'Hide PIN' : 'Show PIN'}</span>
              </button>
            </div>

            {/* 4 Discrete Digit Boxes */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={pinInputRefs[index]}
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={1}
                  value={pinDigits[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  aria-label={`PIN Digit ${index + 1}`}
                  className={`h-12 sm:h-14 text-center text-lg sm:text-xl font-mono rounded-xl bg-[#0b101c] border transition-all focus:outline-none ${
                    pinDigits[index]
                      ? 'border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.15)] bg-[#0d1624]'
                      : 'border-[#222d3e] text-[#dde2f3] hover:border-[#324056]'
                  } focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/20`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6b7b92] mt-1.5 px-0.5">
              <span>{mode === 'signin' ? 'Enter your 4-digit code' : 'Set a memorable 4-digit security code'}</span>
              <span className="font-mono text-[10px] text-[#8494a5]">{fullPin.length}/4 entered</span>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading || !email.trim() || fullPin.length !== 4}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLoading || !email.trim() || fullPin.length !== 4
                ? 'bg-[#161f2e] text-[#556477] border border-[#212b3b] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00b4d8] to-[#00f0ff] text-[#00242c] hover:brightness-110 shadow-[0_0_16px_rgba(0,240,255,0.3)] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#00242c] border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Sign In & Proceed</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>Register & Proceed</span>
              </>
            )}
          </button>
        </form>

        {/* Delicate divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-[#1f2838] flex-1"></div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#637287]">
            Quick Access Demo
          </span>
          <div className="h-px bg-[#1f2838] flex-1"></div>
        </div>

        {/* Quick Demo Pre-seeded accounts */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-[#8494a5] mb-1 text-center">
            Click to autofill pre-configured test credentials:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEFAULT_USERS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => handleQuickFill(demo.email, demo.pin)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b111c] hover:bg-[#151e2d] border border-[#1e2738] hover:border-[#00f0ff]/30 text-left transition-all flex flex-col group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#dde2f3] group-hover:text-[#00f0ff] truncate max-w-[130px]">
                    {demo.email}
                  </span>
                  <span className="text-[9px] font-mono px-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
                    PIN: {demo.pin}
                  </span>
                </div>
                <span className="text-[9px] text-[#6b7b92] font-mono">
                  {demo.role || 'Operator'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Direct guest pass */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              const guestUser: AuthUser = {
                email: 'guest@aura.internal',
                name: 'Guest Engineer',
                pin: '0000',
                role: 'Observer',
                registeredAt: new Date().toISOString(),
              };
              onLoginSuccess(guestUser);
            }}
            className="text-[11px] text-[#6e7f95] hover:text-[#00f0ff] transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Or explore platform in Guest Mode</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Footer subtle brand notes */}
      <div className="mt-6 text-center text-[11px] text-[#556477] font-mono flex items-center gap-2">
        <span>AURA Security Core</span>
        <span>•</span>
        <span>AES-256 Memory Bound Session</span>
        <span>•</span>
        <span>Local Persistence</span>
      </div>
    </div>
  );
};
