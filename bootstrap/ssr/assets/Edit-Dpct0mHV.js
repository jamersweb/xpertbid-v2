import { jsx } from "react/jsx-runtime";
import Form from "./Form-gg9RFfRF.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-CE_n4Upz.js";
import "./PrimaryButton-DgVfVBwo.js";
import "./SecondaryButton-C9TQBbBR.js";
import "./TextInput-DDsS-qQQ.js";
import "react";
import "./AdminLayout-eq3vmVvI.js";
import "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
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
