import { useEffect, useState } from 'react';
import axios from 'axios';

const money = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`;

export default function ReferralSection() {
    const [data, setData] = useState(null);
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadReferral = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(route('referrals.me'));
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load referral details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReferral();
    }, []);

    const handleCopy = () => {
        if (!data?.referral_code) return;
        navigator.clipboard.writeText(data.referral_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applyCode = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            await axios.post(route('referrals.apply'), { referral_code: code });
            setCode('');
            setMessage('Referral code linked successfully.');
            await loadReferral();
        } catch (err) {
            const errors = err.response?.data?.errors;
            setError(errors?.referral_code?.[0] || err.response?.data?.message || 'Unable to apply referral code.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-settings-section">
                <h3 className="mb-3" style={{ fontSize: '24px', fontWeight: '700', color: '#23262F' }}>Referral Program</h3>
                <div className="p-4 rounded-4 bg-light text-muted">Loading referral details...</div>
            </div>
        );
    }

    const summary = data?.summary || {};
    const rewards = data?.rewards || [];

    return (
        <div className="profile-settings-section">
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#23262F', marginBottom: '10px' }}>Referral Program</h3>
            <p className="text-muted mb-4">Share your code. When a referred user completes an approved sale or purchase, XpertBid can approve a 1% reward.</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && <div className="alert alert-success py-2">{message}</div>}

            <div className="p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4" style={{ backgroundColor: '#F4F7FE', borderRadius: '18px', border: '1px dashed #D2D9EE' }}>
                <div>
                    <p className="text-muted mb-1 small fw-bold text-uppercase">Your referral code</p>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#23262F', letterSpacing: '2px' }}>
                        {data?.referral_code || 'Not Generated'}
                    </span>
                </div>
                <button
                    className="button-style-2"
                    onClick={handleCopy}
                    disabled={!data?.referral_code}
                    type="button"
                >
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>

            <div className="row g-3 mb-4">
                {[
                    ['Pending', summary.pending],
                    ['Approved', summary.approved],
                    ['Paid', summary.paid],
                    ['Total referrals', summary.total_referrals],
                ].map(([label, value]) => (
                    <div className="col-6 col-lg-3" key={label}>
                        <div className="p-3 rounded-4 border bg-white h-100">
                            <p className="text-muted small mb-1">{label}</p>
                            <h5 className="mb-0 fw-bold">{label === 'Total referrals' ? value || 0 : money(value)}</h5>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 rounded-4 border mb-4">
                <h5 className="fw-bold mb-2">Code used on your account</h5>
                {data?.referred_by ? (
                    <p className="mb-0 text-muted">Linked to {data.referred_by.name || data.referred_by.email}.</p>
                ) : (
                    <form onSubmit={applyCode} className="d-flex flex-column flex-md-row gap-3">
                        <input
                            className="form-control"
                            value={code}
                            onChange={(event) => setCode(event.target.value.toUpperCase())}
                            placeholder="Enter referral code once"
                            maxLength={50}
                        />
                        <button className="button-style-1" type="submit" disabled={saving || !code.trim()}>
                            {saving ? 'Applying...' : 'Apply Code'}
                        </button>
                    </form>
                )}
            </div>

            <h5 className="fw-bold mb-3">Reward History</h5>
            <div className="table-responsive rounded-4 border">
                <table className="table mb-0 align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Source</th>
                            <th>Base</th>
                            <th>Reward</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rewards.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">No referral rewards yet.</td>
                            </tr>
                        ) : rewards.map((reward) => (
                            <tr key={reward.id}>
                                <td>
                                    <strong>{reward.listing?.title || reward.order?.order_number || reward.trigger_type}</strong>
                                    <div className="text-muted small text-capitalize">{reward.trigger_type}</div>
                                </td>
                                <td>{money(reward.amount_base)}</td>
                                <td>{money(reward.reward_amount)}</td>
                                <td><span className="badge rounded-pill bg-secondary text-capitalize">{reward.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
