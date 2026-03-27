import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function SecuritySection() {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        newPassword_confirmation: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post(route('user.password.update'), form, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setForm({ oldPassword: '', newPassword: '', newPassword_confirmation: '' });
            },
            onError: () => setLoading(false),
        });
    };

    return (
        <div className="profile-settings-section">
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#23262F', marginBottom: '40px' }}>Password & Login</h3>

            <form className="row g-4" onSubmit={handleSave}>
                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: '600' }}>Old Password</label>
                    <input type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>New Password</label>
                    <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>Confirm New Password</label>
                    <input type="password" name="newPassword_confirmation" value={form.newPassword_confirmation} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                </div>
                <div className="col-12 mt-4">
                    <button
                        type="submit"
                        className="button-style-2"
                        disabled={loading}
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </form>
        </div>
    );
}
