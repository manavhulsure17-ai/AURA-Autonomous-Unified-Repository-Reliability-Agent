import React from 'react';
import { ViewKey } from '../../types';

interface CodeHealthViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const CodeHealthView: React.FC<CodeHealthViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#65f2b5] shadow-[0_0_8px_#65f2b5]"></span>
          <span className="text-xs text-[#65f2b5] uppercase tracking-widest font-mono font-semibold">
            Repository Code Health & Maintainability Matrix
          </span>
          <span className="text-[10px] text-[#849495] font-mono px-1.5 py-0.5 rounded bg-[#242a36]">
            CYCLOMATIC BOUNDS: PASS
          </span>
        </div>
        <div className="text-xs font-mono text-[#00f0ff]">Overall Health: 91.4 / 100</div>
      </div>

      <div className="px-4 space-y-4">
        {/* 4 Health Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">Maintainability Index</span>
            <div className="text-2xl font-bold text-[#65f2b5] mt-1 font-mono">88.5 / 100</div>
            <span className="text-[9px] text-[#4edea3] font-mono">Grade A+ (Halstead verified)</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">Code Duplication</span>
            <div className="text-2xl font-bold text-[#dde2f3] mt-1 font-mono">1.8%</div>
            <span className="text-[9px] text-[#65f2b5] font-mono">-0.6% after token deduplication</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">Cyclomatic Bottlenecks</span>
            <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">4 Modules</div>
            <span className="text-[9px] text-[#b9cacb] font-mono">Max complexity: 14 in checkout</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">Dead Code Tokens</span>
            <div className="text-2xl font-bold text-[#00f0ff] mt-1 font-mono">0 Tokens</div>
            <span className="text-[9px] text-[#65f2b5] font-mono">Tree-shaking clean</span>
          </div>
        </div>

        {/* Modules breakdown */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#dde2f3]">Module Maintainability Breakdown</span>
            <button
              onClick={() => onNavigate('refactoring')}
              className="text-xs text-[#00f0ff] hover:underline font-mono"
            >
              Stage Refactoring &rarr;
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between border border-[#3b494b]/20">
              <div>
                <div className="text-[#dde2f3] font-bold">backend/auth.py</div>
                <div className="text-[10px] text-[#849495]">45 lines &bull; Cyclomatic complexity: 8 &bull; Patch ready</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] text-[10px] font-bold">
                NEEDS REFACTOR
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between border border-[#3b494b]/20">
              <div>
                <div className="text-[#dde2f3] font-bold">services/checkout_service.py</div>
                <div className="text-[10px] text-[#849495]">104 lines &bull; Cyclomatic complexity: 14 &bull; Nested conditionals</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                MEDIUM RISK
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between border border-[#3b494b]/20">
              <div>
                <div className="text-[#dde2f3] font-bold">security/tokens.py</div>
                <div className="text-[10px] text-[#849495]">28 lines &bull; Cyclomatic complexity: 2 &bull; Modular pure functions</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#65f2b5]/20 text-[#65f2b5] text-[10px] font-bold">
                PRISTINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
