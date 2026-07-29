import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';

// ─── Date of Birth Selector ────────────────────────────────────────────────────

function DateOfBirthSelector({ dob, setDob, errors }) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
    const months = [
        { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
        { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
        { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
        { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
    ];

    // Parse initial dob (YYYY-MM-DD) into parts
    const parsedParts = dob ? dob.split('-') : ['', '', ''];
    const [year, setYear] = useState(parsedParts[0] || '');
    const [month, setMonth] = useState(parsedParts[1] ? String(parseInt(parsedParts[1])) : '');
    const [day, setDay] = useState(parsedParts[2] ? String(parseInt(parsedParts[2])) : '');

    const daysInMonth = (year && month) ? new Date(year, month, 0).getDate() : 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    useEffect(() => {
        if (year && month && day) {
            const mm = String(month).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            setDob(`${year}-${mm}-${dd}`);
        }
    }, [year, month, day]);

    return (
        <div>
            <div className="d-flex gap-2 mb-2">
                <select className="form-select verify_input" value={year}
                    onChange={e => { setYear(e.target.value); setMonth(''); setDay(''); setDob(''); }}>
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select className="form-select verify_input" value={month}
                    onChange={e => { setMonth(e.target.value); setDay(''); setDob(''); }}
                    disabled={!year}>
                    <option value="">Month</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <select className="form-select verify_input" value={day}
                    onChange={e => setDay(e.target.value)}
                    disabled={!month}>
                    <option value="">Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <input type="text" readOnly className="form-control verify_input mb-1" placeholder="YYYY-MM-DD" value={dob} required />
            {errors?.dob && <div className="text-danger">{errors.dob}</div>}
        </div>
    );
}

// ─── Status Card Components ────────────────────────────────────────────────────

function VerifiedCard({ type }) {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            color: '#23262F',
            boxShadow: '0 4px 20px rgba(67,172,233,0.15)',
            border: '2px solid #43ACE9',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ display: 'inline-block', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
                <svg style={{ width: 80, height: 80, color: '#43ACE9', filter: 'drop-shadow(0 2px 8px rgba(67,172,233,0.3))' }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 700, marginBottom: 20, color: '#23262F', position: 'relative', zIndex: 1 }}>
                {type} Verification Approved
            </h3>
            <p style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 30, color: '#606060', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 1 }}>
                Congratulations! Your {type.toLowerCase()} verification has been <strong style={{ color: '#43ACE9' }}>approved</strong>.
                You now have full access to all <strong style={{ color: '#43ACE9' }}>XpertBid</strong> features.
            </p>
            <span style={{
                display: 'inline-block',
                background: '#43ACE9',
                padding: '12px 30px',
                borderRadius: 50,
                fontWeight: 600,
                fontSize: 16,
                color: '#ffffff',
                textTransform: 'capitalize',
                position: 'relative',
                zIndex: 1,
            }}>
                Status: Verified
            </span>
        </div>
    );
}

function DeclinedCard({ type, declineReason, onResubmit }) {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            color: '#23262F',
            boxShadow: '0 4px 20px rgba(239,68,68,0.15)',
            border: '2px solid #EF4444',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ display: 'inline-block', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
                <svg style={{ width: 80, height: 80, color: '#EF4444', filter: 'drop-shadow(0 2px 8px rgba(239,68,68,0.3))' }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 700, marginBottom: 20, color: '#23262F', position: 'relative', zIndex: 1 }}>
                {type} Verification Declined
            </h3>
            <p style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 30, color: '#606060', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 1 }}>
                Unfortunately, your {type.toLowerCase()} verification could not be approved at this time.
                {declineReason && <><br /><strong style={{ color: '#EF4444' }}>Reason: {declineReason}</strong></>}
                <br />Please review the information you provided and submit again with the correct details.
            </p>
            <div style={{ position: 'relative', zIndex: 1, marginBottom: 30 }}>
                <span style={{
                    display: 'inline-block',
                    background: '#FEE2E2',
                    padding: '12px 30px',
                    borderRadius: 50,
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#EF4444',
                    border: '2px solid #EF4444',
                    textTransform: 'capitalize',
                }}>
                    Status: Declined
                </span>
            </div>
            <button
                onClick={onResubmit}
                style={{
                    background: '#43ACE9',
                    color: 'white',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: 50,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                Edit &amp; Resubmit Verification
            </button>
        </div>
    );
}

