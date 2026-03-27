import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import ChatList from './Partials/ChatList';
import ChatWindow from './Partials/ChatWindow';

export default function Index({ auth }) {
    const queryParams = new URLSearchParams(window.location.search);
    const initialConversationId = queryParams.get('conversation_id');
    const [selectedConversationId, setSelectedConversationId] = useState(initialConversationId ? parseInt(initialConversationId) : null);

    return (
        <AppLayout title="My Messages">
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">My Messages</h1>
                    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
                        {/* Chat List Sidebar */}
                        <div className={`w-full md:w-1/3 lg:w-1/4 ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
                            <ChatList 
                                onSelectConversation={setSelectedConversationId} 
                                selectedConversationId={selectedConversationId}
                                currentUser={auth.user}
                            />
                        </div>

                        {/* Chat Window */}
                        <div className={`w-full md:w-2/3 lg:w-3/4 ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
                            {selectedConversationId ? (
                                <ChatWindow 
                                    conversationId={selectedConversationId} 
                                    currentUser={auth.user}
                                    onBack={() => setSelectedConversationId(null)}
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
