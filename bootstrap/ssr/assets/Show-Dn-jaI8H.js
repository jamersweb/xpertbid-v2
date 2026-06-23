import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DNCwhj5R.js";
import { Head, Link, router } from "@inertiajs/react";
import { P as Price } from "./Price-CF5NSPt0.js";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Show({ order }) {
  const [status, setStatus] = useState(order.status);
  const handleStatusUpdate = (newStatus) => {
    router.patch(route("admin.orders.update-status", order.id), {
      status: newStatus
    }, {
      onSuccess: () => setStatus(newStatus)
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Order Details #${order.order_number}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Order #${order.order_number}` }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { href: route("admin.orders.index"), className: "flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
        " Back to Orders"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxs(
        "select",
        {
          className: "bg-white border border-gray-200 focus:ring-black rounded-xl text-sm font-bold text-gray-900 shadow-sm",
          value: status,
          onChange: (e) => handleStatusUpdate(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
            /* @__PURE__ */ jsx("option", { value: "processing", children: "Processing" }),
            /* @__PURE__ */ jsx("option", { value: "completed", children: "Completed" }),
            /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Cancelled" })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 font-bold text-gray-800", children: "Order Items" }),
          /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-400 uppercase font-bold tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Product" }),
              /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Price" }),
              /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Qty" }),
              /* @__PURE__ */ jsx("th", { className: "pb-4 text-right", children: "Total" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: order.items.map((item) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("img", { src: item.auction?.image ? item.auction.image.startsWith("http") ? item.auction.image : `https://admin.xpertbid.com/${item.auction.image}` : "/assets/images/placeholder.png", className: "w-10 h-10 rounded-lg object-cover", alt: "", onError: (e) => e.target.src = "/assets/images/WebsiteBanner2.png" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 line-clamp-1", children: item.auction?.title }),
                  item.variation && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
                    "Var: ",
                    item.variation.name
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "py-4 text-sm text-gray-900 font-medium", children: /* @__PURE__ */ jsx(Price, { amountPKR: item.price }) }),
              /* @__PURE__ */ jsx("td", { className: "py-4 text-sm text-gray-600", children: item.quantity }),
              /* @__PURE__ */ jsx("td", { className: "py-4 text-sm text-right font-bold text-gray-900", children: /* @__PURE__ */ jsx(Price, { amountPKR: item.subtotal }) })
            ] }, item.id)) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 bg-gray-50/50 border-top border-gray-100 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: /* @__PURE__ */ jsx(Price, { amountPKR: order.subtotal }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Tax" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: /* @__PURE__ */ jsx(Price, { amountPKR: order.tax }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Shipping" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: /* @__PURE__ */ jsx(Price, { amountPKR: order.shipping_cost }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-lg font-bold border-t pt-2 mt-2", children: [
              /* @__PURE__ */ jsx("span", { children: "Total" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-black", children: /* @__PURE__ */ jsx(Price, { amountPKR: order.total }) })
            ] })
          ] })
        ] }),
        order.receipt_image_url && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 font-bold text-gray-800", children: "Payment Receipt" }),
          /* @__PURE__ */ jsx("div", { className: "p-6 flex justify-center bg-gray-50", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: order.receipt_image_url,
              className: "max-w-full rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:opacity-90 transition-opacity",
              alt: "Payment Receipt",
              style: { maxHeight: "600px" },
              onClick: () => window.open(order.receipt_image_url)
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "Customer Details" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold", children: order.user?.name?.charAt(0) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: order.user?.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: order.user?.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Billing Address" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700 leading-relaxed", children: [
                order.billing_address_line1,
                /* @__PURE__ */ jsx("br", {}),
                order.billing_address_line2 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  order.billing_address_line2,
                  /* @__PURE__ */ jsx("br", {})
                ] }),
                order.billing_city,
                ", ",
                order.billing_state,
                " ",
                order.billing_postal_code,
                /* @__PURE__ */ jsx("br", {}),
                order.billing_country
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t pt-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Shipping Address" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700 leading-relaxed", children: [
                order.shipping_name,
                /* @__PURE__ */ jsx("br", {}),
                order.shipping_address_line1,
                /* @__PURE__ */ jsx("br", {}),
                order.shipping_city,
                ", ",
                order.shipping_country
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "Transaction" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Payment Method" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-800 capitalize", children: order.payment_method?.replace("_", " ") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Transaction ID" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono text-gray-600", children: [
                "#",
                order.transaction_id || "N/A"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Payment Status" }),
              /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`, children: order.payment_status })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
