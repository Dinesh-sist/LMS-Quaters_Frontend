import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";

const NAV_ITEMS = [
  { label: "Home", to: "/", dropdown: false },
  { label: "About", to: "/about", dropdown: false },
  { label: "Dashboard", to: "/dashboard", dropdown: false },
  { label: "Apply Online", to: null, dropdown: true },
  { label: "Staff Login", to: "/StaffLogin", dropdown: false },
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
  "Paradip Port Authority, does not guarantee the availability of such linked pages at all times",
  "Paradip Port Authority can not authorize the use of copy righted materials contained in linked websites. Users are advised to request such authorization from the owner of the linked website.",
  "Paradip Port Authority, does not guarantee that linked websites comply with Indian Government Web Guidelines.",
  "The copyright in the material contained in this Web Site belongs to and remains solely with Paradip Port Authority. Your access to it or to download does not imply a license to reproduce and / or distribute this information and you are not allowed to use the material for any other purpose.or any such act without the prior approval of Paradip Port Authority. Application for obtaining permission should be made to dmmsppt@paradipport.gov.in.",
  "Prior permission is required before hyperlinks are directed from any website to this website. Permission for the same, stating the nature of the content on the pages from where the link has to be given and the exact language of the hyperlink should be obtained by sending a request at dmmsppt@paradipport.gov.in.",
];

export default function TopNavbar({ titleColor = "text-blue-950" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const dropdownPaths = [...DROPDOWN_ITEMS.filter((item) => item.to).map((item) => item.to), "/Quarters/Apply"];
  const isDropdownActive = dropdownPaths.includes(location.pathname);

  const closeAllMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleQuartersClick = (e) => {
    e.preventDefault();
    closeAllMenus();
    setHasAcceptedTerms(false);
    setShowTermsModal(true);
  };

  const handleAgree = () => {
    if (!hasAcceptedTerms) return;
    setShowTermsModal(false);
    navigate("/QuartersApplyLogin");
  };

  return (
    <>
      <header className="px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <img src={Logo} alt="Logo" className="w-11 rounded-2xl sm:w-12 lg:w-14" />
            <div className="min-w-0 leading-tight">
              <span className={`mozilla-text-Header block text-base font-bold leading-tight sm:text-[20px] lg:text-[25px] ${titleColor}`}>
                PARADIP PORT AUTHORITY
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (mobileMenuOpen) {
                closeAllMenus();
              } else {
                setMobileMenuOpen(true);
              }
            }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
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

          <nav className="hidden items-center gap-1 rounded-full border border-[#e2e8f0] bg-white px-2 py-1.5 shadow-sm lg:flex">
            {NAV_ITEMS.map(({ label, to, dropdown }) => {
              if (dropdown) {
                return (
                  <div key={label} className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className={`flex min-h-[40px] items-center gap-1.5 rounded-full border-0 px-5 py-2 text-sm font-semibold transition-all ${
                        isDropdownActive || dropdownOpen
                          ? "bg-orange-400 text-white"
                          : "bg-transparent text-slate-700 hover:bg-orange-100"
                      }`}
                    >
                      {label}
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
                      <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-2xl bg-[#1a2e5a] px-2 py-3 shadow-xl">
                        {DROPDOWN_ITEMS.map(({ label: dropdownLabel, to: dropdownTo, active }) =>
                          active && dropdownTo ? (
                            <Link
                              key={dropdownLabel}
                              to={dropdownTo}
                              onClick={dropdownLabel === "Quarters" ? handleQuartersClick : () => setDropdownOpen(false)}
                              className="block rounded-xl px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
                            >
                              {dropdownLabel}
                            </Link>
                          ) : (
                            <span
                              key={dropdownLabel}
                              className="block cursor-not-allowed rounded-xl px-4 py-2 text-sm italic text-slate-400"
                            >
                              {dropdownLabel}
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
                  className={`rounded-full px-5 py-2 text-sm font-semibold no-underline transition-all ${
                    isActive ? "bg-orange-400 text-white" : "text-slate-700 hover:bg-orange-100"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 ml-auto w-full max-w-[240px] rounded-[24px] border border-slate-200 bg-white p-2.5 shadow-lg sm:max-w-[260px] sm:p-3 lg:hidden">
            <nav className="flex flex-col gap-1.5 sm:gap-2">
              {NAV_ITEMS.map(({ label, to, dropdown }) => {
                if (dropdown) {
                  return (
                    <div key={label} className="flex flex-col gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className={`flex min-h-[40px] w-full items-center justify-between rounded-[18px] px-3 py-2.5 text-left text-xs font-semibold transition-all sm:min-h-[42px] sm:px-3.5 sm:text-[13px] ${
                          isDropdownActive || dropdownOpen
                            ? "bg-orange-400 text-white"
                            : "bg-slate-50 text-slate-700 hover:bg-orange-100"
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
                        <div className="rounded-[18px] bg-[#1a2e5a] p-1.5 sm:p-2">
                          {DROPDOWN_ITEMS.map(({ label: dropdownLabel, to: dropdownTo, active }) =>
                            active && dropdownTo ? (
                              <Link
                                key={dropdownLabel}
                                to={dropdownTo}
                                onClick={dropdownLabel === "Quarters" ? handleQuartersClick : closeAllMenus}
                                className="block rounded-xl px-3 py-2.5 text-xs font-semibold text-white no-underline transition-colors hover:bg-white/10 sm:px-3.5 sm:text-[13px]"
                              >
                                {dropdownLabel}
                              </Link>
                            ) : (
                              <span
                                key={dropdownLabel}
                                className="block cursor-not-allowed rounded-xl px-3 py-2.5 text-xs italic text-slate-400 sm:px-3.5 sm:text-[13px]"
                              >
                                {dropdownLabel}
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
                    className={`flex min-h-[40px] items-center rounded-[18px] px-3 py-2.5 text-xs font-semibold no-underline transition-all sm:min-h-[42px] sm:px-3.5 sm:text-[13px] ${
                      isActive ? "bg-orange-400 text-white" : "bg-slate-50 text-slate-700 hover:bg-orange-100"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.28)]">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Terms and Conditions</h2>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <div className="space-y-3 text-[13.5px] leading-[1.7] text-slate-600">
                {TERMS_AND_CONDITIONS.map((term, index) => (
                  <p key={index}>
                    {index + 1}. {term}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <label className="mb-4 flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={hasAcceptedTerms}
                  onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#e87722]"
                />
                <span>I have read all the terms and conditions mentioned above.</span>
              </label>

              <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setHasAcceptedTerms(false);
                  setShowTermsModal(false);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAgree}
                disabled={!hasAcceptedTerms}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                  hasAcceptedTerms
                    ? "bg-[#e87722] hover:bg-[#d56716]"
                    : "cursor-not-allowed bg-slate-300"
                }`}
              >
                Agree
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
