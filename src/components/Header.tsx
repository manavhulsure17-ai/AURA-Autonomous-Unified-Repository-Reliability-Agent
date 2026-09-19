import React from 'react';
import { AuthUser } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  activeAgentsCount: number;
  healthPercent: number;
  selfHealingState: string;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onThemeToggled?: (theme: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  activeAgentsCount,
  healthPercent,
  selfHealingState,
  currentUser,
  onLogout,
  onThemeToggled,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [backendStatus, setBackendStatus] = React.useState<{ online: boolean; engine?: string }>({
    online: false,
  });

  React.useEffect(() => {
    fetch('/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.status === 'healthy') {
          setBackendStatus({ online: true, engine: data.engine || 'sqlite' });
        }
      })
      .catch(() => setBackendStatus({ online: false }));
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    if (onThemeToggled) {
      onThemeToggled(resolvedTheme === 'dark' ? 'light' : 'dark');
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#080e1a]/95 backdrop-blur-md z-50 flex items-center justify-between px-3 md:px-4 border-b border-[#3b494b]/30">
      {/* Left branding & target repository */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <img
            alt="AURA Neural Core Logo"
            className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WV8tp7FVpHnJGpoQBelzM_EgGqTNjU_3vwB21IOsm6gtOvVWH8xC9MkH-Vs3jRxB7_dE4GNI7IHUPQZLUML4bYYJ5-psgI66ZVMK3IWmf0Io0Lj2jR3qIbUVNSN1UYCtvvudHg9bICURXLosAd7tkHioABUshk5oDInhANvUmpenlgQ1IJwedn2dGMUxughfCexsDYOvofbWvGRDe1Eql94QXNOWi6HKpwKcSXucmjg9UH06Jos0vWqg"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base text-[#dbfcff] tracking-tight">AURA</span>
              <span className="px-1.5 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-mono uppercase tracking-wider">
                Autonomous Core
              </span>
            </div>
            <span className="hidden xl:inline-block text-[10px] font-mono text-[#b9cacb] truncate max-w-sm">
              Autonomous Unified Repository & Reliability Agent - Understand. Secure. Improve. Test. Heal.
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-[#3b494b]/40 hidden sm:block shrink-0"></div>

        {/* Repository selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#242a36] border border-[#3b494b]/40 shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-[#00dbe9]">source_environment</span>
          <span className="text-xs text-[#dde2f3] font-medium font-mono">demo-ecommerce-api</span>
          <span className="text-[10px] text-[#849495] font-mono">/</span>
          <span className="text-xs text-[#d0bcff] font-mono">main</span>
          <span className="material-symbols-outlined text-[16px] text-[#849495] cursor-pointer hover:text-[#dde2f3]">
            unfold_more
          </span>
        </div>
      </div>

      {/* Right operational telemetry & user profile */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2.5 px-2.5 py-1 rounded bg-[#1a202c] border border-[#3b494b]/30">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#65f2b5] animate-pulse"></span>
            <span className="text-xs font-mono text-[#d8ffe7] font-semibold">{healthPercent}%</span>
            <span className="text-[10px] text-[#b9cacb]">Health</span>
          </div>
          <div className="h-3 w-px bg-[#3b494b]/40"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#00dbe9]">memory</span>
            <span className="text-xs font-mono text-[#dde2f3]">{activeAgentsCount}</span>
            <span className="text-[10px] text-[#b9cacb]">active</span>
            <span className="text-[10px] text-[#849495]">({13 - activeAgentsCount} idle)</span>
          </div>
          <div className="h-3 w-px bg-[#3b494b]/40"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#d0bcff]">healing</span>
            <span className="text-[10px] text-[#b9cacb]">Self-Healing:</span>
            <span className="text-[10px] text-[#d0bcff] uppercase font-mono font-medium">{selfHealingState}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Live FastAPI & SQLite Status */}
          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
              backendStatus.online
                ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/20 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                : 'bg-[#242a36] border-[#3b494b]/40 text-[#849495] hover:text-[#dde2f3]'
            }`}
            title="FastAPI + SQLite Backend Status — Click to open Swagger UI /docs"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus.online ? 'bg-[#00f0ff] shadow-[0_0_6px_#00f0ff] animate-pulse' : 'bg-[#ffb4ab]'
              }`}
            ></span>
            <span className="font-semibold">{backendStatus.online ? 'FastAPI + SQLite' : 'Backend Starting...'}</span>
            <span className="text-[10px] uppercase opacity-75">API Docs &nearr;</span>
          </a>

          {/* Theme mode toggle: Light / Dark */}
          <button
            onClick={handleToggleTheme}
            className="p-1.5 rounded-lg hover:bg-[#242a36] text-[#b9cacb] hover:text-[#00f0ff] transition-all flex items-center justify-center cursor-pointer group"
            title={resolvedTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle light or dark theme"
          >
            <span className="material-symbols-outlined text-[20px] text-[#00f0ff] transition-transform group-hover:rotate-45">
              {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={onOpenCommandPalette}
            className="p-1.5 rounded hover:bg-[#242a36] text-[#b9cacb] hover:text-[#dde2f3] transition-colors"
            title="Search command palette (Ctrl+K / Cmd+K)"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
          </button>
          <button
            onClick={onOpenCommandPalette}
            className="p-1.5 rounded hover:bg-[#242a36] text-[#b9cacb] hover:text-[#dde2f3] transition-colors relative"
            title="Active Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
          </button>
          
          {/* User profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#3b494b]/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f0ff]/20 to-[#7c4dff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] font-mono text-xs font-semibold ring-1 ring-[#00f0ff]/30 shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left max-w-[140px]">
              <span className="text-[11px] text-[#dde2f3] font-medium leading-none font-mono truncate">
                {currentUser?.name || currentUser?.email?.split('@')[0] || 'Authenticated User'}
              </span>
              <span className="text-[9px] text-[#849495] leading-tight font-mono truncate">
                {currentUser?.email || 'local-session'}
              </span>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="ml-1 p-1.5 rounded-lg hover:bg-[#ff4d6d]/15 text-[#849495] hover:text-[#ff6b81] border border-transparent hover:border-[#ff4d6d]/30 transition-all cursor-pointer"
                title="Sign Out & Lock App"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
