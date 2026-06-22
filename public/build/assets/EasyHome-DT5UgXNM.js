import{r as c,j as e,H as B,L as u}from"./app-lu7_VoJP.js";import{A as S}from"./AppLayout-B0xpL7z0.js";import{C as E}from"./ContactForm-DPswcREt.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";import"./ErrorPopup-BKA8qaEq.js";const m=[{key:"buyer",title:"XpertBid Easy Buyer",subtitle:"Move into a verified property with a flexible ownership path.",image:"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600",maxFinanceRatio:.75,tenureLabel:"3 to 25 years",rate:13.5,bullets:["Ideal for ready properties and listed homes","Guided installment planning for salaried and business buyers","Best for customers who want predictable monthly payments"]},{key:"builder",title:"XpertBid Easy Builder",subtitle:"Buy land and build step by step with a structured timeline.",image:"https://images.pexels.com/photos/1105754/pexels-photo-1105754.jpeg?auto=compress&cs=tinysrgb&w=1600",maxFinanceRatio:.7,tenureLabel:"2 to 25 years",rate:13.25,bullets:["For plot purchase plus construction support","Useful for self-build and family home planning","Great for long-horizon property owners"]},{key:"renovate",title:"XpertBid Easy Renovate",subtitle:"Upgrade your current home with a budget-friendly plan.",image:"https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1600",maxFinanceRatio:.3,tenureLabel:"2 to 15 years",rate:14.25,bullets:["Perfect for repair, refurbishment, and extension work","Shorter tenure with practical monthly commitments","Supports value-adding home improvement projects"]},{key:"replace",title:"XpertBid Easy Replace",subtitle:"Shift your existing property finance into a cleaner structure.",image:"https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600",maxFinanceRatio:.75,tenureLabel:"3 to 25 years",rate:13.35,bullets:["Designed for existing mortgage/finance transfer cases","Ideal when customers want better structure or service","Keeps the plan organized under one clear ownership path"]},{key:"enhancement",title:"XpertBid Easy Enhancement",subtitle:"Add extra financing against an existing property facility.",image:"https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg?auto=compress&cs=tinysrgb&w=1600",maxFinanceRatio:.65,tenureLabel:"Up to remaining tenure",rate:13.6,bullets:["Useful for customers who already have an active facility","Can help with renovation or value-add upgrades","Keeps the property journey in one ecosystem"]}],F=[{icon:"fa-shield-heart",title:"XpertBid-first confidence",text:"A polished property-financing experience aligned with trust, verified inventory, and clear ownership guidance."},{icon:"fa-hand-holding-dollar",title:"Flexible ownership planning",text:"Choose a path that suits your budget, whether you are buying a ready unit, building, renovating, or switching plans."},{icon:"fa-chart-line",title:"Transparent monthly view",text:"See an estimate before you proceed so users understand the shape of the payment journey early."}],X=[{step:"01",title:"Pick your plan",text:"Select the path that fits your property goal: buy, build, renovate, replace, or enhance."},{step:"02",title:"Estimate your budget",text:"Use the live calculator to see the approximate monthly commitment and financing share."},{step:"03",title:"Submit your interest",text:"Share your details so the team can contact you with the right property and financing path."},{step:"04",title:"Move with clarity",text:"Proceed with a guided process that keeps the property journey simple and well-structured."}],z=[{title:"Who can explore it",items:["Pakistani residents and non-residents","Salaried professionals and business owners","Buyers looking for verified property options"]},{title:"What we usually review",items:["Income profile and repayment comfort","Property value and expected financing share","Basic documents and contact details"]},{title:"Best use cases",items:["Purchase of a ready home or apartment","Construction on owned land","Renovation or improvement projects"]}],b=["https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1600"],h=new Intl.NumberFormat("en-PK",{style:"currency",currency:"PKR",maximumFractionDigits:0});function s({eyebrow:t,title:d,description:r,centered:n=!1}){return e.jsxs("div",{className:`${n?"text-center":""} mb-4 mb-lg-5`,children:[t&&e.jsx("div",{className:"text-uppercase fw-bold text-primary small mb-2",children:t}),e.jsx("h2",{className:"fw-black text-gray-900 mb-3",style:{fontSize:"clamp(1.7rem, 2.6vw, 3rem)"},children:d}),r&&e.jsx("p",{className:"text-secondary mb-0",style:{maxWidth:n?"760px":"720px",margin:n?"0 auto":"0"},children:r})]})}function U(){const[t,d]=c.useState("buyer"),[r,n]=c.useState(25e6),[x,f]=c.useState(5e6),[g,y]=c.useState(15),l=m.find(a=>a.key===t)||m[0],o=c.useMemo(()=>{const a=Number(r)||0,i=Math.min(Number(x)||0,a),p=Math.max(a-i,0),v=l.rate/100/12,w=Math.max(Number(g)||1,1)*12,N=p/w,k=p*v,P=Math.max(Math.round(N+k),0);return{financedAmount:p,selectedDownPayment:i,selectedPropertyValue:a,estimatedMonthly:P,financingShare:a>0?Math.round(p/a*100):0}},[l.rate,x,r,g]),j=[{value:"5",label:"property paths"},{value:"75%",label:"maximum financing ratio"},{value:"24/7",label:"guided inquiry window"}];return e.jsxs(S,{children:[e.jsxs("div",{className:"easy-home-page",children:[e.jsx(B,{title:"XpertBid Easy Home",children:e.jsx("meta",{name:"description",content:"XpertBid Easy Home is a branded property-financing guide with flexible plans, a live estimator, and verified project support."})}),e.jsx("section",{className:"hero-section",children:e.jsx("div",{className:"container py-5 py-lg-6",children:e.jsxs("div",{className:"row align-items-center g-4 g-lg-5",children:[e.jsxs("div",{className:"col-lg-6",children:[e.jsxs("div",{className:"d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 mb-4 hero-chip",children:[e.jsx("i",{className:"fa-solid fa-house-chimney text-primary"}),e.jsx("span",{children:"XpertBid Easy Home"})]}),e.jsx("h1",{className:"display-5 fw-black text-white mb-3",children:"A premium, XpertBid-branded path to property ownership."}),e.jsx("p",{className:"lead text-white-75 mb-4",children:"Easy Home brings a clean, modern property-financing experience to XpertBid - with guided plans for buying, building, renovating, replacing, and enhancing a home."}),e.jsxs("div",{className:"d-flex flex-wrap gap-3 mb-4",children:[e.jsx("a",{href:"#calculator",className:"btn home-pill-btn home-pill-btn-primary btn-lg px-4 fw-bold",children:"Estimate Monthly Payment"}),e.jsx("a",{href:"#contact",className:"btn home-pill-btn home-pill-btn-outline btn-lg px-4 fw-bold",children:"Talk to XpertBid Team"})]}),e.jsx("div",{className:"row g-3",children:j.map(a=>e.jsx("div",{className:"col-12 col-sm-4",children:e.jsxs("div",{className:"hero-stat-card h-100",children:[e.jsx("div",{className:"hero-stat-value",children:a.value}),e.jsx("div",{className:"hero-stat-label",children:a.label})]})},a.label))})]}),e.jsx("div",{className:"col-lg-6",children:e.jsxs("div",{className:"hero-gallery",children:[e.jsx("img",{src:b[0],alt:"XpertBid Easy Home hero property",className:"hero-main-image"}),e.jsxs("div",{className:"hero-image-stack",children:[e.jsx("img",{src:b[1],alt:"Modern interior property",className:"hero-stack-image"}),e.jsx("img",{src:b[2],alt:"Residential property exterior",className:"hero-stack-image"})]})]})})]})})}),e.jsx("section",{className:"section-pad",children:e.jsxs("div",{className:"container",children:[e.jsx(s,{eyebrow:"Why XpertBid Easy Home",title:"Designed to feel premium, transparent, and easy to understand.",description:"The structure mirrors the clarity of a leading bank product page, but the content, brand language, and look are fully tailored to XpertBid."}),e.jsx("div",{className:"row g-4",children:F.map(a=>e.jsx("div",{className:"col-md-4",children:e.jsxs("div",{className:"benefit-card h-100",children:[e.jsx("div",{className:"benefit-icon",children:e.jsx("i",{className:`fa-solid ${a.icon}`})}),e.jsx("h3",{className:"h5 fw-bold text-gray-900 mt-4",children:a.title}),e.jsx("p",{className:"text-secondary mb-0",children:a.text})]})},a.title))})]})}),e.jsx("section",{className:"section-pad section-dark",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row align-items-center g-4 g-lg-5",children:[e.jsxs("div",{className:"col-lg-6",children:[e.jsx(s,{eyebrow:"Strategic spotlight",title:"Verified communities, smarter discovery, and guided property support.",description:"XpertBid Easy Home can be positioned around partner communities, curated listings, and a cleaner journey from interest to enquiry."}),e.jsxs("div",{className:"spotlight-list",children:[e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-circle-check text-primary me-2"}),"Partner project showcases with modern visuals"]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-circle-check text-primary me-2"}),"Clear property details and eligibility guidance"]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-circle-check text-primary me-2"}),"Simple call-to-action flow for enquiries"]})]}),e.jsxs("div",{className:"d-flex flex-wrap gap-3 mt-4",children:[e.jsx("a",{href:"#plans",className:"btn home-pill-btn home-pill-btn-primary px-4 fw-bold",children:"See Plans"}),e.jsx(u,{href:"/contact",className:"btn home-pill-btn home-pill-btn-outline px-4 fw-bold",children:"Contact Page"})]})]}),e.jsx("div",{className:"col-lg-6",children:e.jsxs("div",{className:"spotlight-card",children:[e.jsx("div",{className:"spotlight-image",style:{backgroundImage:"linear-gradient(180deg, rgba(15,17,23,0.08), rgba(15,17,23,0.3)), url(https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600)"},role:"img","aria-label":"Partner community property"}),e.jsxs("div",{className:"spotlight-overlay",children:[e.jsx("div",{className:"spotlight-badge",children:"Featured community"}),e.jsx("h3",{className:"h4 fw-bold mb-2",children:"Modern homes with premium presentation"}),e.jsx("p",{className:"mb-0 text-white-75",children:"Dummy image content is used here to keep the design visually rich on both desktop and mobile."})]})]})})]})})}),e.jsx("section",{id:"plans",className:"section-pad",children:e.jsxs("div",{className:"container",children:[e.jsx(s,{eyebrow:"Financing paths",title:"Five clear plans, each with a distinct purpose.",description:"These cards give the page the same product-brochure feel as the reference page, but with XpertBid language and property-first positioning.",centered:!0}),e.jsx("div",{className:"row g-4",children:m.map(a=>e.jsx("div",{className:"col-lg-6",children:e.jsxs("div",{className:`plan-card h-100 ${t===a.key?"plan-card-active":""}`,children:[e.jsxs("div",{className:"plan-image-wrap",style:{backgroundImage:`linear-gradient(180deg, rgba(15,17,23,0.10), rgba(15,17,23,0.30)), url(${a.image})`},role:"img","aria-label":a.title,children:[e.jsx("span",{className:"plan-image-pill",children:"XpertBid Property"}),e.jsx("span",{className:"plan-image-title",children:a.title})]}),e.jsxs("div",{className:"plan-body",children:[e.jsxs("div",{className:"d-flex align-items-start justify-content-between gap-3 mb-3",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"text-uppercase text-primary small fw-bold mb-1",children:["Plan ",a.key.toUpperCase()]}),e.jsx("h3",{className:"h4 fw-black text-gray-900 mb-2",children:a.title}),e.jsx("p",{className:"text-secondary mb-0",children:a.subtitle})]}),e.jsx("button",{type:"button",className:`btn home-toggle-btn px-3 fw-bold ${t===a.key?"btn-dark":"btn-outline-dark"}`,onClick:()=>d(a.key),children:t===a.key?"Selected":"Select"})]}),e.jsxs("div",{className:"plan-meta",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Financing ratio"}),e.jsxs("strong",{children:["Up to ",(a.maxFinanceRatio*100).toFixed(0),"%"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Tenure"}),e.jsx("strong",{children:a.tenureLabel})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Sample annual rate"}),e.jsxs("strong",{children:[a.rate.toFixed(2),"%"]})]})]}),e.jsx("ul",{className:"plan-bullets",children:a.bullets.map(i=>e.jsxs("li",{children:[e.jsx("i",{className:"fa-solid fa-check text-primary me-2"}),i]},i))})]})]})},a.key))})]})}),e.jsx("section",{id:"calculator",className:"section-pad section-soft",children:e.jsxs("div",{className:"container",children:[e.jsx(s,{eyebrow:"Payment estimator",title:"A simple calculator for the first conversation.",description:"This is an estimate-only tool that helps users understand the shape of the monthly commitment before they enquire."}),e.jsxs("div",{className:"row align-items-stretch g-4 g-lg-5",children:[e.jsx("div",{className:"col-lg-6 d-flex",children:e.jsxs("div",{className:"calculator-card h-100 w-100",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"form-label fw-semibold text-gray-900",children:"Property value"}),e.jsx("input",{type:"number",min:"0",value:r,onChange:a=>n(Number(a.target.value)),className:"form-control form-control-lg rounded-4"})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"form-label fw-semibold text-gray-900",children:"Down payment"}),e.jsx("input",{type:"number",min:"0",value:x,onChange:a=>f(Number(a.target.value)),className:"form-control form-control-lg rounded-4"})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"form-label fw-semibold text-gray-900",children:"Tenure (years)"}),e.jsx("select",{className:"form-select form-select-lg rounded-4",value:g,onChange:a=>y(Number(a.target.value)),children:[5,10,15,20,25].map(a=>e.jsxs("option",{value:a,children:[a," years"]},a))})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label fw-semibold text-gray-900",children:"Current plan"}),e.jsx("div",{className:"d-flex flex-wrap gap-2",children:m.map(a=>e.jsx("button",{type:"button",className:`btn home-toggle-btn px-3 ${t===a.key?"btn-dark":"btn-outline-dark"}`,onClick:()=>d(a.key),children:a.title},a.key))})]})]})}),e.jsx("div",{className:"col-lg-6 d-flex",children:e.jsxs("div",{className:"estimate-card h-100 w-100",children:[e.jsxs("div",{className:"estimate-header",children:[e.jsx("div",{className:"text-uppercase small fw-bold text-primary",children:"Estimated summary"}),e.jsx("h3",{className:"h4 fw-black text-white mb-0",children:l.title})]}),e.jsxs("div",{className:"estimate-grid",children:[e.jsxs("div",{className:"estimate-item",children:[e.jsx("span",{children:"Property value"}),e.jsx("strong",{children:h.format(o.selectedPropertyValue)})]}),e.jsxs("div",{className:"estimate-item",children:[e.jsx("span",{children:"Down payment"}),e.jsx("strong",{children:h.format(o.selectedDownPayment)})]}),e.jsxs("div",{className:"estimate-item",children:[e.jsx("span",{children:"Financed amount"}),e.jsx("strong",{children:h.format(o.financedAmount)})]}),e.jsxs("div",{className:"estimate-item",children:[e.jsx("span",{children:"Financing share"}),e.jsxs("strong",{children:[o.financingShare,"%"]})]})]}),e.jsxs("div",{className:"estimate-monthly",children:[e.jsx("div",{className:"small text-white-75 mb-1",children:"Estimated monthly payment"}),e.jsx("div",{className:"display-6 fw-black text-white mb-1",children:h.format(o.estimatedMonthly)}),e.jsx("div",{className:"text-white-75",children:"Based on the selected plan and a simple estimate model."})]}),e.jsxs("div",{className:"estimate-footer",children:[e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-clock text-primary me-2"}),"Tenure guide: ",l.tenureLabel]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-percent text-primary me-2"}),"Sample annual rate: ",l.rate.toFixed(2),"%"]})]})]})})]})]})}),e.jsx("section",{className:"section-pad",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row align-items-center g-4 g-lg-5",children:[e.jsx("div",{className:"col-lg-6",children:e.jsx("img",{src:"https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1600&q=80",alt:"Modern house exterior",className:"img-fluid rounded-5 shadow-lg w-100",style:{minHeight:"420px",objectFit:"cover"}})}),e.jsxs("div",{className:"col-lg-6",children:[e.jsx(s,{eyebrow:"Eligibility guide",title:"A straightforward checklist for the first review.",description:"This section gives the page the same helpful, trust-building rhythm as the Meezan page while staying aligned with XpertBid."}),e.jsx("div",{className:"row g-3",children:z.map(a=>e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"eligibility-card",children:[e.jsx("h3",{className:"h5 fw-bold text-gray-900 mb-3",children:a.title}),e.jsx("ul",{className:"eligibility-list mb-0",children:a.items.map(i=>e.jsxs("li",{children:[e.jsx("i",{className:"fa-solid fa-circle-check text-primary me-2"}),e.jsx("span",{children:i})]},i))})]})},a.title))})]})]})})}),e.jsx("section",{className:"section-pad section-dark",children:e.jsxs("div",{className:"container",children:[e.jsx(s,{eyebrow:"How it works",title:"A clean four-step journey.",description:"Simple, transparent, and easy to follow — the same kind of flow users expect from a premium financing page.",centered:!0}),e.jsx("div",{className:"row g-4",children:X.map(a=>e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsxs("div",{className:"step-card h-100",children:[e.jsx("div",{className:"step-number",children:a.step}),e.jsx("h3",{className:"h5 fw-bold text-white mt-3",children:a.title}),e.jsx("p",{className:"text-white-75 mb-0",children:a.text})]})},a.step))})]})}),e.jsx("section",{id:"contact",className:"section-pad section-soft",children:e.jsxs("div",{className:"container",children:[e.jsx(s,{eyebrow:"Get in touch",title:"Let’s shape the right property path for you.",description:"We can keep the contact area lightweight and still give users a professional next step for enquiry.",centered:!0}),e.jsx("div",{className:"contact-cta-card mb-4",children:e.jsxs("div",{className:"row align-items-center g-4",children:[e.jsxs("div",{className:"col-lg-7",children:[e.jsx("h3",{className:"h3 fw-black text-white mb-3",children:"Need a guided home ownership discussion?"}),e.jsx("p",{className:"text-white-75 mb-4",children:"Use XpertBid Easy Home as a polished content page for property enquiries, partner project discovery, and financing guidance."}),e.jsxs("div",{className:"d-flex flex-wrap gap-3",children:[e.jsx(u,{href:"/contact",className:"btn home-pill-btn home-pill-btn-primary px-4 fw-bold",children:"Open Contact Page"}),e.jsx("a",{href:"mailto:support@xpertbid.com",className:"btn home-pill-btn home-pill-btn-outline px-4 fw-bold",children:"Email Support"})]})]}),e.jsx("div",{className:"col-lg-5",children:e.jsxs("div",{className:"contact-mini-list",children:[e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-envelope text-primary me-2"}),"support@xpertbid.com"]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-phone text-primary me-2"}),"+92 302 2113202"]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-location-dot text-primary me-2"}),"Pakistan | Dubai | Remote assistance"]})]})})]})}),e.jsx("div",{className:"container",children:e.jsx("div",{className:"bg-white rounded-5 shadow-lg p-3 p-lg-4",children:e.jsx(E,{})})})]})})]}),e.jsx("style",{children:`
                            .easy-home-page {
                                   background: #f6f8fc;
                            }

                            .hero-section {
                                   background:
                                          radial-gradient(circle at top left, rgba(67, 172, 233, 0.18), transparent 30%),
                                          linear-gradient(135deg, #090b10 0%, #111520 50%, #1f2733 100%);
                            }

                            .hero-chip {
                                   background: rgba(255, 255, 255, 0.10);
                                   color: #fff;
                                   border: 1px solid rgba(255, 255, 255, 0.12);
                                   backdrop-filter: blur(12px);
                                   border-radius: 999px;
                            }

                            .hero-stat-card {
                                   background: rgba(255, 255, 255, 0.08);
                                   border: 1px solid rgba(255, 255, 255, 0.12);
                                   border-radius: 20px;
                                   padding: 16px;
                                   color: #fff;
                                   backdrop-filter: blur(12px);
                            }

                            .hero-stat-value {
                                   font-size: 1.7rem;
                                   font-weight: 900;
                                   line-height: 1;
                            }

                            .hero-stat-label {
                                   font-size: 0.82rem;
                                   opacity: 0.78;
                                   margin-top: 6px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.06em;
                            }

                            .hero-gallery {
                                   display: grid;
                                   grid-template-columns: 1.2fr 0.8fr;
                                   gap: 16px;
                                   align-items: stretch;
                            }

                            .hero-main-image,
                            .hero-stack-image,
                            .plan-image-wrap,
                            .spotlight-image {
                                   width: 100%;
                                   display: block;
                                   background-size: cover;
                                   background-position: center;
                                   background-repeat: no-repeat;
                            }

                            .hero-main-image {
                                   height: 100%;
                                   min-height: 520px;
                                   border-radius: 36px;
                                   box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
                            }

                            .hero-image-stack {
                                   display: grid;
                                   gap: 16px;
                            }

                            .hero-stack-image {
                                   height: calc(50% - 8px);
                                   min-height: 252px;
                                   border-radius: 32px;
                                   box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
                            }

                            .plan-image-wrap {
                                   height: 280px;
                                   position: relative;
                                   background-color: #dbe6f2;
                                   border-radius: 36px 36px 24px 24px;
                                   overflow: hidden;
                                   border-bottom: 1px solid #edf2f7;
                            }

                            .plan-image-title {
                                   position: absolute;
                                   left: 20px;
                                   bottom: 18px;
                                   color: #fff;
                                   font-size: 1.25rem;
                                   font-weight: 900;
                                   line-height: 1.1;
                                   max-width: calc(100% - 40px);
                                   text-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
                            }

                            .plan-image-pill {
                                   position: absolute;
                                   left: 20px;
                                   top: 20px;
                                   border-radius: 999px;
                                   background: rgba(9, 11, 16, 0.72);
                                   color: #fff;
                                   padding: 6px 12px;
                                   font-size: 12px;
                                   font-weight: 700;
                                   letter-spacing: 0.02em;
                                   backdrop-filter: blur(8px);
                            }

                            .section-pad {
                                   padding: 90px 0;
                            }

                            .section-soft {
                                   background: linear-gradient(180deg, #f6f8fc 0%, #eef3f9 100%);
                            }

                            .section-dark {
                                   background: #171a23;
                            }

                            .section-dark .text-gray-900,
                            .section-dark h2,
                            .section-dark h3,
                            .section-dark h4,
                            .section-dark h5,
                            .section-dark p {
                                   color: #fff !important;
                            }

                            .section-dark .text-secondary {
                                   color: rgba(255, 255, 255, 0.72) !important;
                            }

                            .benefit-card,
                            .calculator-card,
                            .eligibility-card,
                            .contact-cta-card,
                            .step-card,
                            .plan-card,
                            .spotlight-card,
                            .estimate-card {
                                   border-radius: 36px;
                                   overflow: hidden;
                                   box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
                            }

                            .benefit-card,
                            .calculator-card,
                            .eligibility-card {
                                   background: #fff;
                                   padding: 30px;
                            }

                            .benefit-icon {
                                   width: 60px;
                                   height: 60px;
                                   border-radius: 18px;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   background: rgba(67, 172, 233, 0.12);
                                   color: #43ace9;
                                   font-size: 24px;
                            }

                            .spotlight-card {
                                   position: relative;
                                   min-height: 520px;
                                   background: #000;
                            }

                            .spotlight-image {
                                   height: 100%;
                                   min-height: 520px;
                                   opacity: 0.9;
                            }

                            .spotlight-overlay {
                                   position: absolute;
                                   inset: auto 24px 24px 24px;
                                   background: rgba(23, 26, 35, 0.88);
                                   color: #fff;
                                   padding: 24px;
                                   border-radius: 22px;
                                   backdrop-filter: blur(10px);
                            }

                            .spotlight-badge {
                                   display: inline-flex;
                                   align-items: center;
                                   border-radius: 999px;
                                   background: rgba(67, 172, 233, 0.14);
                                   color: #fff;
                                   padding: 6px 12px;
                                   font-size: 12px;
                                   font-weight: 700;
                                   margin-bottom: 12px;
                            }

                            .plan-card {
                                   background: #fff;
                                   border: 1px solid #e8edf4;
                                   border-radius: 36px;
                                   transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                            }

                            .plan-card:hover,
                            .plan-card-active {
                                   transform: translateY(-4px);
                                   border-color: #43ace9;
                                   box-shadow: 0 24px 70px rgba(67, 172, 233, 0.12);
                            }

                            .plan-body {
                                   padding: 26px;
                            }

                            .plan-meta {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 12px;
                                   background: #f7fafc;
                                   border-radius: 18px;
                                   padding: 16px;
                                   margin-bottom: 18px;
                            }

                            .plan-meta span {
                                   display: block;
                                   font-size: 12px;
                                   color: #64748b;
                                   text-transform: uppercase;
                                   letter-spacing: 0.05em;
                                   margin-bottom: 4px;
                            }

                            .plan-meta strong {
                                   color: #0f172a;
                                   font-size: 14px;
                            }

                            .plan-bullets {
                                   list-style: none;
                                   padding: 0;
                                   margin: 0;
                                   display: grid;
                                   gap: 10px;
                            }

                            .plan-bullets li {
                                   color: #334155;
                                   display: flex;
                                   align-items: flex-start;
                            }

                            .calculator-card {
                                   background: #fff;
                            }

                            .estimate-card {
                                   background: linear-gradient(180deg, #0f1117 0%, #171a23 100%);
                                   color: #fff;
                                   padding: 32px;
                                   border-radius: 36px;
                            }

                            .estimate-header {
                                   border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                                   padding-bottom: 18px;
                                   margin-bottom: 18px;
                            }

                            .estimate-grid {
                                   display: grid;
                                   grid-template-columns: repeat(2, minmax(0, 1fr));
                                   gap: 14px;
                            }

                            .estimate-item {
                                   background: rgba(255, 255, 255, 0.07);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   border-radius: 18px;
                                   padding: 16px;
                            }

                            .estimate-item span {
                                   display: block;
                                   font-size: 12px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.05em;
                                   opacity: 0.72;
                                   margin-bottom: 6px;
                            }

                            .estimate-item strong {
                                   font-size: 18px;
                                   font-weight: 800;
                            }

                            .estimate-monthly {
                                   margin-top: 20px;
                                   padding: 24px;
                                   border-radius: 22px;
                                   background: rgba(67, 172, 233, 0.12);
                                   border: 1px solid rgba(67, 172, 233, 0.20);
                            }

                            .estimate-footer {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px 24px;
                                   margin-top: 18px;
                                   color: rgba(255, 255, 255, 0.82);
                            }

                            .eligibility-list {
                                   list-style: none;
                                   padding: 0;
                                   margin: 0;
                                   display: grid;
                                   gap: 10px;
                            }

                            .eligibility-list li {
                                   color: #334155;
                            }

                            .step-card {
                                   background: rgba(255, 255, 255, 0.04);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   padding: 28px;
                            }

                            .step-number {
                                   width: 54px;
                                   height: 54px;
                                   border-radius: 16px;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   background: rgba(67, 172, 233, 0.14);
                                   color: #43ace9;
                                   font-size: 18px;
                                   font-weight: 900;
                            }

                            .contact-cta-card {
                                   background: linear-gradient(135deg, #23262f 0%, #0f1117 100%);
                                   padding: 34px;
                                   color: #fff;
                                   margin-bottom: 28px;
                                   border-radius: 36px;
                            }

                            .home-pill-btn {
                                   border-radius: 12px !important;
                                   padding-top: 0.95rem;
                                   padding-bottom: 0.95rem;
                                   border-width: 2px;
                            }

                            .home-toggle-btn {
                                   border-radius: 12px !important;
                                   min-width: 92px;
                                   padding-top: 0.75rem;
                                   padding-bottom: 0.75rem;
                            }

                            .home-pill-btn-primary {
                                   background: #43ace9 !important;
                                   border-color: #43ace9 !important;
                                   color: #fff !important;
                                   box-shadow: 0 16px 32px rgba(67, 172, 233, 0.28);
                            }

                            .home-pill-btn-primary:hover {
                                   background: #2e96d4 !important;
                                   border-color: #2e96d4 !important;
                                   color: #fff !important;
                            }

                            .home-pill-btn-outline {
                                   border-color: rgba(255, 255, 255, 0.85) !important;
                                   color: #fff !important;
                                   background: transparent !important;
                            }

                            .home-pill-btn-outline:hover {
                                   background: rgba(255, 255, 255, 0.10) !important;
                                   color: #fff !important;
                            }

                            .contact-mini-list {
                                   display: grid;
                                   gap: 14px;
                                   background: rgba(255, 255, 255, 0.06);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   border-radius: 22px;
                                   padding: 22px;
                            }

                            .fw-black {
                                   font-weight: 900;
                            }

                            .text-white-75 {
                                   color: rgba(255, 255, 255, 0.75);
                            }

                            @media (max-width: 991.98px) {
                                   .hero-gallery {
                                          grid-template-columns: 1fr;
                                   }

                                   .hero-main-image,
                                   .spotlight-card,
                                   .spotlight-image {
                                          min-height: 360px;
                                   }

                                   .hero-stack-image {
                                          min-height: 180px;
                                          height: 180px;
                                   }

                                   .section-pad {
                                          padding: 72px 0;
                                   }
                            }

                            @media (max-width: 767.98px) {
                                   .hero-section .display-5 {
                                          font-size: clamp(2rem, 10vw, 2.75rem);
                                   }

                                   .hero-stat-card {
                                          padding: 14px 16px;
                                   }

                                   .hero-stat-value {
                                          font-size: 1.35rem;
                                   }

                                   .hero-stat-label {
                                          font-size: 0.72rem;
                                   }

                                   .plan-meta,
                                   .estimate-grid {
                                          grid-template-columns: 1fr;
                                   }

                                   .contact-cta-card {
                                          padding: 24px;
                                   }

                                   .hero-main-image,
                                   .spotlight-card,
                                   .spotlight-image {
                                          min-height: 240px;
                                   }

                                   .hero-stack-image {
                                          min-height: 150px;
                                          height: 150px;
                                   }
                            }
                     `})]})}export{U as default};
