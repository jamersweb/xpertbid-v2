import{b as se,r as n,j as e,a as C,c as te}from"./app-lu7_VoJP.js";import{P as x}from"./Price-YFt8wuGR.js";import{u as ie}from"./productUrl-COmlJyrp.js";import{i as ae}from"./listingPricing-CBcHwZ3i.js";function de({product:s,highestBidProp:l,onBidPlaced:p,winnerDetails:a,isFavoriteProp:r}){const{auth:o,flash:d}=se().props,{addToCart:b}=ie(),[c,y]=n.useState(""),[_,w]=n.useState(!1),[S,j]=n.useState(!1),[k,F]=n.useState(l||0),[N,I]=n.useState({show:!1,message:"",type:"success"}),[T,z]=n.useState(!1),[A,P]=n.useState(r||!1),[O,B]=n.useState(!1),u=String(s?.list_type||s?.listing_type||"").toLowerCase(),W=u==="auction"||u==="live_auction",R=u==="normal"||u==="normal_list"||u==="business"||u==="business_list",f=ae(s),D=s.minimum_bid||s.listing_data?.start_price||0,L=s.reserve_price||s.listing_data?.reserve_price||0,$=[s?.category_id,s?.category?.id,s?.sub_category_id,s?.subCategory?.id,s?.sub_category?.id,s?.child_category_id,s?.childCategory?.id,s?.child_category?.id].map(t=>String(t||"")),H=[s?.category?.name,s?.category_name,s?.subCategory?.name,s?.sub_category?.name,s?.childCategory?.name,s?.child_category?.name].map(t=>String(t||"").toLowerCase()),Y=$.some(t=>t==="222"||t==="311")||H.some(t=>t.includes("property")||t.includes("vehicle")),M=R&&Y,U=a?.[0]?.name||a?.name||s?.winner_details?.name||s?.winner_details?.[0]?.name||"the highest bidder",h=Number(s.buy_now_price||s.minimum_bid||0),v=Number(s.discount_value||0),E=R&&v>0,V=E?s.discount_type==="percent"?Math.max(0,h-h*(v/100)):s.discount_type==="flat"?Math.max(0,h-v):h:h;n.useEffect(()=>{d?.success&&i(d.success,"success"),d?.error&&i(d.error,"error")},[d]);const i=(t,m="success")=>{I({show:!0,message:t,type:m}),setTimeout(()=>{I({show:!1,message:"",type:"success"})},4e3)};n.useEffect(()=>{F(l)},[l]),n.useEffect(()=>{P(r)},[r]);const X=()=>{if(!o.user){i("Please login to add to favorites","error");return}B(!0),C.post(route("favorites.toggle"),{listing_id:s.id},{preserveScroll:!0,onSuccess:()=>{P(!A),B(!1)},onError:()=>{B(!1),i("Failed to update favorites","error")}})},g=o.user&&(o.user.id===s.user_id||o.user.id===s.owner_id||o.user.id===s.seller_id),Z=async()=>{if(f){i("This product is sold out","error");return}if(!o.user){i("Please login to place a bid","error");return}if(g){i("You cannot bid on your own product","error");return}if(!c||Number(c)<=k){i("Bid must be higher than the current highest bid","error");return}z(!0)},q=()=>{z(!1),w(!0),C.post("/bids",{listing_id:s.id,bid_amount:c,bid_source:"web"},{onSuccess:()=>{y(""),w(!1),p&&p()},onError:t=>{w(!1);const m=Object.values(t).join(`
`);i(m||"Failed to place bid","error")},onFinish:()=>{w(!1)}})},G=async()=>{if(f){i("This product is sold out","error");return}j(!0);const t=await b(s.id,"product",null,s);j(!1),t.success?i(t.message,"success"):i(t.message,"error")},J=async()=>{if(f){i("This product is sold out","error");return}j(!0);const t=await b(s.id,"product",null,s);t.success||t.message==="Product already in cart"?C.visit(route("checkout.index")):(j(!1),i(t.message,"error"))},K=()=>{const t=encodeURIComponent(`Hello XpertBid Support, I need help with this listing: ${s?.title||""}`);window.open(`https://wa.me/923022113202?text=${t}`,"_blank","noopener,noreferrer")},Q=async()=>{if(!o.user){i("Please login to chat with the seller","error");return}if(g){i("You cannot chat with yourself","error");return}try{const t=await te.post("/chat/initiate",{user_id:s.user_id||s.seller_id||s.owner_id,product_id:s.id});t.data&&t.data.id&&C.visit(`/chat?conversation_id=${t.data.id}`)}catch(t){console.error("Error initiating chat:",t),i("Failed to start conversation. Please try again.","error")}},ee=t=>{if(!t)return"/assets/images/user-fallback.png";if(String(t).startsWith("http"))return t;const m=String(t).replace(/\\/g,"/");return m.startsWith("/")?m:`/${m.replace(/^\/+/,"")}`};return e.jsxs("div",{className:"product-details-brief-parent",style:{padding:"0 10px"},children:[e.jsx("h2",{className:"product-heading mb-3",children:s.title}),f&&e.jsxs("div",{className:"sold-out-banner mb-4",children:[e.jsx("i",{className:"fa-solid fa-box-open me-2"}),"Sold Out"]}),e.jsxs("div",{className:"owned-by-and-favoruite d-flex align-items-center justify-content-between mb-4",children:[e.jsxs("div",{className:"owned d-flex align-items-center gap-2",children:[e.jsx("div",{className:"customer-profile-wrap",children:e.jsx("img",{src:ee(s.seller?.profile_pic||s.user?.profile_pic),alt:"Owner",style:{width:"45px",height:"45px",borderRadius:"50%",objectFit:"cover"},onError:t=>{t.target.src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}})}),e.jsxs("div",{className:"customer-name d-flex flex-column",children:[e.jsx("span",{className:"owner text-muted small fw-semibold",style:{fontSize:"12px"},children:"Owned By"}),e.jsx("p",{className:"name mb-0 fw-bold text-dark",style:{fontSize:"15px"},children:s.seller?.name||s.user?.name||"Ali"})]})]}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsxs("button",{onClick:Q,className:"btn btn-outline-primary btn-sm d-flex align-items-center gap-2",style:{borderRadius:"20px",padding:"5px 15px",fontSize:"13px"},children:[e.jsx("i",{className:"fa-regular fa-comment-dots"}),"Chat"]}),e.jsx("button",{onClick:X,disabled:O,className:"fav-btn border-0 bg-light p-2 rounded-2",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:A?"#ef4444":"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z",stroke:A?"#ef4444":"#23262F",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})]})]}),W?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"bid-rank-and-time detail-auction-strip mb-3",children:e.jsxs("div",{className:"detail-auction-meta",children:[e.jsx("span",{className:"rank",children:"Highest Bid"}),e.jsx("div",{className:"price",title:String(k),children:e.jsx(x,{amountAED:k})})]})}),(s.status==="awarded"||s.status==="awarded ")&&e.jsx("div",{className:"winner-section-ref mb-3",children:e.jsxs("div",{className:"winner-text-ref",children:[e.jsx("span",{className:"trophy-icon-ref",children:"🏆"}),"Bid awarded to ",U]})}),s.status!=="awarded"&&s.status!=="awarded "&&!f&&e.jsxs("div",{className:"bid-input-wrap mb-3",children:[e.jsx("input",{type:"number",placeholder:"Enter amount",className:"form-control border-secondary-subtle",style:{height:"50px",fontSize:"16px",borderRadius:"10px",padding:"0 20px"},value:c,onChange:t=>y(t.target.value),disabled:_||g}),e.jsx("button",{className:"btn w-100 fw-bold mt-3",style:{height:"50px",fontSize:"18px",borderRadius:"10px",backgroundColor:"#23262F",color:"#fff",border:"none"},onClick:Z,disabled:_||g,children:_?"Placing Bid...":"Place Bid"})]}),e.jsxs("div",{className:"min-bid-and-estimate d-flex justify-content-between mt-2",children:[e.jsxs("div",{className:"minimum-bid text-muted small",children:["Starting bid price: ",e.jsx("span",{className:"text-dark fw-semibold",children:e.jsx(x,{amountAED:D})})]}),e.jsxs("div",{className:"estimate-bid text-muted small",children:["Market Value: ",e.jsx("span",{className:"text-dark fw-semibold",children:e.jsx(x,{amountAED:L})})]})]}),(s.is_1_rupee===1||s.is_1_rupee==="1")&&s.status!=="awarded"&&s.status!=="awarded "&&e.jsx("div",{className:"disclaimer mt-3 bg-secondary bg-opacity-5 p-2 rounded-2",children:e.jsxs("p",{className:"mb-0 text-muted",style:{fontSize:"12px"},children:[e.jsx("i",{className:"fa-solid fa-circle-info me-1"}),"In our Rs. 1 Auction, if a new bid is placed in the last 5 minutes, the auction timer will automatically reset to 15 minutes."]})})]}):e.jsx(e.Fragment,{children:e.jsxs("div",{className:"normal-pricing-section",children:[e.jsxs("div",{className:"d-flex flex-wrap gap-2 mb-3",children:[s.product_condition&&e.jsxs("div",{className:"px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2",style:{backgroundColor:"#f8f9fa",borderColor:"#dee2e6"},children:[e.jsx("span",{className:"text-muted small",children:"Condition"}),e.jsx("span",{className:"fw-bold text-dark text-capitalize",children:s.product_condition})]}),s.product_year&&e.jsxs("div",{className:"px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2",style:{backgroundColor:"#f8f9fa",borderColor:"#dee2e6"},children:[e.jsx("span",{className:"text-muted small",children:"Year"}),e.jsx("span",{className:"fw-bold text-dark",children:s.product_year})]})]}),e.jsx("div",{className:"bid-rank-and-time bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center",children:e.jsxs("div",{className:"bid-price-and-rank d-flex flex-column",children:[e.jsx("span",{className:"rank text-muted small fw-semibold",children:"Price"}),e.jsxs("div",{className:"price fw-bold d-flex align-items-center gap-2",children:[E&&e.jsx("span",{className:"text-decoration-line-through text-muted",style:{fontSize:"16px"},children:e.jsx(x,{amountAED:h})}),e.jsx("span",{className:"text-dark",style:{fontSize:"28px"},children:e.jsx(x,{amountAED:V})}),E&&e.jsx("span",{className:"badge bg-danger",children:s.discount_type==="percent"?`${v}% OFF`:"SALE"})]})]})}),e.jsx("div",{className:"action-buttons d-grid gap-2 mb-3",children:f?e.jsxs("div",{className:"sold-out-action-box",children:[e.jsx("span",{className:"sold-out-action-label",children:"Sold Out"}),e.jsx("p",{className:"mb-0 text-muted",style:{fontSize:"13px"},children:"This listing is no longer available for purchase or bidding."})]}):M?e.jsxs("button",{className:"btn w-100 fw-bold",style:{height:"50px",fontSize:"16px",borderRadius:"10px",backgroundColor:"#25D366",color:"#fff",border:"none"},onClick:K,children:[e.jsx("i",{className:"fa-brands fa-whatsapp me-2"}),"Contact to Support"]}):e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn w-100 fw-bold",style:{height:"50px",fontSize:"16px",borderRadius:"10px",backgroundColor:"#23262F",color:"#fff",border:"none"},onClick:G,disabled:g||S,children:S?"Adding...":"Add to Cart"}),e.jsx("button",{className:"btn w-100 fw-bold",style:{height:"50px",fontSize:"16px",borderRadius:"10px",backgroundColor:"#43ACE9",color:"#fff",border:"none"},onClick:J,disabled:g||S,children:"Buy Now"})]})})]})}),e.jsx("style",{children:`
                            .winner-section-ref {
                                   width: 100%;
                                   text-align: center;
                                   background: #f0f9ff !important;
                                   padding: 10px;
                                   border-radius: 8px;
                                   border: 1px dashed #43ACE9 !important;
                            }
                            .winner-text-ref {
                                   font-size: 1.1rem;
                                   font-weight: 700;
                                   color: #0284c7;
                                   margin-top: 4px;
                                   display: flex;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 6px;
                            }
                            .trophy-icon-ref {
                                   color: #eab308;
                                   font-size: 1.2rem;
                            }
                            .detail-auction-strip {
                                   background: #f8fafc;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 18px;
                                   padding: 18px 20px;
                                   box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
                            }
                            .detail-auction-meta {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 8px;
                                   min-width: 0;
                            }
                            .detail-auction-meta .rank {
                                   color: #6b7280;
                                   font-size: 13px;
                                   font-weight: 600;
                                   text-transform: uppercase;
                                   letter-spacing: 0.06em;
                            }
                            .detail-auction-meta .price {
                                   color: #111827;
                                   font-size: clamp(24px, 3vw, 36px);
                                   font-weight: 800;
                                   line-height: 1.05;
                                   letter-spacing: -0.03em;
                                   white-space: nowrap;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                            }
                            .sold-out-banner {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 8px;
                                   padding: 10px 18px;
                                   border-radius: 999px;
                                   background: linear-gradient(135deg, #991b1b, #dc2626);
                                   color: #fff;
                                   font-size: 14px;
                                   font-weight: 800;
                                   letter-spacing: 0.08em;
                                   text-transform: uppercase;
                                   box-shadow: 0 10px 20px rgba(220, 38, 38, 0.18);
                            }
                            .sold-out-action-box {
                                   padding: 16px 18px;
                                   border-radius: 16px;
                                   border: 1px solid #fecaca;
                                   background: #fff1f2;
                                   text-align: center;
                            }
                            .sold-out-action-label {
                                   display: inline-block;
                                   margin-bottom: 8px;
                                   padding: 6px 14px;
                                   border-radius: 999px;
                                   background: #dc2626;
                                   color: #fff;
                                   font-size: 12px;
                                   font-weight: 800;
                                   letter-spacing: 0.08em;
                                   text-transform: uppercase;
                            }
                            .detail-auction-meta .price span {
                                   color: inherit !important;
                            }
                            @media (max-width: 575px) {
                                   .detail-auction-strip {
                                          padding: 16px 14px;
                                    }
                                   .detail-auction-meta {
                                          min-width: 0;
                                   }
                                   .detail-auction-meta .price {
                                          font-size: 28px;
                                   }
                            }
                     `}),T&&e.jsxs("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e4,animation:"fadeInOverlay 0.3s ease-out"},children:[e.jsxs("div",{style:{background:"#fff",padding:"40px 30px",borderRadius:"20px",textAlign:"center",maxWidth:"450px",width:"90%",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",animation:"popupIn 0.3s ease-out"},children:[e.jsx("div",{style:{marginBottom:"20px"},children:e.jsx("div",{style:{width:"60px",height:"60px",backgroundColor:"#f3f4f6",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"30px"},children:"💰"})}),e.jsx("h3",{style:{fontSize:"24px",fontWeight:"800",marginBottom:"10px",color:"#111827"},children:"Confirm Your Bid"}),e.jsxs("p",{style:{color:"#6b7280",fontSize:"16px",marginBottom:"30px"},children:["Are you sure you want to place a bid of ",e.jsx("span",{style:{color:"#000",fontWeight:"700"},children:e.jsx(x,{amountAED:c})}),"?"]}),e.jsxs("div",{className:"d-flex gap-3 justify-content-center",children:[e.jsx("button",{onClick:()=>z(!1),style:{flex:1,padding:"12px",borderRadius:"12px",border:"1px solid #e5e7eb",background:"#fff",fontWeight:"600",color:"#374151"},children:"Cancel"}),e.jsx("button",{onClick:q,style:{flex:1,padding:"12px",borderRadius:"12px",border:"none",background:"#000",color:"#fff",fontWeight:"600"},children:"Confirm Bid"})]})]}),e.jsx("style",{children:`
                                          @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
                                          @keyframes popupIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                                   `})]}),N.show&&e.jsxs("div",{style:{position:"fixed",right:"25px",bottom:"25px",zIndex:9999,minWidth:"280px",backgroundColor:N.type==="success"?"#10b981":"#ef4444",color:"#fff",padding:"16px 20px",borderRadius:"12px",boxShadow:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",display:"flex",alignItems:"center",gap:"12px",animation:"slideIn 0.3s ease-out forwards"},children:[e.jsx("div",{style:{width:"24px",height:"24px",borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},children:N.type==="success"?"✓":"!"}),e.jsx("div",{style:{fontWeight:"600",fontSize:"14px"},children:N.message}),e.jsx("style",{children:`
                                          @keyframes slideIn {
                                                 from { transform: translateX(100%); opacity: 0; }
                                                  to { transform: translateX(0); opacity: 1; }
                                          }
                                   `})]})]})}function ce({bids:s}){const l="/assets/images/user.jpg",p=a=>a?a.startsWith("http")?a:`https://admin.xpertbid.com/${a.startsWith("/")?a.slice(1):a}`:l;return e.jsxs("div",{className:"bid-history-parent",children:[e.jsx("div",{className:"bid-history-header",children:e.jsx("h2",{className:"description",children:"Bid History"})}),e.jsx("div",{className:"bid-history-scroll",children:Array.isArray(s)&&s.length>0?s.map(a=>{const r=a.user||{},o=r.profile_pic||r.image,d=p(o),b=Number(a.bid_amount||a.amount)||0,c=new Date(a.created_at).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});return e.jsxs("div",{className:"history-user parent",children:[e.jsxs("div",{className:"history-user-profile",children:[e.jsx("img",{src:d,alt:"Bidder",referrerPolicy:"no-referrer",style:{width:"30px",height:"30px",borderRadius:"40%",objectFit:"cover"},onError:y=>{y.target.src=l}}),e.jsxs("div",{className:"username-and-date ms-3",children:[e.jsx("p",{className:"history-user-name",children:r.name?r.name.length>15?r.name.substring(0,15)+"...":r.name:"Unknown"}),e.jsx("span",{className:"date",children:c})]})]}),e.jsx("div",{className:"history-user-payAmount",children:e.jsx("p",{className:"history-no",children:e.jsx(x,{amountAED:b})})})]},a.id)}):e.jsx("p",{className:"text-center text-muted my-4",children:"No Bid History"})})]})}function me({videoId:s,title:l="Live stream"}){if(!s||typeof s!="string"||s.length!==11)return null;const p=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(s)}?rel=0`;return e.jsx("div",{className:"xb-youtube-embed rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-sm",children:e.jsx("div",{className:"ratio ratio-16x9",style:{position:"relative",paddingBottom:"56.25%",height:0,overflow:"hidden"},children:e.jsx("iframe",{title:l,src:p,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0,loading:"lazy",referrerPolicy:"strict-origin-when-cross-origin",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:0}})})})}export{de as B,me as Y,ce as a};
