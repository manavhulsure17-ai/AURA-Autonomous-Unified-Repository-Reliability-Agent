import React from 'react';
import { ViewKey } from '../types';

interface SidebarProps {
  currentView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  openCountIncidents?: number;
  openCountSecurity?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  openCountSecurity = 5,
  openCountIncidents = 1,
}) => {
  const navItemClass = (path: ViewKey) => {
    const isActive = currentView === path;
    return `flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-all font-sans cursor-pointer ${
      isActive
        ? 'bg-[#00f0ff] text-[#00363a] font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
        : 'text-[#b9cacb] hover:bg-[#1a202c] hover:text-[#dde2f3]'
    }`;
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#080e1a] z-40 flex flex-col border-r border-[#3b494b]/30">
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Main section */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-[#849495] font-semibold">
            Main
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full text-left ${navItemClass('dashboard')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className={`w-full text-left ${navItemClass('projects')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">folder_supervised</span>
                <span>Projects</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('repositories')}
              className={`w-full text-left ${navItemClass('repositories')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">account_tree</span>
                <span>Repositories</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Intelligence & Multi-Agent */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-[#849495] font-semibold">
            Intelligence & Multi-Agent
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onNavigate('ai-agents')}
              className={`w-full text-left ${navItemClass('ai-agents')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">neurology</span>
                <span>AI Agents</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${currentView === 'ai-agents' ? 'bg-[#00363a]/20 text-[#00363a]' : 'bg-[#1a202c] text-[#00dbe9]'}`}>
                13
              </span>
            </button>
            <button
              onClick={() => onNavigate('context-engine')}
              className={`w-full text-left ${navItemClass('context-engine')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">grain</span>
                <span>Context Engine</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('code-health')}
              className={`w-full text-left ${navItemClass('code-health')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                <span>Code Health</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('security-center')}
              className={`w-full text-left ${navItemClass('security-center')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">shield</span>
                <span>Security Center</span>
              </div>
              {openCountSecurity > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${currentView === 'security-center' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#93000a]/40 text-[#ffb4ab]'}`}>
                  {openCountSecurity}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Engineering & Lifecycle */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-[#849495] font-semibold">
            Engineering & Lifecycle
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onNavigate('refactoring')}
              className={`w-full text-left ${navItemClass('refactoring')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">code_blocks</span>
                <span>Refactoring</span>
              </div>
              <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${currentView === 'refactoring' ? 'bg-[#00363a]/20 text-[#00363a]' : 'bg-[#571bc1]/30 text-[#d0bcff]'}`}>
                #24
              </span>
            </button>
            <button
              onClick={() => onNavigate('change-impact')}
              className={`w-full text-left ${navItemClass('change-impact')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">schema</span>
                <span>Change Impact</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('test-suite')}
              className={`w-full text-left ${navItemClass('test-suite')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">rule</span>
                <span>Test Suite</span>
              </div>
              <span className={`text-[10px] font-mono ${currentView === 'test-suite' ? 'text-[#00363a]' : 'text-[#65f2b5]'}`}>
                12/12
              </span>
            </button>
            <button
              onClick={() => onNavigate('ci-cd-pipeline')}
              className={`w-full text-left ${navItemClass('ci-cd-pipeline')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                <span>CI/CD Pipeline</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Operations & Reliability */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-[#849495] font-semibold">
            Operations & Reliability
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onNavigate('incidents')}
              className={`w-full text-left ${navItemClass('incidents')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                <span>Incidents</span>
              </div>
              {openCountIncidents > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${currentView === 'incidents' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#93000a]/50 text-[#ffb4ab]'}`}>
                  INC-001
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('telemetry')}
              className={`w-full text-left ${navItemClass('telemetry')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">query_stats</span>
                <span>Telemetry</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('self-healing')}
              className={`w-full text-left ${navItemClass('self-healing')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">auto_mode</span>
                <span>Self-Healing</span>
              </div>
              <span className={`text-[10px] font-mono ${currentView === 'self-healing' ? 'text-[#00363a]' : 'text-[#d0bcff]'}`}>
                LIVE
              </span>
            </button>
            <button
              onClick={() => onNavigate('audit-logs')}
              className={`w-full text-left ${navItemClass('audit-logs')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Audit Logs</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`w-full text-left ${navItemClass('settings')}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom daemon indicator */}
      <div className="p-2 border-t border-[#3b494b]/30 bg-[#080e1a]/90 space-y-1.5">
        <div className="flex items-center justify-between px-2 py-1 rounded bg-[#161c28] border border-[#3b494b]/30">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shrink-0 animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#dde2f3] truncate">aura daemon v1.4.0</span>
          </div>
          <span className="text-[10px] font-mono text-[#4edea3] shrink-0">(active)</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1 rounded bg-[#161c28] border border-[#3b494b]/30">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[13px] text-[#d8ffe7] shrink-0">deployed_code</span>
            <span className="text-[10px] font-mono text-[#dde2f3] truncate">Docker isolated sandbox</span>
          </div>
          <span className="text-[10px] font-mono text-[#65f2b5] font-semibold shrink-0">[ONLINE]</span>
        </div>
      </div>
    </aside>
  );
};
