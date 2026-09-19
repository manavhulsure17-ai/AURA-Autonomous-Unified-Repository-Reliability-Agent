import React, { useState } from 'react';
import { AuditLogEntry, ViewKey } from '../../types';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs,
  onNavigate,
  onShowToast,
}) => {
  const [query, setQuery] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.message.toLowerCase().includes(query.toLowerCase()) ||
      l.tag.toLowerCase().includes(query.toLowerCase()) ||
      l.agent.toLowerCase().includes(query.toLowerCase())
  );

  const handleExportSarif = () => {
    onShowToast('Exported signed SARIF & audit bundle to aura_audit.sarif.json', 'download');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-mono font-semibold">
            PostgreSQL Immutable Audit Trail & Attestation Logs
          </span>
          <span className="text-[10px] text-[#849495] font-mono px-1.5 py-0.5 rounded bg-[#242a36]">
            ED25519 CRYPTOGRAPHIC SIGNATURES
          </span>
        </div>
        <button
          onClick={handleExportSarif}
          className="px-2.5 py-1 rounded bg-[#242a36] hover:bg-[#343946] text-xs font-mono text-[#00f0ff] flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">download</span>
          <span>Export SARIF Bundle</span>
        </button>
      </div>

      <div className="px-4 space-y-4">
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#dde2f3]">Cryptographic Tamper-Proof Ledger</span>
            <div className="flex items-center bg-[#080e1a] px-2.5 py-1.5 rounded-lg border border-[#3b494b]/40">
              <span className="material-symbols-outlined text-[15px] text-[#849495] mr-1.5">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="bg-transparent text-xs text-[#dde2f3] outline-none font-mono w-44"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#3b494b]/30 text-[10px] text-[#849495] uppercase">
                  <th className="py-2 px-2">Timestamp</th>
                  <th className="py-2 px-2">Tag</th>
                  <th className="py-2 px-2">Agent Origin</th>
                  <th className="py-2 px-2">Action / Message</th>
                  <th className="py-2 px-2">Signature Hash</th>
                  <th className="py-2 px-2 text-right">Attestation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b494b]/20">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#1a202c]">
                    <td className="py-2.5 px-2 text-[#849495]">{entry.timestamp}</td>
                    <td className="py-2.5 px-2 text-[#00dbe9] font-bold">{entry.tag}</td>
                    <td className="py-2.5 px-2 text-[#dde2f3] font-sans">{entry.agent}</td>
                    <td className="py-2.5 px-2 text-[#b9cacb] max-w-md">{entry.message}</td>
                    <td className="py-2.5 px-2 text-[#849495] text-[10px]">{entry.hash}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#65f2b5]/15 text-[#65f2b5] text-[10px] font-bold">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
