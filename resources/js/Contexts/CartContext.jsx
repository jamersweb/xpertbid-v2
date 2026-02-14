import { createContext, useContext, useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios'; // We still use axios for guest fetching if needed, or just localStorage

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
       const { auth, cart: sharedCartLists } = usePage().props;
       const user = auth.user;

       const [cartItems, setCartItems] = useState([]);
       const [cartCount, setCartCount] = useState(0);
       const [loading, setLoading] = useState(false);

       // Sync with Shared Props (Authenticated User)
       useEffect(() => {
              if (user && sharedCartLists) {
                     setCartItems(sharedCartLists);
                     setCartCount(sharedCartLists.length);
              }
       }, [user, sharedCartLists]);

       // Guest Mode: Load from Local Storage on Mount
       useEffect(() => {
              if (!user) {
                     const savedCart = localStorage.getItem('guestCart');
                     if (savedCart) {
                            try {
                                   const parsedCart = JSON.parse(savedCart);
                                   setCartItems(parsedCart);
                                   setCartCount(parsedCart.length);
                            } catch (e) {
                                   console.error("Failed to parse guest cart", e);
                                   localStorage.removeItem('guestCart');
                            }
                     } else {
                            setCartItems([]);
                            setCartCount(0);
                     }
              }
       }, [user]);

       // Save to local storage helper (Guest)
       const saveGuestCart = (items) => {
              localStorage.setItem('guestCart', JSON.stringify(items));
              setCartItems(items);
              setCartCount(items.length);
       };

       // Helper: Calculate Total Price
       const getTotalPrice = () => {
              return cartItems.reduce((total, item) => {
                     return total + (parseFloat(item.price) || 0);
              }, 0);
       };

       // Add Item to Cart
       const addToCart = async (auctionId, type = 'product', variationId = null, productDetails = null) => {
              if (!user) {
                     // --- GUEST LOGIC ---
                     try {
                            let price = 0;
                            let variationName = null;
                            let variationPrice = null;
                            let auction = {};

                            // 1. Use provided details if available
                            if (productDetails) {
                                   auction = productDetails;
                                   price = auction.buy_now_price || auction.minimum_bid || 0;

                                   if (variationId && auction.variations) {
                                          const foundVar = auction.variations.find(v => v.id == variationId);
                                          if (foundVar) {
                                                 price = foundVar.price;
                                                 variationName = foundVar.name;
                                                 variationPrice = foundVar.price;
                                          }
                                   }
                            } else {
                                   // Fallback: If we don't have details, we can't show them in the popup immediately.
                                   // For now, assume callers pass productDetails.
                                   return { success: false, message: "Product details required for guest cart." };
                            }

                            let itemToAdd = {
                                   id: 'guest_' + Date.now(),
                                   auction_id: auctionId,
                                   variation_id: variationId,
                                   type: type,
                                   quantity: 1,
                                   price: price,
                                   title: auction.title || 'Product',
                                   slug: auction.slug || '',
                                   image: auction.image || (Array.isArray(auction.album) ? auction.album[0] : auction.album) || '',
                                   list_type: auction.list_type,
                                   variation_name: variationName
                            };

                            // Check duplicate
                            const currentGuestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                            const existingItem = currentGuestCart.find(item =>
                                   item.auction_id == auctionId &&
                                   item.variation_id == variationId &&
                                   item.type == type
                            );

                            if (existingItem) {
                                   return { success: false, message: 'Product already in cart' };
                            }

                            const newCart = [...currentGuestCart, itemToAdd];
                            saveGuestCart(newCart);
                            return { success: true, message: 'Product added to cart successfully' };
                     } catch (error) {
                            console.error("Guest Add to Cart Error", error);
                            return { success: false, message: 'Failed to add to cart' };
                     }
              } else {
                     // --- AUTH LOGIC (Inertia) ---
                     return new Promise((resolve) => {
                            router.post(route('cart.add'), {
                                   auction_id: auctionId,
                                   type: type,
                                   variation_id: variationId
                            }, {
                                   preserveScroll: true,
                                   onSuccess: () => resolve({ success: true, message: 'Product added to cart' }),
                                   onError: (errors) => {
                                          // Extract first error message
                                          const msg = Object.values(errors)[0] || 'Failed to add to cart';
                                          resolve({ success: false, message: msg });
                                   }
                            });
                     });
              }
       };

       // Remove Item from Cart
       const removeFromCart = async (cartItemId) => {
              if (!user) {
                     // Guest
                     const currentGuestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                     const newCart = currentGuestCart.filter(item => item.id !== cartItemId);
                     saveGuestCart(newCart);
                     return { success: true, message: 'Item removed from cart' };
              } else {
                     // Auth
                     return new Promise((resolve) => {
                            router.delete(route('cart.remove', cartItemId), {
                                   preserveScroll: true,
                                   onSuccess: () => resolve({ success: true, message: 'Item removed from cart' }),
                                   onError: (errors) => {
                                          const msg = Object.values(errors)[0] || 'Failed to remove from cart';
                                          resolve({ success: false, message: msg });
                                   }
                            });
                     });
              }
       };

       // Clear Cart (Optional, mostly for after checkout)
       const clearCart = async () => {
              if (!user) {
                     localStorage.removeItem('guestCart');
                     setCartItems([]);
                     setCartCount(0);
              } else {
                     // If we had a route for clearing, we'd use it. 
                     // For now, maybe loop remove? Or just assume it's done server side on checkout.
              }
       };

       // No need for fetchCart() as it's handled by props
       const fetchCart = () => { };

       const value = {
              cartItems,
              cartCount,
              loading,
              addToCart,
              removeFromCart,
              clearCart,
              getTotalPrice,
              fetchCart
       };

       return (
              <CartContext.Provider value={value}>
                     {children}
              </CartContext.Provider>
       );
};
