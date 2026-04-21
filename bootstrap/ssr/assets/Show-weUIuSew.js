import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Link, Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BWciRgbg.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
function Show({ blog }) {
  const blogTitle = typeof blog?.title === "string" ? blog.title : "Blog";
  const blogImage = typeof blog?.image === "string" ? blog.image.trim() : "";
  const blogContent = typeof blog?.content === "string" ? blog.content : typeof blog?.description === "string" ? blog.description : typeof blog?.body === "string" ? blog.body : "";
  const blogDescription = typeof blog?.excerpt === "string" && blog.excerpt.trim() ? blog.excerpt : typeof blog?.meta_description === "string" && blog.meta_description.trim() ? blog.meta_description : "Read more on our blog.";
  const blogImageSrc = blogImage ? blogImage.startsWith("http") ? blogImage : `/${encodeURI(blogImage)}` : "";
  const publishedAt = blog?.created_at ? new Date(blog.created_at).toLocaleDateString(void 0, { month: "long", day: "numeric", year: "numeric" }) : "";
  const shareUrl = typeof window !== "undefined" ? window.location.href : typeof blog?.slug === "string" && blog.slug ? route("blogs.show", blog.slug, false) : "";
  const shareText = blogTitle;
  const openShareTab = (url) => {
    if (typeof window === "undefined") return;
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.opener = null;
    }
  };
  const handleFacebookShare = () => {
    openShareTab(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };
  const handleTwitterShare = () => {
    openShareTab(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
  };
  const handleWhatsAppShare = () => {
    openShareTab(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`);
  };
  const copyShareLink = async () => {
    if (typeof window === "undefined") return false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement("input");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  const handleInstagramShare = async () => {
    const copied = await copyShareLink();
    openShareTab("https://www.instagram.com/");
    window.alert(copied ? "Blog link copied. Paste it on Instagram." : "Instagram opened. Please copy the blog link manually.");
  };
  const handleCopyLink = async () => {
    const copied = await copyShareLink();
    window.alert(copied ? "Blog link copied." : "Unable to copy link.");
  };
  if (!blog) {
    return /* @__PURE__ */ jsx(AppLayout, { title: "Blog Not Found", children: /* @__PURE__ */ jsxs("div", { className: "container py-5 text-center", children: [
      /* @__PURE__ */ jsx("h2", { children: "Blog not found or loading..." }),
      /* @__PURE__ */ jsx(Link, { href: route("blogs.index"), className: "btn btn-primary mt-3", children: "Back to Blogs" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(AppLayout, { title: blogTitle, children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: `${blogTitle} | XpertBid Blog` }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: blogDescription }),
      blog.meta_keywords && /* @__PURE__ */ jsx("meta", { name: "keywords", content: blog.meta_keywords })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white min-vh-100 pb-5", children: [
      blogImageSrc && /* @__PURE__ */ jsx("div", { className: "w-100 overflow-hidden", style: { minHeight: "400px", maxHeight: "600px" }, children: /* @__PURE__ */ jsx(
        "img",
        {
          src: blogImageSrc,
          alt: blogTitle,
          className: "w-100 h-100",
          style: { objectFit: "cover", minHeight: "400px", maxHeight: "600px" }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "container py-5 mt-4", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center", children: /* @__PURE__ */ jsxs("div", { className: "col-lg-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxs(Link, { href: route("blogs.index"), className: "text-primary text-decoration-none fw-bold small mb-3 d-inline-block", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left me-2" }),
            " Back to Blogs"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "fw-bolder display-4 text-dark mb-3", children: blogTitle }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted border-bottom pb-3", children: [
            "Published on ",
            publishedAt
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "blog-content fs-5 text-dark",
            style: { lineHeight: "1.8" },
            dangerouslySetInnerHTML: { __html: blogContent }
          }
        ),
        /* @__PURE__ */ jsx("hr", { className: "my-5" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-light p-4 rounded-4 border shadow-sm", children: [
          /* @__PURE__ */ jsx("h4", { className: "fw-bold mb-3 text-dark", children: "Share this article" }),
          /* @__PURE__ */ jsxs("div", { className: "d-flex gap-3 blog-share-actions", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleFacebookShare,
                className: "btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",
                style: { width: "40px", height: "40px" },
                "aria-label": "Share on Facebook",
                children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-facebook-f" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleTwitterShare,
                className: "btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",
                style: { width: "40px", height: "40px" },
                "aria-label": "Share on X",
                children: /* @__PURE__ */ jsx("span", { className: "fw-bold", style: { fontSize: "15px", lineHeight: 1 }, children: "X" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleWhatsAppShare,
                className: "btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",
                style: { width: "40px", height: "40px" },
                "aria-label": "Share on WhatsApp",
                children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-whatsapp" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleInstagramShare,
                className: "btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",
                style: { width: "40px", height: "40px" },
                "aria-label": "Share on Instagram",
                children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-instagram" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleCopyLink,
                className: "btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",
                style: { width: "40px", height: "40px" },
                "aria-label": "Copy link",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-link" })
              }
            )
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
                .blog-share-btn {
                    background: #23262F;
                    color: #fff;
                    border: 1px solid #23262F;
                    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                }
                .blog-share-btn:hover,
                .blog-share-btn:focus,
                .blog-share-btn:active {
                    background: #43ACE9 !important;
                    border-color: #43ACE9 !important;
                    color: #fff !important;
                    transform: translateY(-1px);
                }
                .blog-share-btn i,
                .blog-share-btn span {
                    color: inherit;
                }
            `
    } })
  ] });
}
export {
  Show as default
};
