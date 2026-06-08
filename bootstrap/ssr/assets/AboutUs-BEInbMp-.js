import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BH44Qpoe.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "react";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
function AboutIcon({ type }) {
  if (type === "vehicle") return /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", className: "mx-auto", children: /* @__PURE__ */ jsx("path", { d: "M38.5 14.6667L34.8333 18.3334M34.8333 18.3334L32.0833 11.5501C31.824 10.8559 31.3604 10.2565 30.7536 9.83105C30.1468 9.40559 29.4254 9.17398 28.6843 9.16674H15.4C14.6529 9.14958 13.9184 9.3611 13.2949 9.77296C12.6714 10.1848 12.1886 10.7774 11.9112 11.4712L9.16667 18.3334M34.8333 18.3334H9.16667M34.8333 18.3334C36.8584 18.3334 38.5 19.975 38.5 22.0001V29.3334C38.5 31.3584 36.8584 33.0001 34.8333 33.0001M9.16667 18.3334L5.5 14.6667M9.16667 18.3334C7.14162 18.3334 5.5 19.975 5.5 22.0001V29.3334C5.5 31.3584 7.14162 33.0001 9.16667 33.0001M12.8333 25.6667H12.8517M31.1667 25.6667H31.185M34.8333 33.0001H9.16667M34.8333 33.0001V36.6667M9.16667 33.0001V36.6667", stroke: "#43ACE9", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
  if (type === "stock") return /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", className: "mx-auto", children: /* @__PURE__ */ jsx("path", { d: "M31.1665 33.0001H32.9998M21.9998 33.0001H23.8332M12.8332 33.0001H14.6665M3.6665 36.6667C3.6665 37.6392 4.05281 38.5718 4.74045 39.2595C5.42808 39.9471 6.36071 40.3334 7.33317 40.3334H36.6665C37.639 40.3334 38.5716 39.9471 39.2592 39.2595C39.9469 38.5718 40.3332 37.6392 40.3332 36.6667V14.6667L27.4998 23.8334V14.6667L14.6665 23.8334V7.33341C14.6665 6.36095 14.2802 5.42832 13.5926 4.74069C12.9049 4.05306 11.9723 3.66675 10.9998 3.66675H7.33317C6.36071 3.66675 5.42808 4.05306 4.74045 4.74069C4.05281 5.42832 3.6665 6.36095 3.6665 7.33341V36.6667Z", stroke: "#43ACE9", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
  return /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", className: "mx-auto", children: /* @__PURE__ */ jsx("path", { d: "M21.9998 36.6667C25.8897 36.6667 29.6202 35.1215 32.3707 32.371C35.1213 29.6204 36.6665 25.8899 36.6665 22.0001C36.6665 18.1102 35.1213 14.3797 32.3707 11.6292C29.6202 8.87865 25.8897 7.33341 21.9998 7.33341M21.9998 36.6667C18.11 36.6667 14.3795 35.1215 11.6289 32.371C8.8784 29.6204 7.33317 25.8899 7.33317 22.0001M21.9998 36.6667V40.3334M21.9998 7.33341C18.11 7.33341 14.3795 8.87865 11.6289 11.6292C8.8784 14.3797 7.33317 18.1102 7.33317 22.0001M21.9998 7.33341V3.66675M7.33317 22.0001H3.6665M25.6665 22.0001C25.6665 22.9725 25.2802 23.9052 24.5926 24.5928C23.9049 25.2804 22.9723 25.6667 21.9998 25.6667C21.0274 25.6667 20.0947 25.2804 19.4071 24.5928C18.7195 23.9052 18.3332 22.9725 18.3332 22.0001C18.3332 21.0276 18.7195 20.095 19.4071 19.4074C20.0947 18.7197 21.0274 18.3334 21.9998 18.3334C22.9723 18.3334 23.9049 18.7197 24.5926 19.4074C25.2802 20.095 25.6665 21.0276 25.6665 22.0001ZM25.6665 22.0001H40.3332M31.1665 37.8767L29.3332 34.7051M20.1665 18.8284L12.8332 6.12341M37.8765 31.1667L34.7048 29.3334M6.12317 12.8334L9.29484 14.6667M37.8765 12.8334L34.7048 14.6667M6.12317 31.1667L9.29484 29.3334M31.1665 6.12341L29.3332 9.29508M20.1665 25.1717L12.8332 37.8767", stroke: "#43ACE9", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function AboutUs() {
  const { t } = useTranslate();
  const valueCards = [
    { title: t("about.value_cards.transparent.title"), text: t("about.value_cards.transparent.text"), image: "/assets/images/message-circle-heart.png", alt: t("about.value_cards.transparent.title") },
    { title: t("about.value_cards.flexible.title"), text: t("about.value_cards.flexible.text"), image: "/assets/images/send-to-back.png", alt: t("about.value_cards.flexible.title") },
    { title: t("about.value_cards.accessible.title"), text: t("about.value_cards.accessible.text"), image: "/assets/images/scan-face.png", alt: t("about.value_cards.accessible.title") }
  ];
  const beyondCards = [
    { title: t("about.beyond_cards.vehicles.title"), text: t("about.beyond_cards.vehicles.text"), icon: "vehicle" },
    { title: t("about.beyond_cards.stock.title"), text: t("about.beyond_cards.stock.text"), icon: "stock" },
    { title: t("about.beyond_cards.services.title"), text: t("about.beyond_cards.services.text"), icon: "services" }
  ];
  const whyChooseItems = [
    { title: t("about.why_choose.item_1.title"), text: t("about.why_choose.item_1.text") },
    { title: t("about.why_choose.item_2.title"), text: t("about.why_choose.item_2.text") },
    { title: t("about.why_choose.item_3.title"), text: t("about.why_choose.item_3.text") }
  ];
  const howItWorksItems = [
    { title: t("about.how_it_works.item_1.title"), text: t("about.how_it_works.item_1.text") },
    { title: t("about.how_it_works.item_2.title"), text: t("about.how_it_works.item_2.text") },
    { title: t("about.how_it_works.item_3.title"), text: t("about.how_it_works.item_3.text") },
    { title: t("about.how_it_works.item_4.title"), text: t("about.how_it_works.item_4.text") }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: t("about.meta_title") }),
    /* @__PURE__ */ jsx("section", { className: "py-5 bg-light about-bg-image about-bg-image-top", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "row align-items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-4 mb-md-0", children: [
        /* @__PURE__ */ jsx("h2", { className: "h1 mb-4 text-gray-900", children: t("about.intro_title") }),
        /* @__PURE__ */ jsx("p", { className: "mb-3 text-secondary", children: t("about.intro_paragraph_one") }),
        /* @__PURE__ */ jsx("p", { className: "text-secondary", children: t("about.intro_paragraph_two") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "col-md-6 text-md-end", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/about_main.png", alt: "About XpertBid", className: "img-fluid rounded-3" }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5 about-bg-image", style: { backgroundColor: "#f3f4f6" }, children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center text-center", children: /* @__PURE__ */ jsxs("div", { className: "col-lg-12 py-5", children: [
      /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "95", height: "88", viewBox: "0 0 95 88", fill: "none", className: "mx-auto d-block", children: [
        /* @__PURE__ */ jsx("path", { d: "M80.6235 87.2321H63.0009L43.616 67.8472L52.8679 59.4764L80.6235 87.2321Z", fill: "#141416" }),
        /* @__PURE__ */ jsx("path", { d: "M0 24.2312H18.0632L36.1264 42.4216L27.3151 51.9868L0 24.2312Z", fill: "#141416" }),
        /* @__PURE__ */ jsx("path", { d: "M74.0144 12.3358L0.439941 87.232H17.622L84.1474 20.266L89.4342 30.399L94.2804 0L63.0002 6.16792L74.0144 12.3358Z", fill: "#43ACE9" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "h1 fw-bold my-3 text-gray-900", children: t("about.mission_title") }),
      /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: t("about.mission_text") })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5 sbs", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container sbs", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "main-heading-about text-gray-900", children: t("about.what_we_do_title") }),
        /* @__PURE__ */ jsx("p", { className: "text-secondary about-title", children: t("about.what_we_do_text") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "row g-4", children: valueCards.map((card) => /* @__PURE__ */ jsx("div", { className: "col-md-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "card border-0 h-100 text-center p-5 about-box", children: [
        /* @__PURE__ */ jsx("img", { src: card.image, alt: card.alt, className: "mb-3 mx-auto", style: { width: "40px", height: "auto" } }),
        /* @__PURE__ */ jsx("h5", { className: "about-box-title text-gray-900", children: card.title }),
        /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: card.text })
      ] }) }, card.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5 sbs", style: { backgroundColor: "#23262F" }, children: /* @__PURE__ */ jsxs("div", { className: "container sbs", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center mb-5", children: /* @__PURE__ */ jsx("h2", { className: "main-heading-about-uniqe", style: { color: "#fff" }, children: t("about.beyond_title") }) }),
      /* @__PURE__ */ jsx("div", { className: "row g-4", children: beyondCards.map((card) => /* @__PURE__ */ jsx("div", { className: "col-md-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "card border-0 h-100 text-center p-5 about-box", children: [
        /* @__PURE__ */ jsx(AboutIcon, { type: card.icon }),
        /* @__PURE__ */ jsx("h5", { className: "about-box-title text-gray-900", children: card.title }),
        /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: card.text })
      ] }) }, card.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5 sbs", style: { backgroundColor: "#fff" }, children: /* @__PURE__ */ jsxs("div", { className: "container py-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-center main-heading-about mb-5 text-gray-900", children: t("about.why_choose_title") }),
      /* @__PURE__ */ jsxs("div", { className: "row align-items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "col-md-6", children: whyChooseItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("h5", { className: "asksub text-gray-900", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: item.text })
        ] }, item.title)) }),
        /* @__PURE__ */ jsx("div", { className: "col-md-6 text-md-end", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/sky.png", alt: "Why choose XpertBid", className: "img-fluid rounded-3" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5 sbs about-bg-image", style: { backgroundColor: "#23262F" }, children: /* @__PURE__ */ jsx("div", { className: "container sbs py-5", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center text-center", children: /* @__PURE__ */ jsxs("div", { className: "col-lg-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "h1 fw-bold my-3", style: { color: "#fff" }, children: t("about.story_title") }),
      /* @__PURE__ */ jsx("p", { className: "mb-0", style: { color: "#fff" }, children: t("about.story_text") })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5 sbs", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "main-heading-about text-gray-900", children: t("about.how_it_works_title") }),
        /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: t("about.how_it_works_text") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "row g-4", children: howItWorksItems.map((item) => /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "card border-0 shadow-sm h-100 p-4 about-box", children: [
        /* @__PURE__ */ jsx("h5", { className: "asksub text-gray-900", children: item.title }),
        /* @__PURE__ */ jsx("p", { className: "text-secondary mb-0", children: item.text })
      ] }) }, item.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5 sbs about-bg-image", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsx("div", { className: "container py-5", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center text-center", children: /* @__PURE__ */ jsxs("div", { className: "col-lg-12 p-5", style: { backgroundColor: "#23262F", borderRadius: "40px" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "h1 fw-bold my-3", style: { color: "#fff" }, children: t("about.vision_title") }),
      /* @__PURE__ */ jsx("p", { className: "my-4", style: { color: "#fff" }, children: t("about.vision_paragraph_one") }),
      /* @__PURE__ */ jsx("p", { className: "my-4", style: { color: "#fff" }, children: t("about.vision_paragraph_two") })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-5", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "row g-4", children: [
      /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "card border-0 shadow-sm h-100 p-4 about-box", children: [
        /* @__PURE__ */ jsx("h5", { className: "asksub text-gray-900", children: t("about.join_movement_title") }),
        /* @__PURE__ */ jsx("p", { className: "about-last mb-0", children: t("about.join_movement_text") })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "card border-0 shadow-sm h-100 p-4 about-box", children: [
        /* @__PURE__ */ jsx("h5", { className: "asksub text-gray-900", children: t("about.join_us_title") }),
        /* @__PURE__ */ jsx("p", { className: "about-last mb-0", children: t("about.join_us_text") })
      ] }) })
    ] }) }) })
  ] });
}
export {
  AboutUs as default
};
