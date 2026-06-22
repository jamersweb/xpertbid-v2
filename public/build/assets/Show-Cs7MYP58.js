import{j as t,L as z,a as I,r as T,b as ie,H}from"./app-lu7_VoJP.js";import{a as re,A as ae}from"./AppLayout-B0xpL7z0.js";import{g as oe,i as se,e as ne,n as B,b as L,S as D,a as O}from"./swiper-l5bT_C8n.js";import{N as F}from"./navigation-CWcQ-MLR.js";import{C as le}from"./CountdownTimer-BfR-Y7Nz.js";import{Y,B as W,a as J}from"./YoutubeLiveEmbed-DQNIIYfT.js";import{A as de}from"./AuctionCard-CmchA6tH.js";import{L as G}from"./ListingLiveChat-IJ0BBFDc.js";import{P as R}from"./Price-YFt8wuGR.js";import{C as ce}from"./productUrl-COmlJyrp.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";import"./useCurrencyList-BuOaosnQ.js";import"./listingPricing-CBcHwZ3i.js";import"./FavoriteToggleButton-BWzLqp6w.js";function U({swiper:e,extendParams:d,on:c}){d({thumbs:{swiper:null,multipleActiveThumbs:!0,autoScrollOffset:0,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-thumbs"}});let u=!1,g=!1;e.thumbs={swiper:null};function y(){const a=e.thumbs.swiper;return!a||a.destroyed?!1:a.params.virtual&&a.params.virtual.enabled}function k(){const a=e.thumbs.swiper;if(!a||a.destroyed)return;const i=a.clickedIndex,l=a.clickedSlide;if(l&&l.classList.contains(e.params.thumbs.slideThumbActiveClass)||typeof i>"u"||i===null)return;let f;a.params.loop?f=parseInt(a.clickedSlide.getAttribute("data-swiper-slide-index"),10):f=i,e.params.loop?e.slideToLoop(f):e.slideTo(f)}function x(){const{thumbs:a}=e.params;if(u)return!1;u=!0;const i=e.constructor;if(a.swiper instanceof i){if(a.swiper.destroyed)return u=!1,!1;e.thumbs.swiper=a.swiper,Object.assign(e.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),Object.assign(e.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1}),e.thumbs.swiper.update()}else if(se(a.swiper)){const l=Object.assign({},a.swiper);Object.assign(l,{watchSlidesProgress:!0,slideToClickedSlide:!1}),e.thumbs.swiper=new i(l),g=!0}return e.thumbs.swiper.el.classList.add(e.params.thumbs.thumbsContainerClass),e.thumbs.swiper.on("tap",k),y()&&e.thumbs.swiper.on("virtualUpdate",()=>{r(!1,{autoScroll:!1})}),!0}function r(a,i){const l=e.thumbs.swiper;if(!l||l.destroyed)return;let f=1;const h=e.params.thumbs.slideThumbActiveClass;if(e.params.slidesPerView>1&&!e.params.centeredSlides&&(f=e.params.slidesPerView),e.params.thumbs.multipleActiveThumbs||(f=1),f=Math.floor(f),l.slides.forEach(m=>m.classList.remove(h)),l.params.loop||y())for(let m=0;m<f;m+=1)ne(l.slidesEl,`[data-swiper-slide-index="${e.realIndex+m}"]`).forEach(p=>{p.classList.add(h)});else for(let m=0;m<f;m+=1)l.slides[e.realIndex+m]&&l.slides[e.realIndex+m].classList.add(h);(i?.autoScroll??!0)&&_(a?0:void 0)}function _(a){const i=e.thumbs.swiper;if(!i||i.destroyed)return;const l=i.params.slidesPerView==="auto"?i.slidesPerViewDynamic():i.params.slidesPerView,f=e.params.thumbs.autoScrollOffset,h=f&&!i.params.loop;if(e.realIndex!==i.realIndex||h){const m=i.activeIndex;let p,s;if(i.params.loop){const j=i.slides.find(N=>N.getAttribute("data-swiper-slide-index")===`${e.realIndex}`);p=i.slides.indexOf(j),s=e.activeIndex>e.previousIndex?"next":"prev"}else p=e.realIndex,s=p>e.previousIndex?"next":"prev";h&&(p+=s==="next"?f:-1*f),i.visibleSlidesIndexes&&i.visibleSlidesIndexes.indexOf(p)<0&&(i.params.centeredSlides?p>m?p=p-Math.floor(l/2)+1:p=p+Math.floor(l/2)-1:p>m&&i.params.slidesPerGroup,i.slideTo(p,a))}}c("beforeInit",()=>{const{thumbs:a}=e.params;if(!(!a||!a.swiper))if(typeof a.swiper=="string"||a.swiper instanceof HTMLElement){const i=oe(),l=()=>{const h=typeof a.swiper=="string"?i.querySelector(a.swiper):a.swiper;if(h&&h.swiper)a.swiper=h.swiper,x(),r(!0);else if(h){const m=`${e.params.eventsPrefix}init`,p=s=>{a.swiper=s.detail[0],h.removeEventListener(m,p),x(),r(!0),a.swiper.update(),e.update()};h.addEventListener(m,p)}return h},f=()=>{if(e.destroyed)return;l()||requestAnimationFrame(f)};requestAnimationFrame(f)}else x(),r(!0)}),c("slideChange update resize observerUpdate",()=>{r()}),c("setTransition",(a,i)=>{const l=e.thumbs.swiper;!l||l.destroyed||l.setTransition(i)}),c("beforeDestroy",()=>{const a=e.thumbs.swiper;!a||a.destroyed||g&&a.destroy()}),Object.assign(e.thumbs,{init:x,update:r})}function X({swiper:e,extendParams:d,emit:c,once:u}){d({freeMode:{enabled:!1,momentum:!0,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,momentumVelocityRatio:1,sticky:!1,minimumVelocity:.02}});function g(){if(e.params.cssMode)return;const x=e.getTranslate();e.setTranslate(x),e.setTransition(0),e.touchEventsData.velocities.length=0,e.freeMode.onTouchEnd({currentPos:e.rtl?e.translate:-e.translate})}function y(){if(e.params.cssMode)return;const{touchEventsData:x,touches:r}=e;x.velocities.length===0&&x.velocities.push({position:r[e.isHorizontal()?"startX":"startY"],time:x.touchStartTime}),x.velocities.push({position:r[e.isHorizontal()?"currentX":"currentY"],time:B()})}function k({currentPos:x}){if(e.params.cssMode)return;const{params:r,wrapperEl:_,rtlTranslate:a,snapGrid:i,touchEventsData:l}=e,h=B()-l.touchStartTime;if(x<-e.minTranslate()){e.slideTo(e.activeIndex);return}if(x>-e.maxTranslate()){e.slides.length<i.length?e.slideTo(i.length-1):e.slideTo(e.slides.length-1);return}if(r.freeMode.momentum){if(l.velocities.length>1){const b=l.velocities.pop(),S=l.velocities.pop(),P=b.position-S.position,A=b.time-S.time;e.velocity=P/A,e.velocity/=2,Math.abs(e.velocity)<r.freeMode.minimumVelocity&&(e.velocity=0),(A>150||B()-b.time>300)&&(e.velocity=0)}else e.velocity=0;e.velocity*=r.freeMode.momentumVelocityRatio,l.velocities.length=0;let m=1e3*r.freeMode.momentumRatio;const p=e.velocity*m;let s=e.translate+p;a&&(s=-s);let j=!1,N;const o=Math.abs(e.velocity)*20*r.freeMode.momentumBounceRatio;let w;if(s<e.maxTranslate())r.freeMode.momentumBounce?(s+e.maxTranslate()<-o&&(s=e.maxTranslate()-o),N=e.maxTranslate(),j=!0,l.allowMomentumBounce=!0):s=e.maxTranslate(),r.loop&&r.centeredSlides&&(w=!0);else if(s>e.minTranslate())r.freeMode.momentumBounce?(s-e.minTranslate()>o&&(s=e.minTranslate()+o),N=e.minTranslate(),j=!0,l.allowMomentumBounce=!0):s=e.minTranslate(),r.loop&&r.centeredSlides&&(w=!0);else if(r.freeMode.sticky){let b;for(let S=0;S<i.length;S+=1)if(i[S]>-s){b=S;break}Math.abs(i[b]-s)<Math.abs(i[b-1]-s)||e.swipeDirection==="next"?s=i[b]:s=i[b-1],s=-s}if(w&&u("transitionEnd",()=>{e.loopFix()}),e.velocity!==0){if(a?m=Math.abs((-s-e.translate)/e.velocity):m=Math.abs((s-e.translate)/e.velocity),r.freeMode.sticky){const b=Math.abs((a?-s:s)-e.translate),S=e.slidesSizesGrid[e.activeIndex];b<S?m=r.speed:b<2*S?m=r.speed*1.5:m=r.speed*2.5}}else if(r.freeMode.sticky){e.slideToClosest();return}r.freeMode.momentumBounce&&j?(e.updateProgress(N),e.setTransition(m),e.setTranslate(s),e.transitionStart(!0,e.swipeDirection),e.animating=!0,L(_,()=>{!e||e.destroyed||!l.allowMomentumBounce||(c("momentumBounce"),e.setTransition(r.speed),setTimeout(()=>{e.setTranslate(N),L(_,()=>{!e||e.destroyed||e.transitionEnd()})},0))})):e.velocity?(c("_freeModeNoMomentumRelease"),e.updateProgress(s),e.setTransition(m),e.setTranslate(s),e.transitionStart(!0,e.swipeDirection),e.animating||(e.animating=!0,L(_,()=>{!e||e.destroyed||e.transitionEnd()}))):e.updateProgress(s),e.updateActiveIndex(),e.updateSlidesClasses()}else if(r.freeMode.sticky){e.slideToClosest();return}else r.freeMode&&c("_freeModeNoMomentumRelease");(!r.freeMode.momentum||h>=r.longSwipesMs)&&(c("_freeModeStaticRelease"),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses())}Object.assign(e,{freeMode:{onTouchStart:g,onTouchMove:y,onTouchEnd:k}})}function pe({views:e,productId:d,slug:c,link:u,backHref:g="/marketplace"}){const y=typeof window<"u"?u||`${window.location.origin}/product/${c}`:"",k=()=>{y&&navigator.clipboard.writeText(y).then(()=>alert("Link copied to clipboard!")).catch(r=>console.error("Failed to copy link:",r))},x=r=>{if(typeof window<"u"&&window.history.length>1){r.preventDefault(),window.history.back();return}g&&(r.preventDefault(),I.visit(g,{preserveScroll:!1,preserveState:!1}))};return t.jsxs("section",{className:"prodcut-detail-links product-detail-header-section",style:{paddingTop:"100px"},children:[t.jsx("div",{className:"container-fluid",children:t.jsxs("div",{className:"row",children:[t.jsx("div",{className:"col-md-6",children:t.jsxs("div",{className:"product-back-and-head",children:[t.jsx(z,{href:g||"/marketplace",onClick:x,children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{children:"Product Detail"})]})}),t.jsx("div",{className:"col-md-6",children:t.jsxs("div",{className:"product-copy-and-view",children:[t.jsxs("span",{style:{display:"flex",alignItems:"center"},children:[t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",style:{marginRight:"8px"},children:[t.jsx("path",{d:"M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z",fill:"#43ACE9",stroke:"#43ACE9",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),t.jsx("path",{d:"M12.0001 20.2702C15.5301 20.2702 18.8201 18.1902 21.1101 14.5902C22.0101 13.1802 22.0101 10.8102 21.1101 9.40021C18.8201 5.80021 15.5301 3.72021 12.0001 3.72021C8.47009 3.72021 5.18009 5.80021 2.89009 9.40021C1.99009 10.8102 1.99009 13.1802 2.89009 14.5902C5.18009 18.1902 8.47009 20.2702 12.0001 20.2702Z",stroke:"#43ACE9",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),e||0]}),t.jsxs("button",{onClick:k,className:"copy-link-button",style:{display:"flex",alignItems:"center"},children:[t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",style:{marginRight:"12px"},children:[t.jsx("path",{d:"M20.3601 12.7301C19.9901 12.7301 19.6801 12.4501 19.6401 12.0801C19.4001 9.88007 18.2201 7.90007 16.4001 6.64007C16.0701 6.41007 15.9901 5.96007 16.2201 5.63007C16.4501 5.30007 16.9001 5.22007 17.2301 5.45007C19.4001 6.96007 20.8001 9.32007 21.0901 11.9301C21.1301 12.3301 20.8401 12.6901 20.4401 12.7301C20.4101 12.7301 20.3901 12.7301 20.3601 12.7301Z",fill:"#23262F"}),t.jsx("path",{d:"M3.74029 12.7802C3.72029 12.7802 3.69029 12.7802 3.67029 12.7802C3.27029 12.7402 2.98029 12.3802 3.02029 11.9802C3.29029 9.3702 4.67029 7.0102 6.82029 5.4902C7.14029 5.2602 7.60029 5.3402 7.83029 5.6602C8.06029 5.9902 7.98029 6.4402 7.66029 6.6702C5.86029 7.9502 4.69029 9.9302 4.47029 12.1202C4.43029 12.5002 4.11029 12.7802 3.74029 12.7802Z",fill:"#23262F"}),t.jsx("path",{d:"M15.9896 21.0998C14.7596 21.6898 13.4396 21.9898 12.0596 21.9898C10.6196 21.9898 9.24961 21.6698 7.96961 21.0198C7.60961 20.8498 7.46961 20.4098 7.64961 20.0498C7.81961 19.6898 8.25961 19.5498 8.61961 19.7198C9.24961 20.0398 9.91961 20.2598 10.5996 20.3898C11.5196 20.5698 12.4596 20.5798 13.3796 20.4198C14.0596 20.2998 14.7296 20.0898 15.3496 19.7898C15.7196 19.6198 16.1596 19.7598 16.3196 20.1298C16.4996 20.4898 16.3596 20.9298 15.9896 21.0998Z",fill:"#23262F"}),t.jsx("path",{d:"M12.0505 2.00977C10.5005 2.00977 9.23047 3.26977 9.23047 4.82977C9.23047 6.38977 10.4905 7.64977 12.0505 7.64977C13.6105 7.64977 14.8705 6.38977 14.8705 4.82977C14.8705 3.26977 13.6105 2.00977 12.0505 2.00977Z",fill:"#23262F"}),t.jsx("path",{d:"M5.05047 13.8701C3.50047 13.8701 2.23047 15.1301 2.23047 16.6901C2.23047 18.2501 3.49047 19.5101 5.05047 19.5101C6.61047 19.5101 7.87047 18.2501 7.87047 16.6901C7.87047 15.1301 6.60047 13.8701 5.05047 13.8701Z",fill:"#23262F"}),t.jsx("path",{d:"M18.9499 13.8701C17.3999 13.8701 16.1299 15.1301 16.1299 16.6901C16.1299 18.2501 17.3899 19.5101 18.9499 19.5101C20.5099 19.5101 21.7699 18.2501 21.7699 16.6901C21.7699 15.1301 20.5099 13.8701 18.9499 13.8701Z",fill:"#23262F"})]}),"Share"]})]})})]})}),t.jsx("style",{children:`
                            @media (max-width: 767px) {
                                   .product-detail-header-section {
                                          padding-top: 36px !important;
                                   }
                            }
                     `})]})}function me({albumImages:e,videos:d=null,status:c,mainImage:u,listType:g,startDate:y,endDate:k,youtubeVideoId:x=null}){let r=[];if(Array.isArray(e))r=e;else if(typeof e=="string")try{r=JSON.parse(e.replace(/\\/g,""))}catch{r=[]}const[_,a]=T.useState(null);let i=[];if(Array.isArray(d))i=d;else if(typeof d=="string"&&d)try{i=JSON.parse(d.replace(/\\/g,""))}catch{}const l=o=>{if(!o||typeof o!="string")return!1;const w=[".mp4",".webm",".ogg",".avi",".mov",".wmv",".flv",".mkv"],b=o.toLowerCase().substring(o.lastIndexOf("."));return w.includes(b)},f=r.map(o=>({type:l(o)?"video":"image",src:o})),h=i.map(o=>({type:"video",src:o})),p=[...x&&typeof x=="string"&&x.length===11?[{type:"youtube",src:x}]:[],...f,...h];p.length===0&&u&&p.push({type:"image",src:u});const s=T.useRef(null),j=T.useRef(null),N=o=>o?o.startsWith("http")?o:`https://admin.xpertbid.com/${o.startsWith("/")?o.slice(1):o}`:"";return t.jsxs("div",{className:"product-images-parent m-0",children:[t.jsxs("div",{className:"product-main-image",style:{position:"relative"},children:[(c==="awarded"||c==="awarded ")&&t.jsx("div",{className:"awardedBadge",style:{position:"absolute",bottom:"20px",left:"50%",transform:"translateX(-50%)",zIndex:20,background:"linear-gradient(135deg, #43ACE9 0%, #0ea5e9 100%)",color:"white",padding:"8px 24px",borderRadius:"50px",fontWeight:"800",fontSize:"0.9rem",letterSpacing:"1.5px",textTransform:"uppercase",boxShadow:"0 10px 15px -3px rgba(67, 172, 233, 0.4)",whiteSpace:"nowrap",border:"2px solid rgba(255, 255, 255, 0.2)",animation:"pulseGlow 2s infinite"},children:"AWARDED"}),(c==="sold_out"||c==="sold out")&&t.jsx("div",{className:"soldOutBadge",style:{position:"absolute",bottom:"20px",left:"50%",transform:"translateX(-50%)",zIndex:20,background:"linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",color:"white",padding:"8px 24px",borderRadius:"50px",fontWeight:"800",fontSize:"0.9rem",letterSpacing:"1.5px",textTransform:"uppercase",boxShadow:"0 10px 15px -3px rgba(220, 38, 38, 0.35)",whiteSpace:"nowrap",border:"2px solid rgba(255, 255, 255, 0.2)"},children:"SOLD OUT"}),String(g||"").toLowerCase()==="auction"&&k&&!(c==="sold_out"||c==="sold out")&&t.jsx("div",{style:{position:"absolute",left:"0",right:"0",bottom:"18px",zIndex:15,pointerEvents:"none"},children:t.jsx(le,{startDate:y,endDate:k,className:"detail-image-timer"})}),t.jsx("button",{ref:s,className:"btn-prev",style:{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",zIndex:20,border:"none",background:"rgba(0,0,0,0.45)",color:"#fff",width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px"},children:"‹"}),t.jsx("button",{ref:j,className:"btn-next",style:{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",zIndex:20,border:"none",background:"rgba(0,0,0,0.45)",color:"#fff",width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px"},children:"›"}),t.jsx(D,{style:{"--swiper-navigation-color":"#fff","--swiper-pagination-color":"#fff",margin:"0px"},loop:p.length>1,spaceBetween:10,navigation:{prevEl:s.current,nextEl:j.current},onBeforeInit:o=>{o.params.navigation.prevEl=s.current,o.params.navigation.nextEl=j.current},thumbs:{swiper:_&&!_.destroyed?_:null},modules:[X,F,U],className:"mySwiper2 m-0",children:p.map((o,w)=>t.jsx(O,{style:{margin:"0px"},children:t.jsx("div",{className:"pro-image-main",style:{position:"relative",width:"100%",minHeight:"500px"},children:o.type==="youtube"?t.jsx("div",{style:{position:"relative",width:"100%",minHeight:"500px",background:"#000",borderRadius:"10px",overflow:"hidden"},children:t.jsx("iframe",{title:"YouTube live stream",src:`https://www.youtube-nocookie.com/embed/${encodeURIComponent(o.src)}?rel=0`,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0,loading:"lazy",referrerPolicy:"strict-origin-when-cross-origin",style:{position:"absolute",inset:0,width:"100%",height:"100%",border:0}})}):o.type==="image"?t.jsx("img",{src:N(o.src),alt:`Product ${w}`,style:{width:"100%",height:"100%",minHeight:"500px",objectFit:"cover",borderRadius:"10px"},onError:b=>{b.target.src="/assets/images/hero-prodcut1.jpg"}}):t.jsx("video",{controls:!0,style:{width:"100%",height:"100%",minHeight:"500px",objectFit:"cover",borderRadius:"10px"},children:t.jsx("source",{src:N(o.src),type:"video/mp4"})})})},w))}),t.jsx("style",{children:`
                                   @keyframes pulseGlow {
                                          0% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0.7); }
                                          50% { transform: translateX(-50%) scale(1.05); box-shadow: 0 0 0 10px rgba(67, 172, 233, 0); }
                                          100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0); }
                                   }
                                   @keyframes timerFloat {
                                          0%, 100% { transform: translateY(0); }
                                          50% { transform: translateY(-2px); }
                                   }
                                   @keyframes timerGlow {
                                          0%, 100% { box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28); }
                                          50% { box-shadow: 0 14px 28px rgba(67, 172, 233, 0.28); }
                                   }
                                   @keyframes digitPulse {
                                          0%, 100% { transform: scale(1); opacity: 1; }
                                          50% { transform: scale(1.06); opacity: 0.96; }
                                   }
                                   .detail-image-timer.counter {
                                          position: relative;
                                          margin: 0 auto;
                                          width: calc(100% - 32px);
                                          max-width: 360px;
                                          background: rgba(28, 29, 32, 0.88);
                                          padding: 10px 14px;
                                          border-radius: 12px;
                                          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
                                          backdrop-filter: blur(4px);
                                          border: 1px solid rgba(255, 255, 255, 0.08);
                                          animation: timerFloat 2.8s ease-in-out infinite, timerGlow 2.8s ease-in-out infinite;
                                   }
                                   .detail-image-timer .counter-grid {
                                          display: grid;
                                          grid-template-columns: repeat(4, 1fr);
                                          gap: 8px;
                                          align-items: stretch;
                                   }
                                   .detail-image-timer .counter-box {
                                          display: flex;
                                          flex-direction: column;
                                          align-items: center;
                                          justify-content: center;
                                          min-width: 0;
                                   }
                                   .detail-image-timer .counter-value {
                                          color: #fff;
                                          font-size: 18px;
                                          font-weight: 800;
                                          line-height: 1.1;
                                          text-align: center;
                                          white-space: nowrap;
                                          animation: digitPulse 1.2s ease-in-out infinite;
                                    }
                                    .detail-image-timer .counter-label {
                                          color: rgba(255, 255, 255, 0.88);
                                          font-size: 9px;
                                          font-weight: 600;
                                          text-transform: uppercase;
                                          letter-spacing: 0.5px;
                                          text-align: center;
                                          white-space: nowrap;
                                   }
                                    @media (max-width: 575px) {
                                          .detail-image-timer.counter {
                                                 width: calc(100% - 20px);
                                                 padding: 8px 10px;
                                          }
                                          .detail-image-timer .counter-grid {
                                                 gap: 6px;
                                          }
                                          .detail-image-timer .counter-value {
                                                 font-size: 16px;
                                          }
                                          .detail-image-timer .counter-label {
                                                 font-size: 8px;
                                          }
                                   }
                            `})]}),t.jsx("div",{className:"product-images-album",style:{height:"auto",marginTop:"15px",paddingBottom:"5px"},children:t.jsx(D,{onSwiper:a,loop:p.length>4,spaceBetween:10,slidesPerView:"auto",freeMode:!0,watchSlidesProgress:!0,modules:[X,F,U],className:"mySwiper product-thumb-swiper",children:p.map((o,w)=>t.jsx(O,{className:"product-thumb-slide",children:t.jsx("div",{className:"pro-image product-thumb-frame",children:o.type==="youtube"?t.jsx("div",{style:{position:"relative",width:"100%",height:"100%",background:`url(https://img.youtube.com/vi/${o.src}/hqdefault.jpg) center/cover`,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"},children:t.jsx("span",{style:{width:34,height:34,borderRadius:"50%",background:"rgba(220, 38, 38, 0.92)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 16px rgba(0,0,0,0.25)"},children:t.jsx("i",{className:"fa-solid fa-play",style:{fontSize:13,marginLeft:2}})})}):o.type==="image"?t.jsx("img",{src:N(o.src),alt:`Thumb ${w}`,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px"},onError:b=>{b.target.src="/assets/images/hero-prodcut1.jpg"}}):t.jsx("div",{style:{position:"relative",width:"100%",height:"100%",background:"#000",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"},children:t.jsx("i",{className:"fa-solid fa-play text-white"})})})},w))})}),t.jsx("style",{children:`
                            .product-thumb-swiper {
                                   width: 100%;
                                   padding: 2px 0 8px;
                            }
                            .product-thumb-swiper .swiper-wrapper {
                                   align-items: flex-start;
                            }
                            .product-thumb-slide {
                                   width: 76px !important;
                                   height: 88px !important;
                                   flex: 0 0 76px;
                            }
                            .product-thumb-frame {
                                   width: 76px;
                                   height: 88px;
                                   min-width: 76px;
                                   max-width: 76px;
                                   min-height: 88px;
                                   max-height: 88px;
                                   position: relative;
                                   overflow: hidden;
                                   border-radius: 8px;
                                   background: #f1f5f9;
                            }
                            .product-thumb-frame img,
                            .product-thumb-frame video {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                            }
                            @media (max-width: 575px) {
                                   .product-thumb-slide {
                                          width: 64px !important;
                                          height: 76px !important;
                                          flex-basis: 64px;
                                   }
                                   .product-thumb-frame {
                                          width: 64px;
                                          height: 76px;
                                          min-width: 64px;
                                          max-width: 64px;
                                          min-height: 76px;
                                          max-height: 76px;
                                   }
                            }
                     `})]})}function ue({items:e}){return!e||e.length===0?null:t.jsx("section",{className:"featured-product related-items-section",children:t.jsxs("div",{className:"container-fluid ps-sm-5",children:[t.jsx("div",{className:"product-detail",children:t.jsx("h2",{children:"Other items of interest"})}),t.jsx("div",{className:"swiper-featured-product related-items-slider",children:t.jsx(D,{modules:[F],navigation:e.length>4,spaceBetween:30,loop:e.length>4,breakpoints:{390:{slidesPerView:1},550:{slidesPerView:2},888:{slidesPerView:2},1024:{slidesPerView:3.2},1367:{slidesPerView:3.6},1567:{slidesPerView:4}},children:e.map(d=>t.jsx(O,{children:t.jsx(de,{auction:d})},d.id))})})]})})}const M=({title:e,children:d,defaultOpen:c=!1})=>{const[u,g]=T.useState(c);return t.jsxs("div",{className:`xb-accordion ${u?"open":""}`,children:[t.jsxs("button",{type:"button",className:"xb-acc-head",onClick:()=>g(y=>!y),"aria-expanded":u,children:[t.jsx("span",{children:e}),t.jsx("i",{className:`fa-solid ${u?"fa-chevron-up":"fa-chevron-down"}`})]}),u&&t.jsx("div",{className:"xb-acc-body",children:d})]})},he=["January","February","March","April","May","June","July","August","September","October","November","December"];function Z(e){if(!e)return"";const d=new Date(e);if(isNaN(d))return e;const c=String(d.getDate()).padStart(2,"0"),u=String(d.getMonth()+1).padStart(2,"0"),g=he[d.getMonth()];return`${c}/${u}/${g}`}const q=e=>e?String(e).startsWith("http")||String(e).startsWith("/")?e:`/${String(e).replace(/^\/+/,"")}`:"/assets/images/WebsiteBanner2.png",K=e=>{if(typeof e!="string")return"";const d=e.trim();if(!d)return"";try{const c=JSON.parse(d);return JSON.stringify(c)}catch{const u=d.replace(/^\s*html\s*/i,"").replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i,"").replace(/<\/script>\s*$/i,"").trim();if(!u)return"";try{const g=JSON.parse(u);return JSON.stringify(g)}catch{return""}}},xe=e=>{if(typeof e!="string")return[];const d=e.trim();if(!d)return[];const c=[...d.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];if(c.length>0)return c.map(g=>K(g[1]||"")).filter(Boolean);const u=K(d);return u?[u]:[]};function Pe({auction:e,bids:d,related:c,highestBid:u,winnerDetails:g,isFavorite:y,dynamicFields:k=[],liveVideoId:x=null,liveActiveAuction:r=null,marketplaceBackUrl:_=null}){const{auth:a}=ie().props,i=String(e?.listing_type||"").toLowerCase(),l=String(e?.status||"").trim().toLowerCase(),f=i==="live_auction"&&l==="active",[h,m]=T.useState(""),[p,s]=T.useState(!1),j=x||e?.youtube_video_id,N=xe(e?.category?.schema_markup),o=e?.category_features&&typeof e.category_features=="object"?e.category_features:{},w=k.reduce((n,v)=>{const C=String(v?.field_name||"").trim();return C&&(n[C]=(n[C]||0)+1),n},{}),b=n=>String(n||"").replace(/^field_/,"").replace(/__\d+$/,"").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/\b\w/g,v=>v.toUpperCase()),S=n=>n==null||n===""?"":typeof n=="boolean"?n?"Yes":"No":Array.isArray(n)?n.join(", "):String(n),P=new Set,A=k.map(n=>{const v=`field_${n.id}`,C=String(n?.field_name||"").trim(),E=w[C]>1?`${C}__${n.id}`:C,te=o[v]??o[E]??o[C]??"",$=S(te);return $?(P.add(v),C&&P.add(C),E&&P.add(E),{key:v,label:n?.label||b(C||v),value:$}):null}).filter(Boolean),Q=Object.entries(o).filter(([n,v])=>!P.has(n)&&S(v)).map(([n,v])=>({key:n,label:b(n),value:S(v)})),V=[...A,...Q];T.useEffect(()=>{if(i!=="live_auction")return;const n=()=>{I.reload({only:["auction","bids","highestBid","winnerDetails","liveVideoId","liveActiveAuction"],preserveScroll:!0,preserveState:!0,showProgress:!1})},v=window.setInterval(n,2500);return()=>window.clearInterval(v)},[i]),T.useEffect(()=>{if(i==="live_auction"&&l==="closed"){I.visit("/live-auctions",{replace:!0,preserveScroll:!1,preserveState:!1});return}i==="live_auction"&&r?.slug&&r.slug!==e?.slug&&I.visit(route("product.show",r.slug),{replace:!0,preserveScroll:!1,preserveState:!1})},[i,l,r?.slug,e?.slug]);const ee=()=>{if(!a?.user){window.alert("Please login to place a bid");return}if(!h||Number(h)<=Number(u||0)){window.alert("Bid must be higher than the current highest bid");return}s(!0),I.post("/bids",{listing_id:e.id,bid_amount:h,bid_source:"web"},{preserveScroll:!0,onSuccess:()=>{m(""),I.reload({only:["auction","bids","highestBid","winnerDetails","liveVideoId","liveActiveAuction"],preserveScroll:!0,preserveState:!0,showProgress:!1})},onError:n=>{const v=Object.values(n||{}).flat().join(`
`)||"Failed to place bid";window.alert(v)},onFinish:()=>s(!1)})};return i==="live_auction"?t.jsx(ce,{children:t.jsxs(re,{children:[t.jsxs(H,{children:[t.jsx("title",{children:e.title}),t.jsx("meta",{name:"description",content:e.description?.substring(0,160)}),N.map((n,v)=>t.jsx("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:n}},`auction-schema-${v}`))]}),t.jsx("main",{className:"live-product-detail-page",children:t.jsxs("div",{className:"live-product-detail-grid",children:[t.jsxs("div",{className:"live-product-mobile-video-panel",children:[t.jsxs(z,{href:"/live-auctions",className:"live-product-back-btn live-product-mobile-back-btn",children:[t.jsx("i",{className:"fa-solid fa-arrow-left"}),t.jsx("span",{children:"Back to Live Auction"})]}),t.jsx("div",{className:"live-product-video-wrap",children:j?t.jsx(Y,{videoId:j,title:e.title}):t.jsx("img",{src:q(e.image_url),alt:e.title})})]}),t.jsxs("div",{className:"live-product-mobile-controls",children:[t.jsx("h1",{children:e.title}),t.jsxs("div",{className:"live-product-mobile-highest",children:[t.jsx("span",{children:"Highest Bid"}),t.jsx("strong",{children:t.jsx(R,{amountAED:u||0})})]}),t.jsx("input",{type:"number",placeholder:"Enter amount",value:h,onChange:n=>m(n.target.value),disabled:p}),t.jsx("button",{type:"button",onClick:ee,disabled:p,children:p?"Placing Bid...":"Place Bid"}),t.jsxs("div",{className:"live-product-mobile-prices",children:[t.jsxs("span",{children:["Starting bid price: ",t.jsx("b",{children:t.jsx(R,{amountAED:e.minimum_bid||e.listing_data?.start_price||0})})]}),t.jsxs("span",{children:["Market Value: ",t.jsx("b",{children:t.jsx(R,{amountAED:e.reserve_price||e.listing_data?.reserve_price||0})})]})]})]}),t.jsxs("div",{className:"live-product-main-panel",children:[t.jsx("div",{className:"live-product-video-wrap",children:j?t.jsx(Y,{videoId:j,title:e.title}):t.jsx("img",{src:q(e.image_url),alt:e.title})}),t.jsx(W,{product:e,highestBidProp:u,onBidPlaced:()=>{I.reload({only:["auction","bids","highestBid","winnerDetails","liveVideoId","liveActiveAuction"],preserveScroll:!0,preserveState:!0,showProgress:!1})},winnerDetails:g,isFavoriteProp:y})]}),t.jsxs("aside",{className:"live-product-side-panel live-product-chat-panel",children:[t.jsx("div",{className:"live-product-chat-actions",children:t.jsxs(z,{href:"/live-auctions",className:"live-product-back-btn",children:[t.jsx("i",{className:"fa-solid fa-arrow-left"}),t.jsx("span",{children:"Back to Live Auction"})]})}),t.jsx("div",{className:"live-product-panel-heading",children:t.jsx("h2",{children:"Live Chat"})}),t.jsx(G,{listingId:e.id,listingSlug:e.slug})]}),t.jsx("aside",{className:"live-product-side-panel live-product-bids-panel",children:t.jsx(J,{bids:d})})]})}),t.jsx("style",{children:`
                                   html,
                                   body {
                                          overflow: hidden;
                                   }

                                   .live-product-detail-page {
                                          background: #f5f7fb;
                                          padding: 8px 16px 14px;
                                          min-height: 100vh;
                                          height: 100vh;
                                          display: flex;
                                          flex-direction: column;
                                          overflow: hidden;
                                   }

                                   .live-product-back-btn {
                                          display: inline-flex;
                                          align-items: center;
                                          justify-content: center;
                                          gap: 6px;
                                          min-height: 34px;
                                          padding: 0 12px;
                                          border-radius: 8px;
                                          background: #f8fafc;
                                          color: #111827;
                                          border: 1px solid #e5e7eb;
                                          text-decoration: none;
                                          font-size: 12px;
                                          font-weight: 900;
                                   }

                                   .live-product-detail-grid {
                                          width: min(1480px, 100%);
                                          margin: 0 auto;
                                          display: grid;
                                          grid-template-columns: minmax(420px, 1.25fr) minmax(300px, 0.75fr) minmax(320px, 0.8fr);
                                          gap: 16px;
                                          align-items: stretch;
                                          flex: 1 1 auto;
                                          min-height: 0;
                                   }

                                   .live-product-main-panel,
                                   .live-product-mobile-video-panel,
                                   .live-product-mobile-controls,
                                   .live-product-side-panel {
                                          background: #ffffff;
                                          border: 1px solid #e5e7eb;
                                          border-radius: 10px;
                                          box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
                                          overflow: hidden;
                                   }

                                   .live-product-mobile-video-panel {
                                          display: none;
                                          padding: 10px;
                                    }

                                   .live-product-mobile-controls {
                                          display: none;
                                   }

                                   .live-product-main-panel {
                                          padding: 14px;
                                          min-height: 0;
                                          overflow-y: auto;
                                   }

                                   .live-product-video-wrap {
                                          margin-bottom: 14px;
                                          height: clamp(230px, 39vh, 390px);
                                          background: #000000;
                                          border-radius: 10px;
                                          overflow: hidden;
                                   }

                                   .live-product-video-wrap .xb-youtube-embed,
                                   .live-product-video-wrap .ratio {
                                          height: 100% !important;
                                          padding-bottom: 0 !important;
                                          border: 0 !important;
                                          border-radius: 10px !important;
                                          box-shadow: none !important;
                                   }

                                   .live-product-video-wrap img {
                                          width: 100%;
                                          height: 100%;
                                          object-fit: cover;
                                          display: block;
                                   }

                                   .live-product-main-panel .product-details-brief-parent {
                                          padding: 0 !important;
                                   }

                                   .live-product-main-panel .product-heading {
                                          font-size: clamp(20px, 2vw, 28px);
                                          line-height: 1.05;
                                          margin-bottom: 12px !important;
                                   }

                                   .live-product-main-panel .owned-by-and-favoruite {
                                          display: none !important;
                                   }

                                   .live-product-main-panel .detail-auction-strip {
                                          border-radius: 10px;
                                          padding: 14px 16px;
                                          margin-bottom: 12px !important;
                                   }

                                   .live-product-main-panel .detail-auction-meta .price {
                                          font-size: clamp(24px, 2.3vw, 32px);
                                   }

                                   .live-product-main-panel .bid-input-wrap input,
                                   .live-product-main-panel .bid-input-wrap button {
                                          height: 44px !important;
                                          font-size: 15px !important;
                                   }

                                   .live-product-main-panel .min-bid-and-estimate {
                                          gap: 12px;
                                          flex-wrap: wrap;
                                   }

                                   .live-product-side-panel {
                                          padding: 18px;
                                          min-height: 0;
                                          overflow: hidden;
                                          display: flex;
                                          flex-direction: column;
                                   }

                                   .live-product-bids-panel {
                                          overflow-y: auto;
                                          order: 2;
                                   }

                                   .live-product-chat-panel {
                                          order: 3;
                                   }

                                   .live-product-side-panel .bid-history-parent {
                                          margin: 0;
                                          box-shadow: none;
                                          border: 0;
                                          padding: 0;
                                          height: 100%;
                                          min-height: 0;
                                          display: flex;
                                          flex-direction: column;
                                          flex: 1 1 auto;
                                   }

                                   .live-product-side-panel .bid-history-header {
                                          padding: 8px 0 16px;
                                          margin-bottom: 16px;
                                          border-bottom: 1px solid #e5e7eb;
                                   }

                                   .live-product-side-panel .bid-history-header .description {
                                          font-size: 18px;
                                          font-weight: 950;
                                          color: #111827;
                                          margin: 0;
                                          padding: 0;
                                          letter-spacing: 0;
                                   }

                                   .live-product-side-panel .bid-history-scroll {
                                          max-height: none;
                                          flex: 0 0 auto;
                                          min-height: auto;
                                          overflow: visible;
                                          padding: 0 4px 4px;
                                   }

                                   .live-product-side-panel .bid-history-scroll > .text-center {
                                          min-height: 260px;
                                          border-radius: 10px;
                                          background: #f8fafc;
                                          border: 1px dashed #dbe3ee;
                                          display: flex;
                                          align-items: center;
                                          justify-content: center;
                                          color: #64748b !important;
                                          font-size: 16px;
                                          font-weight: 800;
                                          margin: 0 !important;
                                    }

                                   .live-product-side-panel .history-user.parent {
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          gap: 12px;
                                          padding: 12px;
                                          margin-bottom: 10px;
                                          border: 1px solid #edf2f7;
                                          border-radius: 10px;
                                          background: #ffffff;
                                          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
                                   }

                                   .live-product-side-panel .history-user-profile {
                                          display: flex;
                                          align-items: center;
                                          min-width: 0;
                                   }

                                   .live-product-side-panel .history-user-name,
                                   .live-product-side-panel .history-no {
                                          margin: 0;
                                   }

                                   .live-product-side-panel .history-user-name {
                                          color: #111827;
                                          font-size: 13px;
                                          font-weight: 900;
                                   }

                                   .live-product-side-panel .username-and-date .date {
                                          color: #64748b;
                                          font-size: 11px;
                                          font-weight: 700;
                                   }

                                   .live-product-side-panel .history-user-payAmount {
                                          flex: 0 0 auto;
                                          color: #111827;
                                          font-size: 13px;
                                          font-weight: 950;
                                   }

                                   .live-product-side-panel .history-user-payAmount .price,
                                   .live-product-side-panel .history-user-payAmount span {
                                          font-size: 16px !important;
                                          line-height: 1.1;
                                    }

                                   .live-product-panel-heading {
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          padding: 0 0 14px;
                                          margin-bottom: 14px;
                                          border-bottom: 1px solid #e5e7eb;
                                   }

                                   .live-product-panel-heading h2 {
                                          font-size: 18px;
                                          font-weight: 950;
                                          color: #111827;
                                          margin: 0;
                                          letter-spacing: 0;
                                   }

                                   .live-product-chat-actions {
                                          display: flex;
                                          justify-content: flex-end;
                                          margin-bottom: 12px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat {
                                          min-height: 0;
                                          flex: 1 1 auto;
                                          height: auto !important;
                                          border: 0 !important;
                                          border-radius: 0 !important;
                                          box-shadow: none !important;
                                          background: transparent !important;
                                          overflow: hidden !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .border-bottom {
                                          background: #f8fafc !important;
                                          border: 1px solid #e5e7eb !important;
                                          border-radius: 10px 10px 0 0;
                                          padding: 10px 12px !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .border-bottom .small {
                                          color: #334155 !important;
                                          font-size: 13px;
                                          letter-spacing: 0.02em;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat .badge {
                                          background: #111827 !important;
                                          color: #ffffff !important;
                                          border-radius: 999px;
                                          padding: 5px 9px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 {
                                          background: #ffffff;
                                          border-left: 1px solid #e5e7eb;
                                          border-right: 1px solid #e5e7eb;
                                          padding: 12px !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div {
                                          border: 1px solid #edf2f7 !important;
                                          border-radius: 10px;
                                          padding: 10px 12px !important;
                                          margin-bottom: 10px !important;
                                          background: #f8fafc;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .fw-semibold {
                                          color: #111827 !important;
                                          font-size: 13px;
                                          font-weight: 900 !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .text-muted {
                                          color: #64748b !important;
                                          font-size: 11px;
                                          font-weight: 700;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .text-body {
                                          color: #334155 !important;
                                          font-size: 13px;
                                          line-height: 1.45;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > form {
                                          background: #f8fafc !important;
                                          border: 1px solid #e5e7eb !important;
                                          border-radius: 0 0 10px 10px;
                                          padding: 8px !important;
                                          flex: 0 0 auto;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > form > .d-flex {
                                          align-items: center;
                                          gap: 8px !important;
                                          min-height: 40px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat input {
                                          height: 40px;
                                          min-height: 40px;
                                          border: 1px solid #dbe3ee;
                                          border-radius: 8px;
                                          box-shadow: none !important;
                                          font-size: 13px;
                                          padding: 0 12px !important;
                                          line-height: 40px;
                                          margin: 0 !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat button[type="submit"] {
                                          width: 44px;
                                          min-width: 44px;
                                          height: 40px;
                                          min-height: 40px;
                                          border-radius: 8px;
                                          background: #111827;
                                          border-color: #111827;
                                          font-weight: 900;
                                          display: inline-flex;
                                          align-items: center;
                                          justify-content: center;
                                          padding: 0 !important;
                                          margin: 0 !important;
                                          line-height: 1;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat button[type="submit"] i {
                                          font-size: 15px;
                                    }

                                   @media (max-width: 1199px) {
                                          html,
                                          body {
                                                 overflow: auto;
                                          }

                                          .live-product-detail-page {
                                                 height: auto;
                                                 min-height: 100vh;
                                                 overflow: visible;
                                          }

                                          .live-product-detail-grid {
                                                 grid-template-columns: 1fr 1fr;
                                                 overflow-y: auto;
                                          }

                                          .live-product-main-panel {
                                                 grid-column: 1 / -1;
                                                 overflow-y: visible;
                                          }
                                   }

                                   @media (max-width: 767px) {
                                          html,
                                          body {
                                                 overflow: hidden;
                                          }

                                          .live-product-detail-page {
                                                 padding: 8px 10px 16px;
                                                 height: 100vh;
                                                 min-height: 100vh;
                                                 overflow: hidden;
                                          }

                                          .live-product-video-wrap {
                                                 height: 178px;
                                                 margin-bottom: 12px;
                                          }

                                          .live-product-detail-grid {
                                                 display: flex;
                                                 flex-direction: column;
                                                 grid-template-columns: 1fr;
                                                 overflow-y: auto;
                                                 align-items: start;
                                                 padding-top: 236px;
                                                 padding-bottom: 18px;
                                          }

                                          .live-product-main-panel,
                                          .live-product-mobile-video-panel,
                                          .live-product-mobile-controls,
                                          .live-product-side-panel {
                                                 border-radius: 8px;
                                                 overflow: visible;
                                          }

                                          .live-product-mobile-video-panel {
                                                 display: block;
                                                 order: 1;
                                                 position: fixed;
                                                 top: 8px;
                                                 left: 10px;
                                                 right: 10px;
                                                 z-index: 30;
                                                 padding: 8px;
                                                 background: #ffffff;
                                                  overflow: hidden;
                                                 height: 228px;
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 8px;
                                          }

                                          .live-product-mobile-back-btn {
                                                 align-self: flex-start;
                                                 min-height: 32px;
                                                 background: #ffffff;
                                          }

                                          .live-product-mobile-video-panel .live-product-video-wrap {
                                                margin-bottom: 0;
                                                 height: 170px;
                                          }

                                          .live-product-main-panel {
                                                 padding: 10px;
                                                 order: 2;
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 0;
                                                 display: none;
                                          }

                                          .live-product-main-panel > .live-product-video-wrap {
                                                 display: none;
                                          }

                                          .live-product-mobile-controls {
                                                 display: flex;
                                                 flex-direction: column;
                                                 order: 2;
                                                 padding: 12px;
                                                 gap: 12px;
                                                 margin-top: 0;
                                                 width: 100%;
                                                 align-self: stretch;
                                                 box-sizing: border-box;
                                          }

                                          .live-product-mobile-controls h1 {
                                                 color: #111827;
                                                 font-size: 20px;
                                                 font-weight: 950;
                                                 line-height: 1.2;
                                                 margin: 0;
                                          }

                                          .live-product-mobile-highest {
                                                 border: 1px solid #e5e7eb;
                                                 border-radius: 10px;
                                                 background: #f8fafc;
                                                 padding: 12px 14px;
                                          }

                                          .live-product-mobile-highest span {
                                                 display: block;
                                                 color: #64748b;
                                                 font-size: 11px;
                                                 font-weight: 800;
                                                 text-transform: uppercase;
                                                 letter-spacing: 0.04em;
                                                 margin-bottom: 6px;
                                          }

                                          .live-product-mobile-highest strong {
                                                 display: block;
                                                 color: #111827;
                                                 font-size: 28px;
                                                 line-height: 1.1;
                                                 font-weight: 950;
                                          }

                                          .live-product-mobile-controls input {
                                                 width: 100%;
                                                 height: 44px;
                                                 border: 1px solid #e5e7eb;
                                                 border-radius: 10px;
                                                 padding: 0 14px;
                                                 font-size: 14px;
                                                 outline: 0;
                                          }

                                          .live-product-mobile-controls button {
                                                 width: 100%;
                                                 height: 44px;
                                                 border: 0;
                                                 border-radius: 10px;
                                                 background: #23262f;
                                                 color: #ffffff;
                                                 font-size: 14px;
                                                 font-weight: 900;
                                          }

                                          .live-product-mobile-prices {
                                                 display: grid;
                                                 gap: 8px;
                                                 color: #64748b;
                                                 font-size: 14px;
                                          }

                                          .live-product-mobile-prices b {
                                                 color: #111827;
                                                 font-weight: 800;
                                          }

                                          .live-product-main-panel .product-details-brief-parent {
                                                 display: block !important;
                                                 padding: 0 !important;
                                          }

                                          .live-product-main-panel .product-heading {
                                                 display: block !important;
                                                 font-size: 20px !important;
                                                 line-height: 1.2 !important;
                                                 margin: 0 0 10px !important;
                                          }

                                          .live-product-main-panel .detail-auction-strip {
                                                 display: block !important;
                                                 padding: 12px 14px !important;
                                                 margin-bottom: 12px !important;
                                          }

                                          .live-product-main-panel .detail-auction-meta .rank {
                                                 display: block !important;
                                                 font-size: 11px !important;
                                          }

                                          .live-product-main-panel .detail-auction-meta .price {
                                                 display: block !important;
                                                 font-size: 28px !important;
                                                 line-height: 1.1 !important;
                                          }

                                          .live-product-main-panel .product-details-brief-parent,
                                          .live-product-main-panel .bid-input-wrap,
                                          .live-product-main-panel .min-bid-and-estimate {
                                                 position: static !important;
                                                 z-index: auto !important;
                                          }

                                          .live-product-main-panel .bid-input-wrap {
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 12px;
                                                 margin-bottom: 14px !important;
                                          }

                                          .live-product-main-panel .bid-input-wrap button {
                                                 position: static !important;
                                                 inset: auto !important;
                                                 transform: none !important;
                                                 display: flex !important;
                                                 align-items: center;
                                                 justify-content: center;
                                                 width: 100% !important;
                                                 margin: 0 !important;
                                                 z-index: auto !important;
                                          }

                                          .live-product-main-panel .min-bid-and-estimate {
                                                 display: grid !important;
                                                 grid-template-columns: 1fr;
                                                 gap: 8px;
                                                 margin-top: 0 !important;
                                          }

                                          .live-product-chat-panel {
                                                 order: 3;
                                                 position: relative;
                                                 z-index: 2;
                                                 margin-top: 12px;
                                                 width: 100%;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-chat-panel .live-product-chat-actions {
                                                 display: none;
                                          }

                                          .live-product-bids-panel {
                                                 order: 4;
                                                 position: relative;
                                                 z-index: 1;
                                                 margin-top: 14px;
                                                 width: 100%;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-bids-panel {
                                                 overflow: hidden;
                                          }

                                          .live-product-bids-panel .bid-history-parent {
                                                 height: auto;
                                                 min-height: auto;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-bids-panel .bid-history-scroll {
                                                 max-height: 246px;
                                                 overflow-y: auto;
                                                 padding-right: 4px;
                                          }

                                          .live-product-bids-panel .history-user.parent {
                                                 min-height: 66px;
                                          }

                                          .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 {
                                                 max-height: 252px;
                                                 min-height: 252px;
                                                 overflow-y: auto !important;
                                          }
                                   }
                            `})]})}):t.jsxs(ae,{title:e.title,children:[t.jsxs(H,{children:[t.jsx("meta",{name:"description",content:e.description?.substring(0,160)}),N.map((n,v)=>t.jsx("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:n}},`auction-live-schema-${v}`))]}),t.jsx(pe,{views:e.views,productId:e.id,slug:e.slug,backHref:_}),e.slug==="car-showcase-4-vkxgiyxw"&&t.jsx("div",{className:"container-fluid pt-3",children:t.jsxs("div",{className:"alert alert-primary d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0",role:"status",children:[t.jsxs("span",{className:"small mb-0",children:[t.jsx("strong",{children:"Live demo:"})," open the same auction with YouTube video, XpertBid live chat, and bidding in one layout."]}),t.jsx(z,{href:route("demo.live_auction_car_showcase"),className:"btn btn-sm btn-light text-primary fw-semibold",children:"Open live demo"})]})}),t.jsx("section",{className:"product-image-and-brief",children:t.jsx("div",{className:"container-fluid",children:t.jsx("div",{className:`products-brief-parent${e.featured_name==="home_featured"?" listing_promoted":""}`,children:t.jsxs("div",{className:"row",children:[t.jsx("div",{className:"col-md-6",children:t.jsx(me,{albumImages:e.album_urls,videos:e.video,status:e.status,mainImage:e.image_url,listType:e.list_type,startDate:e.start_date,endDate:e.end_date,youtubeVideoId:e.youtube_video_id})}),t.jsxs("div",{className:"col-md-6",children:[e.featured_name==="home_featured"&&t.jsx("div",{style:{display:"block"},children:t.jsxs("button",{type:"button",className:"pro_feature",disabled:!0,children:[t.jsx("i",{className:"fa-solid fa-bolt me-2"}),"Featured"]})}),t.jsx(W,{product:e,highestBidProp:u,onBidPlaced:()=>{},winnerDetails:g,isFavoriteProp:y})]})]})})})}),t.jsx("section",{className:"product-detailed-info",children:t.jsx("div",{className:"container-fluid",children:t.jsx("div",{className:"product-detailed-info-parent",children:t.jsxs("div",{className:"row justify-content-between",children:[t.jsx("div",{className:"col-lg-7 col-md-6",children:t.jsxs("div",{className:"x-accordions",children:[(e.description||e.product_location)&&t.jsx(M,{title:"Key Information",defaultOpen:!0,children:e.description&&t.jsx("div",{className:"mb-3",dangerouslySetInnerHTML:{__html:e.description}})}),V.length>0&&t.jsx(M,{title:"Additional Details",defaultOpen:!0,children:t.jsx("div",{className:"row gx-3 gy-2",children:V.map(n=>t.jsx("div",{className:"col-md-6",children:t.jsxs("div",{className:"d-flex justify-content-between align-items-center border rounded px-3 py-2",children:[t.jsx("span",{className:"text-muted small",children:n.label}),t.jsx("strong",{className:"small text-dark",children:n.value})]})},n.key))})}),(e.developer||e.delivery_date||e.sale_starts||e.payment_plan||e.number_of_buildings||e.government_fee)&&t.jsxs(M,{title:"Project by",children:[e.developer&&t.jsx("div",{className:"mb-3",children:t.jsx("div",{children:e.developer})}),e.delivery_date&&t.jsxs("div",{className:"mb-3",children:[t.jsx("h6",{className:"mb-1",children:"Delivery Date"}),t.jsx("div",{children:Z(e.delivery_date)})]}),e.sale_starts&&t.jsxs("div",{className:"mb-3",children:[t.jsx("h6",{className:"mb-1",children:"Sale Starts"}),t.jsx("div",{children:Z(e.sale_starts)})]}),e.payment_plan&&t.jsxs("div",{className:"mb-3",children:[t.jsx("h6",{className:"mb-1",children:"Payment Plan"}),t.jsx("div",{dangerouslySetInnerHTML:{__html:e.payment_plan}})]}),e.number_of_buildings&&t.jsxs("div",{className:"mb-3",children:[t.jsx("h6",{className:"mb-1",children:"Number of Buildings"}),t.jsx("div",{children:e.number_of_buildings})]}),e.government_fee&&t.jsxs("div",{className:"mb-1",children:[t.jsx("h6",{className:"mb-1",children:"Government Fee"}),t.jsx("div",{dangerouslySetInnerHTML:{__html:e.government_fee}})]})]}),e.location_url&&t.jsx(M,{title:"Location",children:t.jsx("div",{dangerouslySetInnerHTML:{__html:e.location_url},style:{width:"100%",display:"flex",justifyContent:"center",marginTop:"10px"}})}),e.amenities&&t.jsx(M,{title:"Amenities",children:t.jsx("div",{dangerouslySetInnerHTML:{__html:e.amenities}})}),e.facilities&&t.jsx(M,{title:"Facilities",children:t.jsx("div",{dangerouslySetInnerHTML:{__html:e.facilities}})}),e.nearby_location&&t.jsx(M,{title:"Location & Nearby Attractions",children:t.jsx("div",{dangerouslySetInnerHTML:{__html:e.nearby_location}})})]})}),e.list_type==="auction"&&t.jsx("div",{className:"col-lg-4 col-md-6",children:t.jsx(J,{bids:d})})]})})})}),f&&t.jsxs("section",{className:"container-fluid py-4 border-top",children:[t.jsx("h2",{className:"h5 fw-bold mb-3",children:"Auction live chat"}),t.jsxs("div",{className:"row g-3",children:[t.jsx("div",{className:"col-lg-5 col-xl-4",children:t.jsx(G,{listingId:e.id,listingSlug:e.slug})}),t.jsx("div",{className:"col-lg-7 col-xl-8",children:t.jsxs("p",{className:"text-muted small mb-0",children:["Public room for this listing. Sign in to send messages; everyone can read recent history. For private questions to the seller, use ",t.jsx(z,{href:route("chat.index"),children:"Messages"}),"."]})})]})]}),t.jsx(ue,{items:c})]})}export{Pe as default};
