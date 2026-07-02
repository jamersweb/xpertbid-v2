import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';

export default function ExportCsvButton({
       routeName,
       params = {},
       label = 'Export CSV',
       title = 'Export Data',
       description = 'Select a date range to download data as a CSV file.',
}) {
       const [isOpen, setIsOpen] = useState(false);
       const [from, setFrom] = useState('');
       const [to, setTo] = useState('');

       const handleExport = (e) => {
              e.preventDefault();

              if (!from || !to) {
                     Swal.fire({
                            title: 'Date range required',
                            text: 'Please select both from and to dates before exporting.',
                            icon: 'warning',
                            confirmButtonColor: '#000000',
                     });
                     return;
              }

              const searchParams = new URLSearchParams({ from, to });

              Object.entries(params).forEach(([key, value]) => {
                     if (value !== undefined && value !== null && value !== '') {
                            searchParams.set(key, value);
                     }
              });

              window.location.href = `${route(routeName)}?${searchParams.toString()}`;
       };

       return (
              <>
                     <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 whitespace-nowrap"
                     >
                            <i className="fa-solid fa-file-csv"></i>
                            {label}
                     </button>

                     <Modal show={isOpen} onClose={() => setIsOpen(false)} maxWidth="md">
                            <form onSubmit={handleExport} className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-1">{title}</h2>
                                   <p className="text-sm text-gray-500 mb-6">{description}</p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div>
                                                 <InputLabel htmlFor={`${routeName}_from`} value="From Date" />
                                                 <TextInput
                                                        id={`${routeName}_from`}
                                                        type="date"
                                                        className="mt-1 block w-full text-gray-900"
                                                        value={from}
                                                        onChange={(e) => setFrom(e.target.value)}
                                                        required
                                                 />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor={`${routeName}_to`} value="To Date" />
                                                 <TextInput
                                                        id={`${routeName}_to`}
                                                        type="date"
                                                        className="mt-1 block w-full text-gray-900"
                                                        value={to}
                                                        onChange={(e) => setTo(e.target.value)}
                                                        min={from || undefined}
                                                        required
                                                 />
                                          </div>
                                   </div>

                                   <div className="mt-8 flex justify-end gap-3">
                                          <SecondaryButton onClick={() => setIsOpen(false)}>Cancel</SecondaryButton>
                                          <button type="submit" className="inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 gap-2">
                                                 <i className="fa-solid fa-file-csv"></i>
                                                 {label}
                                          </button>
                                   </div>
                            </form>
                     </Modal>
              </>
       );
}
