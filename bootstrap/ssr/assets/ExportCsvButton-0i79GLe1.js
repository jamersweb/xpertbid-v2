import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { M as Modal } from "./Modal-DHAPaXZd.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import Swal from "sweetalert2";
function ExportCsvButton({
  routeName,
  params = {},
  label = "Export CSV",
  title = "Export Data",
  description = "Select a date range to download data as a CSV file."
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const handleExport = (e) => {
    e.preventDefault();
    if (!from || !to) {
      Swal.fire({
        title: "Date range required",
        text: "Please select both from and to dates before exporting.",
        icon: "warning",
        confirmButtonColor: "#000000"
      });
      return;
    }
    const searchParams = new URLSearchParams({ from, to });
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0 && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });
    window.location.href = `${route(routeName)}?${searchParams.toString()}`;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(true),
        className: "px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 whitespace-nowrap",
        children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-file-csv" }),
          label
        ]
      }
    ),
    /* @__PURE__ */ jsx(Modal, { show: isOpen, onClose: () => setIsOpen(false), maxWidth: "md", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleExport, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-1", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: description }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: `${routeName}_from`, value: "From Date" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: `${routeName}_from`,
              type: "date",
              className: "mt-1 block w-full text-gray-900",
              value: from,
              onChange: (e) => setFrom(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: `${routeName}_to`, value: "To Date" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: `${routeName}_to`,
              type: "date",
              className: "mt-1 block w-full text-gray-900",
              value: to,
              onChange: (e) => setTo(e.target.value),
              min: from || void 0,
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 gap-2", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-file-csv" }),
          label
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ExportCsvButton as E
};
