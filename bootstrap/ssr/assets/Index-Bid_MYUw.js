import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-C9PL0wyf.js";
import { u as useCart } from "./CartContext-DXNQZwkV.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { Oval } from "react-loader-spinner";
import Swal from "sweetalert2";
import "ziggy-js";
import "axios";
import "./CurrencyPicker-BYSFLoir.js";
import "./useCurrencyList-Ce5tJXO9.js";
function Index({ cart: propCart }) {
  const { cartItems, removeFromCart, updateCartItem, getTotalPrice } = useCart();
  const [isRemoving, setIsRemoving] = useState({});
  const [isUpdating, setIsUpdating] = useState({});
  const displayItems = Array.isArray(propCart) ? propCart : Array.isArray(cartItems) ? cartItems : [];
  const handleRemove = async (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item from cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#23262F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsRemoving((prev) => ({ ...prev, [itemId]: true }));
        const res = await removeFromCart(itemId);
        setIsRemoving((prev) => ({ ...prev, [itemId]: false }));
        if (!res.success) {
          Swal.fire("Error", res.message || "Failed to remove item", "error");
        }
      }
    });
  };
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setIsUpdating((prev) => ({ ...prev, [itemId]: true }));
    await updateCartItem(itemId, newQty);
    setIsUpdating((prev) => ({ ...prev, [itemId]: false }));
  };
  const totalPrice = displayItems.reduce((total, item) => total + parseFloat(item.price || 0) * (item.quantity || 1), 0);
  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("title", { children: "Shopping Cart | XpertBid" }) }),
    /* @__PURE__ */ jsx("div", { className: "cart-page-wrapper", style: { backgroundColor: "#F1F1F1", padding: "60px 70px", minHeight: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "container", style: { maxWidth: "1200px" }, children: [
      /* @__PURE__ */ jsx("div", { className: "row", children: /* @__PURE__ */ jsx("div", { className: "col-12", children: /* @__PURE__ */ jsx(
        "h2",
        {
          className: "mb-4",
          style: {
            fontFamily: '"Inter", sans-serif',
            fontSize: "46px",
            fontWeight: "800",
            lineHeight: "64px",
            color: "#23262F",
            marginBottom: "40px"
          },
          children: "Shopping Cart"
        }
      ) }) }),
      displayItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-5", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-cart-shopping", style: { fontSize: "80px", color: "#606060" } }) }),
        /* @__PURE__ */ jsx("h3", { style: { fontFamily: '"Inter", sans-serif', color: "#23262F", fontWeight: "700" }, children: "Your cart is empty" }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: '"Inter", sans-serif', color: "#606060", fontSize: "16px", marginBottom: "30px" }, children: "Add some products to get started!" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("marketplace.index"),
            className: "btn",
            style: {
              backgroundColor: "#43ACE9",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              fontFamily: '"Inter", sans-serif',
              textDecoration: "none",
              display: "inline-block"
            },
            children: "Continue Shopping"
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "row cart-page-grid", children: [
        /* @__PURE__ */ jsx("div", { className: "col-lg-8", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "cart-items-card",
            style: {
              backgroundColor: "#fff",
              borderRadius: "15px",
              padding: "25px 30px",
              boxShadow: "0 45px 90px 0 #00000026"
            },
            children: displayItems.map((item, index) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "d-flex align-items-start cart-item-row",
                style: {
                  minHeight: "150px",
                  paddingBottom: index < displayItems.length - 1 ? "30px" : "0",
                  marginBottom: index < displayItems.length - 1 ? "30px" : "0",
                  borderBottom: index < displayItems.length - 1 ? "1px solid #eee" : "none"
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "me-3 cart-item-image-wrap", style: { width: "150px", flexShrink: 0 }, children: [
                    /* @__PURE__ */ jsx(Link, { href: item.slug ? route("product.show", item.slug) : "#", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "cart-item-image-box",
                        style: {
                          width: "100%",
                          height: "150px",
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "12px",
                          backgroundColor: "#f8f9fa"
                        },
                        children: /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: item.image ? item.image.startsWith("http") ? item.image : `https://admin.xpertbid.com/${item.image}` : "/assets/images/placeholder.png",
                            alt: item.title,
                            style: { objectFit: "cover", width: "100%", height: "100%", borderRadius: "6px" },
                            onError: (e) => e.target.src = "/assets/images/WebsiteBanner2.png"
                          }
                        )
                      }
                    ) }),
                    /* @__PURE__ */ jsx("div", { className: "cart-item-price-mobile", children: /* @__PURE__ */ jsx(
                      Price,
                      {
                        amountAED: parseFloat(item.price) || 0,
                        className: "fw-bold"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-grow-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-start mb-2 cart-item-top", children: [
                      /* @__PURE__ */ jsxs("div", { className: "cart-item-content", style: { flex: 1, marginRight: "15px" }, children: [
                        /* @__PURE__ */ jsx(
                          "h5",
                          {
                            className: "mb-1 cart-item-title",
                            style: {
                              fontFamily: '"Inter", sans-serif',
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#23262F",
                              marginBottom: "8px"
                            },
                            children: /* @__PURE__ */ jsx(
                              Link,
                              {
                                href: item.slug ? route("product.show", item.slug) : "#",
                                style: { textDecoration: "none", color: "inherit" },
                                children: item.title
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "p",
                          {
                            className: "cart-item-description",
                            style: {
                              fontFamily: '"Inter", sans-serif',
                              fontSize: "14px",
                              color: "#606060",
                              lineHeight: "20px",
                              marginBottom: "12px"
                            },
                            children: item.description ? stripHtmlTags(item.description).substring(0, 120) + "..." : ""
                          }
                        ),
                        item.variation_name && /* @__PURE__ */ jsx("span", { className: "badge bg-light text-dark border mb-2", children: item.variation_name })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: "cart-remove-btn",
                          onClick: () => handleRemove(item.id),
                          disabled: isRemoving[item.id],
                          style: {
                            background: "none",
                            border: "none",
                            color: "#E94343",
                            cursor: isRemoving[item.id] ? "not-allowed" : "pointer",
                            padding: "8px",
                            fontSize: "18px",
                            opacity: isRemoving[item.id] ? 0.6 : 1
                          },
                          children: isRemoving[item.id] ? /* @__PURE__ */ jsx(Oval, { height: 16, width: 16, color: "#E94343" }) : /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mt-3 cart-item-bottom", children: [
                      /* @__PURE__ */ jsx("div", { className: "cart-item-price", children: /* @__PURE__ */ jsx(
                        Price,
                        {
                          amountAED: parseFloat(item.price) || 0,
                          className: "fw-bold"
                        }
                      ) }),
                      /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center bg-light rounded-pill px-2 py-1 cart-qty-control", children: [
                        /* @__PURE__ */ jsx("button", { onClick: () => handleQuantityChange(item.id, (item.quantity || 1) - 1), className: "btn btn-sm border-0", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-minus", style: { fontSize: "10px" } }) }),
                        /* @__PURE__ */ jsx("span", { className: "mx-2 fw-bold small", children: item.quantity || 1 }),
                        /* @__PURE__ */ jsx("button", { onClick: () => handleQuantityChange(item.id, (item.quantity || 1) + 1), className: "btn btn-sm border-0", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus", style: { fontSize: "10px" } }) })
                      ] })
                    ] })
                  ] })
                ]
              },
              item.id
            ))
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "col-lg-4 cart-summary-col", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "order-summary-card",
            style: {
              backgroundColor: "#fff",
              borderRadius: "15px",
              padding: "0",
              boxShadow: "0 45px 90px 0 #00000026",
              position: "sticky",
              top: "20px"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    padding: "25px 30px",
                    borderBottom: "1px solid #eee"
                  },
                  children: /* @__PURE__ */ jsx(
                    "h5",
                    {
                      className: "mb-0",
                      style: {
                        fontFamily: '"Inter", sans-serif',
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#23262F"
                      },
                      children: "Order Summary"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { padding: "25px 30px" }, children: [
                /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-3", children: [
                  /* @__PURE__ */ jsx("span", { style: { fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }, children: "Subtotal:" }),
                  /* @__PURE__ */ jsx(
                    Price,
                    {
                      amountAED: totalPrice,
                      className: "fw-semibold"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-3", children: [
                  /* @__PURE__ */ jsx("span", { style: { fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }, children: "Shipping:" }),
                  /* @__PURE__ */ jsx("span", { style: { fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }, children: "FREE" })
                ] }),
                /* @__PURE__ */ jsx("hr", { style: { margin: "20px 0", borderColor: "#eee" } }),
                /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-4", children: [
                  /* @__PURE__ */ jsx("strong", { style: { fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }, children: "Total:" }),
                  /* @__PURE__ */ jsx("strong", { style: { fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }, children: /* @__PURE__ */ jsx(
                    Price,
                    {
                      amountAED: totalPrice,
                      className: "fw-bold"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("checkout.index"),
                    style: {
                      display: "block",
                      textAlign: "center",
                      width: "100%",
                      padding: "14px",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: '"Inter", sans-serif',
                      backgroundColor: "#43ACE9",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "background-color 0.3s ease"
                    },
                    onMouseEnter: (e) => e.target.style.backgroundColor = "#35a0d8",
                    onMouseLeave: (e) => e.target.style.backgroundColor = "#43ACE9",
                    children: "Proceed to Checkout"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("marketplace.index"),
                    style: {
                      display: "block",
                      textAlign: "center",
                      padding: "14px",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: '"Inter", sans-serif',
                      backgroundColor: "#23262F",
                      color: "#fff",
                      border: "1px solid #23262F",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.3s ease"
                    },
                    onMouseEnter: (e) => {
                      e.target.style.backgroundColor = "#151922";
                      e.target.style.color = "#fff";
                    },
                    onMouseLeave: (e) => {
                      e.target.style.backgroundColor = "#23262F";
                      e.target.style.color = "#fff";
                    },
                    children: "Continue Shopping"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
               .object-fit-cover { object-fit: cover; }
               .cart-page-wrapper .fw-bold,
               .cart-page-wrapper .fw-semibold {
                   color: #23262F !important;
               }
               .cart-item-price-mobile {
                   display: none;
               }
               @media (max-width: 991px) {
                   .cart-page-wrapper {
                       padding: 40px 20px !important;
                   }
                   .cart-page-grid {
                        row-gap: 18px;
                   }
                   .cart-items-card {
                        padding: 18px !important;
                        border-radius: 18px !important;
                   }
                   .cart-item-row {
                        min-height: auto !important;
                        gap: 14px;
                   }
                   .cart-item-image-wrap {
                        width: 96px !important;
                        min-width: 96px !important;
                        margin-right: 0 !important;
                   }
                   .cart-item-image-box {
                        height: 96px !important;
                        border-radius: 12px !important;
                   }
                   .cart-item-top {
                        gap: 10px;
                   }
                   .cart-item-content {
                        min-width: 0;
                        margin-right: 0 !important;
                   }
                   .cart-item-title {
                        font-size: 14px !important;
                        line-height: 1.3 !important;
                        margin-bottom: 6px !important;
                   }
                   .cart-item-description {
                        font-size: 12px !important;
                        line-height: 1.45 !important;
                        margin-bottom: 0 !important;
                        display: -webkit-box;
                        -webkit-line-clamp: 4;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                   }
                   .cart-remove-btn {
                        padding: 2px !important;
                        font-size: 15px !important;
                        flex-shrink: 0;
                   }
                   .cart-item-bottom {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 10px;
                   }
                   .cart-item-price {
                        font-size: 15px;
                   }
                   .cart-qty-control {
                        align-self: flex-start;
                        padding-inline: 6px !important;
                   }
                   .cart-summary-col {
                        margin-top: 0 !important;
                   }
                   .order-summary-card {
                        border-radius: 18px !important;
                   }
                   .order-summary-card > div:first-child,
                   .order-summary-card > div:last-child {
                        padding: 18px !important;
                   }
               }
               @media (max-width: 575px) {
                   .cart-page-wrapper {
                        padding: 24px 14px 90px !important;
                   }
                   .cart-page-wrapper h2 {
                        font-size: 34px !important;
                        line-height: 1.15 !important;
                        margin-bottom: 24px !important;
                   }
                   .cart-item-row {
                        align-items: flex-start !important;
                        display: grid !important;
                        grid-template-columns: 86px minmax(0, 1fr);
                        grid-template-areas:
                            "image content"
                            "price qty";
                        column-gap: 12px;
                        row-gap: 10px;
                   }
                   .cart-item-image-wrap {
                        width: 86px !important;
                        min-width: 86px !important;
                        grid-area: image;
                   }
                   .cart-item-image-box {
                        height: 86px !important;
                   }
                   .cart-item-price-mobile {
                        display: flex !important;
                        align-items: center;
                        min-height: 34px;
                        margin-top: 10px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #23262F;
                        align-self: center;
                    }
                   .cart-item-top {
                        grid-area: content;
                        margin-bottom: 0 !important;
                    }
                   .cart-item-bottom {
                        display: contents !important;
                   }
                   .cart-item-price {
                        display: none !important;
                    }
                   .cart-qty-control {
                        grid-area: qty;
                        justify-self: end;
                        align-self: center;
                        margin-top: 0 !important;
                        min-height: 34px;
                    }
                   .cart-item-title {
                        font-size: 13px !important;
                   }
                   .cart-item-description {
                        -webkit-line-clamp: 3;
                   }
                   .cart-qty-control .btn {
                        padding: 0.2rem 0.35rem !important;
                   }
                }
           `
    } })
  ] });
}
Index.layout = (page) => /* @__PURE__ */ jsx(AppLayout, { title: "Shopping Cart", children: page });
export {
  Index as default
};
