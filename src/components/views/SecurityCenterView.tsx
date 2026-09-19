import React, { useState } from 'react';
import { SecurityFinding, ViewKey } from '../../types';

interface SecurityCenterViewProps {
  findings: SecurityFinding[];
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const SecurityCenterView: React.FC<SecurityCenterViewProps> = ({
  findings,
  onNavigate,
  onShowToast,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [simulatingExploit, setSimulatingExploit] = useState<boolean>(false);
  const [exploitLog, setExploitLog] = useState<string | null>(null);

  const filteredFindings = findings.filter((f) => {
    const matchesSev = filterSeverity === 'All' || f.severity === filterSeverity;
    const matchesSearch =
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const handleSimulateExploit = () => {
    setSimulatingExploit(true);
    setExploitLog('Injecting payload: \' OR \'1\'=\'1\' -- into mock ASGI context...');
    setTimeout(() => {
      setExploitLog(
        'VULNERABILITY CONFIRMED: Query evaluated to TRUE. Bypass authenticated admin session #1. Zero authorization barrier.'
      );
      setSimulatingExploit(false);
      onShowToast('Exploit Simulation Confirmed: CWE-89 High-Yield Taint Vulnerability.', 'gpp_bad');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_#ffb4ab] animate-pulse"></span>
          <span className="text-xs text-[#ffb4ab] uppercase tracking-widest font-mono font-semibold">
            Security Intelligence & Threat Vector Center
          </span>
          <span className="text-[10px] text-[#849495] font-mono px-1.5 py-0.5 rounded bg-[#242a36]">
            GATE: STRICT // ZERO CVE TOLERANCE
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#b9cacb]">
          <span className="px-2 py-0.5 rounded bg-[#1a202c] text-[#ffdad6]">1 Critical Blocked</span>
          <span className="px-2 py-0.5 rounded bg-[#1a202c] text-[#00f0ff]">Signed: ed25519:e4d1...</span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Top 6 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="bg-[#161c28] p-3 rounded-xl border border-[#ffb4ab]/30 shadow-md">
            <span className="text-[10px] text-[#ffb4ab] uppercase font-mono font-medium">Critical Finding</span>
            <div className="text-2xl font-bold text-[#ffb4ab] mt-1 font-mono">01</div>
            <span className="text-[9px] text-[#ffdad6] font-mono font-semibold">ACTIVE GATE</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">High Severity</span>
            <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">03</div>
            <span className="text-[9px] text-[#b9cacb] font-mono">Actionable</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Medium</span>
            <div className="text-2xl font-bold text-[#dde2f3] mt-1 font-mono">06</div>
            <span className="text-[9px] text-[#b9cacb] font-mono">Review Staged</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Low / Info</span>
            <div className="text-2xl font-bold text-[#b9cacb] mt-1 font-mono">12</div>
            <span className="text-[9px] text-[#849495] font-mono">Heuristic</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Secrets Blocked</span>
            <div className="text-2xl font-bold text-[#65f2b5] mt-1 font-mono">04</div>
            <span className="text-[9px] text-[#4edea3] font-mono">Pre-Commit</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Security Health</span>
            <div className="text-2xl font-bold text-[#d8ffe7] mt-1 font-mono">78/100</div>
            <span className="text-[9px] text-[#ffb4ab] font-mono">-4.2%</span>
          </div>
        </div>

        {/* Featured High-Priority Vulnerability Card */}
        <div className="bg-[#161c28] rounded-xl border border-[#ffb4ab]/40 shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#93000a]/20 border-b border-[#ffb4ab]/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">error</span>
              <span className="text-xs font-mono font-bold text-[#ffdad6] uppercase tracking-wider">
                Critical Finding: CWE-89 SQL Injection (Confidence: 94.2%)
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#242a36] text-[#b9cacb]">
                backend/auth.py:47 &bull; authenticate_user()
              </span>
              <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-bold">
                BLOCKING PR MERGE
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Split Threat Vector Inspection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Left: AST Sink code inspector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#b9cacb]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">code</span>
                    <span>AST Sink Code Inspector</span>
                  </span>
                  <span className="text-[10px] text-[#849495]">Semgrep Rule: python.sqlalchemy.sqli</span>
                </div>
                <div className="p-3 rounded-lg bg-[#080e1a] font-mono text-xs leading-relaxed text-[#b9cacb] border border-[#3b494b]/30 overflow-x-auto">
                  <div className="text-[#849495]">45  def authenticate_user(db: Session, username: str, pwd_hash: str):</div>
                  <div className="text-[#849495]">46      # VULNERABLE: Direct string interpolation bypasses query sanitizer</div>
                  <div className="text-[#ffb4ab] bg-[#93000a]/30 px-1 py-0.5 rounded -mx-1 font-semibold">
                    47      query = f"SELECT * FROM users WHERE username = '{'{username}'}' AND password_hash = '{'{pwd_hash}'}'"
                  </div>
                  <div className="text-[#849495]">48      result = db.execute(text(query)).fetchone()</div>
                  <div className="text-[#849495]">49      return result</div>
                </div>
              </div>

              {/* Right: Exploit Payload Simulation & Taint Analysis */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#b9cacb]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">bug_report</span>
                    <span>Exploit Payload Simulation</span>
                  </span>
                  <span className="text-[10px] text-[#65f2b5]">Target: Postgres 16</span>
                </div>
                <div className="p-3 rounded-lg bg-[#080e1a] font-mono text-xs leading-relaxed border border-[#3b494b]/30 space-y-2">
                  <div className="text-[#b9cacb]">
                    <span className="text-[#849495]">Payload injected:</span>{' '}
                    <span className="text-[#ffb4ab] font-bold">' OR '1'='1' --</span>
                  </div>
                  <div className="text-[11px] text-[#dde2f3] leading-relaxed">
                    Evaluated Query:{' '}
                    <code className="text-[#00f0ff]">
                      SELECT * FROM users WHERE username = '' OR '1'='1' --' AND password_hash = '...'
                    </code>
                  </div>
                  <div className="pt-1 text-[10px] text-[#65f2b5] flex items-center gap-1 border-t border-[#3b494b]/20">
                    <span className="material-symbols-outlined text-[14px]">shield_with_heart</span>
                    <span>AURA Security Agent Verdict: Complete Authentication Bypass</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Analysis & Recommended Patch */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
              <div className="lg:col-span-6 space-y-2">
                <h4 className="text-xs font-semibold text-[#dde2f3] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">neurology</span>
                  <span>AURA Security Agent Verdict & Blast Radius</span>
                </h4>
                <p className="text-xs text-[#b9cacb] leading-relaxed">
                  The untrusted variable <code className="text-[#00f0ff]">username</code> is interpolated directly into the SQL
                  string without parameterized tokenization or escape routines. This yields deterministic SQL injection under
                  standard ASGI ingress.
                </p>
                <div className="p-2 rounded bg-[#080e1a] text-[11px] text-[#ffdad6] font-mono border-l-2 border-[#ffb4ab]">
                  Blast Radius: Total database read/write bypass, exposure of bcrypt salted admin hashes, full tenant exfiltration capability, and compliance breach (SOC2 §CC6.1).
                </div>
              </div>

              <div className="lg:col-span-6 space-y-2">
                <h4 className="text-xs font-semibold text-[#65f2b5] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Recommended Remediation (PEP 249 Bound Parameters)</span>
                </h4>
                <div className="p-2.5 rounded bg-[#080e1a] font-mono text-[11px] leading-relaxed text-[#65f2b5] border border-[#65f2b5]/30">
                  <div># Deterministic AST Patch:</div>
                  <div>query = text("SELECT * FROM users WHERE username = :username AND password_hash = :pwd_hash")</div>
                  <div>result = db.execute(query, &#123;"username": username, "pwd_hash": pwd_hash&#125;).fetchone()</div>
                </div>
              </div>
            </div>

            {/* Simulation live log if triggered */}
            {exploitLog && (
              <div className="p-2.5 rounded bg-[#080e1a] border border-[#00f0ff]/40 font-mono text-xs text-[#00f0ff] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                <span>{exploitLog}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#3b494b]/30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('refactoring')}
                  className="px-4 py-2 rounded-lg bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_14px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                  <span>Generate Automated Fix (Proposal #24)</span>
                </button>
                <button
                  onClick={() => onNavigate('change-impact')}
                  className="px-3 py-2 rounded-lg bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">schema</span>
                  <span>Inspect AST Graph</span>
                </button>
              </div>

              <button
                onClick={handleSimulateExploit}
                disabled={simulatingExploit}
                className="px-3 py-2 rounded-lg bg-[#93000a]/30 hover:bg-[#93000a]/50 text-[#ffdad6] text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[16px] ${simulatingExploit ? 'animate-spin' : ''}`}>
                  {simulatingExploit ? 'refresh' : 'play_arrow'}
                </span>
                <span>{simulatingExploit ? 'Simulating...' : 'Simulate Exploit'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comprehensive Security Findings Table & Right Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Table (8 Cols) */}
          <div className="lg:col-span-8 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">table_chart</span>
                <span className="text-sm text-[#dde2f3] font-semibold">Comprehensive Security Findings</span>
                <span className="text-xs font-mono text-[#849495]">({filteredFindings.length} issues)</span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#080e1a] rounded px-2 py-1 border border-[#3b494b]/30">
                  <span className="material-symbols-outlined text-[14px] text-[#849495] mr-1">search</span>
                  <input
                    type="text"
                    placeholder="Search findings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-[#dde2f3] outline-none font-mono placeholder:text-[#849495] w-28 md:w-36"
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  {['All', 'Critical', 'High', 'Medium'].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                        filterSeverity === sev
                          ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                          : 'bg-[#242a36] text-[#b9cacb] hover:bg-[#343946]'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Findings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#3b494b]/30 text-[10px] text-[#849495] uppercase tracking-wider">
                    <th className="py-2 px-2">ID</th>
                    <th className="py-2 px-2">Severity</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2">File / Location</th>
                    <th className="py-2 px-2">Engine</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b494b]/20">
                  {filteredFindings.map((finding) => (
                    <tr key={finding.id} className="hover:bg-[#1a202c] transition-colors">
                      <td className="py-2.5 px-2 text-[#00f0ff] font-semibold">{finding.id}</td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            finding.severity === 'Critical'
                              ? 'bg-[#93000a] text-[#ffdad6]'
                              : finding.severity === 'High'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-[#242a36] text-[#b9cacb]'
                          }`}
                        >
                          {finding.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-[#dde2f3] font-sans font-medium">{finding.category}</td>
                      <td className="py-2.5 px-2 text-[#b9cacb] text-[11px]">
                        {finding.file}:{finding.line}
                      </td>
                      <td className="py-2.5 px-2 text-[10px] text-[#849495]">{finding.detectionEngine}</td>
                      <td className="py-2.5 px-2">
                        <span className="text-[10px] text-[#d0bcff]">{finding.status}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        {finding.id === 'SEC-001' ? (
                          <button
                            onClick={() => onNavigate('refactoring')}
                            className="px-2 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#00363a] transition-colors text-[10px] font-bold cursor-pointer"
                          >
                            View Patch
                          </button>
                        ) : (
                          <button
                            onClick={() => onShowToast(`Analyzing ${finding.id} remediation...`, 'psychology')}
                            className="px-2 py-1 rounded bg-[#242a36] text-[#b9cacb] hover:text-[#dde2f3] transition-colors text-[10px] cursor-pointer"
                          >
                            Triage
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Rail: Posture & Donut Chart (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            {/* Posture Metrics */}
            <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#dde2f3] font-semibold">Security Posture Breakdown</span>
                <span className="text-[10px] text-[#65f2b5] font-mono">SOC2 COMPLIANT</span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2.5 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[#b9cacb] text-[10px] mb-1">
                    <span>Static Analysis (SAST)</span>
                    <span className="text-[#65f2b5]">96%</span>
                  </div>
                  <div className="h-1.5 bg-[#2f3542] rounded-full overflow-hidden">
                    <div className="h-full bg-[#65f2b5] rounded-full w-[96%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#b9cacb] text-[10px] mb-1">
                    <span>Auth & Access Control</span>
                    <span className="text-[#ffb4ab]">64% (SQLi gate)</span>
                  </div>
                  <div className="h-1.5 bg-[#2f3542] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffb4ab] rounded-full w-[64%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#b9cacb] text-[10px] mb-1">
                    <span>Dependency Hygiene</span>
                    <span className="text-[#00dbe9]">88%</span>
                  </div>
                  <div className="h-1.5 bg-[#2f3542] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00dbe9] rounded-full w-[88%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#b9cacb] text-[10px] mb-1">
                    <span>Secret Hygiene</span>
                    <span className="text-[#65f2b5]">100%</span>
                  </div>
                  <div className="h-1.5 bg-[#2f3542] rounded-full overflow-hidden">
                    <div className="h-full bg-[#65f2b5] rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Safety Policies */}
            <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
              <span className="text-xs text-[#dde2f3] font-semibold">Active Safety Policies</span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2 rounded bg-[#1a202c] border border-[#3b494b]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#65f2b5]">gpp_good</span>
                    <span className="text-[#dde2f3] font-medium font-sans">POL-SEC-09: No Raw SQL</span>
                  </div>
                  <span className="text-[10px] text-[#65f2b5] uppercase">ENFORCED</span>
                </div>
                <div className="p-2 rounded bg-[#1a202c] border border-[#3b494b]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#65f2b5]">gpp_good</span>
                    <span className="text-[#dde2f3] font-medium font-sans">POL-ISO-02: Deterministic Diffs</span>
                  </div>
                  <span className="text-[10px] text-[#65f2b5] uppercase">ENFORCED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
