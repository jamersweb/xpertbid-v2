import{r as h,j as e,a as d,b as y}from"./app-lu7_VoJP.js";import{A as j}from"./AppLayout-B0xpL7z0.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";const k=i=>i?.youtube_video_id?`https://img.youtube.com/vi/${i.youtube_video_id}/hqdefault.jpg`:i?.image_url||"/assets/images/WebsiteBanner2.png",N=(i,t=null)=>i?`https://img.youtube.com/vi/${i}/hqdefault.jpg`:k(t),L=i=>{if(!i)return"";const t=new Date(i).getTime();if(!Number.isFinite(t))return"";const n=Math.max(0,Math.floor((Date.now()-t)/1e3));if(n<60)return"just now";const a=Math.floor(n/60);if(a<60)return`${a} minute${a===1?"":"s"} ago`;const r=Math.floor(a/60);if(r<24)return`${r} hour${r===1?"":"s"} ago`;const s=Math.floor(r/24);return`${s} day${s===1?"":"s"} ago`},S=i=>{if(!i)return"";const t=new Date(i);return Number.isNaN(t.getTime())?"":t.toLocaleString(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})};function $({activeSlug:i}){const{auth:t}=y().props,n=!!t?.user,a=()=>{if(i){if(!n){d.visit("/live-auctions?auth=register",{preserveScroll:!0,preserveState:!0});return}d.visit(route("product.show",i))}};return e.jsxs("button",{type:"button",className:`live-auctions-primary ${i?"":"is-disabled"}`,onClick:a,disabled:!i,children:[e.jsx("i",{className:"fa-solid fa-bolt"}),i?"Join Live Auction":"No Live Auction"]})}function M({session:i,activeAuction:t=null}){const[,n]=h.useState(0),a=String(i?.status||"").trim().toLowerCase(),r=String(t?.status||"").trim().toLowerCase(),s=a==="active"&&r==="active"?t?.slug:null,o=!!s,l=a==="soon",c=a==="closed",x=!o&&!l&&!c,m=N(i?.youtube_video_id,t),p=S(i?.scheduled_at),u=c?L(i?.closed_at||i?.updated_at):"",g=o?"Live auction is on":l?"Live auction coming soon":c?"Live auction closed":"No live auction right now",f=o?"Watch the stream, follow the active product, and place bids in real time.":l?p?`The next live auction is scheduled for ${p}.`:"The next live auction is being prepared. Check back soon.":c&&u?`This live auction closed ${u}.`:"Please check back later for the next live auction.";return h.useEffect(()=>{const v=()=>{d.reload({only:["session","liveAuctions","activeAuction"],preserveScroll:!0,preserveState:!0,showProgress:!1}),n(w=>w+1)},b=window.setInterval(v,2500);return()=>window.clearInterval(b)},[]),e.jsxs(j,{title:"Live Auctions | XpertBid",children:[e.jsx("main",{className:`live-auctions-page state-${a||"idle"}`,children:e.jsxs("section",{className:"live-auctions-hero",children:[e.jsxs("div",{className:"live-auctions-hero-copy",children:[e.jsxs("span",{className:`live-auctions-kicker ${o?"is-live":""}`,children:[e.jsx("i",{className:o?"fa-solid fa-circle":"fa-regular fa-circle"}),"Live Auction Room"]}),e.jsx("h1",{children:g}),e.jsx("p",{children:f}),e.jsxs("div",{className:"live-auctions-actions",children:[o?e.jsx($,{activeSlug:s}):null,l?e.jsx("span",{className:"live-auctions-pill",children:"Starting Soon"}):null,c&&u?e.jsxs("span",{className:"live-auctions-pill",children:["Closed ",u]}):null,x?e.jsx("span",{className:"live-auctions-pill",children:"Awaiting Schedule"}):null]})]}),e.jsx("div",{className:"live-auctions-feature",children:o||l?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:m,alt:t?.title||"Live auction"}),e.jsxs("div",{className:"live-auctions-feature-overlay",children:[e.jsx("span",{children:o?"Streaming Now":"Preview"}),e.jsx("i",{className:"fa-solid fa-play"})]})]}):e.jsxs("div",{className:"live-auctions-empty-feature",children:[e.jsx("i",{className:"fa-solid fa-tower-broadcast"}),e.jsx("span",{children:"No live stream right now"})]})})]})}),e.jsx("style",{children:`
                            .live-auctions-page {
                                   background:
                                          linear-gradient(180deg, rgba(67, 172, 233, 0.08) 0%, rgba(247, 248, 249, 0.96) 34%, #f7f8f9 100%);
                                   padding: 28px 0 30px;
                                   min-height: auto;
                            }
                            .live-auctions-hero {
                                   width: min(1200px, calc(100% - 32px));
                                   margin: 0 auto;
                            }
                            .live-auctions-hero {
                                   display: grid;
                                   grid-template-columns: minmax(0, 1fr) minmax(360px, 0.82fr);
                                   gap: 28px;
                                   align-items: stretch;
                                   background: rgba(255, 255, 255, 0.9);
                                   border: 1px solid rgba(203, 213, 225, 0.8);
                                   border-radius: 26px;
                                   padding: 28px;
                                   box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
                                   backdrop-filter: blur(12px);
                            }
                            .live-auctions-hero-copy {
                                   min-height: 310px;
                                   display: flex;
                                   flex-direction: column;
                                   justify-content: center;
                            }
                            .live-auctions-kicker {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 9px;
                                   width: max-content;
                                   color: #64748b;
                                   font-weight: 900;
                                   font-size: 12px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.08em;
                                   margin-bottom: 14px;
                            }
                            .live-auctions-kicker.is-live {
                                   color: #dc2626;
                            }
                            .live-auctions-kicker i {
                                   font-size: 8px;
                            }
                            .live-auctions-kicker.is-live i {
                                   filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.55));
                            }
                            .live-auctions-hero h1 {
                                   max-width: 620px;
                                   font-size: clamp(36px, 5vw, 68px);
                                   line-height: 0.94;
                                   color: #0f172a;
                                   font-weight: 950;
                                   margin: 0 0 18px;
                                   letter-spacing: 0;
                            }
                            .live-auctions-hero p {
                                   color: #52637a;
                                   font-size: 17px;
                                   line-height: 1.7;
                                   max-width: 650px;
                                   margin: 0;
                            }
                            .live-auctions-actions {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   margin-top: 26px;
                            }
                            .live-auctions-primary,
                            .live-auctions-pill {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 9px;
                                   min-height: 50px;
                                   padding: 0 22px;
                                   border-radius: 14px;
                                   font-weight: 900;
                                   text-decoration: none;
                                   border: none;
                            }
                            .live-auctions-primary {
                                   background: #111827;
                                   color: #ffffff;
                                   cursor: pointer;
                                   box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
                                   transition: transform 0.2s ease, box-shadow 0.2s ease;
                            }
                            .live-auctions-primary:hover:not(:disabled) {
                                   transform: translateY(-2px);
                                   box-shadow: 0 18px 38px rgba(15, 23, 42, 0.22);
                            }
                            .live-auctions-primary.is-disabled {
                                   background: #94a3b8;
                                   cursor: not-allowed;
                            }
                            .live-auctions-pill {
                                   background: #eaf6fd;
                                   color: #0369a1;
                            }
                            .live-auctions-feature {
                                   min-height: 310px;
                                   border-radius: 20px;
                                   overflow: hidden;
                                   position: relative;
                                   background: #111827;
                                   box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
                            }
                            .live-auctions-feature img {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                            }
                            .live-auctions-feature-overlay {
                                   position: absolute;
                                   inset: auto 18px 18px 18px;
                                   min-height: 58px;
                                   border-radius: 16px;
                                   background: rgba(15, 23, 42, 0.78);
                                   color: #fff;
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   padding: 0 16px;
                                   font-weight: 900;
                                   backdrop-filter: blur(8px);
                            }
                            .live-auctions-feature-overlay i {
                                   width: 40px;
                                   height: 40px;
                                   border-radius: 50%;
                                   background: #43ace9;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                            }
                            .live-auctions-empty-feature {
                                   min-height: 310px;
                                   display: flex;
                                   flex-direction: column;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 12px;
                                   text-align: center;
                                   background:
                                          linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 59, 0.96)),
                                          radial-gradient(circle at 50% 30%, rgba(67, 172, 233, 0.22), transparent 34%);
                                   color: #ffffff;
                                   font-weight: 900;
                            }
                            .live-auctions-empty-feature i {
                                   font-size: 44px;
                                   color: #43ace9;
                            }
                            @media (max-width: 991px) {
                                   .live-auctions-hero {
                                          grid-template-columns: 1fr;
                                   }
                            }
                            @media (max-width: 640px) {
                                   .live-auctions-page {
                                          padding-top: 16px;
                                          padding-bottom: 22px;
                                   }
                                   .live-auctions-hero {
                                          width: min(100% - 20px, 1200px);
                                   }
                                   .live-auctions-hero {
                                          padding: 18px;
                                          border-radius: 20px;
                                   }
                                   .live-auctions-hero-copy {
                                          min-height: auto;
                                   }
                                   .live-auctions-feature {
                                          min-height: 230px;
                                   }
                            }
                     `})]})}export{M as default};
