import React, { useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import ChatList from './Partials/ChatList';
import ChatWindow from './Partials/ChatWindow';

export default function Index({ auth, openConversationId = null }) {
    const [selectedConversationId, setSelectedConversationId] = useState(
        openConversationId ? Number(openConversationId) : null
    );
    const [accessError, setAccessError] = useState('');

    // Drop legacy ?conversation_id= from the address bar (IDs must not stay in the URL)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        if (!url.searchParams.has('conversation_id')) return;
        url.searchParams.delete('conversation_id');
        const clean = `${url.pathname}${url.search}${url.hash}`;
        window.history.replaceState({}, '', clean);
    }, []);

    const handleUnauthorized = () => {
        setSelectedConversationId(null);
        setAccessError('You do not have access to that conversation.');
    };

    return (
        <AppLayout title="My Messages">
            <Head title="My Messages" />
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">My Messages</h1>

                    {accessError ? (
                        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                            {accessError}
                        </div>
                    ) : null}

                    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
                        <div className={`w-full md:w-1/3 lg:w-1/4 ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
                            <ChatList
                                onSelectConversation={(id) => {
                                    setAccessError('');
                                    setSelectedConversationId(id);
                                }}
                                selectedConversationId={selectedConversationId}
                                currentUser={auth.user}
                            />
                        </div>

                        <div className={`w-full md:w-2/3 lg:w-3/4 ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
                            {selectedConversationId ? (
                                <ChatWindow
                                    conversationId={selectedConversationId}
                                    currentUser={auth.user}
                                    onBack={() => setSelectedConversationId(null)}
                                    onUnauthorized={handleUnauthorized}
                                />
                            ) : (
                                <div className="h-full border rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-gray-500 p-8">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <i className="fa-regular fa-comments text-3xl text-blue-500"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">Select a conversation</h3>
                                    <p className="text-sm mt-2">Choose a chat from the left to start messaging</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
