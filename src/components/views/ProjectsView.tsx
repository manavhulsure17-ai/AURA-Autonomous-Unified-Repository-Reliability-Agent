import React, { useState } from 'react';
import { ViewKey } from '../../types';

interface ProjectsViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate, onShowToast }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('main');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) {
      onShowToast('Please enter a project name', 'error');
      return;
    }
    setShowCreateModal(false);
    onShowToast(`Project "${projectName}" registered and queued for Context Engine indexing.`, 'task_alt');
    setProjectName('');
    setRepoUrl('');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            Projects & Multi-Repository Workspaces
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            3 Active Projects
          </span>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 rounded bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">add</span>
          <span>Connect Repository / Create Project</span>
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Demo Project */}
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#00f0ff]/40 shadow-lg relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-bold">
                  PRIMARY TARGET
                </span>
                <h3 className="text-sm font-bold text-[#dde2f3] mt-2">demo-ecommerce-api</h3>
                <p className="text-xs text-[#849495] font-sans mt-1">
                  FastAPI core banking and checkout service with PostgreSQL Aurora cluster.
                </p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#65f2b5] shadow-[0_0_6px_#65f2b5]"></span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#3b494b]/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#849495]">HEALTH SCORE</span>
                <span className="text-[#65f2b5] font-bold block">84/100</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#849495]">VULNERABILITIES</span>
                <span className="text-[#ffb4ab] font-bold block">1 Critical</span>
              </div>
              <button
                onClick={() => onNavigate('repositories')}
                className="px-2.5 py-1 rounded bg-[#00f0ff] text-[#00363a] font-bold text-[11px] hover:bg-[#7df4ff] cursor-pointer"
              >
                Inspect &rarr;
              </button>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#242a36] text-[#b9cacb] text-[10px] font-bold">
                  SECONDARY
                </span>
                <h3 className="text-sm font-bold text-[#dde2f3] mt-2">customer-portal-spa</h3>
                <p className="text-xs text-[#849495] font-sans mt-1">
                  React 19 single-page client dashboard with Vite and Tailwind v4.
                </p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#65f2b5]"></span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#3b494b]/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#849495]">HEALTH SCORE</span>
                <span className="text-[#65f2b5] font-bold block">96/100</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#849495]">TEST COVERAGE</span>
                <span className="text-[#00dbe9] font-bold block">94.2%</span>
              </div>
              <button
                onClick={() => onShowToast('Switched context to customer-portal-spa', 'sync')}
                className="px-2.5 py-1 rounded bg-[#242a36] text-[#dde2f3] font-medium text-[11px] hover:bg-[#323948] cursor-pointer"
              >
                Switch
              </button>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#242a36] text-[#b9cacb] text-[10px] font-bold">
                  BACKGROUND WORKER
                </span>
                <h3 className="text-sm font-bold text-[#dde2f3] mt-2">payment-webhook-worker</h3>
                <p className="text-xs text-[#849495] font-sans mt-1">
                  Go-based async event consumer for Stripe webhooks and Kafka topics.
                </p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#65f2b5]"></span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#3b494b]/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#849495]">HEALTH SCORE</span>
                <span className="text-[#65f2b5] font-bold block">91/100</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#849495]">STATUS</span>
                <span className="text-[#65f2b5] font-bold block">HEALTHY</span>
              </div>
              <button
                onClick={() => onShowToast('Switched context to payment-webhook-worker', 'sync')}
                className="px-2.5 py-1 rounded bg-[#242a36] text-[#dde2f3] font-medium text-[11px] hover:bg-[#323948] cursor-pointer"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Creating Project */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161c28] border border-[#00f0ff]/50 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff]">account_tree</span>
                <h3 className="text-sm font-bold text-[#dde2f3]">Connect Git Repository to AURA</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#849495] hover:text-[#dde2f3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b9cacb] mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. billing-microservice"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#080e1a] border border-[#3b494b]/40 text-[#dde2f3] outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-[#b9cacb] mb-1">Repository URL (Git / GitHub / GitLab)</label>
                <input
                  type="text"
                  placeholder="https://github.com/org/repo.git"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#080e1a] border border-[#3b494b]/40 text-[#dde2f3] outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-[#b9cacb] mb-1">Default Branch</label>
                <input
                  type="text"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#080e1a] border border-[#3b494b]/40 text-[#dde2f3] outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="p-3 rounded bg-[#080e1a] border border-[#3b494b]/20 text-[11px] text-[#849495] space-y-1 font-sans">
                <div>&bull; AURA will automatically index AST syntax graphs, symbols, and dependencies.</div>
                <div>&bull; Code execution occurs strictly within isolated Docker sandboxes.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-[#242a36] text-[#b9cacb] hover:bg-[#323948] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#00f0ff] text-[#00363a] font-bold hover:bg-[#7df4ff] cursor-pointer"
                >
                  Index & Initialize Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
