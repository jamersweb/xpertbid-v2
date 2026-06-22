import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-Bstw8cGQ.js";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ blogs }) {
  const deleteBlog = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog post will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.blogs.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Blog Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "Blog Management" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "All Blogs" }),
        /* @__PURE__ */ jsx(Link, { href: route("admin.blogs.create"), className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Add New Blog" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Image" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Title" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Author" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Created At" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: blogs.data.map((blog) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("img", { src: blog.image ? `/${blog.image}` : "/images/placeholder.png", className: "w-12 h-12 rounded-lg object-cover", alt: "" }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: blog.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
              "/",
              blog.slug
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: blog.user?.name || "Admin" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500", children: new Date(blog.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Link, { href: route("admin.blogs.edit", blog.id), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteBlog(blog.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, blog.id)) })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
