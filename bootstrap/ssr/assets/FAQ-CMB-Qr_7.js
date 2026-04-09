import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-C9PL0wyf.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-BYSFLoir.js";
function FAQ({ faqs = [] }) {
  const [activeTab, setActiveTab] = useState("general");
  const [openAccordion, setOpenAccordion] = useState(null);
  const dynamicGeneralFaqs = faqs.map((faq) => ({
    question: faq.question_text,
    answer: faq.answer_text
  }));
  const faqData = {
    general: dynamicGeneralFaqs.length ? dynamicGeneralFaqs : [
      {
        question: "What is XpertBid?",
        answer: "XpertBid is a secure online auction marketplace that connects verified buyers and sellers for properties, vehicles, and other assets. You can list, bid, and close deals digitally — quickly, transparently, and with full control."
      },
      {
        question: "Where is XpertBid available?",
        answer: "XpertBid currently operates in select regions including Pakistan and the UAE, and is expanding across the Middle East, Asia, and other global markets."
      },
      {
        question: "Who can use XpertBid?",
        answer: "Anyone — individuals, dealers, property owners, freelancers, agents, or companies — can use XpertBid to buy, sell, or rent verified assets through timed auctions."
      },
      {
        question: "How is XpertBid different from regular listing websites?",
        answer: "Unlike traditional portals where you wait for offers, XpertBid enables real-time bidding between verified users. Sellers remain in full control of prices and timelines, while payments are processed securely through trusted third-party systems."
      }
    ],
    property: [
      {
        question: "What kinds of properties can I list?",
        answer: "Residential, commercial, industrial, and rental properties can all be listed — including apartments, offices, plots, villas, shops, and warehouses."
      },
      {
        question: "Do I need a real-estate agent to use XpertBid?",
        answer: "No. You can list and manage your property directly through the platform. Agents and developers can also use XpertBid to reach a wider, verified audience."
      },
      {
        question: "How does a property auction work?",
        answer: "You set your reserve price and auction duration. Verified buyers place live bids during that time. When the auction ends, you can accept or reject the highest offer — you're never obligated to sell."
      },
      {
        question: "Are all users verified?",
        answer: "Yes. Every buyer and seller completes a Know-Your-Customer (KYC) process using valid ID or business credentials before being allowed to list or bid."
      },
      {
        question: "What are the costs for listing or selling property?",
        answer: "Creating an account and listing a property is generally free. A small transaction or success fee may apply once a deal is completed. Optional upgrades like featured listings are also available."
      }
    ],
    vehicles: [
      {
        question: "Can I sell vehicles on XpertBid?",
        answer: "Yes. You can list cars, fleets, or commercial vehicles. All transactions are verified and supported by secure payment handling."
      },
      {
        question: "What other items can I auction?",
        answer: "XpertBid also supports industrial equipment, electronics, home goods, furniture, and surplus inventory. The same secure bidding and payment rules apply across all categories."
      },
      {
        question: "How does bidding work for vehicles and goods?",
        answer: "You set your starting price and auction length. Buyers bid live within that period, and you decide whether to accept the final offer once it closes."
      }
    ],
    membership: [
      {
        question: "Is it free to join XpertBid?",
        answer: "Yes. Basic access is free for all users. Additional membership plans are available with benefits such as: • More or unlimited listings • Early access to auctions • Featured placement for better visibility • Higher bidding credits"
      },
      {
        question: "Do I need separate memberships for each category?",
        answer: "Yes, memberships are category-specific to give sellers the right tools and exposure for each asset type (e.g., property, vehicles, consumer goods)."
      },
      {
        question: "Can I upgrade my membership later?",
        answer: "Absolutely. You can upgrade anytime from your dashboard and instantly unlock new features."
      }
    ],
    payments: [
      {
        question: "How are payments handled?",
        answer: "All payments go through a third-party secured system. Funds are only released once both the buyer and seller confirm the completion of the transaction, ensuring safety on both sides."
      },
      {
        question: "Are there hidden charges?",
        answer: "No. All fees and commissions are shown upfront before you finalize a deal."
      },
      {
        question: "Can I get my money back if a deal doesn't close?",
        answer: "Yes. Deposits or security amounts are fully refundable in line with platform policy when a transaction isn't completed."
      }
    ],
    safety: [
      {
        question: "How does XpertBid ensure safety?",
        answer: "• Every user is identity-verified through KYC. • Listings are monitored for fraud and duplicates. • Only verified users can communicate or bid."
      },
      {
        question: "Can I contact the other party directly?",
        answer: "Yes, once bidding begins. You can use the in-platform chat to coordinate safely with verified participants. Personal contact details are protected until the transaction stage."
      }
    ],
    referral: [
      {
        question: "Can I earn rewards by inviting others?",
        answer: "Yes. XpertBid's referral system allows you to invite new buyers and sellers through your dashboard. You earn platform credits or bonuses when your referrals become active or close successful deals."
      },
      {
        question: "How do I become a partner?",
        answer: "Sign up for the Partner Programme from your dashboard. You'll receive your referral tools (links, QR codes, invite templates) and can start earning from verified transactions right away."
      }
    ],
    support: [
      {
        question: "How do I register on XpertBid?",
        answer: "Simply click Sign Up on xpertbid.com, provide your basic details, and complete KYC verification. Registration usually takes only a few minutes."
      },
      {
        question: "I'm facing an issue uploading images or documents. What should I do?",
        answer: "Ensure your files meet the upload size and format requirements (JPG, PNG, or PDF). If the issue continues, contact customer support."
      },
      {
        question: "How can I reach the support team?",
        answer: "You can reach XpertBid through: 📧 support@xpertbid.com 📞 +971 56 760 3938 Live chat is also available on the website for instant help."
      }
    ]
  };
  const tabs = [
    { id: "general", label: "General Questions" },
    { id: "property", label: "Property Auctions" },
    { id: "vehicles", label: "Vehicles & Other Categories" },
    { id: "membership", label: "Memberships & Plans" },
    { id: "payments", label: "Payments & Transactions" },
    { id: "safety", label: "Safety & Verification" },
    { id: "referral", label: "Referral & Partnership" },
    { id: "support", label: "Technical & Support" }
  ];
  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "FAQ - XpertBid" }),
    /* @__PURE__ */ jsx("style", { children: `
                .faq-page {
                    min-height: 80vh;
                    padding: 2rem 0;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                .faq-tabs .nav-pills .nav-link {
                    background-color: #fff;
                    color: #6c757d;
                    border: 2px solid #e9ecef;
                    margin: 0.25rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    padding: 0.75rem 1rem;
                }
                .faq-tabs .nav-pills .nav-link:hover {
                    background-color: #e9ecef;
                    color: #495057;
                }
                .faq-tabs .nav-pills .nav-link.active {
                    background-color: #23262F !important;
                    color: #fff !important;
                    border-color: #23262F !important;
                    border-width: 2px !important;
                }
                .faq-tabs .nav-pills .nav-link.active:hover {
                    background-color: #43ACE9 !important;
                    color: #fff !important;
                    border-color: #43ACE9 !important;
                }
                .faq-accordion .accordion-item {
                    background-color: #fff;
                    border: 1px solid #e9ecef;
                    border-radius: 0.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .faq-accordion .accordion-button {
                    background-color: #fff;
                    border: none;
                    padding: 1.5rem;
                    font-weight: 600;
                    color: #212529;
                    text-align: left;
                    width: 100%;
                    transition: all 0.3s ease;
                }
                .faq-accordion .accordion-button:hover {
                    background-color: #f8f9fa;
                }
                .faq-accordion .accordion-button:not(.collapsed) {
                    background-color: #e7f3ff;
                    color: #0d6efd;
                }
                .faq-accordion .accordion-button h5 {
                    color: inherit;
                }
                .faq-accordion .accordion-button::after {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-left: auto;
                    content: "";
                    background-repeat: no-repeat;
                    background-size: 1.25rem;
                }
                .faq-accordion .accordion-button:not(.collapsed)::after {
                    transform: rotate(180deg);
                }
                .faq-accordion .accordion-body {
                    padding: 1.5rem;
                    background-color: #fff;
                    color: #23262F;
                    line-height: 1.6;
                    border-top: 1px solid #e9ecef;
                }
                .faq-accordion .accordion-body p {
                    color: #23262F;
                }
                @media (max-width: 768px) {
                    .faq-tabs .nav-pills {
                        flex-direction: column;
                    }
                    .faq-tabs .nav-pills .nav-link {
                        margin: 0.125rem 0;
                        text-align: center;
                    }
                    .faq-header h1 {
                        font-size: 2rem;
                    }
                }
            ` }),
    /* @__PURE__ */ jsx("div", { className: "faq-page", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("div", { className: "row", children: /* @__PURE__ */ jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxs("div", { className: "faq-header text-center py-5", children: [
        /* @__PURE__ */ jsx("h1", { className: "display-4 fw-bold text-dark mb-3", children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsx("p", { className: "lead text-muted", children: "Find answers to common questions about XpertBid" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "row", children: /* @__PURE__ */ jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxs("div", { className: "faq-content", children: [
        /* @__PURE__ */ jsx("div", { className: "faq-tabs mb-4", children: /* @__PURE__ */ jsx("div", { className: "nav nav-pills nav-fill flex-wrap", role: "tablist", children: tabs.map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            className: `nav-link ${activeTab === tab.id ? "active" : ""}`,
            onClick: () => setActiveTab(tab.id),
            type: "button",
            children: tab.label
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
