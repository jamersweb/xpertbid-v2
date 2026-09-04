import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, router } from "@inertiajs/react";
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
const MALLS_BANNER = "/assets/images/WebsiteBanner2.png";
function Index({ malls = [] }) {
  const { t } = useTranslate();
  const mallList = Array.isArray(malls) ? malls : Object.values(malls || {});
  const items = mallList.map((mall) => ({
    id: mall.id,
    label: mall.name,
    slug: mall.slug
  }));
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Malls"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("Malls") }),
    /* @__PURE__ */ jsxs("section", { className: "mall-directory", children: [
      /* @__PURE__ */ jsx(
        MallHeroBanner,
        {
          image: MALLS_BANNER,
          title: t("Malls"),
          subtitle: t("Select a mall to view its verified corporate sellers.")
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "container py-4 py-lg-5", children: /* @__PURE__ */ jsx(
        AlphabetDirectory,
        {
          items,
          emptyMessage: t("No malls available right now."),
          onSelect: (item) => router.get(route("malls.show", item.slug))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                            .mall-directory {
                                   background: #F9F9F9;
                                   min-height: 60vh;
                            }
                     `
    } })
  ] });
}
export {
  Index as default
};
