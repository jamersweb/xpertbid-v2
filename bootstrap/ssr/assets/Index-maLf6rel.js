import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-C1RliH-Q.js";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ sliders }) {
  const deleteSlider = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This slider will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.sliders.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Slider Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "Slider Management" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "Home Hero Sliders" }),
        /* @__PURE__ */ jsx(Link, { href: route("admin.sliders.create"), className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Add New Slider" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Image" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Title / Category" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Description" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: sliders.map((slider) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("img", { src: slider.image || "/images/placeholder.png", className: "w-20 h-10 rounded-lg object-cover", alt: "" }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: slider.title }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 capitalize", children: slider.category?.name || "General" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500 max-w-xs truncate", children: slider.description }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Link, { href: route("admin.sliders.edit", slider.id), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteSlider(slider.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, slider.id)) })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
