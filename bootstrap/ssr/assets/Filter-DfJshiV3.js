import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
function Filter({ categories = [], filters = {} }) {
  const [price, setPrice] = useState(filters?.priceMax || 1e7);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const { url } = usePage();
  const handleCategoryChange = (slug) => {
    const currentSlug = route().params.slug;
    if (currentSlug === slug) {
      router.get(route("marketplace.index"), { ...filters }, { preserveState: true });
    } else {
      router.get(route("marketplace.index", { slug: slug === "all" ? null : slug }), { ...filters }, { preserveState: true });
    }
  };
  const toggleStatus = (status) => {
    let newStatus = [...filters.status || []];
    if (newStatus.includes(status)) {
      newStatus = newStatus.filter((s) => s !== status);
    } else {
      newStatus.push(status);
    }
    const params = { ...route().params, ...filters, status: newStatus };
    router.get(route("marketplace.index", route().params), params, { preserveState: true, preserveScroll: true });
  };
  const handlePriceChange = (e) => setPrice(e.target.value);
  const applyPriceFilter = () => {
    const params = { ...route().params, ...filters, priceMax: price };
    router.get(route("marketplace.index", route().params), params, { preserveState: true, preserveScroll: true });
  };
  const toggleCategoryExpand = (slug) => setExpandedCategory((prev) => prev === slug ? null : slug);
  const toggleSubCategoryExpand = (slug) => setExpandedSubCategory((prev) => prev === slug ? null : slug);
  const isSelected = (slug) => route().params.slug === slug;
  return /* @__PURE__ */ jsxs("aside", { className: "static-filter-sidebar p-4 bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "filter-group mb-5", children: [
      /* @__PURE__ */ jsx("h4", { className: "fw-bold mb-3 h6 text-uppercase ls-1 text-dark", children: "Category" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-unstyled", children: [
        /* @__PURE__ */ jsx("li", { className: "mb-2", children: /* @__PURE__ */ jsxs("label", { className: "custom-checkbox d-flex align-items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: !route().params.slug,
              onChange: () => handleCategoryChange("all")
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "checkmark me-2" }),
          /* @__PURE__ */ jsx("span", { className: !route().params.slug ? "fw-bold text-primary" : "text-secondary", children: "Any Category" })
        ] }) }),
        categories.map((cat) => /* @__PURE__ */ jsxs("li", { className: "mb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center justify-content-between", children: [
            /* @__PURE__ */ jsxs("label", { className: "custom-checkbox d-flex align-items-center flex-grow-1 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: isSelected(cat.slug),
                  onChange: () => handleCategoryChange(cat.slug)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "checkmark me-2" }),
              /* @__PURE__ */ jsx("span", { className: isSelected(cat.slug) ? "fw-bold text-primary" : "text-dark", children: cat.name })
            ] }),
            cat.sub_categories?.length > 0 && /* @__PURE__ */ jsx("button", { className: "btn btn-sm p-0 border-0", onClick: () => toggleCategoryExpand(cat.slug), children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                style: { transform: expandedCategory === cat.slug ? "rotate(180deg)" : "rotate(0deg)", transition: "all 0.2s" },
                children: /* @__PURE__ */ jsx("path", { d: "M4.07998 8.94998L10.6 15.47C11.37 16.24 12.63 16.24 13.4 15.47L19.92 8.94999", stroke: "#606060", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
              }
            ) })
          ] }),
          expandedCategory === cat.slug && /* @__PURE__ */ jsx("ul", { className: "list-unstyled ms-4 mt-2", children: cat.sub_categories.map((sub) => /* @__PURE__ */ jsxs("li", { className: "mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center justify-content-between", children: [
              /* @__PURE__ */ jsxs("label", { className: "custom-checkbox d-flex align-items-center flex-grow-1 cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isSelected(sub.slug),
                    onChange: () => handleCategoryChange(sub.slug)
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "checkmark me-2" }),
                /* @__PURE__ */ jsx("span", { className: isSelected(sub.slug) ? "fw-bold text-primary" : "text-muted", children: sub.name })
              ] }),
              sub.child_categories?.length > 0 && /* @__PURE__ */ jsx("button", { className: "btn btn-sm p-0 border-0", onClick: () => toggleSubCategoryExpand(sub.slug), children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  style: { transform: expandedSubCategory === sub.slug ? "rotate(180deg)" : "rotate(0deg)", transition: "all 0.2s" },
                  children: /* @__PURE__ */ jsx("path", { d: "M4.07998 8.94998L10.6 15.47C11.37 16.24 12.63 16.24 13.4 15.47L19.92 8.94999", stroke: "#606060", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
                }
              ) })
            ] }),
            expandedSubCategory === sub.slug && /* @__PURE__ */ jsx("ul", { className: "list-unstyled ms-4 mt-2", children: sub.child_categories.map((child) => /* @__PURE__ */ jsx("li", { className: "mb-1", children: /* @__PURE__ */ jsxs("label", { className: "custom-checkbox d-flex align-items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: isSelected(child.slug),
                  onChange: () => handleCategoryChange(child.slug)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "checkmark me-2" }),
              /* @__PURE__ */ jsx("span", { className: isSelected(child.slug) ? "fw-bold text-primary" : "text-muted", children: child.name })
            ] }) }, child.id)) })
          ] }, sub.id)) })
        ] }, cat.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "filter-group mb-5", children: [
      /* @__PURE__ */ jsx("h4", { className: "fw-bold mb-3 h6 text-uppercase ls-1 text-dark", children: "Status" }),
      /* @__PURE__ */ jsx("ul", { className: "list-unstyled", children: ["Live Auctions", "Ending Soon", "Recent Listings"].map((stat) => /* @__PURE__ */ jsx("li", { className: "mb-2", children: /* @__PURE__ */ jsxs("label", { className: "custom-checkbox d-flex align-items-center cursor-pointer", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: (filters?.status || []).includes(stat),
            onChange: () => toggleStatus(stat)
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "checkmark me-2" }),
        /* @__PURE__ */ jsx("span", { className: "text-secondary", children: stat })
      ] }) }, stat)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "filter-group", children: [
      /* @__PURE__ */ jsx("h4", { className: "fw-bold mb-3 h6 text-uppercase ls-1 text-dark", children: "Price Range" }),
      /* @__PURE__ */ jsxs("div", { className: "px-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-2 align-items-end", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted small text-uppercase fw-bold", children: "Max Price" }),
          /* @__PURE__ */ jsxs("span", { className: "fw-bold text-dark h5 m-0", children: [
            "PKR ",
            Number(price).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            className: "form-range",
            min: "0",
            max: "10000000",
            step: "1000",
            value: price,
            onChange: handlePriceChange,
            onMouseUp: applyPriceFilter,
            onTouchEnd: applyPriceFilter
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between text-muted", style: { fontSize: "0.75rem" }, children: [
          /* @__PURE__ */ jsx("span", { children: "0" }),
          /* @__PURE__ */ jsx("span", { children: "10M+" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                     .custom-checkbox { position: relative; cursor: pointer; user-select: none; }
                     .custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
                     .checkmark { height: 18px; width: 18px; background-color: #eee; border-radius: 4px; position: relative; display: inline-block; flex-shrink: 0; }
                     .custom-checkbox:hover input ~ .checkmark { background-color: #ccc; }
                     .custom-checkbox input:checked ~ .checkmark { background-color: #0d6efd; }
                     .checkmark:after { content: ""; position: absolute; display: none; }
                     .custom-checkbox input:checked ~ .checkmark:after { display: block; }
                     .custom-checkbox .checkmark:after { left: 6px; top: 2px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
                     .ls-1 { letter-spacing: 1px; }
                     `
    } })
  ] });
}
export {
  Filter as default
};
