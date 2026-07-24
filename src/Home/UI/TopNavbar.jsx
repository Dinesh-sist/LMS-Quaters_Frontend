import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import TranslateButton from "../../Components/TranslateButton";

const NAV_ITEMS = [
  { label: "Home", to: "/", dropdown: false },
  { label: "About", to: "/about", dropdown: false },
  { label: "Apply Online", to: null, dropdown: true },
  { label: "Staff Login", to: "/StaffLogin", dropdown: false },
  { label: "Outsiders", to: "/OutsidersLogin", dropdown: false },
  { label: "REMS", to: "/REMSLogin", dropdown: false },

];
  
const DROPDOWN_ITEMS = [
  { label: "Quarters", to: "/QuartersApplyLogin", active: true },
  { label: "Market", to: null, active: false },
  { label: "Lease", to: null, active: false },
  { label: "Licence", to: null, active: false },
];

const TERMS_AND_CONDITIONS = [
  "This is the official website of Paradip Port Authority under the Ministry of Shipping, Government of India.",
  "The information contained in this Web Site (http://www.paradipport.gov.in) has been prepared solely for the purpose of providing information about Paradip Port Authority to interested parties, and is not in any way binding on Paradip Port Authority.",
  "By accessing this Web Site, you agree that Paradip Port Authority will not be liable for any direct or indirect loss arising from the use of the information and the material contained in this Web Site.",
  "This Web Site has been compiled in good faith by the Paradip Port Authority, but no representation is made or warranty given (either express or implied) as to the completeness or accuracy of the information it contains. The same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity or doubts, users are advised to verify/check this information with Paradip Port Authority before you act upon it.",
  "By accessing this Web Site, you agree that under no circumstances will Paradip Port Authority be liable for any direct or indirect loss or damage, expense including, without limitations, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in connection with the use of this website.",
  "These terms and conditions shall be governed by and construed in accordance with the Indian laws. Any dispute arising under these terms and conditions shall be subject to the jurisdiction of the court of Jagatsinghpur, Orissa state, India.",
  "The information posted on this website could include hypertext links or pointers to information created and maintained by non Government/Private organizations. Paradip Port Authority is providing these links and pointers for your information and convenience. When you select a link to an outside website, you are leaving the Paradip Port Authority website and are subject to the privacy and security policies of the owners/sponsors of the outside website.",
  "Paradip Port Authority does not guarantee the availability of such linked pages at all times.",
  "Paradip Port Authority cannot authorize the use of copyrighted materials contained in linked websites. Users are advised to request such authorization from the owner of the linked website.",
  "Paradip Port Authority does not guarantee that linked websites comply with Indian Government Web Guidelines.",
  "The copyright in the material contained in this Web Site belongs to and remains solely with Paradip Port Authority. Your access to it or to download does not imply a license to reproduce and/or distribute this information and you are not allowed to use the material for any other purpose or any such act without the prior approval of Paradip Port Authority. Application for obtaining permission should be made to dmmsppt@paradipport.gov.in.",
  "Prior permission is required before hyperlinks are directed from any website to this website. Permission for the same, stating the nature of the content on the pages from where the link has to be given and the exact language of the hyperlink should be obtained by sending a request at dmmsppt@paradipport.gov.in.",
];

