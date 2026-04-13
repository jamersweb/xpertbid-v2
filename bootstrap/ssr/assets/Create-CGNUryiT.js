import { jsx } from "react/jsx-runtime";
import Form from "./Form-CbgMiL6S.js";
import "./InputError-CuGgaxYl.js";
import "react";
import "./InputLabel-CE_n4Upz.js";
import "./PrimaryButton-DgVfVBwo.js";
import "./SecondaryButton-C9TQBbBR.js";
import "./AdminLayout-d9CWnUKb.js";
import "@inertiajs/react";
import "./CurrencyPicker-BYSFLoir.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Create() {
  return /* @__PURE__ */ jsx(
    Form,
    {
      title: "Add SEO Record",
      heading: "Add SEO Record",
      submitLabel: "Create Record",
      submitRoute: route("admin.seo.store")
    }
  );
}
export {
  Create as default
};
