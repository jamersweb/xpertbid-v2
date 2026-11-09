import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Link, usePage } from '@inertiajs/react';
import useTranslate from '@/hooks/useTranslate';
import { getCategoryBrowseUrl } from '@/Utils/categoryBrowseUrl';

// Priority order for prominent main verticals
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

	// Place priority categories first
	PRIORITY_ORDER.forEach((match) => {
		const found = all.find(cat => !used.has(cat?.id ?? cat?.slug) && match(cat));
		if (found) {
			used.add(found.id ?? found.slug);
			prioritized.push(found);
		}
	});

	// Append all other categories with products without any limit
	all.forEach((cat) => {
		const key = cat?.id ?? cat?.slug;
		if (key && !used.has(key)) {
			used.add(key);
			prioritized.push(cat);
		}
	});

	return prioritized;
}

export default function DesktopCategoriesDropdown() {
	const { t } = useTranslate();
	const { propertyFrontendUrl, propertyRootCategoryId, renovationFrontendUrl } = usePage().props;
	const [categories, setCategories] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const closeTimeoutRef = useRef(null);

	// Fetch root categories (includes all categories with products + vehicle)
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

	const handleMouseEnter = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
		setIsOpen(true);
	};

	const handleMouseLeave = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}
		closeTimeoutRef.current = setTimeout(() => {
			setIsOpen(false);
		}, 220);
	};

	// Close on outside click
	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
			if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
		};
	}, []);

	return (
		<div
			className="category-nav-item"
			ref={dropdownRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Toggle Button */}
			<button
				type="button"
				className={`btn nav-link d-inline-flex align-items-center gap-1 categories-nav-btn ${isOpen ? 'is-open' : ''}`}
				onClick={() => setIsOpen(prev => !prev)}
				aria-expanded={isOpen}
				id="categoriesDropdown"
				style={{
					border: 'none',
					background: 'transparent',
					color: isOpen ? '#43ace9' : '#606060',
					fontWeight: 600,
					padding: '8px 12px',
					cursor: 'pointer',
					transition: 'color 0.15s ease'
				}}
			>
				<span>{t('Categories')}</span>
				<i
					className={`fa-solid fa-chevron-down nav-chevron ms-1 ${isOpen ? 'rotate-180' : ''}`}
					style={{
						fontSize: '11px',
						transition: 'transform 0.2s ease, color 0.2s ease',
						color: isOpen ? '#43ace9' : '#606060',
						transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
					}}
				/>
			</button>

			{/* Dropdown Menu (Full width, matching Renovation Frontend) */}
			<div
				className={`category-dropdown-menu ${isOpen ? 'desktop-show' : ''}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className="dropdown-inner-card">
					{/* Header Row */}
					<div className="dropdown-header-row d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom flex-wrap gap-2">
						<div className="d-flex align-items-center gap-2">
							<span className="category-header-badge">
								<i className="fa-solid fa-layer-group" style={{ fontSize: '13px', color: '#0284C7' }} />
								<span>{t('Categories')}</span>
							</span>
							<span
								className="text-muted small fw-medium d-none d-md-inline ms-3 ps-1"
								style={{ fontSize: '13.5px', color: '#64748B' }}
							>
								{sortedCategories.length} {t('Categories')}
							</span>
						</div>

						<Link
							href="/categories"
							className="view-all-mega-btn text-white"
							style={{
								backgroundColor: '#43ace9',
								color: '#ffffff',
								textDecoration: 'none',
							}}
							onClick={() => setIsOpen(false)}
						>
							<span style={{ color: '#ffffff', fontWeight: 600, fontSize: '13px' }}>
								{t('Browse All Categories')}
							</span>
							<i className="fa-solid fa-arrow-right" style={{ color: '#ffffff', fontSize: '12px' }} />
						</Link>
					</div>

					{/* 3-Column Grid (Exact Renovation Frontend: repeat(3, 1fr) with chevron bullet only) */}
					<div className="subcategories-grid">
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
									className="subcategory-item-link text-start"
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => setIsOpen(false)}
								>
									<i className="fa-solid fa-chevron-right subcategory-bullet" />
									<span className="subcategory-name text-start" style={{ textAlign: 'left' }}>{cat.name}</span>
								</a>
							) : (
								<Link
									key={cat.id ?? cat.slug}
									href={browse.href}
									className="subcategory-item-link text-start"
									onClick={() => setIsOpen(false)}
								>
									<i className="fa-solid fa-chevron-right subcategory-bullet" />
									<span className="subcategory-name text-start" style={{ textAlign: 'left' }}>{cat.name}</span>
								</Link>
							);
						})}
					</div>
				</div>
			</div>

			<style>{`
				@media (min-width: 992px) {
					#mainNavbar {
						position: relative !important;
					}

					#mainNavbar > .container-fluid,
					#mainNavbar .header-navbar-row {
						position: relative !important;
					}

					#mainNavbar .navbar-collapse,
					#mainNavbar .xpert-mobile-menu,
					#mainNavbar .navbar-nav,
					#mainNavbar .nav-item,
					#mainNavbar .nav-item.dropdown,
					#mainNavbar .category-nav-item,
					#mainNavbar .d-none.d-lg-block {
						position: static !important;
					}

					#mainNavbar .category-dropdown-menu {
						position: absolute !important;
						top: 100% !important;
						left: 0 !important;
						right: 0 !important;
						width: 100% !important;
						max-width: 100% !important;
						z-index: 1200 !important;
						opacity: 0;
						visibility: hidden;
						transform: translateY(6px);
						transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
						pointer-events: none;
						padding: 6px 0 0 0 !important;
						margin: 0 !important;
						background: transparent !important;
						border: none !important;
					}

					#mainNavbar .category-dropdown-menu::before {
						content: "";
						position: absolute;
						top: -10px;
						left: 0;
						right: 0;
						height: 16px;
						display: block;
						background: transparent;
					}

					#mainNavbar .category-nav-item:hover .category-dropdown-menu,
					#mainNavbar .category-dropdown-menu.desktop-show {
						opacity: 1 !important;
						visibility: visible !important;
						transform: translateY(0) !important;
						pointer-events: auto !important;
					}

					#mainNavbar .category-nav-item:hover #categoriesDropdown,
					#mainNavbar .category-nav-item:hover #categoriesDropdown span,
					#mainNavbar #categoriesDropdown:hover,
					#mainNavbar #categoriesDropdown:hover span,
					#mainNavbar #categoriesDropdown.is-open,
					#mainNavbar #categoriesDropdown.is-open span {
						color: #43ace9 !important;
					}

					#mainNavbar .category-nav-item:hover .nav-chevron,
					#mainNavbar #categoriesDropdown:hover .nav-chevron,
					#mainNavbar #categoriesDropdown.is-open .nav-chevron {
						transform: rotate(180deg) !important;
						color: #43ace9 !important;
					}

					.dropdown-inner-card {
						background: #ffffff !important;
						border: 1px solid #e5e7eb !important;
						border-radius: 16px !important;
						padding: 22px 28px !important;
						box-shadow: 0 20px 45px -8px rgba(0, 0, 0, 0.16), 0 10px 20px -6px rgba(0, 0, 0, 0.06) !important;
						width: 100% !important;
					}

					.category-header-badge {
						font-size: 13px;
						background-color: #F0F7FD;
						color: #0284C7;
						border: 1px solid #BAE6FD;
						font-weight: 600;
						padding: 6px 14px;
						border-radius: 20px;
						display: inline-flex;
						align-items: center;
						gap: 8px;
					}

					.view-all-mega-btn,
					.view-all-mega-btn:link,
					.view-all-mega-btn:visited,
					.view-all-mega-btn:hover,
					.view-all-mega-btn:active,
					.view-all-mega-btn:focus,
					.view-all-mega-btn span,
					.view-all-mega-btn i,
					#mainNavbar .view-all-mega-btn,
					#mainNavbar .view-all-mega-btn span,
					#mainNavbar .view-all-mega-btn i {
						color: #ffffff !important;
					}

					.view-all-mega-btn {
						display: inline-flex !important;
						align-items: center !important;
						gap: 8px !important;
						background-color: #43ace9 !important;
						color: #ffffff !important;
						padding: 7px 16px !important;
						border-radius: 8px !important;
						font-size: 13px !important;
						font-weight: 600 !important;
						text-decoration: none !important;
						transition: background-color 0.2s ease, transform 0.2s ease;
						white-space: nowrap !important;
					}

					.view-all-mega-btn:hover {
						background-color: #2b98d9 !important;
						color: #ffffff !important;
						transform: translateY(-1px);
					}

					.subcategories-grid {
						display: grid !important;
						grid-template-columns: repeat(3, 1fr) !important;
						gap: 8px 16px !important;
						max-height: 420px;
						overflow-y: auto;
						padding-right: 6px;
						width: 100% !important;
					}

					.subcategory-item-link {
						display: flex !important;
						align-items: center !important;
						justify-content: flex-start !important;
						text-align: left !important;
						gap: 10px !important;
						padding: 8px 12px !important;
						border-radius: 8px !important;
						font-size: 13.5px !important;
						font-weight: 500 !important;
						color: #374151 !important;
						background-color: #f9fafb !important;
						text-decoration: none !important;
						transition: all 0.15s ease-in-out !important;
						border: 1px solid #f3f4f6 !important;
					}

					.subcategory-item-link:hover {
						background-color: #f0f7fd !important;
						border-color: #bae6fd !important;
						color: #0284c7 !important;
						transform: translateX(2px) !important;
					}

					.subcategory-bullet {
						font-size: 10px;
						color: #9ca3af;
						transition: transform 0.18s ease, color 0.18s ease;
						flex-shrink: 0;
					}

					.subcategory-item-link:hover .subcategory-bullet {
						color: #43ace9;
						transform: translateX(2px);
					}

					.subcategory-name {
						line-height: 1.35;
						text-align: left !important;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						flex: 1;
					}

					.subcategories-grid::-webkit-scrollbar {
						width: 5px;
					}
					.subcategories-grid::-webkit-scrollbar-track {
						background: #f1f5f9;
						border-radius: 4px;
					}
					.subcategories-grid::-webkit-scrollbar-thumb {
						background: #cbd5e1;
						border-radius: 4px;
					}
					.subcategories-grid::-webkit-scrollbar-thumb:hover {
						background: #94a3b8;
					}
				}
			`}</style>
		</div>
	);
}
