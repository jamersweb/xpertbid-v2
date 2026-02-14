import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ blog }) {
       return (
              <AppLayout title={blog.title}>
                     <Head>
                            <title>{blog.title} | XpertBid Blog</title>
                            <meta name="description" content={blog.excerpt || blog.meta_description || "Read more on nuestra blog."} />
                            {blog.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
                     </Head>

                     <div className="bg-white min-vh-100 pb-5">
                            {/* Hero Header with Image */}
                            {blog.image && (
                                   <div className="position-relative w-100 overflow-hidden" style={{ minHeight: '400px', maxHeight: '600px' }}>
                                          <img
                                                 src={blog.image.startsWith('http') ? blog.image : `https://admin.xpertbid.com/${blog.image}`}
                                                 alt={blog.title}
                                                 className="w-100 h-100 position-absolute"
                                                 style={{ objectFit: 'cover', top: 0, left: 0 }}
                                          />
                                          <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5))' }}></div>
                                          <div className="position-absolute bottom-0 start-0 w-100 p-5 text-white">
                                                 <div className="container">
                                                        <Link href={route('blogs.index')} className="btn btn-primary btn-sm rounded-pill px-3 mb-3">
                                                               <i className="fa-solid fa-arrow-left me-2"></i> Back to Blogs
                                                        </Link>
                                                        <h1 className="fw-bolder display-5 mb-2">{blog.title}</h1>
                                                        <p className="opacity-75 fs-5">
                                                               <i className="fa-regular fa-calendar-days me-2"></i>
                                                               {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                 </div>
                                          </div>
                                   </div>
                            )}

                            <div className="container py-5 mt-4">
                                   <div className="row justify-content-center">
                                          <div className="col-lg-8">
                                                 {!blog.image && (
                                                        <div className="mb-5">
                                                               <Link href={route('blogs.index')} className="text-primary text-decoration-none fw-bold small mb-3 d-inline-block">
                                                                      <i className="fa-solid fa-arrow-left me-2"></i> Back to Blogs
                                                               </Link>
                                                               <h1 className="fw-bolder display-4 text-dark mb-3">{blog.title}</h1>
                                                               <p className="text-muted border-bottom pb-3">
                                                                      Published on {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                               </p>
                                                        </div>
                                                 )}

                                                 <div
                                                        className="blog-content fs-5 text-dark"
                                                        style={{ lineHeight: '1.8' }}
                                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                                 />

                                                 <hr className="my-5" />

                                                 <div className="bg-light p-4 rounded-4 border shadow-sm">
                                                        <h4 className="fw-bold mb-3">Share this article</h4>
                                                        <div className="d-flex gap-3">
                                                               <button className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                                      <i className="fa-brands fa-facebook-f"></i>
                                                               </button>
                                                               <button className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                                      <i className="fa-brands fa-twitter"></i>
                                                               </button>
                                                               <button className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                                      <i className="fa-brands fa-whatsapp"></i>
                                                               </button>
                                                               <button className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                                      <i className="fa-solid fa-link"></i>
                                                               </button>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .blog-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 2rem 0;
                }
                .blog-content h2, .blog-content h3 {
                    font-weight: bold;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                }
                .blog-content p {
                    margin-bottom: 1.5rem;
                }
                .blog-content ul, .blog-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
            `}} />
              </AppLayout>
       );
}
