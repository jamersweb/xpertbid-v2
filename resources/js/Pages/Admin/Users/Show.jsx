import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import Price from '@/Components/Price';

export default function Show({ user }) {
    const isEmptyValue = (value) => value === null || value === undefined || value === '';

    const formatLabel = (label) => label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, ' ');

    const basicInfo = [
        { label: 'Name', value: user.name },
        { label: 'Username', value: user.username },
        { label: 'Email', value: user.email },
        { label: 'Phone', value: user.phone },
        { label: 'Role', value: user.role },
        { label: 'Status', value: user.status },
        { label: 'Signup Source', value: user.signup_source },
        { label: 'Joined At', value: new Date(user.created_at).toLocaleDateString() },
    ].filter(item => !isEmptyValue(item.value));

    const addressInfo = [
        { label: 'Address Line 1', value: user.address_line1 },
        { label: 'Address Line 2', value: user.address_line2 },
        { label: 'City', value: user.city },
        { label: 'State', value: user.state },
        { label: 'Country', value: user.country?.name || user.country },
        { label: 'Postal Code', value: user.postal_code },
    ].filter(item => !isEmptyValue(item.value));

    const verificationInfo = [
        { 
            label: 'Individual Verification', 
            value: user.individual_verification?.status || user.individualVerification?.status || 'Not Applied',
            badge: user.individual_verification?.status === 'verified' || user.individualVerification?.status === 'verified' ? 'verified' : 'pending'
        },
        { 
            label: 'Corporate Verification', 
            value: user.corporate_verification?.status || user.corporateVerification?.status || 'Not Applied',
            badge: user.corporate_verification?.status === 'verified' || user.corporateVerification?.status === 'verified' ? 'verified' : 'pending'
        },
    ];

    const stats = [
        { label: 'Total Listings', value: user.auctions?.length || 0, icon: 'fa-solid fa-layer-group', color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'Total Bids', value: user.bids?.length || 0, icon: 'fa-solid fa-gavel', color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <AdminLayout title={`User: ${user.name}`}>
            <Head title={`User: ${user.name}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('admin.users.index')}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Users
                    </Link>
                    <div className="flex gap-3">
                        <Link
                            href={route('admin.users.index')} // We don't have a direct edit page, so we go back to list
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                            <i className="fa-solid fa-pen"></i>
                            Edit User
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Stats & Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-700"></div>
                            <div className="px-6 pb-6 text-center -mt-12">
                                <div className="w-24 h-24 rounded-2xl bg-white p-1 mx-auto shadow-sm border border-gray-100">
                                    <div className="w-full h-full rounded-xl bg-gray-50 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden">
                                        {user.profile_pic ? (
                                            <img src={user.profile_pic} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </div>
                                </div>
                                <h1 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="mt-4 inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700">
                                    {user.role}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl`}>
                                        <i className={stat.icon}></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                        <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Detailed Info Sections */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Information Grid */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-circle-info text-sky-500"></i>
                                User Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {basicInfo.map((item, idx) => (
                                    <div key={idx}>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                                        <p className="text-sm text-gray-800 font-medium leading-relaxed">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Verification & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Verifications */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <i className="fa-solid fa-shield-check text-emerald-500"></i>
                                    Verification Status
                                </h2>
                                <div className="space-y-4">
                                    {verificationInfo.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <span className="text-xs font-bold text-gray-700">{item.label}</span>
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
                                                item.badge === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <i className="fa-solid fa-location-dot text-rose-500"></i>
                                    Primary Address
                                </h2>
                                <div className="space-y-4">
                                    {addressInfo.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {addressInfo.map((item, idx) => (
                                                <div key={idx}>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                                                    <p className="text-sm text-gray-800 font-medium leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <i className="fa-solid fa-map-location-dot text-gray-200 text-4xl mb-2"></i>
                                            <p className="text-xs text-gray-500">No address details available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity (Placeholder for now) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-bolt text-amber-500"></i>
                                Recent Activity Summary
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                    <p className="text-2xl font-bold text-gray-900">{user.auctions?.length || 0}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Auctions</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                    <p className="text-2xl font-bold text-gray-900">{user.bids?.length || 0}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Bids</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                    <p className="text-2xl font-bold text-gray-900">0</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Orders</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                    <p className="text-2xl font-bold text-gray-900">0</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Inquiries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
