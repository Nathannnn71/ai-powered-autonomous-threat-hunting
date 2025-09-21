import React, { useEffect, useState, useRef } from "react";
import {
  fetchInitialLogs,
  subscribeToAlerts,
} from "./api";

// Simple classifier
function classifyLog(log) {
  const keywords = ["error", "failed", "interrupt", "denied", "timeout"];
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

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [rawLogs, setRawLogs] = useState([]);
  const [classifiedRawLogs, setClassifiedRawLogs] = useState([]);
  // Removed filter state
  const [searchTerm, setSearchTerm] = useState("");
  const subscriptionRef = useRef(null);

  // Load logs
  useEffect(() => {
    async function load() {
      const l = await fetchInitialLogs();
      setLogs(l.map(classifyLog));
    }
    async function fetchRawLogs() {
      try {
        const res = await fetch('https://wazuh-raw.s3.us-east-1.amazonaws.com/wazuh/raw/alerts.json?ts=' + Date.now());
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setRawLogs(Array.isArray(data) ? data : []);
        // Classify each log using full_log or rule.description
        const classified = (Array.isArray(data) ? data : []).map((log) => {
          let msg = "";
          if (log && log._source) {
            msg = log._source.full_log || log._source.rule?.description || JSON.stringify(log._source);
          } else if (typeof log === "string") {
            msg = log;
          } else {
            msg = JSON.stringify(log);
          }
          // Use a broad classifier
          const keywords = ["error", "failed", "interrupt", "denied", "alert", "unusual", "critical", "suspicious", "malware", "attack", "scan", "remediation"];
          const lowerMsg = msg.toLowerCase();
          const isAbnormal = keywords.some((k) => lowerMsg.includes(k));
          return {
            id: log?._id || log?._source?.id || Math.random(),
            time: log?._source?.['@timestamp'] || log?._source?.timestamp || "",
            source: log?._source?.agent?.name || log?._source?.manager?.name || "",
            msg,
            classification: isAbnormal ? "Abnormal" : "Normal",
            reason: isAbnormal ? "Contains abnormal keyword" : "No abnormal indicators"
          };
        });
        setClassifiedRawLogs(classified);
      } catch (err) {
        setRawLogs([]);
        setClassifiedRawLogs([]);
        console.error('Failed to fetch S3 raw alerts:', err);
      }
    }
    load();
    fetchRawLogs();

    // Subscribe to new alerts to add them as logs
    subscriptionRef.current = subscribeToAlerts((newAlert) => {
      const newLog = classifyLog({
        id: `log-${Date.now()}`,
        source: newAlert.source,
        msg: newAlert.title,
        time: newAlert.time,
      });
      setLogs((s) => [newLog, ...s].slice(0, 200));
    });

    return () => {
      if (subscriptionRef.current) subscriptionRef.current();
    };
  }, []);

  // Filter logs
  // Combine both logs and raw logs for display
  // For raw logs, extract entity fields if present
  function extractEntityFields(log) {
    if (log && log._source && log._source.entity) {
      const entity = log._source.entity;
      return {
        src_ip: entity.src_ip || "",
        alerts_count: entity.alerts_count || "",
        first_seen: entity.first_seen || "",
        last_seen: entity.last_seen || "",
        top_rules: Array.isArray(entity.top_rules) ? entity.top_rules.join(", ") : "",
        events: Array.isArray(entity.events) ? entity.events.map(e => JSON.stringify(e)).join("\n") : "",
        public: entity.public !== undefined ? String(entity.public) : ""
      };
    }
    return {};
  }
  const allLogs = [...logs, ...classifiedRawLogs];
  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch = searchTerm === "" || 
      (log.msg && log.msg.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.source && log.source.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const stats = {
    total: allLogs.length,
    alerts: allLogs.filter(l => l.classification === "Abnormal" || l.classification === "Alert").length,
    normal: allLogs.filter(l => l.classification === "Normal").length,
  };

  // Helper to parse JSON-looking message bodies produced upstream so columns can be filled
  function parseMsgObject(msg) {
    if (!msg || typeof msg !== 'string') return {};
    // quick heuristic: must start with { and contain :
    if (msg[0] !== '{' || !msg.includes(':')) return {};
    try {
      return JSON.parse(msg);
    } catch (e) {
      return {};
    }
  }

  return (
    <div style={{color:'#222', background:'#fff'}}>
      {/* Topbar */}
      <header className="flex items-center justify-between p-4 bg-white border-b" style={{color:'#222'}}>
        <h1 className="text-xl font-bold" style={{color:'#222'}}>Logs Center</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 text-sm w-64"
            style={{color:'#222',background:'#fff'}}
          />
        </div>
      </header>

      {/* Stats bar */}
      <div className="p-4 bg-slate-50 border-b" style={{color:'#222'}}>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="font-medium" style={{color:'#222'}}>{stats.total}</span> total logs
          </div>
          <div>
            <span className="font-medium text-red-600" style={{color:'#b91c1c'}}>{stats.alerts}</span> alerts
          </div>
          <div>
            <span className="font-medium text-green-600" style={{color:'#166534'}}>{stats.normal}</span> normal
          </div>
          <div>
            <span className="font-medium" style={{color:'#222'}}>{filteredLogs.length}</span> shown
          </div>
        </div>
      </div>

      {/* Logs table */}
      <main className="flex-1 p-6 overflow-auto" style={{color:'#222'}}>
        <div className="bg-white rounded shadow" style={{color:'#222'}}>
          <div className="overflow-auto" style={{maxHeight:'480px'}}>
            <table className="w-full text-sm" style={{color:'#222'}}>
              <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0" style={{color:'#222'}}>
                <tr>
                  <th className="w-32 text-left px-4 py-3" style={{color:'#222'}}>rule_desc</th>
                  <th className="w-32 text-left px-4 py-3" style={{color:'#222'}}>index_time</th>
                  <th className="w-32 text-left px-4 py-3" style={{color:'#222'}}>log_time</th>
                  <th className="w-32 text-left px-4 py-3" style={{color:'#222'}}>agent_ip</th>
                  <th className="w-32 text-left px-4 py-3" style={{color:'#222'}}>src_ip</th>
                  <th className="w-40 text-left px-4 py-3" style={{color:'#222'}}>mitre_ids</th>
                  <th className="w-40 text-left px-4 py-3" style={{color:'#222'}}>mitre_tactics</th>
                  <th className="w-40 text-left px-4 py-3" style={{color:'#222'}}>mitre_techniques</th>
                  <th className="w-24 text-center px-4 py-3" style={{color:'#222'}}>Class</th>
                  <th className="w-48 text-left px-4 py-3" style={{color:'#222'}}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((l) => {
                  const base = l.raw || l.rawLog || l;
                  const parsed = parseMsgObject(l.msg);
                  // Some upstream JSON might nest real fields inside `_source` or similar; flatten one level if present
                  const candidate = parsed._source ? { ...parsed, ...parsed._source } : parsed;
                  const logObj = { ...base, ...candidate };
                  return (
                    <tr key={l.id} className="border-t hover:bg-slate-50" style={{color:'#222'}}>
                      <td className="px-4 py-3" style={{color:'#222'}}>{logObj.rule_desc || logObj.rule_description || logObj.rule?.description || ''}</td>
                      <td className="px-4 py-3" style={{color:'#222'}}>{logObj.index_time || logObj['@timestamp'] || ''}</td>
                      <td className="px-4 py-3" style={{color:'#222'}}>{logObj.log_time || logObj.logtime || ''}</td>
                      <td className="px-4 py-3" style={{color:'#222'}}>{logObj.agent_ip || logObj.agent_ip_addr || logObj.agent?.ip || ''}</td>
                      <td className="px-4 py-3" style={{color:'#222'}}>{logObj.src_ip || logObj.source_ip || logObj.srcip || ''}</td>
                      <td className="px-4 py-3" style={{color:'#222'}}>{Array.isArray(logObj.mitre_ids) ? logObj.mitre_ids.join(', ') : (logObj.mitre_id || '')}</td>
                      <td className="px-4 py-3" style={{color:'#222'}}>{Array.isArray(logObj.mitre_tactics) ? logObj.mitre_tactics.join(', ') : (logObj.mitre_tactic || '')}</td>
                      <td className="px-4 py-3" style={{color:'#222'}}>{Array.isArray(logObj.mitre_techniques) ? logObj.mitre_techniques.join(', ') : (logObj.mitre_technique || '')}</td>
                      <td className="px-4 py-3 text-center" style={{color:'#222'}}>
                        {l.classification === "Abnormal" || l.classification === "Alert" ? (
                          <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-medium" style={{color:'#b91c1c'}}>
                            Abnormal
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-medium" style={{color:'#166534'}}>
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500" style={{color:'#222'}}>{l.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-slate-500" style={{color:'#222'}}>
                <div className="text-lg font-medium" style={{color:'#222'}}>No logs found</div>
                <div className="text-sm mt-1" style={{color:'#222'}}>
                  {searchTerm ? "Try adjusting your search" : "No logs match the current filter"}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="p-3 text-xs text-slate-500 border-t bg-white" style={{color:'#222'}}>
        Demo • Wazuh → MCP → AI Agent
      </footer>
    </div>
  );
}
