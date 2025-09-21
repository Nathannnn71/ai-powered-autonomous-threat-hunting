import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchNotifications } from "../api";
import Chatbot from "./Chatbot";

export default function Layout({ children }) {
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function loadNotifications() {
      const n = await fetchNotifications();
      setNotifications(n);
    }
    loadNotifications();
  }, []);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-4">
        <h1 className="mb-4">
          <span className="block text-2xl font-extrabold tracking-tight">InfiLoop</span>
          <span className="block text-xs font-medium text-slate-300 mt-0.5">AI-Powered Autonomous Threat Hunting</span>
        </h1>
        <nav className="space-y-2 text-sm">
          <Link
            to="/"
            className={`block px-3 py-2 rounded ${
              location.pathname === "/" 
                ? "bg-slate-800" 
                : "hover:bg-slate-800"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/alerts"
            className={`block px-3 py-2 rounded ${
              location.pathname === "/alerts" 
                ? "bg-slate-800" 
                : "hover:bg-slate-800"
            }`}
          >
            Alerts
          </Link>
          <Link
            to="/logs"
            className={`block px-3 py-2 rounded ${
              location.pathname === "/logs" 
                ? "bg-slate-800" 
                : "hover:bg-slate-800"
            }`}
          >
            Logs
          </Link>
        </nav>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Notifications</h3>
          <ul className="space-y-2 text-xs">
            {notifications.slice(0, 6).map((n) => (
              <li key={n.id} className="bg-slate-800 p-2 rounded">
                {n.text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */} 
      <div className="flex-1 flex flex-col relative">
        {children}
        <Chatbot />
      </div>
    </div>
  );
}
