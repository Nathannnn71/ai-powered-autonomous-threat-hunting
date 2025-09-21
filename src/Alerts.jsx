import React, { useEffect, useState } from "react";
import LogDetails from "./components/LogDetails";

// This page now shows abnormal logs (category === 'abnormal') from the same S3 source
// used by the Dashboard (latest_analysis.json). Each log can be acknowledged.

export default function Alerts() {
  const [abnormalLogs, setAbnormalLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(true);
  const [ackIds, setAckIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('ack_abnormal_logs') || '[]'));
    } catch {
      return new Set();
    }
  });

  // Persist acknowledgements
  useEffect(() => {
    localStorage.setItem('ack_abnormal_logs', JSON.stringify(Array.from(ackIds)));
  }, [ackIds]);

  useEffect(() => {
    async function fetchAbnormal() {
      setLoading(true);
      setError(null);
      const S3_BASE = import.meta.env.VITE_S3_URL || 'https://wazuh-results.s3.us-east-1.amazonaws.com';
      const url = `${S3_BASE}/latest_analysis.json?ts=${Date.now()}`;
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const allLogs = Array.isArray(data.logs) ? data.logs : [];
        const abnormal = allLogs.filter(l => (l.category || l.classification) === 'abnormal');
        // Ensure each log has a stable id
        const withIds = abnormal.map((l, i) => ({
          ...l,
          __uid: l.log_id || l.id || `abn-${i}-${l.src_ip || ''}`
        }));
        setAbnormalLogs(withIds);
      } catch (e) {
        console.error('[Alerts] Failed to fetch abnormal logs:', e);
        setError(e.message || 'Failed fetching logs');
        setAbnormalLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAbnormal();
  }, []);

  function acknowledgeOne(id) {
    setAckIds(prev => new Set(prev).add(id));
  }
  function acknowledgeAll() {
    const remaining = visibleLogs.map(l => l.__uid);
    if (remaining.length === 0) return;
    setAckIds(prev => {
      const next = new Set(prev);
      remaining.forEach(id => next.add(id));
      return next;
    });
  }

  const visibleLogs = abnormalLogs.filter(l => !ackIds.has(l.__uid));

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between bg-white border rounded px-4 py-2 shadow-sm">
        <h1 className="text-xl font-bold">Abnormal Logs</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShow(s => !s)}
            className="px-3 py-1 text-sm rounded bg-slate-100 hover:bg-slate-200"
          >
            {show ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={acknowledgeAll}
            disabled={visibleLogs.length === 0}
            className="px-3 py-1 text-sm rounded bg-rose-100 hover:bg-rose-200 disabled:opacity-40"
          >
            Acknowledge All
          </button>
        </div>
      </header>

      {loading && (
        <div className="text-sm text-slate-500">Loading abnormal logs…</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {show && !loading && !error && (
        <div className="border rounded-md">
          <div className="w-full flex items-center justify-between px-3 py-2 bg-rose-50 rounded-t-md">
            <span className="font-semibold text-rose-700">Abnormal Logs ({visibleLogs.length})</span>
            <span className="text-xs text-rose-700">{abnormalLogs.length - visibleLogs.length} acknowledged</span>
          </div>
          <div className="max-h-[600px] overflow-auto px-3 py-3 space-y-3 bg-white">
            {visibleLogs.map(l => (
              <div key={l.__uid} className="border rounded p-2 bg-rose-50 shadow-sm text-slate-900 relative">
                <button
                  onClick={() => acknowledgeOne(l.__uid)}
                  className="absolute top-1 right-1 text-xs px-2 py-0.5 rounded bg-rose-200 hover:bg-rose-300"
                >Acknowledge</button>
                <LogDetails log={l} />
              </div>
            ))}
            {visibleLogs.length === 0 && (
              <div className="text-xs text-slate-500">No unacknowledged abnormal logs.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
