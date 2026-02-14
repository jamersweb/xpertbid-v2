export function getSelectedCurrency() {
       if (typeof window === "undefined") return "PKR";
       return localStorage.getItem("xb_currency") || "PKR";
}

// amountPKRMajor: e.g., 4996.00 (now in PKR, previously AED)
// Database stores: manual_rate_to_aed = rate to PKR (e.g., AED: 75 means 1 AED = 75 PKR)
// So to convert PKR to AED: PKR_amount / rate
export function convertAEDTo(amountAEDMajor, meta) {
       if (!meta || meta.code === "PKR") return Number(amountAEDMajor || 0);
       const rate = Number(meta.manual_rate_to_aed || 1); // Rate to PKR
       return Number(amountAEDMajor || 0) / rate;
}

export function formatWithMeta(amountMajor, meta) {
       const decimals = Number(meta?.decimals ?? 2);
       const num = Number(amountMajor ?? 0);
       const pretty = num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
       const code = meta?.code || "PKR";
       return `${pretty} ${code}`;
}
