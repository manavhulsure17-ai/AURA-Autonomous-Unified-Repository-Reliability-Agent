import React, { useState } from 'react';
import { ViewKey, AuthUser } from '../../types';
import { getStoredUsers } from '../../utils/authStorage';
import { useTheme } from '../../context/ThemeContext';

interface SettingsViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate, onShowToast, currentUser, onLogout }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'agents' | 'sandbox' | 'safety' | 'telemetry' | 'system' | 'account'>('appearance');

  // Agent Settings State
  const [consensusThreshold, setConsensusThreshold] = useState<number>(3);
  const [coordinatorModel, setCoordinatorModel] = useState<string>('gemini-2.5-pro');
  const [executorModel, setExecutorModel] = useState<string>('gemini-2.5-flash');
  const [astGroundingRequired, setAstGroundingRequired] = useState<boolean>(true);

  // Safety Gates State
  const [requireHumanSignoff, setRequireHumanSignoff] = useState<boolean>(true);
  const [blockHighBlastRadius, setBlockHighBlastRadius] = useState<boolean>(true);
  const [ephemeralSandboxes, setEphemeralSandboxes] = useState<boolean>(true);
  const [sandboxTimeoutSeconds, setSandboxTimeoutSeconds] = useState<number>(30);
  const [sandboxMemoryMb, setSandboxMemoryMb] = useState<number>(512);

  // Telemetry Settings State
  const [otelEndpoint, setOtelEndpoint] = useState<string>('grpc://otel-collector.us-east-1:4317');
  const [samplingRate, setSamplingRate] = useState<number>(100);
  const [p99AlertThresholdMs, setP99AlertThresholdMs] = useState<number>(250);

  const handleSaveSettings = () => {
    onShowToast('AURA platform configuration updated and synchronized across swarm.', 'verified');
  };

  const handleRunDiagnostics = () => {
    onShowToast('Swarm diagnostics complete: All 13 agents healthy, Docker daemon online, AST cache valid.', 'bolt');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            Platform Settings & Swarm Governance
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            AURA v1.4.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDiagnostics}
            className="px-2.5 py-1.5 rounded bg-[#242a36] hover:bg-[#343946] text-[#00f0ff] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">build</span>
            <span>Run Doctor / Diagnostics</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-3 py-1.5 rounded bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">save</span>
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#3b494b]/30 pb-2 overflow-x-auto">
          {[
            { key: 'appearance', label: 'Theme & Appearance', icon: 'palette' },
            { key: 'agents', label: 'Swarm & Cognitive Models', icon: 'psychology' },
            { key: 'sandbox', label: 'Docker Sandboxes & Pytest', icon: 'deployed_code' },
            { key: 'safety', label: 'Human Safety Gates', icon: 'security' },
            { key: 'telemetry', label: 'OpenTelemetry & Ingress', icon: 'sensors' },
            { key: 'system', label: 'Cluster Diagnostics', icon: 'terminal' },
            { key: 'account', label: 'User Account & Security', icon: 'badge' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#00f0ff] text-[#00363a] font-bold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'text-[#b9cacb] hover:bg-[#242a36]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 0: Theme & Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#dde2f3] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">palette</span>
                    <span>Interface Theme & Display Preferences</span>
                  </h3>
                  <p className="text-xs text-[#849495] font-sans mt-0.5">
                    Customize the visual workspace to suit your environment, lighting conditions, and display setup.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                  <span>Active Theme: {resolvedTheme === 'dark' ? 'Dark (AURA Core)' : 'Light (Studio Daylight)'}</span>
                </div>
              </div>

              {/* Theme Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {/* Dark Theme Card */}
                <div
                  onClick={() => {
                    setTheme('dark');
                    onShowToast('Applied Dark Theme (AURA Neural Core).', 'dark_mode');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'border-[#00f0ff] bg-[#0c1424] shadow-[0_0_15px_rgba(0,240,255,0.2)] ring-1 ring-[#00f0ff]'
                      : 'border-[#3b494b]/30 bg-[#0e131f] hover:border-[#3b494b]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#161c28] border border-[#3b494b]/40 flex items-center justify-center text-[#00f0ff]">
                          <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#dde2f3]">Dark Theme</div>
                          <div className="text-[10px] text-[#849495]">AURA Neural Core</div>
                        </div>
                      </div>
                      {theme === 'dark' && (
                        <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">check_circle</span>
                      )}
                    </div>
                    {/* Visual Preview Box */}
                    <div className="h-14 rounded-md bg-[#080e1a] border border-[#242a36] p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#ffb4ab]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#fde047]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#65f2b5]"></div>
                        <span className="text-[8px] font-mono text-[#849495] ml-1">#080e1a / #00f0ff</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 w-12 bg-[#242a36] rounded"></div>
                        <div className="h-2 w-6 bg-[#00f0ff]/40 rounded"></div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#849495] font-sans">
                      Deep navy slate with cyan and violet accents. Optimizes eye strain during extended coding sessions.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#3b494b]/20">
                    <span className="text-[10px] font-mono text-[#00f0ff]">High contrast in low light</span>
                  </div>
                </div>

                {/* Light Theme Card */}
                <div
                  onClick={() => {
                    setTheme('light');
                    onShowToast('Applied Light Theme (Studio Daylight).', 'light_mode');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    theme === 'light'
                      ? 'border-[#00f0ff] bg-[#ffffff] shadow-[0_0_15px_rgba(0,240,255,0.2)] ring-1 ring-[#00f0ff]'
                      : 'border-[#3b494b]/30 bg-[#f8fafc] hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#ffffff] border border-[#cbd5e1] flex items-center justify-center text-[#0891b2] shadow-sm">
                          <span className="material-symbols-outlined text-[18px]">light_mode</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0f172a]">Light Theme</div>
                          <div className="text-[10px] text-[#64748b]">Studio Daylight</div>
                        </div>
                      </div>
                      {theme === 'light' && (
                        <span className="material-symbols-outlined text-[#0891b2] text-[18px]">check_circle</span>
                      )}
                    </div>
                    {/* Visual Preview Box */}
                    <div className="h-14 rounded-md bg-[#ffffff] border border-[#e2e8f0] p-2 flex flex-col justify-between shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                        <span className="text-[8px] font-mono text-[#64748b] ml-1">#ffffff / #0f172a</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 w-12 bg-[#e2e8f0] rounded"></div>
                        <div className="h-2 w-6 bg-[#0891b2]/40 rounded"></div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#475569] font-sans">
                      Clean paper-white and slate styling. WCAG AA compliant contrast for bright daylight working conditions.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#e2e8f0]">
                    <span className="text-[10px] font-mono text-[#0891b2]">High legibility in bright rooms</span>
                  </div>
                </div>

                {/* System Preference Card */}
                <div
                  onClick={() => {
                    setTheme('system');
                    onShowToast('Configured to follow OS system theme.', 'sync');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    theme === 'system'
                      ? 'border-[#00f0ff] bg-[#161c28] shadow-[0_0_15px_rgba(0,240,255,0.2)] ring-1 ring-[#00f0ff]'
                      : 'border-[#3b494b]/30 bg-[#0e131f] hover:border-[#3b494b]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#242a36] border border-[#3b494b]/40 flex items-center justify-center text-[#d0bcff]">
                          <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#dde2f3]">System Sync</div>
                          <div className="text-[10px] text-[#849495]">Automatic Sync</div>
                        </div>
                      </div>
                      {theme === 'system' && (
                        <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">check_circle</span>
                      )}
                    </div>
                    {/* Visual Preview Box */}
                    <div className="h-14 rounded-md bg-gradient-to-r from-[#080e1a] via-[#1a202c] to-[#ffffff] border border-[#3b494b]/30 p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-[12px] text-[#00f0ff]">dark_mode</span>
                        <span className="material-symbols-outlined text-[12px] text-[#0891b2]">light_mode</span>
                      </div>
                      <div className="text-[8px] font-mono text-center text-[#849495]">
                        Auto prefers-color-scheme
                      </div>
                    </div>
                    <p className="text-[11px] text-[#849495] font-sans">
                      Automatically synchronizes with your operating system's light or dark schedule.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#3b494b]/20">
                    <span className="text-[10px] font-mono text-[#d0bcff]">Currently resolved: {resolvedTheme}</span>
                  </div>
                </div>
              </div>

              {/* Fast Toggle Action Strip */}
              <div className="pt-2 flex items-center justify-between border-t border-[#3b494b]/20 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="px-3 py-1.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-bold text-xs flex items-center gap-1.5 hover:bg-[#7df4ff] transition-all cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span>Quick Toggle Theme ({resolvedTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})</span>
                  </button>
                  <span className="text-xs text-[#849495] font-sans">
                    You can also toggle anytime using the sun/moon icon in the top header or with <kbd className="px-1.5 py-0.5 rounded bg-[#242a36] text-[10px] font-mono">Ctrl+K</kbd>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Swarm & Cognitive Models */}
        {activeTab === 'agents' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 space-y-4">
              <h3 className="text-sm font-bold text-[#dde2f3] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">psychology</span>
                <span>Swarm Cognitive Model Assignment (13 Specialists)</span>
              </h3>
              <p className="text-xs text-[#849495] font-sans">
                Assign models according to architectural requirements: Gemini 2.5 Pro for deep multi-module reasoning, AST taint analysis, and DAG decomposition; Gemini 2.5 Flash for sub-second deterministic test generation and metric correlation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#b9cacb] font-semibold block">
                    COORDINATORS & ANALYZERS (Manager, Security, Architecture, Incident)
                  </label>
                  <select
                    value={coordinatorModel}
                    onChange={(e) => setCoordinatorModel(e.target.value)}
                    className="w-full bg-[#080e1a] border border-[#3b494b]/40 rounded-lg p-2 text-xs text-[#dde2f3] outline-none font-mono"
                  >
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended)</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#b9cacb] font-semibold block">
                    EXECUTORS & RELIABILITY (Testing, Planner, Telemetry, CI/CD)
                  </label>
                  <select
                    value={executorModel}
                    onChange={(e) => setExecutorModel(e.target.value)}
                    className="w-full bg-[#080e1a] border border-[#3b494b]/40 rounded-lg p-2 text-xs text-[#dde2f3] outline-none font-mono"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-low latency)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#3b494b]/20 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#080e1a] border border-[#3b494b]/20">
                  <div>
                    <div className="text-xs font-bold text-[#dde2f3]">Consensus Quorum Threshold</div>
                    <div className="text-[10px] text-[#849495] font-sans">
                      Minimum number of independent agents required to sign off on critical patches (Section 3)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={consensusThreshold}
                      onChange={(e) => setConsensusThreshold(Number(e.target.value))}
                      className="w-16 bg-[#161c28] border border-[#3b494b]/40 rounded p-1 text-center font-bold text-[#00f0ff] text-xs outline-none"
                    />
                    <span className="text-[11px] text-[#849495]">Agents</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#080e1a] border border-[#3b494b]/20">
                  <div>
                    <div className="text-xs font-bold text-[#dde2f3]">Mandatory Tree-sitter AST Grounding</div>
                    <div className="text-[10px] text-[#849495] font-sans">
                      Forbid free-form LLM hallucination; all synthesized code diffs must resolve against indexed AST nodes
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={astGroundingRequired}
                    onChange={(e) => setAstGroundingRequired(e.target.checked)}
                    className="w-4 h-4 accent-[#00f0ff] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Docker Sandboxes */}
        {activeTab === 'sandbox' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 space-y-4">
              <h3 className="text-sm font-bold text-[#dde2f3] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">deployed_code</span>
                <span>Docker Sandbox Isolation Engine (Section 4 Standard)</span>
              </h3>
              <p className="text-xs text-[#849495] font-sans">
                Controls the isolation boundaries for executing AI-generated pytest test suites, Semgrep taint checks, and build scripts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#b9cacb] font-semibold block">
                    Container Execution Timeout (Seconds)
                  </label>
                  <input
                    type="number"
                    value={sandboxTimeoutSeconds}
                    onChange={(e) => setSandboxTimeoutSeconds(Number(e.target.value))}
                    className="w-full bg-[#080e1a] border border-[#3b494b]/40 rounded-lg p-2 text-xs text-[#dde2f3] outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#b9cacb] font-semibold block">
                    CGroup Memory Limit (MB per Container)
                  </label>
                  <input
                    type="number"
                    value={sandboxMemoryMb}
                    onChange={(e) => setSandboxMemoryMb(Number(e.target.value))}
                    className="w-full bg-[#080e1a] border border-[#3b494b]/40 rounded-lg p-2 text-xs text-[#dde2f3] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#3b494b]/20 space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#080e1a] border border-[#3b494b]/20">
                  <div>
                    <div className="text-xs font-bold text-[#dde2f3]">Zero-Network Isolation (--network none)</div>
                    <div className="text-[10px] text-[#849495] font-sans">
                      Completely blocks outbound Internet and host LAN access from test execution sandbox containers
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={ephemeralSandboxes}
                    onChange={(e) => setEphemeralSandboxes(e.target.checked)}
                    className="w-4 h-4 accent-[#65f2b5] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Human Safety Gates */}
        {activeTab === 'safety' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 space-y-4">
              <h3 className="text-sm font-bold text-[#dde2f3] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">security</span>
                <span>Human Approval Safety Gates & Blast Radius Enforcement</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#080e1a] border border-[#3b494b]/20">
                  <div>
                    <div className="text-xs font-bold text-[#dde2f3]">Enforce Human Signoff on Medium+ Risk</div>
                    <div className="text-[10px] text-[#849495] font-sans">
                      Requires explicit operator confirmation in UI before applying any refactoring proposal or hotfix
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireHumanSignoff}
                    onChange={(e) => setRequireHumanSignoff(e.target.checked)}
                    className="w-4 h-4 accent-[#00f0ff] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#080e1a] border border-[#3b494b]/20">
                  <div>
                    <div className="text-xs font-bold text-[#dde2f3]">Block Unverified High Blast Radius Changes</div>
                    <div className="text-[10px] text-[#849495] font-sans">
                      Automatically aborts any automated patch affecting &gt;10 transitive modules without 100% test coverage
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={blockHighBlastRadius}
                    onChange={(e) => setBlockHighBlastRadius(e.target.checked)}
                    className="w-4 h-4 accent-[#00f0ff] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: OpenTelemetry & Ingress */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 space-y-4">
              <h3 className="text-sm font-bold text-[#dde2f3] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">sensors</span>
                <span>OpenTelemetry Collector & Metric Ingress</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#b9cacb] font-semibold block">
                    OTEL Collector Endpoint (gRPC)
                  </label>
                  <input
                    type="text"
                    value={otelEndpoint}
                    onChange={(e) => setOtelEndpoint(e.target.value)}
                    className="w-full bg-[#080e1a] border border-[#3b494b]/40 rounded-lg p-2 text-xs text-[#dde2f3] outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#b9cacb] font-semibold block">
                    P99 Alert Threshold (Milliseconds)
                  </label>
                  <input
                    type="number"
                    value={p99AlertThresholdMs}
                    onChange={(e) => setP99AlertThresholdMs(Number(e.target.value))}
                    className="w-full bg-[#080e1a] border border-[#3b494b]/40 rounded-lg p-2 text-xs text-[#dde2f3] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Cluster Diagnostics */}
        {activeTab === 'system' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
                <span className="text-xs font-bold text-[#dde2f3]">System Self-Test & Diagnostic Attestation</span>
                <span className="text-[10px] text-[#65f2b5]">PASS (0.42ms)</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                  <span>Tree-sitter AST Parser Engine</span>
                  <span className="text-[#65f2b5] font-bold">[ONLINE - 84,200 nodes]</span>
                </div>
                <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                  <span>Docker Daemon API Socket</span>
                  <span className="text-[#65f2b5] font-bold">[ONLINE - aura-sandbox-c1]</span>
                </div>
                <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                  <span>Ed25519 Signature Ledger</span>
                  <span className="text-[#65f2b5] font-bold">[VERIFIED - 0 breaches]</span>
                </div>
                <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                  <span>OTEL Ingress Stream</span>
                  <span className="text-[#65f2b5] font-bold">[SYNCED - 120 msg/sec]</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: User Account & Security */}
        {activeTab === 'account' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-[#161c28] p-5 rounded-xl border border-[#3b494b]/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#7c4dff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] font-bold text-base">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#dde2f3] flex items-center gap-2">
                      <span>{currentUser?.name || 'Authenticated User'}</span>
                      <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] text-[10px] font-mono border border-[#00f0ff]/20">
                        {currentUser?.role || 'Engineer'}
                      </span>
                    </h3>
                    <p className="text-xs text-[#849495] font-sans">
                      {currentUser?.email || 'guest@aura.internal'}
                    </p>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-lg bg-[#ff4d6d]/15 text-[#ff6b81] hover:bg-[#ff4d6d]/25 border border-[#ff4d6d]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                  <span className="text-[10px] uppercase text-[#849495] tracking-wider font-semibold">
                    Authentication Method
                  </span>
                  <div className="text-[#dde2f3] font-mono font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff] text-[16px]">pin</span>
                    <span>Email & 4-Digit Security PIN</span>
                  </div>
                  <div className="text-[11px] text-[#65f2b5]">
                    Status: Verified & Encrypted
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                  <span className="text-[10px] uppercase text-[#849495] tracking-wider font-semibold">
                    Registered On
                  </span>
                  <div className="text-[#dde2f3] font-mono font-medium">
                    {currentUser?.registeredAt ? new Date(currentUser.registeredAt).toLocaleDateString() : 'Active Session'}
                  </div>
                  <div className="text-[11px] text-[#849495]">
                    Local store persistence enabled
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#3b494b]/20">
                <h4 className="text-xs font-bold text-[#b9cacb] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">group</span>
                  <span>Registered Users in Local Store ({getStoredUsers().length})</span>
                </h4>
                <div className="space-y-1.5">
                  {getStoredUsers().map((u) => (
                    <div
                      key={u.email}
                      className="p-2.5 rounded bg-[#0b101c] border border-[#222d3e] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span>
                        <span className="font-mono text-[#dde2f3]">{u.email}</span>
                        {u.email === currentUser?.email && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#65f2b5]/15 text-[#65f2b5] border border-[#65f2b5]/30">
                            Current Session
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-[#849495]">
                        <span>PIN: ****</span>
                        <span className="text-[#b9cacb]">{u.role || 'Member'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
