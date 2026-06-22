import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useForm, Head } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-Bstw8cGQ.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Edit({ language, rows = [] }) {
  const [search, setSearch] = useState("");
  const { data, setData, put, processing } = useForm({
    translations: rows.reduce((acc, row) => {
      acc[row.key] = row.value ?? "";
      return acc;
    }, {})
  });
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (row) => row.key.toLowerCase().includes(term) || String(row.fallback || "").toLowerCase().includes(term) || String(data.translations[row.key] || "").toLowerCase().includes(term)
    );
  }, [rows, search, data.translations]);
  const submit = (e) => {
    e.preventDefault();
    put(route("admin.languages.update-translations", language.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Translations - ${language.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Translations - ${language.name}` }),
    /* @__PURE__ */ jsx("style", { children: `
                            .language-editor-card{background:#fff;border:1px solid #e9eef5;border-radius:24px;box-shadow:0 12px 32px rgba(15,23,42,.06);overflow:hidden}
                            .language-editor-toolbar{padding:28px 30px;border-bottom:1px solid #eef2f7;background:linear-gradient(180deg,#ffffff 0%,#fbfdff 100%)}
                            .language-editor-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
                            .language-editor-badge{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
                            .language-editor-count{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:#f3f4f6;color:#374151;font-size:.78rem;font-weight:700}
                            .language-editor-search{min-width:320px;height:48px;border-radius:14px;border:1px solid #dbe3ee;padding-inline:16px;font-size:1rem;color:#111827;background:#fff}
                            .language-editor-search:focus{border-color:#43ACE9;box-shadow:0 0 0 4px rgba(67,172,233,.12);outline:none}
                            .language-editor-table-wrap{max-height:72vh;overflow:auto}
                            .language-editor-table{margin:0}
                            .language-editor-table thead th{position:sticky;top:0;z-index:2;background:#f8fafc;color:#111827;font-size:.8rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #e5e7eb;padding:16px 24px}
                            .language-editor-table tbody td{padding:22px 24px;vertical-align:top;border-bottom:1px solid #eef2f7}
                            .language-editor-table tbody tr:nth-child(even){background:#fcfdff}
                            .language-key{display:inline-block;padding:10px 12px;border-radius:14px;background:#111827;color:#fff;font-size:.84rem;line-height:1.45;word-break:break-word;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
                            .language-fallback{min-height:120px;padding:14px 16px;border-radius:16px;background:#f8fafc;border:1px solid #e5e7eb;color:#475467;font-size:.97rem;line-height:1.75;white-space:pre-wrap;word-break:break-word}
                            .language-value{min-height:120px;border-radius:16px !important;border:1px solid #d8e1ec !important;padding:14px 16px !important;background:#fff;color:#111827 !important;font-size:.98rem;line-height:1.75;resize:vertical}
                            .language-value:focus{border-color:#43ACE9 !important;box-shadow:0 0 0 4px rgba(67,172,233,.12) !important}
                            .language-empty{padding:48px 24px;text-align:center;color:#6b7280}
                            @media (max-width: 991px){
                                   .language-editor-toolbar{padding:22px 20px}
                                   .language-editor-search{min-width:100%;width:100%}
                                   .language-editor-table thead th,.language-editor-table tbody td{padding:16px}
                                   .language-key,.language-fallback,.language-value{font-size:.9rem}
                            }
                     ` }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "language-editor-card", children: [
      /* @__PURE__ */ jsx("div", { className: "language-editor-toolbar", children: /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-start justify-content-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "language-editor-meta mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "language-editor-badge", children: language.code }),
            /* @__PURE__ */ jsxs("span", { className: "language-editor-count", children: [
              filteredRows.length,
              " keys"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "language-editor-count text-uppercase", children: language.direction })
          ] }),
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-800 mb-1", children: [
            language.name,
            " Translations"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-0", children: [
            "Edit static content keys for ",
            /* @__PURE__ */ jsx("span", { className: "fw-semibold", children: language.native_name }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-2 flex-wrap justify-content-end", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "language-editor-search",
              placeholder: "Search key or value...",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(PrimaryButton, { type: "submit", disabled: processing, children: processing ? "Saving..." : "Save Changes" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "language-editor-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "table language-editor-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { width: "26%" }, children: "Key" }),
          /* @__PURE__ */ jsx("th", { style: { width: "34%" }, children: "Fallback" }),
          /* @__PURE__ */ jsx("th", { style: { width: "40%" }, children: "Value" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: filteredRows.length > 0 ? filteredRows.map((row) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("div", { className: "language-key", children: row.key }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("div", { className: "language-fallback", children: row.fallback || "-" }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "form-control language-value",
              dir: language.direction === "rtl" ? "rtl" : "ltr",
              style: { textAlign: language.direction === "rtl" ? "right" : "left" },
              rows: 4,
              value: data.translations[row.key] ?? "",
              onChange: (e) => setData("translations", {
                ...data.translations,
                [row.key]: e.target.value
              })
            }
          ) })
        ] }, row.key)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "3", className: "language-empty", children: "No translation keys matched your search." }) }) })
      ] }) })
    ] })
  ] });
}
export {
  Edit as default
};
