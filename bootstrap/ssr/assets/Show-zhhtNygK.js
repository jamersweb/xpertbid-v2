import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useMemo } from "react";
import { usePage, Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { HiOutlineArrowLeft, HiOutlineClipboardList, HiOutlineLocationMarker, HiOutlineCash, HiOutlineX, HiOutlinePhotograph, HiOutlineChatAlt2, HiOutlineCalendar, HiOutlineCheckCircle } from "react-icons/hi";
import { A as AppLayout } from "./AppLayout-DaOB_wGA.js";
import { g as getSelectedCurrency, a as convertPKRTo, P as Price, c as convertToPKR } from "./Price-7qyok_Wm.js";
import { u as useTranslate } from "./useTranslate-AOp3QZfJ.js";
import { u as useCurrencyList } from "./useCurrencyList-Ce5tJXO9.js";
import { c as confirmAction, a as alertAction } from "./confirmAction-Jvw1Icl9.js";
import { p as publicBuyerRequestLocation } from "./buyerRequestLocation-BvC6EylT.js";
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-DtJ4OuSi.js";
const statusClasses = (status) => {
  const map = {
    open: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    fulfilled: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    withdrawn: "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
  };
  return map[status] || map.closed;
};
const formatPostedDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(void 0, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "—";
  }
};
function stripHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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
function verificationLabel(person, role = "seller") {
  const corporateOk = ["verified", "approved"].includes(
    String(person?.corporateVerification?.status || person?.corporate_verification?.status || "").toLowerCase()
  );
  const type = person?.verification_type || (corporateOk ? "corporate" : "individual");
  if (role === "buyer") {
    return type === "corporate" ? "Verified business" : "Verified buyer";
  }
  return type === "corporate" ? "Verified business" : "Verified seller";
}
function VerifiedBadge({ title }) {
  return /* @__PURE__ */ jsx("span", { className: "inline-flex shrink-0 items-center", title, "aria-label": title, children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "10", cy: "10", r: "8", fill: "#2F80ED" }),
    /* @__PURE__ */ jsx("path", { d: "M6.8 10.2L8.9 12.3L13.3 7.9", stroke: "white", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })
  ] }) });
}
function userAvatarSrc(person) {
  const src = person?.profile_pic || person?.profile;
  if (!src) return "/assets/images/user.jpg";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${String(src).replace(/^\/+/, "")}`;
}
function Show({ buyerRequest, isOwner = false, canOffer = false, myOffer = null, offersCount: offersCountProp = null }) {
  const { t } = useTranslate();
  const { auth, flash } = usePage().props;
  const { list } = useCurrencyList();
  const [currencyTick, setCurrencyTick] = useState(0);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState(myOffer?.message || "");
  const [busy, setBusy] = useState(false);
  const [chatBusyId, setChatBusyId] = useState(null);
  const [priceHydrated, setPriceHydrated] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const selectedMeta = useMemo(() => {
    const code = getSelectedCurrency();
    return list.find((c) => c.code === code) || { code: "PKR", manual_rate_to_aed: 1 };
  }, [list, currencyTick]);
  React.useEffect(() => {
    const onCurrencyChange = () => {
      setCurrencyTick((n) => n + 1);
      setPriceHydrated(false);
    };
    window.addEventListener("xb-currency-change", onCurrencyChange);
    document.addEventListener("xb-currency-change", onCurrencyChange);
    return () => {
      window.removeEventListener("xb-currency-change", onCurrencyChange);
      document.removeEventListener("xb-currency-change", onCurrencyChange);
    };
  }, []);
  React.useEffect(() => {
    if (priceHydrated || !myOffer?.price) return;
    if (!list.length && selectedMeta.code !== "PKR") return;
    const display = convertPKRTo(myOffer.price, selectedMeta);
    setOfferPrice(String(Math.round(display * 100) / 100));
    setPriceHydrated(true);
  }, [myOffer, selectedMeta, list, priceHydrated]);
  React.useEffect(() => {
    const requestId = buyerRequest?.id;
    if (!requestId) return void 0;
    let cancelled = false;
    let debounceTimer = null;
    const refresh = () => {
      if (cancelled || busy) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (cancelled || busy) return;
        router.reload({
          only: ["buyerRequest", "myOffer", "canOffer", "offersCount", "isOwner"],
          preserveScroll: true,
          preserveState: true
        });
      }, 120);
    };
    let channelName = null;
    if (window.Echo) {
      channelName = `buyer-request.${requestId}`;
      window.Echo.private(channelName).listen(".BuyerRequestChanged", refresh);
    }
    const pollMs = window.Echo ? 12e3 : 3e3;
    const poll = setInterval(refresh, pollMs);
    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      clearInterval(poll);
      if (window.Echo && channelName) {
        window.Echo.leave(channelName);
      }
    };
  }, [buyerRequest?.id, busy]);
  React.useEffect(() => {
    if (busy) return;
    setOfferMessage(myOffer?.message || "");
    setPriceHydrated(false);
  }, [myOffer?.id, myOffer?.status, myOffer?.price, myOffer?.message, busy]);
  const actionsLocked = buyerRequest.status !== "open";
  const offers = buyerRequest.offers || [];
  const offersCount = offersCountProp != null ? Number(offersCountProp) : buyerRequest.offers_count != null ? Number(buyerRequest.offers_count) : offers.length;
  const images = buyerRequest.images || [];
  const categoryLine = [
    buyerRequest.category?.name,
    buyerRequest.sub_category?.name || buyerRequest.subCategory?.name,
    buyerRequest.child_category?.name || buyerRequest.childCategory?.name
  ].filter(Boolean).join(" › ") || t("Uncategorized");
  const plainDescription = stripHtml(buyerRequest.description || "");
  const descriptionLong = plainDescription.length > 280;
  const backHref = isOwner ? route("buyer-requests.index") : route("seller.buyer-requests.browse");
  const backLabel = isOwner ? t("Back to Requests") : t("Back to Leads");
  const trackerSteps = useMemo(() => {
    const status = myOffer?.status;
    if (!myOffer) {
      return [
        { key: "submit", label: t("Offer submitted"), state: "muted" },
        { key: "review", label: t("Pending review"), state: "muted" },
        { key: "decision", label: t("Decision"), state: "muted" }
      ];
    }
    if (status === "pending") {
      return [
        { key: "submit", label: t("Offer submitted"), state: "done" },
        { key: "review", label: t("Pending review"), state: "active" },
        { key: "decision", label: t("Decision"), state: "muted" }
      ];
    }
    if (status === "accepted") {
      return [
        { key: "submit", label: t("Offer submitted"), state: "done" },
        { key: "review", label: t("Pending review"), state: "done" },
        { key: "decision", label: t("Accepted"), state: "done" }
      ];
    }
    if (status === "rejected") {
      return [
        { key: "submit", label: t("Offer submitted"), state: "done" },
        { key: "review", label: t("Pending review"), state: "done" },
        { key: "decision", label: t("Rejected"), state: "rejected" }
      ];
    }
    return [
      { key: "submit", label: t("Offer submitted"), state: "done" },
      { key: "review", label: t("Withdrawn"), state: "muted" },
      { key: "decision", label: t("Decision"), state: "muted" }
    ];
  }, [myOffer, t]);
  const handleClose = async () => {
    const ok = await confirmAction({
      title: t("Close this request?"),
      text: t("Sellers will no longer be able to offer on this request."),
      confirmText: t("Close request"),
      cancelText: t("Cancel"),
      danger: true
    });
    if (!ok) return;
    router.post(route("buyer-requests.close", buyerRequest.slug || buyerRequest));
  };
  const handleAccept = async (offerId) => {
    const ok = await confirmAction({
      title: t("Accept this offer?"),
      text: t("All other offers will be disabled after you accept."),
      confirmText: t("Accept offer"),
      cancelText: t("Cancel")
    });
    if (!ok) return;
    router.post(route("buyer-requests.offers.accept", [buyerRequest.slug || buyerRequest, offerId]));
  };
  const handleReject = async (offerId) => {
    const ok = await confirmAction({
      title: t("Reject this offer?"),
      text: t("The seller will be notified that their offer was rejected."),
      confirmText: t("Reject offer"),
      cancelText: t("Cancel"),
      danger: true
    });
    if (!ok) return;
    router.post(route("buyer-requests.offers.reject", [buyerRequest.slug || buyerRequest, offerId]));
  };
  const handleContactSupport = (offer) => {
    const message = encodeURIComponent(
      `Hello XpertBid Support, I accepted an offer on request: ${buyerRequest.title} (Request #${buyerRequest.id}, Offer #${offer.id})`
    );
    window.open(`https://wa.me/923022113202?text=${message}`, "_blank", "noopener,noreferrer");
  };
  const handleChat = async (offer) => {
    if (!auth?.user || !offer) return;
    setChatBusyId(offer.id);
    try {
      const response = await axios.post("/chat/initiate", {
        user_id: isOwner ? offer.seller_id : buyerRequest.user_id,
        buyer_request_offer_id: offer.id
      });
      window.location.href = route("chat.open", response.data.id);
    } catch (err) {
      await alertAction({
        title: t("Unable to start chat"),
        text: err?.response?.data?.message || t("Please try again in a moment."),
        icon: "error",
        confirmText: t("OK")
      });
      setChatBusyId(null);
    }
  };
  const submitOffer = (e) => {
    e.preventDefault();
    setBusy(true);
    const pricePkr = convertToPKR(offerPrice, selectedMeta);
    const payload = {
      price: pricePkr,
      message: offerMessage || null
    };
    const onFinish = () => setBusy(false);
    if (myOffer?.id && myOffer.status === "pending") {
      router.put(route("buyer-request-offers.update", myOffer.id), payload, { onFinish });
    } else {
      router.post(route("buyer-requests.offers.store", buyerRequest.slug || buyerRequest), payload, { onFinish });
    }
  };
  const withdrawOffer = async () => {
    if (!myOffer?.id) return;
    const ok = await confirmAction({
      title: t("Withdraw your offer?"),
      text: t("You can submit a new offer later while the request is still open."),
      confirmText: t("Withdraw offer"),
      cancelText: t("Cancel"),
      danger: true
    });
    if (!ok) return;
    router.delete(route("buyer-request-offers.destroy", myOffer.id));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: buyerRequest.title, children: [
    /* @__PURE__ */ jsx(Head, { title: buyerRequest.title }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 pb-24 lg:pb-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-2.5 py-4 sm:px-6 sm:py-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-2 sm:mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: backHref,
            className: "inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900",
            children: [
              /* @__PURE__ */ jsx(HiOutlineArrowLeft, { className: "h-4 w-4 shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: backLabel })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("nav", { className: "hidden flex-wrap items-center gap-1.5 text-sm text-slate-500 sm:flex", children: [
          /* @__PURE__ */ jsx(Link, { href: backHref, className: "hover:text-slate-800 transition-colors", children: t("Buyer requests") }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "max-w-xs truncate font-medium text-slate-800", children: buyerRequest.title })
        ] })
      ] }),
      flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 sm:mb-6 sm:px-4 sm:py-3", children: flash.success }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 lg:col-span-2 sm:space-y-6", children: [
          /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize sm:px-3 sm:text-xs ${statusClasses(buyerRequest.status)}`,
                  children: buyerRequest.status
                }
              ),
              isOwner && buyerRequest.status !== "fulfilled" && /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("buyer-requests.edit", buyerRequest.slug || buyerRequest),
                  className: "inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 no-underline transition hover:bg-slate-50 sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-sm",
                  children: t("Edit")
                }
              )
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "mt-2.5 text-xl font-bold tracking-tight text-gray-900 sm:mt-3 sm:text-3xl", children: buyerRequest.title }),
            buyerRequest.user && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: userAvatarSrc(buyerRequest.user),
                  alt: buyerRequest.user.name || t("Buyer"),
                  className: "h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-slate-100 object-cover",
                  onError: (e) => {
                    e.currentTarget.src = "/assets/images/user.jpg";
                  }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-semibold text-slate-900", children: buyerRequest.user.name || t("Buyer") }),
                  isUserVerified(buyerRequest.user) && /* @__PURE__ */ jsx(VerifiedBadge, { title: t(verificationLabel(buyerRequest.user, "buyer")) })
                ] }),
                isUserVerified(buyerRequest.user) && /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-sky-600", children: t(verificationLabel(buyerRequest.user, "buyer")) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1.5 text-xs text-slate-500 sm:mt-3 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-2 sm:space-y-0 sm:text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-1.5", children: [
                /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsx("span", { className: "min-w-0 break-words", children: categoryLine })
              ] }),
              publicBuyerRequestLocation(buyerRequest) && /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-1.5", children: [
                /* @__PURE__ */ jsx(HiOutlineLocationMarker, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsx("span", { className: "min-w-0 break-words", children: publicBuyerRequestLocation(buyerRequest) })
              ] }),
              buyerRequest.budget != null && Number(buyerRequest.budget) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-semibold text-slate-800", children: [
                /* @__PURE__ */ jsx(HiOutlineCash, { className: "h-3.5 w-3.5 shrink-0 text-emerald-500 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxs("span", { className: "text-slate-500 font-medium", children: [
                  t("Target budget"),
                  ":"
                ] }),
                /* @__PURE__ */ jsx(Price, { amountPKR: buyerRequest.budget })
              ] })
            ] }),
            isOwner && buyerRequest.status === "open" && /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleClose,
                className: "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700",
                children: [
                  /* @__PURE__ */ jsx(HiOutlineX, { className: "h-4 w-4" }),
                  t("Close request")
                ]
              }
            ) }),
            buyerRequest.description && /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t border-slate-100 pt-4 sm:mt-5 sm:pt-5", children: [
              /* @__PURE__ */ jsx("h2", { className: "mb-2 text-sm font-semibold text-slate-800", children: t("Description") }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `buyer-request-description prose prose-sm max-w-none text-slate-700 ${!descExpanded && descriptionLong ? "line-clamp-6" : ""}`,
                  dangerouslySetInnerHTML: { __html: buyerRequest.description }
                }
              ),
              descriptionLong && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setDescExpanded((v) => !v),
                  className: "mt-2 text-sm font-medium text-sky-600 hover:text-sky-700",
                  children: descExpanded ? t("Show less") : t("Read more")
                }
              )
            ] }),
            images.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 sm:mt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-800 sm:mb-3", children: [
                /* @__PURE__ */ jsx(HiOutlinePhotograph, { className: "h-4 w-4 text-slate-400" }),
                t("Images"),
                /* @__PURE__ */ jsxs("span", { className: "font-normal text-slate-400", children: [
                  "(",
                  images.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3", children: images.map((img) => {
                const src = img.url || `/${img.path}`;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setLightbox(src),
                    className: "group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-100 bg-slate-100",
                    children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src,
                          alt: "",
                          className: "h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" })
                    ]
                  },
                  img.id
                );
              }) })
            ] })
          ] }),
          canOffer && /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: myOffer?.status === "pending" ? t("Update your offer") : t("Submit an offer") }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-slate-500", children: [
              t("Send a competitive price and a short message to the buyer."),
              " ",
              t("Multiple sellers can offer on the same request.")
            ] }),
            offersCount > 0 && !myOffer && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium text-amber-700", children: offersCount === 1 ? t("1 other seller has already offered — you can still compete.") : t(":count other sellers have already offered — you can still compete.").replace(":count", String(offersCount)) }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submitOffer, className: "mt-5 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-slate-800", children: t("Price") }),
                /* @__PURE__ */ jsxs("div", { className: "flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600", children: selectedMeta.code || "PKR" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: "1",
                      step: "0.01",
                      className: "w-full border-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 focus:ring-0",
                      value: offerPrice,
                      onChange: (e) => setOfferPrice(e.target.value),
                      placeholder: "0",
                      required: true
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-slate-800", children: [
                  t("Message"),
                  " ",
                  /* @__PURE__ */ jsxs("span", { className: "font-normal text-slate-400", children: [
                    "(",
                    t("optional"),
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    rows: 3,
                    className: "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100",
                    value: offerMessage,
                    onChange: (e) => setOfferMessage(e.target.value),
                    placeholder: t("Explain your delivery time, condition, or why the buyer should choose you...")
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `grid gap-2 pt-1 ${myOffer?.status === "pending" ? "grid-cols-2" : "grid-cols-1"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: busy,
                        className: "inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
                        children: busy ? t("Saving...") : myOffer?.status === "pending" ? t("Update offer") : t("Submit offer")
                      }
                    ),
                    myOffer?.status === "pending" && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: withdrawOffer,
                        className: "inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700",
                        children: t("Withdraw offer")
                      }
                    )
                  ]
                }
              )
            ] }),
            myOffer && myOffer.status !== "pending" && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-slate-500", children: [
              t("Your offer status"),
              ":",
              " ",
              /* @__PURE__ */ jsx("span", { className: `ml-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(myOffer.status)}`, children: myOffer.status })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-gray-900 sm:text-lg", children: [
                t("Offers"),
                /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm font-medium text-slate-400 sm:text-base", children: [
                  "(",
                  offersCount,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: isOwner ? t("Multiple sellers can bid until you accept one.") : t("Compare competing offers before you bid.") })
            ] }),
            !offers.length ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-700", children: t("No offers yet") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: isOwner ? t("Sellers will appear here when they bid on your request.") : t("Be the first to submit an offer.") })
            ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: offers.map((offer) => {
              const canDecide = isOwner && offer.status === "pending" && !actionsLocked;
              const isAccepted = offer.status === "accepted";
              const decisionDisabled = isOwner && !canDecide;
              const isMine = !isOwner && Number(offer.seller_id ?? offer.seller?.id) === Number(auth?.user?.id);
              const canChat = isOwner || isMine;
              return /* @__PURE__ */ jsx(
                "div",
                {
                  className: `rounded-xl border p-4 transition ${isMine ? "border-amber-200 bg-amber-50/50" : isAccepted ? "border-sky-200 bg-sky-50/60" : "border-slate-100 bg-white"} ${offer.status === "rejected" || offer.status === "withdrawn" ? "opacity-70" : ""}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: userAvatarSrc(offer.seller),
                            alt: offer.seller?.name || t("Seller"),
                            className: "h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover bg-slate-100",
                            onError: (e) => {
                              e.currentTarget.src = "/assets/images/user.jpg";
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [
                            /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-slate-900", children: offer.seller?.name || t("Seller") }),
                            isMine && /* @__PURE__ */ jsx("span", { className: "inline-flex shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800", children: t("You") }),
                            isUserVerified(offer.seller) && /* @__PURE__ */ jsx(VerifiedBadge, { title: t(verificationLabel(offer.seller, "seller")) })
                          ] }),
                          isUserVerified(offer.seller) && /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-sky-600", children: t(verificationLabel(offer.seller, "seller")) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "mt-2 text-xl font-bold text-slate-900", children: /* @__PURE__ */ jsx(Price, { amountPKR: offer.price }) }),
                      offer.message && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: offer.message }),
                      /* @__PURE__ */ jsx("span", { className: `mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(offer.status)}`, children: offer.status })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                      canChat && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          disabled: chatBusyId === offer.id,
                          onClick: () => handleChat(offer),
                          className: "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60",
                          children: [
                            /* @__PURE__ */ jsx(HiOutlineChatAlt2, { className: "h-4 w-4" }),
                            chatBusyId === offer.id ? t("Opening...") : t("Chat")
                          ]
                        }
                      ),
                      isOwner && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            disabled: decisionDisabled,
                            onClick: () => handleAccept(offer.id),
                            className: "inline-flex items-center rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40",
                            children: t("Accept")
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            disabled: decisionDisabled,
                            onClick: () => handleReject(offer.id),
                            className: "inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40",
                            children: t("Reject")
                          }
                        )
                      ] }),
                      isOwner && isAccepted && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleContactSupport(offer),
                          className: "inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-95",
                          children: [
                            /* @__PURE__ */ jsx("i", { className: "fa-brands fa-whatsapp" }),
                            t("Contact Support")
                          ]
                        }
                      )
                    ] })
                  ] })
                },
                offer.id
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "space-y-4 lg:sticky lg:top-6 lg:self-start sm:space-y-6", children: [
          /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm", children: t("Request summary") }),
            /* @__PURE__ */ jsxs("dl", { className: "mt-3 space-y-2.5 sm:mt-4 sm:space-y-3", children: [
              buyerRequest.budget != null && Number(buyerRequest.budget) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
                /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-2 text-slate-500", children: [
                  /* @__PURE__ */ jsx(HiOutlineCash, { className: "h-4 w-4 text-emerald-500" }),
                  t("Target budget")
                ] }),
                /* @__PURE__ */ jsx("dd", { className: "font-semibold text-slate-900", children: /* @__PURE__ */ jsx(Price, { amountPKR: buyerRequest.budget }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
                /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-2 text-slate-500", children: [
                  /* @__PURE__ */ jsx(HiOutlineCalendar, { className: "h-4 w-4" }),
                  t("Posted")
                ] }),
                /* @__PURE__ */ jsx("dd", { className: "font-medium text-slate-900", children: formatPostedDate(buyerRequest.created_at) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
                /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-2 text-slate-500", children: [
                  /* @__PURE__ */ jsx(HiOutlineClipboardList, { className: "h-4 w-4" }),
                  t("Offers")
                ] }),
                /* @__PURE__ */ jsx("dd", { className: "font-medium text-slate-900", children: offersCount })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
                /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-2 text-slate-500", children: [
                  /* @__PURE__ */ jsx(HiOutlinePhotograph, { className: "h-4 w-4" }),
                  t("Images")
                ] }),
                /* @__PURE__ */ jsx("dd", { className: "font-medium text-slate-900", children: images.length })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
                /* @__PURE__ */ jsx("dt", { className: "text-slate-500", children: t("Status") }),
                /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(buyerRequest.status)}`, children: buyerRequest.status }) })
              ] })
            ] })
          ] }),
          (canOffer || myOffer) && /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm", children: t("Offer progress") }),
            /* @__PURE__ */ jsx("ol", { className: "relative ml-1.5 mt-3 space-y-0 border-l border-slate-200 sm:ml-2 sm:mt-4", children: trackerSteps.map((step) => {
              const done = step.state === "done";
              const active = step.state === "active";
              const rejected = step.state === "rejected";
              return /* @__PURE__ */ jsxs("li", { className: "relative pb-3.5 pl-5 last:pb-0 sm:pb-5 sm:pl-6", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `absolute -left-[9px] top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-white ${done || rejected ? rejected ? "bg-rose-500" : "bg-emerald-500" : active ? "bg-amber-400" : "bg-slate-300"}`,
                    children: (done || rejected) && /* @__PURE__ */ jsx(HiOutlineCheckCircle, { className: "h-3 w-3 text-white" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-sm font-medium leading-snug ${active ? "text-amber-700" : rejected ? "text-rose-700" : done ? "text-slate-900" : "text-slate-400"}`,
                    children: step.label
                  }
                ),
                active && /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs leading-snug text-amber-600", children: t("Waiting for buyer decision") })
              ] }, step.key);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm", children: t("Communication") }),
            myOffer ? /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2.5 sm:mt-4 sm:space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:p-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs", children: t("Your offer") }),
                  /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(myOffer.status)}`, children: myOffer.status })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-1.5 text-base font-bold text-slate-900 sm:mt-2 sm:text-lg", children: /* @__PURE__ */ jsx(Price, { amountPKR: myOffer.price }) }),
                myOffer.message && /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-sm text-slate-600", children: myOffer.message })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  disabled: chatBusyId === myOffer.id,
                  onClick: () => handleChat(myOffer),
                  className: "flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 sm:py-3",
                  children: [
                    /* @__PURE__ */ jsx(HiOutlineChatAlt2, { className: "h-5 w-5" }),
                    chatBusyId === myOffer.id ? t("Opening...") : t("Chat with Buyer")
                  ]
                }
              )
            ] }) : isOwner ? /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2.5 sm:mt-4 sm:space-y-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: offersCount ? t("Use Chat on each offer to talk with sellers.") : t("When sellers offer, you can chat with them here.") }),
              offers[0] && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  disabled: chatBusyId === offers[0].id,
                  onClick: () => handleChat(offers[0]),
                  className: "flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 sm:py-3",
                  children: [
                    /* @__PURE__ */ jsx(HiOutlineChatAlt2, { className: "h-5 w-5" }),
                    t("Chat with seller")
                  ]
                }
              )
            ] }) : canOffer ? /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-slate-500 sm:mt-4", children: t("Submit an offer first to unlock chat with the buyer.") }) : /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-slate-500 sm:mt-4", children: t("Corporate verification is required to offer and chat.") })
          ] })
        ] })
      ] })
    ] }) }),
    lightbox && /* @__PURE__ */ jsxs(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        className: "fixed inset-0 z-[1080] flex items-center justify-center bg-black/75 p-6",
        onClick: () => setLightbox(null),
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20",
              "aria-label": t("Close"),
              onClick: () => setLightbox(null),
              children: /* @__PURE__ */ jsx(HiOutlineX, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: lightbox,
              alt: "",
              className: "max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl",
              onClick: (e) => e.stopPropagation()
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
                .buyer-request-description p { margin-bottom: 0.5rem; }
                .buyer-request-description p:last-child { margin-bottom: 0; }
                .buyer-request-description ul,
                .buyer-request-description ol { padding-left: 1.25rem; margin-bottom: 0.5rem; }
                .buyer-request-description img { max-width: 100%; height: auto; border-radius: 8px; }
            ` })
  ] });
}
export {
  Show as default
};
