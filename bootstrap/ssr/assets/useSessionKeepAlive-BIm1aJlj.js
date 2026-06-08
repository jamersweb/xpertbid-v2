import { usePage } from "@inertiajs/react";
import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { u as useCurrencyList } from "./useCurrencyList-Ce5tJXO9.js";
import axios from "axios";
function useTranslate() {
  const { translations = {} } = usePage().props;
  const t = (key, replacements = {}) => {
    let value = translations[key] ?? key;
    Object.entries(replacements).forEach(([replacementKey, replacementValue]) => {
      value = value.replaceAll(`:${replacementKey}`, String(replacementValue));
    });
    return value;
  };
  return {
    t
  };
}
function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}
function CurrencyPicker() {
  const { loading, list, selected, choose } = useCurrencyList();
  if (loading || !list?.length) return null;
  const ALLOWED = /* @__PURE__ */ new Set(["AED", "PKR", "USD"]);
  const options = list.map((c) => String(c.code || "").toUpperCase()).filter((code) => ALLOWED.has(code));
  if (!options.includes("PKR")) options.unshift("PKR");
  const handleChange = async (e) => {
    const code = e.target.value.toUpperCase();
    try {
      await Promise.resolve(choose(code));
      setCookie("xb_currency", code);
      setCookie("xb_currency_userSet", "1");
      document.dispatchEvent(new Event("xb-currency-change"));
      window.dispatchEvent(new Event("xb-currency-change"));
    } catch (err) {
      console.error("Failed to switch currency:", err);
    }
  };
  const safeSelected = ALLOWED.has(String(selected).toUpperCase()) ? String(selected).toUpperCase() : "PKR";
  return /* @__PURE__ */ jsxs("div", { className: "currency-picker", children: [
    /* @__PURE__ */ jsx(
      "select",
      {
        value: safeSelected,
        onChange: handleChange,
        className: "form-select form-select-sm currency-picker-select",
        "aria-label": "Select display currency",
        children: options.map((code) => /* @__PURE__ */ jsx("option", { value: code, children: code }, code))
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
                            .currency-picker {
                                   display: inline-flex;
                                   align-items: center;
                            }
                            .currency-picker-select {
                                   min-width: 78px;
                                   height: 38px;
                                   border-radius: 10px;
                                   border: 1px solid #d7deea;
                                   background-color: #ffffff;
                                   color: #23262F;
                                   font-size: 14px;
                                   font-weight: 500;
                                   padding-left: 12px;
                                   padding-right: 30px;
                                   box-shadow: none;
                                   background-position: right 12px center;
                                   background-size: 14px 10px;
                            }
                            .currency-picker-select:focus {
                                   border-color: #c6d3e6;
                                   box-shadow: 0 0 0 3px rgba(67, 172, 233, 0.08);
                            }
                     ` })
  ] });
}
function useSessionKeepAlive(enabled = false, intervalMs = 10 * 60 * 1e3) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }
    let disposed = false;
    const ping = () => {
      if (disposed) return;
      axios.get(route("session.keepalive")).catch(() => {
      });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        ping();
      }
    };
    ping();
    const timer = window.setInterval(ping, intervalMs);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", ping);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", ping);
    };
  }, [enabled, intervalMs]);
}
export {
  CurrencyPicker as C,
  useSessionKeepAlive as a,
  useTranslate as u
};
