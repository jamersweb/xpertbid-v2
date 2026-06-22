import{r as j,j as t,H as S,L as s}from"./app-lu7_VoJP.js";import{O as k,A as C}from"./AppLayout-B0xpL7z0.js";import{u as z}from"./productUrl-COmlJyrp.js";import{P as p}from"./Price-YFt8wuGR.js";import{S as m}from"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";import"./useCurrencyList-BuOaosnQ.js";function I({cart:l}){const{cartItems:x,removeFromCart:w,updateCartItem:v,getTotalPrice:E}=z(),[c,g]=j.useState({}),[A,f]=j.useState({}),i=Array.isArray(l)?l:Array.isArray(x)?x:[],N=async e=>{m.fire({title:"Are you sure?",text:"You want to remove this item from cart?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#23262F",cancelButtonColor:"#d33",confirmButtonText:"Yes, remove it!"}).then(async r=>{if(r.isConfirmed){g(o=>({...o,[e]:!0}));const a=await w(e);g(o=>({...o,[e]:!1})),a.success||m.fire("Error",a.message||"Failed to remove item","error")}})},h=async(e,r)=>{const a=i.find(n=>n.id===e),o=Number.parseInt(a?.group_size_min,10)||1,d=Number.parseInt(a?.group_size_max,10),b=Number.isFinite(d)&&d>=o?d:null;if(r<o||b&&r>b)return;f(n=>({...n,[e]:!0}));const y=await v(e,r);f(n=>({...n,[e]:!1})),y.success||m.fire("Error",y.message||"Failed to update cart","error")},u=i.reduce((e,r)=>e+parseFloat(r.price||0)*(r.quantity||1),0),F=e=>e?e.replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim():"";return t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsx("title",{children:"Shopping Cart | XpertBid"})}),t.jsx("div",{className:"cart-page-wrapper",style:{backgroundColor:"#F1F1F1",padding:"60px 70px",minHeight:"100vh"},children:t.jsxs("div",{className:"container",style:{maxWidth:"1200px"},children:[t.jsx("div",{className:"row",children:t.jsx("div",{className:"col-12",children:t.jsx("h2",{className:"mb-4",style:{fontFamily:'"Inter", sans-serif',fontSize:"46px",fontWeight:"800",lineHeight:"64px",color:"#23262F",marginBottom:"40px"},children:"Shopping Cart"})})}),i.length===0?t.jsxs("div",{className:"text-center py-5",children:[t.jsx("div",{className:"mb-4",children:t.jsx("i",{className:"fa-solid fa-cart-shopping",style:{fontSize:"80px",color:"#606060"}})}),t.jsx("h3",{style:{fontFamily:'"Inter", sans-serif',color:"#23262F",fontWeight:"700"},children:"Your cart is empty"}),t.jsx("p",{style:{fontFamily:'"Inter", sans-serif',color:"#606060",fontSize:"16px",marginBottom:"30px"},children:"Add some products to get started!"}),t.jsx(s,{href:route("marketplace.index"),className:"btn",style:{backgroundColor:"#43ACE9",color:"#fff",padding:"12px 24px",borderRadius:"8px",fontSize:"16px",fontWeight:"600",fontFamily:'"Inter", sans-serif',textDecoration:"none",display:"inline-block"},children:"Continue Shopping"})]}):t.jsxs("div",{className:"row cart-page-grid",children:[t.jsx("div",{className:"col-lg-8",children:t.jsx("div",{className:"cart-items-card",style:{backgroundColor:"#fff",borderRadius:"15px",padding:"25px 30px",boxShadow:"0 45px 90px 0 #00000026"},children:i.map((e,r)=>t.jsxs("div",{className:"d-flex align-items-start cart-item-row",style:{minHeight:"150px",paddingBottom:r<i.length-1?"30px":"0",marginBottom:r<i.length-1?"30px":"0",borderBottom:r<i.length-1?"1px solid #eee":"none"},children:[t.jsxs("div",{className:"me-3 cart-item-image-wrap",style:{width:"150px",flexShrink:0},children:[t.jsx(s,{href:e.slug?route("product.show",e.slug):"#",children:t.jsx("div",{className:"cart-item-image-box",style:{width:"100%",height:"150px",position:"relative",overflow:"hidden",borderRadius:"12px",backgroundColor:"#f8f9fa"},children:t.jsx("img",{src:e.image?e.image.startsWith("http")?e.image:`https://admin.xpertbid.com/${e.image}`:"/assets/images/placeholder.png",alt:e.title,style:{objectFit:"cover",width:"100%",height:"100%",borderRadius:"6px"},onError:a=>a.target.src="/assets/images/WebsiteBanner2.png"})})}),t.jsx("div",{className:"cart-item-price-mobile",children:t.jsx(p,{amountAED:parseFloat(e.price)||0,className:"fw-bold"})})]}),t.jsxs("div",{className:"flex-grow-1 min-w-0",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-start mb-2 cart-item-top",children:[t.jsxs("div",{className:"cart-item-content",style:{flex:1,marginRight:"15px"},children:[t.jsx("h5",{className:"mb-1 cart-item-title",style:{fontFamily:'"Inter", sans-serif',fontSize:"18px",fontWeight:"700",color:"#23262F",marginBottom:"8px"},children:t.jsx(s,{href:e.slug?route("product.show",e.slug):"#",style:{textDecoration:"none",color:"inherit"},children:e.title})}),t.jsx("p",{className:"cart-item-description",style:{fontFamily:'"Inter", sans-serif',fontSize:"14px",color:"#606060",lineHeight:"20px",marginBottom:"12px"},children:e.description?F(e.description).substring(0,120)+"...":""}),e.variation_name&&t.jsx("span",{className:"badge bg-light text-dark border mb-2",children:e.variation_name})]}),t.jsx("button",{className:"cart-remove-btn",onClick:()=>N(e.id),disabled:c[e.id],style:{background:"none",border:"none",color:"#E94343",cursor:c[e.id]?"not-allowed":"pointer",padding:"8px",fontSize:"18px",opacity:c[e.id]?.6:1},children:c[e.id]?t.jsx(k,{height:16,width:16,color:"#E94343"}):t.jsx("i",{className:"fa-solid fa-trash"})})]}),t.jsxs("div",{className:"d-flex justify-content-between align-items-center mt-3 cart-item-bottom",children:[t.jsx("div",{className:"cart-item-price",children:t.jsx(p,{amountAED:parseFloat(e.price)||0,className:"fw-bold"})}),t.jsxs("div",{className:"d-flex align-items-center bg-light rounded-pill px-2 py-1 cart-qty-control",children:[t.jsx("button",{onClick:()=>h(e.id,(e.quantity||1)-1),disabled:(e.quantity||1)<=(Number.parseInt(e.group_size_min,10)||1),className:"btn btn-sm border-0",children:t.jsx("i",{className:"fa-solid fa-minus",style:{fontSize:"10px"}})}),t.jsx("span",{className:"mx-2 fw-bold small",children:e.quantity||1}),t.jsx("button",{onClick:()=>h(e.id,(e.quantity||1)+1),disabled:Number.isFinite(Number.parseInt(e.group_size_max,10))&&(e.quantity||1)>=Number.parseInt(e.group_size_max,10),className:"btn btn-sm border-0",children:t.jsx("i",{className:"fa-solid fa-plus",style:{fontSize:"10px"}})})]})]})]})]},e.id))})}),t.jsx("div",{className:"col-lg-4 cart-summary-col",children:t.jsxs("div",{className:"order-summary-card",style:{backgroundColor:"#fff",borderRadius:"15px",padding:"0",boxShadow:"0 45px 90px 0 #00000026",position:"sticky",top:"20px"},children:[t.jsx("div",{style:{padding:"25px 30px",borderBottom:"1px solid #eee"},children:t.jsx("h5",{className:"mb-0",style:{fontFamily:'"Inter", sans-serif',fontSize:"22px",fontWeight:"700",color:"#23262F"},children:"Order Summary"})}),t.jsxs("div",{style:{padding:"25px 30px"},children:[t.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[t.jsx("span",{style:{fontFamily:'"Inter", sans-serif',fontSize:"16px",color:"#606060"},children:"Subtotal:"}),t.jsx(p,{amountAED:u,className:"fw-semibold"})]}),t.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[t.jsx("span",{style:{fontFamily:'"Inter", sans-serif',fontSize:"16px",color:"#606060"},children:"Shipping:"}),t.jsx("span",{style:{fontFamily:'"Inter", sans-serif',fontSize:"16px",color:"#606060"},children:"FREE"})]}),t.jsx("hr",{style:{margin:"20px 0",borderColor:"#eee"}}),t.jsxs("div",{className:"d-flex justify-content-between mb-4",children:[t.jsx("strong",{style:{fontFamily:'"Inter", sans-serif',fontSize:"18px",fontWeight:"700",color:"#23262F"},children:"Total:"}),t.jsx("strong",{style:{fontFamily:'"Inter", sans-serif',fontSize:"18px",fontWeight:"700",color:"#23262F"},children:t.jsx(p,{amountAED:u,className:"fw-bold"})})]}),t.jsx(s,{href:route("checkout.index"),style:{display:"block",textAlign:"center",width:"100%",padding:"14px",fontSize:"16px",fontWeight:"600",fontFamily:'"Inter", sans-serif',backgroundColor:"#43ACE9",color:"#fff",border:"none",borderRadius:"8px",marginBottom:"15px",cursor:"pointer",textDecoration:"none",transition:"background-color 0.3s ease"},onMouseEnter:e=>e.target.style.backgroundColor="#35a0d8",onMouseLeave:e=>e.target.style.backgroundColor="#43ACE9",children:"Proceed to Checkout"}),t.jsx(s,{href:route("marketplace.index"),style:{display:"block",textAlign:"center",padding:"14px",fontSize:"16px",fontWeight:"600",fontFamily:'"Inter", sans-serif',backgroundColor:"#23262F",color:"#fff",border:"1px solid #23262F",borderRadius:"8px",textDecoration:"none",transition:"all 0.3s ease"},onMouseEnter:e=>{e.target.style.backgroundColor="#151922",e.target.style.color="#fff"},onMouseLeave:e=>{e.target.style.backgroundColor="#23262F",e.target.style.color="#fff"},children:"Continue Shopping"})]})]})})]})]})}),t.jsx("style",{dangerouslySetInnerHTML:{__html:`
               .object-fit-cover { object-fit: cover; }
               .cart-page-wrapper .fw-bold,
               .cart-page-wrapper .fw-semibold {
                   color: #23262F !important;
               }
               .cart-item-price-mobile {
                   display: none;
               }
               @media (max-width: 991px) {
                   .cart-page-wrapper {
                       padding: 40px 20px !important;
                   }
                   .cart-page-grid {
                        row-gap: 18px;
                   }
                   .cart-items-card {
                        padding: 18px !important;
                        border-radius: 18px !important;
                   }
                   .cart-item-row {
                        min-height: auto !important;
                        gap: 14px;
                   }
                   .cart-item-image-wrap {
                        width: 96px !important;
                        min-width: 96px !important;
                        margin-right: 0 !important;
                   }
                   .cart-item-image-box {
                        height: 96px !important;
                        border-radius: 12px !important;
                   }
                   .cart-item-top {
                        gap: 10px;
                   }
                   .cart-item-content {
                        min-width: 0;
                        margin-right: 0 !important;
                   }
                   .cart-item-title {
                        font-size: 14px !important;
                        line-height: 1.3 !important;
                        margin-bottom: 6px !important;
                   }
                   .cart-item-description {
                        font-size: 12px !important;
                        line-height: 1.45 !important;
                        margin-bottom: 0 !important;
                        display: -webkit-box;
                        -webkit-line-clamp: 4;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                   }
                   .cart-remove-btn {
                        padding: 2px !important;
                        font-size: 15px !important;
                        flex-shrink: 0;
                   }
                   .cart-item-bottom {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 10px;
                   }
                   .cart-item-price {
                        font-size: 15px;
                   }
                   .cart-qty-control {
                        align-self: flex-start;
                        padding-inline: 6px !important;
                   }
                   .cart-summary-col {
                        margin-top: 0 !important;
                   }
                   .order-summary-card {
                        border-radius: 18px !important;
                   }
                   .order-summary-card > div:first-child,
                   .order-summary-card > div:last-child {
                        padding: 18px !important;
                   }
               }
               @media (max-width: 575px) {
                   .cart-page-wrapper {
                        padding: 24px 14px 90px !important;
                   }
                   .cart-page-wrapper h2 {
                        font-size: 34px !important;
                        line-height: 1.15 !important;
                        margin-bottom: 24px !important;
                   }
                   .cart-item-row {
                        align-items: flex-start !important;
                        display: grid !important;
                        grid-template-columns: 86px minmax(0, 1fr);
                        grid-template-areas:
                            "image content"
                            "price qty";
                        column-gap: 12px;
                        row-gap: 10px;
                   }
                   .cart-item-image-wrap {
                        width: 86px !important;
                        min-width: 86px !important;
                        grid-area: image;
                   }
                   .cart-item-image-box {
                        height: 86px !important;
                   }
                   .cart-item-price-mobile {
                        display: flex !important;
                        align-items: center;
                        min-height: 34px;
                        margin-top: 10px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #23262F;
                        align-self: center;
                    }
                   .cart-item-top {
                        grid-area: content;
                        margin-bottom: 0 !important;
                    }
                   .cart-item-bottom {
                        display: contents !important;
                   }
                   .cart-item-price {
                        display: none !important;
                    }
                   .cart-qty-control {
                        grid-area: qty;
                        justify-self: end;
                        align-self: center;
                        margin-top: 0 !important;
                        min-height: 34px;
                    }
                   .cart-item-title {
                        font-size: 13px !important;
                   }
                   .cart-item-description {
                        -webkit-line-clamp: 3;
                   }
                   .cart-qty-control .btn {
                        padding: 0.2rem 0.35rem !important;
                   }
                }
           `}})]})}I.layout=l=>t.jsx(C,{title:"Shopping Cart",children:l});export{I as default};
