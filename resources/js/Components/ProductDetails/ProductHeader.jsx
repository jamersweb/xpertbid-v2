import { Link } from '@inertiajs/react';

export default function ProductHeader({ views, productId, slug, link }) {
       // Build a share URL using slug
       const shareUrl = typeof window !== "undefined"
              ? (link || `${window.location.origin}/product/${slug}`)
              : "";

       const handleCopyLink = () => {
              if (!shareUrl) return;
              navigator.clipboard
                     .writeText(shareUrl)
                     .then(() => alert("Link copied to clipboard!"))
                     .catch((err) => console.error("Failed to copy link:", err));
       };

       return (
              <section className="prodcut-detail-links" style={{ paddingTop: '100px' }}>
                     <div className="container-fluid">
                            <div className="row">
                                   <div className="col-md-6">
                                          <div className="product-back-and-head">
                                                 <Link href="/marketplace">
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                 </Link>
                                                 <h3>Product Detail</h3>
                                          </div>
                                   </div>
                                   <div className="col-md-6">
                                          <div className="product-copy-and-view">
                                                 <span style={{ display: 'flex', alignItems: 'center' }}>
                                                        {/* eye icon */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                               viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                                                               <path d="M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z" fill="#43ACE9" stroke="#43ACE9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                               <path d="M12.0001 20.2702C15.5301 20.2702 18.8201 18.1902 21.1101 14.5902C22.0101 13.1802 22.0101 10.8102 21.1101 9.40021C18.8201 5.80021 15.5301 3.72021 12.0001 3.72021C8.47009 3.72021 5.18009 5.80021 2.89009 9.40021C1.99009 10.8102 1.99009 13.1802 2.89009 14.5902C5.18009 18.1902 8.47009 20.2702 12.0001 20.2702Z" stroke="#43ACE9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        {views || 0}
                                                 </span>

                                                 <button onClick={handleCopyLink} className="copy-link-button" style={{ display: 'flex', alignItems: 'center' }}>
                                                        {/* share icon */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '12px' }}>
                                                               <path d="M20.3601 12.7301C19.9901 12.7301 19.6801 12.4501 19.6401 12.0801C19.4001 9.88007 18.2201 7.90007 16.4001 6.64007C16.0701 6.41007 15.9901 5.96007 16.2201 5.63007C16.4501 5.30007 16.9001 5.22007 17.2301 5.45007C19.4001 6.96007 20.8001 9.32007 21.0901 11.9301C21.1301 12.3301 20.8401 12.6901 20.4401 12.7301C20.4101 12.7301 20.3901 12.7301 20.3601 12.7301Z" fill="#23262F" />
                                                               <path d="M3.74029 12.7802C3.72029 12.7802 3.69029 12.7802 3.67029 12.7802C3.27029 12.7402 2.98029 12.3802 3.02029 11.9802C3.29029 9.3702 4.67029 7.0102 6.82029 5.4902C7.14029 5.2602 7.60029 5.3402 7.83029 5.6602C8.06029 5.9902 7.98029 6.4402 7.66029 6.6702C5.86029 7.9502 4.69029 9.9302 4.47029 12.1202C4.43029 12.5002 4.11029 12.7802 3.74029 12.7802Z" fill="#23262F" />
                                                               <path d="M15.9896 21.0998C14.7596 21.6898 13.4396 21.9898 12.0596 21.9898C10.6196 21.9898 9.24961 21.6698 7.96961 21.0198C7.60961 20.8498 7.46961 20.4098 7.64961 20.0498C7.81961 19.6898 8.25961 19.5498 8.61961 19.7198C9.24961 20.0398 9.91961 20.2598 10.5996 20.3898C11.5196 20.5698 12.4596 20.5798 13.3796 20.4198C14.0596 20.2998 14.7296 20.0898 15.3496 19.7898C15.7196 19.6198 16.1596 19.7598 16.3196 20.1298C16.4996 20.4898 16.3596 20.9298 15.9896 21.0998Z" fill="#23262F" />
                                                               <path d="M12.0505 2.00977C10.5005 2.00977 9.23047 3.26977 9.23047 4.82977C9.23047 6.38977 10.4905 7.64977 12.0505 7.64977C13.6105 7.64977 14.8705 6.38977 14.8705 4.82977C14.8705 3.26977 13.6105 2.00977 12.0505 2.00977Z" fill="#23262F" />
                                                               <path d="M5.05047 13.8701C3.50047 13.8701 2.23047 15.1301 2.23047 16.6901C2.23047 18.2501 3.49047 19.5101 5.05047 19.5101C6.61047 19.5101 7.87047 18.2501 7.87047 16.6901C7.87047 15.1301 6.60047 13.8701 5.05047 13.8701Z" fill="#23262F" />
                                                               <path d="M18.9499 13.8701C17.3999 13.8701 16.1299 15.1301 16.1299 16.6901C16.1299 18.2501 17.3899 19.5101 18.9499 19.5101C20.5099 19.5101 21.7699 18.2501 21.7699 16.6901C21.7699 15.1301 20.5099 13.8701 18.9499 13.8701Z" fill="#23262F" />
                                                        </svg>
                                                        Share
                                                 </button>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </section>
       );
}
