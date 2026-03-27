import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function NotificationSection() {
    const { notificationSettings: savedSettings } = usePage().props;

    const [preferences, setPreferences] = useState({
        inspiration: savedSettings?.inspiration || false,
        newsletter: savedSettings?.newsletter || false,
        outbid: savedSettings?.outbid || false,
        republished: savedSettings?.republished || false,
        oneDayReminder: savedSettings?.oneDayReminder || false,
        oneHourReminder: savedSettings?.oneHourReminder || false,
        fifteenMinutesReminder: savedSettings?.fifteenMinutesReminder || false,
    });

    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setPreferences(prev => ({ ...prev, [name]: checked }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        // Assuming route is defined in v2
        router.post(route('user.notifications.update'), preferences, {
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false),
        });
    };

    return (
        <div className="profile-settings-section">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#23262F', margin: 0 }}>Notification Settings</h3>
                <button
                    className="button-style-2"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <p className="text-muted mb-5" style={{ fontSize: '14px', color: '#777E91' }}>
                Manage your notification preferences to stay updated on auction wins, bids, and important updates.
                Customize how and when you would like to receive alerts.
            </p>

            <div className="notify-setting-inner-box mb-5">
                <h4 className="mb-3" style={{ fontSize: '20px', fontWeight: '700' }}>Newsletters</h4>
                <div className="nofify-form-1 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                        <input
                            type="checkbox"
                            name="inspiration"
                            id="inspiration"
                            checked={preferences.inspiration}
                            onChange={handleCheckboxChange}
                            style={{ marginTop: '5px', transform: 'scale(1.2)' }}
                        />
                        <div>
                            <label htmlFor="inspiration" style={{ fontWeight: '700', color: '#23262F' }}>Inspiration</label>
                            <p className="text-muted small mb-0">Inspiration in your inbox! You can always unsubscribe later if you change your mind.</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                        <input
                            type="checkbox"
                            name="newsletter"
                            id="newsletter"
                            checked={preferences.newsletter}
                            onChange={handleCheckboxChange}
                            style={{ marginTop: '5px', transform: 'scale(1.2)' }}
                        />
                        <div>
                            <label htmlFor="newsletter" style={{ fontWeight: '700', color: '#23262F' }}>Other newsletters</label>
                            <p className="text-muted small mb-0">Sometimes we may send newsletters with other interesting and relevant information.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="notify-setting-inner-box">
                <h4 className="mb-3" style={{ fontSize: '20px', fontWeight: '700' }}>Bidding</h4>
                <div className="nofify-form-1 d-flex flex-column gap-3">
                    {[
                        { key: 'outbid', label: 'Let me know when I am outbid' },
                        { key: 'republished', label: 'Let me know when items are republished' },
                        { key: 'oneDayReminder', label: 'Remind me 1 day before bidding closes' },
                        { key: 'oneHourReminder', label: 'Remind me 1 hour before bidding closes' },
                        { key: 'fifteenMinutesReminder', label: 'Remind me 15 minutes before bidding closes' }
                    ].map(item => (
                        <div className="d-flex align-items-center gap-3" key={item.key}>
                            <input
                                type="checkbox"
                                name={item.key}
                                id={item.key}
                                checked={preferences[item.key]}
                                onChange={handleCheckboxChange}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <label htmlFor={item.key} style={{ fontWeight: '600', color: '#23262F' }}>{item.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
