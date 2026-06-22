import{j as e,a as o}from"./app-lu7_VoJP.js";import{A as c}from"./AppLayout-B0xpL7z0.js";import{A as m}from"./AuctionCard-CmchA6tH.js";import{u as p}from"./useSessionKeepAlive-Bkv9Dn-d.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./CountdownTimer-BfR-Y7Nz.js";import"./FavoriteToggleButton-BWzLqp6w.js";import"./listingPricing-CBcHwZ3i.js";const x=({tabs:n,activeTab:s,onTabChange:t})=>e.jsx("ul",{className:"nav nav-tabs bid-tabs-child",role:"tablist",children:n.map(i=>e.jsx("li",{className:"nav-item flex-grow-1 bid-tabs-anchor",role:"presentation",children:e.jsx("button",{className:`nav-link w-100 ${s===i.id?"active":""}`,onClick:()=>t(i.id),type:"button",role:"tab",children:i.label})},i.id))});function S({auctions:n,activeTab:s}){const{t}=p(),i=[{id:"active",label:t("Active Bids"),imageSrc:"/assets/images/active_bids.png"},{id:"won",label:t("Won Auctions"),imageSrc:"/assets/images/won_bids.png"},{id:"lost",label:t("Lost Auctions"),imageSrc:"/assets/images/lost_bids.png"}],l=a=>{o.get(route("bids.index"),{status:a},{preserveState:!0,replace:!0})},r=i.find(a=>a.id===s)||i[0];return e.jsxs(c,{title:t("My Bids"),children:[e.jsx("section",{className:"biddings-tabs py-5",children:e.jsxs("div",{className:"container",children:[e.jsx("div",{className:"mb-4",children:e.jsx(x,{tabs:i,activeTab:s,onTabChange:l})}),e.jsxs("div",{className:"tab-content mt-4",children:[e.jsx("div",{className:"row g-4",children:n.data.length>0?n.data.map(a=>e.jsx("div",{className:"col-12 col-md-6 col-lg-4",children:e.jsx(m,{auction:a,activeTab:s})},a.id)):e.jsxs("div",{className:"col-12 py-5 d-flex flex-column align-items-center justify-content-center",style:{minHeight:"300px"},children:[r.imageSrc&&e.jsx("img",{src:r.imageSrc,alt:r.id,className:"mb-3",style:{maxWidth:"180px"}}),e.jsxs("p",{style:{color:"#777E91",fontSize:"16px",fontWeight:"500",textAlign:"center"},children:[s==="active"&&t("You have no active bids yet."),s==="won"&&t("You haven't won any auctions yet."),s==="lost"&&t("You haven't lost any auctions yet.")]})]})}),n.links&&n.links.length>3&&e.jsx("div",{className:"d-flex justify-content-center mt-5",children:e.jsx("nav",{"aria-label":"Page navigation",children:e.jsx("ul",{className:"pagination",children:n.links.map((a,d)=>e.jsx("li",{className:`page-item ${a.active?"active":""} ${a.url?"":"disabled"}`,children:e.jsx("button",{className:"page-item",onClick:()=>a.url&&o.get(a.url),dangerouslySetInnerHTML:{__html:a.label},style:{padding:"8px 16px",border:"1px solid #dee2e6",background:a.active?"#000":"#fff",color:a.active?"#fff":"#000",cursor:a.url?"pointer":"default"}})},d))})})})]})]})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                            .bid-tabs-child {
                                   background-color: #F4F5F6;
                                   border-radius: 12px;
                                   padding: 8px;
                                   border: none !important;
                                   border-bottom: none !important;
                                   display: flex;
                                   gap: 0;
                            }
                            .bid-tabs-anchor .nav-link {
                                   border: none !important;
                                   background: transparent !important;
                                   color: #777E91;
                                   font-weight: 600;
                                   font-size: 16px;
                                   padding: 12px 20px;
                                   border-radius: 8px;
                                   transition: all 0.3s ease;
                            }
                            .bid-tabs-anchor .nav-link:hover {
                                   color: #23262F;
                            }
                            .bid-tabs-anchor .nav-link.active {
                                   background: #FFFFFF !important;
                                   color: #23262F !important;
                                   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                            }
                            @media (max-width: 576px) {
                                   .bid-tabs-child {
                                          flex-direction: column;
                                          padding: 16px;
                                          gap: 8px;
                                   }
                            }
                     `}})]})}export{S as default};
