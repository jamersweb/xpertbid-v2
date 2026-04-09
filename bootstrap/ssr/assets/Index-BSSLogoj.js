import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-C9PL0wyf.js";
import ExploreProducts from "./ExploreProducts-DqR13H3M.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-BYSFLoir.js";
import "./AuctionCard-Bk42QYyW.js";
import "./OwnerInfoRow-Bp3cN_Xd.js";
import "./FavoriteToggleButton-1jmbejDw.js";
function Index({
  products = { data: [], links: [] },
  categories = [],
  currentCategory = null,
  currentTopCategory = null,
  subcategoryTabs = [],
  currentSubcategory = null,
  childCategoryTabs = [],
  filters = {}
}) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const heroImage = currentTopCategory?.image_url || currentCategory?.image_url || null;
  const currentType = filters?.type || "auction";
  const showChildTabs = Boolean(currentSubcategory);
  const tabs = [
    { key: "auction", label: "Auction", mobileLabel: "Auction" },
    { key: "normal", label: "Normal Products", mobileLabel: "Normal" },
    { key: "business", label: "Business Products", mobileLabel: "Business" }
  ];
  const handleTabChange = (type) => {
    router.get(
      route("marketplace.index", route().params),
      {
        ...filters,
        type,
        page: 1
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      route("marketplace.index", route().params),
      {
        ...filters,
        search: searchTerm,
        page: 1
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const handleCategoryTabChange = (slug) => {
    router.get(
      route("marketplace.index", { slug }),
      {
        ...filters,
        page: 1
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: currentCategory?.meta_title || "Marketplace", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: currentCategory?.meta_title || "Marketplace | XpertBid" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: currentCategory?.meta_description || "Explore our marketplace for the best deals."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pb-5 bg-light min-vh-100", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "marketplace-topbar-wrap",
          style: heroImage ? {
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.38)), url(${heroImage})`
          } : void 0,
          children: /* @__PURE__ */ jsx("div", { className: "container-fluid px-lg-5", children: /* @__PURE__ */ jsxs("div", { className: "marketplace-topbar p-3 p-lg-4", children: [
            /* @__PURE__ */ jsx("div", { className: "marketplace-selected-category mb-3", children: currentCategory?.name || currentTopCategory?.name || "Marketplace" }),
            currentTopCategory && !showChildTabs && /* @__PURE__ */ jsxs("div", { className: "marketplace-subcategory-tabs mb-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(currentTopCategory.slug),
                  className: `marketplace-subcategory-tab ${currentCategory?.slug === currentTopCategory.slug ? "is-active" : ""}`,
                  children: [
                    "All ",
                    currentTopCategory.name
                  ]
                }
              ),
              subcategoryTabs.map((subcategory) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(subcategory.slug),
                  className: `marketplace-subcategory-tab ${currentCategory?.slug === subcategory.slug ? "is-active" : ""}`,
                  children: subcategory.name
                },
                subcategory.id
              ))
            ] }),
            currentTopCategory && showChildTabs && /* @__PURE__ */ jsxs("div", { className: "marketplace-subcategory-tabs mb-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(currentTopCategory.slug),
                  className: "marketplace-subcategory-back",
                  "aria-label": "Back to subcategories",
                  children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "←" })
                }
              ),
              childCategoryTabs.map((childCategory) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(childCategory.slug),
                  className: `marketplace-subcategory-tab ${currentCategory?.slug === childCategory.slug ? "is-active" : ""}`,
                  children: childCategory.name
                },
                childCategory.id
              ))
            ] }),
            /* @__PURE__ */ jsx("form", { onSubmit: handleSearchSubmit, className: "marketplace-searchbar mb-3", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                placeholder: "Search products..."
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "marketplace-top-tabs", children: tabs.map((tab) => {
              const isActive = tab.key === "auction" && currentType === "auction" || tab.key === "normal" && ["normal", "normal_list"].includes(currentType) || tab.key === "business" && ["business", "business_list"].includes(currentType);
              const tabType = tab.key === "normal" ? "normal" : tab.key === "business" ? "business" : "auction";
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleTabChange(tabType),
                  className: `marketplace-top-tab ${isActive ? "is-active" : ""}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "d-none d-md-inline", children: tab.label }),
                    /* @__PURE__ */ jsx("span", { className: "d-inline d-md-none", children: tab.mobileLabel || tab.label })
                  ]
                },
                tab.key
              );
            }) })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "container-fluid px-lg-5 pt-4", children: [
        currentCategory?.seo_short_content && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-4 p-4 shadow-sm mb-4 border text-center text-dark content-wrapper", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: currentCategory.seo_short_content } }) }),
        /* @__PURE__ */ jsxs("div", { className: "mkt-right", children: [
          /* @__PURE__ */ jsx(ExploreProducts, { products: products.data }),
          products.links && /* @__PURE__ */ jsx("div", { className: "mt-5 d-flex justify-content-center", children: /* @__PURE__ */ jsx(Pagination, { links: products.links }) }),
          currentCategory?.seo_content && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-4 p-5 shadow-sm mt-5 border text-dark content-wrapper", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: currentCategory.seo_content } }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                            .content-wrapper {
                                   color: #212529 !important;
                            }
                            .content-wrapper * {
                                   color: #212529 !important;
                            }
                            .marketplace-topbar-wrap {
                                   width: 100%;
                                   background-color: #fff;
                                   background-position: center;
                                   background-repeat: no-repeat;
                                   background-size: cover;
                                   border-bottom: none;
                                   box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
                                   padding-top: 22px;
                                   padding-bottom: 22px;
                            }
                            .marketplace-topbar {
                                   width: 100%;
                                   border-radius: 28px;
                                   background: rgba(255, 255, 255, 0.12);
                                   backdrop-filter: blur(5px);
                                   -webkit-backdrop-filter: blur(5px);
                                   min-height: 340px;
                                   display: flex;
                                   flex-direction: column;
                                   justify-content: center;
                                   align-items: center;
                                   text-align: center;
                            }
                            .marketplace-topbar > * {
                                   width: 100%;
                            }
                            .marketplace-selected-category {
                                   color: #fff;
                                   font-size: 36px;
                                   font-weight: 800;
                                   line-height: 1.1;
                                   text-shadow: 0 8px 24px rgba(15, 23, 42, 0.35);
                            }
                            .marketplace-searchbar input {
                                   width: 100%;
                                   height: 62px;
                                   border: none;
                                   border-radius: 16px;
                                   background: rgba(255, 255, 255, 0.92);
                                   padding: 0 20px;
                                   font-size: 15px;
                                   color: #111827;
                                   box-shadow: none;
                            }
                            .marketplace-searchbar input:focus {
                                   outline: none;
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-top-tabs {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 12px;
                            }
                            .marketplace-top-tab {
                                   min-height: 58px;
                                   border-radius: 16px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #5f6c80;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                                   box-shadow: none;
                            }
                            .marketplace-top-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                                   color: #435168;
                            }
                            .marketplace-top-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-tabs {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   justify-content: center;
                            }
                            .marketplace-subcategory-tab {
                                   min-height: 50px;
                                   padding: 0 20px;
                                   border-radius: 14px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #435168;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-subcategory-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-back {
                                   width: 50px;
                                   min-width: 50px;
                                   height: 50px;
                                   border-radius: 14px;
                                   border: none;
                                   background: #111827;
                                   color: #fff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   font-size: 20px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-back:hover {
                                   background: #0b1220;
                            }
                            @media (max-width: 767px) {
                                   .marketplace-topbar {
                                          padding-inline: 0;
                                          min-height: 380px;
                                   }
                                   .marketplace-selected-category {
                                          font-size: 28px;
                                   }
                                   .marketplace-top-tabs {
                                          grid-template-columns: repeat(3, minmax(0, 1fr));
                                          gap: 8px;
                                   }
                                   .marketplace-top-tab {
                                          min-height: 46px;
                                          padding: 0 10px;
                                          font-size: 12px;
                                          border-radius: 12px;
                                   }
                                   .marketplace-subcategory-tabs {
                                          display: flex;
                                          flex-wrap: nowrap;
                                          justify-content: center;
                                          align-items: center;
                                          gap: 10px;
                                          overflow-x: auto;
                                          padding-bottom: 4px;
                                          scrollbar-width: none;
                                   }
                                   .marketplace-subcategory-tabs::-webkit-scrollbar {
                                          display: none;
                                   }
                                   .marketplace-subcategory-tab {
                                          min-height: 44px;
                                          white-space: nowrap;
                                          flex: 0 0 auto;
                                          font-size: 13px;
                                   }
                                   .marketplace-subcategory-back {
                                          width: 44px;
                                          min-width: 44px;
                                          height: 44px;
                                          flex: 0 0 auto;
                                   }
                            }
                     ` })
  ] });
}
export {
  Index as default
};
