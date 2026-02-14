import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ blogs }) {
       const truncateWords = (str = "", limit = 20) => {
              if (!str) return "";
              const words = str.trim().split(/\s+/);
              return words.length <= limit ? str : words.slice(0, limit).join(" ") + "...";
       };

       const stripHtml = (html = "") => html ? html.replace(/<[^>]*>/g, "") : "";

       const pickContent = (b) =>
              b?.excerpt ||
              b?.short_description ||
              b?.description ||
              b?.content ||
              b?.body ||
              "";

       const truncateChars = (str = "", limit = 80) =>
              str && str.length <= limit ? str : (str ? str.slice(0, limit) + "..." : "");

       return (
              <AppLayout title="Blogs">
                     <Head>
                            <title>Blogs | XpertBid</title>
                            <meta name="description" content="Stay updated with the latest news and guides from XpertBid." />
                     </Head>

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container">
                                   <div className="text-center mb-5">
                                          <h1 className="fw-bolder display-4 text-dark mb-3">Our Blogs</h1>
                                          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                                                 Discover insights, tips, and stories about auctions, vehicles, real estate, and more.
                                          </p>
                                   </div>

                                   <div className="row g-4 mb-5">
                                          {blogs.data.map((blog) => {
                                                 const displayTitle = truncateWords(blog?.title || "", 15);
                                                 const excerpt = pickContent(blog);
                                                 const displayExcerpt = truncateChars(stripHtml(excerpt), 120);

                                                 return (
                                                        <div key={blog.id} className="col-md-6 col-lg-4">
                                                               <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden blog-card">
                                                                      <Link href={route('blogs.show', blog.slug)} className="text-decoration-none">
                                                                             <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                                                                                    <img
                                                                                           src={blog.image ? (blog.image.startsWith('http') ? blog.image : `https://admin.xpertbid.com/${blog.image}`) : '/assets/images/WebsiteBanner2.png'}
                                                                                           className="card-img-top w-100 h-100 object-fit-cover transition-all"
                                                                                           alt={blog.title}
                                                                                    />
                                                                                    <div className="position-absolute top-0 start-0 m-3 px-3 py-2 bg-white rounded-pill shadow-sm small fw-bold text-primary">
                                                                                           {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                                    </div>
                                                                             </div>
                                                                      </Link>

                                                                      <div className="card-body p-4 d-flex flex-column">
                                                                             <Link href={route('blogs.show', blog.slug)} className="text-decoration-none">
                                                                                    <h5 className="card-title fw-bold text-dark mb-3 h4" style={{ lineHeight: '1.4' }}>
                                                                                           {displayTitle}
                                                                                    </h5>
                                                                             </Link>

                                                                             <p className="card-text text-muted mb-4 flex-grow-1" style={{ fontSize: '0.95rem' }}>
                                                                                    {displayExcerpt}
                                                                             </p>

                                                                             <Link
                                                                                    href={route('blogs.show', blog.slug)}
                                                                                    className="btn btn-outline-primary rounded-pill px-4 fw-bold align-self-start transition-all"
                                                                             >
                                                                                    Read More <i className="fa-solid fa-arrow-right ms-2 small"></i>
                                                                             </Link>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 );
                                          })}

                                          {blogs.data.length === 0 && (
                                                 <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm border">
                                                        <div className="mb-3 opacity-25">
                                                               <i className="fa-solid fa-newspaper fa-4x"></i>
                                                        </div>
                                                        <h3 className="h4 fw-bold">No Blogs Found</h3>
                                                        <p className="text-muted">Stay tuned! We'll be posting some interesting content soon.</p>
                                                 </div>
                                          )}
                                   </div>

                                   {blogs.links && (
                                          <div className="d-flex justify-content-center mt-5">
                                                 <Pagination links={blogs.links} />
                                          </div>
                                   )}
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .blog-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .blog-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                }
                .blog-card .card-img-top {
                    transition: transform 0.5s ease;
                }
                .blog-card:hover .card-img-top {
                    transform: scale(1.1);
                }
                .object-fit-cover {
                    object-fit: cover;
                }
            `}} />
              </AppLayout>
       );
}
