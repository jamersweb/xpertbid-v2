import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import { useForm, Head } from "@inertiajs/react";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import axios from "axios";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
function BidderMessaging() {
  const [activeTab, setActiveTab] = useState("bidder");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [bidders, setBidders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { data, setData, post, processing, errors, reset } = useForm({
    subject: "",
    message: "",
    user_ids: [],
    direct_user_ids: []
  });
  useEffect(() => {
    if (activeTab === "bidder") {
      fetchProducts("normal");
    }
  }, [activeTab]);
  const fetchProducts = async (type) => {
    const response = await axios.get(route("admin.bidder-communication.get-products", { type }));
    setProducts(response.data);
  };
  const handleProductChange = async (productId) => {
    setSelectedProduct(productId);
    if (productId) {
      const response = await axios.get(route("admin.bidder-communication.get-bidders", { product_id: productId }));
      setBidders(response.data);
    } else {
      setBidders([]);
    }
  };
  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (val.length > 2) {
      const response = await axios.get(route("admin.bidder-communication.search-users", { q: val }));
      setSearchResults(response.data);
    } else {
      setSearchResults([]);
    }
  };
  const toggleUserSelection = (user, list) => {
    const field = list === "bidder" ? "user_ids" : "direct_user_ids";
    const currentIds = data[field];
    if (currentIds.includes(user.id)) {
      setData(field, currentIds.filter((id) => id !== user.id));
    } else {
      setData(field, [...currentIds, user.id]);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.bidder-communication.send"), {
      onSuccess: () => {
        reset();
        setSelectedUsers([]);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Bidder Communication", children: [
    /* @__PURE__ */ jsx(Head, { title: "Bidder Messaging" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 bidder-messaging-page", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-1 bg-gray-100 rounded-xl mb-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("bidder"),
              className: `flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === "bidder" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
              children: "By Auction"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("direct"),
              className: `flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === "direct" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
              children: "Direct Search"
            }
          )
        ] }),
        activeTab === "bidder" ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Select Auction" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                value: selectedProduct,
                onChange: (e) => handleProductChange(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Choose an auction..." }),
                  products.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.title }, p.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar", children: [
            bidders.map((user) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "rounded border-gray-300 text-black focus:ring-black",
                  checked: data.user_ids.includes(user.id),
                  onChange: () => toggleUserSelection(user, "bidder")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0", children: user.profile_pic && /* @__PURE__ */ jsx("img", { src: user.profile_pic, alt: "", className: "w-full h-full object-cover" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 truncate", children: user.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 truncate", children: user.email || user.phone })
              ] })
            ] }, user.id)),
            bidders.length === 0 && selectedProduct && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 text-center py-4", children: "No bidders found for this auction." })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Search Users" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "mt-1 block w-full",
                placeholder: "Name, Email or Phone...",
                value: searchTerm,
                onChange: (e) => handleSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar", children: searchResults.map((user) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "rounded border-gray-300 text-black focus:ring-black",
                checked: data.direct_user_ids.includes(user.id),
                onChange: () => toggleUserSelection(user, "direct")
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0", children: user.profile_pic && /* @__PURE__ */ jsx("img", { src: user.profile_pic, alt: "", className: "w-full h-full object-cover" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 truncate", children: user.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 truncate", children: user.email || user.phone })
            ] })
          ] }, user.id)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "subject", value: "Message Subject" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "subject",
              className: "mt-1 block w-full",
              value: data.subject,
              onChange: (e) => setData("subject", e.target.value),
              placeholder: "Enter message subject...",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.subject, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "message", value: "Message Content (HTML Supported)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "message",
              className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
              rows: "12",
              value: data.message,
              onChange: (e) => setData("message", e.target.value),
              placeholder: "Write your message here... Use {{user_name}} for personalization.",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.message, className: "mt-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-2 italic", children: "Note: For SMS delivery, HTML tags will be stripped and links will be converted to plain text format." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-4 border-top border-gray-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { className: "text-black font-bold", children: data.user_ids.length + data.direct_user_ids.length }),
            " recipients selected"
          ] }),
          /* @__PURE__ */ jsxs(PrimaryButton, { disabled: processing, children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paper-plane me-2" }),
            " Send Broadcast"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .bidder-messaging-page input,
                .bidder-messaging-page select,
                .bidder-messaging-page textarea {
                    color: #1f2937 !important;
                    background: #ffffff !important;
                    border-color: #d1d5db !important;
                }

                .bidder-messaging-page input::placeholder,
                .bidder-messaging-page textarea::placeholder {
                    color: #6b7280 !important;
                    opacity: 1 !important;
                }

                .bidder-messaging-page select {
                    appearance: auto;
                    -webkit-appearance: auto;
                    -moz-appearance: auto;
                }

                .bidder-messaging-page select option {
                    color: #1f2937 !important;
                    background: #ffffff !important;
                }

                .bidder-messaging-page label,
                .bidder-messaging-page .text-gray-800,
                .bidder-messaging-page .text-gray-500,
                .bidder-messaging-page .text-gray-400 {
                    opacity: 1 !important;
                }

                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
            `
    } })
  ] });
}
export {
  BidderMessaging as default
};
