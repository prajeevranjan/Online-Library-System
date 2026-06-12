import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const colors = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500/40 bg-red-500/10 text-red-400",
  info: "border-primary-500/40 bg-primary-500/10 text-primary-400",
};

const Notification = ({ n }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md text-sm font-medium shadow-xl animate-slide-down ${colors[n.type] || colors.success}`}
    style={{ minWidth: 260 }}
  >
    <span className="flex-shrink-0">{icons[n.type] || icons.success}</span>
    <span>{n.message}</span>
  </div>
);

const NotificationStack = () => {
  const { notifications } = useApp();
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {notifications.map((n) => (
        <Notification key={n.id} n={n} />
      ))}
    </div>
  );
};

export default NotificationStack;
