import React, { useEffect, useMemo, useState } from "react";
import useCurrencyList from "@/Utils/useCurrencyList";
import { getSelectedCurrency, convertPKRTo, formatWithMeta } from "@/Utils/formatPrice";

export default function Price({
       amountPKR,
       amountAED, // Alias for amountPKR (PKR is base now)
       amountAEDMinor,
       className = "",
       fallbackCurrency = "PKR",
}) {
       const { list } = useCurrencyList();
       const [selected, setSelected] = useState("PKR");

       useEffect(() => {
              // Sync user's saved currency preference strictly after hydration completes
              setSelected(getSelectedCurrency());
       }, []);

       useEffect(() => {
              const onChange = () => setSelected(getSelectedCurrency());
              window.addEventListener("xb-currency-change", onChange);
              return () => window.removeEventListener("xb-currency-change", onChange);
       }, []);

       const pkrMajor = useMemo(() => {
              if (amountAEDMinor != null) return Number(amountAEDMinor) / 100;
              return Number(amountPKR || amountAED || 0);
       }, [amountPKR, amountAED, amountAEDMinor]);

       const meta =
              list.find((c) => c.code === selected) ||
              list.find((c) => c.code === fallbackCurrency) || {
                     code: "PKR",
                     symbol: "₨",
                     decimals: 0,
                     position: "left",
                     manual_rate_to_aed: 1,
              };

       const converted = convertPKRTo(pkrMajor, meta);

       const decimalsByCode = {
              USD: 0,
       };
       const displayMeta =
              meta.code in decimalsByCode ? { ...meta, decimals: decimalsByCode[meta.code] } : meta;

       const rounded =
              displayMeta.decimals === 0 ? Math.round(converted) : converted;

       const label = formatWithMeta(rounded, displayMeta);

       return <span className={className}>{label}</span>;
}
