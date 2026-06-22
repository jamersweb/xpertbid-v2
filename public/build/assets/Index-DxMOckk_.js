import{r as p,j as e,H as ze,a as S}from"./app-lu7_VoJP.js";import{A as $e}from"./AppLayout-B0xpL7z0.js";import{A as W}from"./AuctionCard-CmchA6tH.js";import{S as Le,a as Fe}from"./swiper-l5bT_C8n.js";import{N as Ce}from"./navigation-CWcQ-MLR.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";import"./CountdownTimer-BfR-Y7Nz.js";import"./FavoriteToggleButton-BWzLqp6w.js";import"./listingPricing-CBcHwZ3i.js";const Pe=s=>{if(Array.isArray(s))return s.filter(i=>String(i||"").trim()!=="");if(typeof s=="string"){const i=s.trim();if(i==="")return[];try{const r=JSON.parse(i);if(Array.isArray(r))return r.filter(a=>String(a||"").trim()!=="")}catch{}return i.split(",").map(r=>r.trim()).filter(Boolean)}return[]},re=(s={})=>{const i={};return Object.entries(s||{}).forEach(([r,a])=>{if(!String(r).startsWith("df_"))return;if(Array.isArray(a)){i[r]=a.map(f=>String(f));return}if(a==null||a==="")return;const h=String(a);i[r]=h.includes(",")?h.split(",").map(f=>f.trim()).filter(Boolean):h}),i},ae=s=>typeof s!="string"||s.trim()===""?"":s.replace(/<li\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>|<span\b[^>]*>\s*<\/span>)*<\/li>/gi,"").replace(/<p\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>|<span\b[^>]*>\s*<\/span>)*<\/p>/gi,"").replace(/<ul\b([^>]*)>\s*<\/ul>/gi,"<ul$1></ul>").replace(/<ol\b([^>]*)>\s*<\/ol>/gi,"<ol$1></ol>"),ne=s=>{if(typeof s!="string")return"";const i=s.trim();if(!i)return"";try{const r=JSON.parse(i);return JSON.stringify(r)}catch{const a=i.replace(/^\s*html\s*/i,"").replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i,"").replace(/<\/script>\s*$/i,"").trim();if(!a)return"";try{const h=JSON.parse(a);return JSON.stringify(h)}catch{return""}}},Ie=s=>{if(typeof s!="string")return[];const i=s.trim();if(!i)return[];const r=[...i.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];if(r.length>0)return r.map(h=>ne(h[1]||"")).filter(Boolean);const a=ne(i);return a?[a]:[]},ie=({title:s,items:i=[],slider:r=!1})=>!i||i.length===0?null:e.jsxs("section",{className:"marketplace-curated-section",children:[e.jsx("div",{className:"marketplace-curated-header",children:e.jsx("h3",{children:s})}),r?e.jsx("div",{className:"marketplace-curated-slider",children:e.jsx(Le,{modules:[Ce],navigation:i.length>3,spaceBetween:20,loop:i.length>4,breakpoints:{360:{slidesPerView:1.05},550:{slidesPerView:1.4},768:{slidesPerView:2},1024:{slidesPerView:2.6},1280:{slidesPerView:3}},children:i.map(a=>e.jsx(Fe,{children:e.jsx(W,{auction:a,showPropertyMeta:!0})},`curated-${s}-${a.id}`))})}):e.jsx("div",{className:"row",children:i.map(a=>e.jsx("div",{className:"col-md-6 col-xl-4 mb-4",children:e.jsx(W,{auction:a,showPropertyMeta:!0})},`curated-${s}-${a.id}`))})]}),Be=()=>e.jsxs("div",{className:"text-center py-5 bg-white rounded-3 shadow-sm border mt-4",children:[e.jsx("div",{className:"mb-3 d-flex justify-content-center",children:e.jsx("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",children:e.jsx("path",{d:"M3 8.5L12 3L21 8.5M3 8.5V15.5L12 21M3 8.5L12 14M21 8.5V15.5L12 21M21 8.5L12 14M12 14V21",stroke:"#94A3B8",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})}),e.jsx("h3",{className:"h5 fw-bold text-dark",children:"No Products Found"}),e.jsx("p",{className:"text-muted",children:"We couldn't find any products matching your current filters."}),e.jsx("button",{onClick:()=>window.location.href=route("marketplace.index"),className:"btn btn-dark rounded-3 px-4 py-2 mt-2",children:"Clear All Filters"})]}),Ve=({title:s,items:i=[],hasMore:r=!1,loading:a=!1,onLoadMore:h})=>e.jsxs("section",{className:"marketplace-latest-grid-section",children:[e.jsx("div",{className:"marketplace-curated-header",children:e.jsx("h3",{children:s})}),i.length===0?e.jsx(Be,{}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"row makt-parent w-100 mx-auto",children:i.map(f=>e.jsx("div",{className:"col-md-6 col-xl-4 mkt-child mb-4",children:e.jsx(W,{auction:f,showPropertyMeta:!0})},f.id))}),r&&e.jsx("div",{className:"d-flex justify-content-center mt-2",children:e.jsx("button",{type:"button",className:"marketplace-load-more-btn",onClick:h,disabled:a,children:a?"Loading...":"Load More"})})]})]});function Ze({products:s={data:[],links:[]},categories:i=[],currentCategory:r=null,currentTopCategory:a=null,subcategoryTabs:h=[],currentSubcategory:f=null,childCategoryTabs:se=[],countries:oe=[],dynamicFields:G=[],featuredProducts:le=[],mostViewedProducts:ce=[],filters:c={},currentType:pe="auction"}){const[L,X]=p.useState(c?.search||""),[N,I]=p.useState(!1),[B,V]=p.useState(!1),[de,E]=p.useState(!1),[w,D]=p.useState(c?.country_id?String(c.country_id):""),[k,y]=p.useState(c?.state_id?String(c.state_id):""),[F,x]=p.useState(c?.city_id?String(c.city_id):""),[ue,C]=p.useState([]),[me,j]=p.useState([]),[q,_]=p.useState(()=>re(c)),[he,U]=p.useState(s?.data||[]),[O,xe]=p.useState(s?.next_page_url||null),[Y,T]=p.useState(!1),K=a?.image_url||r?.image_url||"https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",M=pe||c?.type||"auction",Q=!!f,be=!a&&!r&&i.length>0,H=a?.name||r?.name||"Products",Z=String(c?.section||"").toLowerCase(),P=["featured","latest_auctions","latest_vehicles","latest_properties","latest_listings"].includes(Z),ge={featured:"Featured Products",latest_auctions:"Latest Auctions",latest_vehicles:"Latest Vehicles",latest_properties:"Latest Properties",latest_listings:"Latest Listings"}[Z]||`Latest ${H}`,ee=ae(r?.seo_short_content),te=ae(r?.seo_content),fe=Ie(r?.schema_markup),b=p.useRef(null),v=p.useRef(null),ke=()=>{b.current&&(clearTimeout(b.current),b.current=null),v.current&&(cancelAnimationFrame(v.current),v.current=null),V(!0),E(!1),I(!1),v.current=requestAnimationFrame(()=>{v.current=null,requestAnimationFrame(()=>{I(!0)})})},R=()=>{E(!0),I(!1)};p.useEffect(()=>{if(N){V(!0),b.current&&(clearTimeout(b.current),b.current=null);return}B&&(b.current=setTimeout(()=>{V(!1),E(!1),b.current=null},820))},[N,B]),p.useEffect(()=>{if(typeof document>"u")return;const t=document.body.style.overflow;return N&&(document.body.style.overflow="hidden"),()=>{document.body.style.overflow=t}},[N]),p.useEffect(()=>()=>{b.current&&clearTimeout(b.current),v.current&&cancelAnimationFrame(v.current)},[]);const we=[{key:"auction",label:"Auction",mobileLabel:"Auction"},{key:"normal",label:"Normal Products",mobileLabel:"Normal"},{key:"business",label:"Business Products",mobileLabel:"Business"}],ye={auction:"auctions",normal:"normal-products",normal_list:"normal-products",business:"business-products",business_list:"business-products"},z=(t=M,n=r?.slug)=>n?route("marketplace.type",{slug:n,typeSlug:ye[t]||"auctions"}):route("marketplace.index"),A=(t=c)=>{const n={...t};return delete n.type,delete n.category,delete n.page,delete n.section,n},je=t=>{S.get(z(t),{...A()},{preserveState:!0,preserveScroll:!0})},ve=t=>{t.preventDefault(),S.get(z(),{...A(),search:L},{preserveState:!0,preserveScroll:!0})},$=t=>{S.get(z(M,t),{...A()},{preserveState:!0,preserveScroll:!0})},Se=()=>{S.get(route("marketplace.index"),{...A()},{preserveState:!0,preserveScroll:!0})};p.useEffect(()=>{X(c?.search||""),D(c?.country_id?String(c.country_id):""),y(c?.state_id?String(c.state_id):""),x(c?.city_id?String(c.city_id):""),_(re(c))},[c]),p.useEffect(()=>{const t=s?.data||[];(s?.current_page||1)<=1?U(t):U(n=>{const d=new Set(n.map(m=>m.id)),l=t.filter(m=>!d.has(m.id));return[...n,...l]}),xe(s?.next_page_url||null),T(!1)},[s]),p.useEffect(()=>{let t=!1;return(async()=>{if(!w){C([]),y(""),j([]),x("");return}try{const l=await(await fetch(`/get-states/${w}`)).json();if(t)return;const m=Array.isArray(l?.state)?l.state:[];C(m),m.find(u=>String(u.id)===String(k))||(y(""),j([]),x(""))}catch{t||(C([]),y(""),j([]),x(""))}})(),()=>{t=!0}},[w]),p.useEffect(()=>{let t=!1;return(async()=>{if(!k){j([]),x("");return}try{const l=await(await fetch(`/get-cities/${k}`)).json();if(t)return;const m=Array.isArray(l?.city)?l.city:[];j(m),m.find(u=>String(u.id)===String(F))||x("")}catch{t||(j([]),x(""))}})(),()=>{t=!0}},[k]);const Ne=()=>{const t={...c,search:L,page:1};w?t.country_id=w:delete t.country_id,k?t.state_id=k:delete t.state_id,F?t.city_id=F:delete t.city_id,G.forEach(n=>{const d=`df_${n.id}`,l=q[d];if(Array.isArray(l)){l.length>0?t[d]=l.join(","):delete t[d];return}l!=null&&String(l).trim()!==""?t[d]=l:delete t[d]}),S.get(z(),A(t),{preserveState:!0,preserveScroll:!0}),R()},_e=()=>{D(""),y(""),x(""),C([]),j([]),_({});const t={...c,search:L,page:1};delete t.country_id,delete t.state_id,delete t.city_id,Object.keys(t).forEach(n=>{n.startsWith("df_")&&delete t[n]}),S.get(z(),A(t),{preserveState:!0,preserveScroll:!0})},Ae=(t,n,d)=>{const l=`df_${t}`;_(m=>{const u=m[l],o=Array.isArray(u)?u:u?[String(u)]:[],g=d?Array.from(new Set([...o,n])):o.filter(J=>J!==n);return{...m,[l]:g}})},Me=()=>{!O||Y||(T(!0),S.get(O,{},{preserveState:!0,preserveScroll:!0,only:["products"],onFinish:()=>T(!1)}))};return e.jsxs($e,{title:r?.meta_title||"Marketplace",children:[e.jsxs(ze,{children:[e.jsx("title",{children:r?.meta_title||"Marketplace | XpertBid"}),e.jsx("meta",{name:"description",content:r?.meta_description||"Explore our marketplace for the best deals."}),fe.map((t,n)=>e.jsx("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:t}},`category-schema-${n}`))]}),e.jsxs("div",{className:"pb-5 bg-light min-vh-100",children:[e.jsx("div",{className:"marketplace-topbar-wrap",style:K?{backgroundImage:`linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.38)), url("${K}")`}:void 0,children:e.jsx("div",{className:"container-fluid px-lg-5",children:e.jsxs("div",{className:"marketplace-topbar p-3 p-lg-4",children:[e.jsx("div",{className:"marketplace-selected-category mb-3",children:r?.name||a?.name||"Marketplace"}),be&&e.jsx("div",{className:"marketplace-subcategory-tabs mb-3",children:i.map(t=>e.jsx("button",{type:"button",onClick:()=>$(t.slug),className:"marketplace-subcategory-tab",children:t.name},t.id))}),a&&!Q&&e.jsxs("div",{className:"marketplace-subcategory-tabs mb-3",children:[e.jsx("button",{type:"button",onClick:Se,className:"marketplace-subcategory-back","aria-label":"Back to main categories",children:e.jsx("span",{"aria-hidden":"true",children:"←"})}),e.jsxs("button",{type:"button",onClick:()=>$(a.slug),className:`marketplace-subcategory-tab ${r?.slug===a.slug?"is-active":""}`,children:["All ",a.name]}),h.map(t=>e.jsx("button",{type:"button",onClick:()=>$(t.slug),className:`marketplace-subcategory-tab ${r?.slug===t.slug?"is-active":""}`,children:t.name},t.id))]}),a&&Q&&e.jsxs("div",{className:"marketplace-subcategory-tabs mb-3",children:[e.jsx("button",{type:"button",onClick:()=>$(a.slug),className:"marketplace-subcategory-back","aria-label":"Back to subcategories",children:e.jsx("span",{"aria-hidden":"true",children:"←"})}),se.map(t=>e.jsx("button",{type:"button",onClick:()=>$(t.slug),className:`marketplace-subcategory-tab ${r?.slug===t.slug?"is-active":""}`,children:t.name},t.id))]}),e.jsx("form",{onSubmit:ve,className:"marketplace-searchbar mb-3",children:e.jsxs("div",{className:"marketplace-searchbar-row",children:[e.jsx("input",{type:"text",value:L,onChange:t=>X(t.target.value),placeholder:"Search products..."}),e.jsx("button",{type:"button",className:"marketplace-filter-btn",onClick:ke,"aria-label":"Open filters",children:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:e.jsx("path",{d:"M4 6h16M7 12h10M10 18h4",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"})})})]})}),e.jsx("div",{className:"marketplace-top-tabs",children:we.map(t=>{const n=t.key==="auction"&&M==="auction"||t.key==="normal"&&["normal","normal_list"].includes(M)||t.key==="business"&&["business","business_list"].includes(M),d=t.key==="normal"?"normal":t.key==="business"?"business":t.key;return e.jsxs("button",{type:"button",onClick:()=>je(d),className:`marketplace-top-tab ${n?"is-active":""}`,children:[e.jsx("span",{className:"d-none d-md-inline",children:t.label}),e.jsx("span",{className:"d-inline d-md-none",children:t.mobileLabel||t.label})]},t.key)})})]})})}),e.jsxs("div",{className:"container-fluid px-3 px-lg-5 pt-4",children:[!P&&ee&&e.jsx("div",{className:"content-wrapper content-wrapper-short mb-4 text-dark",children:e.jsx("div",{dangerouslySetInnerHTML:{__html:ee}})}),e.jsxs("div",{className:"mkt-right",children:[!P&&e.jsx(ie,{title:`Featured ${H}`,items:le,slider:!0}),!P&&e.jsx(ie,{title:`Most Viewed ${H}`,items:ce,slider:!0}),e.jsx(Ve,{title:ge,items:he,hasMore:!!O,loading:Y,onLoadMore:Me}),!P&&te&&e.jsx("div",{className:"content-wrapper content-wrapper-long mt-5 text-dark",children:e.jsx("div",{dangerouslySetInnerHTML:{__html:te}})})]})]}),B&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`marketplace-filter-backdrop ${N?"is-open":""}`,onClick:R}),e.jsxs("aside",{className:`marketplace-filter-drawer ${N?"is-open":""} ${de?"is-closing":""}`,children:[e.jsxs("div",{className:"marketplace-filter-header",children:[e.jsx("h3",{children:"Filters"}),e.jsx("button",{type:"button",onClick:R,"aria-label":"Close filters",children:"×"})]}),e.jsxs("div",{className:"marketplace-filter-body",children:[e.jsxs("div",{className:"marketplace-filter-group",children:[e.jsx("label",{children:"Country"}),e.jsxs("select",{value:w,onChange:t=>{const n=t.target.value;D(n),y(""),x("")},children:[e.jsx("option",{value:"",children:"All Countries"}),oe.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]})]}),e.jsxs("div",{className:"marketplace-filter-group",children:[e.jsx("label",{children:"State"}),e.jsxs("select",{value:k,onChange:t=>{y(t.target.value),x("")},disabled:!w,children:[e.jsx("option",{value:"",children:"All States"}),ue.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]})]}),e.jsxs("div",{className:"marketplace-filter-group",children:[e.jsx("label",{children:"City"}),e.jsxs("select",{value:F,onChange:t=>x(t.target.value),disabled:!k,children:[e.jsx("option",{value:"",children:"All Cities"}),me.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]})]}),G.map(t=>{const n=`df_${t.id}`,d=String(t.input_type||"").toLowerCase(),l=Pe(t.options);if(l.length===0)return null;const m=t.label||t.field_name||`Field ${t.id}`,u=q[n];return e.jsxs("div",{className:"marketplace-filter-group",children:[e.jsx("label",{children:m}),d==="select"&&e.jsxs("select",{value:Array.isArray(u)?"":u||"",onChange:o=>_(g=>({...g,[n]:o.target.value})),children:[e.jsx("option",{value:"",children:"All"}),l.map(o=>e.jsx("option",{value:o,children:o},`${t.id}-${o}`))]}),d==="radio"&&e.jsx("div",{className:"marketplace-filter-options",children:l.map(o=>e.jsxs("label",{className:"marketplace-filter-option-row",children:[e.jsx("input",{type:"radio",name:`dynamic-radio-${t.id}`,value:o,checked:String(u||"")===o,onChange:()=>_(g=>({...g,[n]:o}))}),e.jsx("span",{children:o})]},`${t.id}-${o}`))}),d==="checkbox"&&e.jsx("div",{className:"marketplace-filter-options",children:l.map(o=>{const g=Array.isArray(u)?u:u?[String(u)]:[];return e.jsxs("label",{className:"marketplace-filter-option-row",children:[e.jsx("input",{type:"checkbox",checked:g.includes(o),onChange:J=>Ae(t.id,o,J.target.checked)}),e.jsx("span",{children:o})]},`${t.id}-${o}`)})}),!["select","radio","checkbox"].includes(d)&&e.jsxs("select",{value:Array.isArray(u)?"":u||"",onChange:o=>_(g=>({...g,[n]:o.target.value})),children:[e.jsx("option",{value:"",children:"All"}),l.map(o=>e.jsx("option",{value:o,children:o},`${t.id}-${o}`))]})]},t.id)})]}),e.jsxs("div",{className:"marketplace-filter-footer",children:[e.jsx("button",{type:"button",className:"filter-clear-btn",onClick:_e,children:"Clear"}),e.jsx("button",{type:"button",className:"filter-apply-btn",onClick:Ne,children:"Apply Filters"})]})]})]})]}),e.jsx("style",{children:`
                            .content-wrapper {
                                   position: relative;
                                   overflow: hidden;
                                   color: #212529 !important;
                                   background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
                                   border: 1px solid rgba(226, 232, 240, 0.95);
                                   box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
                                   border-radius: 28px;
                            }
                            .content-wrapper * {
                                   color: #212529 !important;
                            }
                            .content-wrapper::before {
                                   content: "";
                                   position: absolute;
                                   inset: 0 auto auto 0;
                                   width: 100%;
                                   height: 5px;
                                   background: linear-gradient(90deg, #020617 0%, #0f172a 32%, #1d4ed8 68%, #0ea5e9 100%);
                            }
                            .content-wrapper-short {
                                   padding: 28px 36px;
                                   text-align: center;
                            }
                            .content-wrapper-long {
                                   padding: 38px 42px;
                            }
                            .content-wrapper > div {
                                   position: relative;
                                   z-index: 1;
                            }
                            .content-wrapper p {
                                   margin-bottom: 0;
                                   color: #475569 !important;
                                   line-height: 1.9;
                                   font-size: 1.05rem;
                            }
                            .content-wrapper p + p {
                                   margin-top: 16px;
                            }
                            .content-wrapper-short p {
                                   max-width: 1100px;
                                   margin-left: auto;
                                   margin-right: auto;
                                   font-size: 1.08rem;
                            }
                            .content-wrapper-short strong,
                            .content-wrapper-short b {
                                   display: block;
                                   margin-bottom: 10px;
                                   color: #0f172a !important;
                                   font-size: clamp(1.45rem, 2vw, 2rem);
                                   line-height: 1.25;
                                   font-weight: 800;
                                   letter-spacing: -0.02em;
                            }
                            .content-wrapper-long h1,
                            .content-wrapper-long h2,
                            .content-wrapper-long h3,
                            .content-wrapper-long h4 {
                                   color: #0f172a !important;
                                   font-weight: 800;
                                   line-height: 1.2;
                                   letter-spacing: -0.03em;
                                   margin-bottom: 16px;
                            }
                            .content-wrapper-long h1 {
                                   font-size: clamp(2rem, 3vw, 3rem);
                            }
                            .content-wrapper-long h2 {
                                   font-size: clamp(1.7rem, 2.4vw, 2.35rem);
                            }
                            .content-wrapper-long h3 {
                                   font-size: clamp(1.35rem, 1.8vw, 1.7rem);
                            }
                            .content-wrapper-long ul,
                            .content-wrapper-long ol {
                                   margin: 20px 0;
                                   padding-left: 0;
                                   list-style: none;
                                   display: grid;
                                   gap: 12px;
                            }
                            .content-wrapper-long li {
                                   position: relative;
                                   display: flex;
                                   align-items: center;
                                   padding-left: 34px;
                                   color: #475569 !important;
                                   line-height: 1.8;
                                   min-height: 24px;
                            }
                            .content-wrapper-long li:empty,
                            .content-wrapper-long p:empty {
                                   display: none !important;
                            }
                            .content-wrapper-long li:has(> br:only-child),
                            .content-wrapper-long p:has(> br:only-child) {
                                   display: none !important;
                            }
                            .content-wrapper-long li::before {
                                   content: "";
                                   position: absolute;
                                   left: 0;
                                   top: 50%;
                                   transform: translateY(-50%);
                                   width: 18px;
                                   height: 18px;
                                   border-radius: 50%;
                                   background: linear-gradient(135deg, #0f172a, #334155);
                                   box-shadow: 0 8px 18px rgba(15, 23, 42, 0.15);
                            }
                            .content-wrapper-long li::after {
                                   content: "";
                                   position: absolute;
                                   left: 7px;
                                   top: 50%;
                                   transform: translateY(-50%);
                                   width: 4px;
                                   height: 4px;
                                   border-radius: 50%;
                                   background: #fff;
                            }
                            .marketplace-topbar-wrap {
                                   width: 100%;
                                   background-color: #fff;
                                   background-position: center;
                                   background-repeat: no-repeat;
                                   background-size: cover;
                                   border-bottom: none;
                                   box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
                                   padding-top: 22px;
                                   padding-bottom: 22px;
                            }
                            .marketplace-topbar {
                                   width: 100%;
                                   border-radius: 28px;
                                   background: rgba(255, 255, 255, 0.12);
                                   backdrop-filter: blur(5px);
                                   -webkit-backdrop-filter: blur(5px);
                                   min-height: 340px;
                                   display: flex;
                                   flex-direction: column;
                                   justify-content: center;
                                   align-items: center;
                                   text-align: center;
                            }
                            .marketplace-topbar > * {
                                   width: 100%;
                            }
                            .marketplace-selected-category {
                                   color: #fff;
                                   font-size: 36px;
                                   font-weight: 800;
                                   line-height: 1.1;
                                   text-shadow: 0 8px 24px rgba(15, 23, 42, 0.35);
                            }
                            .marketplace-searchbar input {
                                   width: 100%;
                                   height: 62px;
                                   border: none;
                                   border-radius: 16px;
                                   background: rgba(255, 255, 255, 0.92);
                                   padding: 0 20px;
                                   font-size: 15px;
                                   color: #111827;
                                   box-shadow: none;
                            }
                            .marketplace-searchbar input:focus {
                                   outline: none;
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-searchbar-row {
                                   display: grid;
                                   grid-template-columns: 1fr 58px;
                                   gap: 10px;
                                   align-items: center;
                            }
                            .marketplace-filter-btn {
                                   width: 58px;
                                   height: 58px;
                                   border: none;
                                   border-radius: 16px;
                                   background: #0f172a;
                                   color: #fff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-filter-btn:hover {
                                   background: #111827;
                            }
                            .marketplace-filter-btn svg {
                                   width: 22px;
                                   height: 22px;
                            }
                            .marketplace-filter-backdrop {
                                   position: fixed;
                                   inset: 0;
                                   z-index: 100002;
                                   background: rgba(15, 23, 42, 0.42);
                                   opacity: 0;
                                   pointer-events: none;
                                   transition: opacity 0.4s ease;
                            }
                            .marketplace-filter-backdrop.is-open {
                                   opacity: 1;
                                   pointer-events: auto;
                            }
                            .marketplace-filter-drawer {
                                   position: fixed;
                                   top: 0;
                                   left: 0;
                                   width: 360px;
                                   max-width: 94vw;
                                   height: 100vh;
                                   z-index: 100003;
                                   background: #fff;
                                   box-shadow: 12px 0 28px rgba(15, 23, 42, 0.2);
                                   display: flex;
                                   flex-direction: column;
                                   transform: translateX(-100%);
                                   transition: transform 1.05s cubic-bezier(0.22, 1, 0.36, 1);
                                   will-change: transform;
                            }
                            .marketplace-filter-drawer.is-open {
                                   transform: translateX(0);
                            }
                            .marketplace-filter-drawer.is-closing {
                                   transform: translateX(100%);
                            }
                            .marketplace-filter-header {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   padding: 20px 18px 14px;
                                   border-bottom: 1px solid #e5e7eb;
                            }
                            .marketplace-filter-header h3 {
                                   margin: 0;
                                   font-size: 20px;
                                   font-weight: 800;
                                   color: #0f172a;
                            }
                            .marketplace-filter-header button {
                                   width: 36px;
                                   height: 36px;
                                   border: none;
                                   border-radius: 10px;
                                   background: #f3f4f6;
                                   font-size: 24px;
                                   line-height: 1;
                                   color: #0f172a;
                            }
                            .marketplace-filter-body {
                                   flex: 1;
                                   overflow-y: auto;
                                   padding: 16px 18px;
                            }
                            .marketplace-filter-group {
                                   margin-bottom: 14px;
                            }
                            .marketplace-filter-group > label {
                                   display: block;
                                   margin-bottom: 8px;
                                   font-size: 13px;
                                   font-weight: 700;
                                   color: #0f172a;
                            }
                            .marketplace-filter-group select {
                                   width: 100%;
                                   height: 46px;
                                   border-radius: 12px;
                                   border: 1px solid #d1d5db;
                                   background: #fff;
                                   color: #111827;
                                   padding: 0 12px;
                            }
                            .marketplace-filter-options {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 8px;
                            }
                            .marketplace-filter-option-row {
                                   display: flex;
                                   align-items: center;
                                   gap: 8px;
                                   font-size: 14px;
                                   color: #111827;
                            }
                            .marketplace-filter-footer {
                                   display: flex;
                                   gap: 10px;
                                   border-top: 1px solid #e5e7eb;
                                   padding: 14px 18px 16px;
                            }
                            .filter-clear-btn,
                            .filter-apply-btn {
                                   flex: 1;
                                   min-height: 44px;
                                   border-radius: 12px;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .filter-clear-btn {
                                   border: 1px solid #cbd5e1;
                                   background: #fff;
                                   color: #334155;
                            }
                            .filter-apply-btn {
                                   border: none;
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-top-tabs {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 12px;
                            }
                            .marketplace-top-tab {
                                   min-height: 58px;
                                   border-radius: 16px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #5f6c80;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                                   box-shadow: none;
                            }
                            .marketplace-top-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                                   color: #435168;
                            }
                            .marketplace-top-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-tabs {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   justify-content: center;
                            }
                            .marketplace-subcategory-tab {
                                   min-height: 50px;
                                   padding: 0 20px;
                                   border-radius: 14px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #435168;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-subcategory-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-back {
                                   width: 50px;
                                   min-width: 50px;
                                   height: 50px;
                                   border-radius: 14px;
                                   border: none;
                                   background: #111827;
                                   color: #fff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   font-size: 20px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-back:hover {
                                   background: #0b1220;
                            }
                            .marketplace-curated-section {
                                   margin-bottom: 38px;
                                   overflow: hidden;
                            }
                            .marketplace-latest-grid-section {
                                   margin-top: 6px;
                                   margin-bottom: 42px;
                            }
                            .marketplace-curated-header {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   margin-bottom: 14px;
                            }
                            .marketplace-curated-header h3 {
                                   margin: 0;
                                   font-size: 28px;
                                   font-weight: 800;
                                   color: #0f172a;
                            }
                            .marketplace-curated-slider {
                                   position: relative;
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
                            .marketplace-load-more-btn {
                                   min-width: 168px;
                                   min-height: 48px;
                                   border: none;
                                   border-radius: 12px;
                                   background: #111827;
                                   color: #ffffff;
                                   font-size: 14px;
                                   font-weight: 800;
                                   padding: 0 28px;
                                   box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
                                   transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                            }
                            .marketplace-load-more-btn:hover:not(:disabled) {
                                   transform: translateY(-2px);
                                   background: #020617;
                                   box-shadow: 0 16px 34px rgba(15, 23, 42, 0.2);
                            }
                            .marketplace-load-more-btn:disabled {
                                   cursor: wait;
                                   opacity: 0.7;
                            }
                            @media (max-width: 767px) {
                                   .mkt-right {
                                          padding-inline: 4px;
                                   }
                                   .content-wrapper-short {
                                          padding: 22px 18px;
                                          border-radius: 22px;
                                   }
                                   .content-wrapper-long {
                                          padding: 26px 18px;
                                          border-radius: 22px;
                                   }
                                   .content-wrapper p,
                                   .content-wrapper-short p {
                                          font-size: 0.98rem;
                                          line-height: 1.8;
                                   }
                                   .content-wrapper-short strong,
                                   .content-wrapper-short b {
                                          margin-bottom: 8px;
                                          font-size: 1.25rem;
                                   }
                                   .marketplace-topbar {
                                          padding-inline: 0;
                                          min-height: 380px;
                                   }
                                   .marketplace-selected-category {
                                          font-size: 28px;
                                   }
                                   .marketplace-top-tabs {
                                          grid-template-columns: repeat(3, minmax(0, 1fr));
                                          gap: 8px;
                                   }
                                   .marketplace-top-tab {
                                          min-height: 46px;
                                          padding: 0 10px;
                                          font-size: 12px;
                                          border-radius: 12px;
                                   }
                                   .marketplace-searchbar-row {
                                          grid-template-columns: 1fr 52px;
                                          gap: 8px;
                                   }
                                   .marketplace-filter-btn {
                                          width: 52px;
                                          height: 52px;
                                          border-radius: 12px;
                                   }
                                   .marketplace-filter-drawer {
                                          width: 100%;
                                          max-width: 100%;
                                          top: 0;
                                          right: 0;
                                          bottom: 0;
                                          height: 100dvh;
                                          max-height: 100dvh;
                                          border-radius: 0;
                                   }
                                   .marketplace-filter-body {
                                          padding-bottom: 12px;
                                   }
                                   .marketplace-filter-footer {
                                          padding-bottom: calc(14px + env(safe-area-inset-bottom));
                                   }
                                   .marketplace-subcategory-tabs {
                                          display: flex;
                                          flex-wrap: nowrap;
                                          justify-content: flex-start;
                                          align-items: center;
                                          gap: 10px;
                                          overflow-x: auto;
                                          padding-inline: 8px;
                                          padding-bottom: 4px;
                                          scrollbar-width: none;
                                   }
                                   .marketplace-subcategory-tabs::-webkit-scrollbar {
                                          display: none;
                                   }
                                   .marketplace-subcategory-tab {
                                          min-height: 44px;
                                          white-space: nowrap;
                                          flex: 0 0 auto;
                                          font-size: 13px;
                                   }
                                   .marketplace-subcategory-back {
                                          width: 44px;
                                          min-width: 44px;
                                          height: 44px;
                                          flex: 0 0 auto;
                                   }
                                   .marketplace-curated-header h3 {
                                          font-size: 22px;
                                   }
                                   .marketplace-curated-slider {
                                          padding-bottom: 2px;
                                   }
                                   .marketplace-curated-slider .swiper {
                                          padding-bottom: 8px;
                                   }
                                   .marketplace-curated-slider .swiper-button-prev,
                                   .marketplace-curated-slider .swiper-button-next {
                                          display: none !important;
                                   }
                            }
                     `})]})}export{Ze as default};
