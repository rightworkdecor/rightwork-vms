"use client";

import { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

interface PopupProps {
  open: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: () => void;
}

export default function Popup({
  open,
  type,
  title,
  message,
  onClose,
}: PopupProps) {

  useEffect(() => {
    if (!open) return;

    if (type === "success" || type === "info") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, type, onClose]);

  if (!open) return null;

  const config = {
    success: {
      icon: <CheckCircle2 size={60} />,
      bg: "bg-green-100",
      color: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: <XCircle size={60} />,
      bg: "bg-red-100",
      color: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: <AlertTriangle size={60} />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    info: {
      icon: <Info size={60} />,
      bg: "bg-blue-100",
      color: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const style = config[type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-popup">

        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex justify-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${style.bg} ${style.color}`}
          >
            {style.icon}
          </div>
        </div>

        <div className="px-8 mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {title}
          </h2>

          <p className="mt-3 text-gray-500 leading-7">
            {message}
          </p>
        </div>

        <div className="p-8">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${style.button}`}
          >
            Continue
          </button>
        </div>

      </div>

      <style jsx>{`
        .animate-popup {
          animation: popup 0.25s ease;
        }

        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

    </div>
  );
}