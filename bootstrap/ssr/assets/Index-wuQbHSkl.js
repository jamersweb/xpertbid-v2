import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { Head, Link, router } from "@inertiajs/react";
function Index({ faqs }) {
  const deleteFaq = (id) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      router.delete(route("admin.faqs.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "FAQ Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "FAQ Management" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsx(Link, { href: route("admin.faqs.create"), className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Add New FAQ" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Question" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: faqs.map((faq) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 line-clamp-1", children: faq.question_text }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400 line-clamp-1", children: [
              faq.answer_text?.substring(0, 100),
              "..."
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${faq.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`, children: faq.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Link, { href: route("admin.faqs.edit", faq.id), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteFaq(faq.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, faq.id)) })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
