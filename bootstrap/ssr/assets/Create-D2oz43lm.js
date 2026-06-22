import { jsx } from "react/jsx-runtime";
import Form from "./Form-u5Lh3tZu.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-CE_n4Upz.js";
import "./PrimaryButton-DgVfVBwo.js";
import "./SecondaryButton-C9TQBbBR.js";
import "./TextInput-DDsS-qQQ.js";
import "react";
import "./AdminLayout-C1RliH-Q.js";
import "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
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
