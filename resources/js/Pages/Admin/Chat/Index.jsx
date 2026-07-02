import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ChatList from '@/Pages/Chat/Partials/ChatList';
import ChatWindow from '@/Pages/Chat/Partials/ChatWindow';
import ExportCsvButton from '@/Components/Admin/ExportCsvButton';

export default function AdminChatIndex() {
    const { auth } = usePage().props;
    const queryParams = new URLSearchParams(window.location.search);
    const initialConversationId = queryParams.get('conversation_id');
    const [selectedConversationId, setSelectedConversationId] = useState(
        initialConversationId ? parseInt(initialConversationId, 10) : null
    );
    return (
        <AdminLayout title="Chat">
            <Head title="Admin Chat" />
            <div className="bg-gray-50 min-h-[calc(100vh-110px)]">
                <div className="mx-auto w-full">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Chat Inbox</h1>
                        <ExportCsvButton
                            routeName="admin.chat.export"
                            title="Export Chat Messages"
                            description="Select a message date range to download chat messages as a CSV file."
                        />
                    </div>
                    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-220px)] min-h-[620px]">
                        <div className={`w-full xl:w-[360px] ${selectedConversationId ? 'hidden xl:block' : 'block'}`}>
                            <ChatList
                                onSelectConversation={setSelectedConversationId}
                                selectedConversationId={selectedConversationId}
                                currentUser={auth.user}
                                isAdminView
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
