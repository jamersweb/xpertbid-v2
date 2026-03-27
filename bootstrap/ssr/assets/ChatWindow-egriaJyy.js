import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";
const ChatWindow = ({ conversationId, currentUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const [otherUser, setOtherUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const fetchData = async () => {
    if (conversationId) {
      try {
        const response = await axios.get(route("chat.conversations.show", conversationId));
        const data = response.data;
        setConversation(data);
        setMessages(data.messages || []);
        const other = data.user_one_id === currentUser.id ? data.user_two : data.user_one;
        setOtherUser(other);
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };
  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      fetchData().finally(() => {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      });
      if (window.Echo) {
        window.Echo.private(`chat.${conversationId}`).listen("MessageSent", (e) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === e.message.id)) return prev;
            return [...prev, e.message];
          });
          scrollToBottom();
        });
        return () => {
          window.Echo.leave(`chat.${conversationId}`);
        };
      }
    }
  }, [conversationId]);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };
  useEffect(scrollToBottom, [messages]);
  const sendMessage = async (content, file = null) => {
    if ((!content || !content.trim()) && !file) return;
    const formData = new FormData();
    formData.append("conversation_id", conversationId);
    if (content && content.trim()) formData.append("body", content);
    if (file) formData.append("attachment", file);
    try {
      const response = await axios.post(route("chat.messages.store"), formData);
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      setAttachment(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();
    sendMessage(newMessage, attachment);
  };
  const handleOptionClick = async (action) => {
    setShowOptions(false);
    try {
      if (action === "delete") {
        if (confirm("Are you sure you want to delete this chat?")) {
          await axios.delete(route("chat.conversations.destroy", conversationId));
          if (onBack) onBack();
        }
      } else if (action === "important") {
        await axios.post(route("chat.conversations.important", conversationId));
        setConversation((prev) => ({ ...prev, is_important: !prev.is_important }));
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };
  const getAssetUrl = (path) => path ? `/storage/${path}` : "/assets/images/user.jpg";
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
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden font-sans shadow-sm w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 bg-white z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onBack,
              className: "md:hidden text-gray-500 hover:text-gray-700 p-1",
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: getAssetUrl(otherUser?.profile_pic),
                alt: otherUser?.name,
                className: "w-10 h-10 rounded-full object-cover border border-gray-100",
                onError: (e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${otherUser?.name || "User"}`;
                }
              }
            ),
            otherUser?.last_active_at && getLastSeen(otherUser.last_active_at) === "Online" && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800 text-base leading-tight", children: otherUser?.name || "Loading..." }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center text-xs text-gray-500", children: otherUser?.last_active_at && getLastSeen(otherUser.last_active_at) === "Online" ? /* @__PURE__ */ jsx("span", { className: "text-green-500 font-medium", children: "Online" }) : /* @__PURE__ */ jsx("span", { children: getLastSeen(otherUser?.last_active_at) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowOptions(!showOptions),
              className: "text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors",
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-ellipsis-vertical" })
            }
          ),
          showOptions && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleOptionClick("important"),
                className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx("i", { className: `fa-${conversation?.is_important ? "solid" : "regular"} fa-star ${conversation?.is_important ? "text-yellow-400" : ""}` }),
                  conversation?.is_important ? "Unmark Important" : "Mark Important"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleOptionClick("delete"),
                className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-regular fa-trash-can" }),
                  " Delete Chat"
                ]
              }
            )
          ] })
        ] })
      ] }),
      product && /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: getAssetUrl(product.image),
              alt: product.title,
              className: "w-10 h-10 rounded object-cover border border-gray-200"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-gray-900 truncate max-w-[200px]", children: product.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-gray-800", children: [
              "PKR ",
              Number(product.buy_now_price || product.minimum_bid || 0).toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("product.show", product.slug || product.id),
            className: "bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap",
            children: "View Ad"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: messagesEndRef,
        className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 scrollbar-hide",
        children: loading && messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-full text-gray-500 text-sm", children: "Loading..." }) : messages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-400", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-blue-50 p-6 rounded-full mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-paper-plane text-4xl text-blue-400" }) }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-600", children: "No messages yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Send a message to start the conversation" })
        ] }) : messages.map((msg, index) => {
          const isMe = msg.sender_id === currentUser.id;
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: `flex ${isMe ? "justify-end" : "justify-start"}`,
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"}`,
                  children: [
                    msg.type === "image" && /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: `/storage/${msg.attachment_path}`,
                        alt: "Attachment",
                        className: "rounded-lg max-h-60 object-cover w-full"
                      }
                    ) }),
                    /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap break-words leading-relaxed", children: msg.body }),
                    /* @__PURE__ */ jsxs("div", { className: `text-[10px] mt-1 flex items-center ${isMe ? "justify-end text-blue-100" : "text-gray-400"}`, children: [
                      new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      isMe && /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check-double ml-1 text-[10px]" })
                    ] })
                  ]
                }
              )
            },
            msg.id || index
          );
        })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border-t border-gray-200", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-100", children: [
        "Hello",
        "Is it available?",
        "Okay",
        "No problem",
        "What's the condition?",
        "Price negotiable?"
      ].map((text) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => sendMessage(text),
          className: "px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 whitespace-nowrap transition-colors",
          children: text
        },
        text
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
        attachment && /* @__PURE__ */ jsxs("div", { className: "mb-2 px-3 py-2 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paperclip text-gray-400" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 truncate max-w-[200px]", children: attachment.name })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setAttachment(null),
              className: "text-gray-400 hover:text-red-500 transition-colors",
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSend, className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paperclip text-lg" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                className: "hidden",
                accept: "image/*",
                onChange: (e) => setAttachment(e.target.files[0])
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 bg-gray-100 rounded-lg flex items-center px-4 py-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:bg-white transition-all", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: newMessage,
              onChange: (e) => setNewMessage(e.target.value),
              placeholder: "Type a message...",
              className: "flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500 text-sm p-1 leading-6 w-full",
              style: { outline: "none", boxShadow: "none" }
            }
          ) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: !newMessage.trim() && !attachment,
              className: `p-2 rounded-full flex items-center justify-center transition-all ${!newMessage.trim() && !attachment ? "text-gray-300" : "text-blue-600 hover:bg-blue-50"}`,
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paper-plane text-xl" })
            }
          )
        ] })
      ] })
    ] })
  ] });
};
export {
  ChatWindow as default
};
