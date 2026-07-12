import { useEffect, useState } from "react";
import Popup from "./Popup";
import { stashAuthRecovery } from "../auth";

const SCRIPT_ID = "google-translate-script";
const ELEMENT_ID = "google_translate_element";
const COOKIE_NAME = "googtrans";
const POPUP_STORAGE_KEY = "translate-popup-event";

function getCurrentAppUrl() {
  return `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`;
}

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

export default function TranslateButton({ showPopup = true }) {
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
    if (!pendingPopup || !showPopup) return;

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
      if (showPopup) {
        queuePopupEvent({
          title: "Language Updated",
          message: "Changed back to English.",
          variant: "info",
        });
      }

      const appUrl = getCurrentAppUrl();
      stashAuthRecovery({ redirectTo: `${window.location.pathname}${window.location.search}${window.location.hash}` });

      window.setTimeout(() => {
        clearTranslateCookie();
        window.location.replace(appUrl);
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
            if (showPopup) {
              setPopupState({
                open: true,
                title: "Language Updated",
                message: "Translated to Hindi.",
                variant: "info",
              });
            }
          }
        }, 150);
      }


      setIsHindi((prev) => !prev);
    }
  };


  const buttonLabel = isHindi ? "English" : "Hindi";

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={!isReady}
        className="group inline-flex items-center gap-1.5 rounded-lg border border-white/85 bg-white px-3 py-1.5 text-[10px] font-semibold text-blue-950 shadow-sm hover:shadow-md transition-all  disabled:cursor-not-allowed disabled:opacity-60 lg:text-[14px]"
        title={isHindi ? "Switch to English" : "Switch to Hindi"}
        aria-label={isHindi ? "Switch language to English" : "Switch language to Hindi"}      >
        <svg
          className="h-[18px] w-[18px] shrink-0 text-blue-950 bg-white"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path d="M3.8 9H20.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M3.8 15H20.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M12 3.5C14.1 5.7 15.3 8.76 15.3 12C15.3 15.24 14.1 18.3 12 20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M12 3.5C9.9 5.7 8.7 8.76 8.7 12C8.7 15.24 9.9 18.3 12 20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>

        <span className="notranslate leading-none" translate="no" lang="en">
          {buttonLabel}
        </span>
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




