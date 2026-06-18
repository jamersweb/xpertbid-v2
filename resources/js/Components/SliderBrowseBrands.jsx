import { Link } from '@inertiajs/react';
import useTranslate from '@/hooks/useTranslate';

const DEFAULT_BRAND_IMAGE = '/assets/images/auction/1761811512_cf073a6b72be_placeholder-full.jpg';

export default function SliderBrowseBrands({ brands = [] }) {
  const { t } = useTranslate();
  const displayBrands = (Array.isArray(brands) ? brands : []).slice(0, 3);

  const assetSrc = (path) => {
    if (!path) return DEFAULT_BRAND_IMAGE;
    if (String(path).startsWith('http')) return path;
    if (String(path).startsWith('/brand-assets/')) return path;
    if (String(path).startsWith('/storage/')) {
      return `/brand-assets/${String(path).replace(/^\/storage\//, '')}`;
    }
    return `/${String(path).replace(/^\/+/, '')}`;
  };

  if (!displayBrands.length) return null;

  return (
    <section className="browsebrands" style={{ backgroundColor: '#F7F8F9' }}>
      <div className="container-fluid">
        <div className="home-section-header mb-3">
          <div className="featured-heading mb-0">
            <h2>{t('Brands')}</h2>
          </div>
          <Link href={route('brands.page')} className="section-view-all-btn">
            {t('View All')}
          </Link>
        </div>

        <div className="brand-grid">
          {displayBrands.map((brand, i) => (
            <Link
              key={brand.id || i}
              href={route('properties.brand', { brand: brand.slug })}
              className="text-decoration-none brand-card-link"
            >
              <div className="brand-card">
                <div className="brand-image">
                  <img
                    src={assetSrc(brand.image)}
                    alt={brand.name || t('Brand')}
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_BRAND_IMAGE) {
                        e.currentTarget.src = DEFAULT_BRAND_IMAGE;
                      }
                    }}
                  />
                </div>
                <h3 className="brand-name">{brand.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .brand-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 22px;
        }

        .browsebrands {
          padding: 38px 70px;
        }

        .brand-card-link {
          display: block;
        }

        .brand-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #eceff2;
          padding: 12px 12px 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
          max-width: 100%;
          display: flex;
          flex-direction: column;
        }

        .brand-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .brand-image {
          width: 100%;
          max-width: 100%;
          margin: 0 0 10px;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          overflow: hidden;
          background: #f2f4f5;
          flex: 0 0 auto;
        }

        .brand-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .brand-name {
          margin: 0;
          color: #002f34;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
          text-transform: capitalize;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: auto;
        }

        @media (min-width: 576px) {
          .brand-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (min-width: 992px) {
          .brand-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px;
          }

          .brand-image {
            max-width: 100%;
          }

          .brand-name {
            font-size: 14px;
          }
        }

        @media (max-width: 767px) {
          .browsebrands {
            padding: 34px 15px;
          }
        }
      `}</style>
    </section>
  );
}
