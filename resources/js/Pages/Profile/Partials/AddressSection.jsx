import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function AddressSection() {
    const { address, errors, flash } = usePage().props;

    const [form, setForm] = useState({
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        country: address?.country ? String(address.country) : '',
        city: address?.city ? String(address.city) : '',
        state: address?.state ? String(address.state) : '',
        postalCode: address?.postalCode || '',
        contactNumber: address?.contactNumber || '',
        otherNumber: address?.otherNumber || '',
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial data sync
    useEffect(() => {
        if (address) {
            setForm({
                addressLine1: address.addressLine1 || '',
                addressLine2: address.addressLine2 || '',
                country: address.country ? String(address.country) : '',
                city: address.city ? String(address.city) : '',
                state: address.state ? String(address.state) : '',
                postalCode: address.postalCode || '',
                contactNumber: address.contactNumber || '',
                otherNumber: address.otherNumber || '',
            });
            if (address.country) loadStates(address.country);
            if (address.state) loadCities(address.state);
        }
    }, [address]);

    useEffect(() => {
        fetch('/get-countries')
            .then(res => res.json())
            .then(data => setCountries(data.country || []));
    }, []);

    const loadStates = (countryId) => {
        fetch(`/get-states/${countryId}`)
            .then(res => res.json())
            .then(data => setStates(data.state || []));
    };

    const loadCities = (stateId) => {
        fetch(`/get-cities/${stateId}`)
            .then(res => res.json())
            .then(data => setCities(data.city || []));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'country') {
            setStates([]);
            setCities([]);
            if (value) loadStates(value);
        } else if (name === 'state') {
            setCities([]);
            if (value) loadCities(value);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post(route('user.address.update'), form, {
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false),
        });
    };

    return (
        <div className="profile-settings-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#23262F', margin: 0 }}>Address</h3>
                <button
                    className="button-style-2"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : (address ? "Save Changes" : "Save Address")}
                </button>
            </div>

            <p className="text-muted mb-5" style={{ fontSize: '14px', color: '#777E91' }}>
                Add your shipping address to ensure smooth deliveries for your auction wins.
                You can update or edit this address anytime for future purchases.
            </p>

            <form className="row g-4" onSubmit={handleSave}>
                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: '600' }}>Street Address 1*</label>
                    <input type="text" name="addressLine1" value={form.addressLine1} onChange={handleChange} className={`form-control ${errors.addressLine1 ? 'is-invalid' : ''}`} />
                    {errors.addressLine1 && <div className="invalid-feedback">{errors.addressLine1}</div>}
                </div>
                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: '600' }}>Street Address 2 (Optional)</label>
                    <input type="text" name="addressLine2" value={form.addressLine2} onChange={handleChange} className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>Country*</label>
                    <select name="country" value={form.country} onChange={handleChange} className={`form-select ${errors.country ? 'is-invalid' : ''}`}>
                        <option value="">Select Country</option>
                        {countries.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                    </select>
                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>State*</label>
                    <select name="state" value={form.state} onChange={handleChange} className={`form-select ${errors.state ? 'is-invalid' : ''}`}>
                        <option value="">Select State</option>
                        {states.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                    </select>
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>City*</label>
                    <select name="city" value={form.city} onChange={handleChange} className={`form-select ${errors.city ? 'is-invalid' : ''}`}>
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                    </select>
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>Postal Code</label>
                    <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>Contact Number</label>
                    <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '600' }}>Other Number (Optional)</label>
                    <input type="text" name="otherNumber" value={form.otherNumber} onChange={handleChange} className="form-control" />
                </div>
            </form>
        </div>
    );
}
