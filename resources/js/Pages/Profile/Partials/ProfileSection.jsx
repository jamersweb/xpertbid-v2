import { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

const isFullPath = (url) => {
    if (typeof url !== 'string') return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

const defaultProfileImage = "/assets/images/user.jpg";

export default function ProfileSection({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [form, setForm] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: (user.phone && user.phone !== 'null') ? user.phone : '',
        country_id: (user.country_id && user.country_id !== 'null') ? user.country_id : '',
        company_name: (user.company_name && user.company_name !== 'null') ? user.company_name : '',
        vat_number: (user.vat_number && user.vat_number !== 'null') ? user.vat_number : '',
        profile_pic: null,
    });

    const [imagePreview, setImagePreview] = useState(user.profile_pic || defaultProfileImage);
    const [showBusinessInfo, setShowBusinessInfo] = useState(!!(user.company_name || user.vat_number));
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        fetch('/get-countries')
            .then(res => res.json())
            .then(data => {
                if (data.country) {
                    setCountries(data.country);
                }
            });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, profile_pic: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);

        // Use router.post with forceFormData for file uploads
        router.post(route('user.update'), {
            ...form,
            _method: 'post', // UserController@updateProfile expects POST
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false),
        });
    };

    const handleRemoveImage = () => {
        setImagePreview(defaultProfileImage);
        setForm({ ...form, profile_pic: 'remove' });
    };

    return (
        <div className="profile-settings-section">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#23262F', margin: 0 }}>My Profile</h3>
                <button
                    className="button-style-2"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>


            <div className="profile-piture-and-upldRmov mb-5 pb-5 border-bottom">
                <div className="row align-items-center">
                    <div className="col-md-7">
                        <div className="profile-photo-format d-flex align-items-center gap-4">
                            <div className="position-relative">
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "100%", border: '1px solid #E6E8EC' }}
                                />
                            </div>
                            <div className="user_profile">
                                <h4 className="mb-2" style={{ fontSize: '16px', fontWeight: '700', color: '#23262F' }}>Profile Picture</h4>
                                <p className="text-muted mb-0" style={{ fontSize: '13px', color: '#777E91' }}>Upload any PNG, JPG file under 5MB.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="profile-upload-btn d-flex justify-content-md-end gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <button className="upload upload-btn button-style-3 d-flex align-items-center justify-content-center gap-2" onClick={() => fileInputRef.current.click()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                Upload
                            </button>
                            <button className="remove remove-btn button-style-3 d-flex align-items-center justify-content-center gap-2" onClick={handleRemoveImage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="personal-information">
                <h4 className="mb-4" style={{ fontSize: '18px', fontWeight: '700', color: '#23262F' }}>Personal Information</h4>
                <form className="row g-4 style-inputs">
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontWeight: '600' }}>Email*</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontWeight: '600' }}>Phone Number*</label>
                        <input type="text" name="phone" value={form.phone} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontWeight: '600' }}>Your Full Name*</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontWeight: '600' }}>Country*</label>
                        <select name="country_id" value={form.country_id} onChange={handleChange} className="form-select" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }}>
                            <option value="">Select Country</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {!showBusinessInfo && (
                        <div className="col-12">
                            <button type="button" className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2" onClick={() => setShowBusinessInfo(true)} style={{ color: '#43ACE9', fontWeight: '600' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                Add Business Info
                            </button>
                        </div>
                    )}

                    {showBusinessInfo && (
                        <>
                            <div className="col-md-6">
                                <label className="form-label" style={{ fontWeight: '600' }}>Company Name*</label>
                                <input type="text" name="company_name" value={form.company_name} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" style={{ fontWeight: '600' }}>VAT Number</label>
                                <input type="text" name="vat_number" value={form.vat_number} onChange={handleChange} className="form-control" style={{ height: '50px', backgroundColor: '#F8F8F8', border: 'none' }} />
                            </div>
                        </>
                    )}
                </form>
            </div>

            <div className="mt-5 pt-4 border-top">
                <button
                    className="btn btn-link text-danger p-0 text-decoration-none d-flex align-items-center gap-2"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete your account?')) {
                            router.delete(route('profile.destroy'));
                        }
                    }}
                    style={{ fontWeight: '600' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    Delete my account
                </button>
            </div>
        </div>
    );
}
