import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { HiOutlineArrowLeft, HiOutlineEye, HiOutlineQuestionMarkCircle, HiOutlineX, HiOutlineLightBulb, HiOutlineStatusOnline, HiOutlineClipboardList, HiOutlineCalendar } from "react-icons/hi";
import { u as useTranslate } from "./useTranslate-AOp3QZfJ.js";
const statusPill = (status) => {
  const map = {
    open: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    fulfilled: "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
  };
  return map[status] || map.closed;
};
function formatPostedDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(void 0, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "—";
  }
}
function TipsPanel({ t }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 text-sm sm:p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 font-semibold text-slate-900", children: [
      /* @__PURE__ */ jsx(HiOutlineLightBulb, { className: "h-5 w-5 text-amber-500" }),
      t("Tips for quick offers")
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-slate-600", children: [
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" }),
        t("Describe what you need clearly (specs, quantity, brand)")
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" }),
        t("Include reference images")
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" }),
        t("Mention preferred delivery or completion timeline")
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" }),
        t("Set a realistic target budget")
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" }),
        t("Add your area so nearby sellers can offer")
      ] })
    ] })
  ] });
}
function SummaryPanel({ t, buyerRequest }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-900", children: t("Request summary") }),
    /* @__PURE__ */ jsxs("dl", { className: "mt-4 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-1.5 text-slate-500", children: [
          /* @__PURE__ */ jsx(HiOutlineStatusOnline, { className: "h-4 w-4" }),
          t("Status")
        ] }),
        /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusPill(buyerRequest.status)}`,
            children: buyerRequest.status
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-1.5 text-slate-500", children: [
          /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "h-4 w-4" }),
          t("Offers")
        ] }),
        /* @__PURE__ */ jsx("dd", { className: "font-semibold text-slate-900", children: buyerRequest.offers_count ?? buyerRequest.offers?.length ?? 0 })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-1.5 text-slate-500", children: [
          /* @__PURE__ */ jsx(HiOutlineCalendar, { className: "h-4 w-4" }),
          t("Created")
        ] }),
        /* @__PURE__ */ jsx("dd", { className: "font-medium text-slate-700", children: formatPostedDate(buyerRequest.created_at) })
      ] })
    ] })
  ] });
}
function NextStepsPanel({ t }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-900", children: t("What happens next?") }),
    /* @__PURE__ */ jsxs("ol", { className: "mt-3 space-y-2.5 text-sm text-slate-600", children: [
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white", children: "1" }),
        t("Matched sellers get notified")
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white", children: "2" }),
        t("Compare offers and chat")
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white", children: "3" }),
        t("Accept the best offer")
      ] })
    ] })
  ] });
}
function FormLayout({
  title,
  isEdit = false,
  buyerRequest = null,
  submitting = false,
  onSubmit,
  submitLabel,
  submittingLabel,
  children
}) {
  const { t } = useTranslate();
  const [helpOpen, setHelpOpen] = useState(false);
  useEffect(() => {
    if (!helpOpen) return void 0;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setHelpOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [helpOpen]);
  const helpPanels = /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(TipsPanel, { t }),
    isEdit && buyerRequest ? /* @__PURE__ */ jsx(SummaryPanel, { t, buyerRequest }) : /* @__PURE__ */ jsx(NextStepsPanel, { t })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 pb-24 sm:pb-8", children: [
    /* @__PURE__ */ jsx(QuillStyles, {}),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-2.5 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("buyer-requests.index"),
            className: "mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900",
            children: [
              /* @__PURE__ */ jsx(HiOutlineArrowLeft, { className: "h-4 w-4" }),
              t("Back to Requests")
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-gray-900 sm:text-2xl", children: title })
      ] }),
      /* @__PURE__ */ jsxs("form", { id: "buyer-request-form", onSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-4 lg:col-span-2 sm:space-y-5", children }),
          /* @__PURE__ */ jsxs("aside", { className: "hidden space-y-4 lg:col-span-1 lg:block lg:sticky lg:top-6 lg:self-start sm:space-y-5", children: [
            helpPanels,
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: submitting,
                  className: "inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60",
                  children: submitting ? submittingLabel : submitLabel
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("buyer-requests.index"),
                  className: "inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 no-underline transition hover:bg-slate-50",
                  children: t("Cancel")
                }
              ),
              isEdit && buyerRequest && /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route(
                    "buyer-requests.show",
                    buyerRequest.slug || buyerRequest
                  ),
                  className: "inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900",
                  children: [
                    /* @__PURE__ */ jsx(HiOutlineEye, { className: "h-4 w-4" }),
                    t("View live request")
                  ]
                }
              )
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:mt-5 sm:p-4 lg:hidden", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("buyer-requests.index"),
              className: "inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 no-underline transition hover:bg-slate-50",
              children: t("Cancel")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: submitting,
              className: "inline-flex flex-[1.4] items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-60",
              children: submitting ? submittingLabel : submitLabel
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setHelpOpen(true),
        className: "fixed z-[10000] inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition hover:bg-slate-50 lg:hidden",
        style: { right: 23, bottom: 150 },
        "aria-label": t("Help & summary"),
        children: /* @__PURE__ */ jsx(HiOutlineQuestionMarkCircle, { className: "h-7 w-7" })
      }
    ),
    helpOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[10050] lg:hidden", role: "dialog", "aria-modal": "true", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "absolute inset-0 bg-slate-900/45 animate-[brHelpFade_0.35s_ease-out]",
          "aria-label": t("Close"),
          onClick: () => setHelpOpen(false)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-y-0 right-0 flex w-full max-w-full flex-col bg-slate-50 shadow-2xl animate-[brHelpSlide_0.38s_cubic-bezier(0.22,1,0.36,1)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-slate-900", children: isEdit ? t("Request summary") : t("Tips & next steps") }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setHelpOpen(false),
              className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50",
              "aria-label": t("Close"),
              children: /* @__PURE__ */ jsx(HiOutlineX, { className: "h-5 w-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4", children: helpPanels })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                        @keyframes brHelpSlide {
                            from { transform: translateX(100%); opacity: 0.96; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                        @keyframes brHelpFade {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    ` })
    ] })
  ] });
}
function FormCard({ title, description, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5 md:p-6", children: [
    (title || description) && /* @__PURE__ */ jsxs("div", { className: "mb-4 sm:mb-5", children: [
      title && /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-gray-900 sm:text-lg", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-slate-500", children: description })
    ] }),
    children
  ] });
}
function FieldLabel({ children, required = false }) {
  return /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-slate-800", children: [
    children,
    required && /* @__PURE__ */ jsx("span", { className: "ml-0.5 text-rose-500", children: "*" })
  ] });
}
function FieldError({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: message });
}
const inputClass = (hasError = false) => `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${hasError ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-gray-200 focus:border-slate-400 focus:ring-slate-100"}`;
function QuillStyles() {
  return /* @__PURE__ */ jsx("style", { children: `
            .br-quill .ql-toolbar.ql-snow {
                border: none;
                border-bottom: 1px solid #e5e7eb;
                background: #f8fafc;
                padding: 10px 12px;
            }
            .br-quill .ql-container.ql-snow {
                border: none;
                font-size: 14px;
                min-height: 140px;
                background: #fff;
                color: #0f172a;
            }
            .br-quill .ql-editor {
                min-height: 140px;
                padding: 14px 16px;
                color: #0f172a !important;
                background: #fff !important;
                cursor: text;
            }
            .br-quill .ql-editor p,
            .br-quill .ql-editor li,
            .br-quill .ql-editor span,
            .br-quill .ql-editor div {
                color: #0f172a !important;
            }
            .br-quill .ql-editor.ql-blank::before {
                left: 16px;
                right: 16px;
                font-style: normal;
                color: #94a3b8 !important;
                opacity: 1;
            }
        ` });
}
export {
  FieldError,
  FieldLabel,
  FormCard,
  QuillStyles,
  FormLayout as default,
  inputClass
};
