import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { useForm, Head } from "@inertiajs/react";
function Index({ countries }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: "country", parentId: null, action: "create" });
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    name: "",
    type: "country",
    parent_id: null
  });
  const handleAdd = (type, parentId = null) => {
    setModalConfig({ type, parentId, action: "create" });
    setData({ name: "", type, parent_id: parentId });
    setShowModal(true);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.locations.store"), {
      onSuccess: () => {
        setShowModal(false);
        reset();
      }
    });
  };
  const handleDelete = (id, type) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
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
              setSelectedCountry(country);
              setSelectedState(null);
            },
            className: `flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedCountry?.id === country.id ? "bg-black text-white shadow-lg" : "hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: country.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-60 font-mono", children: country.states?.length || 0 }),
                /* @__PURE__ */ jsx("button", { onClick: (e) => {
                  e.stopPropagation();
                  handleDelete(country.id, "country");
                }, className: `p-1.5 rounded-lg hover:bg-white/20 ${selectedCountry?.id === country.id ? "text-white" : "text-gray-400"}`, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can text-[10px]" }) })
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
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: !selectedCountry ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-globe text-3xl mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Select a country to view its states" })
        ] }) : selectedCountry.states?.map((state) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setSelectedState(state),
            className: `flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedState?.id === state.id ? "bg-black text-white shadow-lg" : "hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: state.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-60 font-mono", children: state.cities?.length || 0 }),
                /* @__PURE__ */ jsx("button", { onClick: (e) => {
                  e.stopPropagation();
                  handleDelete(state.id, "state");
                }, className: `p-1.5 rounded-lg hover:bg-white/20 ${selectedState?.id === state.id ? "text-white" : "text-gray-400"}`, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can text-[10px]" }) })
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
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: !selectedState ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-city text-3xl mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Select a state to view its cities" })
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
              className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm",
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
