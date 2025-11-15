import React, { useEffect } from "react";
import "./Css/Toast.css";

export default function Toast({ type = "info", message, onClose, onConfirm }) {
  useEffect(() => {
    if (type !== "confirm") {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose, type]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
        {type === "confirm" && "❓"}
      </span>

      <span className="toast-message">{message}</span>

      {type === "confirm" && (
        <div className="toast-buttons">
          <button
            className="toast-btn confirm"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            بله
          </button>
          <button className="toast-btn cancel" onClick={onClose}>
            خیر
          </button>
        </div>
      )}
    </div>
  );
}
