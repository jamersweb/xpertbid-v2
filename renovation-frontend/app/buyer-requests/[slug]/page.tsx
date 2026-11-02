"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import ConfirmModal from "@/components/buyer-requests/ConfirmModal";
import {
  BrStyles,
  PublicIdentityRow,
  VerifiedBadge,
  categoryLine,
  formatPostedDate,
  isPublicIdentityVerified,
  publicIdentityAvatarSrc,
  publicBuyerRequestLocation,
  publicIdentityLabel,
  statusPill,
  stripHtml,
} from "@/components/buyer-requests/BrUi";
import {
  acceptOffer,
  closeBuyerRequest,
  getBuyerRequest,
  rejectOffer,
  submitOffer,
  updateOffer,
  withdrawOffer,
  type BuyerRequestItem,
  type BuyerRequestOffer,
} from "@/lib/api/buyerRequests";
import { initiateChat } from "@/lib/api/chat";

type ConfirmState =
  | { type: "close" }
  | { type: "accept"; offerId: number }
  | { type: "reject"; offerId: number }
  | { type: "withdraw"; offerId: number }
  | null;

function offerPill(status: string) {
  const map: Record<string, { bg: string; color: string; ring: string }> = {
    pending: { bg: "#fffbeb", color: "#b45309", ring: "#fde68a" },
    accepted: { bg: "#ecfdf5", color: "#047857", ring: "#a7f3d0" },
    rejected: { bg: "#fff1f2", color: "#be123c", ring: "#fecdd3" },
    withdrawn: { bg: "#f1f5f9", color: "#475569", ring: "#e2e8f0" },
  };
  return map[status] || map.withdrawn;
}

function trackerSteps(myOffer: BuyerRequestOffer | null | undefined) {
  const status = myOffer?.status;
  if (!myOffer) {
    return [
      { key: "submit", label: "Offer submitted", state: "muted" as const },
      { key: "review", label: "Pending review", state: "muted" as const },
      { key: "decision", label: "Decision", state: "muted" as const },
    ];
  }
  if (status === "pending") {
    return [
      { key: "submit", label: "Offer submitted", state: "done" as const },
      { key: "review", label: "Pending review", state: "active" as const },
      { key: "decision", label: "Decision", state: "muted" as const },
    ];
  }
  if (status === "accepted") {
    return [
      { key: "submit", label: "Offer submitted", state: "done" as const },
      { key: "review", label: "Pending review", state: "done" as const },
      { key: "decision", label: "Accepted", state: "done" as const },
    ];
  }
  if (status === "rejected") {
    return [
      { key: "submit", label: "Offer submitted", state: "done" as const },
      { key: "review", label: "Pending review", state: "done" as const },
      { key: "decision", label: "Rejected", state: "rejected" as const },
    ];
  }
  return [
    { key: "submit", label: "Offer submitted", state: "done" as const },
    { key: "review", label: "Withdrawn", state: "muted" as const },
    { key: "decision", label: "Decision", state: "muted" as const },
  ];
}

