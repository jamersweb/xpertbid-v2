import { jsx } from "react/jsx-runtime";
import Form from "./Form-S_m1M7vU.js";
import "./InputError-CuGgaxYl.js";
import "react";
import "./InputLabel-CE_n4Upz.js";
import "./PrimaryButton-DgVfVBwo.js";
import "./SecondaryButton-C9TQBbBR.js";
import "./AdminLayout-CCDzOvsD.js";
import "@inertiajs/react";
import "./CurrencyPicker-BYSFLoir.js";
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
