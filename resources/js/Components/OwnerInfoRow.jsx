import React from "react";

const formatName = (name = "") => {
       const formatted = name
              .split(" ")
              .filter(Boolean)
              .slice(0, 5)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ") || "User";

       return formatted.length > 15 ? formatted.substring(0, 15) + "..." : formatted;
};

const buildAvatarUrl = (avatar) => {
       if (!avatar) return "/assets/images/user.jpg";
       if (avatar.startsWith("http")) return avatar;

       const normalized = String(avatar).replace(/\\/g, "/");
       if (normalized.startsWith("/")) return normalized;

       return `/${normalized.replace(/^\/+/, "")}`;
};

const OwnerInfoRow = ({
       owner = {},
       fallbackName = "",
       fallbackAvatar = "",
       isFeatured = false,
}) => {
       const displayName = formatName(owner?.name || fallbackName);
       const avatarSrc = buildAvatarUrl(owner?.profile || owner?.profile_pic || fallbackAvatar);
       const individualStatus = owner?.individual_verification?.status || owner?.individualVerification?.status;
       const corporateStatus = owner?.corporate_verification?.status || owner?.corporateVerification?.status;
       const isVerified = [individualStatus, corporateStatus].some(
              (status) => String(status || "").toLowerCase() === "verified" || String(status || "").toLowerCase() === "approved"
       );

       return (
              <div className="owner-info-row">
                     <img
                            src={avatarSrc}
                            alt={displayName}
                            onError={(e) => {
                                   e.currentTarget.src = "/assets/images/user.jpg";
                            }}
                     />
                     <div className="owner-info-row__content">
                            <span className="owner-info-row__identity">
                                   <span className="owner-info-row__name-text">{displayName}</span>
                                   {isVerified && (
                                          <span className="owner-info-row__verified" title="Verified seller" aria-label="Verified seller">
                                                 <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <circle cx="10" cy="10" r="8" fill="#2F80ED" />
                                                        <path d="M6.8 10.2L8.9 12.3L13.3 7.9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                 </svg>
                                          </span>
                                   )}
                            </span>
                            {isFeatured && (
                                   <span className="owner-info-row__featured">
                                          Featured
                                   </span>
                            )}
                     </div>
              </div>
       );
};

export default OwnerInfoRow;
