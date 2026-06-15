import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import useTranslate from '@/hooks/useTranslate';

const DEFAULT_BRAND_IMAGE = '/assets/images/auction/1761811512_cf073a6b72be_placeholder-full.jpg';

export default function Index({ brands = [] }) {
  const { t } = useTranslate();

  const assetSrc = (path) => {
    if (!path) return DEFAULT_BRAND_IMAGE;
    if (String(path).startsWith('http')) return path;
    if (String(path).startsWith('/brand-assets/')) return path;
    if (String(path).startsWith('/storage/')) {
      return `/brand-assets/${String(path).replace(/^\/storage\//, '')}`;
    }
    return `/${String(path).replace(/^\/+/, '')}`;
  };

  return (
    <AppLayout title={t('Brands')}>
      <Head title={t('Brands')} />
      <section className="brands-page py-4 py-md-5" style={{ backgroundColor: '#F7F8F9' }}>
        <div className="container">
          <div className="home-section-header mb-4">
            <div className="featured-heading mb-0">
              <h2>{t('All Brands')}</h2>
            </div>
          </div>

          <div className="brands-grid">
            {brands.map((brand, i) => (
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
      </section>

      <style>{`
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .brand-card-link {
          display: block;
        }

        .brand-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #eceff2;
          padding: 12px 12px 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
        }

        .brand-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .brand-image {
          width: 100%;
          max-width: 128px;
          margin: 0 auto 10px;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          background: #f2f4f5;
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
        }

        @media (min-width: 768px) {
          .brands-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
          }

          .brand-image {
            max-width: 120px;
          }

          .brand-name {
            font-size: 14px;
          }
        }

        @media (min-width: 1200px) {
          .brands-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </AppLayout>
  );
}
