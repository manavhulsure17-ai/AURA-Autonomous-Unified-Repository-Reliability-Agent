import React, { useState, useEffect } from 'react';
import { ViewKey } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onShowToast,
}) => {
  const [query, setQuery] = useState('');
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const themeCommands = [
    {
      title: resolvedTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      desc: `Currently using ${resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}. Click to toggle.`,
      icon: resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode',
      action: () => {
        toggleTheme();
        onShowToast(`Switched to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} theme.`, resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode');
        onClose();
      },
    },
    {
      title: 'Theme: Dark Mode (AURA Neural Core)',
      desc: 'Set appearance to deep slate navy and glowing cyan',
      icon: 'dark_mode',
      action: () => {
        setTheme('dark');
        onShowToast('Applied Dark Theme.', 'dark_mode');
        onClose();
      },
    },
    {
      title: 'Theme: Light Mode (Studio Daylight)',
      desc: 'Set appearance to clean paper-white and slate',
      icon: 'light_mode',
      action: () => {
        setTheme('light');
        onShowToast('Applied Light Theme.', 'light_mode');
        onClose();
      },
    },
    {
      title: 'Theme: Match Operating System',
      desc: 'Follow system prefers-color-scheme setting',
      icon: 'desktop_windows',
      action: () => {
        setTheme('system');
        onShowToast('Applied System Theme Sync.', 'sync');
        onClose();
      },
    },
  ];

  const viewCommands = [
    { title: 'Mission Control Dashboard', desc: 'Overview of health, swarm and target monolith', view: 'dashboard' as ViewKey, icon: 'grid_view' },
    { title: 'Platform Settings & Appearance', desc: 'Configure themes, models, sandboxes, and safety gates', view: 'settings' as ViewKey, icon: 'tune' },
    { title: 'Security Center', desc: 'Inspect CWE-89 SQLi and 6 vulnerabilities', view: 'security-center' as ViewKey, icon: 'shield' },
    { title: 'Refactoring Proposal #24', desc: 'Review Git diff and authorize patch merge', view: 'refactoring' as ViewKey, icon: 'code_blocks' },
    { title: 'Change Impact Synthesizer', desc: 'AST dependency graph & blast radius', view: 'change-impact' as ViewKey, icon: 'schema' },
    { title: 'Self-Healing & CI/CD Pipeline', desc: 'INC-001 correlated recovery pipeline', view: 'self-healing' as ViewKey, icon: 'auto_mode' },
    { title: 'AI Multi-Agent Swarm', desc: 'Manage 13 cognitive specialist agents', view: 'ai-agents' as ViewKey, icon: 'neurology' },
    { title: 'Deterministic Test Suite', desc: 'Pytest 12/12 isolated Docker sandbox runner', view: 'test-suite' as ViewKey, icon: 'rule' },
    { title: 'Context Engine AST Tree', desc: '84k cached symbols and semantic vector graph', view: 'context-engine' as ViewKey, icon: 'grain' },
    { title: 'PostgreSQL Audit Logs', desc: 'Ed25519 cryptographic attestation trail', view: 'audit-logs' as ViewKey, icon: 'receipt_long' },
  ];

  const filteredTheme = themeCommands.filter(
    (c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredViews = viewCommands.filter(
    (c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-[#161c28] border border-[#3b494b]/60 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
        <div className="p-3 bg-[#080e1a] border-b border-[#3b494b]/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">terminal</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a screen, action, or theme (e.g. 'Theme', 'Light', 'Dark', 'Security')..."
            className="w-full bg-transparent text-[#dde2f3] outline-none placeholder:text-[#849495]"
          />
          <span className="text-[10px] text-[#849495] border border-[#3b494b]/40 px-1.5 py-0.5 rounded">ESC</span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-2">
          {/* Theme actions group */}
          {filteredTheme.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] text-[#00f0ff] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">palette</span>
                <span>Theme & Appearance Controls</span>
              </div>
              {filteredTheme.map((item) => (
                <div
                  key={item.title}
                  onClick={item.action}
                  className="p-2.5 rounded-lg hover:bg-[#242a36] cursor-pointer flex items-center justify-between text-[#dde2f3] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">{item.icon}</span>
                    <div>
                      <div className="font-bold text-xs">{item.title}</div>
                      <div className="text-[10px] text-[#849495] font-sans">{item.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#00f0ff] font-bold">&rarr; Apply</span>
                </div>
              ))}
            </div>
          )}

          {/* Views group */}
          {filteredViews.length > 0 && (
            <div className="space-y-1">
              {filteredTheme.length > 0 && (
                <div className="px-2 pt-2 pb-1 text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold border-t border-[#3b494b]/20">
                  Navigation Views
                </div>
              )}
              {filteredViews.map((item) => (
                <div
                  key={item.title}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg hover:bg-[#242a36] cursor-pointer flex items-center justify-between text-[#dde2f3] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">{item.icon}</span>
                    <div>
                      <div className="font-bold text-xs">{item.title}</div>
                      <div className="text-[10px] text-[#849495] font-sans">{item.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#65f2b5]">&rarr; Jump</span>
                </div>
              ))}
            </div>
          )}

          {filteredTheme.length === 0 && filteredViews.length === 0 && (
            <div className="p-4 text-center text-[#849495]">No matching commands found.</div>
          )}
        </div>

        <div className="p-2 bg-[#080e1a] border-t border-[#3b494b]/30 text-[10px] text-[#849495] flex items-center justify-between">
          <span>Navigate with arrows or click</span>
          <span className="text-[#00f0ff]">AURA Autonomous Runtime</span>
        </div>
      </div>
    </div>
  );
};
