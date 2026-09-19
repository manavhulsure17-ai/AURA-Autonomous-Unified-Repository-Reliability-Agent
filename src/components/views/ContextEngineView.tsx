import React, { useState } from 'react';
import { ViewKey } from '../../types';

interface ContextEngineViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ContextEngineView: React.FC<ContextEngineViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('authenticate_user');

  const symbols = [
    { name: 'authenticate_user', file: 'backend/auth.py', loc: 45, callers: 4, type: 'Function' },
    { name: 'decode_secure_token', file: 'security/tokens.py', loc: 12, callers: 6, type: 'Function' },
    { name: 'DatabaseConfig', file: 'config/database.py', loc: 15, callers: 12, type: 'Class' },
    { name: 'get_current_user', file: 'api/v1/users.py', loc: 88, callers: 8, type: 'Endpoint' },
    { name: 'checkout_order', file: 'services/checkout_service.py', loc: 104, callers: 3, type: 'Function' },
  ];

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-mono font-semibold">
            Context Engine & AST Semantic Graph
          </span>
          <span className="text-[10px] text-[#849495] font-mono px-1.5 py-0.5 rounded bg-[#242a36]">
            ZERO-HOP SYMBOL RESOLUTION
          </span>
        </div>
        <div className="text-xs font-mono text-[#65f2b5]">84,200 AST Nodes Cached</div>
      </div>

      <div className="px-4 space-y-4">
        {/* Search & Indexing Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">AST Indexing Latency</span>
            <div className="text-2xl font-bold text-[#00f0ff] mt-1 font-mono">0.42ms</div>
            <span className="text-[9px] text-[#65f2b5] font-mono">Real-time cache hit: 99.8%</span>
          </div>
          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">Vector Embeddings</span>
            <div className="text-2xl font-bold text-[#d0bcff] mt-1 font-mono">1,420 Vectors</div>
            <span className="text-[9px] text-[#b9cacb] font-mono">Cosine similarity calibrated</span>
          </div>
          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">Total Monolith LoC</span>
            <div className="text-2xl font-bold text-[#dde2f3] mt-1 font-mono">142,800</div>
            <span className="text-[9px] text-[#00dbe9] font-mono">32 packages mapped</span>
          </div>
          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono">AST Contract Guard</span>
            <div className="text-2xl font-bold text-[#65f2b5] mt-1 font-mono">ENFORCED</div>
            <span className="text-[9px] text-[#65f2b5] font-mono">Zero breaking diffs</span>
          </div>
        </div>

        {/* Semantic Symbol Search & File Tree Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          <div className="lg:col-span-6 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#dde2f3]">Indexed Repository Symbols</span>
              <span className="text-[10px] font-mono text-[#849495]">Python AST v3.12</span>
            </div>

            <div className="flex items-center bg-[#080e1a] px-2.5 py-1.5 rounded-lg border border-[#3b494b]/40">
              <span className="material-symbols-outlined text-[15px] text-[#849495] mr-1.5">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search functions, classes, models..."
                className="w-full bg-transparent text-xs text-[#dde2f3] outline-none font-mono"
              />
            </div>

            <div className="space-y-1 font-mono text-xs max-h-72 overflow-y-auto">
              {symbols
                .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sym) => (
                  <div
                    key={sym.name}
                    onClick={() => setSelectedSymbol(sym.name)}
                    className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                      selectedSymbol === sym.name
                        ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff]'
                        : 'bg-[#080e1a] hover:bg-[#1a202c] text-[#dde2f3]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{sym.name}()</div>
                      <div className="text-[10px] text-[#849495]">
                        {sym.file}:{sym.loc}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-1.5 py-0.5 rounded bg-[#242a36] text-[9px] text-[#b9cacb]">
                        {sym.type}
                      </span>
                      <div className="text-[9px] text-[#65f2b5] mt-0.5">{sym.callers} Callers</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Symbol Details & AST Representation */}
          <div className="lg:col-span-6 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/20">
              <span className="text-xs font-semibold text-[#dde2f3]">Symbol Context Graph: {selectedSymbol}</span>
              <button
                onClick={() => onNavigate('change-impact')}
                className="text-[10px] text-[#00f0ff] hover:underline font-mono"
              >
                Inspect Blast Radius &rarr;
              </button>
            </div>

            <div className="p-3 rounded bg-[#080e1a] font-mono text-xs text-[#b9cacb] space-y-2 border border-[#3b494b]/30">
              <div className="text-[#00dbe9] font-bold">Node AST Definition:</div>
              <pre className="text-[11px] whitespace-pre-wrap leading-relaxed">
{`FunctionDef: ${selectedSymbol}
  args: [db: Session, username: str, pwd_hash: str]
  returns: UserSchema | None
  decorators: [@router.post, @audit_trail]
  complexity: cyclomatic=4 (acceptable)`}
              </pre>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-[#849495] uppercase">Call Ingress Path:</span>
              <div className="p-2 rounded bg-[#080e1a] text-[10px] text-[#65f2b5] space-y-1 border border-[#3b494b]/20">
                <div>Client HTTP Ingress &rarr; FastAPI ASGI &rarr; JWT Middleware &rarr; {selectedSymbol}</div>
              </div>
            </div>

            <button
              onClick={() => onShowToast(`Re-indexed AST embeddings for ${selectedSymbol}`, 'sync')}
              className="w-full py-1.5 rounded bg-[#242a36] hover:bg-[#343946] text-[#00f0ff] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              <span>Re-index Vector Node</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
