import Swal from "sweetalert2";
async function confirmAction({
  title = "Are you sure?",
  text = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon = "warning",
  danger = false
} = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    reverseButtons: true,
    focusCancel: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? "#DC2626" : "#23262F",
    cancelButtonColor: "#E5E7EB",
    background: "#ffffff",
    color: "#111827",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl shadow-xl border border-gray-100 px-2 py-4",
      title: "text-lg font-bold text-gray-900",
      htmlContainer: "text-sm text-slate-600",
      actions: "gap-2 mt-4",
      confirmButton: danger ? "inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700" : "inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800",
      cancelButton: "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    }
  });
  return result.isConfirmed;
}
async function alertAction({
  title = "Notice",
  text = "",
  icon = "info",
  confirmText = "OK"
} = {}) {
  await Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: confirmText,
    buttonsStyling: false,
    background: "#ffffff",
    color: "#111827",
    customClass: {
      popup: "rounded-2xl shadow-xl border border-gray-100 px-2 py-4",
      title: "text-lg font-bold text-gray-900",
      htmlContainer: "text-sm text-slate-600",
      confirmButton: "inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
    }
  });
}
export {
  alertAction as a,
  confirmAction as c
};
