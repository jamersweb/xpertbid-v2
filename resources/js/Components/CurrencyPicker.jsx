import React from "react";
import useCurrencyList from "@/Utils/useCurrencyList";

function setCookie(name, value, days = 30) {
       const expires = new Date(Date.now() + days * 864e5).toUTCString();
       document.cookie = `${name}=${encodeURIComponent(
              value
       )}; expires=${expires}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""
              }`;
}

export default function CurrencyPicker() {
       const { loading, list, selected, choose } = useCurrencyList();

       if (loading || !list?.length) return null;

       const ALLOWED = new Set(["AED", "PKR", "USD"]);
       const options = list
              .map((c) => String(c.code || "").toUpperCase())
              .filter((code) => ALLOWED.has(code));

       if (!options.includes("PKR")) options.unshift("PKR");

       const handleChange = async (e) => {
              const code = e.target.value.toUpperCase();
              try {
                     await Promise.resolve(choose(code));
                     setCookie("xb_currency", code);
                     setCookie("xb_currency_userSet", "1");
                     document.dispatchEvent(new Event("xb-currency-change"));
                     window.location.reload();
              } catch (err) {
                     console.error("Failed to switch currency:", err);
              }
       };

       const safeSelected = ALLOWED.has(String(selected).toUpperCase())
              ? String(selected).toUpperCase()
              : "PKR";

       return (
              <div className="currency-picker d-flex align-items-center gap-2">
                     <select
                            value={safeSelected}
                            onChange={handleChange}
                            className="form-select form-select-sm"
                            aria-label="Select display currency"
                     >
                            {options.map((code) => (
                                   <option key={code} value={code}>
                                          {code}
                                   </option>
                            ))}
                     </select>
              </div>
       );
}
