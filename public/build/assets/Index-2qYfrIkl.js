import{j as e,L as o,a as m,H as h}from"./app-lu7_VoJP.js";import{A as u}from"./AppLayout-B0xpL7z0.js";import{C as g,O as f}from"./CountdownTimer-BfR-Y7Nz.js";import{P as n}from"./Price-YFt8wuGR.js";import{a as b,i as w,g as j}from"./listingPricing-CBcHwZ3i.js";import{b as d}from"./productUrl-COmlJyrp.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";import"./useCurrencyList-BuOaosnQ.js";const k=({favorite:t})=>{const r=c=>{c.preventDefault(),c.stopPropagation(),confirm("Are you sure you want to remove this from your favorites?")&&m.post(route("favorites.toggle"),{listing_id:t.id},{preserveScroll:!0})},p=t.image||"/assets/images/placeholder.jpg",l=t.title||t.name||"Product",a=b(t),i=w(t),s=j(t),x=a?"Price":Number(t.current_bid)>0?"Current Bid":"Minimum Bid";return e.jsx("div",{className:"col-lg-4 col-md-6 col-sm-12 mkt-child",children:e.jsxs("div",{className:"market-card",children:[e.jsxs("div",{className:"mkt-img",children:[e.jsx(o,{href:d(t.slug),className:"product-box",children:e.jsx("img",{src:p,alt:l,loading:"lazy"})}),t.end_date&&!i&&!a&&e.jsx(g,{startDate:t.start_date,endDate:t.end_date}),i&&e.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"#111827",color:"white",padding:"5px 10px",borderRadius:"999px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:"Sold Out"}),!i&&s.hasDiscount&&e.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"rgba(220, 53, 69, 0.9)",color:"white",padding:"5px 10px",borderRadius:"999px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:s.badgeText}),e.jsx("div",{className:"favourite-icon",onClick:r,title:"Remove from favorites",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"#FF4D4D",children:e.jsx("path",{d:"M16.44 3.1001C14.63 3.1001 13.01 3.9801 12 5.3301C10.99 3.9801 9.37 3.1001 7.56 3.1001C4.49 3.1001 2 5.6001 2 8.6901C2 9.8801 2.19 10.9801 2.52 12.0001C4.1 17.0001 8.97 19.9901 11.38 20.8101C11.72 20.9301 12.28 20.9301 12.62 20.8101C15.03 19.9901 19.9 17.0001 21.48 12.0001C21.81 10.9801 22 9.8801 22 8.6901C22 5.6001 19.51 3.1001 16.44 3.1001Z"})})})]}),e.jsxs("div",{className:"mkt-body",children:[e.jsx("div",{className:"mkt-pro-head",children:e.jsx("h3",{children:e.jsx(o,{href:d(t.slug),children:l})})}),e.jsx(f,{owner:t.owner,fallbackName:t.user_name,fallbackAvatar:t.profile_pic,isFeatured:!!t?.featured_name}),e.jsxs("div",{className:"mkt-detail",children:[e.jsxs("div",{className:"mkt-crt-bid",children:[e.jsx("span",{className:"crnt-bid",children:x}),e.jsx("div",{className:"mkt-bid-price",children:i?e.jsx("span",{className:"price text-muted fw-bold",children:"Sold Out"}):a&&s.hasDiscount?e.jsxs("div",{className:"d-flex flex-column",children:[e.jsx("span",{className:"text-decoration-line-through text-muted",style:{fontSize:"0.8em",lineHeight:1},children:e.jsx(n,{className:"price",amountAED:s.originalPrice})}),e.jsx("span",{className:"text-danger",children:e.jsx(n,{className:"price",amountAED:s.finalPrice})})]}):e.jsx(n,{className:"price",amountAED:t.current_bid||t.minimum_bid})})]}),e.jsx("div",{className:"mkt-bid-btn",children:i?e.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"12px",padding:"12px 18px",background:"#9ca3af",color:"#fff",fontWeight:600,cursor:"not-allowed"},children:"Sold Out"}):e.jsx(o,{href:d(t.slug),children:a?"Buy Now":"Place Bid"})})]})]})]})})};function S({favorites:t}){return e.jsxs(u,{title:"My Favorites",children:[e.jsx(h,{title:"My Favorites"}),e.jsx("div",{className:"py-5 bg-light min-vh-100",children:e.jsx("div",{className:"container",children:e.jsx("div",{className:"row justify-content-center",children:e.jsxs("div",{className:"col-12",children:[e.jsx("div",{className:"fav-like-hdig pt-4 mb-4",children:e.jsx("h2",{className:"fw-bold",children:"My Favorites"})}),t.length===0?e.jsxs("div",{className:"text-center py-5 bg-white rounded-3 shadow-sm border",children:[e.jsx("div",{className:"mb-4",children:e.jsx("i",{className:"fa-regular fa-heart fa-4x text-muted opacity-25"})}),e.jsx("h2",{className:"h4 fw-bold text-dark mt-3",children:"No Favorites Yet"}),e.jsx("p",{className:"text-muted mb-4",children:"Items you've liked will appear here for quick access."}),e.jsx("a",{href:"/marketplace",className:"btn btn-primary px-4 py-2 rounded-pill fw-bold",children:"Discover Auctions"})]}):e.jsx("div",{className:"row g-4 makt-parent",children:t.map(r=>e.jsx(k,{favorite:r},r.id))})]})})})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                .markt-parent {
                    display: flex;
                    flex-wrap: wrap;
                }
                .marketplace {
                    padding: 40px 0;
                }
                .fav-like-hdig h2 {
                    font-size: 32px;
                    color: #23262F;
                    margin-bottom: 20px;
                }
                .makt-parent {
                    display: flex;
                    flex-wrap: wrap;
                    margin-left: -15px;
                    margin-right: -15px;
                }
                /* Ported mkt- styles */
                .mkt-child {
                    margin-bottom: 30px;
                }
                .market-card {
                    background: #FFFFFF;
                    border: 1px solid #E6E8EC;
                    border-radius: 20px;
                    padding: 12px;
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .market-card:hover {
                    box-shadow: 0 12px 32px rgba(31, 47, 70, 0.12);
                    transform: translateY(-4px);
                }
                .mkt-img {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    aspect-ratio: 4/3;
                }
                .mkt-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .favourite-icon {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: #FFFFFF;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    cursor: pointer;
                    z-index: 11;
                }
                .mkt-body {
                    padding: 12px 4px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                .mkt-pro-head h3 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #23262F;
                    margin-bottom: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .mkt-detail {
                    margin-top: auto;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    background: #F4F5F6;
                    border-radius: 12px;
                    padding: 12px;
                }
                .crnt-bid {
                    font-size: 11px;
                    color: #777E91;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 4px;
                }
                .mkt-bid-price .price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #23262F;
                }
                .mkt-bid-btn a {
                    background: #43ACE9;
                    color: #FFFFFF;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .mkt-bid-btn a:hover {
                    background: #35a0dc;
                }

                /* Countdown Timer Styling */
                .mkt-img .counter {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(28, 29, 32, 0.85);
                    padding: 8px 12px;
                    border-radius: 10px;
                    z-index: 10;
                    width: auto !important;
                    min-width: 180px;
                }
                .counter-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }
                .counter-box {
                    text-align: center;
                }
                .counter-value {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                }
                .counter-label {
                    color: #fff;
                    font-size: 8px;
                    text-transform: uppercase;
                    opacity: 0.8;
                }

                /* Owner Info Row */
                .owner-info-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 8px 0 12px;
                }
                .owner-info-row img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .owner-info-row span {
                    font-size: 14px;
                    color: #23262F;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}})]})}export{S as default};
