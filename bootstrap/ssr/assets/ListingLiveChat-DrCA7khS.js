import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { usePage, Link } from "@inertiajs/react";
function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
}
function ListingLiveChat({ listingId, listingSlug }) {
  const { auth } = usePage().props;
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);
  const mergeMessage = useCallback((msg) => {
    if (!msg?.id) return;
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);
  const fetchMessages = useCallback(async ({ silent = false } = {}) => {
    try {
      const { data } = await axios.get(route("live-chat.listing.messages.index", listingSlug));
      const list = Array.isArray(data?.messages) ? data.messages : [];
      setMessages(list);
      setError("");
    } catch (e) {
      if (!silent) {
        setError("Could not load chat.");
      }
    } finally {
      setLoading(false);
    }
  }, [listingSlug]);
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  useEffect(() => {
    if (!auth?.user || !window.Echo) {
      return void 0;
    }
    const channel = window.Echo.private(`listing-live-chat.${listingId}`);
    channel.listen(".ListingLiveChatMessageSent", (payload) => {
      mergeMessage(payload);
    });
    return () => {
      window.Echo.leave(`listing-live-chat.${listingId}`);
    };
  }, [auth?.user, listingId, mergeMessage]);
  useEffect(() => {
    const t = setInterval(() => {
      fetchMessages({ silent: true });
    }, window.Echo ? 5e3 : 2500);
    return () => clearInterval(t);
  }, [fetchMessages]);
  const send = async (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || !auth?.user) return;
    setSending(true);
    setError("");
    try {
      const { data } = await axios.post(route("live-chat.listing.messages.store", listingSlug), { body: text });
      mergeMessage(data);
      setBody("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.body?.[0] || "Could not send message.";
      setError(Array.isArray(msg) ? msg.join(" ") : msg);
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "xb-listing-live-chat d-flex flex-column border rounded-3 bg-white shadow-sm overflow-hidden",
      style: { height: "min(55vh, 520px)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 border-bottom bg-light d-flex align-items-center justify-content-between", children: [
          /* @__PURE__ */ jsx("span", { className: "small fw-bold text-uppercase text-muted mb-0", children: "Live chat" }),
          /* @__PURE__ */ jsx("span", { className: "badge bg-secondary bg-opacity-25 text-dark border-0", children: "XpertBid" })
        ] }),
        /* @__PURE__ */ jsx("div", { ref: listRef, className: "flex-grow-1 overflow-auto px-3 py-2", style: { minHeight: 0 }, children: loading ? /* @__PURE__ */ jsx("p", { className: "text-muted small mb-0", children: "Loading…" }) : messages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted small mb-0", children: "No messages yet. Say hello." }) : messages.map((m) => /* @__PURE__ */ jsxs("div", { className: "mb-2 pb-2 border-bottom border-light", children: [
          /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "small fw-semibold text-dark", children: m.user?.name || "User" }),
            /* @__PURE__ */ jsx("span", { className: "small text-muted", children: formatTime(m.created_at) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "small text-break text-body mt-1", children: m.body })
        ] }, m.id)) }),
        error ? /* @__PURE__ */ jsx("div", { className: "px-3 py-1 small text-danger border-top", children: error }) : null,
        /* @__PURE__ */ jsx("form", { onSubmit: send, className: "p-2 border-top bg-light", children: auth?.user ? /* @__PURE__ */ jsxs("div", { className: "d-flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "form-control form-control-sm",
              placeholder: "Write a message…",
              value: body,
              maxLength: 1e3,
              onChange: (e) => setBody(e.target.value),
              disabled: sending
            }
          ),
          /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-sm btn-dark px-3", disabled: sending || !body.trim(), children: [
            sending ? /* @__PURE__ */ jsx("i", { className: "fa-solid fa-spinner fa-spin", "aria-hidden": "true" }) : /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paper-plane", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { className: "visually-hidden", children: sending ? "Sending" : "Send" })
          ] })
        ] }) : /* @__PURE__ */ jsxs("p", { className: "small text-muted mb-0", children: [
          /* @__PURE__ */ jsx(Link, { href: route("login"), children: "Sign in" }),
          " to join the live chat. Messages update every few seconds for guests."
        ] }) })
      ]
    }
  );
}
export {
  ListingLiveChat as L
};
