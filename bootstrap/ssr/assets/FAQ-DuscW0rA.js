import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-CKzCZqB6.js";
import { u as useTranslate } from "./CurrencyPicker-KgG9a2BI.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
const tabs = [
  { id: "general", labelKey: "faq.tabs.general" },
  { id: "property", labelKey: "faq.tabs.property" },
  { id: "vehicles", labelKey: "faq.tabs.vehicles" },
  { id: "membership", labelKey: "faq.tabs.membership" },
  { id: "payments", labelKey: "faq.tabs.payments" },
  { id: "safety", labelKey: "faq.tabs.safety" },
  { id: "referral", labelKey: "faq.tabs.referral" },
  { id: "support", labelKey: "faq.tabs.support" }
];
const fallbackFaqKeys = {
  general: [
    { questionKey: "faq.fallback.general.1.question", answerKey: "faq.fallback.general.1.answer" },
    { questionKey: "faq.fallback.general.2.question", answerKey: "faq.fallback.general.2.answer" },
    { questionKey: "faq.fallback.general.3.question", answerKey: "faq.fallback.general.3.answer" },
    { questionKey: "faq.fallback.general.4.question", answerKey: "faq.fallback.general.4.answer" }
  ],
  property: [
    { questionKey: "faq.fallback.property.1.question", answerKey: "faq.fallback.property.1.answer" },
    { questionKey: "faq.fallback.property.2.question", answerKey: "faq.fallback.property.2.answer" },
    { questionKey: "faq.fallback.property.3.question", answerKey: "faq.fallback.property.3.answer" }
  ],
  vehicles: [
    { questionKey: "faq.fallback.vehicles.1.question", answerKey: "faq.fallback.vehicles.1.answer" },
    { questionKey: "faq.fallback.vehicles.2.question", answerKey: "faq.fallback.vehicles.2.answer" }
  ],
  membership: [
    { questionKey: "faq.fallback.membership.1.question", answerKey: "faq.fallback.membership.1.answer" },
    { questionKey: "faq.fallback.membership.2.question", answerKey: "faq.fallback.membership.2.answer" }
  ],
  payments: [
    { questionKey: "faq.fallback.payments.1.question", answerKey: "faq.fallback.payments.1.answer" },
    { questionKey: "faq.fallback.payments.2.question", answerKey: "faq.fallback.payments.2.answer" }
  ],
  safety: [
    { questionKey: "faq.fallback.safety.1.question", answerKey: "faq.fallback.safety.1.answer" },
    { questionKey: "faq.fallback.safety.2.question", answerKey: "faq.fallback.safety.2.answer" }
  ],
  referral: [
    { questionKey: "faq.fallback.referral.1.question", answerKey: "faq.fallback.referral.1.answer" },
    { questionKey: "faq.fallback.referral.2.question", answerKey: "faq.fallback.referral.2.answer" }
  ],
  support: [
    { questionKey: "faq.fallback.support.1.question", answerKey: "faq.fallback.support.1.answer" },
    { questionKey: "faq.fallback.support.2.question", answerKey: "faq.fallback.support.2.answer" }
  ]
};
function FAQ({ faqs = [] }) {
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("general");
  const [openAccordion, setOpenAccordion] = useState(null);
  const fallbackFaqs = Object.fromEntries(
    Object.entries(fallbackFaqKeys).map(([group, items]) => [
      group,
      items.map((item) => ({
        question: t(item.questionKey),
        answer: t(item.answerKey)
      }))
    ])
  );
  const dynamicGeneralFaqs = faqs.map((faq) => ({
    question: faq.question_text,
    answer: faq.answer_text
  }));
  const faqData = {
    ...fallbackFaqs,
    general: dynamicGeneralFaqs.length ? dynamicGeneralFaqs : fallbackFaqs.general
  };
  const toggleAccordion = (index) => setOpenAccordion(openAccordion === index ? null : index);
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: t("faq.meta_title") }),
    /* @__PURE__ */ jsx("style", { children: `.faq-page{min-height:80vh;padding:2rem 0;background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%)}.faq-tabs .nav-pills .nav-link{background-color:#fff;color:#6c757d;border:2px solid #e9ecef;margin:.25rem;border-radius:.5rem;font-weight:500;transition:all .3s ease;padding:.75rem 1rem}.faq-tabs .nav-pills .nav-link:hover{background-color:#e9ecef;color:#495057}.faq-tabs .nav-pills .nav-link.active{background-color:#23262F!important;color:#fff!important;border-color:#23262F!important;border-width:2px!important}.faq-tabs .nav-pills .nav-link.active:hover{background-color:#43ACE9!important;color:#fff!important;border-color:#43ACE9!important}.faq-accordion .accordion-item{background-color:#fff;border:1px solid #e9ecef;border-radius:.5rem;box-shadow:0 2px 4px rgba(0,0,0,.1);overflow:hidden}.faq-accordion .accordion-button{background-color:#fff;border:none;padding:1.5rem;font-weight:600;color:#212529;text-align:left;width:100%;transition:all .3s ease}.faq-accordion .accordion-button:hover{background-color:#f8f9fa}.faq-accordion .accordion-button:not(.collapsed){background-color:#e7f3ff;color:#0d6efd}.faq-accordion .accordion-button h5{color:inherit}.faq-accordion .accordion-button::after{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");transition:transform .3s ease;flex-shrink:0;width:1.25rem;height:1.25rem;margin-left:auto;content:"";background-repeat:no-repeat;background-size:1.25rem}.faq-accordion .accordion-button:not(.collapsed)::after{transform:rotate(180deg)}.faq-accordion .accordion-body{padding:1.5rem;background-color:#fff;color:#23262F;line-height:1.6;border-top:1px solid #e9ecef}.faq-accordion .accordion-body p{color:#23262F}@media (max-width:768px){.faq-tabs .nav-pills{flex-direction:column}.faq-tabs .nav-pills .nav-link{margin:.125rem 0;text-align:center}.faq-header h1{font-size:2rem}}` }),
    /* @__PURE__ */ jsx("div", { className: "faq-page", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("div", { className: "row", children: /* @__PURE__ */ jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxs("div", { className: "faq-header text-center py-5", children: [
        /* @__PURE__ */ jsx("h1", { className: "display-4 fw-bold text-dark mb-3", children: t("faq.heading") }),
        /* @__PURE__ */ jsx("p", { className: "lead text-muted", children: t("faq.subtitle") })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "row", children: /* @__PURE__ */ jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxs("div", { className: "faq-content", children: [
        /* @__PURE__ */ jsx("div", { className: "faq-tabs mb-4", children: /* @__PURE__ */ jsx("div", { className: "nav nav-pills nav-fill flex-wrap", role: "tablist", children: tabs.map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            className: `nav-link ${activeTab === tab.id ? "active" : ""}`,
            onClick: () => setActiveTab(tab.id),
            type: "button",
            children: t(tab.labelKey)
          },
          tab.id
        )) }) }),
        /* @__PURE__ */ jsx("div", { className: "faq-accordion", children: faqData[activeTab]?.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "accordion-item mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "accordion-header", children: /* @__PURE__ */ jsx(
            "button",
            {
              className: `accordion-button ${openAccordion === index ? "" : "collapsed"}`,
              type: "button",
              onClick: () => toggleAccordion(index),
              "aria-expanded": openAccordion === index,
              children: /* @__PURE__ */ jsx("h5", { className: "mb-0", children: item.question })
            }
          ) }),
          openAccordion === index && /* @__PURE__ */ jsx("div", { className: "accordion-body", children: /* @__PURE__ */ jsx("p", { className: "mb-0", children: item.answer }) })
        ] }, index)) })
      ] }) }) })
    ] }) })
  ] });
}
export {
  FAQ as default
};
