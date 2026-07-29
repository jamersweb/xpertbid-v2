import React from 'react';

/**
 * Full-width mall section hero banner (local asset / CSS background — no remote deps).
 */
export default function MallHeroBanner({
       image = '/assets/images/WebsiteBanner2.png',
       eyebrow,
       title,
       subtitle,
}) {
       const bg = image || '/assets/images/WebsiteBanner2.png';

       return (
              <div
                     className="mall-hero-banner"
                     style={{ backgroundImage: `url('${bg}')` }}
              >
                     <div className="mall-hero-banner__overlay" />
                     <div className="mall-hero-banner__content">
                            {eyebrow ? <p className="mall-hero-banner__eyebrow">{eyebrow}</p> : null}
                            <h1 className="mall-hero-banner__title">{title}</h1>
                            {subtitle ? <p className="mall-hero-banner__subtitle">{subtitle}</p> : null}
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .mall-hero-banner {
                                   position: relative;
                                   width: 100%;
                                   min-height: 280px;
                                   height: clamp(240px, 32vw, 380px);
                                   overflow: hidden;
                                   background-color: #1a1a1a;
                                   background-size: cover;
                                   background-position: center;
                                   background-repeat: no-repeat;
                            }
                            .mall-hero-banner__overlay {
                                   position: absolute;
                                   inset: 0;
                                   background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 100%);
                            }
                            .mall-hero-banner__content {
                                   position: relative;
                                   z-index: 1;
                                   height: 100%;
                                   min-height: inherit;
                                   display: flex;
                                   flex-direction: column;
                                   align-items: center;
                                   justify-content: center;
                                   text-align: center;
                                   padding: 32px 20px;
                                   color: #fff;
                            }
                            .mall-hero-banner__eyebrow {
                                   margin: 0 0 8px;
                                   font-size: 13px;
                                   font-weight: 600;
                                   letter-spacing: 0.12em;
                                   text-transform: uppercase;
                                   color: rgba(255,255,255,0.75);
                            }
                            .mall-hero-banner__title {
                                   margin: 0;
                                   font-size: clamp(2rem, 4vw, 3.25rem);
                                   font-weight: 700;
                                   letter-spacing: -0.02em;
                                   color: #fff;
                                   line-height: 1.15;
                            }
                            .mall-hero-banner__subtitle {
                                   margin: 12px 0 0;
                                   font-size: 15px;
                                   font-weight: 500;
                                   color: rgba(255,255,255,0.8);
                                   max-width: 36rem;
                            }
                            @media (max-width: 576px) {
                                   .mall-hero-banner {
                                          min-height: 220px;
                                   }
                            }
                     `}} />
              </div>
       );
}
