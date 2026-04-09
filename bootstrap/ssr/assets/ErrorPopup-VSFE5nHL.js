import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SuccessPopup = ({
  isOpen,
  onClose,
  message = "Bid Placed Successfully",
  subMessage = "Your bid has been recorded!"
}) => {
  if (!isOpen) return null;
  const handleClose = () => {
    if (onClose) onClose();
  };
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    },
    popup: {
      background: "linear-gradient(135deg, #ffffff, #ffff)",
      padding: "50px 60px",
      borderRadius: "16px",
      textAlign: "center",
      position: "relative",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      border: "1px solid #cceeff",
      maxWidth: "500px",
      width: "90%",
      margin: "0 auto"
    },
    closeBtn: {
      position: "absolute",
      top: "10px",
      right: "20px",
      border: "none",
      background: "transparent",
      fontSize: "20px",
      cursor: "pointer"
    },
    imageContainer: {
      marginBottom: "20px"
    },
    successImage: {
      width: "100px",
      height: "100px"
    },
    message: {
      fontSize: "30px",
      fontWeight: "bolder",
      color: "#5cb85c",
      marginBottom: "10px"
    },
    subMessage: {
      fontSize: "18px",
      color: "#555",
      marginBottom: "10px",
      lineHeight: 1.5,
      wordWrap: "break-word",
      overflowWrap: "break-word"
    }
  };
  return /* @__PURE__ */ jsx("div", { style: styles.overlay, onClick: handleClose, children: /* @__PURE__ */ jsxs("div", { style: styles.popup, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { style: styles.closeBtn, onClick: handleClose, children: "✕" }),
    /* @__PURE__ */ jsx("div", { style: styles.imageContainer, children: /* @__PURE__ */ jsx("img", { src: "/assets/images/successimg.png", alt: "Success", style: styles.successImage }) }),
    /* @__PURE__ */ jsx("div", { style: styles.message, children: message }),
    /* @__PURE__ */ jsx("div", { style: styles.subMessage, children: subMessage })
  ] }) });
};
const ErrorPopup = ({
  isOpen,
  onClose,
  message = "Error Occurred",
  subMessage = "Something went wrong."
}) => {
  if (!isOpen) return null;
  const handleClose = () => {
    if (onClose) onClose();
  };
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e4
    },
    popup: {
      background: "linear-gradient(135deg, #ffffff, #ffff)",
      padding: "50px 60px",
      borderRadius: "16px",
      textAlign: "center",
      position: "relative",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      border: "1px solid #cceeff",
      maxWidth: "700px",
      width: "90%",
      margin: "0 auto"
    },
    closeBtn: {
      position: "absolute",
      top: "10px",
      right: "20px",
      border: "none",
      background: "transparent",
      fontSize: "20px",
      cursor: "pointer"
    },
    imageContainer: {
      marginBottom: "20px"
    },
    errorImage: {
      width: "100px",
      height: "100px"
    },
    message: {
      fontSize: "30px",
      fontWeight: "bolder",
      color: "red",
      marginBottom: "10px"
    },
    subMessage: {
      fontSize: "20px",
      color: "#555",
      marginBottom: "10px"
    }
  };
  return /* @__PURE__ */ jsx("div", { style: styles.overlay, onClick: handleClose, children: /* @__PURE__ */ jsxs("div", { style: styles.popup, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { style: styles.closeBtn, onClick: handleClose, children: "✕" }),
    /* @__PURE__ */ jsx("div", { style: styles.imageContainer, children: /* @__PURE__ */ jsx("img", { src: "/assets/images/errorimg.avif", alt: "Error", style: styles.errorImage }) }),
    /* @__PURE__ */ jsx("div", { style: styles.message, children: message }),
    /* @__PURE__ */ jsx("div", { style: styles.subMessage, children: subMessage })
  ] }) });
};
export {
  ErrorPopup as E,
  SuccessPopup as S
};
