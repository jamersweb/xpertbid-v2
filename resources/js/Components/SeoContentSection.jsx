import React from "react";
import useTranslate from "@/hooks/useTranslate";

const SeoContentSection = () => {
       const { t } = useTranslate();

       const fairList = [
              t('seo.fair_list.item_1'),
              t('seo.fair_list.item_2'),
              t('seo.fair_list.item_3'),
              t('seo.fair_list.item_4'),
              t('seo.fair_list.item_5'),
       ];

       const features = [
              t('seo.features.item_1'),
              t('seo.features.item_2'),
              t('seo.features.item_3'),
              t('seo.features.item_4'),
              t('seo.features.item_5'),
              t('seo.features.item_6'),
       ];

       return (
              <section className="seo-content-section pb-5 bg-light">
                     <div className="container">
                            <div className="row justify-content-center">
                                   <div className="col-lg-10">
                                          <div className="content-wrapper">
                                                 <h1 className="main-heading mb-4 text-center">{t('seo.heading')}</h1>
                                                 <p className="lead text-center mb-5">{t('seo.intro_one')}</p>
                                                 <p className="text-center mb-5">{t('seo.intro_two')}</p>

                                                 <div className="row mb-5">
                                                        <div className="col-md-6 mb-4 mb-md-0">
                                                               <h2 className="sub-heading mb-3">{t('seo.smarter_title')}</h2>
                                                               <p>{t('seo.smarter_one')}</p>
                                                               <p>{t('seo.smarter_two')}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                               <h2 className="sub-heading mb-3">{t('seo.fair_title')}</h2>
                                                               <p>{t('seo.fair_intro')}</p>
                                                               <ul className="list-unstyled check-list">
                                                                      {fairList.map((item) => (
                                                                             <li key={item}>
                                                                                    <i className="fas fa-check-circle text-primary me-2"></i>
                                                                                    {item}
                                                                             </li>
                                                                      ))}
                                                               </ul>
                                                               <p className="mt-3">{t('seo.fair_outro')}</p>
                                                        </div>
                                                 </div>

                                                 <div className="row align-items-center mb-5">
                                                        <div className="col-12">
                                                               <h2 className="sub-heading mb-3">{t('seo.sell_title')}</h2>
                                                               <p>{t('seo.sell_one')}</p>
                                                               <p>{t('seo.sell_two')}</p>
                                                        </div>
                                                 </div>

                                                 <div className="why-choose-box p-4 rounded bg-white shadow-sm">
                                                        <h3 className="h3-heading mb-4 text-center">{t('seo.stand_out_title')}</h3>
                                                        <div className="row g-3">
                                                               {features.map((feature) => (
                                                                      <div className="col-md-4 col-sm-6" key={feature}>
                                                                             <div className="feature-item d-flex align-items-center">
                                                                                    <i className="fas fa-check text-success me-2"></i>
                                                                                    <span>{feature}</span>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                        <div className="text-center mt-4">
                                                               <p className="mb-0 fw-bold">{t('seo.closing')}</p>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>
                     <style>{`
        .seo-content-section {
          background-color: #f8f9fa;
          color: #333;
        }
        .main-heading {
          font-weight: 700;
          color: #1a1a1a;
          font-size: 2.5rem;
        }
        .sub-heading {
          font-weight: 600;
          color: #2c2c2c;
          font-size: 1.75rem;
        }
        .h3-heading {
          font-weight: 600;
          color: #2c2c2c;
          font-size: 1.5rem;
        }
        .content-wrapper p {
          line-height: 1.7;
          color: #555;
        }
        .check-list li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        .feature-item {
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .main-heading {
            font-size: 1.8rem;
          }
          .sub-heading {
            font-size: 1.5rem;
          }
          .h3-heading {
            font-size: 1.3rem;
          }
        }
      `}</style>
              </section>
       );
};

export default SeoContentSection;