function PendingCard({ type }) {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            color: '#23262F',
            boxShadow: '0 4px 20px rgba(67,172,233,0.15)',
            border: '2px solid #43ACE9',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ display: 'inline-block', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
                <svg
                    style={{ width: 80, height: 80, color: '#43ACE9', filter: 'drop-shadow(0 2px 8px rgba(67,172,233,0.3))', animation: 'spin 3s linear infinite' }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 700, marginBottom: 20, color: '#23262F', position: 'relative', zIndex: 1 }}>
                {type} Verification Under Review
            </h3>
            <p style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 30, color: '#606060', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 1 }}>
                Your {type.toLowerCase()} verification form has been successfully submitted and is currently under review.
                Our team at <strong style={{ color: '#43ACE9' }}>XpertBid</strong> will review your information and take action within <strong style={{ color: '#43ACE9' }}>24 hours</strong>.
            </p>
            <span style={{
                display: 'inline-block',
                background: 'rgba(67,172,233,0.2)',
                padding: '12px 30px',
                borderRadius: 50,
                fontWeight: 600,
                fontSize: 16,
                color: '#43ACE9',
                border: '2px solid #43ACE9',
                textTransform: 'capitalize',
                position: 'relative',
                zIndex: 1,
            }}>
                Status: Pending Review
            </span>
        </div>
    );
}

// ─── Upload Box ───────────────────────────────────────────────────────────────

function UploadBox({ id, label, preview, file, onChange, onClear, existingPath }) {
    const isPdf = file?.type === 'application/pdf' || (!file && existingPath?.toLowerCase().endsWith('.pdf'));
    return (
        <div>
            <div
                className="upload-box"
                onClick={() => document.getElementById(id).click()}
                style={{ cursor: 'pointer' }}
            >
                {preview ? (
                    <div className="position-relative">
                        {isPdf ? (
                            <div className="pdf-preview text-center p-3">
                                <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                                <p className="small mt-2">{file ? file.name : existingPath?.split('/').pop()}</p>
                            </div>
                        ) : (
                            <img src={preview} className="upload-preview" alt={label} style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }} />
                        )}
                        <button
                            type="button"
                            className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
                            style={{ width: 20, height: 20, fontSize: 10 }}
                            onClick={e => { e.stopPropagation(); onClear(); }}
                        >×</button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="upload upload-btn button-style-3"
                        onClick={e => { e.stopPropagation(); document.getElementById(id).click(); }}
                    >
                        {label}
                    </button>
                )}
                <input
                    id={id}
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    style={{ display: 'none' }}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

// ─── Individual Verification Form ─────────────────────────────────────────────

