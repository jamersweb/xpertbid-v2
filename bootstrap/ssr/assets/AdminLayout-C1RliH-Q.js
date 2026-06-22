import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Link, Head, router } from "@inertiajs/react";
import { u as useTranslate, a as useSessionKeepAlive, C as CurrencyPicker } from "./useSessionKeepAlive-BIm1aJlj.js";
const menuItems = [
  { name: "Dashboard", icon: "fa-gauge-high", route: "admin.dashboard", permission: "dashboard-list" },
  { name: "Listings", icon: "fa-gavel", route: "admin.listings.index", permission: "auction-list" },
  { name: "Live", icon: "fa-satellite-dish", route: "admin.live.index", permission: "auction-list" },
  { name: "Live Auctions", icon: "fa-tower-broadcast", route: "admin.live-auctions.index", permission: "auction-list" },
  { name: "Bids", icon: "fa-hand-holding-dollar", route: "admin.bids.index", permission: "auction-list" },
  { name: "Orders", icon: "fa-cart-shopping", route: "admin.orders.index", permission: "order-list" },
  { name: "Referral Rewards", icon: "fa-share-nodes", route: "admin.referral-rewards.index", permission: "referral-list" },
  { type: "divider", label: "Verifications" },
  { name: "Listings Approval", icon: "fa-clipboard-check", route: "admin.verifications.auctions.index", permission: "auction-verification-list" },
  { name: "Individual", icon: "fa-user-check", route: "admin.verifications.individual.index", permission: "individual-verification-list" },
  { name: "Corporate", icon: "fa-building-circle-check", route: "admin.verifications.corporate.index", permission: "corporate-verification-list" },
  // { name: 'Vehicles', icon: 'fa-car-side', route: 'admin.verifications.vehicle.index' },
  // { name: 'Properties', icon: 'fa-house-circle-check', route: 'admin.verifications.property.index' },
  { type: "divider", label: "Management" },
  { name: "Users", icon: "fa-users", route: "admin.users.index", permission: "user-list" },
  // { name: 'Payments', icon: 'fa-money-bill-transfer', route: 'admin.payment-requests.index' },
  { name: "Categories", icon: "fa-layer-group", route: "admin.categories.index", permission: "category-list" },
  { name: "Brands", icon: "fa-tags", route: "admin.brands.index", permission: "category-list" },
  { name: "Brand Pages", icon: "fa-pen-ruler", route: "admin.brand-pages.index", permission: "category-list" },
  { name: "Dynamic Fields", icon: "fa-wand-magic-sparkles", route: "admin.dynamic-fields.index", permission: "category-list" },
  { name: "Blogs", icon: "fa-newspaper", route: "admin.blogs.index", permission: "blog-list" },
  { type: "divider", label: "Site Content" },
  { name: "Sliders", icon: "fa-images", route: "admin.sliders.index", permission: "slider-list" },
  { name: "FAQs", icon: "fa-circle-question", route: "admin.faqs.index" },
  { type: "divider", label: "System" },
  { name: "General Settings", icon: "fa-gears", route: "admin.master-settings.index" },
  { name: "Languages", icon: "fa-language", route: "admin.languages.index" },
  { name: "Currencies", icon: "fa-money-bill-wave", route: "admin.currencies.index" },
  { name: "Locations", icon: "fa-location-dot", route: "admin.locations.index" },
  { type: "divider", label: "Tools" },
  { name: "Chat", icon: "fa-comments", route: "admin.chat.index" },
  { name: "SEO", icon: "fa-magnifying-glass-chart", route: "admin.seo.index", permission: "seo-list" },
  { name: "Bidder Messaging", icon: "fa-message", route: "admin.bidder-communication.index" },
  { name: "CRM (Outreach)", icon: "fa-people-arrows", route: "admin.crm.index" },
  { name: "Email Logs", icon: "fa-envelope-open-text", route: "admin.email-logs.index" },
  { name: "Roles & Permissions", icon: "fa-user-shield", route: "admin.roles.index", permission: "role-list" }
];
function AdminSidebar({ isOpen, setIsOpen }) {
  const { url, props } = usePage();
  const { t } = useTranslate();
  const role = String(props?.auth?.user?.role || "").toLowerCase();
  const permissions = new Set(props?.auth?.permissions || []);
  const isFullAdmin = ["admin", "superadmin"].includes(role);
  const canShowMenuItem = (item) => {
    if (item.type === "divider") {
      return true;
    }
    if (isFullAdmin) {
      return true;
    }
    return item.permission ? permissions.has(item.permission) : false;
  };
  const visibleMenuItems = [];
  let pendingDivider = null;
  menuItems.forEach((item) => {
    if (item.type === "divider") {
      pendingDivider = item;
      return;
    }
    if (!canShowMenuItem(item)) {
      return;
    }
    if (pendingDivider && visibleMenuItems.length > 0) {
      visibleMenuItems.push(pendingDivider);
    }
    visibleMenuItems.push(item);
    pendingDivider = null;
  });
  const homeRoute = visibleMenuItems.find((item) => item.route)?.route || "admin.dashboard";
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `fixed left-0 top-0 h-screen bg-white border-right border-gray-200 z-40 transition-all duration-300 shadow-xl ${isOpen ? "w-64" : "w-20"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 flex items-center justify-center border-bottom border-gray-100 px-4", children: /* @__PURE__ */ jsx(Link, { href: route(homeRoute), className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/header-logo.png", alt: "Logo", className: `${isOpen ? "h-10" : "h-8"} transition-all` }) }) }),
        /* @__PURE__ */ jsx("nav", { className: "p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar", children: visibleMenuItems.map((item, index) => {
          if (item.type === "divider") {
            return isOpen ? /* @__PURE__ */ jsx("div", { className: "px-3 pt-4 pb-1", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider", children: t(item.label) }) }, index) : /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-100 my-4 mx-2" }, index);
          }
          const isActive = item.route && (route().current(item.route) || url.startsWith(route(item.route).split("?")[0]));
          return /* @__PURE__ */ jsxs(
            Link,
            {
              href: item.route ? route(item.route) : "#",
              className: `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${isActive ? "bg-black text-white shadow-lg shadow-black/20" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center transition-all ${isOpen ? "w-6" : "w-full"}`, children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${item.icon} ${isOpen ? "text-sm" : "text-lg"}` }) }),
                isOpen && /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold truncate", children: t(item.name) }),
                !isOpen && /* @__PURE__ */ jsx("div", { className: "absolute left-full ml-4 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50", children: t(item.name) })
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
  const { auth, locale } = usePage().props;
  const user = auth?.user;
  const { t } = useTranslate();
  const supportedLocales = Object.entries(locale?.supported || {});
  const currentLocale = locale?.current || "en";
  const currentDirection = locale?.supported?.[currentLocale]?.direction || (currentLocale === "ur" ? "rtl" : "ltr");
  useSessionKeepAlive(Boolean(user));
  const handleLogout = () => {
    router.post(route("logout"));
  };
  const handleLocaleChange = (nextLocale) => {
    if (nextLocale === currentLocale) return;
    router.post(route("locale.update"), { locale: nextLocale }, {
      preserveScroll: true
    });
  };
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = currentLocale;
    document.documentElement.dir = currentDirection;
    document.body.classList.toggle("locale-ur", currentLocale === "ur");
    document.body.classList.toggle("locale-rtl", currentDirection === "rtl");
  }, [currentLocale, currentDirection]);
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
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "admin-language-switcher", children: /* @__PURE__ */ jsx(
            "select",
            {
              className: "admin-language-select",
              value: currentLocale,
              onChange: (e) => handleLocaleChange(e.target.value),
              "aria-label": t("Select Language"),
              children: supportedLocales.map(([code, details]) => /* @__PURE__ */ jsx("option", { value: code, children: details.native || details.name || code.toUpperCase() }, code))
            }
          ) }),
          /* @__PURE__ */ jsx(CurrencyPicker, {}),
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100", children: [
              user?.profile_pic ? /* @__PURE__ */ jsx("img", { src: user.profile_pic, alt: "Admin", className: "w-8 h-8 rounded-full border border-gray-200" }) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm", children: user?.name?.charAt(0) || "A" }),
              /* @__PURE__ */ jsxs("div", { className: "text-left hidden md:block px-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-900 leading-none", children: user?.name || "Admin" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 mt-1 uppercase tracking-tighter font-semibold", children: user?.role || "Administrator" })
              ] }),
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-down text-[10px] text-gray-400 ms-1 me-1" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-2 hidden min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg group-hover:block", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-bottom border-gray-100", children: [
                /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm fw-bold text-dark", children: user?.name || "Admin" }),
                /* @__PURE__ */ jsx("p", { className: "mb-0 text-xs text-secondary", children: user?.email || "admin@xpertbid.com" })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleLogout,
                  className: "w-100 text-start px-4 py-3 border-0 bg-white d-flex align-items-center gap-2 text-danger fw-semibold hover:bg-red-50",
                  children: [
                    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-right-from-bracket" }),
                    t("Log Out")
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "p-6", children })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .admin-layout .bg-primary { background-color: #000; }
                .admin-layout .text-primary { color: #000; }
                .admin-layout .border-primary { border-color: #000; }
                .admin-language-select {
                    height: 38px;
                    border: 1px solid #d8e0ea;
                    border-radius: 10px;
                    padding: 0 12px;
                    background: #f8fbff;
                    color: #23262f;
                    font-size: 14px;
                    font-weight: 600;
                    outline: none;
                }
            `
    } })
  ] });
}
export {
  AdminLayout as A
};
