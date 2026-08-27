import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import useTranslate from "@/hooks/useTranslate";
import { getCategoryBrowseUrl } from "@/Utils/categoryBrowseUrl";

const imagePath = (cat) => `${cat?.image?.startsWith("/") ? "" : "/"}${cat?.image ?? "images/placeholder.png"}`;

export default function Index({ categories = [] }) {
       const { t } = useTranslate();
       const { propertyFrontendUrl, propertyRootCategoryId } = usePage().props;

       return (
              <AppLayout title={t("Categories")}>
                     <section className="categories-page py-4 py-md-5" style={{ backgroundColor: "#F7F8F9" }}>
                            <div className="container">
                                   <div className="home-section-header mb-4">
                                          <div className="featured-heading mb-0">
                                                 <h2>{t("All Categories")}</h2>
                                          </div>
                                   </div>

                                   <div className="all-categories-grid">
                                          {categories.map((cat, i) => {
                                                 const browse = getCategoryBrowseUrl(cat, { propertyFrontendUrl, propertyRootCategoryId });
                                                 const className = "text-decoration-none all-category-card";
                                                 const content = (
                                                        <>
                                                               <div className="all-category-image">
                                                                      <img src={imagePath(cat)} alt={cat.name} />
                                                               </div>
                                                               <h3 className="all-category-title">{cat.name}</h3>
                                                        </>
                                                 );

                                                 if (browse.external) {
                                                        return (
                                                               <a
                                                                      key={cat.id || i}
                                                                      href={browse.href}
                                                                      className={className}
                                                                      target="_blank"
                                                                      rel="noopener noreferrer"
                                                               >
                                                                      {content}
                                                               </a>
                                                        );
                                                 }

                                                 return (
                                                        <Link
                                                               key={cat.id || i}
                                                               href={browse.href}
                                                               className={className}
                                                        >
                                                               {content}
                                                        </Link>
                                                 );
                                          })}
                                   </div>
                            </div>
                     </section>

                     <style>{`
        .all-categories-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .all-category-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #eceff2;
          padding: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .all-category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .all-category-image {
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 10px;
          overflow: hidden;
          background: #f2f4f5;
          margin-bottom: 10px;
        }

        .all-category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .all-category-title {
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
          .all-categories-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }

          .all-category-title {
            font-size: 15px;
          }
        }
      `}</style>
              </AppLayout>
       );
}
