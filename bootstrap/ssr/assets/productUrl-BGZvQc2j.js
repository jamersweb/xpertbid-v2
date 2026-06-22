import { jsx } from "react/jsx-runtime";
import { useState, useEffect, useContext, createContext } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
const CartContext = createContext();
const fallbackCartContext = {
  cartItems: [],
  cartCount: 0,
  loading: false,
  addToCart: async () => ({ success: false, message: "Cart is unavailable in this view." }),
  removeFromCart: async () => ({ success: false, message: "Cart is unavailable in this view." }),
  updateCartItem: async () => ({ success: false, message: "Cart is unavailable in this view." }),
  clearCart: async () => ({ success: true, message: "Cart cleared." }),
  getTotalPrice: () => 0,
  fetchCart: () => {
  }
};
const useCart = () => useContext(CartContext) || fallbackCartContext;
const CartProvider = ({ children }) => {
  const { auth, cart: sharedCartLists } = usePage().props;
  const user = auth?.user;
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user && sharedCartLists) {
      setCartItems(sharedCartLists);
      setCartCount(sharedCartLists?.length || 0);
    }
  }, [user, sharedCartLists]);
  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem("guestCart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
          setCartCount(Array.isArray(parsedCart) ? parsedCart.length : 0);
        } catch (e) {
          console.error("Failed to parse guest cart", e);
          localStorage.removeItem("guestCart");
          setCartItems([]);
          setCartCount(0);
        }
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    }
  }, [user]);
  const saveGuestCart = (items) => {
    localStorage.setItem("guestCart", JSON.stringify(items));
    setCartItems(items);
    setCartCount(items?.length || 0);
  };
  const getTotalPrice = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price || 0) * (item.quantity || 1);
    }, 0);
  };
  const getGroupSizeBounds = (listing = {}) => {
    const features = listing?.category_features && typeof listing.category_features === "object" ? listing.category_features : {};
    let min = null;
    let max = null;
    Object.entries(features).forEach(([key, value2]) => {
      const normalizedKey = String(key || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
      if (!normalizedKey.includes("group")) return;
      const numericValue = Number.parseInt(value2, 10);
      if (!Number.isFinite(numericValue)) return;
      if (normalizedKey.includes("min")) min = numericValue;
      if (normalizedKey.includes("max")) max = numericValue;
    });
    min = min && min > 0 ? min : 1;
    max = max && max >= min ? max : null;
    return { min, max };
  };
  const clampQuantity = (quantity, bounds = {}) => {
    const min = bounds.min && bounds.min > 0 ? bounds.min : 1;
    const max = bounds.max && bounds.max >= min ? bounds.max : null;
    let nextQuantity = Math.max(min, Number.parseInt(quantity, 10) || min);
    if (max) nextQuantity = Math.min(max, nextQuantity);
    return nextQuantity;
  };
  const addToCart = async (listingId, type = "product", variationId = null, productDetails = null) => {
    if (!user) {
      try {
        let price = 0;
        let variationName = null;
        let variationPrice = null;
        let listing = {};
        if (productDetails) {
          listing = productDetails;
          price = listing.buy_now_price || listing.minimum_bid || 0;
          if (variationId && listing.variations) {
            const foundVar = listing.variations.find((v) => v.id == variationId);
            if (foundVar) {
              price = foundVar.price;
              variationName = foundVar.name;
              variationPrice = foundVar.price;
            }
          }
        } else {
          return { success: false, message: "Product details required for guest cart." };
        }
        const groupSizeBounds = getGroupSizeBounds(listing);
        let itemToAdd = {
          id: "guest_" + Date.now(),
          listing_id: listingId,
          variation_id: variationId,
          type,
          quantity: groupSizeBounds.min,
          price,
          title: listing.title || "Product",
          slug: listing.slug || "",
          image: listing.image_url || (Array.isArray(listing.album) ? listing.album[0] : listing.album) || "",
          list_type: listing.list_type,
          variation_name: variationName,
          group_size_min: groupSizeBounds.min,
          group_size_max: groupSizeBounds.max
        };
        const currentGuestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existingItem = Array.isArray(currentGuestCart) && currentGuestCart.find(
          (item) => item.listing_id == listingId && item.variation_id == variationId && item.type == type
        );
        if (existingItem) {
          return { success: false, message: "Product already in cart" };
        }
        const newCart = [...Array.isArray(currentGuestCart) ? currentGuestCart : [], itemToAdd];
        saveGuestCart(newCart);
        return { success: true, message: "Product added to cart successfully" };
      } catch (error) {
        console.error("Guest Add to Cart Error", error);
        return { success: false, message: "Failed to add to cart" };
      }
    } else {
      return new Promise((resolve) => {
        router.post(route("cart.add"), {
          listing_id: listingId,
          type,
          variation_id: variationId,
          quantity: productDetails ? getGroupSizeBounds(productDetails).min : 1
        }, {
          preserveScroll: true,
          onSuccess: () => resolve({ success: true, message: "Product added to cart" }),
          onError: (errors) => {
            const msg = Object.values(errors)[0] || "Failed to add to cart";
            resolve({ success: false, message: msg });
          }
        });
      });
    }
  };
  const removeFromCart = async (cartItemId) => {
    if (!user) {
      const currentGuestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const newCart = Array.isArray(currentGuestCart) ? currentGuestCart.filter((item) => item.id !== cartItemId) : [];
      saveGuestCart(newCart);
      return { success: true, message: "Item removed from cart" };
    } else {
      return new Promise((resolve) => {
        router.delete(route("cart.remove", cartItemId), {
          preserveScroll: true,
          onSuccess: () => resolve({ success: true, message: "Item removed from cart" }),
          onError: (errors) => {
            const msg = Object.values(errors)[0] || "Failed to remove from cart";
            resolve({ success: false, message: msg });
          }
        });
      });
    }
  };
  const updateCartItem = async (cartItemId, quantity) => {
    if (!user) {
      const currentGuestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const newCart = Array.isArray(currentGuestCart) ? currentGuestCart.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: clampQuantity(quantity, {
              min: item.group_size_min,
              max: item.group_size_max
            })
          };
        }
        return item;
      }) : [];
      saveGuestCart(newCart);
      return { success: true, message: "Cart updated successfully" };
    } else {
      return new Promise((resolve) => {
        router.put(route("cart.update", cartItemId), {
          quantity
        }, {
          preserveScroll: true,
          onSuccess: () => resolve({ success: true, message: "Cart updated successfully" }),
          onError: (errors) => {
            const msg = Object.values(errors)[0] || "Failed to update cart";
            resolve({ success: false, message: msg });
          }
        });
      });
    }
  };
  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("guestCart");
      setCartItems([]);
      setCartCount(0);
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  };
  const fetchCart = () => {
  };
  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getTotalPrice,
    fetchCart
  };
  return /* @__PURE__ */ jsx(CartContext.Provider, { value, children });
};
const buildProductHref = (slug) => {
  if (!slug) {
    return "#";
  }
  const url = new URL(`/product/${slug}`, "http://localhost");
  return `${url.pathname}${url.search}${url.hash}`;
};
export {
  CartProvider as C,
  buildProductHref as b,
  useCart as u
};
