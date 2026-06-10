import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-C1RliH-Q.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Edit({ faq }) {
  const { data, setData, put, processing, errors } = useForm({
    question_text: faq.question_text || "",
    answer_text: faq.answer_text || "",
    status: faq.status || "Active"
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("admin.faqs.update", faq.id));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Edit FAQ", children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit FAQ" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(Link, { href: route("admin.faqs.index"), className: "text-sm font-bold text-gray-400 hover:text-black transition-colors", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
        " Back to FAQs"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Question" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black rounded-xl transition-all",
              placeholder: "e.g. How do I place a bid?",
              value: data.question_text,
              onChange: (e) => setData("question_text", e.target.value)
            }
          ),
          errors.question_text && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.question_text })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Answer" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black rounded-xl transition-all min-h-[150px]",
              placeholder: "Provide the detailed answer here...",
              value: data.answer_text,
              onChange: (e) => setData("answer_text", e.target.value)
            }
          ),
          errors.answer_text && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.answer_text })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Status" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-black focus:border-black rounded-xl transition-all font-medium",
              value: data.status,
              onChange: (e) => setData("status", e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" })
              ]
            }
          ),
          errors.status && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.status })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50",
            children: processing ? "Saving..." : "Update FAQ"
          }
        ) })
      ] }) })
    ] })
  ] });
}
export {
  Edit as default
};
