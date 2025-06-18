import React from "react";
import { SessionStatus } from "@/app/types";

interface ConnectionStatusProps {
  sessionStatus: SessionStatus;
  onToggleConnection: () => void;
}

function ConnectionStatus({ sessionStatus, onToggleConnection }: ConnectionStatusProps) {
  const isConnected = sessionStatus === "CONNECTED";
  const isConnecting = sessionStatus === "CONNECTING";

  const getStatusColor = () => {
    if (isConnected) return "bg-green-500";
    if (isConnecting) return "bg-yellow-500 animate-pulse";
    return "bg-gray-400";
  };

  const getStatusText = () => {
    if (isConnected) return "Connected";
    if (isConnecting) return "Connecting...";
    return "Disconnected";
  };

  const getHoverText = () => {
    if (isConnected) return "Click to disconnect";
    if (isConnecting) return "Connecting...";
    return "Click to connect";
  };

  return (
    <button
      onClick={onToggleConnection}
      disabled={isConnecting}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700 border border-gray-200"
      title={getHoverText()}
    >
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
      <span className="hidden sm:inline">{getStatusText()}</span>
      <span className="sm:hidden">
        {isConnected ? "●" : isConnecting ? "○" : "○"}
      </span>
    </button>
  );
}

export default ConnectionStatus; 