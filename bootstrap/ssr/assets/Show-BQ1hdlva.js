import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useMemo } from "react";
import { usePage, Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { A as AppLayout } from "./AppLayout-D5kT_nGG.js";
import { g as getSelectedCurrency, c as convertPKRTo, P as Price, a as convertToPKR } from "./Price-DkWoIW3k.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import { u as useCurrencyList } from "./useCurrencyList-Ce5tJXO9.js";
/* empty css              */
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "react-loader-spinner";
import "sweetalert2";
function Show({ buyerRequest, isOwner = false, canOffer = false, myOffer = null }) {
  const { t } = useTranslate();
  const { auth, flash } = usePage().props;
  const { list } = useCurrencyList();
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState(myOffer?.message || "");
  const [busy, setBusy] = useState(false);
  const [chatBusyId, setChatBusyId] = useState(null);
  const [priceHydrated, setPriceHydrated] = useState(false);
  const selectedMeta = useMemo(() => {
    const code = getSelectedCurrency();
    return list.find((c) => c.code === code) || { code: "PKR", manual_rate_to_aed: 1 };
  }, [list]);
  React.useEffect(() => {
    if (priceHydrated || !myOffer?.price) return;
    if (!list.length && selectedMeta.code !== "PKR") return;
    const display = convertPKRTo(myOffer.price, selectedMeta);
    setOfferPrice(String(Math.round(display * 100) / 100));
    setPriceHydrated(true);
  }, [myOffer, selectedMeta, list, priceHydrated]);
  const actionsLocked = buyerRequest.status !== "open";
  const handleClose = () => {
    if (!window.confirm(t("Close this request? Sellers will no longer be able to offer."))) return;
    router.post(route("buyer-requests.close", buyerRequest.id));
  };
  const handleAccept = (offerId) => {
    if (!window.confirm(t("Accept this offer? All other offers will be disabled."))) return;
    router.post(route("buyer-requests.offers.accept", [buyerRequest.id, offerId]));
  };
  const handleReject = (offerId) => {
    router.post(route("buyer-requests.offers.reject", [buyerRequest.id, offerId]));
  };
  const handleContactSupport = (offer) => {
    const message = encodeURIComponent(
      `Hello XpertBid Support, I accepted an offer on request: ${buyerRequest.title} (Request #${buyerRequest.id}, Offer #${offer.id})`
    );
    window.open(`https://wa.me/923022113202?text=${message}`, "_blank", "noopener,noreferrer");
  };
  const handleChat = async (offer) => {
    if (!auth?.user) return;
    setChatBusyId(offer.id);
    try {
      const response = await axios.post("/chat/initiate", {
        user_id: isOwner ? offer.seller_id : buyerRequest.user_id,
        buyer_request_offer_id: offer.id
      });
      window.location.href = `/chat?conversation_id=${response.data.id}`;
    } catch (err) {
      alert(err?.response?.data?.message || t("Unable to start chat"));
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
      router.post(route("buyer-requests.offers.store", buyerRequest.id), payload, { onFinish });
    }
  };
  const withdrawOffer = () => {
    if (!myOffer?.id) return;
    if (!window.confirm(t("Withdraw your offer?"))) return;
    router.delete(route("buyer-request-offers.destroy", myOffer.id));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: buyerRequest.title, children: [
    /* @__PURE__ */ jsx(Head, { title: buyerRequest.title }),
    /* @__PURE__ */ jsx("section", { className: "details-form py-5", style: { backgroundColor: "#F9F9F9", minHeight: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "container", style: { maxWidth: 960 }, children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsxs(Link, { href: route("buyer-requests.index"), className: "button-style-3", style: { display: "inline-block" }, children: [
        "← ",
        t("My requests")
      ] }) }),
      flash?.success && /* @__PURE__ */ jsx("div", { className: "alert alert-success", children: flash.success }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white p-4 mb-4",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "badge text-capitalize mb-2",
                    style: {
                      background: "#F8F8F8",
                      color: "#23262F",
                      border: "1px solid #EDEDED",
                      borderRadius: 10,
                      fontWeight: 500
                    },
                    children: buyerRequest.status
                  }
                ),
                /* @__PURE__ */ jsx("h1", { className: "h3 fw-bold mb-2", style: { color: "#23262F" }, children: buyerRequest.title }),
                /* @__PURE__ */ jsxs("div", { className: "small mb-2", style: { color: "#606060" }, children: [
                  [
                    buyerRequest.category?.name,
                    buyerRequest.sub_category?.name || buyerRequest.subCategory?.name,
                    buyerRequest.child_category?.name || buyerRequest.childCategory?.name
                  ].filter(Boolean).join(" › ") || t("Uncategorized"),
                  buyerRequest.location_label ? ` · ${buyerRequest.location_label}` : ""
                ] }),
                buyerRequest.description && /* @__PURE__ */ jsx("p", { className: "mb-0", style: { whiteSpace: "pre-wrap", color: "#23262F" }, children: buyerRequest.description })
              ] }),
              isOwner && buyerRequest.status === "open" && /* @__PURE__ */ jsx("button", { type: "button", className: "button-style-3", onClick: handleClose, children: t("Close request") })
            ] }),
            buyerRequest.images?.length > 0 && /* @__PURE__ */ jsx("div", { className: "d-flex flex-wrap gap-2 mt-3", children: buyerRequest.images.map((img) => /* @__PURE__ */ jsx(
              "img",
              {
                src: img.url || `/${img.path}`,
                alt: "",
                style: { width: 96, height: 96, objectFit: "cover", borderRadius: 10 }
              },
              img.id
            )) })
          ]
        }
      ),
      canOffer && /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white p-4 mb-4",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "h5 fw-bold mb-3", style: { color: "#23262F" }, children: myOffer?.status === "pending" ? t("Update your offer") : t("Submit an offer") }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submitOffer, className: "row g-3 align-items-end", children: [
              /* @__PURE__ */ jsxs("div", { className: "col-md-4 form-group mb-0", children: [
                /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
                  t("Price"),
                  " (",
                  selectedMeta.code || "PKR",
                  ")"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "1",
                    step: "0.01",
                    className: "form-control verify_input",
                    value: offerPrice,
                    onChange: (e) => setOfferPrice(e.target.value),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-md-5 form-group mb-0", children: [
                /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
                  t("Message"),
                  " (",
                  t("optional"),
                  ")"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "form-control verify_input",
                    value: offerMessage,
                    onChange: (e) => setOfferMessage(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-md-3 d-flex gap-2", children: [
                /* @__PURE__ */ jsx("button", { type: "submit", className: "button-style-2 flex-grow-1", disabled: busy, children: busy ? "..." : myOffer?.status === "pending" ? t("Update") : t("Submit") }),
                myOffer?.status === "pending" && /* @__PURE__ */ jsx("button", { type: "button", className: "button-style-3", onClick: withdrawOffer, children: t("Delete") })
              ] })
            ] }),
            myOffer && myOffer.status !== "pending" && /* @__PURE__ */ jsxs("div", { className: "small mt-2 text-capitalize", style: { color: "#606060" }, children: [
              t("Your offer status"),
              ": ",
              myOffer.status
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white p-4",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsxs("h2", { className: "h5 fw-bold mb-3", style: { color: "#23262F" }, children: [
              t("Offers"),
              " (",
              buyerRequest.offers?.length || 0,
              ")"
            ] }),
            !buyerRequest.offers?.length ? /* @__PURE__ */ jsx("p", { className: "mb-0", style: { color: "#606060" }, children: t("No offers yet") }) : /* @__PURE__ */ jsx("div", { className: "d-flex flex-column gap-3", children: buyerRequest.offers.map((offer) => {
              const canDecide = isOwner && offer.status === "pending" && !actionsLocked;
              const isAccepted = offer.status === "accepted";
              const decisionDisabled = isOwner && !canDecide;
              return /* @__PURE__ */ jsx(
                "div",
                {
                  className: "p-3",
                  style: {
                    opacity: offer.status === "rejected" || offer.status === "withdrawn" ? 0.72 : 1,
                    background: isAccepted ? "#F3FAFF" : "#fff",
                    borderRadius: 12,
                    border: "1px solid #EDEDED"
                  },
                  children: /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "fw-semibold", style: { color: "#23262F" }, children: offer.seller?.name || t("Seller") }),
                      /* @__PURE__ */ jsx("div", { className: "fs-5 fw-bold", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountPKR: offer.price }) }),
                      offer.message && /* @__PURE__ */ jsx("div", { className: "small mt-1", style: { color: "#606060" }, children: offer.message }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "badge text-capitalize mt-2",
                          style: {
                            background: "#F8F8F8",
                            color: "#23262F",
                            border: "1px solid #EDEDED",
                            borderRadius: 10,
                            fontWeight: 500
                          },
                          children: offer.status
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap gap-2 align-items-start", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          className: "button-style-3",
                          disabled: chatBusyId === offer.id,
                          onClick: () => handleChat(offer),
                          children: [
                            /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comment-dots me-1" }),
                            t("Chat")
                          ]
                        }
                      ),
                      isOwner && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "button-style-2",
                            disabled: decisionDisabled,
                            onClick: () => handleAccept(offer.id),
                            children: t("Accept")
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "button-style-3",
                            disabled: decisionDisabled,
                            onClick: () => handleReject(offer.id),
                            children: t("Reject")
                          }
                        )
                      ] }),
                      isOwner && isAccepted && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          className: "button-style-2",
                          onClick: () => handleContactSupport(offer),
                          style: { backgroundColor: "#25D366", borderColor: "#25D366" },
                          children: [
                            /* @__PURE__ */ jsx("i", { className: "fa-brands fa-whatsapp me-1" }),
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
          ]
        }
      )
    ] }) })
  ] });
}
export {
  Show as default
};