function IndividualForm({ initialData, auth, countries }) {
    const initStatus = initialData?.status;
    // Show form only when there is NO existing submission at all
    const [showForm, setShowForm] = useState(!initStatus);

    useEffect(() => {
        if (initStatus) setShowForm(false);
    }, [initStatus]);

    const [fullLegalName, setFullLegalName] = useState(initialData?.full_legal_name || auth?.user?.name || '');
    const [dob, setDob] = useState(initialData?.dob || '');
    const [residentialAddress, setResidentialAddress] = useState(initialData?.residential_address || '');
    const [contactNumber, setContactNumber] = useState(initialData?.contact_number || auth?.user?.phone || '');
    const [emailAddress, setEmailAddress] = useState(initialData?.email_address || auth?.user?.email || '');
    const [country, setCountry] = useState(initialData?.country || '');
    const [selectedDocument, setSelectedDocument] = useState(initialData?.document_type || 'NIC');

    const [frontFile, setFrontFile] = useState(null);
    const [backFile, setBackFile] = useState(null);
    const [frontPreview, setFrontPreview] = useState(initialData?.id_front_path ? `/${initialData.id_front_path}` : '');
    const [backPreview, setBackPreview] = useState(initialData?.id_back_path ? `/${initialData.id_back_path}` : '');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const onFrontChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { setErrorMsg('The Front ID document file size exceeds the 10MB limit.'); return; }
        setFrontFile(file);
        setFrontPreview(URL.createObjectURL(file));
        setErrorMsg('');
    };

    const onBackChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { setErrorMsg('The Back ID document file size exceeds the 10MB limit.'); return; }
        setBackFile(file);
        setBackPreview(URL.createObjectURL(file));
        setErrorMsg('');
    };

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMsg('');
        setErrorMsg('');

        const fd = new FormData();
        fd.append('full_legal_name', fullLegalName);
        fd.append('dob', dob);
        fd.append('residential_address', residentialAddress);
        if (frontFile) fd.append('id_front', frontFile);
        if (backFile) fd.append('id_back', backFile);
        fd.append('contact_number', contactNumber);
        fd.append('email_address', emailAddress);
        fd.append('country', country);
        fd.append('document_type', selectedDocument);

        router.post(route('individual-verifications.store'), fd, {
            forceFormData: true,
            onSuccess: () => {
                setSuccessMsg('Individual verification submitted successfully!');
                setLoading(false);
                setShowForm(false); // Switch to status card immediately
            },
            onError: (errs) => {
                setErrors(errs);
                setErrorMsg(Object.values(errs).flat().join(' '));
                setLoading(false);
            },
            onFinish: () => setLoading(false),
        });
    };

    // Status States — shown instead of form unless user clicked resubmit
    if (!showForm) {
        const status = initStatus?.toLowerCase();
        if (status === 'verified' || status === 'approved') return <VerifiedCard type="Individual" />;
        if (status === 'declined' || status === 'rejected') {
            return <DeclinedCard type="Individual" declineReason={initialData?.decline_reason} onResubmit={() => setShowForm(true)} />;
        }
        // not_verified = submitted and under review
        return <PendingCard type="Individual" />;
    }

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px' }}>
            <h4 className="mb-5 heading">Individual Verification</h4>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            {/* Full Legal Name */}
            <div className="mb-3">
                <label className="form-label fw-bold">Full Legal Name</label>
                <input type="text" className="form-control verify_input" value={fullLegalName}
                    onChange={e => setFullLegalName(e.target.value)} placeholder="Please enter your legal name" required />
                {errors.full_legal_name && <div className="text-danger">{errors.full_legal_name}</div>}
            </div>

            {/* Date of Birth */}
            <div className="mb-3">
                <label className="form-label fw-bold">Date of Birth</label>
                <DateOfBirthSelector dob={dob} setDob={setDob} errors={errors} />
            </div>

            {/* Residential Address */}
            <div className="mb-3">
                <label className="form-label fw-bold">Residential Address</label>
                <input type="text" className="form-control verify_input" value={residentialAddress}
                    onChange={e => setResidentialAddress(e.target.value)} placeholder="Please enter your residential address" required />
                {errors.residential_address && <div className="text-danger">{errors.residential_address}</div>}
            </div>

            {/* Document Type */}
            <div className="mb-4 position-relative">
                <label className="form-label fw-bold">Select Document Type</label>
                <select className="form-control verify_input" value={selectedDocument}
                    onChange={e => setSelectedDocument(e.target.value)} required>
                    <option value="NIC">NIC</option>
                    <option value="Passport">Passport</option>
                </select>
                <div className="input-icon-wrapper verify_svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M4.07992 8.95011L10.5999 15.4701C11.3699 16.2401 12.6299 16.2401 13.3999 15.4701L19.9199 8.95011"
                            stroke="#606060" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* ID Document Upload */}
            <div className="identity-upload-section">
                {selectedDocument && (
                    <h4 className="form-label fw-bold mb-3">
                        Verify your identity with {selectedDocument === 'Passport' ? 'a Passport' : 'an NIC'} document
                    </h4>
                )}
                {selectedDocument && (
                    <ul className="liss mb-3">
                        <li>A valid {selectedDocument} document in the issuing country.</li>
                        <li>A clear picture where all four corners are visible.</li>
                        <li>Include the back if it has identifying information.</li>
                        <li>Certified by a witness if required.</li>
                        <li>These documents are required exclusively for verification on the XpertBid platform and will not be utilized for any other purpose.</li>
                    </ul>
                )}

                <div className="row">
                    <div className="col-md-6">
                        <UploadBox
                            id="frontInput"
                            label="Upload Front"
                            preview={frontPreview}
                            file={frontFile}
                            onChange={onFrontChange}
                            onClear={() => { setFrontPreview(''); setFrontFile(null); }}
                            existingPath={initialData?.id_front_path}
                        />
                        {errors.id_front && <div className="text-danger mt-2">{errors.id_front}</div>}
                    </div>
                    <div className="col-md-6">
                        <UploadBox
                            id="backInput"
                            label="Upload Back"
                            preview={backPreview}
                            file={backFile}
                            onChange={onBackChange}
                            onClear={() => { setBackPreview(''); setBackFile(null); }}
                            existingPath={initialData?.id_back_path}
                        />
                        {errors.id_back && <div className="text-danger mt-2">{errors.id_back}</div>}
                    </div>
                </div>
            </div>

            {/* Contact & Email */}
            <div className="row">
                <div className="my-4 col-md-6">
                    <label className="form-label fw-bold">Contact Number</label>
                    <input type="number" className="form-control verify_input" value={contactNumber}
                        placeholder="Please enter your contact number"
                        onChange={e => setContactNumber(e.target.value)} required />
                    {errors.contact_number && <div className="text-danger">{errors.contact_number}</div>}
                </div>
                <div className="my-4 col-md-6">
                    <label className="form-label fw-bold">Email Address</label>
                    <input type="email" className="form-control verify_input" value={emailAddress}
                        onChange={e => setEmailAddress(e.target.value)} required />
                    {errors.email_address && <div className="text-danger">{errors.email_address}</div>}
                </div>
            </div>

            {/* Country */}
            <div className="mb-4 form-child position-relative">
                <label className="form-label fw-bold">Country</label>
                <select className="form-control verify_input" value={country}
                    onChange={e => setCountry(e.target.value)} required>
                    <option value="">Select Country</option>
                    {countries.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
                <div className="input-icon-wrapper verify_svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M4.07992 8.95011L10.5999 15.4701C11.3699 16.2401 12.6299 16.2401 13.3999 15.4701L19.9199 8.95011"
                            stroke="#606060" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {errors.country && <div className="text-danger">{errors.country}</div>}
            </div>

            <button type="submit" className="button-style-2" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
}

