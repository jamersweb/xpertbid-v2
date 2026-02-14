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
       const clean = avatar.replace(/^\/+/, "");
       return `https://admin.xpertbid.com/${clean}`;
};

const OwnerInfoRow = ({
       owner = {},
       fallbackName = "",
       fallbackAvatar = "",
}) => {
       const displayName = formatName(owner?.name || fallbackName);
       const avatarSrc = buildAvatarUrl(owner?.profile || owner?.profile_pic || fallbackAvatar);

       return (
              <div className="owner-info-row">
                     <img
                            src={avatarSrc}
                            alt={displayName}
                            onError={(e) => {
                                   e.currentTarget.src = "/assets/images/user.jpg";
                            }}
                     />
                     <span>{displayName}</span>
              </div>
       );
};

export default OwnerInfoRow;