function FontSizeControls({ onDecrease, onIncrease, onReset }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[13px] font-bold text-blue-950 shadow-sm transition-all duration-200 hover:text-[#fb923c]"
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        A-
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[13px] font-bold text-blue-950 shadow-sm transition-all duration-200 hover:text-[#fb923c]"
        aria-label="Reset font size"
        title="Reset font size"
      >
        A
      </button>
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[13px] font-bold text-blue-950 shadow-sm transition-all duration-200 hover:text-[#fb923c]"
        aria-label="Increase font size"
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
}

export default function TopNavbar({
  titleColor = "text-white",
  navTextColor = "light",
  transparent = false,
  hideTranslatePopup = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasReadAll, setHasReadAll] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize") || "16");
  });

  const scrollRef = useRef(null);
  const isDarkText = navTextColor === "dark";

  const dropdownPaths = DROPDOWN_ITEMS.filter((i) => i.to).map((i) => i.to);
  const isDropdownActive = [...dropdownPaths, "/Quarters/Apply"].includes(location.pathname);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));
  const resetFontSize = () => setFontSize(16);

  const closeAllMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleQuartersClick = (e) => {
    e.preventDefault();
    closeAllMenus();
    setHasAcceptedTerms(false);
    setHasReadAll(false);
    setShowTermsModal(true);
  };

  const handleAgree = () => {
    if (!hasAcceptedTerms) return;
    setShowTermsModal(false);
    navigate("/QuartersApplyLogin");
  };

  const handleCloseModal = () => {
    setHasAcceptedTerms(false);
    setHasReadAll(false);
    setShowTermsModal(false);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (atBottom) setHasReadAll(true);
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (showTermsModal) {
      setHasReadAll(false);
      setHasAcceptedTerms(false);
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 0);
    }
  }, [showTermsModal]);

  useEffect(() => {
    if (!showTermsModal) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; 

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showTermsModal]);

  const termsModal =
    showTermsModal && typeof document !== "undefined"
      ? createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-4 backdrop-blur-[4px] sm:items-center sm:py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="my-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:my-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#08142b]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3l7 3.5v5.3c0 4.6-2.9 8.8-7 10.2-4.1-1.4-7-5.6-7-10.2V6.5L12 3z"
                      stroke="#fff"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path d="M9.5 12.1l1.7 1.7 3.5-3.8" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-slate-900">Terms and Conditions</h2>
                  <p className="text-[12px] text-slate-500">Paradip Port Authority - Official Notice</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!hasReadAll && (
              <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-6 py-2.5">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className="shrink-0 text-amber-600">
                  <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10 6v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="10" cy="13.5" r="0.8" fill="currentColor" />
                </svg>
                <p className="text-[12px] font-medium text-amber-800">
                  Please scroll down and read all terms before accepting.
                </p>
              </div>
            )}
            {hasReadAll && (
              <div className="flex items-center gap-2 border-b border-green-200 bg-green-50 px-6 py-2.5">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className="shrink-0 text-green-600">
                  <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M6.5 10.5l2.2 2.2 4.8-5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[12px] font-medium text-green-800">
                  You have read all the terms. You may now accept below.
                </p>
              </div>
            )}
            <div className={`scroll-fade-wrap ${hasReadAll ? "read" : ""}`}>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="terms-scroll max-h-[42vh] overflow-y-auto bg-white px-6 py-4 sm:max-h-[46vh]"
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead />
                  <tbody>
                    {TERMS_AND_CONDITIONS.map((term, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#64748b",
                            fontWeight: 600,
                            verticalAlign: "top",
                            fontSize: 12,
                          }}
                        >
                          {i + 1}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#374151", lineHeight: 1.7, verticalAlign: "top" }}>
                          {term}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
         
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-all ${!hasReadAll
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
                  : hasAcceptedTerms
                    ? "border-green-300 bg-green-50"
                    : "border-slate-300 bg-white hover:border-slate-400"
                  }`}
                title={!hasReadAll ? "Please read all terms first" : ""}
              >
                <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={hasAcceptedTerms}
                    disabled={!hasReadAll}
                    onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                    className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded border-2 transition-all"
                    style={{
                      borderColor: hasAcceptedTerms ? "#08142b" : "#94a3b8",
                      background: hasAcceptedTerms ? "#08142b" : "#fff",
                    }}
                  >
                    {hasAcceptedTerms && (
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10.5l3.1 3.1L15 6.7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-slate-800">
                    I have read and accept all the terms and conditions.
                  </span>
                  <span className="mt-0.5 block text-[12px] text-slate-500">
                    {hasReadAll
                      ? "You may now tick this box to confirm your acceptance."
                      : "Scroll through all terms above to enable this checkbox."}
                  </span>
                </span>
              </label>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAgree}
                  disabled={!hasAcceptedTerms}
                  className="rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all"
                  style={{
                    background: hasAcceptedTerms ? "#08142b" : "#cbd5e1",
                    cursor: hasAcceptedTerms ? "pointer" : "not-allowed",
                    boxShadow: hasAcceptedTerms ? "0 4px 14px rgba(8,20,43,0.25)" : "none",
                  }}
                >
                  Continue to Login
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
      : null;

  return (
    <>
      <style>{`
        .terms-scroll::-webkit-scrollbar { width: 6px; }
        .terms-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .terms-scroll::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 6px; }

        @keyframes brandShimmerSweep {
          0% { transform: translate(-68%, -68%) rotate(18deg); }
          100% { transform: translate(68%, 68%) rotate(18deg); }
        }

        .scroll-fade-wrap { position: relative; }
        .scroll-fade-wrap::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(transparent, #f8fafc);
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .scroll-fade-wrap.read::after { opacity: 0; }

        .brand-shimmer {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .brand-shimmer::after {
          content: "";
          position: absolute;
          inset: -62%;
          background: linear-gradient(
            135deg,
            transparent 35%,
            rgba(255, 255, 255, 0.05) 44%,
            rgba(255, 255, 255, 0.38) 50%,
            rgba(255, 255, 255, 0.05) 56%,
            transparent 65%
          );
          animation: brandShimmerSweep 3s linear infinite;
          pointer-events: none;
          z-index: 2;
        }

        .brand-shimmer > * {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <header
        className={`relative w-full px-4 py-3 lg:px-8 ${transparent ? "border-0 bg-transparent" : "border-b border-white/10 bg-[#0b1f44]"
          }`}
      >
        {/* Maximum width container to unify sizes across 1024px up to 1440px+ */}
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2">

          {/* Brand/Logo Section */}
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <div className="brand-shimmer flex items-center">
              <img src={Logo} alt="Logo" className="w-10 rounded-lg sm:w-15 lg:w-17" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className={`block text-sm font-bold  sm:text-base  lg:text-3xl ${titleColor}`}>                PARADIP PORT AUTHORITY
              </span>
              <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[11px] lg:text-[15px]">                Land Management System
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => (mobileMenuOpen ? closeAllMenus() : setMobileMenuOpen(true))}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-transparent transition xl:hidden ${isDarkText ? "border-slate-300 text-slate-700 hover:bg-slate-100" : "border-white/20 text-white hover:bg-white/10"
              }`}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileMenuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M3 10h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

          {/* Desktop Controls & Navigation (Remains consistent from 1024px through 1440px) */}
          <div className="hidden xl:flex items-center gap-2 xl:gap-4">
            <div className="flex items-center gap-1.5  shrink-0">
              <FontSizeControls onDecrease={decreaseFontSize} onIncrease={increaseFontSize} onReset={resetFontSize} />
              <TranslateButton showPopup={!hideTranslatePopup} />
            </div>

            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ label, to, dropdown }) => {
                if (dropdown) {
                  return (
                    <div key={label} className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((p) => !p)}
                        className={`flex min-h-[36px] items-center gap-1 rounded-full border-0 px-3.5 py-1.5 text-sm font-semibold transition-all ${isDropdownActive || dropdownOpen
                          ? "bg-orange-400 text-white"
                          : isDarkText
                            ? "bg-transparent text-slate-700 hover:text-slate-950"
                            : "bg-transparent text-white/85 hover:text-white"
                          }`}
                      >
                        {label}
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                          className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        >
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[170px] rounded-2xl border border-slate-200 bg-white px-1.5 py-2 shadow-xl">
                          {DROPDOWN_ITEMS.map(({ label: dl, to: dt, active }) =>
                            active && dt ? (
                              <Link
                                key={dl}
                                to={dt}
                                onClick={dl === "Quarters" ? handleQuartersClick : () => setDropdownOpen(false)}
                                className="block rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-orange-50 hover:text-orange-600">
                                {dl}
                              </Link>
                            ) : (
                              <span key={dl} className="block cursor-not-allowed rounded-xl px-3 py-1.5 text-sm italic text-slate-400">                              
                              {dl}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = location.pathname === to && !isDropdownActive;
                return (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold no-underline transition-all ${isActive ? "bg-orange-400 text-white" : isDarkText ? "text-slate-700 hover:text-slate-950" : "text-white/85 hover:text-white"
                      }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute right-4 lg:right-8 top-full mt-2 w-full max-w-[240px] rounded-[24px] border border-slate-200 bg-white p-2.5 shadow-2xl sm:max-w-[260px] lg:max-w-[300px] xl:hidden z-50">


            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, to, dropdown }) => {
                if (dropdown) {
                  return (
                    <div key={label} className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((p) => !p)}
                        className={`flex min-h-[38px] w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-xs lg:text-sm font-semibold transition-all ${isDropdownActive || dropdownOpen ? "bg-orange-400 text-white" : "bg-slate-50 text-slate-700 hover:bg-orange-100"
                          }`}
                      >
                        <span>{label}</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        >
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {dropdownOpen && (
                        <div className="rounded-[18px] bg-[#1a2e5a] p-1.5">
                          {DROPDOWN_ITEMS.map(({ label: dl, to: dt, active }) =>
                            active && dt ? (
                              <Link
                                key={dl}
                                to={dt}
                                onClick={dl === "Quarters" ? handleQuartersClick : closeAllMenus}
                                className="block rounded-xl px-3 py-2 text-xs lg:text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
                              >
                                {dl}
                              </Link>
                            ) : (
                              <span key={dl} className="block cursor-not-allowed rounded-xl px-3 py-2 text-xs lg:text-sm italic text-slate-400">
                                {dl}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                const isActive = location.pathname === to && !isDropdownActive;
                return (
                  <Link
                    key={label}
                    to={to}
                    onClick={closeAllMenus}
                    className={`flex min-h-[38px] items-center rounded-[18px] px-3 py-2 text-xs lg:text-sm font-semibold no-underline transition-all ${isActive ? "bg-orange-400 text-white" : "bg-slate-50 text-slate-700 hover:bg-orange-100"
                      }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 px-1">
              <FontSizeControls onDecrease={decreaseFontSize} onIncrease={increaseFontSize} onReset={resetFontSize} />
              <div className="flex shrink-0">
                <TranslateButton showPopup={!hideTranslatePopup} />
              </div>
            </div>
          </div>
        )}
      </header>

      {termsModal}
    </>
  );
}