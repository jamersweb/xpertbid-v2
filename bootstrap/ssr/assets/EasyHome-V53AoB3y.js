import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BH44Qpoe.js";
import { C as ContactForm } from "./ContactForm-BQglLNCx.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./ErrorPopup-VSFE5nHL.js";
const financePlans = [
  {
    key: "buyer",
    title: "XpertBid Easy Buyer",
    subtitle: "Move into a verified property with a flexible ownership path.",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600",
    maxFinanceRatio: 0.75,
    tenureLabel: "3 to 25 years",
    rate: 13.5,
    bullets: [
      "Ideal for ready properties and listed homes",
      "Guided installment planning for salaried and business buyers",
      "Best for customers who want predictable monthly payments"
    ]
  },
  {
    key: "builder",
    title: "XpertBid Easy Builder",
    subtitle: "Buy land and build step by step with a structured timeline.",
    image: "https://images.pexels.com/photos/1105754/pexels-photo-1105754.jpeg?auto=compress&cs=tinysrgb&w=1600",
    maxFinanceRatio: 0.7,
    tenureLabel: "2 to 25 years",
    rate: 13.25,
    bullets: [
      "For plot purchase plus construction support",
      "Useful for self-build and family home planning",
      "Great for long-horizon property owners"
    ]
  },
  {
    key: "renovate",
    title: "XpertBid Easy Renovate",
    subtitle: "Upgrade your current home with a budget-friendly plan.",
    image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1600",
    maxFinanceRatio: 0.3,
    tenureLabel: "2 to 15 years",
    rate: 14.25,
    bullets: [
      "Perfect for repair, refurbishment, and extension work",
      "Shorter tenure with practical monthly commitments",
      "Supports value-adding home improvement projects"
    ]
  },
  {
    key: "replace",
    title: "XpertBid Easy Replace",
    subtitle: "Shift your existing property finance into a cleaner structure.",
    image: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600",
    maxFinanceRatio: 0.75,
    tenureLabel: "3 to 25 years",
    rate: 13.35,
    bullets: [
      "Designed for existing mortgage/finance transfer cases",
      "Ideal when customers want better structure or service",
      "Keeps the plan organized under one clear ownership path"
    ]
  },
  {
    key: "enhancement",
    title: "XpertBid Easy Enhancement",
    subtitle: "Add extra financing against an existing property facility.",
    image: "https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    maxFinanceRatio: 0.65,
    tenureLabel: "Up to remaining tenure",
    rate: 13.6,
    bullets: [
      "Useful for customers who already have an active facility",
      "Can help with renovation or value-add upgrades",
      "Keeps the property journey in one ecosystem"
    ]
  }
];
const benefitCards = [
  {
    icon: "fa-shield-heart",
    title: "XpertBid-first confidence",
    text: "A polished property-financing experience aligned with trust, verified inventory, and clear ownership guidance."
  },
  {
    icon: "fa-hand-holding-dollar",
    title: "Flexible ownership planning",
    text: "Choose a path that suits your budget, whether you are buying a ready unit, building, renovating, or switching plans."
  },
  {
    icon: "fa-chart-line",
    title: "Transparent monthly view",
    text: "See an estimate before you proceed so users understand the shape of the payment journey early."
  }
];
const howItWorks = [
  {
    step: "01",
    title: "Pick your plan",
    text: "Select the path that fits your property goal: buy, build, renovate, replace, or enhance."
  },
  {
    step: "02",
    title: "Estimate your budget",
    text: "Use the live calculator to see the approximate monthly commitment and financing share."
  },
  {
    step: "03",
    title: "Submit your interest",
    text: "Share your details so the team can contact you with the right property and financing path."
  },
  {
    step: "04",
    title: "Move with clarity",
    text: "Proceed with a guided process that keeps the property journey simple and well-structured."
  }
];
const eligibilityBlocks = [
  {
    title: "Who can explore it",
    items: [
      "Pakistani residents and non-residents",
      "Salaried professionals and business owners",
      "Buyers looking for verified property options"
    ]
  },
  {
    title: "What we usually review",
    items: [
      "Income profile and repayment comfort",
      "Property value and expected financing share",
      "Basic documents and contact details"
    ]
  },
  {
    title: "Best use cases",
    items: [
      "Purchase of a ready home or apartment",
      "Construction on owned land",
      "Renovation or improvement projects"
    ]
  }
];
const heroImages = [
  "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1600"
];
const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0
});
function SectionTitle({ eyebrow, title, description, centered = false }) {
  return /* @__PURE__ */ jsxs("div", { className: `${centered ? "text-center" : ""} mb-4 mb-lg-5`, children: [
    eyebrow && /* @__PURE__ */ jsx("div", { className: "text-uppercase fw-bold text-primary small mb-2", children: eyebrow }),
    /* @__PURE__ */ jsx("h2", { className: "fw-black text-gray-900 mb-3", style: { fontSize: "clamp(1.7rem, 2.6vw, 3rem)" }, children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", style: { maxWidth: centered ? "760px" : "720px", margin: centered ? "0 auto" : "0" }, children: description })
  ] });
}
function EasyHome() {
  const [activePlanKey, setActivePlanKey] = useState("buyer");
  const [propertyValue, setPropertyValue] = useState(25e6);
  const [downPayment, setDownPayment] = useState(5e6);
  const [tenureYears, setTenureYears] = useState(15);
  const activePlan = financePlans.find((plan) => plan.key === activePlanKey) || financePlans[0];
  const calculatorData = useMemo(() => {
    const selectedPropertyValue = Number(propertyValue) || 0;
    const selectedDownPayment = Math.min(Number(downPayment) || 0, selectedPropertyValue);
    const financedAmount = Math.max(selectedPropertyValue - selectedDownPayment, 0);
    const monthlyRate = activePlan.rate / 100 / 12;
    const totalMonths = Math.max(Number(tenureYears) || 1, 1) * 12;
    const principalComponent = financedAmount / totalMonths;
    const profitComponent = financedAmount * monthlyRate;
    const estimatedMonthly = Math.max(Math.round(principalComponent + profitComponent), 0);
    return {
      financedAmount,
      selectedDownPayment,
      selectedPropertyValue,
      estimatedMonthly,
      financingShare: selectedPropertyValue > 0 ? Math.round(financedAmount / selectedPropertyValue * 100) : 0
    };
  }, [activePlan.rate, downPayment, propertyValue, tenureYears]);
  const heroStats = [
    { value: "5", label: "property paths" },
    { value: "75%", label: "maximum financing ratio" },
    { value: "24/7", label: "guided inquiry window" }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsxs("div", { className: "easy-home-page", children: [
      /* @__PURE__ */ jsx(Head, { title: "XpertBid Easy Home", children: /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "XpertBid Easy Home is a branded property-financing guide with flexible plans, a live estimator, and verified project support."
        }
      ) }),
      /* @__PURE__ */ jsx("section", { className: "hero-section", children: /* @__PURE__ */ jsx("div", { className: "container py-5 py-lg-6", children: /* @__PURE__ */ jsxs("div", { className: "row align-items-center g-4 g-lg-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-lg-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 mb-4 hero-chip", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-house-chimney text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "XpertBid Easy Home" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "display-5 fw-black text-white mb-3", children: "A premium, XpertBid-branded path to property ownership." }),
          /* @__PURE__ */ jsx("p", { className: "lead text-white-75 mb-4", children: "Easy Home brings a clean, modern property-financing experience to XpertBid - with guided plans for buying, building, renovating, replacing, and enhancing a home." }),
          /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("a", { href: "#calculator", className: "btn home-pill-btn home-pill-btn-primary btn-lg px-4 fw-bold", children: "Estimate Monthly Payment" }),
            /* @__PURE__ */ jsx("a", { href: "#contact", className: "btn home-pill-btn home-pill-btn-outline btn-lg px-4 fw-bold", children: "Talk to XpertBid Team" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "row g-3", children: heroStats.map((stat) => /* @__PURE__ */ jsx("div", { className: "col-12 col-sm-4", children: /* @__PURE__ */ jsxs("div", { className: "hero-stat-card h-100", children: [
            /* @__PURE__ */ jsx("div", { className: "hero-stat-value", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "hero-stat-label", children: stat.label })
          ] }) }, stat.label)) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-lg-6", children: /* @__PURE__ */ jsxs("div", { className: "hero-gallery", children: [
          /* @__PURE__ */ jsx("img", { src: heroImages[0], alt: "XpertBid Easy Home hero property", className: "hero-main-image" }),
          /* @__PURE__ */ jsxs("div", { className: "hero-image-stack", children: [
            /* @__PURE__ */ jsx("img", { src: heroImages[1], alt: "Modern interior property", className: "hero-stack-image" }),
            /* @__PURE__ */ jsx("img", { src: heroImages[2], alt: "Residential property exterior", className: "hero-stack-image" })
          ] })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            eyebrow: "Why XpertBid Easy Home",
            title: "Designed to feel premium, transparent, and easy to understand.",
            description: "The structure mirrors the clarity of a leading bank product page, but the content, brand language, and look are fully tailored to XpertBid."
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "row g-4", children: benefitCards.map((card) => /* @__PURE__ */ jsx("div", { className: "col-md-4", children: /* @__PURE__ */ jsxs("div", { className: "benefit-card h-100", children: [
          /* @__PURE__ */ jsx("div", { className: "benefit-icon", children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${card.icon}` }) }),
          /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold text-gray-900 mt-4", children: card.title }),
          /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: card.text })
        ] }) }, card.title)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "section-pad section-dark", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "row align-items-center g-4 g-lg-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-lg-6", children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              eyebrow: "Strategic spotlight",
              title: "Verified communities, smarter discovery, and guided property support.",
              description: "XpertBid Easy Home can be positioned around partner communities, curated listings, and a cleaner journey from interest to enquiry."
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "spotlight-list", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check text-primary me-2" }),
              "Partner project showcases with modern visuals"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check text-primary me-2" }),
              "Clear property details and eligibility guidance"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check text-primary me-2" }),
              "Simple call-to-action flow for enquiries"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap gap-3 mt-4", children: [
            /* @__PURE__ */ jsx("a", { href: "#plans", className: "btn home-pill-btn home-pill-btn-primary px-4 fw-bold", children: "See Plans" }),
            /* @__PURE__ */ jsx(Link, { href: "/contact", className: "btn home-pill-btn home-pill-btn-outline px-4 fw-bold", children: "Contact Page" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-lg-6", children: /* @__PURE__ */ jsxs("div", { className: "spotlight-card", children: [
          /* @__PURE__ */ jsx("div", { className: "spotlight-image", style: { backgroundImage: "linear-gradient(180deg, rgba(15,17,23,0.08), rgba(15,17,23,0.3)), url(https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600)" }, role: "img", "aria-label": "Partner community property" }),
          /* @__PURE__ */ jsxs("div", { className: "spotlight-overlay", children: [
            /* @__PURE__ */ jsx("div", { className: "spotlight-badge", children: "Featured community" }),
            /* @__PURE__ */ jsx("h3", { className: "h4 fw-bold mb-2", children: "Modern homes with premium presentation" }),
            /* @__PURE__ */ jsx("p", { className: "mb-0 text-white-75", children: "Dummy image content is used here to keep the design visually rich on both desktop and mobile." })
          ] })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { id: "plans", className: "section-pad", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            eyebrow: "Financing paths",
            title: "Five clear plans, each with a distinct purpose.",
            description: "These cards give the page the same product-brochure feel as the reference page, but with XpertBid language and property-first positioning.",
            centered: true
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "row g-4", children: financePlans.map((plan) => /* @__PURE__ */ jsx("div", { className: "col-lg-6", children: /* @__PURE__ */ jsxs("div", { className: `plan-card h-100 ${activePlanKey === plan.key ? "plan-card-active" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "plan-image-wrap", style: { backgroundImage: `linear-gradient(180deg, rgba(15,17,23,0.10), rgba(15,17,23,0.30)), url(${plan.image})` }, role: "img", "aria-label": plan.title, children: [
            /* @__PURE__ */ jsx("span", { className: "plan-image-pill", children: "XpertBid Property" }),
            /* @__PURE__ */ jsx("span", { className: "plan-image-title", children: plan.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "plan-body", children: [
            /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-start justify-content-between gap-3 mb-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "text-uppercase text-primary small fw-bold mb-1", children: [
                  "Plan ",
                  plan.key.toUpperCase()
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "h4 fw-black text-gray-900 mb-2", children: plan.title }),
                /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: plan.subtitle })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `btn home-toggle-btn px-3 fw-bold ${activePlanKey === plan.key ? "btn-dark" : "btn-outline-dark"}`,
                  onClick: () => setActivePlanKey(plan.key),
                  children: activePlanKey === plan.key ? "Selected" : "Select"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "plan-meta", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { children: "Financing ratio" }),
                /* @__PURE__ */ jsxs("strong", { children: [
                  "Up to ",
                  (plan.maxFinanceRatio * 100).toFixed(0),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { children: "Tenure" }),
                /* @__PURE__ */ jsx("strong", { children: plan.tenureLabel })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { children: "Sample annual rate" }),
                /* @__PURE__ */ jsxs("strong", { children: [
                  plan.rate.toFixed(2),
                  "%"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "plan-bullets", children: plan.bullets.map((bullet) => /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check text-primary me-2" }),
              bullet
            ] }, bullet)) })
          ] })
        ] }) }, plan.key)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "calculator", className: "section-pad section-soft", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            eyebrow: "Payment estimator",
            title: "A simple calculator for the first conversation.",
            description: "This is an estimate-only tool that helps users understand the shape of the monthly commitment before they enquire."
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "row align-items-stretch g-4 g-lg-5", children: [
          /* @__PURE__ */ jsx("div", { className: "col-lg-6 d-flex", children: /* @__PURE__ */ jsxs("div", { className: "calculator-card h-100 w-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-gray-900", children: "Property value" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  value: propertyValue,
                  onChange: (event) => setPropertyValue(Number(event.target.value)),
                  className: "form-control form-control-lg rounded-4"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-gray-900", children: "Down payment" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  value: downPayment,
                  onChange: (event) => setDownPayment(Number(event.target.value)),
                  className: "form-control form-control-lg rounded-4"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-gray-900", children: "Tenure (years)" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  className: "form-select form-select-lg rounded-4",
                  value: tenureYears,
                  onChange: (event) => setTenureYears(Number(event.target.value)),
                  children: [5, 10, 15, 20, 25].map((year) => /* @__PURE__ */ jsxs("option", { value: year, children: [
                    year,
                    " years"
                  ] }, year))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-gray-900", children: "Current plan" }),
              /* @__PURE__ */ jsx("div", { className: "d-flex flex-wrap gap-2", children: financePlans.map((plan) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `btn home-toggle-btn px-3 ${activePlanKey === plan.key ? "btn-dark" : "btn-outline-dark"}`,
                  onClick: () => setActivePlanKey(plan.key),
                  children: plan.title
                },
                plan.key
              )) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-lg-6 d-flex", children: /* @__PURE__ */ jsxs("div", { className: "estimate-card h-100 w-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "estimate-header", children: [
              /* @__PURE__ */ jsx("div", { className: "text-uppercase small fw-bold text-primary", children: "Estimated summary" }),
              /* @__PURE__ */ jsx("h3", { className: "h4 fw-black text-white mb-0", children: activePlan.title })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "estimate-grid", children: [
              /* @__PURE__ */ jsxs("div", { className: "estimate-item", children: [
                /* @__PURE__ */ jsx("span", { children: "Property value" }),
                /* @__PURE__ */ jsx("strong", { children: currencyFormatter.format(calculatorData.selectedPropertyValue) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "estimate-item", children: [
                /* @__PURE__ */ jsx("span", { children: "Down payment" }),
                /* @__PURE__ */ jsx("strong", { children: currencyFormatter.format(calculatorData.selectedDownPayment) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "estimate-item", children: [
                /* @__PURE__ */ jsx("span", { children: "Financed amount" }),
                /* @__PURE__ */ jsx("strong", { children: currencyFormatter.format(calculatorData.financedAmount) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "estimate-item", children: [
                /* @__PURE__ */ jsx("span", { children: "Financing share" }),
                /* @__PURE__ */ jsxs("strong", { children: [
                  calculatorData.financingShare,
                  "%"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "estimate-monthly", children: [
              /* @__PURE__ */ jsx("div", { className: "small text-white-75 mb-1", children: "Estimated monthly payment" }),
              /* @__PURE__ */ jsx("div", { className: "display-6 fw-black text-white mb-1", children: currencyFormatter.format(calculatorData.estimatedMonthly) }),
              /* @__PURE__ */ jsx("div", { className: "text-white-75", children: "Based on the selected plan and a simple estimate model." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "estimate-footer", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-clock text-primary me-2" }),
                "Tenure guide: ",
                activePlan.tenureLabel
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-percent text-primary me-2" }),
                "Sample annual rate: ",
                activePlan.rate.toFixed(2),
                "%"
              ] })
            ] })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "row align-items-center g-4 g-lg-5", children: [
        /* @__PURE__ */ jsx("div", { className: "col-lg-6", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1600&q=80",
            alt: "Modern house exterior",
            className: "img-fluid rounded-5 shadow-lg w-100",
            style: { minHeight: "420px", objectFit: "cover" }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "col-lg-6", children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              eyebrow: "Eligibility guide",
              title: "A straightforward checklist for the first review.",
              description: "This section gives the page the same helpful, trust-building rhythm as the Meezan page while staying aligned with XpertBid."
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "row g-3", children: eligibilityBlocks.map((block) => /* @__PURE__ */ jsx("div", { className: "col-md-12", children: /* @__PURE__ */ jsxs("div", { className: "eligibility-card", children: [
            /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold text-gray-900 mb-3", children: block.title }),
            /* @__PURE__ */ jsx("ul", { className: "eligibility-list mb-0", children: block.items.map((item) => /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check text-primary me-2" }),
              /* @__PURE__ */ jsx("span", { children: item })
            ] }, item)) })
          ] }) }, block.title)) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "section-pad section-dark", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            eyebrow: "How it works",
            title: "A clean four-step journey.",
            description: "Simple, transparent, and easy to follow — the same kind of flow users expect from a premium financing page.",
            centered: true
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "row g-4", children: howItWorks.map((item) => /* @__PURE__ */ jsx("div", { className: "col-md-6 col-lg-3", children: /* @__PURE__ */ jsxs("div", { className: "step-card h-100", children: [
          /* @__PURE__ */ jsx("div", { className: "step-number", children: item.step }),
          /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold text-white mt-3", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-white-75 mb-0", children: item.text })
        ] }) }, item.step)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "contact", className: "section-pad section-soft", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            eyebrow: "Get in touch",
            title: "Let’s shape the right property path for you.",
            description: "We can keep the contact area lightweight and still give users a professional next step for enquiry.",
            centered: true
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "contact-cta-card mb-4", children: /* @__PURE__ */ jsxs("div", { className: "row align-items-center g-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "col-lg-7", children: [
            /* @__PURE__ */ jsx("h3", { className: "h3 fw-black text-white mb-3", children: "Need a guided home ownership discussion?" }),
            /* @__PURE__ */ jsx("p", { className: "text-white-75 mb-4", children: "Use XpertBid Easy Home as a polished content page for property enquiries, partner project discovery, and financing guidance." }),
            /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(Link, { href: "/contact", className: "btn home-pill-btn home-pill-btn-primary px-4 fw-bold", children: "Open Contact Page" }),
              /* @__PURE__ */ jsx("a", { href: "mailto:support@xpertbid.com", className: "btn home-pill-btn home-pill-btn-outline px-4 fw-bold", children: "Email Support" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "col-lg-5", children: /* @__PURE__ */ jsxs("div", { className: "contact-mini-list", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-envelope text-primary me-2" }),
              "support@xpertbid.com"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-phone text-primary me-2" }),
              "+92 302 2113202"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-location-dot text-primary me-2" }),
              "Pakistan | Dubai | Remote assistance"
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-5 shadow-lg p-3 p-lg-4", children: /* @__PURE__ */ jsx(ContactForm, {}) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                            .easy-home-page {
                                   background: #f6f8fc;
                            }

                            .hero-section {
                                   background:
                                          radial-gradient(circle at top left, rgba(67, 172, 233, 0.18), transparent 30%),
                                          linear-gradient(135deg, #090b10 0%, #111520 50%, #1f2733 100%);
                            }

                            .hero-chip {
                                   background: rgba(255, 255, 255, 0.10);
                                   color: #fff;
                                   border: 1px solid rgba(255, 255, 255, 0.12);
                                   backdrop-filter: blur(12px);
                                   border-radius: 999px;
                            }

                            .hero-stat-card {
                                   background: rgba(255, 255, 255, 0.08);
                                   border: 1px solid rgba(255, 255, 255, 0.12);
                                   border-radius: 20px;
                                   padding: 16px;
                                   color: #fff;
                                   backdrop-filter: blur(12px);
                            }

                            .hero-stat-value {
                                   font-size: 1.7rem;
                                   font-weight: 900;
                                   line-height: 1;
                            }

                            .hero-stat-label {
                                   font-size: 0.82rem;
                                   opacity: 0.78;
                                   margin-top: 6px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.06em;
                            }

                            .hero-gallery {
                                   display: grid;
                                   grid-template-columns: 1.2fr 0.8fr;
                                   gap: 16px;
                                   align-items: stretch;
                            }

                            .hero-main-image,
                            .hero-stack-image,
                            .plan-image-wrap,
                            .spotlight-image {
                                   width: 100%;
                                   display: block;
                                   background-size: cover;
                                   background-position: center;
                                   background-repeat: no-repeat;
                            }

                            .hero-main-image {
                                   height: 100%;
                                   min-height: 520px;
                                   border-radius: 36px;
                                   box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
                            }

                            .hero-image-stack {
                                   display: grid;
                                   gap: 16px;
                            }

                            .hero-stack-image {
                                   height: calc(50% - 8px);
                                   min-height: 252px;
                                   border-radius: 32px;
                                   box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
                            }

                            .plan-image-wrap {
                                   height: 280px;
                                   position: relative;
                                   background-color: #dbe6f2;
                                   border-radius: 36px 36px 24px 24px;
                                   overflow: hidden;
                                   border-bottom: 1px solid #edf2f7;
                            }

                            .plan-image-title {
                                   position: absolute;
                                   left: 20px;
                                   bottom: 18px;
                                   color: #fff;
                                   font-size: 1.25rem;
                                   font-weight: 900;
                                   line-height: 1.1;
                                   max-width: calc(100% - 40px);
                                   text-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
                            }

                            .plan-image-pill {
                                   position: absolute;
                                   left: 20px;
                                   top: 20px;
                                   border-radius: 999px;
                                   background: rgba(9, 11, 16, 0.72);
                                   color: #fff;
                                   padding: 6px 12px;
                                   font-size: 12px;
                                   font-weight: 700;
                                   letter-spacing: 0.02em;
                                   backdrop-filter: blur(8px);
                            }

                            .section-pad {
                                   padding: 90px 0;
                            }

                            .section-soft {
                                   background: linear-gradient(180deg, #f6f8fc 0%, #eef3f9 100%);
                            }

                            .section-dark {
                                   background: #171a23;
                            }

                            .section-dark .text-gray-900,
                            .section-dark h2,
                            .section-dark h3,
                            .section-dark h4,
                            .section-dark h5,
                            .section-dark p {
                                   color: #fff !important;
                            }

                            .section-dark .text-secondary {
                                   color: rgba(255, 255, 255, 0.72) !important;
                            }

                            .benefit-card,
                            .calculator-card,
                            .eligibility-card,
                            .contact-cta-card,
                            .step-card,
                            .plan-card,
                            .spotlight-card,
                            .estimate-card {
                                   border-radius: 36px;
                                   overflow: hidden;
                                   box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
                            }

                            .benefit-card,
                            .calculator-card,
                            .eligibility-card {
                                   background: #fff;
                                   padding: 30px;
                            }

                            .benefit-icon {
                                   width: 60px;
                                   height: 60px;
                                   border-radius: 18px;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   background: rgba(67, 172, 233, 0.12);
                                   color: #43ace9;
                                   font-size: 24px;
                            }

                            .spotlight-card {
                                   position: relative;
                                   min-height: 520px;
                                   background: #000;
                            }

                            .spotlight-image {
                                   height: 100%;
                                   min-height: 520px;
                                   opacity: 0.9;
                            }

                            .spotlight-overlay {
                                   position: absolute;
                                   inset: auto 24px 24px 24px;
                                   background: rgba(23, 26, 35, 0.88);
                                   color: #fff;
                                   padding: 24px;
                                   border-radius: 22px;
                                   backdrop-filter: blur(10px);
                            }

                            .spotlight-badge {
                                   display: inline-flex;
                                   align-items: center;
                                   border-radius: 999px;
                                   background: rgba(67, 172, 233, 0.14);
                                   color: #fff;
                                   padding: 6px 12px;
                                   font-size: 12px;
                                   font-weight: 700;
                                   margin-bottom: 12px;
                            }

                            .plan-card {
                                   background: #fff;
                                   border: 1px solid #e8edf4;
                                   border-radius: 36px;
                                   transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                            }

                            .plan-card:hover,
                            .plan-card-active {
                                   transform: translateY(-4px);
                                   border-color: #43ace9;
                                   box-shadow: 0 24px 70px rgba(67, 172, 233, 0.12);
                            }

                            .plan-body {
                                   padding: 26px;
                            }

                            .plan-meta {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 12px;
                                   background: #f7fafc;
                                   border-radius: 18px;
                                   padding: 16px;
                                   margin-bottom: 18px;
                            }

                            .plan-meta span {
                                   display: block;
                                   font-size: 12px;
                                   color: #64748b;
                                   text-transform: uppercase;
                                   letter-spacing: 0.05em;
                                   margin-bottom: 4px;
                            }

                            .plan-meta strong {
                                   color: #0f172a;
                                   font-size: 14px;
                            }

                            .plan-bullets {
                                   list-style: none;
                                   padding: 0;
                                   margin: 0;
                                   display: grid;
                                   gap: 10px;
                            }

                            .plan-bullets li {
                                   color: #334155;
                                   display: flex;
                                   align-items: flex-start;
                            }

                            .calculator-card {
                                   background: #fff;
                            }

                            .estimate-card {
                                   background: linear-gradient(180deg, #0f1117 0%, #171a23 100%);
                                   color: #fff;
                                   padding: 32px;
                                   border-radius: 36px;
                            }

                            .estimate-header {
                                   border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                                   padding-bottom: 18px;
                                   margin-bottom: 18px;
                            }

                            .estimate-grid {
                                   display: grid;
                                   grid-template-columns: repeat(2, minmax(0, 1fr));
                                   gap: 14px;
                            }

                            .estimate-item {
                                   background: rgba(255, 255, 255, 0.07);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   border-radius: 18px;
                                   padding: 16px;
                            }

                            .estimate-item span {
                                   display: block;
                                   font-size: 12px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.05em;
                                   opacity: 0.72;
                                   margin-bottom: 6px;
                            }

                            .estimate-item strong {
                                   font-size: 18px;
                                   font-weight: 800;
                            }

                            .estimate-monthly {
                                   margin-top: 20px;
                                   padding: 24px;
                                   border-radius: 22px;
                                   background: rgba(67, 172, 233, 0.12);
                                   border: 1px solid rgba(67, 172, 233, 0.20);
                            }

                            .estimate-footer {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px 24px;
                                   margin-top: 18px;
                                   color: rgba(255, 255, 255, 0.82);
                            }

                            .eligibility-list {
                                   list-style: none;
                                   padding: 0;
                                   margin: 0;
                                   display: grid;
                                   gap: 10px;
                            }

                            .eligibility-list li {
                                   color: #334155;
                            }

                            .step-card {
                                   background: rgba(255, 255, 255, 0.04);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   padding: 28px;
                            }

                            .step-number {
                                   width: 54px;
                                   height: 54px;
                                   border-radius: 16px;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   background: rgba(67, 172, 233, 0.14);
                                   color: #43ace9;
                                   font-size: 18px;
                                   font-weight: 900;
                            }

                            .contact-cta-card {
                                   background: linear-gradient(135deg, #23262f 0%, #0f1117 100%);
                                   padding: 34px;
                                   color: #fff;
                                   margin-bottom: 28px;
                                   border-radius: 36px;
                            }

                            .home-pill-btn {
                                   border-radius: 12px !important;
                                   padding-top: 0.95rem;
                                   padding-bottom: 0.95rem;
                                   border-width: 2px;
                            }

                            .home-toggle-btn {
                                   border-radius: 12px !important;
                                   min-width: 92px;
                                   padding-top: 0.75rem;
                                   padding-bottom: 0.75rem;
                            }

                            .home-pill-btn-primary {
                                   background: #43ace9 !important;
                                   border-color: #43ace9 !important;
                                   color: #fff !important;
                                   box-shadow: 0 16px 32px rgba(67, 172, 233, 0.28);
                            }

                            .home-pill-btn-primary:hover {
                                   background: #2e96d4 !important;
                                   border-color: #2e96d4 !important;
                                   color: #fff !important;
                            }

                            .home-pill-btn-outline {
                                   border-color: rgba(255, 255, 255, 0.85) !important;
                                   color: #fff !important;
                                   background: transparent !important;
                            }

                            .home-pill-btn-outline:hover {
                                   background: rgba(255, 255, 255, 0.10) !important;
                                   color: #fff !important;
                            }

                            .contact-mini-list {
                                   display: grid;
                                   gap: 14px;
                                   background: rgba(255, 255, 255, 0.06);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   border-radius: 22px;
                                   padding: 22px;
                            }

                            .fw-black {
                                   font-weight: 900;
                            }

                            .text-white-75 {
                                   color: rgba(255, 255, 255, 0.75);
                            }

                            @media (max-width: 991.98px) {
                                   .hero-gallery {
                                          grid-template-columns: 1fr;
                                   }

                                   .hero-main-image,
                                   .spotlight-card,
                                   .spotlight-image {
                                          min-height: 360px;
                                   }

                                   .hero-stack-image {
                                          min-height: 180px;
                                          height: 180px;
                                   }

                                   .section-pad {
                                          padding: 72px 0;
                                   }
                            }

                            @media (max-width: 767.98px) {
                                   .hero-section .display-5 {
                                          font-size: clamp(2rem, 10vw, 2.75rem);
                                   }

                                   .hero-stat-card {
                                          padding: 14px 16px;
                                   }

                                   .hero-stat-value {
                                          font-size: 1.35rem;
                                   }

                                   .hero-stat-label {
                                          font-size: 0.72rem;
                                   }

                                   .plan-meta,
                                   .estimate-grid {
                                          grid-template-columns: 1fr;
                                   }

                                   .contact-cta-card {
                                          padding: 24px;
                                   }

                                   .hero-main-image,
                                   .spotlight-card,
                                   .spotlight-image {
                                          min-height: 240px;
                                   }

                                   .hero-stack-image {
                                          min-height: 150px;
                                          height: 150px;
                                   }
                            }
                     ` })
  ] });
}
export {
  EasyHome as default
};
