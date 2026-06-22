import{j as r,H as v}from"./app-lu7_VoJP.js";import{A as k}from"./AppLayout-B0xpL7z0.js";import{A}from"./AuctionCard-CmchA6tH.js";import{S,a as D}from"./swiper-l5bT_C8n.js";import{N as B}from"./navigation-CWcQ-MLR.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";import"./CountdownTimer-BfR-Y7Nz.js";import"./FavoriteToggleButton-BWzLqp6w.js";import"./listingPricing-CBcHwZ3i.js";const x={1:{banner:{desktop:"https://images.unsplash.com/photo-1764254810930-4cdf96de0ef0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1920&h=620",mobile:"https://images.unsplash.com/photo-1764254810930-4cdf96de0ef0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=900&h=420"}},2:{banner:{desktop:"https://images.unsplash.com/photo-1776066361467-f70a25cf0dc8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1920&h=620",mobile:"https://images.unsplash.com/photo-1776066361467-f70a25cf0dc8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=900&h=420"}}},c=t=>t?String(t).startsWith("http")?t:String(t).startsWith("/storage/")?`/brand-assets/${String(t).replace(/^\/storage\//,"")}`:`/${String(t).replace(/^\/+/,"")}`:null,M=t=>({title:t?.title||"",listing_ids:Array.isArray(t?.listing_ids)?t.listing_ids.map(n=>Number(n)).filter(n=>Number.isInteger(n)&&n>0):[],type:t?.type==="bedrooms"?"bedrooms":"square_feet",min_value:t?.min_value??"",max_value:t?.max_value??""});function C({brand:t,listings:n}){const p=Array.isArray(n)?n:n?.data||[],u=t?.name||"Brand",h=Array.isArray(t?.page_sections)?t.page_sections.map(M):[],g=new Map(p.map(e=>[Number(e.id),e])),f=x[Number(t?.id)]||x[1],w=c(t?.banner_img)||f.banner.desktop,N=c(t?.banner_img_mob)||c(t?.banner_img)||f.banner.mobile,y=e=>{const i=e?.category_features&&typeof e.category_features=="object"?e.category_features:{},s=["field_1","1","bedrooms","bedroom","beds","bed"];for(const a of s){const m=i[a],d=Number.parseInt(m,10);if(!Number.isNaN(d)&&d>0)return d}const o=String(e?.title||"").toLowerCase().match(/(\d+)\s*\+?\s*(bed|beds|bedroom|bedrooms|bhk)/i);if(o){const a=Number.parseInt(o[1],10);if(!Number.isNaN(a)&&a>0)return a}return null},_=e=>{const i=e?.category_features&&typeof e.category_features=="object"?e.category_features:{},s=["field_6","6","area","sqft","sq_ft","square_feet","squarefeet"];for(const a of s){const m=i[a],d=Number.parseFloat(String(m).replace(/,/g,""));if(!Number.isNaN(d)&&d>0)return d}const o=String(e?.title||"").toLowerCase().match(/(\d[\d,]*)\s*(sq\s*ft|sqft|square\s*feet|squarefeet)/i);if(o){const a=Number.parseFloat(o[1].replace(/,/g,""));if(!Number.isNaN(a)&&a>0)return a}return null},j=e=>{if(Array.isArray(e.listing_ids)&&e.listing_ids.length>0)return e.listing_ids.map(l=>g.get(Number(l))).filter(Boolean);const i=e.min_value!==""&&e.min_value!==null?Number(e.min_value):null,s=e.max_value!==""&&e.max_value!==null?Number(e.max_value):null;return p.filter(l=>{if(e.type==="square_feet"){const a=_(l);return a===null||i===null?!1:s===null?a>=i:a>=i&&a<=s}const o=y(l);return o===null||i===null?!1:s===null?o>=i:o>=i&&o<=s})},b=h.map(e=>({...e,title:e.title?.trim()||`${u} Section`,items:j(e)})).filter(e=>e.items.length>0);return r.jsxs(k,{children:[r.jsx(v,{title:`${t?.name||"Brand"} Properties`}),r.jsxs("div",{className:"container py-4 py-lg-5 text-dark",children:[r.jsx("div",{className:"mb-4 overflow-hidden brand-top-banner",children:r.jsxs("picture",{children:[r.jsx("source",{media:"(max-width: 767px)",srcSet:N}),r.jsx("img",{src:w,alt:`${u} banner`,className:"w-100 h-100 object-fit-cover",style:{borderRadius:"28px"}})]})}),p.length===0?r.jsxs("div",{className:"text-center py-5 bg-white rounded-4 border",children:[r.jsx("h3",{className:"h5 fw-bold",children:"No listings found"}),r.jsx("p",{className:"text-muted mb-0",children:"No active listings are currently available for this brand."})]}):b.length===0?r.jsxs("div",{className:"text-center py-5 bg-white rounded-4 border",children:[r.jsx("h3",{className:"h5 fw-bold",children:"No sections configured"}),r.jsx("p",{className:"text-muted mb-0",children:"Use the admin brand page builder to add product sections."})]}):b.map((e,i)=>r.jsxs("section",{className:"mb-6",children:[r.jsx("div",{className:"d-flex align-items-center justify-content-between mb-3",children:r.jsx("h3",{className:"fw-bold mb-0 text-dark properties-section-title",children:e.title})}),r.jsx("div",{className:"marketplace-curated-slider",children:r.jsx(S,{modules:[B],navigation:!0,spaceBetween:18,breakpoints:{320:{slidesPerView:1.05},576:{slidesPerView:1.4},768:{slidesPerView:2.1},992:{slidesPerView:2.6},1200:{slidesPerView:3.1}},children:e.items.map(s=>r.jsx(D,{children:r.jsx(A,{auction:s,showPropertyMeta:!0})},`${e.title}-${s.id}`))})})]},`${e.title}-${i}`))]}),r.jsx("style",{children:`
        .properties-section-title {
          font-size: clamp(1.45rem, 2.6vw, 2rem);
          line-height: 1.2;
        }

        .brand-top-banner {
          height: 420px;
          border-radius: 32px;
          overflow: hidden;
        }

        .brand-top-banner picture,
        .brand-top-banner img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .marketplace-curated-slider {
          position: relative;
          padding-bottom: 2px;
        }

        .marketplace-curated-slider .swiper {
          overflow: hidden;
          padding: 4px 2px 78px;
        }

        .marketplace-curated-slider .swiper-slide {
          height: auto;
        }

        .marketplace-curated-slider .swiper-button-prev,
        .marketplace-curated-slider .swiper-button-next {
          top: auto !important;
          bottom: 14px !important;
          left: auto !important;
          right: auto !important;
          transform: none !important;
          width: 44px;
          height: 40px;
          border-radius: 0;
          background: #ffffff;
          color: #111827;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
          z-index: 5;
        }

        .marketplace-curated-slider .swiper-button-prev {
          left: calc(50% - 43px) !important;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          margin-right: 0 !important;
        }

        .marketplace-curated-slider .swiper-button-next {
          left: calc(50% + 3px) !important;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          border-left: none;
        }

        .marketplace-curated-slider .swiper-button-prev::after,
        .marketplace-curated-slider .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }

        .marketplace-curated-slider .swiper-button-disabled {
          opacity: 1 !important;
          color: #cbd5e1 !important;
          background: #ffffff !important;
        }

        @media (max-width: 767px) {
          .brand-top-banner {
            height: 210px;
            border-radius: 24px;
          }

          .marketplace-curated-slider .swiper {
            padding-bottom: 8px;
          }

          .marketplace-curated-slider .swiper-button-prev,
          .marketplace-curated-slider .swiper-button-next {
            display: none !important;
          }
        }

        @media (max-width: 991px) and (min-width: 768px) {
          .brand-top-banner {
            height: 360px;
          }
        }
      `})]})}export{C as default};
