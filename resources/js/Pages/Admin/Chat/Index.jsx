import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ChatList from '@/Pages/Chat/Partials/ChatList';
import ChatWindow from '@/Pages/Chat/Partials/ChatWindow';
import axios from 'axios';

export default function AdminChatIndex() {
    const { auth } = usePage().props;
    const queryParams = new URLSearchParams(window.location.search);
    const initialConversationId = queryParams.get('conversation_id');
    const [selectedConversationId, setSelectedConversationId] = useState(
        initialConversationId ? parseInt(initialConversationId, 10) : null
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedParticipantId, setSelectedParticipantId] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            if (searchTerm.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            try {
                const response = await axios.get(route('admin.bidder-communication.search-users', { q: searchTerm }));
                setSearchResults(response.data || []);
            } catch (error) {
                setSearchResults([]);
            }
        };

        const timer = setTimeout(loadUsers, 250);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <AdminLayout title="Chat">
            <Head title="Admin Chat" />
            <div className="bg-gray-50 min-h-[calc(100vh-110px)]">
                <div className="mx-auto w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Chat Inbox</h1>
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search user (name, email, phone)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            <select
                                value={selectedParticipantId || ''}
                                onChange={(e) => {
                                    const next = e.target.value ? Number(e.target.value) : null;
                                    setSelectedParticipantId(next);
                                    setSelectedConversationId(null);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">All Users Conversations</option>
                                {searchResults.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email || user.phone || `ID ${user.id}`})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedParticipantId(null);
                                    setSearchTerm('');
                                    setSearchResults([]);
                                    setSelectedConversationId(null);
                                }}
                                className="w-full md:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-220px)] min-h-[620px]">
                        <div className={`w-full xl:w-[360px] ${selectedConversationId ? 'hidden xl:block' : 'block'}`}>
                            <ChatList
                                onSelectConversation={setSelectedConversationId}
                                selectedConversationId={selectedConversationId}
                                currentUser={auth.user}
                                isAdminView
                                participantId={selectedParticipantId}
                            />
                        </div>

                        <div className={`w-full flex-1 ${selectedConversationId ? 'block' : 'hidden xl:block'}`}>
                            {selectedConversationId ? (
                                <ChatWindow
                                    conversationId={selectedConversationId}
                                    currentUser={auth.user}
                                    onBack={() => setSelectedConversationId(null)}
                                    isAdminView
                                />
                            ) : (
                                <div className="h-full border rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-gray-500 p-8">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <i className="fa-regular fa-comments text-3xl text-blue-500"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">Select a conversation</h3>
                                    <p className="text-sm mt-2">Choose a chat from the list to start messaging</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
