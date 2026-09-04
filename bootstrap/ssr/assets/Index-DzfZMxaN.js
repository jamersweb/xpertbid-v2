import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import ChatList from "./ChatList-smROB9-O.js";
import ChatWindow from "./ChatWindow-BTPm5A84.js";
import { E as ExportCsvButton } from "./ExportCsvButton-0i79GLe1.js";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "./Price-CF5NSPt0.js";
import "./Modal-DHAPaXZd.js";
import "@headlessui/react";
import "./TextInput-DDsS-qQQ.js";
import "./InputLabel-CE_n4Upz.js";
import "./SecondaryButton-C9TQBbBR.js";
import "sweetalert2";
function AdminChatIndex() {
  const { auth } = usePage().props;
  const queryParams = new URLSearchParams(window.location.search);
  const initialConversationId = queryParams.get("conversation_id");
  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversationId ? parseInt(initialConversationId, 10) : null
  );
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Chat", children: [
    /* @__PURE__ */ jsx(Head, { title: "Admin Chat" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-50 min-h-[calc(100vh-110px)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Chat Inbox" }),
        /* @__PURE__ */ jsx(
          ExportCsvButton,
          {
            routeName: "admin.chat.export",
            title: "Export Chat Messages",
            description: "Select a message date range to download chat messages as a CSV file."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row gap-6 h-[calc(100vh-220px)] min-h-[620px]", children: [
        /* @__PURE__ */ jsx("div", { className: `w-full xl:w-[360px] ${selectedConversationId ? "hidden xl:block" : "block"}`, children: /* @__PURE__ */ jsx(
          ChatList,
          {
            onSelectConversation: setSelectedConversationId,
            selectedConversationId,
            currentUser: auth.user,
            isAdminView: true
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
