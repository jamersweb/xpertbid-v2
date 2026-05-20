import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Head } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-CHif9vZp.js";
import ChatList from "./ChatList-smROB9-O.js";
import ChatWindow from "./ChatWindow-BTPm5A84.js";
import axios from "axios";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "./Price-CF5NSPt0.js";
function AdminChatIndex() {
  const { auth } = usePage().props;
  const queryParams = new URLSearchParams(window.location.search);
  const initialConversationId = queryParams.get("conversation_id");
  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversationId ? parseInt(initialConversationId, 10) : null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  useEffect(() => {
    const loadUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(route("admin.bidder-communication.search-users", { q: searchTerm }));
        setSearchResults(response.data || []);
      } catch (error) {
        setSearchResults([]);
      }
    };
    const timer = setTimeout(loadUsers, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Chat", children: [
    /* @__PURE__ */ jsx(Head, { title: "Admin Chat" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-50 min-h-[calc(100vh-110px)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6 text-gray-800", children: "Chat Inbox" }),
      /* @__PURE__ */ jsx("div", { className: "mb-4 bg-white rounded-xl border border-gray-200 p-3", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 items-center", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "Search user (name, email, phone)",
            className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedParticipantId || "",
            onChange: (e) => {
              const next = e.target.value ? Number(e.target.value) : null;
              setSelectedParticipantId(next);
              setSelectedConversationId(null);
            },
            className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Users Conversations" }),
              searchResults.map((user) => /* @__PURE__ */ jsxs("option", { value: user.id, children: [
                user.name,
                " (",
                user.email || user.phone || `ID ${user.id}`,
                ")"
              ] }, user.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelectedParticipantId(null);
              setSearchTerm("");
              setSearchResults([]);
              setSelectedConversationId(null);
            },
            className: "w-full md:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold",
            children: "Reset Filter"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row gap-6 h-[calc(100vh-220px)] min-h-[620px]", children: [
        /* @__PURE__ */ jsx("div", { className: `w-full xl:w-[360px] ${selectedConversationId ? "hidden xl:block" : "block"}`, children: /* @__PURE__ */ jsx(
          ChatList,
          {
            onSelectConversation: setSelectedConversationId,
            selectedConversationId,
            currentUser: auth.user,
            isAdminView: true,
            participantId: selectedParticipantId
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: `w-full flex-1 ${selectedConversationId ? "block" : "hidden xl:block"}`, children: selectedConversationId ? /* @__PURE__ */ jsx(
          ChatWindow,
          {
            conversationId: selectedConversationId,
            currentUser: auth.user,
            onBack: () => setSelectedConversationId(null),
            isAdminView: true
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "h-full border rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-gray-500 p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comments text-3xl text-blue-500" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-700", children: "Select a conversation" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "Choose a chat from the list to start messaging" })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  AdminChatIndex as default
};
