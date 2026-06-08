import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-BH44Qpoe.js";
import "@inertiajs/react";
import ChatList from "./ChatList-smROB9-O.js";
import ChatWindow from "./ChatWindow-BTPm5A84.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
function Index({ auth }) {
  const queryParams = new URLSearchParams(window.location.search);
  const initialConversationId = queryParams.get("conversation_id");
  const [selectedConversationId, setSelectedConversationId] = useState(initialConversationId ? parseInt(initialConversationId) : null);
  return /* @__PURE__ */ jsx(AppLayout, { title: "My Messages", children: /* @__PURE__ */ jsx("div", { className: "bg-gray-50 min-h-screen py-8", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6 text-gray-800", children: "My Messages" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]", children: [
      /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/3 lg:w-1/4 ${selectedConversationId ? "hidden md:block" : "block"}`, children: /* @__PURE__ */ jsx(
        ChatList,
        {
          onSelectConversation: setSelectedConversationId,
          selectedConversationId,
          currentUser: auth.user
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: `w-full md:w-2/3 lg:w-3/4 ${selectedConversationId ? "block" : "hidden md:block"}`, children: selectedConversationId ? /* @__PURE__ */ jsx(
        ChatWindow,
        {
          conversationId: selectedConversationId,
          currentUser: auth.user,
          onBack: () => setSelectedConversationId(null)
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "h-full border rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-gray-500 p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comments text-3xl text-blue-500" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-700", children: "Select a conversation" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "Choose a chat from the left to start messaging" })
      ] }) })
    ] })
  ] }) }) });
}
export {
  Index as default
};
