import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Link, Head } from "@inertiajs/react";
import { C as CurrencyPicker } from "./CurrencyPicker-BYSFLoir.js";
const menuItems = [
  { name: "Dashboard", icon: "fa-gauge-high", route: "admin.dashboard" },
  { name: "Listings", icon: "fa-gavel", route: "admin.listings.index" },
  { name: "Bids", icon: "fa-hand-holding-dollar", route: "admin.bids.index" },
  { name: "Orders", icon: "fa-cart-shopping", route: "admin.orders.index" },
  { type: "divider", label: "Verifications" },
  { name: "Listings Approval", icon: "fa-clipboard-check", route: "admin.verifications.auctions.index" },
  { name: "Individual", icon: "fa-user-check", route: "admin.verifications.individual.index" },
  { name: "Corporate", icon: "fa-building-circle-check", route: "admin.verifications.corporate.index" },
  { name: "Vehicles", icon: "fa-car-side", route: "admin.verifications.vehicle.index" },
  { name: "Properties", icon: "fa-house-circle-check", route: "admin.verifications.property.index" },
  { type: "divider", label: "Management" },
  { name: "Users", icon: "fa-users", route: "admin.users.index" },
  { name: "Payments", icon: "fa-money-bill-transfer", route: "admin.payment-requests.index" },
  { name: "Categories", icon: "fa-layer-group", route: "admin.categories.index" },
  { name: "Dynamic Fields", icon: "fa-wand-magic-sparkles", route: "admin.dynamic-fields.index" },
  { name: "Blogs", icon: "fa-newspaper", route: "admin.blogs.index" },
  { type: "divider", label: "Site Content" },
  { name: "Sliders", icon: "fa-images", route: "admin.sliders.index" },
  { name: "FAQs", icon: "fa-circle-question", route: "admin.faqs.index" },
  { type: "divider", label: "System" },
  { name: "General Settings", icon: "fa-gears", route: "admin.master-settings.index" },
  { name: "Currencies", icon: "fa-money-bill-wave", route: "admin.master-settings.index" },
  { name: "Locations", icon: "fa-location-dot", route: "admin.locations.index" },
  { type: "divider", label: "Tools" },
  { name: "SEO", icon: "fa-magnifying-glass-chart", route: "admin.seo.index" },
  { name: "Bidder Messaging", icon: "fa-message", route: "admin.bidder-communication.index" },
  { name: "CRM (Outreach)", icon: "fa-people-arrows", route: "admin.crm.index" },
  { name: "Email Logs", icon: "fa-envelope-open-text", route: "admin.email-logs.index" },
  { name: "Roles & Permissions", icon: "fa-user-shield", route: "admin.roles.index" }
];
function AdminSidebar({ isOpen, setIsOpen }) {
  const { url } = usePage();
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `fixed left-0 top-0 h-screen bg-white border-right border-gray-200 z-40 transition-all duration-300 shadow-xl ${isOpen ? "w-64" : "w-20"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 flex items-center justify-center border-bottom border-gray-100 px-4", children: /* @__PURE__ */ jsx(Link, { href: route("admin.dashboard"), className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/header-logo.png", alt: "Logo", className: `${isOpen ? "h-10" : "h-8"} transition-all` }) }) }),
        /* @__PURE__ */ jsx("nav", { className: "p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar", children: menuItems.map((item, index) => {
          if (item.type === "divider") {
            return isOpen ? /* @__PURE__ */ jsx("div", { className: "px-3 pt-4 pb-1", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider", children: item.label }) }, index) : /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-100 my-4 mx-2" }, index);
          }
          const isActive = item.route && (route().current(item.route) || url.startsWith(route(item.route).split("?")[0]));
          return /* @__PURE__ */ jsxs(
            Link,
            {
              href: item.route ? route(item.route) : "#",
              className: `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${isActive ? "bg-black text-white shadow-lg shadow-black/20" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center transition-all ${isOpen ? "w-6" : "w-full"}`, children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${item.icon} ${isOpen ? "text-sm" : "text-lg"}` }) }),
                isOpen && /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold truncate", children: item.name }),
                !isOpen && /* @__PURE__ */ jsx("div", { className: "absolute left-full ml-4 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50", children: item.name })
              ]
            },
            index
          );
        }) }),
        /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
          __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
            `
        } })
      ]
    }
  );
}
function AdminLayout({ children, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { auth } = usePage().props;
  const user = auth?.user;
  return /* @__PURE__ */ jsxs("div", { className: "admin-layout flex min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Head, { title: `Admin - ${title}` }),
    /* @__PURE__ */ jsx(AdminSidebar, { isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }),
    /* @__PURE__ */ jsxs("div", { className: `flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`, children: [
      /* @__PURE__ */ jsxs("header", { className: "h-16 bg-white border-bottom border-gray-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsSidebarOpen(!isSidebarOpen),
            className: "p-2 hover:bg-gray-100 rounded-lg text-gray-500",
            children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${isSidebarOpen ? "fa-indent" : "fa-outdent"} fs-5` })
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx(CurrencyPicker, {}),
          /* @__PURE__ */ jsx("div", { className: "relative group", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100", children: [
            user?.profile_pic ? /* @__PURE__ */ jsx("img", { src: user.profile_pic, alt: "Admin", className: "w-8 h-8 rounded-full border border-gray-200" }) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm", children: user?.name?.charAt(0) || "A" }),
            /* @__PURE__ */ jsxs("div", { className: "text-left hidden md:block px-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-900 leading-none", children: user?.name || "Admin" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 mt-1 uppercase tracking-tighter font-semibold", children: user?.role || "Administrator" })
            ] }),
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-down text-[10px] text-gray-400 ms-1 me-1" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "p-6", children })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .admin-layout .bg-primary { background-color: #000; }
                .admin-layout .text-primary { color: #000; }
                .admin-layout .border-primary { border-color: #000; }
            `
    } })
  ] });
}
export {
  AdminLayout as A
};
