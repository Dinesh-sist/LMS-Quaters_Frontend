import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const VARIANT_STYLES = {
  warning: {
    accent: "bg-[#d97706]",
    iconWrap: "bg-[#fef3c7] text-[#d97706]",
    border: "border-[#fde68a]",
    panel: "bg-[#fffbeb]",
    text: "text-slate-900",
    subtext: "text-slate-600",
  },
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
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6.5 10.2l2.1 2.1 4.8-5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === "warning") {
    return (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3L2 17h16L10 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (variant === "error") {
    return (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 5.9v4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="13.2" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
  autoClose = 3500,
}) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const [isRendered, setIsRendered] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const closeTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const handleDismiss = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsVisible(false);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setIsRendered(false);
      if (onCloseRef.current) onCloseRef.current();
    }, 260);
  };

  useEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    if (open) {
      setIsRendered(true);
      setTimerKey((k) => k + 1);

      const enterRaf = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      if (autoClose && autoClose > 0) {
        closeTimerRef.current = setTimeout(() => {
          handleDismiss();
        }, autoClose);
      }

      return () => {
        cancelAnimationFrame(enterRaf);
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
      };
    } else {
      setIsVisible(false);
      exitTimerRef.current = setTimeout(() => {
        setIsRendered(false);
      }, 260);
      return () => {
        if (exitTimerRef.current) {
          clearTimeout(exitTimerRef.current);
          exitTimerRef.current = null;
        }
      };
    }
  }, [open, title, message, variant, autoClose]);

  if (!isRendered || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`pointer-events-none fixed right-3 top-16 sm:right-5 sm:top-20 z-[1200] w-[min(300px,calc(100vw-1.5rem))] sm:w-[min(360px,calc(100vw-2rem))] transition-all duration-300 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-6 sm:translate-x-8 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-xl sm:rounded-[18px] border ${styles.border} ${styles.panel} shadow-[0_10px_25px_rgba(15,23,42,0.12)] sm:shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-sm`}
        role="status"
        aria-live="polite"
      >
        <div className={`absolute inset-y-0 left-0 w-1 sm:w-1.5 ${styles.accent}`} />
        {autoClose && autoClose > 0 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2.5px] sm:h-[3px] overflow-hidden">
            <div
              key={timerKey}
              className={`h-full w-full origin-right ${styles.accent}`}
              style={{
                animation: `popupTimerShrink ${autoClose}ms linear forwards`,
              }}
            />
          </div>
        ) : null}
        <div className="flex items-start gap-2.5 sm:gap-3.5 px-3.5 py-2.5 pl-4 sm:px-5 sm:py-3.5 sm:pl-5.5">
          <div className={`mt-0.5 flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${styles.iconWrap}`}>
            <PopupIcon variant={variant} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-[12.5px] sm:text-[13.5px] font-bold leading-tight ${styles.text}`}>{title}</p>
            {message ? <p className={`mt-0.5 sm:mt-1 text-[11.5px] sm:text-[12.5px] leading-snug ${styles.subtext}`}>{message}</p> : null}
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 rounded-md p-0.5 sm:p-1 text-slate-400 transition hover:bg-black/5 hover:text-slate-600 cursor-pointer"
            aria-label="Close popup"
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
