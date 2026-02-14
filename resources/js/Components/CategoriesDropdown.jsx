import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function CategoriesDropdown() {
       const [categories, setCategories] = useState([]);
       const [isOpen, setIsOpen] = useState(false);
       const btnRef = useRef();

       useEffect(() => {
              // Relative path to web.php route
              axios.get('/get-all-categories')
                     .then(res => {
                            // Controller returns { category: [...] } or { categories: [...] }
                            // We check both based on analysis.
                            setCategories(res.data.category || res.data.categories || []);
                     })
                     .catch(err => console.error(err));
       }, []);

       // Bootstrap events sync
       useEffect(() => {
              const btn = btnRef.current;
              if (!btn) return;

              // Bootstrap fires these events on the button's dropdown parent
              const dropdownParent = btn.parentNode;
              if (!dropdownParent) return;

              function handleShow() { setIsOpen(true); }
              function handleHide() { setIsOpen(false); }

              dropdownParent.addEventListener('show.bs.dropdown', handleShow);
              dropdownParent.addEventListener('hide.bs.dropdown', handleHide);

              return () => {
                     dropdownParent.removeEventListener('show.bs.dropdown', handleShow);
                     dropdownParent.removeEventListener('hide.bs.dropdown', handleHide);
              };
       }, []);

       return (
              <div className="dropdown">
                     <button
                            className="btn nav-link dropdown-toggle"
                            type="button"
                            id="categoriesDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded={isOpen}
                            ref={btnRef}
                            style={{ border: "none" }}
                     >
                            Categories
                            <svg xmlns="http://www.w3.org/2000/svg"
                                   width="20"
                                   height="20"
                                   viewBox="0 0 20 20"
                                   fill="none"
                                   className="ms-1"
                            >
                                   {isOpen ? (
                                          // UP arrow
                                          <path
                                                 d="M3.4001 12.5416L8.83344 7.10829C9.4751 6.46663 10.5251 6.46663 11.1668 7.10829L16.6001 12.5416"
                                                 stroke="#606060"
                                                 strokeWidth="1.5"
                                                 strokeLinecap="round"
                                                 strokeLinejoin="round"
                                          />
                                   ) : (
                                          // DOWN arrow
                                          <path
                                                 d="M16.5999 7.45837L11.1666 12.8917C10.5249 13.5334 9.4749 13.5334 8.83324 12.8917L3.3999 7.45837"
                                                 stroke="#606060"
                                                 strokeWidth="1.5"
                                                 strokeLinecap="round"
                                                 strokeLinejoin="round"
                                          />
                                   )}
                            </svg>
                     </button>
                     <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                            {categories.map(cat => (
                                   <li key={cat.id} className={cat.subCategories?.length ? 'dropend' : ''}>
                                          {cat.subCategories?.length > 0 ? (
                                                 <>
                                                        <button
                                                               className="dropdown-item dropdown-toggle"
                                                               type="button"
                                                               data-bs-toggle="dropdown"
                                                               aria-expanded="false"
                                                        >
                                                               {cat.name}
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                               {cat.subCategories.map(sub => (
                                                                      <li key={sub.id}>
                                                                             <Link
                                                                                    href={route('marketplace.index', sub.slug)}
                                                                                    className="dropdown-item"
                                                                             >
                                                                                    {sub.name}
                                                                             </Link>
                                                                      </li>
                                                               ))}
                                                        </ul>
                                                 </>
                                          ) : (
                                                 <Link
                                                        href={route('marketplace.index', cat.slug)}
                                                        className="dropdown-item"
                                                 >
                                                        {cat.name}
                                                 </Link>
                                          )}
                                   </li>
                            ))}
                     </ul>
              </div>
       );
}
