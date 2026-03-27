import { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function ReferralSection() {
    const { auth } = usePage().props;
    const referralCode = auth.user.referral_code;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="profile-settings-section">
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#23262F', marginBottom: '20px' }}>My Referral Code</h3>
            <p className="text-muted mb-4">Share this code with your friends and earn rewards when they join XpertBid.</p>

            <div className="p-4 d-flex align-items-center justify-content-between mb-4" style={{ backgroundColor: '#F4F7FE', borderRadius: '15px', border: '1px dashed #D2D9EE' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#23262F', letterSpacing: '2px' }}>
                    {referralCode || 'Not Generated'}
                </span>
                {referralCode && (
                    <button
                        className="btn btn-link text-decoration-none"
                        onClick={handleCopy}
                        style={{ color: copied ? '#45B36B' : '#43ACE9', fontWeight: '600', transition: 'all 0.3s ease' }}
                    >
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                )}
            </div>
        </div>
    );
}
