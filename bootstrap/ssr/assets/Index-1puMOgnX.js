import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-DE5nDs2t.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import "ziggy-js";
import "./CartContext-eSDe5PYw.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
function Index({ blogs }) {
  const truncateWords = (str = "", limit = 20) => {
    if (!str) return "";
    const words = str.trim().split(/\s+/);
    return words.length <= limit ? str : words.slice(0, limit).join(" ") + "...";
  };
  const stripHtml = (html = "") => html ? html.replace(/<[^>]*>/g, "") : "";
  const pickContent = (b) => b?.excerpt || b?.short_description || b?.description || b?.content || b?.body || "";
  const truncateChars = (str = "", limit = 80) => str && str.length <= limit ? str : str ? str.slice(0, limit) + "..." : "";
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Blogs", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Blogs | XpertBid" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Stay updated with the latest news and guides from XpertBid." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "py-5 bg-light min-vh-100", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-5", children: [
        /* @__PURE__ */ jsx("h1", { className: "fw-bolder display-4 text-dark mb-3", children: "Our Blogs" }),
        /* @__PURE__ */ jsx("p", { className: "lead text-muted mx-auto", style: { maxWidth: "700px" }, children: "Discover insights, tips, and stories about auctions, vehicles, real estate, and more." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "row g-4 mb-5", children: [
        blogs.data.map((blog) => {
          const displayTitle = truncateWords(blog?.title || "", 15);
          const excerpt = pickContent(blog);
          const displayExcerpt = truncateChars(stripHtml(excerpt), 120);
          return /* @__PURE__ */ jsx("div", { className: "col-md-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "card h-100 border-0 shadow-sm rounded-4 overflow-hidden blog-card", children: [
            /* @__PURE__ */ jsx(Link, { href: route("blogs.show", blog.slug), className: "text-decoration-none", children: /* @__PURE__ */ jsxs("div", { className: "position-relative overflow-hidden", style: { height: "220px" }, children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: blog.image ? blog.image.startsWith("http") ? blog.image : `/${encodeURI(blog.image)}` : "/assets/images/WebsiteBanner2.png",
                  className: "card-img-top w-100 h-100 object-fit-cover transition-all",
                  alt: blog.title
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "position-absolute top-0 start-0 m-3 px-3 py-2 bg-white rounded-pill shadow-sm small fw-bold text-primary", children: new Date(blog.created_at).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "card-body p-4 d-flex flex-column", children: [
              /* @__PURE__ */ jsx(Link, { href: route("blogs.show", blog.slug), className: "text-decoration-none", children: /* @__PURE__ */ jsx("h5", { className: "card-title fw-bold text-dark mb-3 h4", style: { lineHeight: "1.4" }, children: displayTitle }) }),
              /* @__PURE__ */ jsx("p", { className: "card-text text-muted mb-4 flex-grow-1", style: { fontSize: "0.95rem" }, children: displayExcerpt }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("blogs.show", blog.slug),
                  className: "btn rounded-pill px-4 fw-bold align-self-start transition-all blog-read-more-btn",
                  children: [
                    "Read More ",
                    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-right ms-2 small" })
                  ]
                }
              )
            ] })
          ] }) }, blog.id);
        }),
        blogs.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-12 text-center py-5 bg-white rounded-4 shadow-sm border", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-3 opacity-25", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-newspaper fa-4x" }) }),
          /* @__PURE__ */ jsx("h3", { className: "h4 fw-bold", children: "No Blogs Found" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted", children: "Stay tuned! We'll be posting some interesting content soon." })
        ] })
      ] }),
      blogs.links && /* @__PURE__ */ jsx("div", { className: "d-flex justify-content-center mt-5", children: /* @__PURE__ */ jsx(Pagination, { links: blogs.links }) })
    ] }) }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .blog-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .blog-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                }
                .blog-card .card-img-top {
                    transition: transform 0.5s ease;
                }
                .blog-card:hover .card-img-top {
                    transform: scale(1.1);
                }
                .blog-read-more-btn {
                    background: #23262F;
                    border: 1px solid #23262F;
                    color: #fff;
                }
                .blog-read-more-btn:hover,
                .blog-read-more-btn:focus {
                    background: #43ACE9;
                    border-color: #43ACE9;
                    color: #fff;
                }
                .object-fit-cover {
                    object-fit: cover;
                }
            `
    } })
  ] });
}
export {
  Index as default
};
