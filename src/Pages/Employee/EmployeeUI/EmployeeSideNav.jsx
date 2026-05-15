import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TERMS_ACCEPTED_KEY = "lmsq_terms_accepted";

const sidebarNav = [
  {
    key: "apply",
    label: "Apply for Quarters",
    to: "/Quarters/Apply",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    key: "approval",
    label: "Check Approval",
    to: "/Quarters/Approval",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),

  },
  {
    key: "demand",
    label: "Demand Note",
    to: "/Quarters/DemandNote",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M15 17H9m3-4H9m3-4H9M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
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

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const handleApplyClick = () => {
    if (location.pathname === "/Quarters/Apply") return;
    const accepted = localStorage.getItem(TERMS_ACCEPTED_KEY) === "1";
    if (accepted) {
      navigate("/Quarters/Apply");
      return;
    }

    setHasAcceptedTerms(false);
    setShowTermsModal(true);
  };

  const handleAgree = () => {
    if (!hasAcceptedTerms) return;
    setShowTermsModal(false);
    localStorage.setItem(TERMS_ACCEPTED_KEY, "1");
    navigate("/Quarters/Apply");
  };

  return (
    <>
      <aside className="w-[252px] shrink-0 bg-white flex flex-col overflow-hidden border-r border-[#dde3ee]">

        {/* Meta label */}
        <div className="px-5 pt-[22px] pb-[5px] text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em]">
          PPT Outsiders Menu
        </div>

        {/* Section heading */}
        <div className="px-5 pt-1 pb-4 text-sm font-bold text-slate-800">
          Outsider Services
        </div>

        {/* Nav items */}
        <nav className="px-2.5 flex-1">
          {sidebarNav.map((item) => {
            const active =
              item.key === "apply"
                ? location.pathname === "/Quarters/Apply"
                : location.pathname === item.to;

            const className = `flex w-full items-center gap-[11px] px-[13px] py-2.5 rounded-lg mb-[3px] no-underline text-[13.5px] text-left transition-all duration-150 ${
              active
                ? "font-semibold text-[#e87722] bg-[rgba(232,119,34,0.09)]"
                : "font-medium text-gray-700 bg-transparent hover:bg-slate-100 hover:text-slate-800"
            }`;

            if (item.key === "apply") {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={handleApplyClick}
                  className={className}
                >
                  <span className={`flex items-center shrink-0 ${active ? "text-[#e87722]" : "text-slate-500"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                to={item.to}
                className={className}
              >
                <span className={`flex items-center shrink-0 ${active ? "text-[#e87722]" : "text-slate-500"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-[#e9eef4] mx-4 my-1" />

        {/* Need Help box */}
        <div className="mx-3 mb-4 rounded-[10px] bg-slate-50 border border-[#e2e8f0] px-4 py-3.5">
          <div className="text-[13px] font-bold text-slate-800 mb-1">Need Help?</div>
          <div className="text-[11.5px] text-slate-500 leading-[1.55] mb-2.5">
            Contact our support team for assistance
          </div>

          <div className="flex items-center gap-1.5 text-[11.5px] text-slate-600 mb-[5px]">
            <svg width="13" height="13" fill="none" stroke="#e87722" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2.08 5.18 2 2 0 0 1 4.11 3h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 17.92z" />
            </svg>
            1800-111-XXXX
          </div>

          <div className="flex items-center gap-1.5 text-[11.5px] text-slate-600">
            <svg width="13" height="13" fill="none" stroke="#e87722" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            support@ppa.gov.in
          </div>
        </div>
      </aside>

      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.24)]">
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
