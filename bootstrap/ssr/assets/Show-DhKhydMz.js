import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-J8lQ9IQV.js";
import { Link } from "@inertiajs/react";
import { P as Price } from "./Price-Bjh-N9Qv.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
const getImageUrl = (listing) => {
  return listing?.image_url || null;
};
function Show({ order }) {
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Order #${order.order_number}`, children: [
    /* @__PURE__ */ jsxs("main", { className: "container py-5", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs(Link, { href: route("orders.index"), className: "text-decoration-none", style: { color: "#23262F", fontWeight: "600", fontSize: "16px" }, children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left me-2" }),
        " Back to Orders"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "card border-0 shadow-lg rounded-4 overflow-hidden", style: { boxShadow: "0 45px 90px 0 #00000026" }, children: [
        /* @__PURE__ */ jsx("div", { className: "card-header bg-white p-4", style: { borderBottom: "1px solid #eee" }, children: /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center flex-wrap", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h4", { className: "mb-1 fw-bold", style: { color: "#23262F", fontFamily: '"Inter", sans-serif' }, children: [
              "Order #",
              order.order_number
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mb-0 small", style: { color: "#777E90", fontWeight: "500" }, children: formatDate(order.created_at) })
          ] }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "badge rounded-pill px-4 py-2",
              style: {
                backgroundColor: order.status === "completed" ? "#4CAF50" : order.status === "pending" ? "#FFC107" : order.status === "cancelled" ? "#F44336" : "#2196F3",
                color: order.status === "pending" ? "#000" : "#fff",
                fontSize: "14px",
                fontWeight: "700"
              },
              children: order.status?.toUpperCase() || "PENDING"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "card-body p-4", children: /* @__PURE__ */ jsxs("div", { className: "row g-4", children: [
          /* @__PURE__ */ jsx("div", { className: order.is_promotion ? "col-md-12" : "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white rounded-4 h-100 border", style: { borderColor: "#eee !important" }, children: [
            /* @__PURE__ */ jsxs("h6", { className: "fw-bold mb-3", style: { color: "#23262F", fontSize: "18px" }, children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-file-invoice me-2", style: { color: "#43ACE9" } }),
              order.is_promotion ? "User Details" : "Billing Address"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mb-1 fw-bold", style: { color: "#23262F" }, children: order.billing_name }),
            /* @__PURE__ */ jsx("p", { className: "mb-1", style: { color: "#23262F" }, children: order.billing_email }),
            !order.is_promotion && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "mb-1", style: { color: "#777E90" }, children: order.billing_address_line1 }),
              order.billing_address_line2 && /* @__PURE__ */ jsx("p", { className: "mb-1", style: { color: "#777E90" }, children: order.billing_address_line2 }),
              /* @__PURE__ */ jsxs("p", { className: "mb-1", style: { color: "#777E90" }, children: [
                order.billing_city,
                ", ",
                order.billing_state,
                " ",
                order.billing_postal_code
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mb-1", style: { color: "#777E90" }, children: order.billing_country })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mb-0 mt-3 pt-2 border-top", style: { color: "#23262F" }, children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-phone me-2", style: { color: "#777E90" } }),
              order.billing_phone
            ] })
          ] }) }),
          !order.is_promotion && /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white rounded-4 h-100 border", style: { borderColor: "#eee !important" }, children: [
            /* @__PURE__ */ jsxs("h6", { className: "fw-bold mb-3", style: { color: "#23262F", fontSize: "18px" }, children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-truck-fast me-2", style: { color: "#43ACE9" } }),
              "Shipping Address"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mb-1 fw-bold", style: { color: "#23262F" }, children: order.shipping_name }),
            /* @__PURE__ */ jsx("p", { className: "mb-1", style: { color: "#777E90" }, children: order.shipping_address_line1 }),
            order.shipping_address_line2 && /* @__PURE__ */ jsx("p", { className: "mb-1", style: { color: "#777E90" }, children: order.shipping_address_line2 }),
            /* @__PURE__ */ jsxs("p", { className: "mb-1", style: { color: "#777E90" }, children: [
              order.shipping_city,
              ", ",
              order.shipping_state,
              " ",
              order.shipping_postal_code
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mb-1", style: { color: "#777E90" }, children: order.shipping_country }),
            /* @__PURE__ */ jsxs("p", { className: "mb-0 mt-3 pt-2 border-top", style: { color: "#23262F" }, children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-phone me-2", style: { color: "#777E90" } }),
              order.shipping_phone
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "col-12 mt-5", children: [
            /* @__PURE__ */ jsx("h5", { className: "fw-bold mb-3", style: { color: "#23262F" }, children: "Order Items" }),
            /* @__PURE__ */ jsx("div", { className: "table-responsive", children: /* @__PURE__ */ jsxs("table", { className: "table table-hover align-middle", children: [
              /* @__PURE__ */ jsx("thead", { style: { backgroundColor: "#F8F8F8" }, children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "border-0 px-4 py-3", style: { width: "50%", color: "#23262F", fontWeight: "600" }, children: "Product" }),
                /* @__PURE__ */ jsx("th", { className: "text-center border-0 py-3", style: { color: "#23262F", fontWeight: "600" }, children: "Price" }),
                /* @__PURE__ */ jsx("th", { className: "text-center border-0 py-3", style: { color: "#23262F", fontWeight: "600" }, children: "Quantity" }),
                /* @__PURE__ */ jsx("th", { className: "text-end border-0 px-4 py-3", style: { color: "#23262F", fontWeight: "600" }, children: "Total" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: order.items.map((item) => {
                const imgUrl = getImageUrl(item.listing);
                return /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "me-3 border rounded-3 overflow-hidden bg-white", style: { width: "60px", height: "60px", flexShrink: 0 }, children: imgUrl ? /* @__PURE__ */ jsx("img", { src: imgUrl, alt: item.product_name, className: "w-100 h-100 object-fit-cover" }) : /* @__PURE__ */ jsx("div", { className: "d-flex w-100 h-100 align-items-center justify-content-center", style: { color: "#777E90" }, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image" }) }) }),
                    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { href: item.listing?.slug ? `/product/${item.listing.slug}` : "#", className: "text-decoration-none fw-bold", style: { color: "#23262F" }, children: item.product_name || item.listing?.title || "Product" }) })
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "text-center", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: item.price }) }),
                  /* @__PURE__ */ jsx("td", { className: "text-center", style: { color: "#23262F" }, children: item.quantity }),
                  /* @__PURE__ */ jsx("td", { className: "text-end px-4 fw-bold", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: item.subtotal }) })
                ] }, item.id);
              }) }),
              /* @__PURE__ */ jsxs("tfoot", { style: { borderTop: "2px solid #eee" }, children: [
                /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { colSpan: "3", className: "text-end border-0 pt-4 px-4", style: { color: "#777E90", fontWeight: "500" }, children: "Subtotal" }),
                  /* @__PURE__ */ jsx("td", { className: "text-end border-0 pt-4 px-4", style: { color: "#23262F", fontWeight: "600" }, children: /* @__PURE__ */ jsx(Price, { amountAED: order.subtotal || order.total }) })
                ] }),
                Number(order.tax) > 0 && /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { colSpan: "3", className: "text-end border-0 px-4", style: { color: "#777E90", fontWeight: "500" }, children: "Tax" }),
                  /* @__PURE__ */ jsx("td", { className: "text-end border-0 px-4", style: { color: "#23262F", fontWeight: "600" }, children: /* @__PURE__ */ jsx(Price, { amountAED: order.tax }) })
                ] }),
                Number(order.shipping_cost) > 0 && /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { colSpan: "3", className: "text-end border-0 px-4", style: { color: "#777E90", fontWeight: "500" }, children: "Shipping" }),
                  /* @__PURE__ */ jsx("td", { className: "text-end border-0 px-4", style: { color: "#23262F", fontWeight: "600" }, children: /* @__PURE__ */ jsx(Price, { amountAED: order.shipping_cost }) })
                ] }),
                /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { colSpan: "3", className: "text-end border-0 px-4 pt-3 fw-bold fs-5", style: { color: "#23262F" }, children: "Total" }),
                  /* @__PURE__ */ jsx("td", { className: "text-end border-0 px-4 pt-3 fw-bold fs-5", style: { color: "#43ACE9" }, children: /* @__PURE__ */ jsx(Price, { amountAED: order.total }) })
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "col-12 mt-4", children: /* @__PURE__ */ jsx("div", { className: "p-4 border rounded-4 bg-white", style: { borderColor: "#eee !important" }, children: /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h6", { className: "fw-bold mb-2", style: { color: "#23262F" }, children: "Payment Information" }),
              /* @__PURE__ */ jsxs("p", { className: "mb-0", style: { color: "#777E90" }, children: [
                "Method: ",
                /* @__PURE__ */ jsx("span", { style: { color: "#23262F", fontWeight: "600" }, children: order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method === "stripe" ? "Credit/Debit Card (Stripe)" : order.payment_method === "bank_transfer" ? "Bank Transfer" : order.payment_method })
              ] }),
              order.transaction_id && /* @__PURE__ */ jsxs("small", { className: "d-block mt-2", style: { color: "#777E90" }, children: [
                "Transaction ID: ",
                order.transaction_id
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-end", children: [
              /* @__PURE__ */ jsx("div", { className: "small mb-1", style: { color: "#777E90", fontWeight: "500" }, children: "Payment Status" }),
              /* @__PURE__ */ jsx("span", { className: `badge rounded-pill px-3 py-2 ${order.payment_status === "paid" ? "bg-success" : "bg-warning text-dark"}`, style: { fontWeight: "700" }, children: order.payment_status?.toUpperCase() || "PENDING" })
            ] })
          ] }) }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                            body { background-color: #F1F1F1 !important; }
                            .object-fit-cover { object-fit: cover; }
                            .border-top-2 { border-top: 2px solid #f0f0f0 !important; }
                            .card { border-radius: 15px !important; }
                     `
    } })
  ] });
}
export {
  Show as default
};
