import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Link, usePage } from '@inertiajs/react';
import useTranslate from '@/hooks/useTranslate';
import { getCategoryBrowseUrl } from '@/Utils/categoryBrowseUrl';

const HEADER_CATEGORY_LIMIT = 10;

/** Must always appear in the logged-out desktop header dropdown when present in API data. */
const PRIORITY_MATCHERS = [
       (cat) => {
              const slug = String(cat.slug || '').toLowerCase();
              const name = String(cat.name || '').toLowerCase();
              return slug === 'real-estate-property-auction' || name === 'properties' || name.includes('property');
       },
       (cat) => {
              const slug = String(cat.slug || '').toLowerCase();
              const name = String(cat.name || '').toLowerCase();
              return slug.includes('vehicle') || name.includes('vehicle');
       },
       (cat) => {
              const slug = String(cat.slug || '').toLowerCase();
              const name = String(cat.name || '').toLowerCase();
              return slug.includes('home-renovation') || name.includes('home renovation') || (name.includes('renovation') && !name.includes('builder'));
       },
       (cat) => {
              const slug = String(cat.slug || '').toLowerCase();
              const name = String(cat.name || '').toLowerCase();
              return slug.includes('home-builder') || name.includes('home builder') || (name.includes('builder') && !name.includes('renovation'));
       },
];

function pickHeaderCategories(all = [], limit = HEADER_CATEGORY_LIMIT) {
       if (!Array.isArray(all) || all.length === 0) return [];

       const picked = [];
       const used = new Set();

       const push = (cat) => {
              if (!cat) return;
              const key = String(cat.id ?? cat.slug ?? cat.name);
              if (used.has(key)) return;
              used.add(key);
              picked.push(cat);
       };

       PRIORITY_MATCHERS.forEach((match) => {
              if (picked.length >= limit) return;
              push(all.find(match));
       });

       all.forEach((cat) => {
              if (picked.length >= limit) return;
              push(cat);
       });

       return picked.slice(0, limit);
}

export default function DesktopCategoriesDropdown() {
       const { t } = useTranslate();
       const { propertyFrontendUrl, propertyRootCategoryId, renovationFrontendUrl } = usePage().props;
       const [categories, setCategories] = useState([]);
       const [isOpen, setIsOpen] = useState(false);
       const dropdownRef = useRef(null);
       const btnRef = useRef(null);

       // Fetch root categories
       useEffect(() => {
              // Relative path to web.php route
              axios.get('/get-category')
                     .then(res => setCategories(res.data.categories || []))
                     .catch(err => console.error(err));
       }, []);

       const headerCategories = useMemo(
              () => pickHeaderCategories(categories, HEADER_CATEGORY_LIMIT),
              [categories]
       );

       // Bootstrap event listeners for dropdown open/close
       useEffect(() => {
              const dropdown = dropdownRef.current;
              if (!dropdown) return;

              // Use native bootstrap events if available, or manual toggling if using React-Bootstrap
              // Since we are likely using vanilla Bootstrap JS included in layout:
              const handleShow = () => setIsOpen(true);
              const handleHide = () => setIsOpen(false);

              dropdown.addEventListener('show.bs.dropdown', handleShow);
              dropdown.addEventListener('hide.bs.dropdown', handleHide);
              return () => {
                     dropdown.removeEventListener('show.bs.dropdown', handleShow);
                     dropdown.removeEventListener('hide.bs.dropdown', handleHide);
              };
       }, []);

       return (
              <div className="dropdown" ref={dropdownRef}>
                     <a
                            className="btn nav-link d-flex align-items-center"
                            href="#"
                            ref={btnRef}
                            role="button"
                            id="categoriesDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded={isOpen}
                            style={{ border: "none" }}
                     >
                            {t('Categories')}
                            <svg
                                   xmlns="http://www.w3.org/2000/svg"
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
                     </a>

                     <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                            {headerCategories.map(cat => {
                                   const browse = getCategoryBrowseUrl(cat, {
                                          propertyFrontendUrl,
                                          propertyRootCategoryId,
                                          renovationFrontendUrl,
                                   });
                                   const className = "dropdown-item";
                                   const key = cat.id ?? cat.slug;

                                   if (browse.external) {
                                          return (
                                                 <li key={key}>
                                                        <a href={browse.href} className={className} target="_blank" rel="noopener noreferrer">
                                                               {cat.name}
                                                        </a>
                                                 </li>
                                          );
                                   }

                                   return (
                                          <li key={key}>
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
