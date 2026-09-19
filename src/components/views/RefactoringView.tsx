import React, { useState } from 'react';
import { RefactoringProposal, ViewKey } from '../../types';

interface RefactoringViewProps {
  proposal: RefactoringProposal;
  onApplyProposal: () => void;
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const RefactoringView: React.FC<RefactoringViewProps> = ({
  proposal,
  onApplyProposal,
  onNavigate,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'backend/auth.py' | 'services/user_service.py'>('backend/auth.py');
  const [copyingCli, setCopyingCli] = useState<boolean>(false);

  const handleCopyCli = () => {
    navigator.clipboard.writeText('aura patch apply PROP-024 --sandbox-enforce --sign');
    setCopyingCli(true);
    onShowToast('CLI command copied: aura patch apply PROP-024 --sandbox-enforce --sign', 'content_copy');
    setTimeout(() => setCopyingCli(false), 2000);
  };

  const handleApply = () => {
    onApplyProposal();
    onShowToast('Proposal #24 approved! Patch committed to branch refactor/aura-patch-auth-fix.', 'verified');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d0bcff] shadow-[0_0_8px_#d0bcff] animate-pulse"></span>
          <span className="text-xs text-[#d0bcff] uppercase tracking-widest font-mono font-semibold">
            PROPOSAL #24 // PR-READY CANDIDATE
          </span>
          <span className="text-[10px] text-[#849495] font-mono px-1.5 py-0.5 rounded bg-[#242a36]">
            SANDBOX: 12/12 PASSED (1.84s)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-[#1a202c] text-[#ffdad6] border border-[#ffb4ab]/30">
            Safety Gate: Medium Risk
          </span>
          <span className="px-2 py-0.5 rounded bg-[#65f2b5]/10 text-[#65f2b5]">
            AST Signature: 100% Match
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Proposal Header Title */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#d0bcff] text-[#3c0091] text-[10px] font-mono font-bold uppercase">
                  Refactor Proposal #24
                </span>
                <span className="text-lg text-[#dde2f3] font-bold">{proposal.title}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[#b9cacb] text-xs font-mono">
                <span>
                  Branch: <code className="text-[#00dbe9]">{proposal.branch}</code>
                </span>
                <span>•</span>
                <span>Author: {proposal.author}</span>
                <span>•</span>
                <span className="text-[#65f2b5]">Isolated Docker Sandbox: VALIDATED</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCli}
                className="px-3 py-2 rounded-lg bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">terminal</span>
                <span>{copyingCli ? 'Copied!' : 'Copy CLI command'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bento: 3 Core Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Security Vector */}
          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#ffb4ab]/30 shadow-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#ffb4ab] font-bold">
                {proposal.securityVector.tag}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">gpp_good</span>
            </div>
            <h4 className="text-sm font-bold text-[#dde2f3]">{proposal.securityVector.headline}</h4>
            <p className="text-xs text-[#b9cacb] leading-relaxed">{proposal.securityVector.description}</p>
            <div className="text-[10px] font-mono text-[#ffdad6] pt-1">{proposal.securityVector.cwe}</div>
          </div>

          {/* AST Integrity */}
          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#00dbe9] font-bold">
                {proposal.astIntegrity.status}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#00dbe9]">account_tree</span>
            </div>
            <h4 className="text-sm font-bold text-[#dde2f3]">{proposal.astIntegrity.headline}</h4>
            <p className="text-xs text-[#b9cacb] leading-relaxed">{proposal.astIntegrity.description}</p>
            <div className="text-[10px] font-mono text-[#00f0ff] pt-1">
              {proposal.astIntegrity.testedRoutesCount} of 4 routes tested
            </div>
          </div>

          {/* Refactor Delta */}
          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#65f2b5] font-bold">
                {proposal.refactorDelta.netLines} NET LINES
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#65f2b5]">difference</span>
            </div>
            <h4 className="text-sm font-bold text-[#dde2f3]">{proposal.refactorDelta.headline}</h4>
            <p className="text-xs text-[#b9cacb] leading-relaxed">{proposal.refactorDelta.description}</p>
            <div className="text-[10px] font-mono text-[#b9cacb] pt-1 flex items-center gap-2">
              <span className="text-[#65f2b5]">+{proposal.refactorDelta.additions} additions</span>
              <span className="text-[#ffb4ab]">-{proposal.refactorDelta.deletions} deletions</span>
            </div>
          </div>
        </div>

        {/* High-Precision Git Diff Inspector */}
        <div className="bg-[#161c28] rounded-xl border border-[#3b494b]/30 shadow-xl overflow-hidden">
          {/* File Tabs Header */}
          <div className="bg-[#080e1a] px-3 pt-2 border-b border-[#3b494b]/30 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('backend/auth.py')}
                className={`px-3 py-1.5 rounded-t text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'backend/auth.py'
                    ? 'bg-[#161c28] text-[#00f0ff] font-bold border-t-2 border-[#00f0ff]'
                    : 'text-[#849495] hover:text-[#dde2f3]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">description</span>
                <span>backend/auth.py</span>
                <span className="text-[10px] text-[#ffb4ab]">-18</span>
                <span className="text-[10px] text-[#65f2b5]">+12</span>
              </button>
              <button
                onClick={() => setActiveTab('services/user_service.py')}
                className={`px-3 py-1.5 rounded-t text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'services/user_service.py'
                    ? 'bg-[#161c28] text-[#00f0ff] font-bold border-t-2 border-[#00f0ff]'
                    : 'text-[#849495] hover:text-[#dde2f3]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">description</span>
                <span>services/user_service.py</span>
                <span className="text-[10px] text-[#ffb4ab]">-34</span>
                <span className="text-[10px] text-[#65f2b5]">+12</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-[#849495] hidden sm:block">
              UNIFIED SYNTAX HIGHLIGHTED DIFF
            </div>
          </div>

          {/* Unified Diff Content */}
          <div className="p-3 bg-[#0e131f] font-mono text-xs leading-relaxed overflow-x-auto select-text">
            {activeTab === 'backend/auth.py' ? (
              <div className="space-y-0.5">
                <div className="text-[#849495] py-0.5">@@ -42,12 +42,14 @@ def authenticate_user(db: Session, username: str, pwd_hash: str):</div>
                <div className="text-[#849495] pl-6">    """</div>
                <div className="text-[#849495] pl-6">    Authenticates client credentials against Postgres user store.</div>
                <div className="text-[#849495] pl-6">    """</div>
                <div className="bg-[#93000a]/25 text-[#ffdad6] px-2 py-0.5 rounded -mx-1 flex items-center">
                  <span className="w-8 text-[#ffb4ab] select-none text-[10px]">- 46</span>
                  <span>-    # VULNERABLE: Direct string interpolation bypasses query sanitizer</span>
                </div>
                <div className="bg-[#93000a]/25 text-[#ffdad6] px-2 py-0.5 rounded -mx-1 flex items-center">
                  <span className="w-8 text-[#ffb4ab] select-none text-[10px]">- 47</span>
                  <span className="font-semibold">-    query = f"SELECT * FROM users WHERE username = '{'{username}'}' AND password_hash = '{'{pwd_hash}'}'"</span>
                </div>
                <div className="bg-[#93000a]/25 text-[#ffdad6] px-2 py-0.5 rounded -mx-1 flex items-center">
                  <span className="w-8 text-[#ffb4ab] select-none text-[10px]">- 48</span>
                  <span>-    result = db.execute(text(query)).fetchone()</span>
                </div>
                <div className="bg-[#65f2b5]/15 text-[#65f2b5] px-2 py-0.5 rounded -mx-1 flex items-center">
                  <span className="w-8 text-[#4edea3] select-none text-[10px]">+ 46</span>
                  <span>+    # REFACTORED: Bound parameters enforce strict token separation</span>
                </div>
                <div className="bg-[#65f2b5]/15 text-[#65f2b5] px-2 py-0.5 rounded -mx-1 flex items-center font-semibold">
                  <span className="w-8 text-[#4edea3] select-none text-[10px]">+ 47</span>
                  <span>+    query = text("SELECT * FROM users WHERE username = :username AND password_hash = :pwd_hash")</span>
                </div>
                <div className="bg-[#65f2b5]/15 text-[#65f2b5] px-2 py-0.5 rounded -mx-1 flex items-center font-semibold">
                  <span className="w-8 text-[#4edea3] select-none text-[10px]">+ 48</span>
                  <span>+    result = db.execute(query, &#123;"username": username, "pwd_hash": pwd_hash&#125;).fetchone()</span>
                </div>
                <div className="text-[#849495] pl-6">    if not result:</div>
                <div className="text-[#849495] pl-6">        raise AuthenticationError("Invalid username or password")</div>
                <div className="text-[#849495] pl-6">    return UserSchema.model_validate(result)</div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="text-[#849495] py-0.5">@@ -112,8 +112,9 @@ def verify_user_jwt(token: str):</div>
                <div className="bg-[#93000a]/25 text-[#ffdad6] px-2 py-0.5 rounded -mx-1 flex items-center">
                  <span className="w-8 text-[#ffb4ab] select-none text-[10px]">- 113</span>
                  <span>-    claims = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])</span>
                </div>
                <div className="bg-[#65f2b5]/15 text-[#65f2b5] px-2 py-0.5 rounded -mx-1 flex items-center">
                  <span className="w-8 text-[#4edea3] select-none text-[10px]">+ 113</span>
                  <span>+    claims = decode_secure_token(token, options=&#123;"verify_signature": True&#125;)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thought Stream & Verification Checks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Autonomous Thought Stream (7 Cols) */}
          <div className="lg:col-span-7 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#d0bcff]">psychology</span>
                <span className="text-xs text-[#dde2f3] font-semibold">Autonomous Agent Thought Stream</span>
              </div>
              <span className="text-[10px] text-[#65f2b5] font-mono">ALL AGENTS ALIGNED</span>
            </div>

            <div className="space-y-2">
              {proposal.thoughtStream.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#dde2f3] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
                      <span>{item.agent}</span>
                    </span>
                    <span className="text-[10px] text-[#849495] font-mono">Trace #4892</span>
                  </div>
                  <p className="text-xs text-[#b9cacb] leading-relaxed font-sans">{item.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Checklist (5 Cols) */}
          <div className="lg:col-span-5 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#dde2f3] font-semibold">Verification Pipeline Checklist</span>
              <span className="text-[10px] text-[#65f2b5] font-mono">4/4 PASSED</span>
            </div>

            <div className="space-y-2">
              {proposal.verificationChecks.map((chk, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-[#080e1a] border border-[#3b494b]/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#65f2b5]">task_alt</span>
                    <div>
                      <div className="text-xs text-[#dde2f3] font-medium font-sans">{chk.title}</div>
                      <div className="text-[10px] text-[#849495] font-mono">{chk.subtitle}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#65f2b5]/10 text-[#65f2b5] text-[10px] font-mono font-bold">
                    {chk.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#3b494b]/20 flex items-center justify-between text-[10px] font-mono text-[#b9cacb]">
              <span>Coverage Delta:</span>
              <span className="text-[#65f2b5]">89.2% &rarr; 91.4% (+2.2%)</span>
            </div>
          </div>
        </div>

        {/* Human Approval Gate (Bottom Footer Bar) */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#65f2b5]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#65f2b5]/20 text-[#65f2b5] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#dde2f3]">Human Approval Gate // PR Candidate #24</h4>
              <p className="text-xs text-[#b9cacb]">
                Attested by Verification Agent aura-vrf-013 &bull; Cryptographic commit signature ready
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {proposal.applied ? (
              <span className="px-4 py-2 rounded-lg bg-[#65f2b5]/20 text-[#65f2b5] font-mono text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>PATCH APPLIED TO BRANCH</span>
              </span>
            ) : (
              <>
                <button
                  onClick={handleApply}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-[#65f2b5] text-[#002113] hover:opacity-90 font-mono text-xs font-bold shadow-[0_0_16px_rgba(101,242,181,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">merge_type</span>
                  <span>Approve & Apply Patch to Branch</span>
                </button>
                <button
                  onClick={() => onShowToast('Agent instructed to redraft with stricter typing constraints.', 'psychology')}
                  className="px-3 py-2.5 rounded-lg bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] font-mono text-xs font-medium transition-colors cursor-pointer"
                >
                  Request Agent Re-draft
                </button>
                <button
                  onClick={() => onShowToast('Proposal #24 rejected by operator.', 'cancel')}
                  className="px-3 py-2.5 rounded-lg bg-[#242a36] hover:bg-[#93000a]/40 hover:text-[#ffdad6] text-[#b9cacb] font-mono text-xs font-medium transition-colors cursor-pointer"
                >
                  Reject Proposal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
