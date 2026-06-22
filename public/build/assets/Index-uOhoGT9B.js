import{j as e,L as s}from"./app-lu7_VoJP.js";import{A as l}from"./AppLayout-B0xpL7z0.js";import{u as o}from"./useSessionKeepAlive-Bkv9Dn-d.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";const d=i=>`${i?.image?.startsWith("/")?"":"/"}${i?.image??"images/placeholder.png"}`;function f({categories:i=[]}){const{t:r}=o();return e.jsxs(l,{title:r("Categories"),children:[e.jsx("section",{className:"categories-page py-4 py-md-5",style:{backgroundColor:"#F7F8F9"},children:e.jsxs("div",{className:"container",children:[e.jsx("div",{className:"home-section-header mb-4",children:e.jsx("div",{className:"featured-heading mb-0",children:e.jsx("h2",{children:r("All Categories")})})}),e.jsx("div",{className:"all-categories-grid",children:i.map((a,t)=>e.jsxs(s,{href:route("marketplace.type",{slug:a.slug,typeSlug:"auctions"}),className:"text-decoration-none all-category-card",children:[e.jsx("div",{className:"all-category-image",children:e.jsx("img",{src:d(a),alt:a.name})}),e.jsx("h3",{className:"all-category-title",children:a.name})]},a.id||t))})]})}),e.jsx("style",{children:`
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
      `})]})}export{f as default};
