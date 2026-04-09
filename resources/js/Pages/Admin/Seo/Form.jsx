import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ title, heading, seo = null, submitLabel, submitRoute, submitMethod = 'post' }) {
       const { data, setData, post, put, processing, errors } = useForm({
              slug: seo?.slug || '',
              meta_title: seo?.meta_title || '',
              meta_description: seo?.meta_description || '',
              meta_keywords: seo?.meta_keywords || '',
              schema_markup: seo?.schema_markup || '',
              canonical_url: seo?.canonical_url || '',
       });

       const submit = (e) => {
              e.preventDefault();

              const options = {
                     preserveScroll: true,
              };

              if (submitMethod === 'put') {
                     put(submitRoute, options);
                     return;
              }

              post(submitRoute, options);
       };

       return (
              <AdminLayout title={title}>
                     <Head title={title} />

                     <div className="max-w-4xl">
                            <div className="mb-6">
                                   <Link href={route('admin.seo.index')} className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
                                          <i className="fa-solid fa-arrow-left mr-2"></i> Back to SEO Records
                                   </Link>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                   <h1 className="text-2xl font-bold text-gray-900 mb-8">{heading}</h1>

                                   <form onSubmit={submit} className="space-y-6">
                                          <div>
                                                 <InputLabel htmlFor="slug" value="Slug / Page Path" />
                                                 <TextInput
                                                        id="slug"
                                                        className="mt-1 block w-full text-gray-900 placeholder:text-gray-400"
                                                        value={data.slug}
                                                        onChange={(e) => setData('slug', e.target.value)}
                                                        placeholder="/my-page-path"
                                                        required
                                                 />
                                                 <InputError message={errors.slug} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="meta_title" value="Meta Title" />
                                                 <TextInput
                                                        id="meta_title"
                                                        className="mt-1 block w-full text-gray-900 placeholder:text-gray-400"
                                                        value={data.meta_title}
                                                        onChange={(e) => setData('meta_title', e.target.value)}
                                                        placeholder="Enter meta title"
                                                 />
                                                 <InputError message={errors.meta_title} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="meta_description" value="Meta Description" />
                                                 <textarea
                                                        id="meta_description"
                                                        className="mt-1 block w-full border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                        value={data.meta_description}
                                                        onChange={(e) => setData('meta_description', e.target.value)}
                                                        rows="4"
                                                        placeholder="Enter meta description"
                                                 />
                                                 <InputError message={errors.meta_description} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="meta_keywords" value="Meta Keywords" />
                                                 <TextInput
                                                        id="meta_keywords"
                                                        className="mt-1 block w-full text-gray-900 placeholder:text-gray-400"
                                                        value={data.meta_keywords}
                                                        onChange={(e) => setData('meta_keywords', e.target.value)}
                                                        placeholder="keyword1, keyword2, keyword3"
                                                 />
                                                 <InputError message={errors.meta_keywords} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="canonical_url" value="Canonical URL" />
                                                 <TextInput
                                                        id="canonical_url"
                                                        className="mt-1 block w-full text-gray-900 placeholder:text-gray-400"
                                                        value={data.canonical_url}
                                                        onChange={(e) => setData('canonical_url', e.target.value)}
                                                        placeholder="https://example.com/page"
                                                 />
                                                 <InputError message={errors.canonical_url} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="schema_markup" value="Schema Markup (JSON-LD)" />
                                                 <textarea
                                                        id="schema_markup"
                                                        className="mt-1 block w-full border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm font-mono text-sm"
                                                        value={data.schema_markup}
                                                        onChange={(e) => setData('schema_markup', e.target.value)}
                                                        rows="8"
                                                        placeholder='{"@context":"https://schema.org"}'
                                                 />
                                                 <InputError message={errors.schema_markup} className="mt-2" />
                                          </div>

                                          <div className="pt-4 flex items-center justify-end gap-3">
                                                 <SecondaryButton type="button" onClick={() => window.history.back()}>
                                                        Cancel
                                                 </SecondaryButton>
                                                 <PrimaryButton disabled={processing}>
                                                        {processing ? 'Saving...' : submitLabel}
                                                 </PrimaryButton>
                                          </div>
                                   </form>
                            </div>
                     </div>
              </AdminLayout>
       );
}
