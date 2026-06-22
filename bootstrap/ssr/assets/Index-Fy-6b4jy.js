import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-D_sYDaCl.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "react";
import "./productUrl-BGZvQc2j.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
const imagePath = (cat) => `${cat?.image?.startsWith("/") ? "" : "/"}${cat?.image ?? "images/placeholder.png"}`;
function Index({ categories = [] }) {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Categories"), children: [
    /* @__PURE__ */ jsx("section", { className: "categories-page py-4 py-md-5", style: { backgroundColor: "#F7F8F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("div", { className: "home-section-header mb-4", children: /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("All Categories") }) }) }),
      /* @__PURE__ */ jsx("div", { className: "all-categories-grid", children: categories.map((cat, i) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("marketplace.type", { slug: cat.slug, typeSlug: "auctions" }),
          className: "text-decoration-none all-category-card",
          children: [
            /* @__PURE__ */ jsx("div", { className: "all-category-image", children: /* @__PURE__ */ jsx("img", { src: imagePath(cat), alt: cat.name }) }),
            /* @__PURE__ */ jsx("h3", { className: "all-category-title", children: cat.name })
          ]
        },
        cat.id || i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        .all-categories-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .all-category-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #eceff2;
          padding: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .all-category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .all-category-image {
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 10px;
          overflow: hidden;
          background: #f2f4f5;
          margin-bottom: 10px;
        }

        .all-category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .all-category-title {
          margin: 0;
          color: #002f34;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
          text-transform: capitalize;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .all-categories-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }

          .all-category-title {
            font-size: 15px;
          }
        }
      ` })
  ] });
}
export {
  Index as default
};
