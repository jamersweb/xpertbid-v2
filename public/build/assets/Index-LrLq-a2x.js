import{j as e,H as o,L as l}from"./app-lu7_VoJP.js";import{A as m}from"./AppLayout-B0xpL7z0.js";import{u as c}from"./useSessionKeepAlive-Bkv9Dn-d.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";const i="/assets/images/auction/1761811512_cf073a6b72be_placeholder-full.jpg";function j({brands:t=[]}){const{t:a}=c(),n=r=>r?String(r).startsWith("http")||String(r).startsWith("/brand-assets/")?r:String(r).startsWith("/storage/")?`/brand-assets/${String(r).replace(/^\/storage\//,"")}`:`/${String(r).replace(/^\/+/,"")}`:i;return e.jsxs(m,{title:a("Brands"),children:[e.jsx(o,{title:a("Brands")}),e.jsx("section",{className:"brands-page py-4 py-md-5",style:{backgroundColor:"#F7F8F9"},children:e.jsxs("div",{className:"container",children:[e.jsx("div",{className:"home-section-header mb-4",children:e.jsx("div",{className:"featured-heading mb-0",children:e.jsx("h2",{children:a("All Brands")})})}),e.jsx("div",{className:"brands-grid",children:t.map((r,d)=>e.jsx(l,{href:route("properties.brand",{brand:r.slug}),className:"text-decoration-none brand-card-link",children:e.jsxs("div",{className:"brand-card",children:[e.jsx("div",{className:"brand-image",children:e.jsx("img",{src:n(r.image),alt:r.name||a("Brand"),onError:s=>{s.currentTarget.src!==i&&(s.currentTarget.src=i)}})}),e.jsx("h3",{className:"brand-name",children:r.name})]})},r.id||d))})]})}),e.jsx("style",{children:`
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
      `})]})}export{j as default};
