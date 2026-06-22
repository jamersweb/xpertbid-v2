import{j as e,L as x,H as _}from"./app-lu7_VoJP.js";import{A as f}from"./AppLayout-B0xpL7z0.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";function $({blog:t}){const r=typeof t?.title=="string"?t.title:"Blog",s=typeof t?.image=="string"?t.image.trim():"",c=typeof t?.schema_markup=="string"?t.schema_markup.trim():"",b=typeof t?.content=="string"?t.content:typeof t?.description=="string"?t.description:typeof t?.body=="string"?t.body:"",g=typeof t?.excerpt=="string"&&t.excerpt.trim()?t.excerpt:typeof t?.meta_description=="string"&&t.meta_description.trim()?t.meta_description:"Read more on our blog.",l=s?s.startsWith("http")?s:`/${encodeURI(s)}`:"",y=t?.created_at?new Date(t.created_at).toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"}):"",a=typeof window<"u"?window.location.href:typeof t?.slug=="string"&&t.slug?route("blogs.show",t.slug,!1):"",d=typeof t?.canonical_url=="string"&&t.canonical_url.trim()?t.canonical_url.trim():a,m=r,p=(()=>{if(!c)return"";try{const n=JSON.parse(c);return JSON.stringify(n)}catch{const o=c.replace(/^\s*html\s*/i,"").replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i,"").replace(/<\/script>\s*$/i,"").trim();if(!o)return"";try{const u=JSON.parse(o);return JSON.stringify(u)}catch{return""}}})(),i=n=>{if(typeof window>"u")return;const o=window.open(n,"_blank");o&&(o.opener=null)},w=()=>{i(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(a)}`)},j=()=>{i(`https://twitter.com/intent/tweet?url=${encodeURIComponent(a)}&text=${encodeURIComponent(m)}`)},k=()=>{i(`https://wa.me/?text=${encodeURIComponent(`${m} ${a}`)}`)},h=async()=>{if(typeof window>"u")return!1;try{if(navigator?.clipboard?.writeText)await navigator.clipboard.writeText(a);else{const n=document.createElement("input");n.value=a,document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n)}return!0}catch{return!1}},N=async()=>{const n=await h();i("https://www.instagram.com/"),window.alert(n?"Blog link copied. Paste it on Instagram.":"Instagram opened. Please copy the blog link manually.")},S=async()=>{const n=await h();window.alert(n?"Blog link copied.":"Unable to copy link.")};return t?e.jsxs(f,{title:r,children:[e.jsxs(_,{children:[e.jsx("title",{children:`${r} | XpertBid Blog`}),e.jsx("meta",{name:"description",content:g}),d&&e.jsx("link",{rel:"canonical",href:d}),t.meta_keywords&&e.jsx("meta",{name:"keywords",content:t.meta_keywords}),p&&e.jsx("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:p}})]}),e.jsxs("div",{className:"bg-white min-vh-100 pb-5",children:[l&&e.jsx("div",{className:"w-100 overflow-hidden",style:{minHeight:"400px",maxHeight:"600px"},children:e.jsx("img",{src:l,alt:r,className:"w-100 h-100",style:{objectFit:"cover",minHeight:"400px",maxHeight:"600px"}})}),e.jsx("div",{className:"container py-5 mt-4",children:e.jsx("div",{className:"row justify-content-center",children:e.jsxs("div",{className:"col-lg-8",children:[e.jsxs("div",{className:"mb-5",children:[e.jsxs(x,{href:route("blogs.index"),className:"text-primary text-decoration-none fw-bold small mb-3 d-inline-block",children:[e.jsx("i",{className:"fa-solid fa-arrow-left me-2"})," Back to Blogs"]}),e.jsx("h1",{className:"fw-bolder display-4 text-dark mb-3",children:r}),e.jsxs("p",{className:"text-muted border-bottom pb-3",children:["Published on ",y]})]}),e.jsx("div",{className:"blog-content fs-5 text-dark",style:{lineHeight:"1.8"},dangerouslySetInnerHTML:{__html:b}}),e.jsx("hr",{className:"my-5"}),e.jsxs("div",{className:"bg-light p-4 rounded-4 border shadow-sm",children:[e.jsx("h4",{className:"fw-bold mb-3 text-dark",children:"Share this article"}),e.jsxs("div",{className:"d-flex gap-3 blog-share-actions",children:[e.jsx("button",{type:"button",onClick:w,className:"btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",style:{width:"40px",height:"40px"},"aria-label":"Share on Facebook",children:e.jsx("i",{className:"fa-brands fa-facebook-f"})}),e.jsx("button",{type:"button",onClick:j,className:"btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",style:{width:"40px",height:"40px"},"aria-label":"Share on X",children:e.jsx("span",{className:"fw-bold",style:{fontSize:"15px",lineHeight:1},children:"X"})}),e.jsx("button",{type:"button",onClick:k,className:"btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",style:{width:"40px",height:"40px"},"aria-label":"Share on WhatsApp",children:e.jsx("i",{className:"fa-brands fa-whatsapp"})}),e.jsx("button",{type:"button",onClick:N,className:"btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",style:{width:"40px",height:"40px"},"aria-label":"Share on Instagram",children:e.jsx("i",{className:"fa-brands fa-instagram"})}),e.jsx("button",{type:"button",onClick:S,className:"btn blog-share-btn rounded-circle d-flex align-items-center justify-content-center",style:{width:"40px",height:"40px"},"aria-label":"Copy link",children:e.jsx("i",{className:"fa-solid fa-link"})})]})]})]})})})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                .blog-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 2rem 0;
                }
                .blog-content h2, .blog-content h3 {
                    font-weight: bold;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                }
                .blog-content p {
                    margin-bottom: 1.5rem;
                }
                .blog-content ul, .blog-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
                .blog-share-btn {
                    background: #23262F;
                    color: #fff;
                    border: 1px solid #23262F;
                    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                }
                .blog-share-btn:hover,
                .blog-share-btn:focus,
                .blog-share-btn:active {
                    background: #43ACE9 !important;
                    border-color: #43ACE9 !important;
                    color: #fff !important;
                    transform: translateY(-1px);
                }
                .blog-share-btn i,
                .blog-share-btn span {
                    color: inherit;
                }
            `}})]}):e.jsx(f,{title:"Blog Not Found",children:e.jsxs("div",{className:"container py-5 text-center",children:[e.jsx("h2",{children:"Blog not found or loading..."}),e.jsx(x,{href:route("blogs.index"),className:"btn btn-primary mt-3",children:"Back to Blogs"})]})})}export{$ as default};
