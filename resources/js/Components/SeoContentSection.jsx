import React from "react";
import useTranslate from "@/hooks/useTranslate";

const SeoContentSection = () => {
       const { t } = useTranslate();

       const fairList = [
              t("seo.fair_list.item_1"),
              t("seo.fair_list.item_2"),
              t("seo.fair_list.item_3"),
              t("seo.fair_list.item_4"),
              t("seo.fair_list.item_5"),
       ];

       const features = [
              t("seo.features.item_1"),
              t("seo.features.item_2"),
              t("seo.features.item_3"),
              t("seo.features.item_4"),
              t("seo.features.item_5"),
              t("seo.features.item_6"),
       ];

       return (
              <section className="seo-content-section">
                     <div className="seo-content-shell container">
                            <div className="seo-hero-card">
                                   <div className="seo-badge">Trusted Digital Marketplace</div>
                                   <h1 className="seo-main-heading">{t("seo.heading")}</h1>
                                   <p className="seo-lead">{t("seo.intro_one")}</p>
                                   <p className="seo-support-copy">{t("seo.intro_two")}</p>

                                   <div className="seo-highlight-grid">
                                          <div className="seo-highlight-tile">
                                                 <span className="seo-highlight-kicker">Buy smarter</span>
                                                 <h2 className="seo-sub-heading">{t("seo.smarter_title")}</h2>
                                                 <p>{t("seo.smarter_one")}</p>
                                                 <p>{t("seo.smarter_two")}</p>
                                          </div>

                                          <div className="seo-highlight-tile seo-highlight-tile--accent">
                                                 <span className="seo-highlight-kicker">Bid with confidence</span>
                                                 <h2 className="seo-sub-heading">{t("seo.fair_title")}</h2>
                                                 <p>{t("seo.fair_intro")}</p>
                                                 <ul className="seo-check-list">
                                                        {fairList.map((item) => (
                                                               <li key={item}>
                                                                      <span className="seo-check-icon">
                                                                             <i className="fas fa-check" aria-hidden="true"></i>
                                                                      </span>
                                                                      <span>{item}</span>
                                                               </li>
                                                        ))}
                                                 </ul>
                                                 <p className="seo-outro-copy">{t("seo.fair_outro")}</p>
                                          </div>
                                   </div>
                            </div>

                            <div className="seo-seller-panel">
                                   <div className="seo-seller-copy">
                                          <span className="seo-panel-kicker">For sellers</span>
                                          <h2 className="seo-sub-heading">{t("seo.sell_title")}</h2>
                                          <p>{t("seo.sell_one")}</p>
                                          <p>{t("seo.sell_two")}</p>
                                   </div>

                                   <div className="seo-standout-card">
                                          <span className="seo-panel-kicker">Why people choose us</span>
                                          <h3 className="seo-card-heading">{t("seo.stand_out_title")}</h3>
                                          <div className="seo-feature-grid">
                                                 {features.map((feature) => (
                                                        <div className="seo-feature-chip" key={feature}>
                                                               <span className="seo-feature-icon">
                                                                      <i className="fas fa-bolt" aria-hidden="true"></i>
                                                               </span>
                                                               <span>{feature}</span>
                                                        </div>
                                                 ))}
                                          </div>
                                          <p className="seo-closing-copy">{t("seo.closing")}</p>
                                   </div>
                            </div>
                     </div>

                     <style>{`
        .seo-content-section {
          position: relative;
          overflow: hidden;
          padding: 72px 0 90px;
          background:
            radial-gradient(circle at top left, rgba(242, 201, 76, 0.20), transparent 34%),
            radial-gradient(circle at top right, rgba(15, 23, 42, 0.10), transparent 30%),
            linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
          color: #0f172a;
        }
        .seo-content-section::before,
        .seo-content-section::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(10px);
        }
        .seo-content-section::before {
          width: 280px;
          height: 280px;
          top: -90px;
          left: -60px;
          background: rgba(251, 191, 36, 0.15);
        }
        .seo-content-section::after {
          width: 360px;
          height: 360px;
          right: -120px;
          bottom: -160px;
          background: rgba(14, 165, 233, 0.10);
        }
        .seo-content-shell {
          position: relative;
          z-index: 1;
        }
        .seo-hero-card {
          position: relative;
          padding: 44px;
          border-radius: 36px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.82)),
            linear-gradient(135deg, rgba(255, 255, 255, 0.55), rgba(248, 250, 252, 0.35));
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 26px 60px rgba(15, 23, 42, 0.10);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .seo-badge,
        .seo-panel-kicker,
        .seo-highlight-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .seo-badge {
          margin-bottom: 20px;
          background: linear-gradient(135deg, #fff3cd, #fef7e7);
          color: #9a6700;
          border: 1px solid rgba(242, 201, 76, 0.45);
        }
        .seo-main-heading {
          max-width: 960px;
          margin: 0 auto 20px;
          text-align: center;
          font-size: clamp(2.35rem, 4vw, 4.3rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
        }
        .seo-lead,
        .seo-support-copy {
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          color: #475569;
          line-height: 1.85;
        }
        .seo-lead {
          margin-bottom: 14px;
          font-size: 1.17rem;
        }
        .seo-support-copy {
          margin-bottom: 34px;
          font-size: 1.03rem;
        }
        .seo-highlight-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-top: 10px;
        }
        .seo-highlight-tile {
          height: 100%;
          padding: 28px;
          border-radius: 28px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
        }
        .seo-highlight-tile--accent {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        }
        .seo-sub-heading {
          margin: 14px 0 14px;
          font-size: clamp(1.6rem, 2vw, 2.15rem);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #111827;
        }
        .seo-highlight-tile p,
        .seo-seller-copy p,
        .seo-closing-copy {
          margin-bottom: 0;
          color: #475569;
          line-height: 1.8;
          font-size: 1rem;
        }
        .seo-highlight-tile p + p,
        .seo-seller-copy p + p {
          margin-top: 12px;
        }
        .seo-check-list {
          list-style: none;
          padding: 0;
          margin: 18px 0 0;
          display: grid;
          gap: 12px;
        }
        .seo-check-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #1e293b;
          font-weight: 600;
        }
        .seo-check-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          min-width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0f172a, #334155);
          color: #ffffff;
          font-size: 11px;
          margin-top: 1px;
        }
        .seo-outro-copy {
          margin-top: 18px !important;
        }
        .seo-seller-panel {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 24px;
          margin-top: 26px;
        }
        .seo-seller-copy,
        .seo-standout-card {
          padding: 30px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
        }
        .seo-card-heading {
          margin: 14px 0 18px;
          font-size: 1.7rem;
          line-height: 1.2;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
        }
        .seo-feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .seo-feature-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 64px;
          padding: 14px 16px;
          border-radius: 20px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          color: #1e293b;
          font-weight: 600;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
        }
        .seo-feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b, #facc15);
          color: #ffffff;
          font-size: 13px;
          box-shadow: 0 10px 18px rgba(245, 158, 11, 0.24);
        }
        .seo-closing-copy {
          margin-top: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        @media (max-width: 991px) {
          .seo-content-section {
            padding: 56px 0 72px;
          }
          .seo-hero-card {
            padding: 30px 22px;
            border-radius: 26px;
          }
          .seo-highlight-grid,
          .seo-seller-panel,
          .seo-feature-grid {
            grid-template-columns: 1fr;
          }
          .seo-highlight-tile,
          .seo-seller-copy,
          .seo-standout-card {
            padding: 24px 20px;
            border-radius: 24px;
          }
          .seo-main-heading {
            max-width: 100%;
          }
        }
        @media (max-width: 576px) {
          .seo-content-section {
            padding: 46px 0 58px;
          }
          .seo-main-heading {
            font-size: 2rem;
          }
          .seo-lead,
          .seo-support-copy {
            font-size: 0.98rem;
            line-height: 1.75;
          }
          .seo-sub-heading,
          .seo-card-heading {
            font-size: 1.45rem;
          }
          .seo-badge,
          .seo-panel-kicker,
          .seo-highlight-kicker {
            font-size: 11px;
            letter-spacing: 0.06em;
          }
          .seo-feature-chip {
            min-height: 58px;
          }
        }
      `}</style>
              </section>
       );
};

export default SeoContentSection;