// ─── Corporate Verification Form ──────────────────────────────────────────────

function CorporateForm({ initialData, countries, malls = [] }) {
    const initStatus = initialData?.status;
    // Show form only when there is NO existing submission at all
    const [showForm, setShowForm] = useState(!initStatus);

    useEffect(() => {
        if (initStatus) setShowForm(false);
    }, [initStatus]);



    const [legalEntityName, setLegalEntityName] = useState(initialData?.legal_entity_name || '');
    const [registeredAddress, setRegisteredAddress] = useState(initialData?.registered_address || '');
    const [incorporationDate, setIncorporationDate] = useState(initialData?.date_of_incorporation || '');
    const [entityType, setEntityType] = useState(initialData?.entity_type || '');
    const [country, setCountry] = useState(initialData?.country || '');
    const [mallId, setMallId] = useState(initialData?.mall_id ? String(initialData.mall_id) : '');

    const [businessDocuments, setBusinessDocuments] = useState([]);
    const [businessPreview, setBusinessPreview] = useState(
        Array.isArray(initialData?.business_documents)
            ? initialData.business_documents.map(p => `/${p}`)
            : []
    );
    const [fileCountError, setFileCountError] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const onBusinessChange = e => {
        const files = Array.from(e.target.files);
        if (files.length > 3) { setFileCountError("You can't upload more than 3 documents."); e.target.value = ''; return; }
        setFileCountError('');
        setBusinessDocuments(files);
        setBusinessPreview(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMsg('');
        setErrorMsg('');

        const fd = new FormData();
        fd.append('legal_entity_name', legalEntityName);
        fd.append('registered_address', registeredAddress);
        fd.append('date_of_incorporation', incorporationDate);
        fd.append('entity_type', entityType);
        fd.append('country', country);
        if (mallId) {
            fd.append('mall_id', mallId);
        }
        businessDocuments.forEach(file => fd.append('business_documents[]', file));

        router.post(route('corporate-verifications.store'), fd, {
            forceFormData: true,
            onSuccess: () => {
                setSuccessMsg('Corporate verification submitted successfully!');
                setLoading(false);
                setShowForm(false); // Switch to status card immediately
            },
            onError: (errs) => {
                setErrors(errs);
                setErrorMsg(Object.values(errs).flat().join(' '));
                setLoading(false);
            },
            onFinish: () => setLoading(false),
        });
    };

    // Status States
    if (!showForm) {
        const status = initStatus?.toLowerCase();
        if (status === 'verified' || status === 'approved') return <VerifiedCard type="Corporate" />;
        if (status === 'declined' || status === 'rejected') {
            return <DeclinedCard type="Corporate" declineReason={initialData?.decline_reason} onResubmit={() => setShowForm(true)} />;
        }
        // not_verified = submitted and under review
        return <PendingCard type="Corporate" />;
    }

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px' }}>
            <h4 className="mb-5 heading">Corporate Verification</h4>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            {/* Legal Entity Name + Registered Address */}
            <div className="row">
                <div className="mb-3 col-md-6">
                    <label className="form-label fw-bold">Legal Entity Name</label>
                    <input type="text" className="form-control verify_input" value={legalEntityName}
                        onChange={e => setLegalEntityName(e.target.value)}
                        placeholder="Please enter your legal entity name" required />
                    {errors.legal_entity_name && <div className="text-danger">{errors.legal_entity_name}</div>}
                </div>
                <div className="mb-3 col-md-6">
                    <label className="form-label fw-bold">Registered Address</label>
                    <input type="text" className="form-control verify_input" value={registeredAddress}
                        onChange={e => setRegisteredAddress(e.target.value)}
                        placeholder="Please enter your registered address" required />
                    {errors.registered_address && <div className="text-danger">{errors.registered_address}</div>}
                </div>
            </div>

            {/* Date of Incorporation */}
            <div className="mb-3">
                <label className="form-label fw-bold">Date of Incorporation</label>
                <input type="date" className="form-control verify_input" value={incorporationDate}
                    onChange={e => setIncorporationDate(e.target.value)} required />
                {errors.date_of_incorporation && <div className="text-danger">{errors.date_of_incorporation}</div>}
            </div>

            {/* Entity Type */}
            <div className="mb-3">
                <label className="form-label fw-bold">Type of Entity</label>
                <input type="text" className="form-control verify_input" value={entityType}
                    onChange={e => setEntityType(e.target.value)}
                    placeholder="Please enter your type of entity" required />
                {errors.entity_type && <div className="text-danger">{errors.entity_type}</div>}
            </div>

            {/* Business Documents Upload */}
            <div className="identity-upload-section mb-4">
                <h4 className="form-label fw-bold mb-3">Upload your documents</h4>
                <ul className="liss mb-3">
                    <li>Click the box below to select files.</li>
                    <li>Only PNG/JPEG images accepted.</li>
                    <li>You can&apos;t upload more than 3 documents.</li>
                    <li>These documents are required exclusively for verification on the XpertBid platform and will not be utilized for any other purpose.</li>
                </ul>

                <div
                    className="upload-box"
                    onClick={() => document.getElementById('businessInput').click()}
                    style={{ cursor: 'pointer' }}
                >
                    {businessPreview.length > 0 ? (
                        <div className="d-flex flex-wrap">
                            {businessPreview.map((src, i) => {
                                const file = businessDocuments[i];
                                const isPdf = (file && file.type === 'application/pdf') || (!file && src.toLowerCase().endsWith('.pdf'));
                                return (
                                    <div key={`doc-${i}`} className="position-relative m-1">
                                        {isPdf ? (
                                            <div className="pdf-preview p-2 border text-center" style={{ width: 120 }}>
                                                <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                                                <p className="small mt-1 text-truncate" style={{ maxWidth: 110 }}>
                                                    {file ? file.name : src.split('/').pop()}
                                                </p>
                                            </div>
                                        ) : (
                                            <img src={src} className="upload-preview" alt={`Doc ${i + 1}`}
                                                style={{ width: 120, height: 90, objectFit: 'contain' }} />
                                        )}
                                        <button
                                            type="button"
                                            className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
                                            style={{ width: 20, height: 20, fontSize: 10 }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                const newPreviews = [...businessPreview];
                                                const newDocuments = [...businessDocuments];
                                                newPreviews.splice(i, 1);
                                                newDocuments.splice(i, 1);
                                                setBusinessPreview(newPreviews);
                                                setBusinessDocuments(newDocuments);
                                            }}
                                        >×</button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <button type="button" className="upload upload-btn button-style-3">
                            Upload Business Documents
                        </button>
                    )}
                    <input
                        id="businessInput"
                        type="file"
                        accept="image/png, image/jpeg, application/pdf"
                        multiple
                        style={{ display: 'none' }}
                        onChange={onBusinessChange}
                    />
                </div>
                {fileCountError && <div className="text-danger mt-2">{fileCountError}</div>}
                {errors.business_documents && <div className="text-danger">{errors.business_documents}</div>}
            </div>

            {/* Country */}
            <div className="mb-4 form-child position-relative">
                <label className="form-label fw-bold">Country</label>
                <select className="form-control verify_input" value={country}
                    onChange={e => setCountry(e.target.value)} required>
                    <option value="">Select Country</option>
                    {countries.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
                {errors.country && <div className="text-danger">{errors.country}</div>}
            </div>

            {/* Mall (optional) */}
            <div className="mb-4 form-child position-relative">
                <label className="form-label fw-bold">Mall <span className="text-muted fw-normal">(optional)</span></label>
                <select className="form-control verify_input" value={mallId}
                    onChange={e => setMallId(e.target.value)}>
                    <option value="">Select Mall</option>
                    {malls.map(mall => (
                        <option key={mall.id} value={mall.id}>{mall.name}</option>
                    ))}
                </select>
                {errors.mall_id && <div className="text-danger">{errors.mall_id}</div>}
            </div>

            <button type="submit" className="button-style-2" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IdentityVerificationSection() {
    const { individualVerification, corporateVerification, auth, malls = [] } = usePage().props;
    const [tab, setTab] = useState('individual');
    const [countries, setCountries] = useState([]);

    // ─── Real-time Auto-refresh ─────────────────────────────────────────────
    // Polling every 10 seconds if a verification is pending
    useEffect(() => {
        const isPending = (v) => v && v.status !== 'verified' && v.status !== 'approved' && v.status !== 'declined' && v.status !== 'rejected';

        if (isPending(individualVerification) || isPending(corporateVerification)) {
            const interval = setInterval(() => {
                router.reload({ only: ['individualVerification', 'corporateVerification'] });
            }, 10000); // 10 seconds
            return () => clearInterval(interval);
        }
    }, [individualVerification, corporateVerification]);

    useEffect(() => {
        axios.get('/get-countries')
            .then(res => {
                let list = res.data?.country || res.data || [];
                list.sort((a, b) => {
                    const priorityIds = [166, 229];
                    const ap = priorityIds.includes(a.id);
                    const bp = priorityIds.includes(b.id);
                    if (ap && !bp) return -1;
                    if (!ap && bp) return 1;
                    return 0;
                });
                setCountries(list);
            })
            .catch(() => { });
    }, []);

    const tabs = [
        { key: 'individual', label: 'Individual' },
        { key: 'corporate', label: 'Corporate' },
    ];

    return (
        <div className="container p-0">
            <ul className="nav nav-tabs mb-4">
                {tabs.map(t => (
                    <li key={t.key} className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${tab === t.key ? 'active-tabs' : ''}`}
                            onClick={() => setTab(t.key)}
                            style={{ background: 'none', backgroundColor: 'transparent' }}
                        >
                            {t.label}
                        </button>
                    </li>
                ))}
            </ul>

            {tab === 'individual' ? (
                <IndividualForm
                    initialData={individualVerification}
                    auth={auth}
                    countries={countries}
                />
            ) : (
                <CorporateForm
                    initialData={corporateVerification}
                    countries={countries}
                    malls={malls}
                />
            )}
        </div>
    );
}
