import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axios from "axios";
import "@inertiajs/react";
const ChatList = ({ onSelectConversation, selectedConversationId, currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5e3);
    const handleFocus = () => fetchConversations();
    window.addEventListener("focus", handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-trigger")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);
  const fetchConversations = async () => {
    try {
      const response = await axios.get(route("chat.conversations.index"));
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOptionClick = async (e, action, conversationId) => {
    e.stopPropagation();
    setActiveDropdown(null);
    try {
      if (action === "delete") {
        if (confirm("Are you sure you want to delete this chat?")) {
          await axios.delete(route("chat.conversations.destroy", conversationId));
          setConversations((prev) => prev.filter((c) => c.id !== conversationId));
          if (selectedConversationId === conversationId) onSelectConversation(null);
        }
      } else if (action === "important") {
        await axios.post(route("chat.conversations.important", conversationId));
        setConversations((prev) => prev.map(
          (c) => c.id === conversationId ? { ...c, is_important: !c.is_important } : c
        ));
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };
  const filteredConversations = conversations.filter((conv) => {
    if (filter === "Unread") return conv.unread_count > 0;
    if (filter === "Important") return conv.is_important;
    return true;
  });
  const getAssetUrl = (path, fallback = "/assets/images/user.jpg") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;
    if (path.startsWith("assets/")) return `/${path}`;
    if (path.startsWith("storage/")) return `/${path}`;
    return `/storage/${path}`;
  };
  const renderMessageStatus = (message) => {
    if (!message || message.sender_id !== currentUser.id) return null;
    return message.is_read ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check-double text-[10px]" }),
      /* @__PURE__ */ jsx("span", { children: "Seen" })
    ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check text-[10px]" }),
      /* @__PURE__ */ jsx("span", { children: message.body })
    ] });
  };
  const getLastSeen = (dateString, userId) => {
    if (!dateString) return "Offline";
    const formattedDate = dateString.includes("T") ? dateString : dateString.replace(" ", "T") + "Z";
    const date = new Date(formattedDate);
    const now = /* @__PURE__ */ new Date();
    const diff = (now - date) / 1e3;
    if (diff < 60) return "Online";
    if (diff < 3600) return `Last seen ${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `Last seen ${Math.floor(diff / 3600)}h ago`;
    return `Last seen ${date.toLocaleDateString()}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-4 border-b border-gray-100 bg-white", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800 tracking-tight", children: "INBOX" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide", children: ["All", "Unread Chats", "Important"].map((f) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setFilter(f === "Unread Chats" ? "Unread" : f),
          className: `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f || filter === "Unread" && f === "Unread Chats" ? "bg-black text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`,
          children: f
        },
        f
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto scrollbar-hide", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-gray-500 text-sm", children: "Loading..." }) : filteredConversations.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-gray-400", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comments text-2xl text-gray-400" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "No chats found" })
    ] }) : filteredConversations.map((conv) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => onSelectConversation(conv.id),
        className: `group px-4 py-3 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 relative ${selectedConversationId == conv.id ? "bg-blue-50/50" : ""}`,
        children: [
          selectedConversationId == conv.id && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-blue-600" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0 w-12 h-12", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: getAssetUrl(conv.other_user?.profile_pic),
                  alt: "User",
                  className: "w-12 h-12 rounded-full object-cover border border-gray-100",
                  onError: (e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/images/user.jpg";
                  }
                }
              ),
              conv.other_user && getLastSeen(conv.other_user.last_active_at) === "Online" && /* @__PURE__ */ jsx("span", { className: "absolute right-0.5 bottom-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline mb-0.5", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-900 truncate", children: conv.other_user?.name || "Unknown User" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 flex-shrink-0 ml-2", children: new Date(conv.updated_at).toLocaleDateString() === (/* @__PURE__ */ new Date()).toLocaleDateString() ? new Date(conv.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date(conv.updated_at).toLocaleDateString() })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 mb-1", children: getLastSeen(conv.other_user?.last_active_at) === "Online" ? /* @__PURE__ */ jsx("span", { className: "text-green-500 font-medium", children: "Online" }) : /* @__PURE__ */ jsx("span", { children: getLastSeen(conv.other_user?.last_active_at) }) }),
              conv.product && /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-gray-700 truncate mb-1", children: conv.product.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("p", { className: `text-xs truncate max-w-[85%] ${selectedConversationId == conv.id ? "text-gray-700" : "text-gray-500"}`, children: conv.last_message ? conv.last_message.type === "image" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-regular fa-image" }),
                  " Photo"
                ] }) : renderMessageStatus(conv.last_message) || /* @__PURE__ */ jsx("span", { className: "flex items-center gap-1", children: conv.last_message.body }) : /* @__PURE__ */ jsx("span", { className: "italic", children: "Start the conversation" }) }),
                /* @__PURE__ */ jsxs("div", { className: "relative dropdown-trigger", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === conv.id ? null : conv.id);
                      },
                      className: "text-gray-300 hover:text-gray-600 p-1",
                      children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-ellipsis-vertical text-xs" })
                    }
                  ),
                  activeDropdown === conv.id && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: (e) => handleOptionClick(e, "important", conv.id),
                        className: "w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("i", { className: `fa-${conv.is_important ? "solid" : "regular"} fa-star ${conv.is_important ? "text-yellow-400" : ""}` }),
                          conv.is_important ? "Unmark Important" : "Important"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: (e) => handleOptionClick(e, "delete", conv.id),
                        className: "w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("i", { className: "fa-regular fa-trash-can" }),
                          " Delete"
                        ]
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          ] })
        ]
      },
      conv.id
    )) })
  ] });
};
export {
  ChatList as default
};
