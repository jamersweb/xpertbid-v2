import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-DE5nDs2t.js";
import { Link, router } from "@inertiajs/react";
import { P as Price } from "./Price-CF5NSPt0.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./CartContext-eSDe5PYw.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./useCurrencyList-Ce5tJXO9.js";
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleDateString(void 0, options);
};
const getImageUrl = (listing) => {
  return listing?.image_url || null;
};
function Index({ orders }) {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("My Orders"), children: [
    /* @__PURE__ */ jsxs("div", { className: "container py-5", children: [
      /* @__PURE__ */ jsx("div", { className: "d-flex justify-content-between align-items-center mb-4", children: /* @__PURE__ */ jsx("h3", { style: { fontWeight: "700", color: "#1a1a1a", margin: 0 }, children: t("My Orders") }) }),
      orders.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-5 bg-white rounded-3 border", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-box-open", style: { fontSize: "60px", color: "#ddd" } }) }),
        /* @__PURE__ */ jsx("h4", { style: { color: "#666" }, children: t("No orders found") }),
        /* @__PURE__ */ jsx("p", { style: { color: "#999", marginBottom: "30px" }, children: t("You haven't placed any orders yet.") }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/marketplace",
            className: "btn btn-dark px-4 py-2 fw-bold",
            style: { borderRadius: "8px" },
            children: t("Start Shopping")
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "d-flex flex-column gap-4", children: [
        orders.data.map((order) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "order-card p-4 bg-white rounded-4 border shadow-sm transition-all",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between flex-wrap pb-3 mb-3 border-bottom align-items-center", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h5", { className: "mb-1 fw-bold", style: { color: "#1a1a1a" }, children: [
                    "Order #",
                    order.order_number
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-muted small", children: [
                    /* @__PURE__ */ jsx("i", { className: "fa-regular fa-clock me-1" }),
                    formatDate(order.created_at)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-end d-flex flex-column align-items-end", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "badge rounded-pill mb-2",
                      style: {
                        backgroundColor: order.status === "completed" ? "#dcfce7" : order.status === "pending" ? "#fef9c3" : order.status === "cancelled" ? "#fee2e2" : "#e0f2fe",
                        color: order.status === "completed" ? "#166534" : order.status === "pending" ? "#854d0e" : order.status === "cancelled" ? "#991b1b" : "#075985",
                        fontSize: "12px",
                        padding: "6px 14px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                      },
                      children: order.status || "Pending"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "fw-bolder h5", style: { color: "#1a1a1a" }, children: /* @__PURE__ */ jsx(Price, { amountAED: order.total }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "order-items", children: order.items.map((item, idx) => {
                const imgUrl = getImageUrl(item.listing);
                return /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center mb-3 p-2 rounded-3", style: { backgroundColor: "#fafafa", border: "1px solid #f0f0f0" }, children: [
                  /* @__PURE__ */ jsx("div", { className: "me-3", style: { width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#fff", border: "1px solid #eee" }, children: imgUrl ? /* @__PURE__ */ jsx("img", { src: imgUrl, alt: item.product_name, className: "w-100 h-100 object-fit-cover" }) : /* @__PURE__ */ jsx("div", { className: "d-flex align-items-center justify-content-center w-100 h-100 text-muted bg-light", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image fa-lg" }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-grow-1", children: [
                    /* @__PURE__ */ jsx("h6", { className: "mb-1 fw-bold", style: { fontSize: "15px", color: "#333" }, children: item.listing?.title || t("Product") }),
                    /* @__PURE__ */ jsxs("div", { className: "text-muted small", children: [
                      "Qty: ",
                      /* @__PURE__ */ jsx("span", { className: "fw-semibold", children: item.quantity }),
                      " × ",
                      /* @__PURE__ */ jsx("span", { className: "fw-semibold", children: /* @__PURE__ */ jsx(Price, { amountAED: item.price }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "ms-auto", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("orders.show", order.order_number),
                      className: "btn btn-dark btn-sm rounded-pill px-4",
                      children: t("View Details")
                    }
                  ) })
                ] }, idx);
              }) })
            ]
          },
          order.id
        )),
        orders.links && orders.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "d-flex justify-content-center mt-4", children: /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsx("ul", { className: "pagination", children: orders.links.map((link, i) => /* @__PURE__ */ jsx("li", { className: `page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`, children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "page-link",
            onClick: () => link.url && router.get(link.url),
            dangerouslySetInnerHTML: { __html: link.label }
          }
        ) }, i)) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                            .order-card {
                                   transition: all 0.3s ease;
                            }
                            .order-card:hover {
                                   box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
                                   transform: translateY(-2px);
                                   border-color: #e5e5e5 !important;
                            }
                            .transition-all {
                                   transition: all 0.3s ease;
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
