import{r as c,u as Y,j as e,H as Q,a as S}from"./app-lu7_VoJP.js";import{A as X}from"./AdminLayout-BobcYoqm.js";import{P as _}from"./PrimaryButton-DpHZDSAn.js";import{S as h}from"./SecondaryButton-CvFObm1z.js";import{I as P}from"./InputLabel-BwcnIljV.js";import{I as E}from"./InputError-HnwLZrUE.js";import{A as Z}from"./AuctionCard-CmchA6tH.js";import{S as ee,a as te}from"./swiper-l5bT_C8n.js";import{N as re}from"./navigation-CWcQ-MLR.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";import"./useCurrencyList-BuOaosnQ.js";import"./CountdownTimer-BfR-Y7Nz.js";import"./Price-YFt8wuGR.js";import"./FavoriteToggleButton-BWzLqp6w.js";import"./productUrl-COmlJyrp.js";import"./listingPricing-CBcHwZ3i.js";const R=[{key:"banner_img",label:"Banner Image (Desktop)"},{key:"banner_img_mob",label:"Banner Image (Mobile)"}],ae=()=>({_clientId:`${Date.now()}-${Math.random().toString(36).slice(2,10)}`,title:"",listing_ids:[]}),se=()=>`${Date.now()}-${Math.random().toString(36).slice(2,10)}`,ie=l=>l?l.startsWith("http")?l:l.startsWith("/storage/")?`/brand-assets/${l.replace(/^\/storage\//,"")}`:`/${l.replace(/^\/+/,"")}`:null,L=l=>({_clientId:l?._clientId||se(),title:l?.title||"",listing_ids:Array.isArray(l?.listing_ids)?l.listing_ids.map(a=>Number(a)).filter(a=>Number.isInteger(a)&&a>0):[]});function M({listing:l,selected:a=!1,onClick:n=null,showPropertyMeta:b=!0}){return e.jsxs("div",{className:`position-relative brand-page-admin-card ${a?"brand-page-admin-card-selected":""}`,style:{cursor:n?"pointer":"default"},onClick:n||void 0,role:n?"button":void 0,tabIndex:n?0:void 0,onKeyDown:d=>{n&&(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),n())},children:[e.jsx(Z,{auction:l,showPropertyMeta:b}),e.jsx("div",{className:"position-absolute",style:{top:12,right:12,zIndex:10,background:a?"#111827":"rgba(17, 24, 39, 0.9)",color:"#fff",borderRadius:"999px",padding:"7px 11px",fontSize:12,fontWeight:700,pointerEvents:"none"},children:a?"Selected":"Add Product"}),n&&e.jsx("button",{type:"button","aria-label":`Select ${l?.title||"product"}`,onClick:d=>{d.preventDefault(),d.stopPropagation(),n()},className:"position-absolute",style:{inset:0,zIndex:9,background:"transparent",border:0,padding:0}})]})}function Ne({brands:l=[],selectedBrand:a=null,brandListings:n=[]}){const b=c.useRef({}),[d,x]=c.useState([]),[o,p]=c.useState(null),[f,A]=c.useState(""),[y,C]=c.useState({}),{data:I,setData:j,processing:U,errors:v,reset:$}=Y({banner_img:null,banner_img_mob:null,sections_json:"[]"});c.useEffect(()=>{const t=Array.isArray(a?.page_sections)?a.page_sections.map(L):[];x(t),p(null),A(""),C({}),j({banner_img:null,banner_img_mob:null,sections_json:JSON.stringify(t)})},[a?.id]),c.useEffect(()=>{j("sections_json",JSON.stringify(d))},[d]);const z=a?.id?String(a.id):"",F=c.useMemo(()=>new Map((Array.isArray(n)?n:[]).map(t=>[Number(t.id),t])),[n]),N=c.useMemo(()=>{const t=f.trim().toLowerCase();return t?(Array.isArray(n)?n:[]).filter(r=>String(r?.title||"").toLowerCase().includes(t)||String(r?.id||"").includes(t)):Array.isArray(n)?n:[]},[n,f]),m=o!==null?d[o]:null,B=t=>{S.get(route("admin.brand-pages.index"),{brand_id:t},{preserveScroll:!0,replace:!0})},O=t=>{t.preventDefault(),a?.id&&S.post(route("admin.brand-pages.update",a.id),{...I,_method:"PUT"},{forceFormData:!0,onSuccess:()=>{$(),S.get(route("admin.brand-pages.index"),{brand_id:a.id},{preserveScroll:!0,replace:!0})}})},V=(t,r,s)=>{x(i=>i.map((u,k)=>k===t?{...u,[r]:s}:u))},H=()=>{x(t=>[...t,ae()])},T=t=>{x(r=>r.filter((s,i)=>i!==t)),p(r=>r===t?null:r)},W=t=>{o!==null&&x(r=>r.map((s,i)=>{if(i!==o)return s;const u=s.listing_ids.includes(t);return{...s,listing_ids:u?s.listing_ids.filter(k=>k!==t):[...s.listing_ids,t]}}))},J=()=>{o!==null&&x(t=>t.map((r,s)=>s!==o?r:{...r,listing_ids:N.map(i=>Number(i.id))}))},q=()=>{o!==null&&x(t=>t.map((r,s)=>s===o?{...r,listing_ids:[]}:r))},D=a?.slug?route("properties.brand",a.slug):null,g=t=>ie(a?.[t]),G=t=>y[t]||g(t),w=t=>{b.current[t]?.click()},K=(t,r)=>{j(t,r||null),C(s=>{const i={...s};return i[t]&&(URL.revokeObjectURL(i[t]),delete i[t]),r&&(i[t]=URL.createObjectURL(r)),i})};return c.useEffect(()=>()=>{Object.values(y).forEach(t=>{URL.revokeObjectURL(t)})},[y]),e.jsxs(X,{title:"Brand Pages",children:[e.jsx(Q,{title:"Brand Pages"}),e.jsxs("div",{className:"max-w-7xl mx-auto space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 lg:p-8",children:[e.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4",children:[e.jsxs("div",{className:"max-w-2xl",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.28em] text-gray-400",children:"Brand Pages"}),e.jsx("h1",{className:"mt-2 text-3xl lg:text-4xl font-black text-gray-900 tracking-tight",children:"Brand Page Builder"}),e.jsx("p",{className:"mt-3 text-sm text-gray-500",children:"Select a brand, upload the banner exactly like the frontend, and place the exact products into each section."})]}),D&&e.jsx("a",{href:D,target:"_blank",rel:"noreferrer",className:"inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800",children:"View Public Page"})]}),e.jsxs("div",{className:"mt-6",children:[e.jsx(P,{value:"Select Brand",className:"mb-2"}),e.jsxs("select",{value:z,onChange:t=>B(t.target.value),className:"w-full lg:w-96 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10",children:[e.jsx("option",{value:"",children:"Choose a brand"}),l.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]})]})]}),a?e.jsxs("form",{onSubmit:O,className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 gap-6",children:[e.jsxs("div",{className:"bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 lg:p-6 space-y-5",children:[e.jsxs("div",{className:"flex items-start justify-between gap-4",children:[e.jsxs("div",{className:"max-w-2xl",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.24em] text-gray-400",children:"Banner"}),e.jsx("h2",{className:"mt-2 text-xl lg:text-2xl font-black text-gray-900",children:"Banner Preview"}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"The banner should feel exactly like the public page, with separate desktop and mobile uploads."})]}),e.jsxs("div",{className:"rounded-2xl bg-gray-50 px-4 py-3 text-right shrink-0",children:[e.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400",children:"Editing"}),e.jsx("p",{className:"text-sm font-black text-gray-900",children:a.name})]})]}),e.jsxs("div",{className:"relative overflow-hidden rounded-[30px] border border-gray-200 bg-gray-50",children:[e.jsx("div",{className:"brand-builder-banner",children:e.jsxs("picture",{children:[e.jsx("source",{media:"(max-width: 767px)",srcSet:g("banner_img_mob")||g("banner_img")||"/assets/images/placeholder.png"}),e.jsx("img",{src:g("banner_img")||g("banner_img_mob")||"/assets/images/placeholder.png",alt:`${a.name} banner preview`,className:"h-full w-full object-cover"})]})}),e.jsxs("div",{className:"absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent",children:[e.jsxs("div",{className:"text-white",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.24em] text-white/70",children:"Banner Controls"}),e.jsx("h3",{className:"mt-1 text-lg lg:text-xl font-black",children:a.name})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[e.jsx("button",{type:"button",onClick:()=>w("banner_img"),className:"inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50",children:"Upload Desktop"}),e.jsx("button",{type:"button",onClick:()=>w("banner_img_mob"),className:"inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-800",children:"Upload Mobile"})]})]})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:R.map(t=>e.jsxs("div",{className:"hidden",children:[e.jsx(P,{value:t.label}),e.jsx("input",{ref:r=>{b.current[t.key]=r},type:"file",accept:"image/*",onChange:r=>K(t.key,r.target.files[0]||null)})]},t.key))}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:R.map(t=>{const r=G(t.key),s=I[t.key];return e.jsxs("div",{className:"rounded-2xl border border-gray-200 bg-white p-4 space-y-3",children:[e.jsxs("div",{className:"flex items-start justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-bold text-gray-900",children:t.label}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:t.key==="banner_img"?"Desktop hero image":"Mobile hero image"})]}),e.jsx("button",{type:"button",onClick:()=>w(t.key),className:"rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50",children:"Change"})]}),r?e.jsx("img",{src:r,alt:t.label,className:"h-28 w-full rounded-2xl object-cover border border-gray-200 bg-gray-50"}):e.jsx("div",{className:"h-28 w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400",children:"No image selected"}),s instanceof File&&e.jsxs("p",{className:"text-xs text-gray-500",children:["Selected: ",s.name]}),v[t.key]&&e.jsx(E,{message:v[t.key]})]},t.key)})})]}),e.jsxs("div",{className:"bg-white rounded-[32px] shadow-sm border border-gray-100 p-6",children:[e.jsxs("div",{className:"flex items-start justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.24em] text-gray-400",children:"Sections"}),e.jsx("h2",{className:"mt-2 text-xl lg:text-2xl font-black text-gray-900",children:"Product Sections"}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Add a section title and then attach the products that should appear on the frontend."})]}),e.jsxs(_,{type:"button",onClick:H,children:[e.jsx("i",{className:"fa-solid fa-plus mr-2"}),"Add Section"]})]}),e.jsx(E,{message:v.sections_json,className:"mt-4"}),e.jsx("div",{className:"mt-5 space-y-4",children:d.length===0?e.jsx("div",{className:"rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400",children:"No sections yet. Click Add Section to create the first block."}):d.map((t,r)=>{const s=(t.listing_ids||[]).map(i=>F.get(Number(i))).filter(Boolean);return e.jsxs("div",{className:"rounded-[28px] border border-gray-200 p-4 lg:p-5 space-y-4 bg-gray-50/30",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs font-bold uppercase tracking-[0.18em] text-gray-400",children:["Section ",r+1]}),e.jsx("p",{className:"mt-1 text-[clamp(1.25rem,2vw,1.6rem)] font-black text-gray-900 leading-tight",children:t.title?.trim()||"Untitled section"})]}),e.jsx("button",{type:"button",onClick:()=>T(r),className:"rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50",children:"Remove"})]}),e.jsxs("div",{children:[e.jsx(P,{value:"Section Title",className:"mb-2"}),e.jsx("input",{type:"text",value:t.title,onChange:i=>V(r,"title",i.target.value),placeholder:"e.g. Featured Homes",className:"w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center gap-3",children:[e.jsxs(_,{type:"button",onClick:()=>p(r),children:[e.jsx("i",{className:"fa-solid fa-layer-group mr-2"}),"Add Products"]}),e.jsxs("p",{className:"text-sm text-gray-500",children:[t.listing_ids?.length||0," selected"]})]}),s.length>0&&e.jsx("div",{className:"brand-page-admin-slider",children:e.jsx(ee,{modules:[re],navigation:!0,spaceBetween:18,breakpoints:{320:{slidesPerView:1.05},576:{slidesPerView:1.4},768:{slidesPerView:2.1},992:{slidesPerView:2.6},1200:{slidesPerView:3.1}},children:s.map(i=>e.jsx(te,{children:e.jsx(M,{listing:i,selected:!0,showPropertyMeta:!0})},i.id))})})]},t._clientId||r)})})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-3",children:[e.jsx(h,{type:"button",onClick:()=>x(Array.isArray(a?.page_sections)?a.page_sections.map(L):[]),children:"Reset Sections"}),e.jsx(_,{disabled:U,children:U?"Saving...":"Save Brand Page"})]})]}):e.jsx("div",{className:"bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center text-gray-500",children:"Select a brand to start building its page."})]}),o!==null&&m&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6",children:e.jsxs("div",{className:"w-full max-w-5xl rounded-[28px] bg-white shadow-2xl overflow-hidden flex max-h-[90vh] flex-col",children:[e.jsxs("div",{className:"flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.22em] text-gray-400",children:"Select Products"}),e.jsx("h3",{className:"text-xl font-black text-gray-900",children:m.title?.trim()||`Section ${o+1}`}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Pick the listings that should appear in this brand section."})]}),e.jsx("button",{type:"button",onClick:()=>p(null),className:"rounded-2xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50",children:"Close"})]}),e.jsxs("div",{className:"px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3",children:[e.jsxs("div",{className:"relative w-full md:max-w-md",children:[e.jsx("i",{className:"fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"}),e.jsx("input",{type:"text",value:f,onChange:t=>A(t.target.value),placeholder:"Search brand products",className:"w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(h,{type:"button",onClick:J,children:"Select All"}),e.jsx(h,{type:"button",onClick:q,children:"Clear"})]})]}),e.jsx("div",{className:"flex-1 overflow-y-auto px-5 py-4",children:N.length===0?e.jsx("div",{className:"py-16 text-center text-gray-500",children:"No products found for this brand."}):e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",children:N.map(t=>{const r=m.listing_ids.includes(Number(t.id));return e.jsx(M,{listing:t,selected:r,onClick:()=>W(Number(t.id))},t.id)})})}),e.jsxs("div",{className:"flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 bg-white",children:[e.jsxs("p",{className:"text-sm text-gray-500",children:[m.listing_ids.length," product",m.listing_ids.length===1?"":"s"," selected"]}),e.jsx("div",{className:"flex items-center gap-3",children:e.jsx(h,{type:"button",onClick:()=>p(null),className:"px-5 py-3",children:"Done"})})]})]})}),e.jsx("style",{children:`
        .brand-page-admin-slider {
          position: relative;
          padding-bottom: 2px;
        }

        .brand-page-admin-slider .swiper {
          overflow: hidden;
          padding: 4px 2px 78px;
        }

        .brand-page-admin-slider .swiper-slide {
          height: auto;
        }

        .brand-page-admin-slider .swiper-button-prev,
        .brand-page-admin-slider .swiper-button-next {
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

        .brand-page-admin-slider .swiper-button-prev {
          left: calc(50% - 43px) !important;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          margin-right: 0 !important;
        }

        .brand-page-admin-slider .swiper-button-next {
          left: calc(50% + 3px) !important;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          border-left: none;
        }

        .brand-page-admin-slider .swiper-button-prev::after,
        .brand-page-admin-slider .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }

        .brand-page-admin-slider .swiper-button-disabled {
          opacity: 1 !important;
          color: #cbd5e1 !important;
          background: #ffffff !important;
        }

        .brand-page-admin-card-selected {
          transform: translateY(-1px);
        }

        .brand-page-admin-card .product-box {
          display: block !important;
          height: auto !important;
          flex-direction: initial !important;
        }

        .brand-page-admin-card .product-card-wrapper {
          height: auto;
        }

        .brand-page-admin-card .pro-image {
          height: auto !important;
        }

        .brand-page-admin-card .pro-image .counter {
          width: calc(100% - 32px);
          max-width: 380px;
        }

        .brand-page-admin-card .product-favorite-btn {
          z-index: 4;
        }

        .brand-builder-banner {
          height: 420px;
        }

        .brand-builder-banner picture,
        .brand-builder-banner img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        @media (max-width: 991px) and (min-width: 768px) {
          .brand-builder-banner {
            height: 360px;
          }
        }

        @media (max-width: 767px) {
          .brand-builder-banner {
            height: 210px;
          }

          .brand-page-admin-slider .swiper {
            padding-bottom: 8px;
          }

          .brand-page-admin-slider .swiper-button-prev,
          .brand-page-admin-slider .swiper-button-next {
            display: none !important;
          }
        }
      `})]})}export{Ne as default};
