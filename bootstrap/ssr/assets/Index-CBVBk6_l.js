import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
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
const DEFAULT_BRAND_IMAGE = "/assets/images/auction/1761811512_cf073a6b72be_placeholder-full.jpg";
function Index({ brands = [] }) {
  const { t } = useTranslate();
  const assetSrc = (path) => {
    if (!path) return DEFAULT_BRAND_IMAGE;
    if (String(path).startsWith("http")) return path;
    if (String(path).startsWith("/brand-assets/")) return path;
    if (String(path).startsWith("/storage/")) {
      return `/brand-assets/${String(path).replace(/^\/storage\//, "")}`;
    }
    return `/${String(path).replace(/^\/+/, "")}`;
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Brands"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("Brands") }),
    /* @__PURE__ */ jsx("section", { className: "brands-page py-4 py-md-5", style: { backgroundColor: "#F7F8F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("div", { className: "home-section-header mb-4", children: /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("All Brands") }) }) }),
      /* @__PURE__ */ jsx("div", { className: "brands-grid", children: brands.map((brand, i) => /* @__PURE__ */ jsx(
        Link,
        {
          href: route("properties.brand", { brand: brand.slug }),
          className: "text-decoration-none brand-card-link",
          children: /* @__PURE__ */ jsxs("div", { className: "brand-card", children: [
            /* @__PURE__ */ jsx("div", { className: "brand-image", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: assetSrc(brand.image),
                alt: brand.name || t("Brand"),
                onError: (e) => {
                  if (e.currentTarget.src !== DEFAULT_BRAND_IMAGE) {
                    e.currentTarget.src = DEFAULT_BRAND_IMAGE;
                  }
                }
              }
            ) }),
            /* @__PURE__ */ jsx("h3", { className: "brand-name", children: brand.name })
          ] })
        },
        brand.id || i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .brand-card-link {
          display: block;
        }

        .brand-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #eceff2;
          padding: 12px 12px 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
        }

        .brand-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .brand-image {
          width: 100%;
          max-width: 128px;
          margin: 0 auto 10px;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          background: #f2f4f5;
        }

        .brand-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .brand-name {
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
          .brands-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
          }

          .brand-image {
            max-width: 120px;
          }

          .brand-name {
            font-size: 14px;
          }
        }

        @media (min-width: 1200px) {
          .brands-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      ` })
  ] });
}
export {
  Index as default
};
