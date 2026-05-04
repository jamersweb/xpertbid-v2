import { jsx } from "react/jsx-runtime";
import Form from "./Form-BTHIk-lt.js";
import "./InputError-CuGgaxYl.js";
import "react";
import "./InputLabel-CE_n4Upz.js";
import "./PrimaryButton-DgVfVBwo.js";
import "./SecondaryButton-C9TQBbBR.js";
import "./AdminLayout-CjtavrEj.js";
import "@inertiajs/react";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Edit({ seo }) {
  return /* @__PURE__ */ jsx(
    Form,
    {
      title: "Edit SEO Record",
      heading: "Edit SEO Record",
      seo,
      submitLabel: "Update Record",
      submitRoute: route("admin.seo.update", seo.id),
      submitMethod: "put"
    }
  );
}
export {
  Edit as default
};
