import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DNCwhj5R.js";
import { useForm, Head, router } from "@inertiajs/react";
import { M as Modal } from "./Modal-DHAPaXZd.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
function Index({ fields, categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const { data, setData, post, put, processing, errors, reset } = useForm({
    listing_type: "all",
    category_id: "",
    field_name: "",
    label: "",
    input_type: "text",
    options: [],
    is_required: false
  });
  const openModal = (field = null) => {
    setEditingField(field);
    if (field) {
      setData({
        listing_type: field.listing_type || "all",
        category_id: field.category_id || "",
        field_name: field.field_name || "",
        label: field.label || "",
        input_type: field.input_type || "text",
        options: field.options || [],
        is_required: field.is_required || false
      });
    } else {
      reset();
    }
    setIsModalOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingField) {
      put(route("admin.dynamic-fields.update", editingField.id), {
        onSuccess: () => closeModal()
      });
    } else {
      post(route("admin.dynamic-fields.store"), {
        onSuccess: () => closeModal()
      });
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
    reset();
  };
  const deleteField = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This field will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.dynamic-fields.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Dynamic Fields", children: [
    /* @__PURE__ */ jsx(Head, { title: "Dynamic Fields" }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Dynamic Fields" }),
      /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
        " Add Field"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Field Name / Label" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Category" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Type" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Listing Type" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Required" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100", children: [
        fields.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-10 text-center text-gray-400", children: "No dynamic fields found. Create one to get started." }) }),
        fields.map((field) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-800", children: field.label }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
              "ID: ",
              field.field_name
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600", children: field.category ? field.category.name : "All Categories" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase", children: field.input_type }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${field.listing_type === "all" ? "bg-gray-100 text-gray-700" : field.listing_type === "auction" ? "bg-purple-100 text-purple-700" : field.listing_type === "business" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`, children: field.listing_type }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: field.is_required ? /* @__PURE__ */ jsx("span", { className: "text-rose-600 text-xs font-bold", children: "YES" }) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs", children: "NO" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => openModal(field), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteField(field.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, field.id))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-6", children: editingField ? "Edit Dynamic Field" : "Add New Dynamic Field" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Field Label (e.g. Mileage)", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              className: "mt-1 block w-full text-gray-900 bg-white placeholder:text-gray-400",
              value: data.label,
              onChange: (e) => setData("label", e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.label, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Field ID / Name (e.g. mileage)", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              className: "mt-1 block w-full text-gray-900 bg-white placeholder:text-gray-400",
              value: data.field_name,
              onChange: (e) => setData("field_name", e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.field_name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Listing Type", required: true }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white",
              value: data.listing_type,
              onChange: (e) => setData("listing_type", e.target.value),
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Types" }),
                /* @__PURE__ */ jsx("option", { value: "normal", children: "Normal" }),
                /* @__PURE__ */ jsx("option", { value: "auction", children: "Auction" }),
                /* @__PURE__ */ jsx("option", { value: "business", children: "Business" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.listing_type, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Main Category" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white",
                value: (() => {
                  const cat = categories.find(
                    (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                  );
                  return cat?.id || "";
                })(),
                onChange: (e) => {
                  setData("category_id", e.target.value);
                },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Global (All Categories)" }),
                  categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Sub Category" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white",
                disabled: !categories.find(
                  (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                ),
                value: (() => {
                  const root = categories.find(
                    (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                  );
                  const sub = root?.sub_categories?.find(
                    (sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id)
                  );
                  return sub?.id || "";
                })(),
                onChange: (e) => {
                  const subId = e.target.value;
                  if (subId) {
                    setData("category_id", subId);
                  } else {
                    const root = categories.find(
                      (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                    );
                    setData("category_id", root?.id || "");
                  }
                },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "None (Apply to Root)" }),
                  categories.find(
                    (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                  )?.sub_categories?.map((sc) => /* @__PURE__ */ jsx("option", { value: sc.id, children: sc.name }, sc.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Child Category" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white",
                disabled: !(() => {
                  const root = categories.find(
                    (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                  );
                  return root?.sub_categories?.find(
                    (sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id)
                  );
                })(),
                value: (() => {
                  const root = categories.find(
                    (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                  );
                  const sub = root?.sub_categories?.find(
                    (sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id)
                  );
                  const child = sub?.child_categories?.find((cc) => cc.id == data.category_id);
                  return child?.id || "";
                })(),
                onChange: (e) => {
                  const childId = e.target.value;
                  if (childId) {
                    setData("category_id", childId);
                  } else {
                    const root = categories.find(
                      (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                    );
                    const sub = root?.sub_categories?.find(
                      (sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id)
                    );
                    setData("category_id", sub?.id || "");
                  }
                },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "None (Apply to Sub)" }),
                  (() => {
                    const root = categories.find(
                      (c) => c.id == data.category_id || c.sub_categories?.some((sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id))
                    );
                    const sub = root?.sub_categories?.find(
                      (sc) => sc.id == data.category_id || sc.child_categories?.some((cc) => cc.id == data.category_id)
                    );
                    return sub?.child_categories?.map((cc) => /* @__PURE__ */ jsx("option", { value: cc.id, children: cc.name }, cc.id));
                  })()
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsx(InputError, { message: errors.category_id, className: "mt-2" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Input Type", required: true }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white",
              value: data.input_type,
              onChange: (e) => setData("input_type", e.target.value),
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "text", children: "Text Input" }),
                /* @__PURE__ */ jsx("option", { value: "number", children: "Number Input" }),
                /* @__PURE__ */ jsx("option", { value: "select", children: "Dropdown (Select)" }),
                /* @__PURE__ */ jsx("option", { value: "radio", children: "Radio Buttons" }),
                /* @__PURE__ */ jsx("option", { value: "checkbox", children: "Checkbox" }),
                /* @__PURE__ */ jsx("option", { value: "textarea", children: "Text Area" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.input_type, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center mt-6", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "rounded border-gray-300 text-black shadow-sm focus:ring-black w-5 h-5",
              checked: data.is_required,
              onChange: (e) => setData("is_required", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-gray-700 font-bold uppercase tracking-wider", children: "Is Required?" })
        ] }) }),
        (data.input_type === "select" || data.input_type === "radio") && /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 border-t pt-4", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Options (JSON array of strings)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white placeholder:text-gray-400",
              rows: "3",
              placeholder: '["Option 1", "Option 2"]',
              value: typeof data.options === "string" ? data.options : JSON.stringify(data.options),
              onChange: (e) => {
                try {
                  setData("options", JSON.parse(e.target.value));
                } catch (err) {
                  setData("options", e.target.value);
                }
              }
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-1", children: "Enter a valid JSON array of options for dropdown/radio." }),
          /* @__PURE__ */ jsx(InputError, { message: errors.options, className: "mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: editingField ? "Update Field" : "Create Field" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
