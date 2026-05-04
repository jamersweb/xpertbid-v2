import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CjtavrEj.js";
import { useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ countries }) {
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: "country", parentId: null, action: "create" });
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    name: "",
    type: "country",
    parent_id: null
  });
  const selectedCountry = countries.find((country) => country.id === selectedCountryId) || null;
  const selectedState = selectedCountry?.states?.find((state) => state.id === selectedStateId) || null;
  const handleAdd = (type, parentId = null) => {
    setModalConfig({ type, parentId, action: "create" });
    setData({ name: "", type, parent_id: parentId });
    setShowModal(true);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.locations.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setShowModal(false);
        reset();
        if (modalConfig.type === "state" && modalConfig.parentId) {
          setSelectedCountryId(modalConfig.parentId);
        }
        if (modalConfig.type === "city" && modalConfig.parentId) {
          setSelectedStateId(modalConfig.parentId);
        }
      }
    });
  };
  const handleDelete = async (id, type) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This ${type} will be deleted permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      destroy(route("admin.locations.destroy", id), {
        data: { type }
      });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Location Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "Location Management" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-bottom border-gray-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: "Countries" }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleAdd("country"), className: "p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus text-[10px]" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: countries.map((country) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => {
              setSelectedCountryId(country.id);
              setSelectedStateId(null);
            },
            className: `flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedCountryId === country.id ? "bg-black text-white shadow-lg" : "text-gray-900 hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: country.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-60 font-mono", children: country.states?.length || 0 }),
                /* @__PURE__ */ jsx("button", { onClick: (e) => {
                  e.stopPropagation();
                  handleDelete(country.id, "country");
                }, className: `p-1.5 rounded-lg hover:bg-white/20 ${selectedCountryId === country.id ? "text-white" : "text-gray-400"}`, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can text-[10px]" }) })
              ] })
            ]
          },
          country.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-bottom border-gray-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: [
            "States / ",
            selectedCountry?.name || "..."
          ] }),
          selectedCountry && /* @__PURE__ */ jsx("button", { onClick: () => handleAdd("state", selectedCountry.id), className: "p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus text-[10px]" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: !selectedCountry ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-globe text-3xl mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-500", children: "Select a country to view its states" })
        ] }) : selectedCountry.states?.map((state) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setSelectedStateId(state.id),
            className: `flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedStateId === state.id ? "bg-black text-white shadow-lg" : "text-gray-900 hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: state.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-60 font-mono", children: state.cities?.length || 0 }),
                /* @__PURE__ */ jsx("button", { onClick: (e) => {
                  e.stopPropagation();
                  handleDelete(state.id, "state");
                }, className: `p-1.5 rounded-lg hover:bg-white/20 ${selectedStateId === state.id ? "text-white" : "text-gray-400"}`, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can text-[10px]" }) })
              ] })
            ]
          },
          state.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-bottom border-gray-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: [
            "Cities / ",
            selectedState?.name || "..."
          ] }),
          selectedState && /* @__PURE__ */ jsx("button", { onClick: () => handleAdd("city", selectedState.id), className: "p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus text-[10px]" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: !selectedState ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-city text-3xl mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-500", children: "Select a state to view its cities" })
        ] }) : selectedState.cities?.map((city) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-700", children: city.name }),
              /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(city.id, "city"), className: "p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can text-[10px]" }) })
            ]
          },
          city.id
        )) })
      ] })
    ] }),
    showModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-gray-800 capitalize", children: [
          "Add New ",
          modalConfig.type
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowModal(false), className: "text-gray-400 hover:text-black", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-2", children: "Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              autoFocus: true,
              className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black rounded-xl text-sm",
              placeholder: `Enter ${modalConfig.type} name...`,
              value: data.name,
              onChange: (e) => setData("name", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50",
            children: processing ? "Adding..." : `Add ${modalConfig.type}`
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
