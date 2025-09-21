import React, { useEffect, useState, useRef } from "react";
import LogDetails from "../components/LogDetails";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchInitialAlerts,
  fetchInitialLogs,
  fetchNotifications,
  subscribeToAlerts,
  acknowledgeAlert as apiAcknowledge,
} from "../api";

function SeverityBadge({ level }) {
  const base = "px-2 py-1 text-xs rounded font-medium";
  if (level === "High")
    return <span className={`${base} bg-red-200 text-red-800`}>High</span>;
  if (level === "Medium")
    return <span className={`${base} bg-yellow-200 text-yellow-800`}>Medium</span>;
  return <span className={`${base} bg-green-200 text-green-800`}>Low</span>;
}

// 🔹 Simple classifier
function classifyLog(log) {
  const keywords = ["error", "failed", "interrupt"];
    if (keywords.some((k) => log.msg.toLowerCase().includes(k))) {
      return {
        ...log,
        classification: "Alert",
        reason: "Contains critical keyword",
      };
  }
  return {
    ...log,
    classification: "Normal",
    reason: "No abnormal indicators",
  };
}

// LogDetails now imported from shared component

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [rawLogs, setRawLogs] = useState([]);
  const [classifiedRawLogs, setClassifiedRawLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showNormal, setShowNormal] = useState(true);
  const [showAbnormal, setShowAbnormal] = useState(true);
  // No API Gateway error state needed when using direct S3 fetch
  const subscriptionRef = useRef(null);

  // Fetch data directly from public S3 object (latest_analysis.json)
  useEffect(() => {
    const S3_BASE = import.meta.env.VITE_S3_URL || 'https://wazuh-results.s3.us-east-1.amazonaws.com';
    const url = `${S3_BASE}/latest_analysis.json?ts=${Date.now()}`; // cache buster
    async function fetchFromS3() {
      try {
        console.log('[Dashboard] Fetching S3 object', url);
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('[Dashboard] S3 payload keys:', Object.keys(data || {}));
        setSummary(data && typeof data.summary === 'object' ? data.summary : null);
        setLogs(Array.isArray(data.logs) ? data.logs : []);
        setMetrics(Array.isArray(data.metrics) ? data.metrics : []);
        if (!data.summary) {
          console.warn('[Dashboard] No summary in S3 JSON. Ensure object has a top-level "summary".');
        }
      } catch (e) {
        console.error('[Dashboard] Failed to fetch S3 latest_analysis.json:', e);
        setSummary(null);
        setLogs([]);
        setMetrics([]);
      }
    }
    fetchFromS3();
  }, []);
  return (
    <div>
      {/* Topbar */}
      <header className="flex items-center justify-between pb-1 pt-1 px-4 bg-white border-b">
        <div className="absolute right-4 top-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded shadow">
          Live data from S3
        </div>
        <h1 className="text-2xl font-bold">Threat Hunting — Demo</h1>
        {/* Removed Workspace: demo and Connect button as requested */}
      </header>
  <main className="pt-0 pb-4 px-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary/analysis column - now wider */}
          <div className="space-y-6 md:col-span-2">
            <div className="bg-white rounded shadow p-4">
              <h2 className="font-semibold mb-3 text-slate-800 text-xl md:text-2xl tracking-tight">Threat Overview (24h)</h2>
              {summary ? (
                <>
                  <p className="text-base md:text-lg text-slate-700 mb-3 leading-snug">{summary.summary}</p>
                  <div className="text-sm md:text-base text-slate-700 mb-2">
                    <strong>Common Patterns:</strong> {Array.isArray(summary.common_patterns) ? summary.common_patterns.join(", ") : ""}
                  </div>
                  <div className="text-sm md:text-base text-slate-700 mb-2">
                    <strong>Key Findings:</strong> {Array.isArray(summary.key_findings) ? summary.key_findings.join(", ") : ""}
                  </div>
                  <div className="text-sm md:text-base text-slate-700 mb-1">
                    <strong>Total Logs:</strong> {summary.total_logs} | <strong>Normal:</strong> {summary.normal_logs} | <strong>Abnormal:</strong> {summary.abnormal_logs}
                  </div>
                  {/* Embedded log panels */}
                  <div className="space-y-4">
                    <div className="border rounded-md">
                      <button
                        type="button"
                        onClick={() => setShowNormal(v => !v)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-green-50 hover:bg-green-100 transition-colors rounded-t-md"
                      >
                        <span className="font-semibold text-green-700">Normal Logs ({logs.filter(l=>l.category==='normal').length})</span>
                        <span className="text-xs text-green-700">{showNormal ? 'Hide' : 'Show'}</span>
                      </button>
                      {showNormal && (
                        <div className="max-h-56 overflow-auto px-3 py-3 space-y-3 bg-white">
                          {logs.filter(l=>l.category==='normal').map(l => (
                            <div key={l.log_id || l.id || Math.random()} className="border rounded p-2 bg-slate-50 shadow-sm text-slate-900">
                              <LogDetails log={l} />
                            </div>
                          ))}
                          {logs.filter(l=>l.category==='normal').length===0 && (
                            <div className="text-xs text-slate-500">No normal logs.</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="border rounded-md">
                      <button
                        type="button"
                        onClick={() => setShowAbnormal(v => !v)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-rose-50 hover:bg-rose-100 transition-colors rounded-t-md"
                      >
                        <span className="font-semibold text-rose-700">Abnormal Logs ({logs.filter(l=>l.category==='abnormal').length})</span>
                        <span className="text-xs text-rose-700">{showAbnormal ? 'Hide' : 'Show'}</span>
                      </button>
                      {showAbnormal && (
                        <div className="max-h-56 overflow-auto px-3 py-3 space-y-3 bg-white">
                          {logs.filter(l=>l.category==='abnormal').map(l => (
                            <div key={l.log_id || l.id || Math.random()} className="border rounded p-2 bg-rose-50 shadow-sm text-slate-900">
                              <LogDetails log={l} />
                            </div>
                          ))}
                          {logs.filter(l=>l.category==='abnormal').length===0 && (
                            <div className="text-xs text-slate-500">No abnormal logs.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-xs text-amber-600">No summary found in S3 object.<br/>Verify the JSON at <code>latest_analysis.json</code> has a top-level <code>summary</code>, and object is publicly readable (or has proper signed URL).</div>
              )}
            </div>
          </div>
          {/* Graphs column */}
          <div className="space-y-6">
            <div className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-800">Alerts Evolution</h3>
                <div className="text-sm text-slate-500">12h trend</div>
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="anomalies"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#6366f1" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-800">Recent Logs Trend</h3>
                <div className="text-sm text-slate-500">Log trend</div>
              </div>
              {/* Placeholder for second graph, you can add another chart here */}
              <div style={{ height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="logs"
                      stroke="#e11d48"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#e11d48" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        {/* Former bottom log section removed; logs now inside summary card */}
      </main>
    </div>
  );
}
