"use client";

import { useEffect, useRef, useState } from "react";
import { getStoredToken } from "@/lib/api/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { assetImage } from "@/lib/site";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost/api/v1";

type NotificationItem = {
  id: number;
  title?: string;
  image_url?: string | null;
  read_at?: string | null;
  created_at?: string;
};

export function NotificationDropdown() {
  const { openMainPath } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationToDelete, setNotificationToDelete] =
    useState<NotificationItem | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const authHeaders = () => {
    const token = getStoredToken();
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setNotifications(Array.isArray(json.data) ? json.data : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target) &&
        !target.closest(".notification")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_BASE}/notifications/read/${id}`, {
        method: "POST",
        headers: authHeaders(),
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch {
      // ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: "POST",
        headers: authHeaders(),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch {
      // ignore
    }
  };

  const confirmDeleteNotification = async () => {
    if (!notificationToDelete) return;
    try {
      await fetch(`${API_BASE}/notifications/${notificationToDelete.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationToDelete.id)
      );
      setNotificationToDelete(null);
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="notification-container" style={{ position: "relative" }}>
      <button
        type="button"
        className="notification nav-notification rounded"
        style={{
          border: "none",
          backgroundColor: "transparent",
          position: "relative",
          padding: "8px",
          paddingLeft: "0px",
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetImage("notificationIcon.svg")} alt="Notifications" />
        {unreadCount > 0 ? (
          <span
            style={{
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
              fontWeight: "bold",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="notification-popup"
          ref={notificationRef}
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            marginTop: 8,
            width: 320,
            maxWidth: "90vw",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 18px 40px rgba(15,23,42,0.14)",
            zIndex: 1100,
            overflow: "hidden",
          }}
        >
          <div className="notification-content p-3 border-bottom d-flex justify-content-between align-items-center">
            <h3
              className="m-0"
              style={{ fontSize: "1rem", color: "#23262F", fontWeight: 700 }}
            >
              {notifications.length > 0 ? "Notifications" : "No new notifications"}
            </h3>
            {notifications.length > 0 ? (
              <button
                type="button"
                className="markAsRead btn btn-link p-0 text-decoration-none"
                style={{ fontSize: "0.8rem", color: "#43ACE9", fontWeight: 600 }}
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="notification-body" style={{ maxHeight: 300, overflowY: "auto" }}>
            {loading ? (
              <p className="p-3 text-center" style={{ color: "#23262F" }}>
                Loading notifications...
              </p>
            ) : null}
            {!loading && notifications.length === 0 ? (
              <p className="p-3 text-center" style={{ color: "#23262F" }}>
                Empty
              </p>
            ) : null}
            {!loading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item p-2 border-bottom ${notification.read_at ? "opacity-50" : ""}`}
                  style={{ fontSize: "0.85rem" }}
                >
                  <div className="d-flex gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={notification.image_url || assetImage("notificationIcon.svg")}
                      alt=""
                      width={32}
                      height={32}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold" style={{ color: "#23262F" }}>
                        {notification.title}
                      </p>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                        {notification.created_at
                          ? new Date(notification.created_at).toLocaleString()
                          : ""}
                      </p>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      {!notification.read_at ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <i className="fa-solid fa-check text-success" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0"
                        onClick={() => setNotificationToDelete(notification)}
                      >
                        <i className="fa-solid fa-xmark text-danger" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="notification-footer p-2 text-center border-top">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontSize: "0.8rem", color: "#23262F", fontWeight: 600 }}
              onClick={() => openMainPath("/notifications-page")}
            >
              See All Notifications
            </button>
          </div>
        </div>
      ) : null}

      {notificationToDelete ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: "16px",
          }}
          onClick={() => setNotificationToDelete(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "360px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
              padding: "22px",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#23262F" }}>
              Delete Notification
            </h4>
            <p style={{ margin: "10px 0 0", fontSize: "0.92rem", color: "#5B6475", lineHeight: 1.6 }}>
              Are you sure you want to delete this notification?
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button
                type="button"
                onClick={() => setNotificationToDelete(null)}
                style={{
                  flex: 1,
                  border: "1px solid #D7DEEA",
                  background: "#fff",
                  color: "#23262F",
                  borderRadius: "10px",
                  padding: "11px 14px",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNotification}
                style={{
                  flex: 1,
                  border: "none",
                  background: "#23262F",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "11px 14px",
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
