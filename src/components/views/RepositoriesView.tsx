import React, { useState } from 'react';
import { ViewKey } from '../../types';
import { DEMO_REPO_FILES, DEMO_GIT_COMMITS, RepoFile } from '../../data/demoRepo';

interface RepositoriesViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onRunAnalysis?: () => void;
}

export const RepositoriesView: React.FC<RepositoriesViewProps> = ({
  onNavigate,
  onShowToast,
  onRunAnalysis,
}) => {
  const [selectedFile, setSelectedFile] = useState<RepoFile>(DEMO_REPO_FILES[0]);
  const [activeTab, setActiveTab] = useState<'files' | 'commits' | 'ast'>('files');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const handleAnalyzeRepo = () => {
    setIsAnalyzing(true);
    onShowToast('Ingesting repository AST graph & dispatching 13 agents...', 'bolt');
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
      if (onRunAnalysis) onRunAnalysis();
      onShowToast('Analysis complete: 142 files indexed, 1 critical security finding in backend/auth.py', 'verified');
    }, 1600);
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            Repository Context Engine & File Explorer
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            demo-ecommerce-api (main)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyzeRepo}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[15px] ${isAnalyzing ? 'animate-spin' : ''}`}>
              {isAnalyzing ? 'refresh' : 'psychology'}
            </span>
            <span>{isAnalyzing ? 'Analyzing Repository...' : 'Analyze Repository'}</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Repo Header Card */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">account_tree</span>
              <h2 className="text-base font-bold text-[#dde2f3]">github.com/aura-corp/demo-ecommerce-api</h2>
              <span className="px-2 py-0.5 rounded bg-[#65f2b5]/20 text-[#65f2b5] text-[10px] font-bold">
                SYNCHRONIZED
              </span>
            </div>
            <p className="text-xs text-[#b9cacb] font-sans">
              High-throughput FastAPI e-commerce backend with Postgres Aurora and Stripe integration.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-[10px] text-[#849495] block">BRANCH</span>
              <span className="text-[#00dbe9] font-bold">main (4a9f81d)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#849495] block">FILES INDEXED</span>
              <span className="text-[#dde2f3] font-bold">142 Files (84k AST)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#849495] block">FRAMEWORK</span>
              <span className="text-[#65f2b5] font-bold">Python 3.12 / FastAPI</span>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-[#3b494b]/30 pb-2">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                : 'text-[#b9cacb] hover:bg-[#242a36]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">folder_open</span>
            <span>File Browser ({DEMO_REPO_FILES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('commits')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'commits'
                ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                : 'text-[#b9cacb] hover:bg-[#242a36]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>Git History ({DEMO_GIT_COMMITS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ast')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ast'
                ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                : 'text-[#b9cacb] hover:bg-[#242a36]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">schema</span>
            <span>AST Semantic Graph</span>
          </button>
        </div>

        {/* Tab 1: File Browser & Code Viewer */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* File List (4 Cols) */}
            <div className="lg:col-span-4 bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
              <div className="text-xs font-semibold text-[#dde2f3] flex items-center justify-between pb-1 border-b border-[#3b494b]/20">
                <span>Repository Tree</span>
                <span className="text-[10px] text-[#849495]">Click to view</span>
              </div>

              <div className="space-y-1">
                {DEMO_REPO_FILES.map((file) => (
                  <div
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`p-2 rounded cursor-pointer transition-all flex items-center justify-between text-xs ${
                      selectedFile.path === file.path
                        ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff] font-semibold'
                        : 'bg-[#080e1a] hover:bg-[#1a202c] text-[#dde2f3]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[15px] text-[#849495]">
                        {file.path.endsWith('.py') ? 'code' : file.path.endsWith('.yml') ? 'tune' : 'description'}
                      </span>
                      <span className="truncate">{file.path}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {file.hasVulnerability && (
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" title="Vulnerability detected"></span>
                      )}
                      <span className="text-[10px] text-[#849495]">{file.loc} L</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Summary Callout */}
              <div className="p-2.5 rounded bg-[#080e1a] border border-[#3b494b]/20 text-[11px] text-[#b9cacb] space-y-1.5 font-sans">
                <div className="font-mono text-[10px] text-[#00f0ff] uppercase font-bold">Context Engine Summary:</div>
                <div>&bull; 1 Vulnerability flagged in <code className="text-[#ffb4ab]">backend/auth.py:47</code></div>
                <div>&bull; 1 Incident config in <code className="text-amber-400">config/database.py:15</code></div>
                <div>&bull; Deterministic Pytest: <span className="text-[#65f2b5]">12 test cases ready</span></div>
              </div>
            </div>

            {/* Code Viewer (8 Cols) */}
            <div className="lg:col-span-8 bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f0ff] text-[16px]">file_open</span>
                  <span className="text-xs font-bold text-[#dde2f3]">{selectedFile.path}</span>
                  <span className="text-[10px] text-[#849495]">({selectedFile.size} &bull; {selectedFile.loc} lines)</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFile.hasVulnerability && (
                    <button
                      onClick={() => onNavigate('security-center')}
                      className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] text-[10px] font-bold hover:bg-[#b50012] cursor-pointer"
                    >
                      Inspect Vulnerability &rarr;
                    </button>
                  )}
                  {selectedFile.path.includes('auth.py') && (
                    <button
                      onClick={() => onNavigate('refactoring')}
                      className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-bold hover:bg-[#00f0ff]/30 cursor-pointer"
                    >
                      View Proposed Patch &rarr;
                    </button>
                  )}
                </div>
              </div>

              {selectedFile.hasVulnerability && (
                <div className="p-2 rounded bg-[#93000a]/20 border border-[#ffb4ab]/40 text-xs text-[#ffdad6] flex items-center gap-2 font-sans">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">warning</span>
                  <span><strong>Flagged by Security Agent:</strong> {selectedFile.vulnSummary}</span>
                </div>
              )}

              {/* Code with Line Numbers */}
              <div className="bg-[#080e1a] rounded-lg p-3 border border-[#3b494b]/30 font-mono text-xs overflow-x-auto max-h-[500px]">
                <table className="w-full text-left">
                  <tbody>
                    {selectedFile.content.split('\n').map((line, idx) => {
                      const lineNum = idx + 1;
                      const isTargetLine = selectedFile.path === 'backend/auth.py' && lineNum >= 20 && lineNum <= 22;
                      return (
                        <tr
                          key={lineNum}
                          className={`${
                            isTargetLine ? 'bg-[#93000a]/30 border-l-2 border-[#ffb4ab]' : 'hover:bg-[#1a202c]/50'
                          }`}
                        >
                          <td className="w-10 pr-3 text-right text-[#849495] select-none text-[11px]">
                            {lineNum}
                          </td>
                          <td className="text-[#dde2f3] whitespace-pre pl-2">
                            {line}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Commits History */}
        {activeTab === 'commits' && (
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <span className="text-xs font-semibold text-[#dde2f3]">Recent Git Commits</span>
            <div className="space-y-2">
              {DEMO_GIT_COMMITS.map((c) => (
                <div key={c.hash} className="p-3 rounded bg-[#080e1a] border border-[#3b494b]/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="text-[#00f0ff] font-bold">{c.hash}</code>
                      <span className="text-xs text-[#dde2f3] font-medium">{c.message}</span>
                    </div>
                    <div className="text-[10px] text-[#849495] flex items-center gap-3">
                      <span>Author: {c.author}</span>
                      <span>&bull;</span>
                      <span>{c.date}</span>
                      <span>&bull;</span>
                      <span>{c.filesChanged} file changed (+{c.insertions}, -{c.deletions})</span>
                    </div>
                  </div>

                  {c.hash === '8f3c11d' && (
                    <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] text-[10px] font-bold">
                      CORRELATED TO INC-001
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AST Semantic Graph */}
        {activeTab === 'ast' && (
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#dde2f3]">AST Semantic Symbol Mesh</span>
              <button
                onClick={() => onNavigate('context-engine')}
                className="text-xs text-[#00f0ff] hover:underline"
              >
                Open Full Context Engine &rarr;
              </button>
            </div>
            <div className="p-4 rounded bg-[#080e1a] text-xs text-[#b9cacb] space-y-2">
              <div>Total AST Nodes Cached: <strong className="text-[#65f2b5]">84,200</strong></div>
              <div>Root module: <code>backend/auth.py</code> &rarr; Caller hierarchy: 4 endpoints &rarr; Callee dependencies: 3</div>
              <div className="text-[11px] text-[#849495]">All AST symbols are parsed deterministically without hallucination risk.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
