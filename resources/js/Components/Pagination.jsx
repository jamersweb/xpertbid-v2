import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
       if (links.length <= 3) return null;

       return (
              <nav aria-label="Page navigation">
                     <ul className="pagination pagination-md justify-content-center m-0">
                            {links.map((link, index) => (
                                   <li
                                          key={index}
                                          className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                   >
                                          <Link
                                                 className="page-link shadow-none border-0 rounded-3 mx-1 py-2 px-3 fw-bold"
                                                 href={link.url || '#'}
                                                 dangerouslySetInnerHTML={{ __html: link.label }}
                                                 preserveScroll
                                                 preserveState
                                                 style={{
                                                        color: link.active ? '#fff' : '#24282B',
                                                        backgroundColor: link.active ? '#D71920' : '#fff',
                                                        opacity: !link.url ? 0.5 : 1
                                                 }}
                                          />
                                   </li>
                            ))}
                     </ul>
              </nav>
       );
}
