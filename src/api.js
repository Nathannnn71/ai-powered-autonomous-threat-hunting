// Mock logs fetcher
export async function fetchInitialLogs() {
  return [
    {
      id: 101,
      source: "Auth Service",
      msg: "User root closed a login session.",
      time: "2025-09-20 10:01"
    },
    {
      id: 102,
      source: "File Server",
      msg: "Large file transfer detected.",
      time: "2025-09-20 09:32"
    }
  ];
}
// Mock notifications fetcher
export async function fetchNotifications() {
  return [
    {
      id: 1,
      text: "System scan completed successfully."
    },
    {
      id: 2,
      text: "New alert: Unusual file activity detected."
    },
    {
      id: 3,
      text: "Threat intelligence updated."
    }
  ];
}
// api.js
export async function fetchInitialAlerts() {
  return [
    {
      id: 1,
      title: "Suspicious login attempt",
      severity: "High",
      tactic: "Credential Access",
      confidence: 95,
      narrative: "Login from unusual location detected.",
      time: "2025-09-20 10:00",
      source: "Auth Service",
    },
    {
      id: 2,
      title: "Unusual file activity",
      severity: "Medium",
      tactic: "Exfiltration",
      confidence: 80,
      narrative: "Large file transfer outside working hours.",
      time: "2025-09-20 09:30",
      source: "File Server",
    },
  ];
}

export function subscribeToAlerts(callback) {
  // Simulate new alert every 10s
  const interval = setInterval(() => {
    callback({
      id: Date.now(),
      title: "New simulated alert",
      severity: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      tactic: "Execution",
      confidence: Math.floor(Math.random() * 100),
      narrative: "Random alert generated for testing.",
      time: new Date().toLocaleTimeString(),
      source: "Simulation",
    });
  }, 10000);

  return () => clearInterval(interval);
}

export async function acknowledgeAlert(id) {
  console.log("Acknowledged alert:", id);
}
// End of api.js
