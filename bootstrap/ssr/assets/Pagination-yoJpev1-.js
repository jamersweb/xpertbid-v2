import { jsx } from "react/jsx-runtime";
import "react";
import { Link } from "@inertiajs/react";
function Pagination({ links }) {
  if (links.length <= 3) return null;
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Page navigation", children: /* @__PURE__ */ jsx("ul", { className: "pagination pagination-md justify-content-center m-0", children: links.map((link, index) => /* @__PURE__ */ jsx(
    "li",
    {
      className: `page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`,
      children: /* @__PURE__ */ jsx(
        Link,
        {
          className: "page-link shadow-none border-0 rounded-3 mx-1 py-2 px-3 fw-bold",
          href: link.url || "#",
          dangerouslySetInnerHTML: { __html: link.label },
          preserveScroll: true,
          preserveState: true,
          style: {
            color: link.active ? "#fff" : "#24282B",
            backgroundColor: link.active ? "#000000" : "#fff",
            borderColor: link.active ? "#000000" : "transparent",
            opacity: !link.url ? 0.5 : 1
          }
        }
      )
    },
    index
  )) }) });
}
export {
  Pagination as P
};
