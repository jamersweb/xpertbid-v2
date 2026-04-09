import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-C9PL0wyf.js";
import { S as SuccessPopup, E as ErrorPopup } from "./ErrorPopup-VSFE5nHL.js";
import axios from "axios";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-BYSFLoir.js";
function Index({ notifications }) {
  const { url } = usePage();
  const [filter, setFilter] = useState("most-recent");
  const [localNotifications, setLocalNotifications] = useState(notifications.data);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  const deleteNotification = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await axios.delete(route("notifications.delete", id));
      setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
      setMessage("Notification deleted successfully!");
      setShowSuccess(true);
    } catch (error) {
      setMessage("Failed to delete notification.");
      setShowError(true);
    }
  };
  const markAsRead = async (id) => {
    try {
      await axios.post(route("notifications.read", id));
      setLocalNotifications((prev) => prev.map(
        (n) => n.id === id ? { ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() } : n
      ));
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };
  const markAllAsRead = () => {
    router.post(route("notifications.read_all"), {}, {
      onSuccess: () => {
        setLocalNotifications((prev) => prev.map((n) => ({ ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() })));
      }
    });
  };
  const filteredNotifications = localNotifications.filter((notification) => {
    if (filter === "unread") return !notification.read_at;
    return true;
  });
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Notifications", children: [
    /* @__PURE__ */ jsx(Head, { title: "Notifications" }),
    /* @__PURE__ */ jsx(
      SuccessPopup,
      {
        isOpen: showSuccess,
        onClose: () => setShowSuccess(false),
        message
      }
    ),
    /* @__PURE__ */ jsx(
      ErrorPopup,
      {
        isOpen: showError,
        onClose: () => setShowError(false),
        message
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "py-5 bg-light min-vh-100", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center", children: /* @__PURE__ */ jsxs("div", { className: "col-lg-10 col-xl-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx("h1", { className: "h2 fw-bold text-dark m-0", children: "Notifications" }),
        /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: markAllAsRead,
              className: "btn btn-link text-primary text-decoration-none fw-bold small",
              children: "Mark all as read"
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "form-select border-0 shadow-sm",
              style: { width: "160px" },
              value: filter,
              onChange: handleFilterChange,
              children: [
                /* @__PURE__ */ jsx("option", { value: "most-recent", children: "Most Recent" }),
                /* @__PURE__ */ jsx("option", { value: "unread", children: "Unread" })
              ]
            }
          )
        ] })
      ] }),
      filteredNotifications.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-5 bg-white rounded-3 shadow-sm border", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-bell-slash fa-3x text-muted opacity-25" }) }),
        /* @__PURE__ */ jsx("h2", { className: "h5 fw-bold text-dark", children: "No notifications found" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted", children: "You're all caught up!" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "notification-list d-flex flex-column gap-3", children: filteredNotifications.map((notification) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `notification-item p-3 border rounded-3 bg-white shadow-sm transition-all ${!notification.read_at ? "border-primary border-start border-4" : ""}`,
          onClick: () => !notification.read_at && markAsRead(notification.id),
          style: { cursor: !notification.read_at ? "pointer" : "default" },
          children: /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "notification-icon bg-light rounded-circle p-2 d-flex align-items-center justify-content-center", style: { width: "45px", height: "45px" }, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: notification.image_url || "/assets/images/message-text.svg",
                alt: "Icon",
                style: { width: "24px", height: "24px" }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-grow-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-start mb-1", children: [
                /* @__PURE__ */ jsx("p", { className: `mb-0 ${!notification.read_at ? "fw-bold text-dark" : "text-secondary"}`, children: notification.title }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    },
                    className: "btn btn-link text-muted p-0 border-0",
                    children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-2 small text-muted font-monospace", children: [
                /* @__PURE__ */ jsx("span", { children: new Date(notification.created_at).toLocaleDateString() }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: new Date(notification.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ] })
            ] })
          ] })
        },
        notification.id
      )) }),
      notifications.links && notifications.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "mt-4 d-flex justify-content-center" })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .notification-item {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .notification-item:hover {
                    transform: translateX(5px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }
                .border-primary {
                    border-color: #0d6efd !important;
                }
            `
    } })
  ] });
}
export {
  Index as default
};
