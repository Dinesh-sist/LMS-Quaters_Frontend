import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const VARIANT_STYLES = {
  error: {
    accent: "bg-[#dc2626]",
    iconWrap: "bg-[#fee2e2] text-[#dc2626]",
    border: "border-[#f5caca]",
    panel: "bg-[#fff4f4]",
    text: "text-slate-900",
    subtext: "text-slate-600",
  },
  success: {
    accent: "bg-[#16a34a]",
    iconWrap: "bg-[#dcfce7] text-[#16a34a]",
    border: "border-[#b7e4c7]",
    panel: "bg-[#f3fff6]",
    text: "text-slate-900",
    subtext: "text-slate-600",
  },
  info: {
    accent: "bg-[#08142b]",
    iconWrap: "bg-[#e0ebff] text-[#08142b]",
    border: "border-[#d8def4]",
    panel: "bg-[#fff7f1]",
    text: "text-slate-900",
    subtext: "text-slate-600",
  },
};

function PopupIcon({ variant }) {
  if (variant === "success") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6.5 10.2l2.1 2.1 4.8-5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === "error") {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 5.9v4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="13.2" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="5.5" r="1" fill="currentColor" />
    </svg>
  );
}

export default function Popup({
  open = false,
  title,
  message,
  variant = "info",
  onClose,
  autoClose = 2200,
}) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const [isRendered, setIsRendered] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const clearTimers = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  };

  const requestClose = () => {
    clearTimers();
    setIsVisible(false);

    exitTimerRef.current = window.setTimeout(() => {
      setIsRendered(false);
      if (onClose) onClose();
    }, 260);
  };

  useEffect(() => {
    clearTimers();

    if (open) {
      setIsRendered(true);

      const raf = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });

      if (autoClose) {
        closeTimerRef.current = window.setTimeout(() => {
          requestClose();
        }, autoClose);
      }

      return () => {
        window.cancelAnimationFrame(raf);
        clearTimers();
      };
    }

    if (isRendered) {
      setIsVisible(false);
      exitTimerRef.current = window.setTimeout(() => {
        setIsRendered(false);
      }, 260);
    }

    return () => {
      clearTimers();
    };
  }, [autoClose, isRendered, open, onClose]);

  if (!isRendered || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`pointer-events-none fixed right-5 top-22 z-[1200] w-[min(360px,calc(100vw-2rem))] transition-all duration-300 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-[18px] border ${styles.border} ${styles.panel} shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-sm`}
        role="status"
        aria-live="polite"
      >
        <div className={`absolute inset-y-0 left-0 w-1.5 ${styles.accent}`} />
        {autoClose ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-hidden">
            <div
              className={`h-full w-full origin-right ${styles.accent}`}
              style={{
                animation: `popupTimerShrink ${autoClose}ms linear forwards`,
              }}
            />
          </div>
        ) : null}
        <div className="flex items-start gap-4 px-5 py-4 pl-6">
          <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.iconWrap}`}>
            <PopupIcon variant={variant} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-[14px] font-bold ${styles.text}`}>{title}</p>
            {message ? <p className={`mt-1 text-[13px] ${styles.subtext}`}>{message}</p> : null}
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-black/5 hover:text-slate-600"
            aria-label="Close popup"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes popupTimerShrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
