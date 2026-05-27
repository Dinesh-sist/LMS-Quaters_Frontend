import { useEffect, useState } from "react";
import Popup from "./Popup";

const SCRIPT_ID = "google-translate-script";
const ELEMENT_ID = "google_translate_element";
const COOKIE_NAME = "googtrans";
const HINDI_INITIAL = "\u0905";
const POPUP_STORAGE_KEY = "translate-popup-event";

function queuePopupEvent(payload) {
  window.sessionStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify(payload));
}

function consumePopupEvent() {
  const raw = window.sessionStorage.getItem(POPUP_STORAGE_KEY);
  if (!raw) return null;

  window.sessionStorage.removeItem(POPUP_STORAGE_KEY);

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getTranslateCookie() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function setTranslateCookie(value) {
  const encodedValue = encodeURIComponent(value);
  const hostnameParts = window.location.hostname.split(".").filter(Boolean);
  const cookieTargets = ["path=/"];

  if (hostnameParts.length >= 2) {
    cookieTargets.push(`path=/;domain=.${hostnameParts.slice(-2).join(".")}`);
  }

  cookieTargets.forEach((target) => {
    document.cookie = `${COOKIE_NAME}=${encodedValue};${target}`;
  });
}

function clearTranslateCookie() {
  const hostnameParts = window.location.hostname.split(".").filter(Boolean);
  const cookieTargets = ["path=/"];

  if (hostnameParts.length >= 2) {
    cookieTargets.push(`path=/;domain=.${hostnameParts.slice(-2).join(".")}`);
  }

  cookieTargets.forEach((target) => {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${target}`;
  });
}

function ensureTranslateContainer() {
  let container = document.getElementById(ELEMENT_ID);

  if (!container) {
    container = document.createElement("div");
    container.id = ELEMENT_ID;
    container.style.display = "none";
    document.body.appendChild(container);
  }

  return container;
}

function ensureTranslateStyles() {
  if (document.getElementById("google-translate-hide-styles")) return;

  const style = document.createElement("style");
  style.id = "google-translate-hide-styles";
  style.textContent = `
    .goog-te-banner-frame.skiptranslate,
    .goog-te-gadget,
    .goog-tooltip,
    .goog-te-balloon-frame {
      display: none !important;
    }

    body {
      top: 0 !important;
    }

    .notranslate {
      translate: no;
    }
  `;

  document.head.appendChild(style);
}

function enforceHiddenTranslateUi() {
  document.body.style.top = "0px";
  document.documentElement.style.top = "0px";

  const bannerFrame = document.querySelector(".goog-te-banner-frame.skiptranslate");
  if (bannerFrame) {
    bannerFrame.style.display = "none";
    bannerFrame.style.visibility = "hidden";
  }

  const translateBanner = document.querySelector("iframe.goog-te-banner-frame");
  if (translateBanner) {
    translateBanner.style.display = "none";
    translateBanner.style.visibility = "hidden";
  }
}

function initializeTranslateWidget() {
  if (!window.google?.translate?.TranslateElement) return false;
  if (document.querySelector(".goog-te-combo")) return true;

  ensureTranslateContainer();

  new window.google.translate.TranslateElement(
    { pageLanguage: "en", includedLanguages: "hi", autoDisplay: false },
    ELEMENT_ID
  );

  return true;
}

function isHindiApplied() {
  return (
    getTranslateCookie().includes("/en/hi") &&
    (document.body.classList.contains("translated-ltr") ||
      document.body.classList.contains("translated-rtl") ||
      document.documentElement.lang?.toLowerCase().startsWith("hi"))
  );
}

export default function TranslateButton() {
  const [isHindi, setIsHindi] = useState(() => getTranslateCookie().includes("/en/hi"));
  const [isReady, setIsReady] = useState(false);
  const [popupState, setPopupState] = useState({
    open: false,
    title: "",
    message: "",
    variant: "info",
  });

  useEffect(() => {
    ensureTranslateContainer();
    ensureTranslateStyles();
    enforceHiddenTranslateUi();

    const markReadyIfAvailable = () => {
      const ready = initializeTranslateWidget() && !!document.querySelector(".goog-te-combo");

      if (ready) {
        setIsReady(true);
      }

      enforceHiddenTranslateUi();

      return ready;
    };

    window.googleTranslateElementInit = () => {
      markReadyIfAvailable();
    };

    if (markReadyIfAvailable()) {
      return undefined;
    }

    let script = document.getElementById(SCRIPT_ID);

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    const readyCheck = window.setInterval(() => {
      if (markReadyIfAvailable()) {
        window.clearInterval(readyCheck);
      }
    }, 500);

    const observer = new MutationObserver(() => {
      enforceHiddenTranslateUi();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      window.clearInterval(readyCheck);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const pendingPopup = consumePopupEvent();
    if (!pendingPopup) return;

    window.setTimeout(() => {
      setPopupState({
        open: true,
        title: pendingPopup.title,
        message: pendingPopup.message,
        variant: pendingPopup.variant || "info",
      });
    }, 250);
  }, []);

  const triggerTranslate = (langCode) => {
    const select = document.querySelector(".goog-te-combo");

    if (!select) return false;

    if (langCode === "hi") {
      setTranslateCookie("/en/hi");
    } else {
      clearTranslateCookie();
      setTranslateCookie("/en/en");
    }

    select.value = langCode;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    window.setTimeout(enforceHiddenTranslateUi, 100);
    window.setTimeout(enforceHiddenTranslateUi, 500);

    if (langCode === "en") {
      queuePopupEvent({
        title: "Language Updated",
        message: "Changed back to English.",
        variant: "info",
      });

      window.setTimeout(() => {
        clearTranslateCookie();
        window.location.reload();
      }, 2200);
    }

    return true;
  };

  const handleToggle = () => {
    const nextLang = isHindi ? "en" : "hi";

    if (triggerTranslate(nextLang)) {
      if (nextLang === "hi") {
        const startedAt = Date.now();
        const waitForHindi = window.setInterval(() => {
          if (isHindiApplied() || Date.now() - startedAt > 4000) {
            window.clearInterval(waitForHindi);
            setPopupState({
              open: true,
              title: "Language Updated",
              message: "Translated to Hindi.",
              variant: "info",
            });
          }
        }, 150);
      }

      setIsHindi((prev) => !prev);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={!isReady}
        className="group relative inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/85 bg-transparent transition-all hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
        title={isHindi ? "Switch to English" : "Switch to Hindi"}
        aria-label={isHindi ? "Switch language to English" : "Switch language to Hindi"}
      >
        <span
          className={`absolute left-[6px] top-[6px] flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border text-[11px] font-bold leading-none transition-all duration-300 ease-out ${
            isHindi
              ? "translate-x-[12px] translate-y-[12px] scale-[0.92] border-slate-300 bg-white text-slate-500 shadow-none"
              : "translate-x-0 translate-y-0 scale-100 border-[#08142b] bg-[#08142b] text-[#fb923c] shadow-[0_4px_8px_rgba(8,20,43,0.22)]"
          }`}
          aria-hidden="true"
        >
          <span className="notranslate" translate="no" lang="en">
            A
          </span>
        </span>

        <span
          className={`absolute left-[6px] top-[6px] flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border text-[11px] font-bold leading-none transition-all duration-300 ease-out ${
            isHindi
              ? "translate-x-0 translate-y-0 scale-100 border-[#08142b] bg-[#08142b] text-[#fb923c] shadow-[0_4px_8px_rgba(8,20,43,0.22)]"
              : "translate-x-[12px] translate-y-[12px] scale-[0.92] border-slate-300 bg-white text-slate-500 shadow-none"
          }`}
          aria-hidden="true"
        >
          {HINDI_INITIAL}
        </span>

        <svg
          className={`absolute right-[5px] top-[5px] h-[15px] w-[15px] text-white transition-transform duration-300 ease-out ${isHindi ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 1.8A3.5 3.5 0 0 1 9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8.7 1.9L9.1 4.5 11.3 3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 10.2A3.5 3.5 0 0 1 3 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M3.3 10.1L2.9 7.5.7 8.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Popup
        open={popupState.open}
        title={popupState.title}
        message={popupState.message}
        variant={popupState.variant}
        onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
        autoClose={1600}
      />
    </>
  );
}
