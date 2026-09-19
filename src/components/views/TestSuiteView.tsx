import React, { useState } from 'react';
import { ViewKey } from '../../types';

interface TestSuiteViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
  initialFailureMode?: boolean;
}

export const TestSuiteView: React.FC<TestSuiteViewProps> = ({
  onNavigate,
  onShowToast,
  initialFailureMode = false,
}) => {
  const [running, setRunning] = useState(false);
  const [hasFailedTest, setHasFailedTest] = useState(initialFailureMode);
  const [debugPhase, setDebugPhase] = useState<'idle' | 'investigating' | 'root_cause_found' | 'repaired'>('idle');

  const testCases = [
    {
      id: 'TEST-01',
      name: 'test_auth_parameterized_query_syntax',
      file: 'tests/test_auth.py',
      duration: '42ms',
      status: hasFailedTest ? 'failed' : 'passed',
      error: hasFailedTest
        ? 'AssertionError: Expected 401 Unauthorized, got 500 InternalServerError (backend/auth.py:47)'
        : undefined,
    },
    { id: 'TEST-02', name: 'test_sqli_exploit_rejection', file: 'tests/test_auth.py', duration: '68ms', status: 'passed' },
    { id: 'TEST-03', name: 'test_jwt_token_claims_decode', file: 'tests/test_jwt.py', duration: '18ms', status: 'passed' },
    { id: 'TEST-04', name: 'test_database_pool_overflow_handling', file: 'tests/test_db.py', duration: '124ms', status: 'passed' },
    { id: 'TEST-05', name: 'test_checkout_order_concurrency', file: 'tests/test_orders.py', duration: '310ms', status: 'passed' },
    { id: 'TEST-06', name: 'test_admin_rbac_permission_matrix', file: 'tests/test_rbac.py', duration: '89ms', status: 'passed' },
    { id: 'TEST-07', name: 'test_user_profile_cache_invalidation', file: 'tests/test_users.py', duration: '34ms', status: 'passed' },
    { id: 'TEST-08', name: 'test_fastapi_rate_limiter_window', file: 'tests/test_rate_limit.py', duration: '52ms', status: 'passed' },
    { id: 'TEST-09', name: 'test_audit_logger_async_worker_queue', file: 'tests/test_audit.py', duration: '28ms', status: 'passed' },
    { id: 'TEST-10', name: 'test_password_hash_bcrypt_timing', file: 'tests/test_auth.py', duration: '412ms', status: 'passed' },
    { id: 'TEST-11', name: 'test_session_cookie_samesite_strict', file: 'tests/test_auth.py', duration: '16ms', status: 'passed' },
    { id: 'TEST-12', name: 'test_migration_schema_idempotency', file: 'tests/test_schema.py', duration: '95ms', status: 'passed' },
  ];

  const handleRunAll = () => {
    setRunning(true);
    onShowToast('Dispatched pytest suite in Docker container aura-sandbox-c1...', 'science');
    setTimeout(() => {
      setRunning(false);
      setHasFailedTest(false);
      setDebugPhase('idle');
      onShowToast('Pytest complete: All 12 deterministic tests PASSED.', 'verified');
    }, 1400);
  };

  const handleTriggerDemoFailure = () => {
    setRunning(true);
    onShowToast('Executing pytest suite with unpatched query (Demo Step 10)...', 'science');
    setTimeout(() => {
      setRunning(false);
      setHasFailedTest(true);
      setDebugPhase('idle');
      onShowToast('FAILED: test_auth_parameterized_query_syntax. Debug Agent alerted!', 'error');
    }, 1200);
  };

  const handleDebugInvestigate = () => {
    setDebugPhase('investigating');
    onShowToast('Debug Agent inspecting AST symbols and pytest trace...', 'psychology');
    setTimeout(() => {
      setDebugPhase('root_cause_found');
      onShowToast('Debug Agent identified root cause (Confidence: 94%)', 'verified');
    }, 1500);
  };

  const handleGenerateRepair = () => {
    onShowToast('Synthesizing AST parameterization patch for backend/auth.py...', 'build');
    setTimeout(() => {
      setDebugPhase('repaired');
      onShowToast('Repair patch generated and staged for sandbox test.', 'task_alt');
    }, 1200);
  };

  const handleReRunTestsPass = () => {
    setRunning(true);
    onShowToast('Re-running pytest suite with applied repair in Docker sandbox...', 'science');
    setTimeout(() => {
      setRunning(false);
      setHasFailedTest(false);
      setDebugPhase('idle');
      onShowToast('ALL 12/12 TESTS PASSED! Regression verified cleanly.', 'verified');
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${hasFailedTest ? 'bg-[#ffb4ab] animate-pulse' : 'bg-[#65f2b5]'}`}></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            Deterministic Sandbox Test Suite (Sections 9 & 33)
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            DOCKER: aura-sandbox-c1
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!hasFailedTest ? (
            <button
              onClick={handleTriggerDemoFailure}
              className="px-2.5 py-1.5 rounded bg-[#93000a]/30 border border-[#ffb4ab]/40 hover:bg-[#93000a]/50 text-[#ffdad6] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              title="Demo Step 10: Run tests with intentional failure"
            >
              <span className="material-symbols-outlined text-[15px]">bug_report</span>
              <span>Trigger Test Failure (Demo Step 10)</span>
            </button>
          ) : (
            <button
              onClick={handleDebugInvestigate}
              className="px-3 py-1.5 rounded bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              <span className="material-symbols-outlined text-[15px]">psychology</span>
              <span>Debug Agent Investigate (Demo Step 11)</span>
            </button>
          )}

          <button
            onClick={handleRunAll}
            disabled={running}
            className="px-3 py-1.5 rounded bg-[#242a36] hover:bg-[#323948] text-[#dde2f3] text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[15px] ${running ? 'animate-spin' : ''}`}>
              {running ? 'refresh' : 'play_arrow'}
            </span>
            <span>{running ? 'Running...' : 'Run All Tests'}</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className={`p-3 rounded-xl border shadow-md ${hasFailedTest ? 'bg-[#93000a]/20 border-[#ffb4ab]/40' : 'bg-[#161c28] border-[#65f2b5]/30'}`}>
            <span className="text-[10px] text-[#849495] uppercase">Tests Passed</span>
            <div className={`text-2xl font-bold mt-1 ${hasFailedTest ? 'text-[#ffb4ab]' : 'text-[#65f2b5]'}`}>
              {hasFailedTest ? '11 / 12' : '12 / 12'}
            </div>
            <span className="text-[9px] text-[#849495]">
              {hasFailedTest ? '1 Regression Failure Detected' : '100% Deterministic Pass'}
            </span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase">Total Execution Time</span>
            <div className="text-2xl font-bold text-[#00f0ff] mt-1">842ms</div>
            <span className="text-[9px] text-[#b9cacb]">Isolated container execution</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase">Branch Coverage</span>
            <div className="text-2xl font-bold text-[#dde2f3] mt-1">92.8%</div>
            <span className="text-[9px] text-[#65f2b5]">+1.4% with patch</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase">Flakiness Score</span>
            <div className="text-2xl font-bold text-[#65f2b5] mt-1">0.00%</div>
            <span className="text-[9px] text-[#4edea3]">Deterministic assertion gates</span>
          </div>
        </div>

        {/* Debug Agent Investigation Box (When Failure Active) */}
        {hasFailedTest && (
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#ffb4ab]/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4ab]">emergency</span>
                <h3 className="text-sm font-bold text-[#ffdad6]">
                  Regression Failure: test_auth_parameterized_query_syntax
                </h3>
              </div>
              <span className="text-xs text-[#849495]">Docker Task: SB-PYTEST-902</span>
            </div>

            {/* Error message */}
            <div className="p-3 rounded bg-[#080e1a] text-xs font-mono text-[#ffb4ab] border border-[#93000a]/40">
              FAILED tests/test_auth.py:24: AssertionError: Expected 401 Unauthorized, got 500 InternalServerError
              <br />
              <span className="text-[#b9cacb]">
                &gt; query = f"SELECT id, username, role FROM users WHERE username = '{'{username}'}'"
              </span>
              <br />
              <span className="text-[#849495]">
                Syntax escape in test input payload triggered unhandled database SQL parse exception.
              </span>
            </div>

            {/* Debug Agent Status */}
            {debugPhase === 'investigating' && (
              <div className="p-3 rounded bg-[#080e1a] text-xs text-[#00f0ff] flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[18px]">psychology</span>
                <span>Debug Agent analyzing AST call stack, commit diffs, and parameter bounds...</span>
              </div>
            )}

            {(debugPhase === 'root_cause_found' || debugPhase === 'repaired') && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded bg-[#080e1a] border border-[#00f0ff]/30 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00f0ff] uppercase text-[11px]">
                      Root Cause Analysis (Demo Step 12 &bull; Confidence: 94%)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#65f2b5]/20 text-[#65f2b5] text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[#dde2f3] font-sans">
                    The query uses raw f-string formatting. When an unescaped single quote enters the username, SQLAlchemy raises a raw psycopg2.ProgrammingError instead of returning 401, resulting in an unhandled 500 InternalServerError.
                  </p>
                  <div className="text-[11px] text-[#b9cacb]">
                    <strong>Remediation:</strong> Replace raw string formatting with SQLAlchemy <code className="text-[#65f2b5]">text(:username)</code> bound parameters.
                  </div>
                </div>

                {debugPhase === 'root_cause_found' && (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={handleGenerateRepair}
                      className="px-4 py-2 rounded bg-[#00f0ff] text-[#00363a] font-bold text-xs hover:bg-[#7df4ff] flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                    >
                      <span className="material-symbols-outlined text-[16px]">build</span>
                      <span>Generate Repair (Demo Step 13)</span>
                    </button>
                  </div>
                )}

                {debugPhase === 'repaired' && (
                  <div className="p-3 rounded bg-[#65f2b5]/10 border border-[#65f2b5]/40 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#65f2b5]">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span><strong>Repair Staged:</strong> Parameterized query binding synthesized successfully.</span>
                    </div>
                    <button
                      onClick={handleReRunTestsPass}
                      className="px-4 py-1.5 rounded bg-[#65f2b5] text-[#003822] font-bold text-xs hover:bg-[#8bf7c5] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      <span>Run Tests Again (Demo Step 14: 12/12 Pass) &rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Test List Table */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">task_alt</span>
              <span className="text-sm font-semibold text-[#dde2f3]">Pytest Suite Execution</span>
            </div>
            <span className="text-xs text-[#849495]">12 test cases</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#3b494b]/30 text-[10px] text-[#849495] uppercase">
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Test Case</th>
                  <th className="py-2 px-2">File</th>
                  <th className="py-2 px-2">Duration</th>
                  <th className="py-2 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b494b]/20">
                {testCases.map((tc) => (
                  <tr key={tc.id} className={tc.status === 'failed' ? 'bg-[#93000a]/20' : 'hover:bg-[#1a202c]'}>
                    <td className="py-2 px-2 text-[#00f0ff] font-semibold">{tc.id}</td>
                    <td className="py-2 px-2 text-[#dde2f3] font-sans font-medium">
                      {tc.name}
                      {tc.error && (
                        <div className="text-[10px] text-[#ffb4ab] font-mono mt-0.5">{tc.error}</div>
                      )}
                    </td>
                    <td className="py-2 px-2 text-[#b9cacb] text-[11px]">{tc.file}</td>
                    <td className="py-2 px-2 text-[#849495] text-[11px]">{tc.duration}</td>
                    <td className="py-2 px-2 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tc.status === 'passed'
                            ? 'bg-[#65f2b5]/15 text-[#65f2b5]'
                            : 'bg-[#ffdad6] text-[#93000a]'
                        }`}
                      >
                        {tc.status.toUpperCase()}
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
