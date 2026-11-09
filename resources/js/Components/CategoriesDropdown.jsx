import { useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, usePage } from '@inertiajs/react';
import useTranslate from '@/hooks/useTranslate';
import { getCategoryBrowseUrl } from '@/Utils/categoryBrowseUrl';

const PRIORITY_ORDER = [
       (cat) => {
              const slug = String(cat?.slug || '').toLowerCase();
              const name = String(cat?.name || '').toLowerCase();
              return slug === 'real-estate-property-auction' || name === 'properties' || name.includes('property');
       },
       (cat) => {
              const slug = String(cat?.slug || '').toLowerCase();
              const name = String(cat?.name || '').toLowerCase();
              return slug.includes('vehicle') || name.includes('vehicle') || name.includes('car');
       },
       (cat) => {
              const slug = String(cat?.slug || '').toLowerCase();
              const name = String(cat?.name || '').toLowerCase();
              return slug.includes('home-renovation') || name.includes('home renovation') || (name.includes('renovation') && !name.includes('builder'));
       },
       (cat) => {
              const slug = String(cat?.slug || '').toLowerCase();
              const name = String(cat?.name || '').toLowerCase();
              return slug.includes('home-builder') || name.includes('home builder') || (name.includes('builder') && !name.includes('renovation'));
       },
];

function sortCategories(all = []) {
       if (!Array.isArray(all) || all.length === 0) return [];

       const prioritized = [];
       const used = new Set();

       PRIORITY_ORDER.forEach((match) => {
              const found = all.find(cat => !used.has(cat?.id ?? cat?.slug) && match(cat));
              if (found) {
                     used.add(found.id ?? found.slug);
                     prioritized.push(found);
              }
       });

       all.forEach((cat) => {
              const key = cat?.id ?? cat?.slug;
              if (key && !used.has(key)) {
                     used.add(key);
                     prioritized.push(cat);
              }
       });

       return prioritized;
}

export default function CategoriesDropdown() {
       const { t } = useTranslate();
       const { propertyFrontendUrl, propertyRootCategoryId, renovationFrontendUrl } = usePage().props;
       const [categories, setCategories] = useState([]);
       const [isOpen, setIsOpen] = useState(false);
       const dropdownRef = useRef(null);

       useEffect(() => {
              axios.get('/get-category')
                     .then(res => {
                            setCategories(res.data.categories || res.data.category || []);
                     })
                     .catch(err => console.error(err));
       }, []);

       const sortedCategories = useMemo(
              () => sortCategories(categories),
              [categories]
       );

       return (
              <div className="mobile-categories-wrapper w-100" ref={dropdownRef}>
                     <button
                            className="btn nav-link d-inline-flex align-items-center gap-1.5 w-100 justify-content-between"
                            type="button"
                            onClick={() => setIsOpen(prev => !prev)}
                            aria-expanded={isOpen}
                            style={{
                                   border: "none",
                                   background: "transparent",
                                   color: isOpen ? '#43ace9' : '#606060',
                                   fontWeight: 600,
                                   padding: '8px 0',
                                   display: 'flex',
                                   alignItems: 'center',
                            }}
                     >
                            <span>{t('Categories')}</span>
                            <i
                                   className={`fa-solid fa-chevron-down ms-1 ${isOpen ? 'rotate-180' : ''}`}
                                   style={{
                                          fontSize: '11px',
                                          transition: 'transform 0.2s ease',
                                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                   }}
                            />
                     </button>

                     {isOpen && (
                            <div className="mobile-categories-panel p-2 mt-1 rounded bg-light border">
                                   <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
                                          <span className="badge bg-white text-primary border" style={{ fontSize: '11px' }}>
                                                 {sortedCategories.length} {t('Categories')}
                                          </span>
                                          <Link
                                                 href="/categories"
                                                 className="small text-primary text-decoration-none fw-semibold"
                                                 onClick={() => setIsOpen(false)}
                                          >
                                                 {t('View All')} <i className="fa-solid fa-arrow-right ms-1" style={{ fontSize: '10px' }} />
                                          </Link>
                                   </div>

                                   <div className="d-flex flex-column gap-1.5" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                          {sortedCategories.map((cat) => {
                                                 const browse = getCategoryBrowseUrl(cat, {
                                                        propertyFrontendUrl,
                                                        propertyRootCategoryId,
                                                        renovationFrontendUrl,
                                                 });

                                                 return browse.external ? (
                                                        <a
                                                               key={cat.id ?? cat.slug}
                                                               href={browse.href}
                                                               className="p-2 rounded text-decoration-none text-dark d-flex align-items-center gap-2 bg-white border"
                                                               style={{ fontSize: '13.5px', fontWeight: 500 }}
                                                               target="_blank"
                                                               rel="noopener noreferrer"
                                                               onClick={() => setIsOpen(false)}
                                                        >
                                                               <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '10px' }} />
                                                               <span className="text-truncate">{cat.name}</span>
                                                        </a>
                                                 ) : (
                                                        <Link
                                                               key={cat.id ?? cat.slug}
                                                               href={browse.href}
                                                               className="p-2 rounded text-decoration-none text-dark d-flex align-items-center gap-2 bg-white border"
                                                               style={{ fontSize: '13.5px', fontWeight: 500 }}
                                                               onClick={() => setIsOpen(false)}
                                                        >
                                                               <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '10px' }} />
                                                               <span className="text-truncate">{cat.name}</span>
                                                        </Link>
                                                 );
                                          })}
                                   </div>
                            </div>
                     )}
              </div>
       );
}
