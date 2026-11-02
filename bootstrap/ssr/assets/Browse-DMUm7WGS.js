import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { HiOutlineTrendingUp, HiOutlineCog, HiOutlineClipboardList, HiOutlineLocationMarker, HiOutlineSearch, HiOutlinePlus, HiOutlineCash, HiOutlineCalendar } from "react-icons/hi";
import { A as AppLayout } from "./AppLayout-DaOB_wGA.js";
import { P as Price } from "./Price-7qyok_Wm.js";
import { u as useTranslate } from "./useTranslate-AOp3QZfJ.js";
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./useSessionKeepAlive-DtJ4OuSi.js";
import "./useCurrencyList-Ce5tJXO9.js";
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
function isUserVerified(person) {
  if (!person) return false;
  if (person.is_verified) return true;
  if (person.verification_type) return true;
  const statuses = [
    person.corporate_verification?.status,
    person.corporateVerification?.status,
    person.individual_verification?.status,
    person.individualVerification?.status
  ];
  return statuses.some((status) => ["verified", "approved"].includes(String(status || "").toLowerCase()));
}
function verificationLabel(person) {
  const corporateOk = ["verified", "approved"].includes(
    String(person?.corporateVerification?.status || person?.corporate_verification?.status || "").toLowerCase()
  );
  const type = person?.verification_type || (corporateOk ? "corporate" : "individual");
  return type === "corporate" ? "Verified business" : "Verified buyer";
}
function userAvatarSrc(person) {
  const src = person?.profile_pic || person?.profile;
  if (!src) return "/assets/images/user.jpg";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${String(src).replace(/^\/+/, "")}`;
}
function VerifiedBadge({ title }) {
  return /* @__PURE__ */ jsx("span", { className: "inline-flex shrink-0 items-center", title, "aria-label": title, children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "h-3.5 w-3.5", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "10", cy: "10", r: "8", fill: "#2F80ED" }),
    /* @__PURE__ */ jsx("path", { d: "M6.8 10.2L8.9 12.3L13.3 7.9", stroke: "white", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })
  ] }) });
}
function Browse({
  requests = [],
  isCorporateVerified = false,
  hasPreferences = false
}) {
  const { t } = useTranslate();
  const [navFilter, setNavFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const requestIdsKey = useMemo(
    () => requests.map((r) => r.id).filter(Boolean).join(","),
    [requests]
  );
  useEffect(() => {
    if (!isCorporateVerified) return void 0;
    let cancelled = false;
    let debounceTimer = null;
    const refresh = () => {
      if (cancelled) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (cancelled) return;
        router.reload({
          only: ["requests", "isCorporateVerified", "hasPreferences"],
          preserveScroll: true,
          preserveState: true
        });
      }, 150);
    };
    const ids = requestIdsKey ? requestIdsKey.split(",").map((id) => Number(id)).filter(Boolean) : [];
    const listenIds = ids.slice(0, 40);
    if (window.Echo && listenIds.length) {
      listenIds.forEach((id) => {
        window.Echo.private(`buyer-request.${id}`).listen(".BuyerRequestChanged", refresh);
      });
    }
    const pollMs = window.Echo ? 2e4 : 5e3;
    const poll = setInterval(refresh, pollMs);
    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      clearInterval(poll);
      if (window.Echo && listenIds.length) {
        listenIds.forEach((id) => window.Echo.leave(`buyer-request.${id}`));
      }
    };
  }, [requestIdsKey, isCorporateVerified]);
  const counts = useMemo(() => {
    const all = requests.length;
    const offered = requests.filter((r) => !!r.my_offer).length;
    const available = requests.filter((r) => !r.my_offer).length;
    return { all, offered, available };
  }, [requests]);
  const filtered = useMemo(() => {
    let list = [...requests];
    const q = search.trim().toLowerCase();
    if (navFilter === "available") {
      list = list.filter((r) => !r.my_offer);
    } else if (navFilter === "offered") {
      list = list.filter((r) => !!r.my_offer);
    }
    if (q) {
      list = list.filter((r) => {
        const hay = [
          r.title,
          r.location_label,
          r.category?.name,
          r.sub_category?.name || r.subCategory?.name,
          stripHtml(r.description || "")
        ].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });
    }
    if (sortBy === "budget") {
      list.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
    return list;
  }, [requests, navFilter, sortBy, search]);
  const tabs = [
    { key: "all", label: t("All Leads"), count: counts.all },
    { key: "available", label: t("Open to offer"), count: counts.available },
    { key: "offered", label: t("My offers"), count: counts.offered }
  ];
  const spotlightLeads = useMemo(() => {
    const open = requests.filter((r) => !r.my_offer);
    const pool = open.length ? open : requests;
    return pool.slice(0, 3);
  }, [requests]);
  const scrollToLeads = (filter) => {
    if (filter) setNavFilter(filter);
    window.requestAnimationFrame(() => {
      document.getElementById("seller-leads-board")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Request leads"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("Request leads") }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#f7f7f5] pb-24 lg:pb-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8", children: [
      /* @__PURE__ */ jsxs("section", { className: "br-hero relative mb-4 overflow-hidden rounded-2xl sm:mb-8 sm:rounded-[1.75rem]", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[#1a2b4b]" }),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] bg-[#43ACE9] lg:block lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-0 opacity-[0.07]",
            style: {
              backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "18px 18px"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-6 top-1/2 hidden -translate-y-1/2 select-none text-[7.5rem] font-black leading-none tracking-tighter text-white/[0.04] lg:block lg:text-[9.5rem]", children: "XB" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr]", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative z-20 flex flex-col justify-between px-4 py-5 sm:px-8 sm:py-9 lg:px-10 lg:py-10", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#43ACE9] sm:text-[11px] sm:tracking-[0.18em]", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#43ACE9]" }),
                t("Live marketplace")
              ] }),
              /* @__PURE__ */ jsxs("h1", { className: "mt-2.5 max-w-md text-[1.45rem] font-bold leading-[1.18] tracking-tight text-white sm:mt-3 sm:text-3xl lg:text-[2.35rem] lg:leading-[1.15]", children: [
                t("Win deals from"),
                /* @__PURE__ */ jsx("span", { className: "mt-0.5 block text-[#43ACE9] sm:mt-1", children: t("buyer requests") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm text-[13px] leading-relaxed text-slate-300 sm:mt-3 sm:text-[15px]", children: t("Buyers post what they need. You bid. Best offer wins.") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-3 sm:mt-8 sm:gap-4", children: [
              isCorporateVerified && /* @__PURE__ */ jsxs("div", { className: "inline-grid max-w-full grid-cols-3 gap-2 sm:inline-flex sm:items-end sm:gap-7", children: [
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 text-center sm:text-left", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xl font-bold tabular-nums text-white sm:text-3xl", children: counts.available }),
                  /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-slate-400 sm:text-[11px]", children: t("Open to you") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "hidden h-8 w-px shrink-0 bg-white/15 sm:block" }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 text-center sm:text-left", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xl font-bold tabular-nums text-white sm:text-3xl", children: counts.offered }),
                  /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-slate-400 sm:text-[11px]", children: t("Your bids") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "hidden h-8 w-px shrink-0 bg-white/15 sm:block" }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 text-center sm:text-left", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xl font-bold tabular-nums text-white sm:text-3xl", children: counts.all }),
                  /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-slate-400 sm:text-[11px]", children: t("Total") })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-20 flex flex-col gap-2 sm:flex-row sm:flex-wrap", children: [
                isCorporateVerified && counts.available > 0 && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => scrollToLeads("available"),
                    className: "inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#43ACE9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(67,172,233,0.45)] transition hover:bg-[#35a0df] sm:w-auto",
                    children: [
                      /* @__PURE__ */ jsx(HiOutlineTrendingUp, { className: "h-4 w-4 shrink-0" }),
                      t("Browse open leads")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: "/seller/buyer-request-preferences",
                    className: "inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white no-underline transition hover:bg-white/10 sm:w-auto",
                    children: [
                      /* @__PURE__ */ jsx(HiOutlineCog, { className: "h-4 w-4 shrink-0" }),
                      hasPreferences ? t("Preferences") : t("Set preferences")
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative z-10 bg-[#43ACE9] px-4 pb-5 pt-4 sm:px-8 sm:pb-8 sm:pt-5 lg:flex lg:items-center lg:justify-end lg:bg-transparent lg:py-10 lg:pl-16 lg:pr-10 xl:pr-12 pointer-events-none lg:pointer-events-auto", children: /* @__PURE__ */ jsxs("div", { className: "relative mx-auto w-full max-w-sm pointer-events-auto lg:mx-0", children: [
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -inset-4 hidden rounded-[2rem] bg-white/10 blur-2xl lg:block" }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-1 top-2 hidden h-20 w-20 rounded-full border border-white/25 lg:block" }),
            spotlightLeads.length ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "relative isolate space-y-2 sm:space-y-2.5", children: spotlightLeads.map((item, idx) => {
                const thumb = imageSrc((item.images || [])[0]);
                const tilt = idx === 0 ? "sm:-rotate-1" : idx === 1 ? "sm:rotate-1" : "sm:-rotate-1";
                const hideOnMobile = idx === 2 ? "hidden sm:block" : "";
                return /* @__PURE__ */ jsx("div", { className: `${tilt} ${hideOnMobile}`, children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "br-hero-float",
                    style: {
                      animationDelay: `${idx * 0.4}s`,
                      animationDuration: `${5 + idx * 0.6}s`
                    },
                    children: /* @__PURE__ */ jsxs(
                      Link,
                      {
                        href: route("buyer-requests.show", item.slug || item),
                        className: "group flex items-center gap-2.5 rounded-xl border border-white/50 bg-white p-2.5 no-underline shadow-[0_10px_28px_rgba(26,43,75,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(26,43,75,0.28)] sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-[0_14px_40px_rgba(26,43,75,0.22)]",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e8f6fc] text-[#43ACE9] sm:h-12 sm:w-12 sm:rounded-xl", children: thumb ? /* @__PURE__ */ jsx("img", { src: thumb, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "h-4 w-4 sm:h-5 sm:w-5" }) }),
                          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsx("div", { className: "truncate text-[13px] font-semibold text-[#1a2b4b] transition group-hover:text-[#43ACE9] sm:text-sm", children: item.title }),
                            /* @__PURE__ */ jsxs("div", { className: "mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500 sm:gap-2 sm:text-[11px]", children: [
                              item.location_label && /* @__PURE__ */ jsxs("span", { className: "inline-flex min-w-0 items-center gap-0.5 truncate sm:gap-1", children: [
                                /* @__PURE__ */ jsx(HiOutlineLocationMarker, { className: "h-3 w-3 shrink-0 text-[#43ACE9]" }),
                                /* @__PURE__ */ jsx("span", { className: "truncate", children: item.location_label })
                              ] }),
                              item.budget != null && Number(item.budget) > 0 && /* @__PURE__ */ jsx("span", { className: "inline-flex shrink-0 font-semibold text-[#1a2b4b]", children: /* @__PURE__ */ jsx(Price, { amountPKR: item.budget }) })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-full bg-[#43ACE9]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1a7fb8]", children: t("Bid") })
                        ]
                      }
                    )
                  }
                ) }, item.id);
              }) }),
              counts.all > Math.min(spotlightLeads.length, 2) && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => scrollToLeads("all"),
                  className: "relative z-10 mt-3 w-full cursor-pointer rounded-xl border border-dashed border-white/70 bg-white/20 py-2.5 text-center text-xs font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/30 sm:hidden",
                  children: [
                    "+",
                    Math.max(0, counts.all - Math.min(spotlightLeads.length, 2)),
                    " ",
                    t("more leads below")
                  ]
                }
              ),
              counts.all > spotlightLeads.length && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => scrollToLeads("all"),
                  className: "relative z-10 mt-3.5 hidden w-full cursor-pointer rounded-xl border border-dashed border-white/70 bg-white/20 py-2.5 text-center text-xs font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/30 sm:block",
                  children: [
                    "+",
                    counts.all - spotlightLeads.length,
                    " ",
                    t("more leads below")
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-white/35 bg-white/15 p-5 text-center text-sm text-white backdrop-blur sm:p-6", children: [
              /* @__PURE__ */ jsx(HiOutlineSearch, { className: "mx-auto h-7 w-7 text-white/80 sm:h-8 sm:w-8" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2.5 font-medium sm:mt-3", children: t("No open leads yet") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-white/75", children: t("New buyer requests will appear here.") })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                        @keyframes brHeroFloat {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-5px); }
                        }
                        .br-hero-float {
                            transform-origin: center;
                        }
                        @media (min-width: 640px) {
                            .br-hero-float {
                                animation-name: brHeroFloat;
                                animation-timing-function: ease-in-out;
                                animation-iteration-count: infinite;
                            }
                        }
                        @media (prefers-reduced-motion: reduce) {
                            .br-hero-float { animation: none !important; }
                        }
                    ` }),
      !isCorporateVerified ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 shadow-sm", children: [
        t("Corporate verification is required to view and offer on buyer requests."),
        " ",
        /* @__PURE__ */ jsx(Link, { href: route("verification.identity"), className: "font-semibold underline", children: t("Verify now") })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        !hasPreferences && /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: t("Preferences are optional") }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-slate-600", children: t("You can offer on any open request right now. Preferences only help with match alerts.") })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("seller.buyer-request-preferences.edit"),
              className: "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white no-underline shadow-sm transition hover:bg-black",
              children: [
                /* @__PURE__ */ jsx(HiOutlinePlus, { className: "h-4 w-4" }),
                t("Optional setup")
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            id: "seller-leads-board",
            className: "mb-6 scroll-mt-24 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:mb-8 sm:p-4",
            children: [
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
                      placeholder: t("Search leads..."),
                      className: "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/15"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "relative block w-full sm:w-48 sm:shrink-0", children: [
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
                        /* @__PURE__ */ jsx("option", { value: "budget", children: t("Highest budget") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400", children: "▾" })
                ] })
              ] })
            ]
          }
        ),
        filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-slate-300/80 bg-white/90 px-4 py-14 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:px-6 sm:py-16", children: [
          /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "mx-auto h-9 w-9 text-slate-300 sm:h-10 sm:w-10" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-3 text-base font-bold text-gray-900 sm:text-lg", children: requests.length === 0 ? t("No open requests") : t("No matching leads") }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto mt-1 max-w-md text-sm text-slate-500", children: requests.length === 0 ? t("New buyer requests will appear here when available.") : t("Try another filter or clear your search.") })
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
          return /* @__PURE__ */ jsxs(
            "article",
            {
              className: "group flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.11)] sm:p-4",
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200", children: t("Open") }),
                    item.my_offer ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-amber-700 ring-1 ring-amber-200", children: item.my_offer.status }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600", children: t("No offer yet") })
                  ] }),
                  /* @__PURE__ */ jsx("h2", { className: "mt-3 line-clamp-1 text-lg font-bold text-gray-900", children: item.title }),
                  item.user && /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: userAvatarSrc(item.user),
                        alt: item.user.name || t("Buyer"),
                        className: "h-7 w-7 shrink-0 rounded-full border border-slate-200 bg-slate-100 object-cover",
                        onError: (e) => {
                          e.currentTarget.src = "/assets/images/user.jpg";
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "truncate text-xs font-semibold text-slate-800", children: item.user.name || t("Buyer") }),
                      isUserVerified(item.user) && /* @__PURE__ */ jsx(VerifiedBadge, { title: t(verificationLabel(item.user)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-2.5 space-y-1.5 text-xs text-slate-500", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-1.5", children: [
                      /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" }),
                      /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: categoryLine })
                    ] }),
                    item.location_label && /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-1.5", children: [
                      /* @__PURE__ */ jsx(HiOutlineLocationMarker, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" }),
                      /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: item.location_label })
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
                    ] }),
                    Number(item.offers_count || 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-medium text-slate-700", children: [
                      /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "h-3.5 w-3.5 shrink-0 text-violet-500" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        Number(item.offers_count),
                        " ",
                        Number(item.offers_count) === 1 ? t("offer so far") : t("offers so far"),
                        !item.my_offer ? ` — ${t("you can still bid")}` : ""
                      ] })
                    ] })
                  ] }),
                  description && /* @__PURE__ */ jsx("p", { className: "mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600", children: description }),
                  item.my_offer && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs font-medium text-slate-600", children: [
                    t("Your offer"),
                    ": ",
                    /* @__PURE__ */ jsx(Price, { amountPKR: item.my_offer.price })
                  ] }),
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
                /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-slate-100 pt-4", children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("buyer-requests.show", item.slug || item),
                    className: "inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white no-underline shadow-md shadow-slate-900/20 transition hover:bg-black hover:text-white",
                    children: item.my_offer ? t("View / update offer") : t("View & offer")
                  }
                ) })
              ]
            },
            item.id
          );
        }) })
      ] })
    ] }) })
  ] });
}
export {
  Browse as default
};
