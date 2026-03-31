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
                     window.dispatchEvent(new Event("xb-currency-change"));
              } catch (err) {
                     console.error("Failed to switch currency:", err);
              }
       };

       const safeSelected = ALLOWED.has(String(selected).toUpperCase())
              ? String(selected).toUpperCase()
              : "PKR";

       return (
              <div className="currency-picker">
                     <select
                            value={safeSelected}
                            onChange={handleChange}
                            className="form-select form-select-sm currency-picker-select"
                            aria-label="Select display currency"
                     >
                            {options.map((code) => (
                                   <option key={code} value={code}>
                                          {code}
                                   </option>
                            ))}
                     </select>

                     <style>{`
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
                     `}</style>
              </div>
       );
}
