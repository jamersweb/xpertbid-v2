import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function FavoriteToggleButton({ listingId, className = "" }) {
       const { auth, favoriteListingIds = [] } = usePage().props;
       const [isFavorite, setIsFavorite] = useState(favoriteListingIds.includes(listingId));
       const [isSubmitting, setIsSubmitting] = useState(false);

       useEffect(() => {
              setIsFavorite(favoriteListingIds.includes(listingId));
       }, [favoriteListingIds, listingId]);

       const handleToggle = (event) => {
              event.preventDefault();
              event.stopPropagation();

              if (!auth?.user) {
                     router.visit(route("login"));
                     return;
              }

              if (isSubmitting) {
                     return;
              }

              const nextValue = !isFavorite;
              setIsFavorite(nextValue);
              setIsSubmitting(true);

              router.post(
                     route("favorites.toggle"),
                     { listing_id: listingId },
                     {
                            preserveScroll: true,
                            preserveState: true,
                            only: ["favoriteListingIds"],
                            onError: () => {
                                   setIsFavorite(!nextValue);
                            },
                            onFinish: () => {
                                   setIsSubmitting(false);
                            },
                     }
              );
       };

       return (
              <button
                     type="button"
                     className={`product-favorite-btn ${isFavorite ? "is-active" : ""} ${className}`.trim()}
                     onClick={handleToggle}
                     aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                     title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path
                                   d="M12 20.6L10.55 19.28C5.4 14.61 2 11.53 2 7.75C2 4.67 4.42 2.25 7.5 2.25C9.24 2.25 10.91 3.06 12 4.33C13.09 3.06 14.76 2.25 16.5 2.25C19.58 2.25 22 4.67 22 7.75C22 11.53 18.6 14.61 13.45 19.29L12 20.6Z"
                                   stroke="currentColor"
                                   strokeWidth="1.8"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   fill={isFavorite ? "currentColor" : "none"}
                            />
                     </svg>
              </button>
       );
}
