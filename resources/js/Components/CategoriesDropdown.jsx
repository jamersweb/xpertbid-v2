import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, usePage } from '@inertiajs/react';
import useTranslate from '@/hooks/useTranslate';
import { getCategoryBrowseUrl } from '@/Utils/categoryBrowseUrl';

export default function CategoriesDropdown() {
       const { t } = useTranslate();
       const { propertyFrontendUrl, propertyRootCategoryId } = usePage().props;
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
                            style={{ border: "none", display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                     >
                            {t('Categories')}
                            <svg xmlns="http://www.w3.org/2000/svg"
                                   width="20"
                                   height="20"
                                   viewBox="0 0 20 20"
                                   fill="none"
                                   className="ms-0"
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
                            {categories.map((cat) => {
                                   const browse = getCategoryBrowseUrl(cat, { propertyFrontendUrl, propertyRootCategoryId });
                                   const className = "dropdown-item";

                                   if (browse.external) {
                                          return (
                                                 <li key={cat.id}>
                                                        <a href={browse.href} className={className} target="_blank" rel="noopener noreferrer">
                                                               {cat.name}
                                                        </a>
                                                 </li>
                                          );
                                   }

                                   return (
                                          <li key={cat.id}>
                                                 <Link href={browse.href} className={className}>
                                                        {cat.name}
                                                 </Link>
                                          </li>
                                   );
                            })}
                     </ul>
              </div>
       );
}