export default function BuyerRequestShowPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const { user, loading: authLoading, openMainPath } = useAuth();
  const { openLogin } = useAuthModal();
  const [item, setItem] = useState<BuyerRequestItem | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [chatBusyId, setChatBusyId] = useState<number | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const isOwner = useMemo(
    () => Boolean(user && item?.user?.id && Number(user.id) === Number(item.user.id)),
    [user, item]
  );

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError("");
    try {
      const json = await getBuyerRequest(slug);
      const data = json?.data || json;
      setItem(data);
      if (data?.my_offer?.price != null) {
        setPrice(String(Math.round(Number(data.my_offer.price))));
      }
      if (data?.my_offer?.message) {
        setMessage(String(data.my_offer.message));
      }
    } catch (e) {
      setError((e as Error).message || "Failed to load request");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, user, load]);

  const plainDescription = stripHtml(item?.description || "");
  const descriptionLong = plainDescription.length > 280;
  const offers: BuyerRequestOffer[] = item?.offers || [];
  const offersCount = item?.offers_count != null ? Number(item.offers_count) : offers.length;
  const images = item?.images || [];
  const myOffer = useMemo(() => {
    if (item?.my_offer) return item.my_offer;
    if (!user || isOwner) return null;
    return (
      offers.find((o) => o.seller?.id && Number(o.seller.id) === Number(user.id)) || null
    );
  }, [item?.my_offer, offers, user, isOwner]);
  const canOffer = !isOwner && item?.status === "open";
  const actionsLocked = item?.status !== "open";
  const backHref = isOwner ? "/buyer-requests" : "/seller/buyer-requests";
  const backLabel = isOwner ? "Back to Requests" : "Back to Leads";
  const steps = trackerSteps(myOffer);
  const pill = item ? statusPill(item.status) : statusPill("closed");

  const openOfferChat = async (offer: BuyerRequestOffer) => {
    if (!item || !user) return;
    const otherUserId = isOwner
      ? Number(offer.seller?.id || 0)
      : Number(item.user?.id || 0);
    if (!otherUserId) {
      setError("Unable to start chat — missing user.");
      return;
    }

    setChatBusyId(offer.id);
    setError("");
    try {
      const conversation = await initiateChat({
        user_id: otherUserId,
        buyer_request_offer_id: offer.id,
      });
      await openMainPath(`/chat/open/${conversation.id}`);
    } catch (err) {
      setError((err as Error).message || "Unable to start chat");
      setChatBusyId(null);
    }
  };

  const onOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openLogin();
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (myOffer?.id && myOffer.status === "pending") {
        await updateOffer(myOffer.id, { price: Number(price), message: message || undefined });
      } else {
        await submitOffer(slug, { price: Number(price), message: message || undefined });
      }
      await load();
    } catch (err) {
      setError((err as Error).message || "Offer failed");
    } finally {
      setBusy(false);
    }
  };

  const runConfirmedAction = async () => {
    if (!confirm) return;
    setBusy(true);
    setError("");
    try {
      if (confirm.type === "close") {
        await closeBuyerRequest(slug);
      } else if (confirm.type === "accept") {
        await acceptOffer(slug, confirm.offerId);
      } else if (confirm.type === "reject") {
        await rejectOffer(slug, confirm.offerId);
      } else if (confirm.type === "withdraw") {
        await withdrawOffer(confirm.offerId);
      }
      setConfirm(null);
      await load();
    } catch (err) {
      setError((err as Error).message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const confirmCopy = (() => {
    if (!confirm) return null;
    if (confirm.type === "close") {
      return {
        title: "Close this request?",
        message: "Sellers will no longer be able to offer on this request.",
        confirmLabel: "Close request",
        danger: true,
      };
    }
    if (confirm.type === "accept") {
      return {
        title: "Accept this offer?",
        message: "All other offers will be disabled after you accept.",
        confirmLabel: "Accept offer",
        danger: false,
      };
    }
    if (confirm.type === "withdraw") {
      return {
        title: "Withdraw your offer?",
        message: "You can submit a new offer later while the request is still open.",
        confirmLabel: "Withdraw offer",
        danger: true,
      };
    }
    return {
      title: "Reject this offer?",
      message: "The seller will be notified that their offer was rejected.",
      confirmLabel: "Reject offer",
      danger: true,
    };
  })();

  if (authLoading || loading) {
    return (
      <main className="br-page">
        <div className="br-page__inner">Loading…</div>
        <BrStyles />
        <ShowStyles />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="br-page">
        <div className="br-page__inner">
          <div className="br-empty text-center">
            <p className="br-sub mb-3">Log in to view this buyer request.</p>
            <button type="button" className="br-btn br-btn--dark" onClick={openLogin}>
              Log in
            </button>
          </div>
        </div>
        <BrStyles />
        <ShowStyles />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="br-page">
        <div className="br-page__inner">
          <div className="br-alert br-alert--danger">{error || "Request not found"}</div>
          <Link href="/seller/buyer-requests" className="br-btn br-btn--outline">
            Back to leads
          </Link>
        </div>
        <BrStyles />
        <ShowStyles />
      </main>
    );
  }

  return (
    <main className="br-page">
      <div className="br-page__inner">
        <div className="br-show__top">
          <Link href={backHref} className="br-show__back">
            <i className="fa-solid fa-arrow-left" aria-hidden />
            {backLabel}
          </Link>
          <nav className="br-show__crumb d-none d-sm-flex">
            <Link href={backHref}>Buyer requests</Link>
            <span>/</span>
            <span className="br-show__crumb-current">{item.title}</span>
          </nav>
        </div>

        {error ? <div className="br-alert br-alert--danger">{error}</div> : null}

        <div className="br-show__grid">
          <div className="br-show__main">
            <section className="br-show__card">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <span
                  className="br-pill"
                  style={{
                    background: pill.bg,
                    color: pill.color,
                    boxShadow: `inset 0 0 0 1px ${pill.ring}`,
                  }}
                >
                  {item.status}
                </span>
                {isOwner && item.status !== "fulfilled" ? (
                  <Link
                    href={`/buyer-requests/${item.slug}/edit`}
                    className="br-btn br-btn--outline"
                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
                  >
                    Edit
                  </Link>
                ) : null}
              </div>

              <h1 className="br-show__title">{item.title}</h1>

              <PublicIdentityRow person={item.user} role="buyer" />

              <div className="br-show__meta">
                <div className="br-meta__row">
                  <i className="fa-solid fa-clipboard-list" aria-hidden />
                  <span>{categoryLine(item)}</span>
                </div>
                {publicBuyerRequestLocation(item) ? (
                  <div className="br-meta__row">
                    <i className="fa-solid fa-location-dot" aria-hidden />
                    <span>{publicBuyerRequestLocation(item)}</span>
                  </div>
                ) : null}
                {item.budget != null && Number(item.budget) > 0 ? (
                  <div className="br-meta__row br-meta__row--strong">
                    <i className="fa-solid fa-coins" aria-hidden />
                    <span>
                      <span className="br-show__budget-label">Target budget:</span>{" "}
                      {Number(item.budget).toLocaleString()} PKR
                    </span>
                  </div>
                ) : null}
              </div>

              {isOwner && item.status === "open" ? (
                <div className="mt-3">
                  <button
                    type="button"
                    className="br-btn br-btn--outline"
                    disabled={busy}
                    onClick={() => setConfirm({ type: "close" })}
                  >
                    <i className="fa-solid fa-xmark" aria-hidden />
                    Close request
                  </button>
                </div>
              ) : null}

              {plainDescription ? (
                <div className="br-show__desc">
                  <h2>Description</h2>
                  <p className={!descExpanded && descriptionLong ? "is-clamped" : ""}>
                    {plainDescription}
                  </p>
                  {descriptionLong ? (
                    <button
                      type="button"
                      className="br-show__more"
                      onClick={() => setDescExpanded((v) => !v)}
                    >
                      {descExpanded ? "Show less" : "Read more"}
                    </button>
                  ) : null}
                </div>
              ) : null}

              {images.length > 0 ? (
                <div className="br-show__images">
                  <div className="br-show__images-head">
                    <i className="fa-regular fa-image" aria-hidden />
                    Images <span>({images.length})</span>
                  </div>
                  <div className="br-show__images-grid">
                    {images.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        className="br-show__img"
                        onClick={() => setLightbox(img.url)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            {canOffer ? (
              <section className="br-show__card">
                <h2 className="br-show__aside-title">
                  {myOffer?.status === "pending" ? "Update your offer" : "Submit an offer"}
                </h2>
                <p className="br-sub">
                  Send a competitive price and a short message to the buyer. Multiple sellers can
                  offer on the same request.
                </p>
                {/corporate/i.test(error) ? (
                  <button
                    type="button"
                    className="br-link mb-2"
                    onClick={() => void openMainPath("/identity-verification")}
                  >
                    Complete corporate verification
                  </button>
                ) : null}
                <form onSubmit={onOffer} className="br-show__form">
                  <label>
                    <span>Price</span>
                    <div className="br-show__price">
                      <span>PKR</span>
                      <input
                        type="number"
                        min={1}
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                  </label>
                  <label>
                    <span>
                      Message <em>(optional)</em>
                    </span>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Explain your delivery time, condition, or why the buyer should choose you..."
                    />
                  </label>
                  <div
                    className={`br-show__form-actions ${
                      myOffer?.status === "pending" ? "is-split" : ""
                    }`}
                  >
                    <button
                      type="submit"
                      className="br-btn br-btn--dark w-100"
                      disabled={busy || !price}
                    >
                      {busy
                        ? "Saving…"
                        : myOffer?.status === "pending"
                          ? "Update offer"
                          : "Submit offer"}
                    </button>
                    {myOffer?.status === "pending" ? (
                      <button
                        type="button"
                        className="br-btn br-btn--outline w-100"
                        disabled={busy}
                        onClick={() => setConfirm({ type: "withdraw", offerId: myOffer.id })}
                      >
                        Withdraw offer
                      </button>
                    ) : null}
                  </div>
                </form>
                {myOffer && myOffer.status !== "pending" ? (
                  <p className="br-sub mt-3 mb-0">
                    Your offer status:{" "}
                    <span
                      className="br-pill"
                      style={{
                        background: offerPill(myOffer.status).bg,
                        color: offerPill(myOffer.status).color,
                        boxShadow: `inset 0 0 0 1px ${offerPill(myOffer.status).ring}`,
                      }}
                    >
                      {myOffer.status}
                    </span>
                  </p>
                ) : null}
              </section>
            ) : null}

            <section className="br-show__card">
              <div className="br-show__offers-head">
                <h2>
                  Offers <span>({offersCount})</span>
                </h2>
                <p>
                  {isOwner
                    ? "Multiple sellers can bid until you accept one."
                    : "Compare competing offers before you bid."}
                </p>
              </div>

              {!offers.length ? (
                <div className="br-show__empty-offers">
                  <p className="fw-semibold mb-1">No offers yet</p>
                  <p className="mb-0">
                    {isOwner
                      ? "Sellers will appear here when they bid on your request."
                      : "Be the first to submit an offer."}
                  </p>
                </div>
              ) : (
                <div className="br-show__offers">
                  {offers.map((offer) => {
                    const op = offerPill(offer.status);
                    const mine =
                      !isOwner &&
                      user &&
                      Number(offer.seller?.id) === Number(user.id);
                    const canDecide =
                      isOwner && !actionsLocked && offer.status === "pending";
                    const decisionDisabled = isOwner && !canDecide;
                    const canChat = isOwner || mine;

                    return (
                      <div
                        key={offer.id}
                        className={`br-show__offer ${mine ? "is-mine" : ""} ${
                          offer.status === "accepted" ? "is-accepted" : ""
                        } ${
                          offer.status === "rejected" || offer.status === "withdrawn"
                            ? "is-dim"
                            : ""
                        }`}
                      >
                        <div className="br-show__offer-row">
                          <div className="min-w-0">
                            <div className="br-show__offer-seller">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={publicIdentityAvatarSrc(offer.seller)}
                                alt=""
                                className="br-show__avatar"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/assets/images/user.jpg";
                                }}
                              />
                              <div className="min-w-0">
                                <div className="d-flex align-items-center gap-1 flex-wrap">
                                  <span className="fw-semibold text-dark text-truncate">
                                    {offer.seller?.name || "Seller"}
                                  </span>
                                  {isPublicIdentityVerified(offer.seller) ? (
                                    <VerifiedBadge
                                      title={publicIdentityLabel(offer.seller, "seller")}
                                    />
                                  ) : null}
                                  {mine ? (
                                    <span className="br-pill br-pill--amber">You</span>
                                  ) : null}
                                </div>
                                {isPublicIdentityVerified(offer.seller) ? (
                                  <div className="br-identity__badge">
                                    {publicIdentityLabel(offer.seller, "seller")}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            <div className="br-show__offer-price">
                              {Number(offer.price).toLocaleString()} PKR
                            </div>
                            {offer.message ? (
                              <p className="br-show__offer-msg">{offer.message}</p>
                            ) : null}
                            <span
                              className="br-pill mt-2"
                              style={{
                                background: op.bg,
                                color: op.color,
                                boxShadow: `inset 0 0 0 1px ${op.ring}`,
                              }}
                            >
                              {offer.status}
                            </span>
                          </div>

                          <div className="br-show__offer-actions">
                            {canChat ? (
                              <button
                                type="button"
                                className="br-btn br-btn--outline"
                                disabled={chatBusyId === offer.id}
                                onClick={() => void openOfferChat(offer)}
                              >
                                <i className="fa-regular fa-comments" aria-hidden />
                                {chatBusyId === offer.id ? "Opening…" : "Chat"}
                              </button>
                            ) : null}
                            {isOwner ? (
                              <>
                                <button
                                  type="button"
                                  className="br-btn br-btn--dark"
                                  disabled={decisionDisabled || busy}
                                  onClick={() =>
                                    setConfirm({ type: "accept", offerId: offer.id })
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  className="br-btn br-btn--outline"
                                  disabled={decisionDisabled || busy}
                                  onClick={() =>
                                    setConfirm({ type: "reject", offerId: offer.id })
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="br-show__aside">
            <section className="br-show__card">
              <h3 className="br-show__side-label">Request summary</h3>
              <dl className="br-show__summary">
                {item.budget != null && Number(item.budget) > 0 ? (
                  <div>
                    <dt>
                      <i className="fa-solid fa-coins text-success" aria-hidden />
                      Target budget
                    </dt>
                    <dd>{Number(item.budget).toLocaleString()} PKR</dd>
                  </div>
                ) : null}
                <div>
                  <dt>
                    <i className="fa-regular fa-calendar" aria-hidden />
                    Posted
                  </dt>
                  <dd>{formatPostedDate(item.created_at)}</dd>
                </div>
                <div>
                  <dt>
                    <i className="fa-solid fa-clipboard-list" aria-hidden />
                    Offers
                  </dt>
                  <dd>{offersCount}</dd>
                </div>
                <div>
                  <dt>
                    <i className="fa-regular fa-image" aria-hidden />
                    Images
                  </dt>
                  <dd>{images.length}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span
                      className="br-pill"
                      style={{
                        background: pill.bg,
                        color: pill.color,
                        boxShadow: `inset 0 0 0 1px ${pill.ring}`,
                      }}
                    >
                      {item.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            {canOffer || myOffer ? (
              <section className="br-show__card">
                <h3 className="br-show__side-label">Offer progress</h3>
                <ol className="br-show__tracker">
                  {steps.map((step) => (
                    <li key={step.key} className={`is-${step.state}`}>
                      <span className="br-show__tracker-dot">
                        {step.state === "done" || step.state === "rejected" ? (
                          <i className="fa-solid fa-check" aria-hidden />
                        ) : null}
                      </span>
                      <div>
                        <div className="br-show__tracker-label">{step.label}</div>
                        {step.state === "active" ? (
                          <div className="br-show__tracker-hint">Waiting for buyer decision</div>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <section className="br-show__card">
              <h3 className="br-show__side-label">Communication</h3>
              {myOffer ? (
                <div className="br-show__comm">
                  <div className="br-show__your-offer">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <span className="br-show__your-offer-label">Your offer</span>
                      <span
                        className="br-pill"
                        style={{
                          background: offerPill(myOffer.status).bg,
                          color: offerPill(myOffer.status).color,
                          boxShadow: `inset 0 0 0 1px ${offerPill(myOffer.status).ring}`,
                        }}
                      >
                        {myOffer.status}
                      </span>
                    </div>
                    <div className="br-show__your-offer-price">
                      {Number(myOffer.price).toLocaleString()} PKR
                    </div>
                    {myOffer.message ? (
                      <p className="br-show__offer-msg">{myOffer.message}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="br-btn br-btn--dark w-100"
                    disabled={chatBusyId === myOffer.id}
                    onClick={() => void openOfferChat(myOffer)}
                  >
                    <i className="fa-regular fa-comments" aria-hidden />
                    {chatBusyId === myOffer.id ? "Opening…" : "Chat with Buyer"}
                  </button>
                </div>
              ) : isOwner ? (
                <div className="br-show__comm">
                  <p className="br-sub mb-0">
                    {offersCount
                      ? "Use Chat on each offer to talk with sellers."
                      : "When sellers offer, you can chat with them here."}
                  </p>
                  {offers[0] ? (
                    <button
                      type="button"
                      className="br-btn br-btn--dark w-100 mt-3"
                      disabled={chatBusyId === offers[0].id}
                      onClick={() => void openOfferChat(offers[0])}
                    >
                      <i className="fa-regular fa-comments" aria-hidden />
                      {chatBusyId === offers[0].id ? "Opening…" : "Chat with seller"}
                    </button>
                  ) : null}
                </div>
              ) : canOffer ? (
                <p className="br-sub mb-0">Submit an offer first to unlock chat with the buyer.</p>
              ) : (
                <p className="br-sub mb-0">
                  Corporate verification is required to offer and chat.{" "}
                  <button
                    type="button"
                    className="br-link"
                    onClick={() => void openMainPath("/identity-verification")}
                  >
                    Verify now
                  </button>
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>

      {lightbox ? (
        <button
          type="button"
          className="br-lightbox"
          onClick={() => setLightbox(null)}
          aria-label="Close image"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        </button>
      ) : null}

      {confirmCopy ? (
        <ConfirmModal
          open={Boolean(confirm)}
          title={confirmCopy.title}
          message={confirmCopy.message}
          confirmLabel={confirmCopy.confirmLabel}
          danger={confirmCopy.danger}
          busy={busy}
          onCancel={() => {
            if (!busy) setConfirm(null);
          }}
          onConfirm={() => void runConfirmedAction()}
        />
      ) : null}

      <BrStyles />
      <ShowStyles />
    </main>
  );
}

function ShowStyles() {
  return (
    <style>{`
      .br-show__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }
      .br-show__back {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #64748b;
        text-decoration: none !important;
      }
      .br-show__back:hover { color: #0f172a; }
      .br-show__crumb {
        align-items: center;
        gap: 0.4rem;
        font-size: 0.875rem;
        color: #64748b;
      }
      .br-show__crumb a {
        color: #64748b;
        text-decoration: none;
      }
      .br-show__crumb a:hover { color: #0f172a; }
      .br-show__crumb-current {
        max-width: 16rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
        color: #1e293b;
      }
      .br-show__grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 992px) {
        .br-show__grid {
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
      }
      .br-show__main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      @media (min-width: 576px) {
        .br-show__main { gap: 1.5rem; }
      }
      .br-show__aside {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      @media (min-width: 992px) {
        .br-show__aside {
          position: sticky;
          top: 1.5rem;
        }
      }
      .br-show__card {
        border-radius: 1rem;
        border: 1px solid #f3f4f6;
        background: #fff;
        padding: 0.9rem;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
      }
      @media (min-width: 576px) {
        .br-show__card { padding: 1.5rem; }
      }
      .br-show__title {
        margin: 0.65rem 0 0;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #111827;
        line-height: 1.25;
      }
      @media (min-width: 576px) {
        .br-show__title { font-size: 1.875rem; margin-top: 0.75rem; }
      }
      .br-show__meta {
        margin-top: 0.85rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        font-size: 0.75rem;
        color: #64748b;
      }
      @media (min-width: 576px) {
        .br-show__meta {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          font-size: 0.875rem;
        }
      }
      .br-show__budget-label {
        font-weight: 500;
        color: #64748b;
      }
      .br-show__desc {
        margin-top: 1.1rem;
        padding-top: 1.1rem;
        border-top: 1px solid #f1f5f9;
      }
      .br-show__desc h2 {
        margin: 0 0 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
      }
      .br-show__desc p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.6;
        color: #334155;
        white-space: pre-wrap;
      }
      .br-show__desc p.is-clamped {
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .br-show__more {
        margin-top: 0.5rem;
        border: 0;
        background: none;
        padding: 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: #0284c7;
        cursor: pointer;
      }
      .br-show__images { margin-top: 1.25rem; }
      .br-show__images-head {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
      }
      .br-show__images-head span { font-weight: 400; color: #94a3b8; }
      .br-show__images-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
      @media (min-width: 576px) {
        .br-show__images-grid { grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
      }
      .br-show__img {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        border: 1px solid #f1f5f9;
        border-radius: 0.75rem;
        background: #f1f5f9;
        padding: 0;
        cursor: pointer;
      }
      .br-show__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.25s ease;
      }
      .br-show__img:hover img { transform: scale(1.05); }
      .br-show__offers-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .br-show__offers-head h2 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: #111827;
      }
      .br-show__offers-head h2 span {
        margin-left: 0.35rem;
        font-size: 0.9rem;
        font-weight: 500;
        color: #94a3b8;
      }
      .br-show__offers-head p {
        margin: 0;
        font-size: 0.75rem;
        color: #64748b;
      }
      .br-show__empty-offers {
        border-radius: 0.75rem;
        border: 1px dashed #e2e8f0;
        background: #f8fafc;
        padding: 2.5rem 1rem;
        text-align: center;
        font-size: 0.875rem;
        color: #64748b;
      }
      .br-show__offers {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .br-show__offer {
        border-radius: 0.75rem;
        border: 1px solid #f1f5f9;
        background: #fff;
        padding: 1rem;
      }
      .br-show__offer.is-mine {
        border-color: #fde68a;
        background: rgba(255, 251, 235, 0.5);
      }
      .br-show__offer.is-accepted {
        border-color: #bae6fd;
        background: rgba(240, 249, 255, 0.6);
      }
      .br-show__offer.is-dim { opacity: 0.7; }
      .br-show__offer-row {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      @media (min-width: 576px) {
        .br-show__offer-row {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }
      }
      .br-show__offer-seller {
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }
      .br-show__avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        object-fit: cover;
        border: 1px solid #e2e8f0;
        background: #f1f5f9;
        flex-shrink: 0;
      }
      .br-show__offer-price {
        margin-top: 0.5rem;
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
      }
      .br-show__offer-msg {
        margin: 0.5rem 0 0;
        font-size: 0.875rem;
        color: #475569;
      }
      .br-show__offer-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .br-show__aside-title {
        margin: 0 0 0.35rem;
        font-size: 1.125rem;
        font-weight: 700;
        color: #111827;
      }
      .br-show__side-label {
        margin: 0;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #64748b;
      }
      @media (min-width: 576px) {
        .br-show__side-label { font-size: 0.875rem; }
      }
      .br-show__summary {
        margin: 0.85rem 0 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .br-show__summary > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        font-size: 0.875rem;
      }
      .br-show__summary dt {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        color: #64748b;
        font-weight: 400;
      }
      .br-show__summary dd {
        margin: 0;
        font-weight: 600;
        color: #0f172a;
      }
      .br-show__tracker {
        position: relative;
        margin: 0.85rem 0 0;
        padding: 0 0 0 0.4rem;
        list-style: none;
        border-left: 1px solid #e2e8f0;
      }
      .br-show__tracker li {
        position: relative;
        padding: 0 0 1rem 1.35rem;
      }
      .br-show__tracker li:last-child { padding-bottom: 0; }
      .br-show__tracker-dot {
        position: absolute;
        left: -9px;
        top: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #cbd5e1;
        box-shadow: 0 0 0 4px #fff;
        color: #fff;
        font-size: 9px;
      }
      .br-show__tracker li.is-done .br-show__tracker-dot { background: #10b981; }
      .br-show__tracker li.is-active .br-show__tracker-dot { background: #fbbf24; }
      .br-show__tracker li.is-rejected .br-show__tracker-dot { background: #f43f5e; }
      .br-show__tracker-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #94a3b8;
        line-height: 1.35;
      }
      .br-show__tracker li.is-done .br-show__tracker-label { color: #0f172a; }
      .br-show__tracker li.is-active .br-show__tracker-label { color: #b45309; }
      .br-show__tracker li.is-rejected .br-show__tracker-label { color: #be123c; }
      .br-show__tracker-hint {
        margin-top: 0.15rem;
        font-size: 0.75rem;
        color: #d97706;
      }
      .br-show__comm { margin-top: 0.85rem; }
      .br-show__your-offer {
        margin-bottom: 0.75rem;
        border-radius: 0.75rem;
        border: 1px solid #f1f5f9;
        background: #f8fafc;
        padding: 0.75rem;
      }
      .br-show__your-offer-label {
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #64748b;
      }
      .br-show__your-offer-price {
        margin-top: 0.4rem;
        font-size: 1.125rem;
        font-weight: 700;
        color: #0f172a;
      }
      .br-show__form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.25rem;
      }
      .br-show__form > label {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin: 0;
      }
      .br-show__form > label > span {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
      }
      .br-show__form > label > span em {
        font-style: normal;
        font-weight: 400;
        color: #94a3b8;
      }
      .br-show__price {
        display: flex;
        overflow: hidden;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        background: #fff;
      }
      .br-show__price span {
        display: inline-flex;
        align-items: center;
        border-right: 1px solid #e2e8f0;
        background: #f8fafc;
        padding: 0 0.75rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #475569;
      }
      .br-show__price input,
      .br-show__form textarea {
        width: 100%;
        border: 0;
        outline: none;
        padding: 0.65rem 0.75rem;
        font-size: 0.875rem;
        color: #0f172a;
        background: transparent;
      }
      .br-show__form textarea {
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        resize: vertical;
        min-height: 5rem;
      }
      .br-show__form textarea:focus,
      .br-show__price:focus-within {
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
      }
      .br-show__form-actions {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding-top: 0.25rem;
      }
      .br-show__form-actions.is-split {
        grid-template-columns: 1fr 1fr;
      }
      .br-lightbox {
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 0.85);
        border: 0;
        padding: 1rem;
        cursor: zoom-out;
      }
      .br-lightbox img {
        max-width: min(96vw, 960px);
        max-height: 90vh;
        border-radius: 0.75rem;
        object-fit: contain;
      }
    `}</style>
  );
}
