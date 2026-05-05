import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ blog }) {
       const blogTitle = typeof blog?.title === 'string' ? blog.title : 'Blog';
       const blogImage = typeof blog?.image === 'string' ? blog.image.trim() : '';
       const blogContent =
              typeof blog?.content === 'string'
                     ? blog.content
                     : typeof blog?.description === 'string'
                            ? blog.description
                            : typeof blog?.body === 'string'
                                   ? blog.body
                                   : '';
       const blogDescription =
              typeof blog?.excerpt === 'string' && blog.excerpt.trim()
                     ? blog.excerpt
                     : typeof blog?.meta_description === 'string' && blog.meta_description.trim()
                            ? blog.meta_description
                            : 'Read more on our blog.';
       const blogImageSrc = blogImage
              ? (blogImage.startsWith('http') ? blogImage : `/${encodeURI(blogImage)}`)
              : '';
       const publishedAt = blog?.created_at
              ? new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
              : '';
       const shareUrl =
              typeof window !== 'undefined'
                     ? window.location.href
                     : (typeof blog?.slug === 'string' && blog.slug ? route('blogs.show', blog.slug, false) : '');
       const canonicalUrl =
              typeof blog?.canonical_url === 'string' && blog.canonical_url.trim()
                     ? blog.canonical_url.trim()
                     : shareUrl;
       const shareText = blogTitle;

       const openShareTab = (url) => {
              if (typeof window === 'undefined') return;
              const newTab = window.open(url, '_blank');
              if (newTab) {
                     newTab.opener = null;
              }
       };

       const handleFacebookShare = () => {
              openShareTab(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
       };

       const handleTwitterShare = () => {
              openShareTab(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
       };

       const handleWhatsAppShare = () => {
              openShareTab(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`);
       };

       const copyShareLink = async () => {
              if (typeof window === 'undefined') return false;

              try {
                     if (navigator?.clipboard?.writeText) {
                            await navigator.clipboard.writeText(shareUrl);
                     } else {
                            const input = document.createElement('input');
                            input.value = shareUrl;
                            document.body.appendChild(input);
                            input.select();
                            document.execCommand('copy');
                            document.body.removeChild(input);
                     }

                     return true;
              } catch (error) {
                     return false;
              }
       };

       const handleInstagramShare = async () => {
              const copied = await copyShareLink();
              openShareTab('https://www.instagram.com/');
              window.alert(copied ? 'Blog link copied. Paste it on Instagram.' : 'Instagram opened. Please copy the blog link manually.');
       };

       const handleCopyLink = async () => {
              const copied = await copyShareLink();
              window.alert(copied ? 'Blog link copied.' : 'Unable to copy link.');
       };

       if (!blog) {
              return (
                     <AppLayout title="Blog Not Found">
                            <div className="container py-5 text-center">
                                   <h2>Blog not found or loading...</h2>
                                   <Link href={route('blogs.index')} className="btn btn-primary mt-3">Back to Blogs</Link>
                            </div>
                     </AppLayout>
              );
       }

       return (
                     <AppLayout title={blogTitle}>
                     <Head>
                            <title>{`${blogTitle} | XpertBid Blog`}</title>
                            <meta name="description" content={blogDescription} />
                            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
                            {blog.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
                     </Head>

                     <div className="bg-white min-vh-100 pb-5">
                            {/* Hero Header with Image */}
                            {blogImageSrc && (
                                   <div className="w-100 overflow-hidden" style={{ minHeight: '400px', maxHeight: '600px' }}>
                                          <img
                                                 src={blogImageSrc}
                                                 alt={blogTitle}
                                                 className="w-100 h-100"
                                                 style={{ objectFit: 'cover', minHeight: '400px', maxHeight: '600px' }}
                                          />
                                   </div>
                            )}

                            <div className="container py-5 mt-4">
                                   <div className="row justify-content-center">
                                          <div className="col-lg-8">
                                                 <div className="mb-5">
                                                        <Link href={route('blogs.index')} className="text-primary text-decoration-none fw-bold small mb-3 d-inline-block">
                                                               <i className="fa-solid fa-arrow-left me-2"></i> Back to Blogs
                                                        </Link>
                                                        <h1 className="fw-bolder display-4 text-dark mb-3">{blogTitle}</h1>
                                                        <p className="text-muted border-bottom pb-3">
                                                               Published on {publishedAt}
                                                        </p>
                                                 </div>

                                                 <div
                                                        className="blog-content fs-5 text-dark"
                                                        style={{ lineHeight: '1.8' }}
                                                        dangerouslySetInnerHTML={{ __html: blogContent }}
                                                 />

                                                 <hr className="my-5" />

                                                 <div className="bg-light p-4 rounded-4 border shadow-sm">
                                                        <h4 className="fw-bold mb-3 text-dark">Share this article</h4>
                                                        <div className="d-flex gap-3 blog-share-actions">
                                                               <button
                                                                      type="button"
                                                                      onClick={handleFacebookShare}
                                                                      className="btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center"
                                                                      style={{ width: '40px', height: '40px' }}
                                                                      aria-label="Share on Facebook"
                                                               >
                                                                      <i className="fa-brands fa-facebook-f"></i>
                                                               </button>
                                                               <button
                                                                      type="button"
                                                                      onClick={handleTwitterShare}
                                                                      className="btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center"
                                                                      style={{ width: '40px', height: '40px' }}
                                                                      aria-label="Share on X"
                                                               >
                                                                      <span className="fw-bold" style={{ fontSize: '15px', lineHeight: 1 }}>X</span>
                                                               </button>
                                                               <button
                                                                      type="button"
                                                                      onClick={handleWhatsAppShare}
                                                                      className="btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center"
                                                                      style={{ width: '40px', height: '40px' }}
                                                                      aria-label="Share on WhatsApp"
                                                               >
                                                                      <i className="fa-brands fa-whatsapp"></i>
                                                               </button>
                                                               <button
                                                                      type="button"
                                                                      onClick={handleInstagramShare}
                                                                      className="btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center"
                                                                      style={{ width: '40px', height: '40px' }}
                                                                      aria-label="Share on Instagram"
                                                               >
                                                                      <i className="fa-brands fa-instagram"></i>
                                                               </button>
                                                               <button
                                                                      type="button"
                                                                      onClick={handleCopyLink}
                                                                      className="btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center"
                                                                      style={{ width: '40px', height: '40px' }}
                                                                      aria-label="Copy link"
                                                               >
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
                .blog-share-btn {
                    background: #23262F;
                    color: #fff;
                    border: 1px solid #23262F;
                    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                }
                .blog-share-btn:hover,
                .blog-share-btn:focus,
                .blog-share-btn:active {
                    background: #43ACE9 !important;
                    border-color: #43ACE9 !important;
                    color: #fff !important;
                    transform: translateY(-1px);
                }
                .blog-share-btn i,
                .blog-share-btn span {
                    color: inherit;
                }
            `}} />
              </AppLayout>
       );
}
