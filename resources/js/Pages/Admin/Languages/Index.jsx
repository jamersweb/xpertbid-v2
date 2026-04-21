import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ languages = [] }) {
       const [showForm, setShowForm] = useState(false);
       const { data, setData, post, processing, reset, errors } = useForm({
              code: '',
              name: '',
              native_name: '',
              direction: 'ltr',
              is_active: true,
       });

       const submit = (e) => {
              e.preventDefault();

              post(route('admin.languages.store'), {
                     preserveScroll: true,
                     onSuccess: () => {
                            reset();
                            setShowForm(false);
                     },
              });
       };

       return (
              <AdminLayout title="Languages">
                     <Head title="Languages" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 d-flex align-items-center justify-content-between">
                                   <div>
                                          <h3 className="text-lg font-bold text-gray-800 mb-1">Languages</h3>
                                          <p className="text-sm text-gray-500 mb-0">Manage site languages and edit static translation content from the admin panel.</p>
                                   </div>
                                   <PrimaryButton type="button" onClick={() => setShowForm((value) => !value)}>
                                          <i className="fa-solid fa-plus me-2"></i>
                                          Add Language
                                   </PrimaryButton>
                            </div>

                            {showForm && (
                                   <div className="p-6 border-bottom border-gray-100 bg-gray-50">
                                          <form onSubmit={submit} className="row g-3">
                                                 <div className="col-md-2">
                                                        <label className="form-label fw-semibold text-dark">Code</label>
                                                        <input className="form-control" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="fr" />
                                                        {errors.code && <div className="text-danger small mt-1">{errors.code}</div>}
                                                 </div>
                                                 <div className="col-md-3">
                                                        <label className="form-label fw-semibold text-dark">Name</label>
                                                        <input className="form-control" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="French" />
                                                        {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                                                 </div>
                                                 <div className="col-md-3">
                                                        <label className="form-label fw-semibold text-dark">Native Name</label>
                                                        <input className="form-control" value={data.native_name} onChange={(e) => setData('native_name', e.target.value)} placeholder="Francais" />
                                                        {errors.native_name && <div className="text-danger small mt-1">{errors.native_name}</div>}
                                                 </div>
                                                 <div className="col-md-2">
                                                        <label className="form-label fw-semibold text-dark">Direction</label>
                                                        <select className="form-select" value={data.direction} onChange={(e) => setData('direction', e.target.value)}>
                                                               <option value="ltr">LTR</option>
                                                               <option value="rtl">RTL</option>
                                                        </select>
                                                 </div>
                                                 <div className="col-md-2 d-flex align-items-end">
                                                        <div className="form-check">
                                                               <input id="is_active" type="checkbox" className="form-check-input" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                                               <label htmlFor="is_active" className="form-check-label">Active</label>
                                                        </div>
                                                 </div>
                                                 <div className="col-12 d-flex justify-content-end gap-2">
                                                        <button type="button" className="btn btn-light" onClick={() => setShowForm(false)}>Cancel</button>
                                                        <PrimaryButton type="submit" disabled={processing}>
                                                               {processing ? 'Saving...' : 'Save Language'}
                                                        </PrimaryButton>
                                                 </div>
                                          </form>
                                   </div>
                            )}

                            <div className="table-responsive">
                                   <table className="table align-middle mb-0">
                                          <thead className="bg-light">
                                                 <tr>
                                                        <th className="px-4 py-3">Language</th>
                                                        <th className="px-4 py-3">Code</th>
                                                        <th className="px-4 py-3">Direction</th>
                                                        <th className="px-4 py-3">Status</th>
                                                        <th className="px-4 py-3 text-end">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody>
                                                 {languages.map((language) => (
                                                        <tr key={language.id}>
                                                               <td className="px-4 py-3">
                                                                      <div className="fw-bold text-dark">{language.name}</div>
                                                                      <div className="text-muted small">{language.native_name}</div>
                                                               </td>
                                                               <td className="px-4 py-3">
                                                                      <span className="badge bg-light text-dark text-uppercase">{language.code}</span>
                                                               </td>
                                                               <td className="px-4 py-3 text-uppercase">{language.direction}</td>
                                                               <td className="px-4 py-3">
                                                                      <button
                                                                             type="button"
                                                                             className={`btn btn-sm ${language.is_active ? 'btn-success' : 'btn-outline-secondary'}`}
                                                                             disabled={language.is_default}
                                                                             onClick={() => router.patch(route('admin.languages.toggle-status', language.id))}
                                                                      >
                                                                             {language.is_default ? 'Default' : (language.is_active ? 'Active' : 'Inactive')}
                                                                      </button>
                                                               </td>
                                                               <td className="px-4 py-3 text-end">
                                                                      <button
                                                                             type="button"
                                                                             className="btn btn-dark btn-sm"
                                                                             onClick={() => router.visit(route('admin.languages.edit', language.id))}
                                                                      >
                                                                             <i className="fa-solid fa-language me-2"></i>
                                                                             Manage Translations
                                                                      </button>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>
                     </div>
              </AdminLayout>
       );
}
