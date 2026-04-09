import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-C9PL0wyf.js";
import { A as AuctionCard } from "./AuctionCard-Bk42QYyW.js";
import { router } from "@inertiajs/react";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-BYSFLoir.js";
import "./OwnerInfoRow-Bp3cN_Xd.js";
import "./FavoriteToggleButton-1jmbejDw.js";
const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return /* @__PURE__ */ jsx("ul", { className: "nav nav-tabs bid-tabs-child", role: "tablist", children: tabs.map((tab) => /* @__PURE__ */ jsx(
    "li",
    {
      className: "nav-item flex-grow-1 bid-tabs-anchor",
      role: "presentation",
      children: /* @__PURE__ */ jsx(
        "button",
        {
          className: `nav-link w-100 ${activeTab === tab.id ? "active" : ""}`,
          onClick: () => onTabChange(tab.id),
          type: "button",
          role: "tab",
          children: tab.label
        }
      )
    },
    tab.id
  )) });
};
function Index({ auctions, activeTab }) {
  const tabs = [
    { id: "active", label: "Active Bids", imageSrc: "/assets/images/active_bids.png" },
    { id: "won", label: "Won Auctions", imageSrc: "/assets/images/won_bids.png" },
    { id: "lost", label: "Lost Auctions", imageSrc: "/assets/images/lost_bids.png" }
  ];
  const handleTabChange = (tabId) => {
    router.get(route("bids.index"), { status: tabId }, {
      preserveState: true,
      replace: true
    });
  };
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  return /* @__PURE__ */ jsxs(AppLayout, { title: "My Bids", children: [
    /* @__PURE__ */ jsx("section", { className: "biddings-tabs py-5", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
        TabNavigation,
        {
          tabs,
          activeTab,
          onTabChange: handleTabChange
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "tab-content mt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "row g-4", children: auctions.data.length > 0 ? auctions.data.map((auction) => /* @__PURE__ */ jsx("div", { className: "col-12 col-md-6 col-lg-4", children: /* @__PURE__ */ jsx(
          AuctionCard,
          {
            auction,
            activeTab
          }
        ) }, auction.id)) : /* @__PURE__ */ jsxs("div", { className: "col-12 py-5 d-flex flex-column align-items-center justify-content-center", style: { minHeight: "300px" }, children: [
          currentTab.imageSrc && /* @__PURE__ */ jsx(
            "img",
            {
              src: currentTab.imageSrc,
              alt: currentTab.id,
              className: "mb-3",
              style: { maxWidth: "180px" }
            }
          ),
          /* @__PURE__ */ jsxs("p", { style: { color: "#777E91", fontSize: "16px", fontWeight: "500", textAlign: "center" }, children: [
            activeTab === "active" && "You have no active bids yet.",
            activeTab === "won" && "You haven't won any auctions yet.",
            activeTab === "lost" && "You haven't lost any auctions yet."
          ] })
        ] }) }),
        auctions.links && auctions.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "d-flex justify-content-center mt-5", children: /* @__PURE__ */ jsx("nav", { "aria-label": "Page navigation", children: /* @__PURE__ */ jsx("ul", { className: "pagination", children: auctions.links.map((link, i) => /* @__PURE__ */ jsx("li", { className: `page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`, children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "page-item",
            onClick: () => link.url && router.get(link.url),
            dangerouslySetInnerHTML: { __html: link.label },
            style: {
              padding: "8px 16px",
              border: "1px solid #dee2e6",
              background: link.active ? "#000" : "#fff",
              color: link.active ? "#fff" : "#000",
              cursor: link.url ? "pointer" : "default"
            }
          }
        ) }, i)) }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                            .bid-tabs-child {
                                   background-color: #F4F5F6;
                                   border-radius: 12px;
                                   padding: 8px;
                                   border: none !important;
                                   border-bottom: none !important;
                                   display: flex;
                                   gap: 0;
                            }
                            .bid-tabs-anchor .nav-link {
                                   border: none !important;
                                   background: transparent !important;
                                   color: #777E91;
                                   font-weight: 600;
                                   font-size: 16px;
                                   padding: 12px 20px;
                                   border-radius: 8px;
                                   transition: all 0.3s ease;
                            }
                            .bid-tabs-anchor .nav-link:hover {
                                   color: #23262F;
                            }
                            .bid-tabs-anchor .nav-link.active {
                                   background: #FFFFFF !important;
                                   color: #23262F !important;
                                   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                            }
                            @media (max-width: 576px) {
                                   .bid-tabs-child {
                                          flex-direction: column;
                                          padding: 16px;
                                          gap: 8px;
                                   }
                            }
                     `
    } })
  ] });
}
export {
  Index as default
};
