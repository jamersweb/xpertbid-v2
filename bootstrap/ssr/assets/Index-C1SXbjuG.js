import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { HiOutlinePlus, HiOutlineSearch, HiOutlineClipboardList, HiOutlineLocationMarker, HiOutlineCash, HiOutlineCalendar, HiOutlinePencil } from "react-icons/hi";
import { A as AppLayout } from "./AppLayout-DaOB_wGA.js";
import { P as Price } from "./Price-7qyok_Wm.js";
import { u as useTranslate } from "./useTranslate-AOp3QZfJ.js";
import { p as publicBuyerRequestLocation } from "./buyerRequestLocation-BvC6EylT.js";
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./useSessionKeepAlive-DtJ4OuSi.js";
import "./useCurrencyList-Ce5tJXO9.js";
const statusPill = (status) => {
  const map = {
    open: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    fulfilled: "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
  };
  return map[status] || map.closed;
};
function stripHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function formatPostedDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(void 0, {
      day: "2-digit",
      month: "short",
      year: "2-digit"
    });
  } catch {
    return "—";
  }
}
function imageSrc(img) {
  return img?.url || (img?.path ? `/${img.path}` : "");
}
function Index({ requests = [] }) {
  const { t } = useTranslate();
  const [navFilter, setNavFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const requestIdsKey = useMemo(
    () => requests.map((r) => r.id).filter(Boolean).join(","),
    [requests]
  );
  useEffect(() => {
    let cancelled = false;
    let debounceTimer = null;
    const refresh = () => {
      if (cancelled) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (cancelled) return;
        router.reload({
          only: ["requests"],
          preserveScroll: true,
          preserveState: true
        });
      }, 150);
    };
    const ids = requestIdsKey ? requestIdsKey.split(",").map((id) => Number(id)).filter(Boolean) : [];
    if (window.Echo && ids.length) {
      ids.forEach((id) => {
        window.Echo.private(`buyer-request.${id}`).listen(".BuyerRequestChanged", refresh);
      });
    }
    const pollMs = window.Echo ? 2e4 : 5e3;
    const poll = setInterval(refresh, pollMs);
    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      clearInterval(poll);
      if (window.Echo && ids.length) {
        ids.forEach((id) => window.Echo.leave(`buyer-request.${id}`));
      }
    };
  }, [requestIdsKey]);
  const [search, setSearch] = useState("");
  const counts = useMemo(() => {
    const all = requests.length;
    const pendingOffers = requests.filter((r) => Number(r.pending_offers_count || 0) > 0).length;
    const active = requests.filter((r) => r.status === "open").length;
    const archive = requests.filter((r) => r.status === "closed" || r.status === "fulfilled").length;
    return { all, pendingOffers, active, archive };
  }, [requests]);
  const filtered = useMemo(() => {
    let list = [...requests];
    const q = search.trim().toLowerCase();
    if (navFilter === "pending") {
      list = list.filter((r) => Number(r.pending_offers_count || 0) > 0);
    } else if (navFilter === "active") {
      list = list.filter((r) => r.status === "open");
    } else if (navFilter === "archive") {
      list = list.filter((r) => r.status === "closed" || r.status === "fulfilled");
    }
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (q) {
      list = list.filter((r) => {
        const hay = [
          r.title,
          r.city,
          r.country,
          r.category?.name,
          r.sub_category?.name || r.subCategory?.name,
          stripHtml(r.description || "")
        ].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });
    }
    if (sortBy === "offers") {
      list.sort((a, b) => Number(b.offers_count || 0) - Number(a.offers_count || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
    return list;
  }, [requests, navFilter, statusFilter, sortBy, search]);
  const tabs = [
    { key: "all", label: t("All Requests"), count: counts.all },
    { key: "pending", label: t("Pending Offers"), count: counts.pendingOffers },
    { key: "active", label: t("Active Bids"), count: counts.active },
    { key: "archive", label: t("Archive / History"), count: counts.archive }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Buyer Requests"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("My Buyer Requests") }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#f7f7f5] pb-24 lg:pb-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between gap-3 sm:mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-slate-900 sm:text-2xl", children: t("My Buyer Requests") }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 hidden text-sm text-slate-600 sm:block", children: t("Track your requests, review offers, and manage open leads.") })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("buyer-requests.create"),
            className: "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-md shadow-slate-900/20 transition hover:bg-black sm:px-4",
            children: [
              /* @__PURE__ */ jsx(HiOutlinePlus, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: t("New") }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("New Request") })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:mb-8 sm:p-4", children: [
        /* @__PURE__ */ jsx("nav", { className: "grid grid-cols-2 gap-1 rounded-xl bg-slate-100/80 p-1 sm:flex sm:flex-wrap", children: tabs.map((tab) => {
          const active = navFilter === tab.key;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setNavFilter(tab.key),
              className: `inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition sm:justify-start sm:gap-2 sm:px-3.5 sm:text-sm ${active ? "bg-slate-900 text-white shadow-md shadow-slate-900/25" : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "truncate", children: tab.label }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `inline-flex min-w-[1.25rem] shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${active ? "bg-white/20 text-white" : "bg-white text-slate-600 shadow-sm"}`,
                    children: tab.count
                  }
                )
              ]
            },
            tab.key
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-col gap-2.5 border-t border-slate-100 pt-3 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx(HiOutlineSearch, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "search",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: t("Search requests..."),
                className: "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/15"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 sm:shrink-0", children: [
            /* @__PURE__ */ jsxs("label", { className: "relative block min-w-0 flex-1 sm:w-40 sm:flex-none", children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("Status") }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: statusFilter,
                  onChange: (e) => setStatusFilter(e.target.value),
                  className: "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/15",
                  children: [
                    /* @__PURE__ */ jsxs("option", { value: "all", children: [
                      t("Status"),
                      ": ",
                      t("All")
                    ] }),
                    /* @__PURE__ */ jsx("option", { value: "open", children: t("Open") }),
                    /* @__PURE__ */ jsx("option", { value: "closed", children: t("Closed") }),
                    /* @__PURE__ */ jsx("option", { value: "fulfilled", children: t("Fulfilled") })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400", children: "▾" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "relative block min-w-0 flex-1 sm:w-44 sm:flex-none", children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("Sort By") }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  className: "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/15",
                  children: [
                    /* @__PURE__ */ jsxs("option", { value: "newest", children: [
                      t("Sort By"),
                      ": ",
                      t("Newest")
                    ] }),
                    /* @__PURE__ */ jsx("option", { value: "offers", children: t("Most Offers") })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400", children: "▾" })
            ] })
          ] })
        ] })
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-slate-300/80 bg-white/90 px-4 py-14 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:px-6 sm:py-16", children: [
        /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "mx-auto h-9 w-9 text-slate-300 sm:h-10 sm:w-10" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 text-base font-bold text-gray-900 sm:text-lg", children: requests.length === 0 ? t("No requests yet") : t("No matching requests") }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-1 max-w-md text-sm text-slate-500", children: requests.length === 0 ? t("Post what you need and let sellers compete with offers.") : t("Try another filter or clear your search.") }),
        requests.length === 0 && /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("buyer-requests.create"),
            className: "mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-black",
            children: [
              /* @__PURE__ */ jsx(HiOutlinePlus, { className: "h-4 w-4" }),
              t("Create request")
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3", children: filtered.map((item) => {
        const categoryLine = [
          item.category?.name,
          item.sub_category?.name || item.subCategory?.name,
          item.child_category?.name || item.childCategory?.name
        ].filter(Boolean).join(" › ") || t("Uncategorized");
        const description = stripHtml(item.description || "");
        const thumbs = (item.images || []).slice(0, 4);
        const extraImages = Math.max(0, (item.images || []).length - 3);
        const previewThumbs = extraImages > 0 ? thumbs.slice(0, 3) : thumbs;
        const canEdit = item.status !== "fulfilled";
        return /* @__PURE__ */ jsxs(
          "article",
          {
            className: "group flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.11)] sm:p-4",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusPill(item.status)}`,
                      children: item.status
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700", children: [
                    item.offers_count || 0,
                    " ",
                    t("offers"),
                    Number(item.pending_offers_count || 0) > 0 && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-100 px-1.5 text-[10px] font-bold uppercase text-amber-700", children: item.pending_offers_count })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h2", { className: "mt-3 line-clamp-1 text-lg font-bold text-gray-900", children: item.title }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2.5 space-y-1.5 text-xs text-slate-500", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-1.5", children: [
                    /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" }),
                    /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: categoryLine })
                  ] }),
                  publicBuyerRequestLocation(item) && /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-1.5", children: [
                    /* @__PURE__ */ jsx(HiOutlineLocationMarker, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" }),
                    /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: publicBuyerRequestLocation(item) })
                  ] }),
                  item.budget != null && Number(item.budget) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-semibold text-slate-800", children: [
                    /* @__PURE__ */ jsx(HiOutlineCash, { className: "h-3.5 w-3.5 shrink-0 text-emerald-500" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-medium text-slate-500", children: [
                      t("Target"),
                      ":"
                    ] }),
                    /* @__PURE__ */ jsx(Price, { amountPKR: item.budget })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(HiOutlineCalendar, { className: "h-3.5 w-3.5 shrink-0 text-sky-500" }),
                    /* @__PURE__ */ jsx("span", { children: formatPostedDate(item.created_at) })
                  ] })
                ] }),
                description && /* @__PURE__ */ jsx("p", { className: "mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600", children: description }),
                previewThumbs.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 flex gap-2", children: previewThumbs.map((img, idx) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "relative h-14 w-14 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: imageSrc(img),
                          alt: "",
                          className: "h-full w-full object-cover"
                        }
                      ),
                      extraImages > 0 && idx === previewThumbs.length - 1 && /* @__PURE__ */ jsxs("span", { className: "absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-bold text-white", children: [
                        "+",
                        extraImages
                      ] })
                    ]
                  },
                  img.id || idx
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `mt-4 gap-2 border-t border-slate-100 pt-4 ${canEdit ? "grid grid-cols-2" : "flex"}`, children: [
                canEdit && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("buyer-requests.edit", item.slug || item),
                    className: "inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 no-underline shadow-sm transition hover:border-slate-300 hover:bg-slate-50",
                    children: [
                      /* @__PURE__ */ jsx(HiOutlinePencil, { className: "h-3.5 w-3.5" }),
                      t("Edit")
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("buyer-requests.show", item.slug || item),
                    className: "inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white no-underline shadow-md shadow-slate-900/20 transition hover:bg-black hover:text-white",
                    children: t("View Request")
                  }
                )
              ] })
            ]
          },
          item.id
        );
      }) })
    ] }) })
  ] });
}
export {
  Index as default
};
