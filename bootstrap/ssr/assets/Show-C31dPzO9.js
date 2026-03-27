import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-J8lQ9IQV.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-Bjh-N9Qv.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
function Show({ blog }) {
  return /* @__PURE__ */ jsxs(AppLayout, { title: blog.title, children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        blog.title,
        " | XpertBid Blog"
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: blog.excerpt || blog.meta_description || "Read more on nuestra blog." }),
      blog.meta_keywords && /* @__PURE__ */ jsx("meta", { name: "keywords", content: blog.meta_keywords })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white min-vh-100 pb-5", children: [
      blog.image && /* @__PURE__ */ jsxs("div", { className: "position-relative w-100 overflow-hidden", style: { minHeight: "400px", maxHeight: "600px" }, children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: blog.image.startsWith("http") ? blog.image : `https://admin.xpertbid.com/${blog.image}`,
            alt: blog.title,
            className: "w-100 h-100 position-absolute",
            style: { objectFit: "cover", top: 0, left: 0 }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "position-absolute w-100 h-100 top-0 start-0", style: { background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5))" } }),
        /* @__PURE__ */ jsx("div", { className: "position-absolute bottom-0 start-0 w-100 p-5 text-white", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
          /* @__PURE__ */ jsxs(Link, { href: route("blogs.index"), className: "btn btn-primary btn-sm rounded-pill px-3 mb-3", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left me-2" }),
            " Back to Blogs"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "fw-bolder display-5 mb-2", children: blog.title }),
          /* @__PURE__ */ jsxs("p", { className: "opacity-75 fs-5", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-regular fa-calendar-days me-2" }),
            new Date(blog.created_at).toLocaleDateString(void 0, { month: "long", day: "numeric", year: "numeric" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "container py-5 mt-4", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center", children: /* @__PURE__ */ jsxs("div", { className: "col-lg-8", children: [
        !blog.image && /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxs(Link, { href: route("blogs.index"), className: "text-primary text-decoration-none fw-bold small mb-3 d-inline-block", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left me-2" }),
            " Back to Blogs"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "fw-bolder display-4 text-dark mb-3", children: blog.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted border-bottom pb-3", children: [
            "Published on ",
            new Date(blog.created_at).toLocaleDateString(void 0, { month: "long", day: "numeric", year: "numeric" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "blog-content fs-5 text-dark",
            style: { lineHeight: "1.8" },
            dangerouslySetInnerHTML: { __html: blog.content }
          }
        ),
        /* @__PURE__ */ jsx("hr", { className: "my-5" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-light p-4 rounded-4 border shadow-sm", children: [
          /* @__PURE__ */ jsx("h4", { className: "fw-bold mb-3", children: "Share this article" }),
          /* @__PURE__ */ jsxs("div", { className: "d-flex gap-3", children: [
            /* @__PURE__ */ jsx("button", { className: "btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center", style: { width: "40px", height: "40px" }, children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-facebook-f" }) }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center", style: { width: "40px", height: "40px" }, children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-twitter" }) }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center", style: { width: "40px", height: "40px" }, children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-whatsapp" }) }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center", style: { width: "40px", height: "40px" }, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-link" }) })
          ] })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .blog-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 2rem 0;
                }
                .blog-content h2, .blog-content h3 {
                    font-weight: bold;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                }
                .blog-content p {
                    margin-bottom: 1.5rem;
                }
                .blog-content ul, .blog-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
            `
    } })
  ] });
}
export {
  Show as default
};
