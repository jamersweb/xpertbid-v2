import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-DGCnkUrN.js";
import { A as AlphabetDirectory } from "./AlphabetDirectory-D-BFz7Ty.js";
import { M as MallHeroBanner } from "./MallHeroBanner-CRohH5SK.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./productUrl-DG64MGAp.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
const MALL_BANNER = "/assets/images/WebsiteBanner1.png";
function Show({ mall, sellers = [] }) {
  const { t } = useTranslate();
  const items = (sellers || []).map((seller) => ({
    id: seller.id,
    label: seller.label || seller.company_name || seller.name,
    userId: seller.id
  }));
  return /* @__PURE__ */ jsxs(AppLayout, { title: mall?.name || t("Malls"), children: [
    /* @__PURE__ */ jsx(Head, { title: `${mall?.name || t("Malls")} | ${t("Sellers")}` }),
    /* @__PURE__ */ jsxs("section", { className: "mall-directory", children: [
      /* @__PURE__ */ jsx(
        MallHeroBanner,
        {
          image: MALL_BANNER,
          eyebrow: t("Mall"),
          title: mall?.name,
          subtitle: t("Select a verified seller to view their products.")
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "container py-4 py-lg-5", children: [
        /* @__PURE__ */ jsxs(Link, { href: route("malls.index"), className: "mall-directory__back", children: [
          "← ",
          t("All Malls")
        ] }),
        /* @__PURE__ */ jsx(
          AlphabetDirectory,
          {
            items,
            emptyMessage: t("No verified corporate sellers for this mall yet."),
            onSelect: (item) => router.get(route("malls.seller", {
              mall: mall.slug,
              user: item.userId
            }))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                            .mall-directory {
                                   background: #F9F9F9;
                                   min-height: 60vh;
                            }
                            .mall-directory__back {
                                   display: inline-block;
                                   margin-bottom: 16px;
                                   color: #777E91;
                                   font-size: 14px;
                                   font-weight: 600;
                                   text-decoration: none;
                            }
                            .mall-directory__back:hover {
                                   color: #23262F;
                            }
                     `
    } })
  ] });
}
export {
  Show as default
};
