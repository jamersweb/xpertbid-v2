import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import Price from '../../../Components/Price';

const ChatWindow = ({ conversationId, currentUser, onBack, onUnauthorized, isAdminView = false }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const messagesEndRef = useRef(null);
    const [otherUser, setOtherUser] = useState(null);
    const [product, setProduct] = useState(null);
    const [buyerRequestOffer, setBuyerRequestOffer] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const clearLocalState = () => {
        setConversation(null);
        setMessages([]);
        setOtherUser(null);
        setProduct(null);
        setBuyerRequestOffer(null);
    };

    const fetchData = async () => {
        if (conversationId) {
            try {
                const response = await axios.get(route('chat.conversations.show', conversationId), {
                    params: isAdminView ? { admin_view: 1 } : {},
                });
                const data = response.data;
                setConversation(data);
                setMessages(data.messages || []);
                const other = isAdminView
                    ? data.user_two
                    : (data.user_one_id === currentUser.id ? data.user_two : data.user_one);
                setOtherUser(other);
                setProduct(data.product);
                setBuyerRequestOffer(data.buyer_request_offer || data.buyerRequestOffer || null);
            } catch (error) {
                const status = error?.response?.status;
                if (status === 403 || status === 404) {
                    clearLocalState();
                    if (typeof onUnauthorized === 'function') {
                        onUnauthorized();
                    } else if (typeof onBack === 'function') {
                        onBack();
                    }
                    return;
                }
                console.error("Error fetching messages:", error);
            }
        }
    };

    useEffect(() => {
        if (conversationId) {
            setLoading(true);
            fetchData().finally(() => {
                setLoading(false);
                setTimeout(scrollToBottom, 100);
            });

            const pollInterval = setInterval(() => {
                fetchData();
            }, 5000);

            // Echo Listener
            if (window.Echo) {
                window.Echo.private(`chat.${conversationId}`)
                    .listen('MessageSent', (e) => {
                        setMessages(prev => {
                            if (prev.some(m => m.id === e.message.id)) return prev;
                            return [...prev, e.message];
                        });
                        scrollToBottom();
                    });

                return () => {
                    clearInterval(pollInterval);
                    window.Echo.leave(`chat.${conversationId}`);
                };
            }

            return () => {
                clearInterval(pollInterval);
            };
        }
    }, [conversationId]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTo({
                top: messagesEndRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (content, file = null) => {
        if ((!content || !content.trim()) && !file) return;

        const formData = new FormData();
        formData.append('conversation_id', conversationId);
        if (content && content.trim()) formData.append('body', content);
        if (file) formData.append('attachment', file);

        try {
            if (isAdminView) {
                formData.append('admin_view', '1');
            }
            const response = await axios.post(route('chat.messages.store'), formData);
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            setAttachment(null);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        sendMessage(newMessage, attachment);
    };

    const handleOptionClick = async (action) => {
        setShowOptions(false);
        try {
            if (action === 'delete') {
                if (confirm('Are you sure you want to delete this chat?')) {
                    await axios.delete(route('chat.conversations.destroy', conversationId));
                    if (onBack) onBack();
                }
            } else if (action === 'important') {
                await axios.post(route('chat.conversations.important', conversationId));
                setConversation(prev => ({ ...prev, is_important: !prev.is_important }));
            }
        } catch (error) {
            console.error("Error performing action:", error);
        }
    };

    const getAssetUrl = (path, fallback = '/assets/images/user.jpg') => {
        if (!path) return fallback;
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path;
        if (path.startsWith('assets/')) return `/${path}`;
        if (path.startsWith('storage/')) return `/${path}`;
        return `/storage/${path}`;
    };

    const normalizedProductListType = String(product?.list_type || product?.listing_type || '').toLowerCase();
    const isDirectSaleProduct =
        normalizedProductListType === 'normal' ||
        normalizedProductListType === 'normal_list' ||
        normalizedProductListType === 'business' ||
        normalizedProductListType === 'business_list';
    const baseProductPrice = Number(product?.buy_now_price || product?.minimum_bid || 0);
    const productDiscountValue = Number(product?.discount_value || 0);
    const hasProductDiscount = isDirectSaleProduct && productDiscountValue > 0;
    const finalProductPrice = (() => {
        if (!hasProductDiscount) return baseProductPrice;
        if (product?.discount_type === 'percent') {
            return Math.max(0, baseProductPrice - (baseProductPrice * (productDiscountValue / 100)));
        }
        if (product?.discount_type === 'flat') {
            return Math.max(0, baseProductPrice - productDiscountValue);
        }
        return baseProductPrice;
    })();

    // Participants
    const userOne = conversation?.user_one || conversation?.userOne || null;
    const userTwo = conversation?.user_two || conversation?.userTwo || null;

    const getUserRole = (userId) => {
        if (!userId) return '';
        if (buyerRequestOffer) {
            const sellerId = buyerRequestOffer.seller_id;
            const buyerId = (buyerRequestOffer.buyer_request || buyerRequestOffer.buyerRequest)?.user_id;
            if (userId === sellerId) return 'Seller';
            if (userId === buyerId) return 'Buyer';
        }
        if (product) {
            if (userId === product.user_id) return 'Seller';
            return 'Buyer';
        }
        if (userId === conversation?.user_one_id) return 'User 1';
        if (userId === conversation?.user_two_id) return 'User 2';
        return 'User';
    };

    // Last seen logic
    const getLastSeen = (dateString, userId) => {
        if (!dateString) return 'Offline';
        const formattedDate = dateString.includes('T') ? dateString : dateString.replace(' ', 'T') + 'Z';
        const date = new Date(formattedDate);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return 'Online'; 
        if (diff < 3600) return `Last seen ${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `Last seen ${Math.floor(diff / 3600)}h ago`;
        return `Last seen ${date.toLocaleDateString()}`;
    };

    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden font-sans shadow-sm w-full">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    {isAdminView ? (
                        <div className="flex items-center justify-between w-full gap-2">
                            {/* Left: User One */}
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <button
                                    onClick={onBack}
                                    className="md:hidden text-gray-500 hover:text-gray-700 p-1 mr-1"
                                >
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <div className="relative w-10 h-10 flex-shrink-0">
                                    <img
                                        src={getAssetUrl(userOne?.profile_pic)}
                                        alt={userOne?.name || 'User 1'}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/user.jpg'; }}
                                    />
                                    {userOne?.last_active_at && getLastSeen(userOne.last_active_at) === 'Online' && (
                                        <span className="absolute right-0.5 bottom-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h3 className="font-bold text-gray-900 text-sm truncate" title={userOne?.name}>
                                            {userOne?.name || 'User 1'}
                                        </h3>
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                            {getUserRole(userOne?.id)}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-gray-500 truncate">
                                        {userOne?.last_active_at && getLastSeen(userOne.last_active_at) === 'Online' ? (
                                            <span className="text-green-600 font-medium">Online</span>
                                        ) : (
                                            getLastSeen(userOne?.last_active_at)
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Center: Exchange Badge */}
                            <div className="flex flex-col items-center px-2 flex-shrink-0">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100 shadow-2xs">
                                    <i className="fa-solid fa-arrows-left-right text-[10px]"></i>
                                    Chatting
                                </span>
                            </div>

                            {/* Right: User Two */}
                            <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-end text-right">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 justify-end flex-wrap">
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                            {getUserRole(userTwo?.id)}
                                        </span>
                                        <h3 className="font-bold text-gray-900 text-sm truncate" title={userTwo?.name}>
                                            {userTwo?.name || 'User 2'}
                                        </h3>
                                    </div>
                                    <div className="text-[11px] text-gray-500 truncate">
                                        {userTwo?.last_active_at && getLastSeen(userTwo.last_active_at) === 'Online' ? (
                                            <span className="text-green-600 font-medium">Online</span>
                                        ) : (
                                            getLastSeen(userTwo?.last_active_at)
                                        )}
                                    </div>
                                </div>
                                <div className="relative w-10 h-10 flex-shrink-0">
                                    <img
                                        src={getAssetUrl(userTwo?.profile_pic)}
                                        alt={userTwo?.name || 'User 2'}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/user.jpg'; }}
                                    />
                                    {userTwo?.last_active_at && getLastSeen(userTwo.last_active_at) === 'Online' && (
                                        <span className="absolute right-0.5 bottom-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onBack}
                                className="md:hidden text-gray-500 hover:text-gray-700 p-1"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>

                            <div className="relative w-10 h-10 flex-shrink-0">
                                <img
                                    src={getAssetUrl(otherUser?.profile_pic)}
                                    alt={otherUser?.name}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/user.jpg'; }}
                                />
                                {otherUser?.last_active_at && getLastSeen(otherUser.last_active_at) === 'Online' && (
                                    <span className="absolute right-0.5 bottom-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800 text-base leading-tight">
                                    {otherUser?.name || 'Loading...'}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500">
                                    {otherUser?.last_active_at && getLastSeen(otherUser.last_active_at) === 'Online' ? (
                                        <span className="text-green-500 font-medium">Online</span>
                                    ) : (
                                        <span>{getLastSeen(otherUser?.last_active_at)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {!isAdminView && <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        {showOptions && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                                <button
                                    onClick={() => handleOptionClick('important')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <i className={`fa-${conversation?.is_important ? 'solid' : 'regular'} fa-star ${conversation?.is_important ? 'text-yellow-400' : ''}`}></i>
                                    {conversation?.is_important ? 'Unmark Important' : 'Mark Important'}
                                </button>
                                <button
                                    onClick={() => handleOptionClick('delete')}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <i className="fa-regular fa-trash-can"></i> Delete Chat
                                </button>
                            </div>
                        )}
                    </div>}
                </div>

                {/* Product Bar */}
                {product && (
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img
                                src={getAssetUrl(product.image_url || product.image, '/assets/images/image.png')}
                                alt={product.title}
                                className="w-10 h-10 rounded object-cover border border-gray-200"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/image.png'; }}
                            />
                            <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-gray-900 truncate max-w-[200px]">{product.title}</h4>
                                <p className="text-sm font-bold text-gray-800">
                                    <Price amountAED={finalProductPrice} />
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route('product.show', product.slug || product.id)}
                            className="bg-gray-900 hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                            View
                        </Link>
                    </div>
                )}

                {/* Buyer request offer bar */}
                {!product && buyerRequestOffer && (() => {
                    const request = buyerRequestOffer.buyer_request || buyerRequestOffer.buyerRequest || {};
                    const firstImage = (request.images || [])[0];
                    const imageUrl = firstImage?.url || firstImage?.path || '';
                    const hasImage = Boolean(String(imageUrl || '').trim());
                    const offerPrice = Number(buyerRequestOffer.price || 0);
                    const requestHref = request.slug || request.id
                        ? route('buyer-requests.show', request.slug || request.id)
                        : null;

                    return (
                        <div className="bg-sky-50 px-4 py-2 border-t border-sky-100 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                {hasImage && (
                                    <img
                                        src={getAssetUrl(imageUrl)}
                                        alt={request.title || 'Buyer request'}
                                        className="w-10 h-10 rounded object-cover border border-sky-100 bg-white"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className="min-w-0">
                                    <div className="text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                                        Buyer request
                                    </div>
                                    <h4 className="text-xs font-semibold text-gray-900 truncate max-w-[200px]">
                                        {request.title || 'Request'}
                                    </h4>
                                    <p className="text-sm font-bold text-gray-800">
                                        Offer: <Price amountPKR={offerPrice} />
                                    </p>
                                </div>
                            </div>
                            {requestHref && (
                                <Link
                                    href={requestHref}
                                    className="bg-gray-900 hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap no-underline"
                                >
                                    View
                                </Link>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* Messages Area */}
            <div
                ref={messagesEndRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 scrollbar-hide"
            >
                {loading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500 text-sm">Loading...</div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="bg-blue-50 p-6 rounded-full mb-4">
                            <i className="fa-regular fa-paper-plane text-4xl text-blue-400"></i>
                        </div>
                        <p className="font-medium text-gray-600">No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        let isSenderRight = false;
                        let senderName = msg.sender?.name || 'User';
                        let senderAvatar = msg.sender?.profile_pic;
                        let senderRole = '';
                        let bubbleClasses = '';
                        let textClasses = '';
                        let subTextClasses = '';
                        let isSenderAdmin = false;

                        if (isAdminView) {
                            if (msg.sender_id === conversation?.user_two_id) {
                                isSenderRight = true;
                                senderName = userTwo?.name || msg.sender?.name || 'User 2';
                                senderAvatar = userTwo?.profile_pic || msg.sender?.profile_pic;
                                senderRole = getUserRole(userTwo?.id);
                                bubbleClasses = 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm';
                                textClasses = 'text-white';
                                subTextClasses = 'text-blue-100 justify-end';
                            } else if (msg.sender_id === conversation?.user_one_id) {
                                isSenderRight = false;
                                senderName = userOne?.name || msg.sender?.name || 'User 1';
                                senderAvatar = userOne?.profile_pic || msg.sender?.profile_pic;
                                senderRole = getUserRole(userOne?.id);
                                bubbleClasses = 'bg-white text-gray-800 border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm';
                                textClasses = 'text-gray-800';
                                subTextClasses = 'text-gray-400';
                            } else {
                                isSenderAdmin = true;
                                isSenderRight = true;
                                senderName = msg.sender?.name ? `${msg.sender.name} (Admin)` : 'Admin';
                                senderAvatar = msg.sender?.profile_pic;
                                senderRole = 'Admin';
                                bubbleClasses = 'bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-sm';
                                textClasses = 'text-white';
                                subTextClasses = 'text-slate-300 justify-end';
                            }
                        } else {
                            const isMe = msg.sender_id === currentUser.id;
                            isSenderRight = isMe;
                            bubbleClasses = isMe
                                ? 'bg-blue-600 text-white rounded-2xl rounded-br-none shadow-sm'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none shadow-sm';
                            textClasses = isMe ? 'text-white' : 'text-gray-800';
                            subTextClasses = isMe ? 'text-blue-100 justify-end' : 'text-gray-400';
                        }

                        const isLatestOwnMessage = msg.sender_id === currentUser.id && index === messages.length - 1;

                        return (
                            <div
                                key={msg.id || index}
                                className={`flex items-end gap-2 ${isSenderRight ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Left Avatar for User One in Admin View */}
                                {isAdminView && !isSenderRight && (
                                    <img
                                        src={getAssetUrl(senderAvatar)}
                                        alt={senderName}
                                        title={`${senderName} (${senderRole})`}
                                        className="w-7 h-7 rounded-full object-cover border border-gray-200 shadow-2xs mb-1 flex-shrink-0"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/user.jpg'; }}
                                    />
                                )}

                                <div className={`max-w-[82%] sm:max-w-[70%] px-4 py-2.5 text-sm ${bubbleClasses}`}>
                                    {/* Sender Label in Admin View */}
                                    {isAdminView && (
                                        <div className={`flex items-center gap-1.5 mb-1 pb-1 border-b text-[11px] font-semibold ${
                                            isSenderRight
                                                ? (isSenderAdmin ? 'border-slate-800 text-amber-400 justify-end' : 'border-blue-500/40 text-blue-100 justify-end')
                                                : 'border-slate-100 text-slate-800'
                                        }`}>
                                            <span>{senderName}</span>
                                            {senderRole && (
                                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                    isSenderRight
                                                        ? (isSenderAdmin ? 'bg-amber-400/20 text-amber-300' : 'bg-blue-700/60 text-white')
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {senderRole}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Image Attachment */}
                                    {msg.type === 'image' && (
                                        <div className="mb-2">
                                            <img
                                                src={getAssetUrl(msg.attachment_path, '/assets/images/image.png')}
                                                alt="Attachment"
                                                className="rounded-lg max-h-60 object-cover w-full"
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/image.png'; }}
                                            />
                                        </div>
                                    )}

                                    {/* Document Attachment */}
                                    {msg.type === 'file' && msg.attachment_path && (
                                        <div className="mb-2">
                                            <a
                                                href={getAssetUrl(msg.attachment_path, '/assets/images/image.png')}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                                                    isSenderRight ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <i className="fa-regular fa-file-lines"></i>
                                                <span>Open document</span>
                                            </a>
                                        </div>
                                    )}

                                    <p className={`whitespace-pre-wrap break-words leading-relaxed ${textClasses}`}>{msg.body}</p>

                                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${subTextClasses}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {msg.sender_id === currentUser.id && (
                                            msg.is_read ? (
                                                <>
                                                    <i className="fa-solid fa-check-double text-[10px]"></i>
                                                    {isLatestOwnMessage && <span className="text-[10px]">Seen</span>}
                                                </>
                                            ) : (
                                                <i className="fa-solid fa-check text-[10px]"></i>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Right Avatar for User Two / Admin in Admin View */}
                                {isAdminView && isSenderRight && (
                                    <img
                                        src={getAssetUrl(senderAvatar)}
                                        alt={senderName}
                                        title={`${senderName} (${senderRole})`}
                                        className="w-7 h-7 rounded-full object-cover border border-gray-200 shadow-2xs mb-1 flex-shrink-0"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/user.jpg'; }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200">
                {isAdminView && (
                    <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] flex items-center gap-2 font-medium">
                        <i className="fa-solid fa-shield-halved text-blue-600"></i>
                        <span>Admin Observation Mode: Live conversation between <strong>{userOne?.name || 'User 1'}</strong> and <strong>{userTwo?.name || 'User 2'}</strong>. Any message you type will be sent as Admin.</span>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
                    {[
                        "Hello",
                        "Is it available?",
                        "Okay",
                        "No problem",
                        "What's the condition?",
                        "Price negotiable?",
                    ].map((text) => (
                        <button
                            key={text}
                            onClick={() => sendMessage(text)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 whitespace-nowrap transition-colors"
                        >
                            {text}
                        </button>
                    ))}
                </div>

                <div className="p-3">
                    {attachment && (
                        <div className="mb-2 px-3 py-2 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-paperclip text-gray-400"></i>
                                <span className="text-xs text-gray-700 truncate max-w-[200px]">{attachment.name}</span>
                            </div>
                            <button
                                onClick={() => setAttachment(null)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <label className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
                            <i className="fa-solid fa-paperclip text-lg"></i>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                onChange={(e) => setAttachment(e.target.files[0])}
                            />
                        </label>

                        <div className="flex-1 min-w-0 bg-gray-100 rounded-lg flex items-center px-4 py-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={isAdminView ? "Type a message as Admin in this chat..." : "Type a message..."}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500 text-sm p-1 leading-6 w-full"
                                style={{ outline: 'none', boxShadow: 'none' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!newMessage.trim() && !attachment}
                            className={`p-2 rounded-full flex items-center justify-center transition-all ${!newMessage.trim() && !attachment
                                ? 'text-gray-300'
                                : 'text-blue-600 hover:bg-blue-50'
                                }`}
                        >
                            <i className="fa-solid fa-paper-plane text-xl"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
