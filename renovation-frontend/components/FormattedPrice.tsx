"use client";

import { useEffect, useState } from "react";
import {
  fetchCurrencyRates,
  formatDisplayPrice,
  getSelectedCurrency,
  readRates,
} from "@/lib/currency";

type Props = {
  amount: number | null | undefined;
  /** Listing currency from API — amounts are treated as PKR majors (site base). */
  className?: string;
};

export function FormattedPrice({ amount, className }: Props) {
  const [currency, setCurrency] = useState("PKR");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCurrency(getSelectedCurrency());
    setRates(readRates());

    void fetchCurrencyRates().then((result) => {
      if (cancelled) return;
      setRates(result.rates);
      setReady(true);
    });

    const onChange = () => {
      setCurrency(getSelectedCurrency());
      setRates(readRates());
    };
    window.addEventListener("xb-currency-change", onChange);
    return () => {
      cancelled = true;
      window.removeEventListener("xb-currency-change", onChange);
    };
  }, []);

  if (!ready && (amount === null || amount === undefined)) {
    return <span className={className}>…</span>;
  }

  return (
    <span className={className}>{formatDisplayPrice(amount, currency, rates)}</span>
  );
}
