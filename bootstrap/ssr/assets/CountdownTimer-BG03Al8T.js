import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const formatName = (name = "") => {
  const safeName = String(name ?? "").trim();
  const formatted = safeName.split(" ").filter(Boolean).slice(0, 5).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") || "User";
  return formatted.length > 15 ? formatted.substring(0, 15) + "..." : formatted;
};
const buildAvatarUrl = (avatar) => {
  if (!avatar) return "/assets/images/user.jpg";
  if (avatar.startsWith("http")) return avatar;
  const normalized = String(avatar).replace(/\\/g, "/");
  if (normalized.startsWith("/")) return normalized;
  return `/${normalized.replace(/^\/+/, "")}`;
};
const OwnerInfoRow = ({
  owner = {},
  fallbackName = "",
  fallbackAvatar = "",
  isFeatured = false
}) => {
  const displayName = formatName(owner?.name || fallbackName);
  const avatarSrc = buildAvatarUrl(owner?.profile || owner?.profile_pic || fallbackAvatar);
  const individualStatus = owner?.individual_verification?.status || owner?.individualVerification?.status;
  const corporateStatus = owner?.corporate_verification?.status || owner?.corporateVerification?.status;
  const isVerified = [individualStatus, corporateStatus].some(
    (status) => String(status || "").toLowerCase() === "verified" || String(status || "").toLowerCase() === "approved"
  );
  return /* @__PURE__ */ jsxs("div", { className: "owner-info-row", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: avatarSrc,
        alt: displayName,
        onError: (e) => {
          e.currentTarget.src = "/assets/images/user.jpg";
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "owner-info-row__content", children: [
      /* @__PURE__ */ jsxs("span", { className: "owner-info-row__identity", children: [
        /* @__PURE__ */ jsx("span", { className: "owner-info-row__name-text", children: displayName }),
        isVerified && /* @__PURE__ */ jsx("span", { className: "owner-info-row__verified", title: "Verified seller", "aria-label": "Verified seller", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("circle", { cx: "10", cy: "10", r: "8", fill: "#2F80ED" }),
          /* @__PURE__ */ jsx("path", { d: "M6.8 10.2L8.9 12.3L13.3 7.9", stroke: "white", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })
        ] }) })
      ] }),
      isFeatured && /* @__PURE__ */ jsx("span", { className: "owner-info-row__featured", children: "Featured" })
    ] })
  ] });
};
const CountdownTimer = ({ endDate, variant = "default", className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = /* @__PURE__ */ new Date();
      const end = new Date(endDate);
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsActive(false);
        return;
      }
      setIsActive(true);
      const msInSec = 1e3;
      const msInMin = msInSec * 60;
      const msInHour = msInMin * 60;
      const msInDay = msInHour * 24;
      const days = Math.floor(diff / msInDay);
      const remAfterDays = diff % msInDay;
      const hours = Math.floor(remAfterDays / msInHour);
      const remAfterHours = remAfterDays % msInHour;
      const minutes = Math.floor(remAfterHours / msInMin);
      const remAfterMinutes = remAfterHours % msInMin;
      const seconds = Math.floor(remAfterMinutes / msInSec);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1e3);
    return () => clearInterval(timer);
  }, [endDate]);
  return /* @__PURE__ */ jsx("div", { className: `counter ${variant === "inline" ? "counter-inline" : ""} ${className}`.trim(), children: isActive ? /* @__PURE__ */ jsxs("div", { className: "counter-grid", children: [
    /* @__PURE__ */ jsxs("div", { className: "counter-box", children: [
      /* @__PURE__ */ jsx("div", { className: "counter-value", children: timeLeft.days }),
      /* @__PURE__ */ jsx("div", { className: "counter-label", children: "Days" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "counter-box", children: [
      /* @__PURE__ */ jsx("div", { className: "counter-value", children: timeLeft.hours }),
      /* @__PURE__ */ jsx("div", { className: "counter-label", children: "Hours" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "counter-box", children: [
      /* @__PURE__ */ jsx("div", { className: "counter-value", children: timeLeft.minutes }),
      /* @__PURE__ */ jsx("div", { className: "counter-label", children: "Minutes" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "counter-box", children: [
      /* @__PURE__ */ jsx("div", { className: "counter-value", children: timeLeft.seconds }),
      /* @__PURE__ */ jsx("div", { className: "counter-label", children: "Seconds" })
    ] })
  ] }) : null });
};
export {
  CountdownTimer as C,
  OwnerInfoRow as O
};
