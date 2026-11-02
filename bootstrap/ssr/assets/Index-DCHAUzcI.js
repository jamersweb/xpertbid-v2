import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppLayout } from "./AppLayout-DaOB_wGA.js";
import { Head } from "@inertiajs/react";
import ChatList from "./ChatList-DjtWQwPw.js";
import ChatWindow from "./ChatWindow-D6lBogm8.js";
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "./Price-7qyok_Wm.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useTranslate-AOp3QZfJ.js";
import "./useSessionKeepAlive-DtJ4OuSi.js";
function Index({ auth, openConversationId = null }) {
  const [selectedConversationId, setSelectedConversationId] = useState(
    openConversationId ? Number(openConversationId) : null
  );
  const [accessError, setAccessError] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("conversation_id")) return;
    url.searchParams.delete("conversation_id");
    const clean = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, "", clean);
  }, []);
  const handleUnauthorized = () => {
    setSelectedConversationId(null);
    setAccessError("You do not have access to that conversation.");
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "My Messages", children: [
    /* @__PURE__ */ jsx(Head, { title: "My Messages" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-50 min-h-screen py-8", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6 text-gray-800", children: "My Messages" }),
      accessError ? /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800", children: accessError }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]", children: [
        /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/3 lg:w-1/4 ${selectedConversationId ? "hidden md:block" : "block"}`, children: /* @__PURE__ */ jsx(
          ChatList,
          {
            onSelectConversation: (id) => {
              setAccessError("");
              setSelectedConversationId(id);
            },
            selectedConversationId,
            currentUser: auth.user
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: `w-full md:w-2/3 lg:w-3/4 ${selectedConversationId ? "block" : "hidden md:block"}`, children: selectedConversationId ? /* @__PURE__ */ jsx(
          ChatWindow,
          {
            conversationId: selectedConversationId,
            currentUser: auth.user,
            onBack: () => setSelectedConversationId(null),
            onUnauthorized: handleUnauthorized
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "h-full border rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-gray-500 p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comments text-3xl text-blue-500" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-700", children: "Select a conversation" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "Choose a chat from the left to start messaging" })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
