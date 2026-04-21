import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';

export default function Index({ fields, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        listing_type: 'all',
        category_id: '',
        field_name: '',
        label: '',
        input_type: 'text',
        options: [],
        is_required: false,
    });

    const openModal = (field = null) => {
        setEditingField(field);
        if (field) {
            setData({
                listing_type: field.listing_type || 'all',
                category_id: field.category_id || '',
                field_name: field.field_name || '',
                label: field.label || '',
                input_type: field.input_type || 'text',
                options: field.options || [],
                is_required: field.is_required || false,
            });
        } else {
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingField) {
            put(route('admin.dynamic-fields.update', editingField.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.dynamic-fields.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingField(null);
        reset();
    };

    const deleteField = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This field will be deleted permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#d1d5db',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            router.delete(route('admin.dynamic-fields.destroy', id));
        }
    };

    return (
        <AdminLayout title="Dynamic Fields">
            <Head title="Dynamic Fields" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dynamic Fields</h1>
                <PrimaryButton onClick={() => openModal()}>
                    <i className="fa-solid fa-plus mr-2"></i> Add Field
                </PrimaryButton>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Field Name / Label</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Listing Type</th>
                                <th className="px-6 py-4">Required</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {fields.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                                        No dynamic fields found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                            {fields.map((field) => (
                                <tr key={field.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-800">{field.label}</span>
                                        <p className="text-[10px] text-gray-400">ID: {field.field_name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-600">
                                            {field.category ? field.category.name : 'All Categories'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase">
                                            {field.input_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                            field.listing_type === 'all' ? 'bg-gray-100 text-gray-700' :
                                            field.listing_type === 'auction' ? 'bg-purple-100 text-purple-700' :
                                            field.listing_type === 'business' ? 'bg-orange-100 text-orange-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {field.listing_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {field.is_required ? (
                                            <span className="text-rose-600 text-xs font-bold">YES</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">NO</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => openModal(field)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button onClick={() => deleteField(field.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">
                        {editingField ? 'Edit Dynamic Field' : 'Add New Dynamic Field'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel value="Field Label (e.g. Mileage)" required />
                            <TextInput
                                className="mt-1 block w-full text-gray-900 bg-white placeholder:text-gray-400"
                                value={data.label}
                                onChange={e => setData('label', e.target.value)}
                                required
                            />
                            <InputError message={errors.label} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Field ID / Name (e.g. mileage)" required />
                            <TextInput
                                className="mt-1 block w-full text-gray-900 bg-white placeholder:text-gray-400"
                                value={data.field_name}
                                onChange={e => setData('field_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.field_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Listing Type" required />
                            <select
                                className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white"
                                value={data.listing_type}
                                onChange={e => setData('listing_type', e.target.value)}
                                required
                            >
                                <option value="all">All Types</option>
                                <option value="normal">Normal</option>
                                <option value="auction">Auction</option>
                                <option value="business">Business</option>
                            </select>
                            <InputError message={errors.listing_type} className="mt-2" />
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div>
                                <InputLabel value="Main Category" />
                                <select
                                    className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white"
                                    value={(() => {
                                        const cat = categories.find(c =>
                                            c.id == data.category_id ||
                                            c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                        );
                                        return cat?.id || '';
                                    })()}
                                    onChange={e => {
                                        setData('category_id', e.target.value);
                                    }}
                                >
                                    <option value="">Global (All Categories)</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel value="Sub Category" />
                                <select
                                    className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white"
                                    disabled={!categories.find(c =>
                                        c.id == data.category_id ||
                                        c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                    )}
                                    value={(() => {
                                        const root = categories.find(c =>
                                            c.id == data.category_id ||
                                            c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                        );
                                        const sub = root?.sub_categories?.find(sc =>
                                            sc.id == data.category_id ||
                                            sc.child_categories?.some(cc => cc.id == data.category_id)
                                        );
                                        return sub?.id || '';
                                    })()}
                                    onChange={e => {
                                        const subId = e.target.value;
                                        if (subId) {
                                            setData('category_id', subId);
                                        } else {
                                            const root = categories.find(c =>
                                                c.id == data.category_id ||
                                                c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                            );
                                            setData('category_id', root?.id || '');
                                        }
                                    }}
                                >
                                    <option value="">None (Apply to Root)</option>
                                    {categories.find(c =>
                                        c.id == data.category_id ||
                                        c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                    )?.sub_categories?.map(sc => (
                                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel value="Child Category" />
                                <select
                                    className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white"
                                    disabled={!(() => {
                                        const root = categories.find(c =>
                                            c.id == data.category_id ||
                                            c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                        );
                                        return root?.sub_categories?.find(sc =>
                                            sc.id == data.category_id ||
                                            sc.child_categories?.some(cc => cc.id == data.category_id)
                                        );
                                    })()}
                                    value={(() => {
                                        const root = categories.find(c =>
                                            c.id == data.category_id ||
                                            c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                        );
                                        const sub = root?.sub_categories?.find(sc =>
                                            sc.id == data.category_id ||
                                            sc.child_categories?.some(cc => cc.id == data.category_id)
                                        );
                                        const child = sub?.child_categories?.find(cc => cc.id == data.category_id);
                                        return child?.id || '';
                                    })()}
                                    onChange={e => {
                                        const childId = e.target.value;
                                        if (childId) {
                                            setData('category_id', childId);
                                        } else {
                                            const root = categories.find(c =>
                                                c.id == data.category_id ||
                                                c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                            );
                                            const sub = root?.sub_categories?.find(sc =>
                                                sc.id == data.category_id ||
                                                sc.child_categories?.some(cc => cc.id == data.category_id)
                                            );
                                            setData('category_id', sub?.id || '');
                                        }
                                    }}
                                >
                                    <option value="">None (Apply to Sub)</option>
                                    {(() => {
                                        const root = categories.find(c =>
                                            c.id == data.category_id ||
                                            c.sub_categories?.some(sc => sc.id == data.category_id || sc.child_categories?.some(cc => cc.id == data.category_id))
                                        );
                                        const sub = root?.sub_categories?.find(sc =>
                                            sc.id == data.category_id ||
                                            sc.child_categories?.some(cc => cc.id == data.category_id)
                                        );
                                        return sub?.child_categories?.map(cc => (
                                            <option key={cc.id} value={cc.id}>{cc.name}</option>
                                        ));
                                    })()}
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <InputError message={errors.category_id} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Input Type" required />
                            <select
                                className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white"
                                value={data.input_type}
                                onChange={e => setData('input_type', e.target.value)}
                                required
                            >
                                <option value="text">Text Input</option>
                                <option value="number">Number Input</option>
                                <option value="select">Dropdown (Select)</option>
                                <option value="radio">Radio Buttons</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="textarea">Text Area</option>
                            </select>
                            <InputError message={errors.input_type} className="mt-2" />
                        </div>

                        <div className="flex items-center mt-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-black shadow-sm focus:ring-black w-5 h-5"
                                    checked={data.is_required}
                                    onChange={e => setData('is_required', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-700 font-bold uppercase tracking-wider">Is Required?</span>
                            </label>
                        </div>

                        {(data.input_type === 'select' || data.input_type === 'radio') && (
                            <div className="md:col-span-2 border-t pt-4">
                                <InputLabel value="Options (JSON array of strings)" />
                                <textarea
                                    className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900 bg-white placeholder:text-gray-400"
                                    rows="3"
                                    placeholder='["Option 1", "Option 2"]'
                                    value={typeof data.options === 'string' ? data.options : JSON.stringify(data.options)}
                                    onChange={e => {
                                        try {
                                            setData('options', JSON.parse(e.target.value));
                                        } catch(err) {
                                            setData('options', e.target.value);
                                        }
                                    }}
                                ></textarea>
                                <p className="text-[10px] text-gray-400 mt-1">Enter a valid JSON array of options for dropdown/radio.</p>
                                <InputError message={errors.options} className="mt-2" />
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {editingField ? 'Update Field' : 'Create Field'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
