import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const user = usePage().props.auth.user;

    const cards = [
        {
            title: 'My Listings',
            description: 'Manage your auctions and listings.',
            href: route('auctions.mylistings'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            title: 'My Bids',
            description: 'View auctions you have participated in.',
            href: '#', // route('bids.index') - to be implemented
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Profile Settings',
            description: 'Update your personal information.',
            href: route('profile.edit'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            title: 'Identity Verification',
            description: 'Verify your ID to become a seller.',
            href: route('verification.identity'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <AppLayout title="Dashboard">
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user.name}!</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card, index) => (
                            <Link
                                key={index}
                                href={card.href}
                                className="block rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="rounded-full bg-gray-50 p-3">
                                        {card.icon}
                                    </div>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">{card.title}</h3>
                                <p className="text-gray-600">{card.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
