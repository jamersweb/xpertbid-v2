import { jsxs, jsx } from "react/jsx-runtime";
import "react";
function MallHeroBanner({
  image = "/assets/images/WebsiteBanner2.png",
  eyebrow,
  title,
  subtitle
}) {
  const bg = image || "/assets/images/WebsiteBanner2.png";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "mall-hero-banner",
      style: { backgroundImage: `url('${bg}')` },
      children: [
        /* @__PURE__ */ jsx("div", { className: "mall-hero-banner__overlay" }),
        /* @__PURE__ */ jsxs("div", { className: "mall-hero-banner__content", children: [
          eyebrow ? /* @__PURE__ */ jsx("p", { className: "mall-hero-banner__eyebrow", children: eyebrow }) : null,
          /* @__PURE__ */ jsx("h1", { className: "mall-hero-banner__title", children: title }),
          subtitle ? /* @__PURE__ */ jsx("p", { className: "mall-hero-banner__subtitle", children: subtitle }) : null
        ] }),
        /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
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
                     `
        } })
      ]
    }
  );
}
export {
  MallHeroBanner as M
};
