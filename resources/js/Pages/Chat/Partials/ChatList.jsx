import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';

const ChatList = ({ onSelectConversation, selectedConversationId, currentUser, isAdminView = false, participantId = null }) => {
    const [conversations, setConversations] = useState([]);
    const [filter, setFilter] = useState('All'); 
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
        const handleFocus = () => fetchConversations();
        window.addEventListener('focus', handleFocus);
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isAdminView, participantId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.dropdown-trigger')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeDropdown]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get(route('chat.conversations.index'), {
                params: isAdminView ? { admin_view: 1, participant_id: participantId || undefined } : {},
            });
            setConversations(response.data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = async (e, action, conversationId) => {
        e.stopPropagation();
        setActiveDropdown(null);

        try {
            if (action === 'delete') {
                if (confirm('Are you sure you want to delete this chat?')) {
                    await axios.delete(route('chat.conversations.destroy', conversationId));
                    setConversations(prev => prev.filter(c => c.id !== conversationId));
                    if (selectedConversationId === conversationId) onSelectConversation(null);
                }
            } else if (action === 'important') {
                await axios.post(route('chat.conversations.important', conversationId));
                setConversations(prev => prev.map(c =>
                    c.id === conversationId ? { ...c, is_important: !c.is_important } : c
                ));
            }
        } catch (error) {
            console.error("Error performing action:", error);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        if (filter === 'Unread') return conv.unread_count > 0;
        if (filter === 'Important') return conv.is_important;
        return true;
    });

    const getAssetUrl = (path, fallback = '/assets/images/user.jpg') => {
        if (!path) return fallback;
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path;
        if (path.startsWith('assets/')) return `/${path}`;
        if (path.startsWith('storage/')) return `/${path}`;
        return `/storage/${path}`;
    };

    const renderMessageStatus = (message) => {
        if (isAdminView || !message || message.sender_id !== currentUser.id) return null;

        return message.is_read ? (
            <span className="flex items-center gap-1">
                <i className="fa-solid fa-check-double text-[10px]"></i>
                <span>Seen</span>
            </span>
        ) : (
            <span className="flex items-center gap-1">
                <i className="fa-solid fa-check text-[10px]"></i>
                <span>{message.body}</span>
            </span>
        );
    };

    // Last seen logic
    const getLastSeen = (dateString, userId) => {
        // v2 doesn't have useOnlineStatus yet, so we'll just use the date
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
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden font-sans">
            <div className="px-4 py-4 border-b border-gray-100 bg-white">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">INBOX</h2>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Unread Chats', 'Important'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f === 'Unread Chats' ? 'Unread' : f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${(filter === f || (filter === 'Unread' && f === 'Unread Chats'))
                                ? 'bg-black text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <i className="fa-regular fa-comments text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-sm font-medium">No chats found</p>
                    </div>
                ) : (
                    filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelectConversation(conv.id)}
                            className={`group px-4 py-3 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 relative ${selectedConversationId == conv.id ? 'bg-blue-50/50' : ''}`}
                        >
                            {/* Active Indicator Bar */}
                            {selectedConversationId == conv.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                            )}

                            <div className="flex gap-3">
                                <div className="relative flex-shrink-0 w-12 h-12">
                                    <img
                                        src={getAssetUrl(conv.other_user?.profile_pic)}
                                        alt="User"
                                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/user.jpg'; }}
                                    />
                                    {conv.other_user && getLastSeen(conv.other_user.last_active_at) === 'Online' && (
                                        <span className="absolute right-0.5 bottom-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="text-sm font-bold text-gray-900 truncate">
                                            {isAdminView
                                                ? `${conv.user_one?.name || 'Unknown'} -> ${conv.user_two?.name || 'Unknown'}`
                                                : (conv.other_user?.name || 'Unknown User')}
                                        </h4>
                                        <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                                            {new Date(conv.updated_at).toLocaleDateString() === new Date().toLocaleDateString()
                                                ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : new Date(conv.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Last Seen Status */}
                                    <div className="text-[10px] text-gray-400 mb-1">
                                        {getLastSeen((isAdminView ? conv.user_two?.last_active_at : conv.other_user?.last_active_at)) === 'Online' ? (
                                            <span className="text-green-500 font-medium">Online</span>
                                        ) : (
                                            <span>{getLastSeen((isAdminView ? conv.user_two?.last_active_at : conv.other_user?.last_active_at))}</span>
                                        )}
                                    </div>

                                    {conv.product && (
                                        <div className="text-xs font-semibold text-gray-700 truncate mb-1">
                                            {conv.product.title}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <p className={`text-xs truncate max-w-[85%] ${selectedConversationId == conv.id ? 'text-gray-700' : 'text-gray-500'}`}>
                                            {conv.last_message ? (
                                                conv.last_message.type === 'image' ? (
                                                    <span className="flex items-center gap-1"><i className="fa-regular fa-image"></i> Photo</span>
                                                ) : (
                                                    renderMessageStatus(conv.last_message) || (
                                                        <span className="flex items-center gap-1">
                                                            {conv.last_message.body}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="italic">Start the conversation</span>
                                            )}
                                        </p>
                                        
                                        {!isAdminView && <div className="relative dropdown-trigger">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === conv.id ? null : conv.id); }}
                                                className="text-gray-300 hover:text-gray-600 p-1"
                                            >
                                                <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                                            </button>

                                            {activeDropdown === conv.id && (
                                                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                                                    <button
                                                        onClick={(e) => handleOptionClick(e, 'important', conv.id)}
                                                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <i className={`fa-${conv.is_important ? 'solid' : 'regular'} fa-star ${conv.is_important ? 'text-yellow-400' : ''}`}></i>
                                                        {conv.is_important ? 'Unmark Important' : 'Important'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleOptionClick(e, 'delete', conv.id)}
                                                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;
