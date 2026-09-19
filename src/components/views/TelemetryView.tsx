import React, { useState } from 'react';
import { ViewKey } from '../../types';

interface TelemetryViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ onNavigate, onShowToast }) => {
  const [isSurgeActive, setIsSurgeActive] = useState(false);

  const toggleSurge = () => {
    setIsSurgeActive((prev) => !prev);
    if (!isSurgeActive) {
      onShowToast('Simulating traffic surge of 250 req/sec...', 'warning');
    } else {
      onShowToast('Traffic returned to baseline (42 req/sec).', 'check');
    }
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            Telemetry & Observability Center (Section 11)
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            OpenTelemetry Collector &bull; 100ms Ingestion
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSurge}
            className={`px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isSurgeActive
                ? 'bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab]'
                : 'bg-[#242a36] text-[#b9cacb] hover:bg-[#323948]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isSurgeActive ? 'bolt' : 'speed'}
            </span>
            <span>{isSurgeActive ? 'Disable Load Surge' : 'Simulate Load Surge'}</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495]">P99 RESPONSE LATENCY</span>
            <div className={`text-2xl font-bold mt-1 ${isSurgeActive ? 'text-[#ffb4ab]' : 'text-[#00f0ff]'}`}>
              {isSurgeActive ? '4,820 ms' : '38 ms'}
            </div>
            <span className="text-[10px] text-[#849495] font-sans">
              {isSurgeActive ? '▲ SLA Breached (>200ms)' : '▼ Nominal (SLA <200ms)'}
            </span>
          </div>

          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495]">HTTP 500 ERROR RATE</span>
            <div className={`text-2xl font-bold mt-1 ${isSurgeActive ? 'text-[#ffb4ab]' : 'text-[#65f2b5]'}`}>
              {isSurgeActive ? '18.4%' : '0.01%'}
            </div>
            <span className="text-[10px] text-[#849495] font-sans">
              {isSurgeActive ? '142 failed requests/min' : '1 failed request/day'}
            </span>
          </div>

          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495]">REQUEST THROUGHPUT</span>
            <div className="text-2xl font-bold text-[#dde2f3] mt-1">
              {isSurgeActive ? '254 req/s' : '42 req/s'}
            </div>
            <span className="text-[10px] text-[#849495] font-sans">Across 4 Kubernetes pods</span>
          </div>

          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495]">DB CONNECTION POOL</span>
            <div className={`text-2xl font-bold mt-1 ${isSurgeActive ? 'text-amber-400' : 'text-[#65f2b5]'}`}>
              {isSurgeActive ? '5 / 5 (100%)' : '14 / 50 (28%)'}
            </div>
            <span className="text-[10px] text-[#849495] font-sans">
              {isSurgeActive ? 'Queue exhausted: 84 waiting' : 'Healthy margin: 36 idle'}
            </span>
          </div>
        </div>

        {/* Live Sparkline Visuals */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#dde2f3]">Latency & Error Telemetry Stream</span>
              <p className="text-[11px] text-[#849495] font-sans">Real-time sampling from OpenTelemetry Go/Python SDKs</p>
            </div>
            <span className="text-[10px] text-[#65f2b5] px-2 py-0.5 rounded bg-[#65f2b5]/20 font-bold">
              LIVE (100ms)
            </span>
          </div>

          <div className="h-32 bg-[#080e1a] rounded-lg p-3 border border-[#3b494b]/20 flex items-end justify-between gap-1">
            {[24, 28, 25, 32, 38, 42, 35, 30, 28, 36, 40, isSurgeActive ? 95 : 34, isSurgeActive ? 100 : 38, isSurgeActive ? 98 : 31, isSurgeActive ? 92 : 36, isSurgeActive ? 99 : 35].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    val > 60 ? 'bg-[#ffb4ab] shadow-[0_0_8px_#ffb4ab]' : 'bg-[#00f0ff]'
                  }`}
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[8px] text-[#849495] select-none">{idx * 2}s</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Raw Log Ingestion */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
            <span className="text-xs font-bold text-[#dde2f3]">Live OpenTelemetry Log Ingestion</span>
            <span className="text-[10px] text-[#00dbe9]">Filter: service=ecommerce-api</span>
          </div>

          <div className="bg-[#080e1a] rounded-lg p-3 text-[11px] font-mono space-y-1 max-h-48 overflow-y-auto border border-[#3b494b]/20">
            <div className="text-[#65f2b5]">[10:14:28.102] INFO  [fastapi.access] GET /api/v1/health 200 OK 4.2ms</div>
            <div className="text-[#b9cacb]">[10:14:28.180] INFO  [checkout] User 4820 initiated checkout session</div>
            {isSurgeActive ? (
              <>
                <div className="text-[#ffb4ab] font-bold">[10:14:28.450] ERROR [sqlalchemy.pool] QueuePool size limit 5 reached, timeout waiting for connection</div>
                <div className="text-[#ffb4ab] font-bold">[10:14:28.451] ERROR [uvicorn.error] Exception in ASGI application: TimeoutError</div>
                <div className="text-amber-400">[10:14:28.512] WARN  [k8s.probes] Readiness probe failed: connection refused</div>
              </>
            ) : (
              <div className="text-[#65f2b5]">[10:14:28.500] INFO  [checkout] Order #1042 processed successfully in 28ms</div>
            )}
            <div className="text-[#849495]">[10:14:29.001] DEBUG [otel.exporter] Exported 14 batch spans to collector endpoint</div>
          </div>
        </div>
      </div>
    </div>
  );
};
