import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, usePage, router, useForm, Head } from "@inertiajs/react";
import { route as route$1 } from "ziggy-js";
import { useState, useRef, useEffect, useContext, createContext } from "react";
import { u as useCart, C as CartProvider } from "./CartContext-DXNQZwkV.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { Oval } from "react-loader-spinner";
import Swal from "sweetalert2";
import axios from "axios";
import { C as CurrencyPicker } from "./CurrencyPicker-BYSFLoir.js";
function CartPopup() {
  const { cartItems, loading, getTotalPrice, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState({});
  const popupRef = useRef(null);
  const displayItems = Array.isArray(cartItems) ? cartItems : [];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);
  const handleRemoveItem = async (cartItemId) => {
    setUpdating((prev) => ({ ...prev, [cartItemId]: true }));
    const response = await removeFromCart(cartItemId);
    setUpdating((prev) => ({ ...prev, [cartItemId]: false }));
    if (!response.success) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.message || "Failed to remove item"
      });
    }
  };
  const totalAmount = displayItems.reduce((sum, item) => sum + parseFloat(item.price || 0) * (item.quantity || 1), 0);
  return /* @__PURE__ */ jsxs("div", { className: "position-relative", ref: popupRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "cart-icon-btn position-relative d-flex align-items-center justify-content-center p-2",
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "transform 0.2s ease"
        },
        onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)",
        onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
        children: [
          /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#23262F", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("circle", { cx: "9", cy: "21", r: "1" }),
            /* @__PURE__ */ jsx("circle", { cx: "20", cy: "21", r: "1" }),
            /* @__PURE__ */ jsx("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
          ] }),
          displayItems.length > 0 && /* @__PURE__ */ jsx(
            "span",
            {
              className: "cart-badge position-absolute badge rounded-pill",
              style: {
                backgroundColor: "#43ACE9",
                fontSize: "10px",
                padding: "4px 6px",
                top: "1px",
                right: "-2px",
                transform: "none"
              },
              children: displayItems.length
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "cart-popup-container", children: /* @__PURE__ */ jsxs("div", { className: "cart-popup-content shadow-lg border-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center cart-popup-header", children: [
        /* @__PURE__ */ jsx("h5", { className: "mb-0 fw-bold", style: { color: "#23262F", fontFamily: '"Inter", sans-serif' }, children: "Shopping Cart" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(false), className: "btn-close btn-sm shadow-none" })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-5", children: /* @__PURE__ */ jsx(Oval, { height: 40, width: 40, color: "#43ACE9" }) }) : displayItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-5", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 opacity-25", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-cart-shopping fa-4x text-muted" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-muted fw-medium mb-4", children: "Your Cart is empty" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route$1("marketplace.index"),
            className: "btn btn-dark px-4 py-2 small fw-bold",
            onClick: () => setIsOpen(false),
            style: { backgroundColor: "#23262F", borderRadius: "12px" },
            children: "Browse Products"
          }
        )
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "cart-items-scroll pe-2", style: { maxHeight: "350px", overflowY: "auto" }, children: displayItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "cart-popup-item d-flex gap-3 mb-3 last-child-mb-0", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 cart-popup-item-image", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: item.image ? item.image.startsWith("http") ? item.image : `https://admin.xpertbid.com/${item.image}` : "/assets/images/placeholder.png",
              alt: item.title,
              className: "w-100 h-100 object-fit-cover",
              onError: (e) => e.target.src = "/assets/images/WebsiteBanner2.png"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "cart-popup-item-details flex-grow-1 min-width-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-start gap-2 mb-2", children: [
              /* @__PURE__ */ jsx("h6", { className: "mb-0 fw-bold cart-popup-item-title", children: item.title }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleRemoveItem(item.id),
                  disabled: updating[item.id],
                  className: "btn btn-link text-danger p-0 border-0 shadow-none cart-popup-remove-btn",
                  children: updating[item.id] ? /* @__PURE__ */ jsx(Oval, { height: 14, width: 14, color: "#dc3545" }) : /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can small" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `cart-popup-item-meta ${item.variation_name ? "" : "is-compact"}`, children: [
              item.variation_name && /* @__PURE__ */ jsx("p", { className: "small text-muted mb-0 cart-popup-item-variation", children: item.variation_name }),
              /* @__PURE__ */ jsx("span", { className: "fw-bold text-dark cart-popup-item-price me-auto", children: /* @__PURE__ */ jsx(Price, { amountAED: item.price }) }),
              /* @__PURE__ */ jsxs("span", { className: "small text-muted cart-popup-item-qty", children: [
                "Qty: ",
                item.quantity || 1
              ] })
            ] })
          ] })
        ] }, item.id)) }),
        /* @__PURE__ */ jsxs("div", { className: "cart-popup-footer", children: [
          /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted fw-medium", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { className: "fw-bold fs-5", style: { color: "#43ACE9" }, children: /* @__PURE__ */ jsx(Price, { amountAED: totalAmount }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "d-grid gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route$1("cart.index"),
                onClick: () => setIsOpen(false),
                className: "btn cart-popup-action-btn cart-popup-action-btn--dark fw-bold small",
                children: "View Cart"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route$1("checkout.index"),
                onClick: () => setIsOpen(false),
                className: "btn cart-popup-action-btn cart-popup-action-btn--blue fw-bold shadow-sm",
                children: "Checkout"
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
                            .cart-popup-container {
                                   position: absolute;
                                   top: 100%;
                                   right: 0;
                                   margin-top: 15px;
                                   width: 380px;
                                   max-width: 90vw;
                                   z-index: 1050;
                             }
                             .cart-popup-content {
                                   background-color: #fff;
                                   padding: 22px;
                                   border-radius: 20px;
                                   animation: popupFadeIn 0.3s ease-out;
                             }
                             .cart-popup-header {
                                   margin-bottom: 18px;
                                   padding-bottom: 14px;
                                   border-bottom: 1px solid #eceff3;
                             }
                             .cart-popup-item {
                                   padding: 12px 0;
                                   border-bottom: 1px solid #f3f4f6;
                             }
                             .cart-popup-item-image {
                                   width: 74px;
                                   height: 74px;
                                   border-radius: 14px;
                                   overflow: hidden;
                                   border: 1px solid #f0f0f0;
                                   background: #f8fafc;
                             }
                             .cart-popup-item-details {
                                   display: grid;
                                   grid-template-columns: minmax(0, 1fr);
                                   align-content: start;
                                   min-width: 0;
                             }
                             .cart-popup-item-title {
                                   font-size: 16px;
                                   line-height: 1.35;
                                   color: #23262F;
                                   white-space: normal;
                                   word-break: break-word;
                                   padding-right: 8px;
                             }
                             .cart-popup-item-meta {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   gap: 12px;
                                   margin-bottom: 8px;
                             }
                             .cart-popup-item-meta.is-compact {
                                   justify-content: flex-end;
                                   margin-bottom: 4px;
                              }
                             .cart-popup-item-variation {
                                   flex: 1;
                                   text-align: left;
                             }
                             .cart-popup-item-bottom {
                                   display: flex;
                                   align-items: center;
                                   justify-content: flex-start;
                             }
                             .cart-popup-item-price {
                                   font-size: 15px;
                             }
                             .cart-popup-item-qty {
                                   min-width: fit-content;
                                   white-space: nowrap;
                                   text-align: right;
                             }
                             .cart-popup-remove-btn {
                                   min-width: 18px;
                                   flex-shrink: 0;
                                   margin-top: 2px;
                             }
                             .cart-popup-footer {
                                   margin-top: 18px;
                                   padding-top: 18px;
                                   border-top: 1px solid #eceff3;
                             }
                             .cart-popup-action-btn {
                                   min-height: 48px;
                                   border-radius: 12px;
                                   font-size: 15px;
                                   padding: 10px 16px;
                                   border: none;
                             }
                             .cart-popup-action-btn--dark {
                                   background: #23262F;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--dark:hover {
                                   background: #151922;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--blue {
                                   background: #43ACE9;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--blue:hover {
                                   background: #2f9cdb;
                                   color: #fff;
                             }
                             .cart-items-scroll::-webkit-scrollbar { width: 4px; }
                             .cart-items-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
                             .cart-items-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
                             .last-child-mb-0:last-child { margin-bottom: 0 !important; }
                             @keyframes popupFadeIn {
                                   from { opacity: 0; transform: translateY(-10px); }
                                   to { opacity: 1; transform: translateY(0); }
                             }
                             @media (max-width: 576px) {
                                   .cart-popup-container {
                                          position: fixed;
                                          top: 74px;
                                          left: 50%;
                                          transform: translateX(-50%);
                                          width: 95%;
                                   }
                                   .cart-popup-content {
                                          padding: 18px;
                                          border-radius: 18px;
                                   }
                                   .cart-popup-item-title {
                                          font-size: 15px;
                                    }
                                   .cart-popup-item-meta {
                                          align-items: flex-start;
                                   }
                                   .cart-popup-action-btn {
                                          min-height: 44px;
                                          border-radius: 10px;
                                          font-size: 14px;
                                   }
                             }
                      ` } })
  ] });
}
function DesktopCategoriesDropdown() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);
  useEffect(() => {
    axios.get("/get-category").then((res) => setCategories(res.data.categories || [])).catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    const handleShow = () => setIsOpen(true);
    const handleHide = () => setIsOpen(false);
    dropdown.addEventListener("show.bs.dropdown", handleShow);
    dropdown.addEventListener("hide.bs.dropdown", handleHide);
    return () => {
      dropdown.removeEventListener("show.bs.dropdown", handleShow);
      dropdown.removeEventListener("hide.bs.dropdown", handleHide);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "dropdown", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        className: "btn nav-link d-flex align-items-center",
        href: "#",
        ref: btnRef,
        role: "button",
        id: "categoriesDropdown",
        "data-bs-toggle": "dropdown",
        "aria-expanded": isOpen,
        style: { border: "none" },
        children: [
          "Categories",
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none",
              className: "ms-1",
              children: isOpen ? (
                // UP arrow
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M3.4001 12.5416L8.83344 7.10829C9.4751 6.46663 10.5251 6.46663 11.1668 7.10829L16.6001 12.5416",
                    stroke: "#606060",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              ) : (
                // DOWN arrow
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M16.5999 7.45837L11.1666 12.8917C10.5249 13.5334 9.4749 13.5334 8.83324 12.8917L3.3999 7.45837",
                    stroke: "#606060",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("ul", { className: "dropdown-menu", "aria-labelledby": "categoriesDropdown", children: categories.map((cat) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Link,
      {
        href: route$1("marketplace.index", cat.slug),
        className: "dropdown-item",
        children: cat.name
      }
    ) }, cat.slug)) })
  ] });
}
function CategoriesDropdown() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef();
  useEffect(() => {
    axios.get("/get-all-categories").then((res) => {
      setCategories(res.data.category || res.data.categories || []);
    }).catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const dropdownParent = btn.parentNode;
    if (!dropdownParent) return;
    function handleShow() {
      setIsOpen(true);
    }
    function handleHide() {
      setIsOpen(false);
    }
    dropdownParent.addEventListener("show.bs.dropdown", handleShow);
    dropdownParent.addEventListener("hide.bs.dropdown", handleHide);
    return () => {
      dropdownParent.removeEventListener("show.bs.dropdown", handleShow);
      dropdownParent.removeEventListener("hide.bs.dropdown", handleHide);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "dropdown", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "btn nav-link dropdown-toggle",
        type: "button",
        id: "categoriesDropdown",
        "data-bs-toggle": "dropdown",
        "aria-expanded": isOpen,
        ref: btnRef,
        style: { border: "none", display: "inline-flex", alignItems: "center", gap: "6px" },
        children: [
          "Categories",
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none",
              className: "ms-0",
              children: isOpen ? (
                // UP arrow
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M3.4001 12.5416L8.83344 7.10829C9.4751 6.46663 10.5251 6.46663 11.1668 7.10829L16.6001 12.5416",
                    stroke: "#606060",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              ) : (
                // DOWN arrow
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M16.5999 7.45837L11.1666 12.8917C10.5249 13.5334 9.4749 13.5334 8.83324 12.8917L3.3999 7.45837",
                    stroke: "#606060",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("ul", { className: "dropdown-menu", "aria-labelledby": "categoriesDropdown", children: categories.map((cat) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Link,
      {
        href: route$1("marketplace.index", cat.slug),
        className: "dropdown-item",
        children: cat.name
      }
    ) }, cat.id)) })
  ] });
}
const NotificationDropdown = () => {
  const { auth } = usePage().props;
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const notificationRef = useRef(null);
  useEffect(() => {
    if (auth.user) {
      fetchNotifications();
    }
  }, [auth.user]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target) && !event.target.closest(".notification")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  const markAsRead = async (id) => {
    try {
      await axios.post(`/api/notifications/read/${id}`);
      setNotifications(
        (prev) => prev.map(
          (n) => n.id === id ? { ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  const markAllAsRead = async () => {
    try {
      await axios.post("/api/notifications/read-all");
      setNotifications(
        (prev) => prev.map((n) => ({ ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  const confirmDeleteNotification = async () => {
    if (!notificationToDelete) return;
    try {
      await axios.delete(`/api/notifications/${notificationToDelete.id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationToDelete.id));
      setNotificationToDelete(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  return /* @__PURE__ */ jsxs("div", { className: "notification-container", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "notification nav-notification rounded",
        style: {
          border: "none",
          backgroundColor: "transparent",
          position: "relative",
          padding: "8px",
          paddingLeft: "0px"
        },
        onClick: () => setIsOpen(!isOpen),
        children: [
          /* @__PURE__ */ jsx("img", { src: "/assets/images/notificationIcon.svg", alt: "Notifications" }),
          unreadCount > 0 && /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                position: "absolute",
                top: "2px",
                right: "0px",
                backgroundColor: "#43ACE9",
                color: "white",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              },
              children: unreadCount > 99 ? "99+" : unreadCount
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "notification-popup", ref: notificationRef, children: [
      /* @__PURE__ */ jsxs("div", { className: "notification-content p-3 border-bottom d-flex justify-content-between align-items-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "m-0", style: { fontSize: "1rem", color: "#23262F", fontWeight: 700 }, children: notifications.length > 0 ? "Notifications" : "No new notifications" }),
        notifications.length > 0 && /* @__PURE__ */ jsxs("button", { className: "markAsRead btn btn-link p-0 text-decoration-none", style: { fontSize: "0.8rem", color: "#43ACE9", fontWeight: 600 }, onClick: markAllAsRead, children: [
          /* @__PURE__ */ jsx("img", { src: "/assets/images/double-tick.svg", alt: "Mark All", className: "me-1" }),
          " Mark all read"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "notification-body", style: { maxHeight: "300px", overflowY: "auto" }, children: [
        loading && /* @__PURE__ */ jsx("p", { className: "p-3 text-center", style: { color: "#23262F" }, children: "Loading notifications..." }),
        !loading && notifications.length === 0 && /* @__PURE__ */ jsx("p", { className: "p-3 text-center", style: { color: "#23262F" }, children: "Empty" }),
        !loading && notifications.map((notification) => /* @__PURE__ */ jsx("div", { className: `notification-item p-2 border-bottom ${notification.read_at ? "opacity-50" : ""}`, style: { fontSize: "0.85rem" }, children: /* @__PURE__ */ jsxs("div", { className: "d-flex gap-2", children: [
          /* @__PURE__ */ jsx("img", { src: notification.image_url || "/assets/images/message-text.svg", alt: "", width: 32, height: 32 }),
          /* @__PURE__ */ jsxs("div", { className: "flex-grow-1", children: [
            /* @__PURE__ */ jsx("p", { className: "mb-0 fw-bold", style: { color: "#23262F" }, children: notification.title }),
            /* @__PURE__ */ jsx("p", { className: "mb-0 text-muted", style: { fontSize: "0.75rem" }, children: new Date(notification.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "d-flex flex-column gap-1", children: [
            !notification.read_at && /* @__PURE__ */ jsx("button", { className: "btn btn-sm btn-link p-0", onClick: () => markAsRead(notification.id), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check text-success" }) }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-sm btn-link p-0", onClick: () => setNotificationToDelete(notification), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark text-danger" }) })
          ] })
        ] }) }, notification.id))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "notification-footer p-2 text-center border-top", children: /* @__PURE__ */ jsx(Link, { href: "/notifications-page", style: { fontSize: "0.8rem", color: "#23262F", fontWeight: 600 }, children: "See All Notifications" }) })
    ] }),
    notificationToDelete && /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1200,
          padding: "16px"
        },
        onClick: () => setNotificationToDelete(null),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: (event) => event.stopPropagation(),
            style: {
              width: "100%",
              maxWidth: "360px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
              padding: "22px"
            },
            children: [
              /* @__PURE__ */ jsx("h4", { style: { margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#23262F" }, children: "Delete Notification" }),
              /* @__PURE__ */ jsx("p", { style: { margin: "10px 0 0", fontSize: "0.92rem", color: "#5B6475", lineHeight: 1.6 }, children: "Are you sure you want to delete this notification?" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginTop: "18px" }, children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNotificationToDelete(null),
                    style: {
                      flex: 1,
                      border: "1px solid #D7DEEA",
                      background: "#fff",
                      color: "#23262F",
                      borderRadius: "10px",
                      padding: "11px 14px",
                      fontWeight: 600
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: confirmDeleteNotification,
                    style: {
                      flex: 1,
                      border: "none",
                      background: "#23262F",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "11px 14px",
                      fontWeight: 600
                    },
                    children: "Delete"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
};
function Search({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);
  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(
            "/search-auctions",
            { params: { query } }
          );
          setResults(data.auctions || []);
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.visit(`/marketplace?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "search-overlay", children: [
    /* @__PURE__ */ jsxs("div", { className: "search-box", children: [
      /* @__PURE__ */ jsx("button", { className: "close-btn", onClick: onClose, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Search any auction listing...",
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (query.length > 2) {
                  router.visit(`/marketplace?search=${encodeURIComponent(query.trim())}`);
                  onClose();
                }
              }
            }
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "search-submit-btn", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass" }) })
      ] }),
      loading && /* @__PURE__ */ jsx("p", { className: "status", children: "Searching..." }),
      !loading && query.length > 2 && results.length === 0 && /* @__PURE__ */ jsx("p", { className: "status", children: "No results found" }),
      results.length > 0 && /* @__PURE__ */ jsx("ul", { className: "results", children: results.map((item) => /* @__PURE__ */ jsx(
        "li",
        {
          onClick: () => {
            router.visit(`/product/${item.slug}`);
            onClose();
          },
          children: item.title
        },
        item.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                            .search-overlay {
                                   position: fixed; top: 0; left: 0;
                                   width: 100%; height: 70%;
                                   background: #F9F9F9;
                                   backdrop-filter: blur(4px);
                                   z-index: 9999;
                                   display: flex;
                                   box-shadow: 0px 45px 89.4px 0px rgba(0, 0, 0, 0.20);
                                   padding-top: 50px;
                                   border: none;
                            }
                            .search-box {
                                   position: relative;
                                   width: 100%;
                            }
                            .search-box form {
                                   display: flex;
                                   align-items: center;
                                   gap: 10px;
                                   width: 100%;
                            }
                            .search-box input {
                                   width: 100%;
                                   padding: 1rem 2.5rem 1rem 1rem;
                                   font-size: 1rem;
                                   border: none;
                                   border-radius: 8px;
                            }
                            .search-submit-btn {
                                   background: #23262F;
                                   color: white;
                                   border: none;
                                   border-radius: 8px;
                                   padding: 0.8rem 1.5rem;
                                   cursor: pointer;
                                   font-size: 1.2rem;
                                   transition: background 0.2s;
                            }
                            .search-submit-btn:hover {
                                   background: #1a1c22;
                            }
                            .close-btn {
                                   position: absolute; top: -2.5rem; right: 0;
                                   background: none; border: none; font-size: 1.5rem;
                                   cursor: pointer;
                                   padding-right: 10px;
                            }
                            .status {
                                   margin-top: 0.5rem;
                                   font-style: italic;
                            }
                            .results {
                                   margin-top: 0.5rem;
                                   list-style: none; padding: 0;
                                   max-height: 300px; overflow-y: auto;
                            }
                            .results li {
                                   padding: 0.5rem;
                                   cursor: pointer;
                            }
                            .results li:hover {
                                   background: #f0f0f0;
                            }
                     `
    } })
  ] });
}
const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [currentStep, setCurrentStep] = useState("loginStep");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("loginStep");
      setErrorMessage("");
      setShowPassword(false);
    }
  }, [isOpen]);
  const { data: emailData, setData: setEmailData, post: postEmail, processing: emailProcessing, errors: emailErrors } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const [phoneData, setPhoneData] = useState({
    phone: "",
    otp: "",
    countryCode: "+92",
    otp_type: "sms"
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotErrors, setForgotErrors] = useState({});
  const [forgotProcessing, setForgotProcessing] = useState(false);
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotErrors({});
    setForgotProcessing(true);
    try {
      await axios.post("https://admin.xpertbid.com/api/forgot-password", { email: forgotEmail });
      setForgotMessage("sent");
    } catch (error) {
      setForgotErrors(error.response?.data?.error || { email: "Failed to send link. Please try again." });
    } finally {
      setForgotProcessing(false);
    }
  };
  const handleEmailLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");
    postEmail(route$1("login"), {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        setErrorMessage(err.email || "Invalid credentials");
      }
    });
  };
  const handleContinueWithPhone = (type) => {
    setPhoneData((prev) => ({ ...prev, otp_type: type }));
    setCurrentStep("phoneLogin");
  };
  const validatePhoneNumber = (num) => {
    return num.replace(/\D/g, "").length >= 7;
  };
  const handlePhoneLogin = (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(phoneData.phone)) {
      setErrorMessage("Invalid phone number.");
      return;
    }
    if (!phoneData.password) {
      setErrorMessage("Please enter your password.");
      return;
    }
    setErrorMessage("");
    const formattedPhone = `${phoneData.countryCode}${phoneData.phone.replace(/^0+/, "")}`;
    router.post(route$1("login"), {
      email: formattedPhone,
      password: phoneData.password,
      remember: true
      // Assuming always remember for phone login, or add checkbox?
    }, {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        setErrorMessage(err.email || "Invalid credentials. If you forgot your password, please use Forgot Password.");
      }
    });
  };
  const sendOtp = async () => {
    if (!validatePhoneNumber(phoneData.phone)) {
      setErrorMessage("Invalid phone number.");
      return;
    }
    setErrorMessage("");
    try {
      const formattedPhone = `${phoneData.countryCode}${phoneData.phone.replace(/^0+/, "")}`;
      await axios.post("/api/auth/send-otp", {
        phone: formattedPhone,
        type: "login",
        otp_type: phoneData.otp_type
      });
      setOtpSent(true);
      setCurrentStep("otpStep");
      startTimer();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP");
    }
  };
  const verifyOtp = async () => {
    setErrorMessage("");
    try {
      const formattedPhone = `${phoneData.countryCode}${phoneData.phone.replace(/^0+/, "")}`;
      await axios.post("/api/auth/verify-otp", {
        phone: formattedPhone,
        otp: phoneData.otp
      });
      onClose();
      router.visit(route$1("dashboard"));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP");
    }
  };
  const startTimer = () => {
    setIsResendDisabled(true);
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
  };
  const handleGoogleLogin = () => {
    window.location.href = route$1("auth.google");
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "loginModal", style: { display: isOpen ? "block" : "none" }, children: /* @__PURE__ */ jsxs("div", { className: "loginModal-content", children: [
    /* @__PURE__ */ jsx("span", { className: "close-btn", id: "closeLoginModal", onClick: onClose, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" }) }),
    currentStep === "loginStep" && /* @__PURE__ */ jsxs("div", { id: "loginStep", className: "login-form-step active text-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-4 fw-bold", children: "Login or Sign up" }),
      /* @__PURE__ */ jsxs("button", { onClick: () => handleContinueWithPhone("sms"), className: "loginContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/MobileLogo.svg", alt: "Phone", width: 20, className: "me-2" }),
        "Continue with Phone"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: handleGoogleLogin, className: "loginContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/googleLogo.svg", alt: "Google", width: 20, className: "me-2" }),
        "Continue with Google"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentStep("loginEmail"), className: "loginContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/smsLogo.svg", alt: "Email", width: 20, className: "me-2" }),
        "Continue with Email"
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "loginContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/appleLogo.svg", alt: "Apple", width: 20, className: "me-2" }),
        "Continue with Apple"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "small text-left text-muted mb-0 mt-3", children: [
        "By continuing, I agree to xpertBid ",
        /* @__PURE__ */ jsx(Link, { href: "/terms", className: "text-decoration-underline text-primary", onClick: onClose, children: "Terms of service" }),
        " and ",
        /* @__PURE__ */ jsx(Link, { href: "/privacy-policy", className: "text-decoration-underline text-primary", onClick: onClose, children: "privacy policy." })
      ] })
    ] }),
    currentStep === "phoneLogin" && /* @__PURE__ */ jsxs("div", { id: "loginStep2", className: "login-form-step", children: [
      /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
        /* @__PURE__ */ jsx("button", { id: "backPhoneLogin", onClick: () => setCurrentStep("loginStep"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mb-0 fw-bold", children: "Login with Phone" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "form-select border-0 bg-light rounded-3",
            value: phoneData.countryCode,
            onChange: (e) => setPhoneData({ ...phoneData, countryCode: e.target.value }),
            style: { width: "100%", marginBottom: "20px", height: "68px", borderRadius: "12px", border: "1px solid #FAFAFA", backgroundColor: "#FAFAFA", fontSize: "18px", fontWeight: "600", color: "#23262F", boxShadow: "15px 19px 50px 0 #0000001c" },
            children: [
              /* @__PURE__ */ jsx("option", { value: "+92", children: "+92 PK" }),
              /* @__PURE__ */ jsx("option", { value: "+971", children: "+971 UAE" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            className: "form-control",
            placeholder: "Enter Phone Number",
            value: phoneData.phone,
            onChange: (e) => setPhoneData({ ...phoneData, phone: e.target.value.replace(/\D/g, "") }),
            style: { width: "100%", marginBottom: "20px", height: "68px", borderRadius: "12px", border: "1px solid #FAFAFA", backgroundColor: "#FAFAFA", fontSize: "18px", fontWeight: "600", color: "#23262F", boxShadow: "15px 19px 50px 0 #0000001c" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-3 position-relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: showPassword ? "text" : "password",
            placeholder: "Enter Password",
            value: phoneData.password || "",
            onChange: (e) => setPhoneData({ ...phoneData, password: e.target.value }),
            className: "form-control",
            style: { paddingRight: "40px", marginBottom: "20px", height: "68px", borderRadius: "12px", border: "1px solid #FAFAFA", backgroundColor: "#FAFAFA", fontSize: "18px", fontWeight: "600", color: "#23262F", boxShadow: "15px 19px 50px 0 #0000001c" }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted",
            onClick: () => setShowPassword(!showPassword),
            style: { right: "10px", top: "34px" },
            children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}` })
          }
        )
      ] }),
      errorMessage && /* @__PURE__ */ jsx("div", { className: "alert alert-danger py-2 small mb-3", children: errorMessage }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 mb-4 text-muted small", children: "Enter your phone number and password to login." }),
      /* @__PURE__ */ jsx("button", { className: "form-button-1", onClick: handlePhoneLogin, children: "Login" })
    ] }),
    currentStep === "otpStep" && /* @__PURE__ */ jsxs("div", { id: "otpStep", className: "login-form-step", children: [
      /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
        /* @__PURE__ */ jsx("button", { id: "backOtpLogin", onClick: () => setCurrentStep("phoneLogin"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mb-0 fw-bold", children: "Verify OTP" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4 small text-muted text-center", children: [
        "Enter the OTP sent to ",
        phoneData.countryCode,
        phoneData.phone
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-4 d-flex justify-content-center gap-2", children: [0, 1, 2, 3, 4, 5].map((index) => /* @__PURE__ */ jsx(
        "input",
        {
          id: `otp-input-${index}`,
          type: "text",
          maxLength: 1,
          className: "form-control text-center fw-bold fs-4",
          value: phoneData.otp[index] || "",
          onChange: (e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (!val) return;
            const newOtp = phoneData.otp.split("");
            newOtp[index] = val;
            const newOtpString = newOtp.join("");
            setPhoneData({ ...phoneData, otp: newOtpString });
            if (index < 5) {
              document.getElementById(`otp-input-${index + 1}`).focus();
            }
          },
          onKeyDown: (e) => {
            if (e.key === "Backspace") {
              if (!phoneData.otp[index] && index > 0) {
                document.getElementById(`otp-input-${index - 1}`).focus();
              } else {
                const newOtp = phoneData.otp.split("");
                newOtp[index] = "";
                setPhoneData({ ...phoneData, otp: newOtp.join("") });
              }
            }
          },
          onPaste: (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            setPhoneData({ ...phoneData, otp: pastedData });
          },
          style: { width: "50px", height: "60px", borderRadius: "12px", border: "1px solid #FAFAFA", backgroundColor: "#FAFAFA", boxShadow: "15px 19px 50px 0 #0000001c" }
        },
        index
      )) }),
      errorMessage && /* @__PURE__ */ jsx("div", { className: "alert alert-danger py-2 small mb-3", children: errorMessage }),
      /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: phoneData.otp.length < 6, onClick: verifyOtp, children: "Verify & Login" }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-3", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn btn-link text-decoration-none p-0 small text-dark fw-bold",
          disabled: isResendDisabled,
          onClick: sendOtp,
          children: isResendDisabled ? `Resend in ${resendTimer}s` : "Resend Code"
        }
      ) })
    ] }),
    currentStep === "loginEmail" && /* @__PURE__ */ jsxs("div", { id: "loginEmail", className: "login-form-step", children: [
      /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
        /* @__PURE__ */ jsx("button", { id: "backValidationLogin", onClick: () => setCurrentStep("loginStep"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mb-0 fw-bold", children: "Login with Email" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleEmailLogin, children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            placeholder: "Enter your email",
            value: emailData.email,
            onChange: (e) => setEmailData("email", e.target.value),
            required: true
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3 position-relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              placeholder: "Enter password",
              value: emailData.password,
              onChange: (e) => setEmailData("password", e.target.value),
              required: true,
              style: { paddingRight: "40px" }
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted",
              onClick: () => setShowPassword(!showPassword),
              style: { right: "10px", top: "34px" },
              children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}` })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-check mb-0", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "form-check-input",
                type: "checkbox",
                id: "rememberMe",
                checked: emailData.remember,
                onChange: (e) => setEmailData("remember", e.target.checked),
                style: { marginTop: "0.2rem" }
              }
            ),
            /* @__PURE__ */ jsx("label", { className: "form-check-label small text-muted ms-2", htmlFor: "rememberMe", style: { paddingTop: "1px" }, children: "Remember me" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "btn btn-link small text-dark fw-bold text-decoration-none p-0",
              onClick: () => setCurrentStep("forgotPassword"),
              children: "Forgot Password?"
            }
          )
        ] }),
        errorMessage && /* @__PURE__ */ jsx("div", { className: "alert alert-danger py-2 small mb-3", children: errorMessage }),
        /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: emailProcessing, children: emailProcessing ? "Logging in..." : "Continue" })
      ] })
    ] }),
    currentStep === "forgotPassword" && /* @__PURE__ */ jsxs("div", { id: "forgotPasswordStep", className: "login-form-step", style: { backgroundColor: "#ffffff" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            id: "backForgotPassword",
            onClick: () => {
              setForgotMessage("");
              setCurrentStep("loginEmail");
            },
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#666"
            },
            children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" })
          }
        ),
        /* @__PURE__ */ jsx("h3", { className: "mb-0 fw-bold", children: "Login or Sign up" })
      ] }),
      forgotMessage === "sent" ? /* @__PURE__ */ jsxs("div", { className: "text-center py-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/send_email.png", alt: "Email sent", width: 120, height: 120, className: "mx-auto" }) }),
        /* @__PURE__ */ jsx("h2", { className: "fw-bold mb-3", style: { fontSize: "24px" }, children: "Please Check your email" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted small mb-4", children: [
          "We sent password reset link to your email. Sometimes",
          /* @__PURE__ */ jsx("br", {}),
          " it shows in spam folder so please do check that."
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "form-button-1",
            onClick: () => {
              setForgotMessage("");
              setCurrentStep("loginEmail");
            },
            children: "Back to login"
          }
        )
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("img", { src: "/assets/images/forgetpassword.svg", className: "mx-auto mt-4 mb-4", alt: "Forgot password illustration" }),
          /* @__PURE__ */ jsx("h2", { className: "fw-bold mb-3", style: { fontSize: "24px" }, children: "Forgot your password?" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted small mb-4", children: "Enter your registered email to get a new password link." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              placeholder: "Enter your email",
              value: forgotEmail,
              onChange: (e) => setForgotEmail(e.target.value),
              className: "form-control",
              style: {
                marginBottom: "20px",
                width: "100%",
                borderRadius: "12px",
                height: "68px",
                border: "1px solid #FAFAFA",
                backgroundColor: "#FAFAFA",
                fontSize: "18px",
                color: "#23262F",
                boxShadow: "15px 19px 50px 0 #0000001c",
                fontWeight: "600",
                padding: "0 20px"
              }
            }
          ),
          forgotErrors.email && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: Array.isArray(forgotErrors.email) ? forgotErrors.email[0] : forgotErrors.email })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "form-button-1", onClick: handleForgotPassword, disabled: forgotProcessing, children: forgotProcessing ? "Sending..." : "Send Link" })
      ] })
    ] })
  ] }) });
};
const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [activeStep, setActiveStep] = useState("step1");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setActiveStep("step1");
      setErrorMessage("");
    }
  }, [isOpen]);
  const { data: formData, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    password: "",
    countryCode: "+92",
    terms: true,
    otp: "",
    signup_source: "web"
  });
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const handleEmailRegister = (e) => {
    e.preventDefault();
    setErrorMessage("");
    post(route$1("register"), {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        setErrorMessage(Object.values(err)[0] || "Registration failed");
      }
    });
  };
  const registerWithPhone = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const formattedPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, "")}`;
      await axios.post("/api/auth/send-otp", {
        phone: formattedPhone,
        type: "register",
        signup_source: "web"
      });
      setOtpSent(true);
      setActiveStep("otpVerification");
      startTimer();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyPhoneOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const formattedPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, "")}`;
      await axios.post("/api/auth/verify-otp", {
        phone: formattedPhone,
        otp: formData.otp,
        name: formData.name,
        password: formData.password,
        signup_source: "web"
      });
      onClose();
      router.visit(route$1("dashboard"));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  const startTimer = () => {
    setIsResendDisabled(true);
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
  };
  const handleGoogleSignUp = () => {
    window.location.href = route$1("auth.google");
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { id: "SignupModal", className: "signupModal video-modal", style: { display: isOpen ? "block" : "none", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060, overflowY: "auto" }, children: /* @__PURE__ */ jsxs("div", { className: "signupmodal-content", style: { position: "relative", margin: "50px auto", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "600px" }, children: [
    /* @__PURE__ */ jsx("span", { className: "close-btn", style: { position: "absolute", right: "20px", top: "20px", cursor: "pointer", zIndex: 10 }, onClick: onClose, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark", style: { backgroundColor: "#EDEDED", color: "#23262F", padding: "6px 8px", fontSize: "12px", borderRadius: "100%" } }) }),
    activeStep === "step1" && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 fw-bold text-center", children: "Sign Up" }),
      /* @__PURE__ */ jsxs("button", { onClick: handleGoogleSignUp, className: "signUpContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/googleLogo.svg", alt: "Google", width: 20, className: "me-2" }),
        "Continue with Google"
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "signUpContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/appleLogo.svg", alt: "Apple", width: 20, className: "me-2" }),
        "Continue with Apple"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => handleStepChange("emailSignup"), className: "signUpContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/smsLogo.svg", alt: "Email", width: 20, className: "me-2" }),
        "Sign Up with Email"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => handleStepChange("phoneSignup"), className: "signUpContinueIcon", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/MobileLogo.svg", alt: "Phone", width: 20, className: "me-2" }),
        "Sign Up with Phone"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "small text-left text-muted my-4", children: [
        "By continuing, I agree to xpertBid ",
        /* @__PURE__ */ jsx(Link, { href: "/terms", className: "text-decoration-underline text-primary", onClick: onClose, children: "Terms of service" }),
        " and ",
        /* @__PURE__ */ jsx(Link, { href: "/privacy-policy", className: "text-decoration-underline text-primary", onClick: onClose, children: "privacy policy." })
      ] })
    ] }),
    activeStep === "emailSignup" && /* @__PURE__ */ jsxs("div", { id: "stepEmail", children: [
      /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
        /* @__PURE__ */ jsx("button", { id: "backEmail", onClick: () => handleStepChange("step1"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mb-0 fw-bold", children: "Sign Up with Email" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleEmailRegister, children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Enter your name",
            value: formData.name,
            onChange: (e) => setData("name", e.target.value),
            required: true
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            placeholder: "Enter your email",
            value: formData.email,
            onChange: (e) => setData("email", e.target.value),
            required: true
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            placeholder: "Enter phone number",
            value: formData.phone,
            onChange: (e) => setData("phone", e.target.value),
            required: true
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            placeholder: "Create password",
            value: formData.password,
            onChange: (e) => setData("password", e.target.value),
            required: true
          }
        ) }),
        errorMessage && /* @__PURE__ */ jsx("div", { className: "alert-message", children: errorMessage }),
        /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: processing, children: processing ? "Creating Account..." : "Continue" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mt-3", children: [
        /* @__PURE__ */ jsx("span", { className: "small text-muted", children: "Already have an account? " }),
        /* @__PURE__ */ jsx("button", { className: "btn btn-link text-decoration-underline p-0 small text-dark fw-bold", onClick: onSwitchToLogin, children: "Login" })
      ] })
    ] }),
    activeStep === "phoneSignup" && /* @__PURE__ */ jsxs("div", { id: "phoneSignup", children: [
      /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
        /* @__PURE__ */ jsx("button", { className: "backbuttonSignup", onClick: () => handleStepChange("step1"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mb-0 fw-bold", children: "Sign Up with Phone" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx("div", { className: "steps-input-select", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Enter your name",
          value: formData.name,
          onChange: (e) => setData("name", e.target.value),
          required: true
        }
      ) }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsxs("div", { className: "input-group steps-input-select d-flex", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "form-select w-auto flex-grow-0 bg-light border-end-0 rounded-start-3",
            value: formData.countryCode,
            onChange: (e) => setData("countryCode", e.target.value),
            style: { maxWidth: "120px", marginBottom: "20px", borderRadius: "12px 0 0 12px" },
            children: [
              /* @__PURE__ */ jsx("option", { value: "+92", children: "+92 PK" }),
              /* @__PURE__ */ jsx("option", { value: "+971", children: "+971 UAE" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            className: "form-control",
            placeholder: "Enter Phone Number",
            value: formData.phone,
            onChange: (e) => setData("phone", e.target.value.replace(/\D/g, "")),
            style: { borderRadius: "0 12px 12px 0" }
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("div", { className: "steps-input-select", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          placeholder: "Create password",
          value: formData.password,
          onChange: (e) => setData("password", e.target.value),
          required: true
        }
      ) }) }),
      errorMessage && /* @__PURE__ */ jsx("div", { className: "alert-message", children: errorMessage }),
      /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: loading, onClick: registerWithPhone, children: loading ? "Sending..." : "Send OTP" })
    ] }),
    activeStep === "otpVerification" && /* @__PURE__ */ jsxs("div", { id: "emailOtp-container", children: [
      /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
        /* @__PURE__ */ jsx("button", { className: "backbuttonSignup", onClick: () => handleStepChange("phoneSignup"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mb-0 fw-bold", children: "Verify OTP" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4 small text-muted text-center", children: [
        "Enter the OTP sent to ",
        formData.countryCode,
        formData.phone
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-4 d-flex justify-content-center gap-2", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "form-control text-center fs-4 tracking-widest fw-bold",
          placeholder: "····",
          maxLength: 4,
          value: formData.otp || "",
          onChange: (e) => setData("otp", e.target.value.replace(/\D/g, "")),
          style: { width: "100%", height: "68px" }
        }
      ) }),
      errorMessage && /* @__PURE__ */ jsx("div", { className: "alert-message", children: errorMessage }),
      /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: loading || !formData.otp || formData.otp.length < 4, onClick: handleVerifyPhoneOtp, children: loading ? "Verifying..." : "Verify & Sign Up" }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-3", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn btn-link text-decoration-none p-0 small text-dark fw-bold",
          disabled: isResendDisabled,
          onClick: registerWithPhone,
          children: isResendDisabled ? `Resend in ${resendTimer}s` : "Resend Code"
        }
      ) })
    ] })
  ] }) });
};
const AuthModalContext = createContext();
const AuthModalProvider = ({ children }) => {
  const { url } = usePage();
  const [activeModal, setActiveModal] = useState(null);
  const openLogin = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModals = () => {
    setActiveModal(null);
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("auth")) {
      currentUrl.searchParams.delete("auth");
      window.history.replaceState({}, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    }
  };
  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    const authMode = currentUrl.searchParams.get("auth");
    if (authMode === "login") {
      setActiveModal("login");
    } else if (authMode === "register") {
      setActiveModal("register");
    }
  }, [url]);
  return /* @__PURE__ */ jsxs(AuthModalContext.Provider, { value: { openLogin, openRegister, closeModals, activeModal }, children: [
    children,
    /* @__PURE__ */ jsx(
      LoginModal,
      {
        isOpen: activeModal === "login",
        onClose: closeModals,
        onSwitchToRegister: openRegister
      }
    ),
    /* @__PURE__ */ jsx(
      RegisterModal,
      {
        isOpen: activeModal === "register",
        onClose: closeModals,
        onSwitchToLogin: openLogin
      }
    )
  ] });
};
const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
function Header() {
  const { auth } = usePage().props;
  const { url } = usePage();
  const user = auth?.user;
  const { openLogin, openRegister } = useAuthModal();
  const profileImageSrc = (() => {
    const src = user?.profile_pic;
    if (!src) return "/assets/images/user.jpg";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
      return src;
    }
    return `/${src.replace(/^\/+/, "")}`;
  })();
  const userProfileRefDesktop = useRef(null);
  const userProfileRefMobile = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isUserSettingsOpenDesktop, setUserSettingsOpenDesktop] = useState(false);
  const [isUserSettingsOpenMobile, setUserSettingsOpenMobile] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleUserSettingPopupDesktop = () => {
    setUserSettingsOpenDesktop((prev) => !prev);
  };
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };
  const handleLogout = () => {
    router.post(route$1("logout"));
  };
  const handleSellClick = (e) => {
    e.preventDefault();
    if (!user) {
      openLogin();
    } else {
      router.visit(route$1("auctions.create"));
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userProfileRefDesktop.current && !userProfileRefDesktop.current.contains(event.target) && !event.target.closest("#header-profile-dropdown")) {
        setUserSettingsOpenDesktop(false);
      }
      if (userProfileRefMobile.current && !userProfileRefMobile.current.contains(event.target) && !event.target.closest(".user-profile-setting")) {
        setUserSettingsOpenMobile(false);
      }
      if (mobileMenuRef.current && isMenuOpen && !mobileMenuRef.current.contains(event.target) && !event.target.closest(".navbar-toggler")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);
  useEffect(() => {
    setIsMenuOpen(false);
  }, [url]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Search,
      {
        isOpen: isSearchOpen,
        onClose: () => setSearchOpen(false)
      }
    ),
    /* @__PURE__ */ jsx("header", { className: "bg-white ", style: { zIndex: 1050 }, children: /* @__PURE__ */ jsx("nav", { className: "navbar navbar-expand-lg navbar-light bg-white py-2", id: "mainNavbar", children: /* @__PURE__ */ jsxs("div", { className: "container-fluid px-lg-5 my-3", children: [
      /* @__PURE__ */ jsx(Link, { className: "navbar-brand d-flex align-items-center me-0 me-lg-4", href: "/", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/images/header-logo.png",
          alt: "XpertBid Logo",
          width: 180,
          height: 50,
          className: "logo-image",
          style: { height: "auto", width: "auto" }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "mobile-header-actions d-flex d-lg-none align-items-center gap-2 ms-auto me-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-link p-0 text-muted",
            onClick: () => setSearchOpen(true),
            "aria-label": "Search",
            children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", viewBox: "0 0 20 20", fill: "none", children: [
              /* @__PURE__ */ jsx("path", { d: "M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
              /* @__PURE__ */ jsx("path", { d: "M18.3332 18.3332L16.6665 16.6665", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(CartPopup, {}),
        user && /* @__PURE__ */ jsx(NotificationDropdown, {}),
        !user && /* @__PURE__ */ jsxs("div", { className: "mobile-auth-buttons d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "mobile-auth-btn mobile-auth-login",
              onClick: openLogin,
              children: "Login"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "mobile-auth-btn mobile-auth-signup",
              onClick: openRegister,
              children: "Sign Up"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "navbar-toggler d-none",
          type: "button",
          onClick: () => setIsMenuOpen((prev) => !prev),
          "aria-controls": "navbarSupportedContent",
          "aria-expanded": isMenuOpen,
          "aria-label": "Toggle navigation",
          children: /* @__PURE__ */ jsx("span", { className: "navbar-toggler-icon" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { ref: mobileMenuRef, className: `navbar-collapse xpert-mobile-menu ${isMenuOpen ? "show" : ""}`, id: "navbarSupportedContent", children: [
        /* @__PURE__ */ jsxs("ul", { className: "navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center", children: [
          /* @__PURE__ */ jsx("li", { className: "nav-item d-none d-lg-block me-3", children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "search-trigger px-3 py-1  bg-light d-flex align-items-center ",
              onClick: () => setSearchOpen(true),
              style: { cursor: "pointer", minWidth: "200px" },
              children: [
                /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", children: [
                  /* @__PURE__ */ jsx("path", { d: "M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z", stroke: "#606060", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
                  /* @__PURE__ */ jsx("path", { d: "M18.3332 18.3332L16.6665 16.6665", stroke: "#606060", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "ms-2 text-muted small", children: "Search auctions" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("li", { className: "nav-item dropdown", children: [
            /* @__PURE__ */ jsx("div", { className: "d-none d-lg-block", children: /* @__PURE__ */ jsx(DesktopCategoriesDropdown, {}) }),
            /* @__PURE__ */ jsx("div", { className: "d-block d-lg-none", children: /* @__PURE__ */ jsx(CategoriesDropdown, {}) })
          ] }),
          /* @__PURE__ */ jsx("li", { className: "nav-item", children: /* @__PURE__ */ jsx(Link, { href: route$1("auctions.one_rupee"), className: "nav-link", onClick: closeMobileMenu, children: "1 Rupee Auction" }) }),
          /* @__PURE__ */ jsx("li", { className: "nav-item", children: /* @__PURE__ */ jsx(Link, { href: route$1("about"), className: "nav-link", onClick: closeMobileMenu, children: "About" }) }),
          /* @__PURE__ */ jsx("li", { className: "nav-item", children: /* @__PURE__ */ jsx(Link, { href: route$1("contact"), className: "nav-link", onClick: closeMobileMenu, children: "Contact Us" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center mt-3 mt-lg-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "d-none d-lg-flex align-items-center mt-2 header-desktop-actions", children: [
            /* @__PURE__ */ jsx("div", { className: "header-action-currency", children: /* @__PURE__ */ jsx(CurrencyPicker, {}) }),
            /* @__PURE__ */ jsx("div", { className: "header-action-cart", children: /* @__PURE__ */ jsx(CartPopup, {}) }),
            user && /* @__PURE__ */ jsx("div", { className: "header-action-notification", children: /* @__PURE__ */ jsx(NotificationDropdown, {}) })
          ] }),
          !user ? /* @__PURE__ */ jsxs("div", { className: "registration-btns d-flex align-items-center", children: [
            /* @__PURE__ */ jsx("button", { className: "login me-4", onClick: openLogin, children: "Login" }),
            /* @__PURE__ */ jsx("button", { className: "signup me-2", onClick: openRegister, children: "Sign Up" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "sellnow mx-3 px-3 d-none d-lg-inline-flex",
                onClick: handleSellClick,
                children: "Sell Now"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "user-profile-setting-container d-none d-lg-block", ref: userProfileRefDesktop, children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "user-profile-setting btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2",
                  id: "header-profile-dropdown",
                  onClick: toggleUserSettingPopupDesktop,
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: profileImageSrc,
                        alt: "Profile",
                        className: "rounded-circle border",
                        width: "35",
                        height: "35",
                        referrerPolicy: "no-referrer",
                        onError: (e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/images/user.jpg";
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-down small text-muted" })
                  ]
                }
              ),
              isUserSettingsOpenDesktop && /* @__PURE__ */ jsx("div", { id: "userProfileSettingPopup", className: "user-profile-setting-popup show", style: { position: "absolute", right: 0, top: "100%" }, children: /* @__PURE__ */ jsx("div", { className: "user-profile-setting-content", style: { padding: "18px 18px 18px 12px" }, children: /* @__PURE__ */ jsxs("ul", { className: "user-setting-menu", style: { paddingLeft: 0, listStyle: "none", marginBottom: 0, width: "100%" }, children: [
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("profile.edit"), children: [
                  /* @__PURE__ */ jsx("img", { src: "/assets/images/profile-setting.svg", alt: "Settings", width: 20, height: 20 }),
                  " Account Settings"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("chat.index"), children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-comment-dots text-center", style: { width: "20px", fontSize: "18px" } }),
                  " Messages"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("favorites.index"), children: [
                  /* @__PURE__ */ jsx("img", { src: "/assets/images/setting-heart.svg", alt: "Favorites", width: 20, height: 20 }),
                  " My Favorites"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("auctions.mylistings"), children: [
                  /* @__PURE__ */ jsx("img", { src: "/assets/images/mainListing.svg", alt: "Listings", width: 20, height: 20 }),
                  " My Listings"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("bids.index"), children: [
                  /* @__PURE__ */ jsx("img", { src: "/assets/images/myBids.svg", alt: "Bids", width: 20, height: 20 }),
                  " My Bids"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("orders.index"), children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-box-open text-center", style: { width: "20px", fontSize: "18px" } }),
                  " My Orders"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("payment_requests.index"), children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-money-check text-center", style: { width: "20px", fontSize: "18px" } }),
                  " Payment Request"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { borderBottom: "1px solid #EDEDED", padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px" }, children: /* @__PURE__ */ jsxs(Link, { className: "d-flex align-items-center gap-2 text-decoration-none", style: { color: "#24282B", fontFamily: '"Inter", sans-serif' }, href: route$1("verification.identity"), children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-id-card text-center", style: { width: "20px", fontSize: "18px" } }),
                  " Verification"
                ] }) }),
                /* @__PURE__ */ jsx("li", { style: { padding: "0px 0", fontSize: "16px", fontWeight: "400", lineHeight: "20px", display: "flex", alignItems: "center", gap: "15px", marginTop: "14px" }, children: /* @__PURE__ */ jsxs("button", { className: "transparent-button d-flex align-items-center gap-2 border-0 bg-transparent p-0", style: { color: "#E94343", fontFamily: '"Inter", sans-serif' }, onClick: handleLogout, children: [
                  /* @__PURE__ */ jsx("img", { src: "/assets/images/logout.svg", alt: "Logout" }),
                  " Log Out"
                ] }) })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "sellnow header-sell-btn px-3 d-none d-lg-inline-flex",
                onClick: handleSellClick,
                children: "Sell Now"
              }
            )
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("style", { children: `
                        .no-caret::after {
                            display: none !important;
                        }
                        .dropdown-menu {
                            border: none;
                            border-radius: 12px;
                        }
                        .dropdown-item:active {
                            background-color: #0d6efd;
                        }
                        
                        .user-profile-setting-popup {
                            position: absolute;
                            top: 100%;
                            right: 0;
                            background-color: #FAFAFA;
                            box-shadow: 17px 17px 61px 0 #00000023;
                            width: 300px;
                            border-radius: 12px;
                            z-index: 1000;
                            margin-top: 10px;
                            display: none;
                        }
                        .user-profile-setting-popup.show {
                            display: block;
                        }
                        .user-setting-menu li a:hover {
                            opacity: 0.8;
                        }
                        .header-desktop-actions {
                            gap: 10px;
                            margin-right: 12px;
                        }
                        .header-action-currency,
                        .header-action-cart,
                        .header-action-notification {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .header-action-cart .cart-icon-btn,
                        .header-action-notification .notification {
                            width: 38px;
                            height: 38px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 10px;
                            padding: 0 !important;
                        }
                        .user-profile-setting {
                            min-height: 38px;
                            gap: 8px !important;
                        }
                        .user-profile-setting img {
                            width: 35px;
                            height: 35px;
                            object-fit: cover;
                        }
                        .header-sell-btn {
                            margin-left: 12px;
                        }
                        
                        @media (min-width: 992px) {
                            .xpert-mobile-menu {
                                display: flex !important;
                                flex-basis: auto;
                            }
                        }

                        @media (max-width: 991px) {
                            .navbar-brand {
                                padding-left: 10px;
                                margin-right: 0 !important;
                            }
                            .logo-image {
                                width: 120px !important;
                                max-width: 120px !important;
                                height: auto !important;
                            }
                            .mobile-header-actions {
                                flex-shrink: 0;
                            }
                            .mobile-auth-buttons {
                                margin-right: 4px;
                            }
                            .mobile-auth-btn {
                                border: none;
                                border-radius: 10px;
                                height: 34px;
                                padding: 0 12px;
                                font-size: 12px;
                                font-weight: 700;
                                line-height: 1;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .mobile-auth-login {
                                background: #23262F;
                                color: #fff;
                            }
                            .mobile-auth-signup {
                                background: #43ACE9;
                                color: #fff;
                            }
                            .mobile-user-dropdown {
                                display: inline-flex;
                                align-items: center;
                            }
                            .mobile-user-trigger {
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                            }
                            .mobile-user-avatar {
                                width: 28px;
                                height: 28px;
                                object-fit: cover;
                                border: 1px solid #e5e7eb;
                            }
                            .mobile-user-menu {
                                min-width: 220px;
                                margin-top: 10px;
                            }
                            .xpert-mobile-menu {
                                display: none;
                                width: 100%;
                            }
                            .xpert-mobile-menu.show {
                                display: block;
                            }
                            .navbar-collapse {
                                background: white;
                                padding: 1rem;
                                border-radius: 0 0 12px 12px;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                            }
                            .navbar-nav .dropdown > div {
                                display: inline-flex;
                                align-items: center;
                            }
                            .navbar-nav .nav-link,
                            .navbar-nav .btn.nav-link.dropdown-toggle {
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                            }
                        }
            ` })
  ] });
}
function Footer() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get("/get-category").then((res) => setCats(res.data.categories || [])).catch((err) => {
      console.error(err);
      setError("Could not load categories.");
    }).finally(() => setLoading(false));
  }, []);
  return /* @__PURE__ */ jsx("footer", { className: "footer", children: /* @__PURE__ */ jsxs("div", { className: "container-fluid", children: [
    /* @__PURE__ */ jsx("div", { id: "qlwapp", className: "qlwapp qlwapp-free qlwapp-button qlwapp-bottom-left qlwapp-all qlwapp-rounded qlwapp-js-ready desktop", children: /* @__PURE__ */ jsx("div", { className: "qlwapp-container", children: /* @__PURE__ */ jsx("a", { className: "qlwapp-toggle", "data-action": "open", "data-phone": "923022113202", "data-message": "", role: "button", tabIndex: "0", target: "_blank", href: "https://wa.me/923022113202", children: /* @__PURE__ */ jsx("span", { className: "fa-brands fa-whatsapp gameon" }) }) }) }),
    "          ",
    /* @__PURE__ */ jsxs("div", { className: "row ", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-xl-4  col-sm-6 footer-child1", children: [
        /* @__PURE__ */ jsx("div", { className: "logo", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/assets/images/footer-logo.png",
            alt: "XpertBid Footer Logo",
            width: 200,
            height: 60,
            className: "quality-90"
          }
        ) }) }),
        /* @__PURE__ */ jsx("p", { children: "First ever UAE  based auction platform, providing you a one stop shop, auction marketplace/ Platform. From RealEstate, Vehicles, bulk goods and much more, XpertBid powers auctions that deliver value, security, and results one auction at a time." }),
        "              ",
        /* @__PURE__ */ jsxs("div", { className: "social-icons my-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq",
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-instagram" })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://www.linkedin.com/company/xpertbid/",
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-linkedin" })
            }
          ),
          /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr", target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-facebook" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "col-xl-4   col-sm-6 footer-child3", children: /* @__PURE__ */ jsxs("div", { className: "footer-menu ps-0 ps-sm-4", children: [
        /* @__PURE__ */ jsx("p", { className: "foot-menu-heading my-4", children: " Get To Know Us" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("faq"), children: "FAQ" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("blogs.index"), children: "Blogs" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("about"), children: "About Us" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("contact"), children: " Contact Us" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "col-xl-4   col-sm-6 footer-child3 mt-0 mt-sm-3", children: /* @__PURE__ */ jsx("div", { className: "footer-menu ps-0 ps-sm-4 mt-0 mt-sm-5", children: /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("refund.policy"), children: "Refund Policy" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("shipping.policy"), children: "Shipping Policy" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("privacy.policy"), children: "Privacy Policy" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route$1("terms"), children: "Terms & Conditions" }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "col-xl-3 col-sm-6 footer-child3 mt-0 mt-sm-5", children: /* @__PURE__ */ jsxs("div", { className: "footer-menu ps-0 ps-sm-4 mt-0 mt-lg-3", children: [
        loading && /* @__PURE__ */ jsx("div", { className: "d-flex justify-content-center", children: /* @__PURE__ */ jsx(Oval, { height: 30, width: 30, ariaLabel: "Loading categories" }) }),
        error && /* @__PURE__ */ jsx("p", { className: "text-danger", children: error })
      ] }) })
    ] })
  ] }) });
}
const UserProfile = () => {
  const { auth } = usePage().props;
  const user = auth?.user;
  if (!user) return null;
  return /* @__PURE__ */ jsx("div", { className: "d-flex flex-column align-items-center", children: user.profile_pic ? /* @__PURE__ */ jsx("img", { src: user.profile_pic, alt: "Profile", className: "rounded-circle", style: { width: 24, height: 24, objectFit: "cover" } }) : /* @__PURE__ */ jsx("img", { src: "/assets/images/user-icon.png", alt: "Profile", className: "rounded-circle", width: 24, height: 24 }) });
};
function MobileBottomNav() {
  const { props, url } = usePage();
  const { auth } = props;
  const user = auth?.user;
  const { openLogin } = useAuthModal();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isAuthenticated = Boolean(user);
  const handleLogout = () => {
    router.post(route$1("logout"));
    setIsUserMenuOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };
  const isActive = (path) => {
    return url === path || url.startsWith(path + "/");
  };
  const handleSellClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openLogin();
    } else {
      router.visit(route$1("auctions.create"));
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mobile-bottom-nav d-lg-none", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/",
          className: `mobile-bottom-nav__item ${url === "/" ? "mobile-bottom-nav__item--active" : ""}`,
          "aria-label": "Home",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-house mobile-bottom-nav__icon" }),
            /* @__PURE__ */ jsx("span", { className: "mobile-bottom-nav__label", children: "Home" })
          ]
        }
      ),
      isAuthenticated ? /* @__PURE__ */ jsxs(
        Link,
        {
          href: route$1("chat.index"),
          className: `mobile-bottom-nav__item ${isActive("/chat") ? "mobile-bottom-nav__item--active" : ""}`,
          "aria-label": "Chat",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-comment-dots mobile-bottom-nav__icon" }),
            /* @__PURE__ */ jsx("span", { className: "mobile-bottom-nav__label", children: "Chat" })
          ]
        }
      ) : /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: openLogin,
          className: "mobile-bottom-nav__item",
          "aria-label": "Chat",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-comment-dots mobile-bottom-nav__icon" }),
            /* @__PURE__ */ jsx("span", { className: "mobile-bottom-nav__label", children: "Chat" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleSellClick,
          className: `mobile-bottom-nav__item mobile-bottom-nav__item--action ${isActive("/auctions/create") ? "mobile-bottom-nav__item--active" : ""}`,
          "aria-label": "Sell",
          style: { background: "transparent", border: "none", cursor: "pointer", padding: 0 },
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mobile-bottom-nav__icon" }),
            /* @__PURE__ */ jsx("span", { className: "mobile-bottom-nav__label", children: "Sell" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route$1("auctions.one_rupee"),
          className: `mobile-bottom-nav__item mobile-bottom-nav__item--highlight`,
          "aria-label": "1 Rupee Auction",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-gavel mobile-bottom-nav__icon" }),
            /* @__PURE__ */ jsx("span", { className: "mobile-bottom-nav__label", style: { fontSize: "10px", lineHeight: "1.1", textAlign: "center" }, children: "1 Rupee" })
          ]
        }
      ),
      isAuthenticated ? /* @__PURE__ */ jsxs("div", { className: "mobile-bottom-nav__item mobile-bottom-nav__profile", ref: menuRef, children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "mobile-bottom-nav__profile-btn",
            onClick: toggleUserMenu,
            "aria-label": "User menu",
            children: [
              /* @__PURE__ */ jsx(UserProfile, {}),
              /* @__PURE__ */ jsx("span", { className: "mobile-bottom-nav__label", children: "Profile" })
            ]
          }
        ),
        isUserMenuOpen && /* @__PURE__ */ jsx("div", { className: "mobile-bottom-nav__dropdown shadow", children: /* @__PURE__ */ jsxs("ul", { className: "user-setting-menu list-unstyled m-0 p-0", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("dashboard"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-table-columns text-center", style: { width: "20px", fontSize: "18px" } }),
            "Dashboard"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("profile.edit"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/images/profile-setting.svg", alt: "Settings", width: 20, height: 20 }),
            "Account Settings"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("chat.index"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-comment-dots text-center", style: { width: "20px", fontSize: "18px" } }),
            "Messages"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("favorites.index"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/images/setting-heart.svg", alt: "Favorites", width: 20, height: 20 }),
            "My Favorites"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("auctions.mylistings"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/images/mainListing.svg", alt: "Listings", width: 20, height: 20 }),
            "My Listings"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("bids.index"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/images/myBids.svg", alt: "Bids", width: 20, height: 20 }),
            "My Bids"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("orders.index"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-box-open text-center", style: { width: "20px", fontSize: "18px" } }),
            "My Orders"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("payment_requests.index"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-money-check text-center", style: { width: "20px", fontSize: "18px" } }),
            "Payment Request"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: route$1("verification.identity"), onClick: () => setIsUserMenuOpen(false), children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-id-card text-center", style: { width: "20px", fontSize: "18px" } }),
            "Verification"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { className: "mobile-bottom-nav__logout-btn", onClick: handleLogout, children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/images/logout.svg", alt: "Logout", width: 20, height: 20 }),
            "Log Out"
          ] }) })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: openLogin,
          className: "mobile-bottom-nav__item",
          "aria-label": "Login",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-regular fa-user mobile-bottom-nav__icon" }),
            /* @__PURE__ */ jsx("span", { className: "mobile-bottom-nav__label", children: "Profile" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                body {
                    padding-bottom: 70px;
                }
                @media (min-width: 992px) {
                    body {
                        padding-bottom: 0px;
                    }
                    .mobile-bottom-nav {
                        display: none !important;
                    }
                }

                .mobile-bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #ffffff;
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 8px 10px;
                    z-index: 1050;
                    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
                }

                .mobile-bottom-nav__item {
                    flex: 1;
                    text-align: center;
                    color: #606060;
                    font-family: "Inter", sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    text-decoration: none !important;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    border: none;
                    background: transparent;
                }

                .mobile-bottom-nav__item--active {
                    color: #0d6efd !important;
                }

                .mobile-bottom-nav__icon {
                    font-size: 18px;
                }

                .mobile-bottom-nav__profile {
                    position: relative;
                }

                .mobile-bottom-nav__profile-btn {
                    background: transparent;
                    border: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    color: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                }

                .mobile-bottom-nav__dropdown {
                    position: fixed;
                    left: 12px;
                    right: 12px;
                    bottom: 74px;
                    background: white;
                    border-radius: 18px;
                    overflow-y: auto;
                    padding: 10px 0;
                    border: 1px solid #eee;
                    z-index: 1060;
                    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
                }

                .user-setting-menu li a, .user-setting-menu li button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px 14px 5px;
                    color: #333;
                    text-decoration: none;
                    font-size: 15px;
                    text-align: left;
                    width: 100%;
                    border: none;
                    background: none;
                }

                .user-setting-menu li:not(:last-child) {
                    border-bottom: 1px solid #ededed;
                }

                .mobile-bottom-nav__logout-btn {
                    color: #e94343 !important;
                }

                .mobile-bottom-nav__item--highlight {
                    animation: glow-pulse 1.5s infinite ease-in-out;
                }

                @keyframes glow-pulse {
                    0% { transform: scale(1); color: #0d6efd; }
                    50% { transform: scale(1.1); color: #fd7e14; }
                    100% { transform: scale(1); color: #0d6efd; }
                }
            `
    } })
  ] });
}
function AppLayout({ children, title }) {
  const { flash, auth, ziggy } = usePage().props;
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isHiding, setIsHiding] = useState(false);
  const individualVerificationStatus = auth?.user?.individual_verification?.status || auth?.user?.individualVerification?.status;
  const corporateVerificationStatus = auth?.user?.corporate_verification?.status || auth?.user?.corporateVerification?.status;
  const verificationStatus = corporateVerificationStatus || individualVerificationStatus || "unverified";
  const currentPath = ziggy?.location && ziggy.location.startsWith("http") ? new URL(ziggy.location).pathname : ziggy?.location || "";
  const shouldShowVerifyButton = Boolean(auth?.user) && verificationStatus !== "verified" && (auth?.user ? currentPath !== route("verification.identity", {}, false) : false);
  useEffect(() => {
    if (flash?.success || flash?.error) {
      setToast({
        show: true,
        message: flash.success || flash.error,
        type: flash.success ? "success" : "error"
      });
      setIsHiding(false);
      const timer = setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 500);
      }, 5e3);
      return () => clearTimeout(timer);
    }
  }, [flash]);
  return /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsxs(AuthModalProvider, { children: [
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100", children: [
      title && /* @__PURE__ */ jsx(Head, { title }),
      toast.show && /* @__PURE__ */ jsx("div", { className: "toast-container", children: /* @__PURE__ */ jsxs("div", { className: `premium-toast ${isHiding ? "hiding" : ""}`, style: { borderLeftColor: toast.type === "error" ? "#FF4D4D" : "#43ACE9" }, children: [
        /* @__PURE__ */ jsx("div", { className: "premium-toast-icon", style: { backgroundColor: toast.type === "error" ? "#FF4D4D" : "#43ACE9" }, children: toast.type === "error" ? /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
          /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
        ] }) : /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "premium-toast-content", children: [
          /* @__PURE__ */ jsx("div", { style: { fontWeight: "600", fontSize: "15px", color: "#fff" }, children: toast.type === "error" ? "Error" : "Success" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", opacity: 0.8, color: "#fff" }, children: toast.message })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { children }),
      shouldShowVerifyButton && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "global-verify-account-btn",
          onClick: () => window.location.href = route("verification.identity"),
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-check" }),
            /* @__PURE__ */ jsx("span", { children: "Verify Account" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(MobileBottomNav, {})
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                                   /* Premium Toast Notification */
                                   .toast-container {
                                          position: fixed;
                                          top: 20px;
                                          right: 20px;
                                          z-index: 9999;
                                          display: flex;
                                          flex-direction: column;
                                          gap: 10px;
                                   }
                                   .premium-toast {
                                          background: #23262F;
                                          color: #fff;
                                          padding: 16px 24px;
                                          border-radius: 12px;
                                          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                                          display: flex;
                                          align-items: center;
                                          gap: 12px;
                                          min-width: 300px;
                                          animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                                          border-left: 4px solid #43ACE9;
                                   }
                                   .premium-toast.hiding {
                                          animation: slideOutRight 0.5s ease forwards;
                                   }
                                   .premium-toast-icon {
                                          background: #43ACE9;
                                          width: 24px;
                                          height: 24px;
                                          border-radius: 50%;
                                          display: flex;
                                          align-items: center;
                                          justify-content: center;
                                          flex-shrink: 0;
                                   }
                                   @keyframes slideInRight {
                                          from { transform: translateX(120%); opacity: 0; }
                                          to { transform: translateX(0); opacity: 1; }
                                   }
                                   @keyframes slideOutRight {
                                          from { transform: translateX(0); opacity: 1; }
                                          to { transform: translateX(120%); opacity: 0; }
                                   }
                                   .global-verify-account-btn {
                                          position: fixed;
                                          left: 18px;
                                          bottom: 24px;
                                          z-index: 999;
                                          display: inline-flex;
                                          align-items: center;
                                          gap: 10px;
                                          border: none;
                                          border-radius: 12px;
                                          background: #ffffff;
                                          color: #23262F;
                                          padding: 12px 18px;
                                          font-size: 14px;
                                          font-weight: 700;
                                          box-shadow: 0 10px 30px rgba(0,0,0,0.14);
                                          transition: transform 0.2s ease, box-shadow 0.2s ease;
                                   }
                                   .global-verify-account-btn i {
                                          color: #ff5a67;
                                          font-size: 16px;
                                   }
                                   .global-verify-account-btn:hover {
                                          transform: translateY(-1px);
                                          box-shadow: 0 14px 32px rgba(0,0,0,0.18);
                                   }
                                   @media (max-width: 768px) {
                                          .global-verify-account-btn {
                                                 left: 12px;
                                                 bottom: 86px;
                                                 padding: 10px 14px;
                                                 font-size: 13px;
                                          }
                                   }
                            ` })
  ] }) });
}
export {
  AppLayout as A
};
