import{j as s,H as m,L as o}from"./app-lu7_VoJP.js";import{A as h}from"./AppLayout-B0xpL7z0.js";import{P as x}from"./Pagination-DhWK_AXl.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";function N({blogs:a}){const i=(e="",t=20)=>{if(!e)return"";const r=e.trim().split(/\s+/);return r.length<=t?e:r.slice(0,t).join(" ")+"..."},n=(e="")=>e?e.replace(/<[^>]*>/g,""):"",l=e=>e?.excerpt||e?.short_description||e?.description||e?.content||e?.body||"",d=(e="",t=80)=>e&&e.length<=t?e:e?e.slice(0,t)+"...":"";return s.jsxs(h,{title:"Blogs",children:[s.jsxs(m,{children:[s.jsx("title",{children:"Blogs | XpertBid"}),s.jsx("meta",{name:"description",content:"Stay updated with the latest news and guides from XpertBid."})]}),s.jsx("div",{className:"py-5 bg-light min-vh-100",children:s.jsxs("div",{className:"container",children:[s.jsxs("div",{className:"text-center mb-5",children:[s.jsx("h1",{className:"fw-bolder display-4 text-dark mb-3",children:"Our Blogs"}),s.jsx("p",{className:"lead text-muted mx-auto",style:{maxWidth:"700px"},children:"Discover insights, tips, and stories about auctions, vehicles, real estate, and more."})]}),s.jsxs("div",{className:"row g-4 mb-5",children:[a.data.map(e=>{const t=i(e?.title||"",15),r=l(e),c=d(n(r),120);return s.jsx("div",{className:"col-md-6 col-lg-4",children:s.jsxs("div",{className:"card h-100 border-0 shadow-sm rounded-4 overflow-hidden blog-card",children:[s.jsx(o,{href:route("blogs.show",e.slug),className:"text-decoration-none",children:s.jsxs("div",{className:"position-relative overflow-hidden",style:{height:"220px"},children:[s.jsx("img",{src:e.image?e.image.startsWith("http")?e.image:`/${encodeURI(e.image)}`:"/assets/images/WebsiteBanner2.png",className:"card-img-top w-100 h-100 object-fit-cover transition-all",alt:e.title}),s.jsx("div",{className:"position-absolute top-0 start-0 m-3 px-3 py-2 bg-white rounded-pill shadow-sm small fw-bold text-primary",children:new Date(e.created_at).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})})]})}),s.jsxs("div",{className:"card-body p-4 d-flex flex-column",children:[s.jsx(o,{href:route("blogs.show",e.slug),className:"text-decoration-none",children:s.jsx("h5",{className:"card-title fw-bold text-dark mb-3 h4",style:{lineHeight:"1.4"},children:t})}),s.jsx("p",{className:"card-text text-muted mb-4 flex-grow-1",style:{fontSize:"0.95rem"},children:c}),s.jsxs(o,{href:route("blogs.show",e.slug),className:"btn rounded-pill px-4 fw-bold align-self-start transition-all blog-read-more-btn",children:["Read More ",s.jsx("i",{className:"fa-solid fa-arrow-right ms-2 small"})]})]})]})},e.id)}),a.data.length===0&&s.jsxs("div",{className:"col-12 text-center py-5 bg-white rounded-4 shadow-sm border",children:[s.jsx("div",{className:"mb-3 opacity-25",children:s.jsx("i",{className:"fa-solid fa-newspaper fa-4x"})}),s.jsx("h3",{className:"h4 fw-bold",children:"No Blogs Found"}),s.jsx("p",{className:"text-muted",children:"Stay tuned! We'll be posting some interesting content soon."})]})]}),a.links&&s.jsx("div",{className:"d-flex justify-content-center mt-5",children:s.jsx(x,{links:a.links})})]})}),s.jsx("style",{dangerouslySetInnerHTML:{__html:`
                .blog-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .blog-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                }
                .blog-card .card-img-top {
                    transition: transform 0.5s ease;
                }
                .blog-card:hover .card-img-top {
                    transform: scale(1.1);
                }
                .blog-read-more-btn {
                    background: #23262F;
                    border: 1px solid #23262F;
                    color: #fff;
                }
                .blog-read-more-btn:hover,
                .blog-read-more-btn:focus {
                    background: #43ACE9;
                    border-color: #43ACE9;
                    color: #fff;
                }
                .object-fit-cover {
                    object-fit: cover;
                }
            `}})]})}export{N as default};
