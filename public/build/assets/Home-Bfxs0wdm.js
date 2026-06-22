import{j as a,L as j}from"./app-lu7_VoJP.js";import{A as se}from"./AppLayout-B0xpL7z0.js";import{m as T,c as ie,d as ne,s as Q,f as le,h as Z,g as U,j as ee,b as re,S as X,a as Y}from"./swiper-l5bT_C8n.js";import{u as I}from"./useSessionKeepAlive-Bkv9Dn-d.js";import{C as W,O as V}from"./CountdownTimer-BfR-Y7Nz.js";import{P as A}from"./Price-YFt8wuGR.js";import{F as H}from"./FavoriteToggleButton-BWzLqp6w.js";import{a as K,i as q,g as G,c as oe,b as ce}from"./listingPricing-CBcHwZ3i.js";import{b as L}from"./productUrl-COmlJyrp.js";import{F as de,a as me,b as pe}from"./index-D9oU5-_K.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useCurrencyList-BuOaosnQ.js";function R(e=""){return`.${e.trim().replace(/([\.:!+\/()[\]#>~*^$|=,'"@{}\\])/g,"\\$1").replace(/ /g,".")}`}function he({swiper:e,extendParams:l,on:i,emit:t}){const o="swiper-pagination";l({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:s=>s,formatFractionTotal:s=>s,bulletClass:`${o}-bullet`,bulletActiveClass:`${o}-bullet-active`,modifierClass:`${o}-`,currentClass:`${o}-current`,totalClass:`${o}-total`,hiddenClass:`${o}-hidden`,progressbarFillClass:`${o}-progressbar-fill`,progressbarOppositeClass:`${o}-progressbar-opposite`,clickableClass:`${o}-clickable`,lockClass:`${o}-lock`,horizontalClass:`${o}-horizontal`,verticalClass:`${o}-vertical`,paginationDisabledClass:`${o}-disabled`}}),e.pagination={el:null,bullets:[]};let r,h=0;function d(){return!e.params.pagination.el||!e.pagination.el||Array.isArray(e.pagination.el)&&e.pagination.el.length===0}function m(s,n){const{bulletActiveClass:c}=e.params.pagination;s&&(s=s[`${n==="prev"?"previous":"next"}ElementSibling`],s&&(s.classList.add(`${c}-${n}`),s=s[`${n==="prev"?"previous":"next"}ElementSibling`],s&&s.classList.add(`${c}-${n}-${n}`)))}function f(s,n,c){if(s=s%c,n=n%c,n===s+1)return"next";if(n===s-1)return"previous"}function p(s){const n=s.target.closest(R(e.params.pagination.bulletClass));if(!n)return;s.preventDefault();const c=Z(n)*e.params.slidesPerGroup;if(e.params.loop){if(e.realIndex===c)return;const x=f(e.realIndex,c,e.slides.length);x==="next"?e.slideNext():x==="previous"?e.slidePrev():e.slideToLoop(c)}else e.slideTo(c)}function g(){const s=e.rtl,n=e.params.pagination;if(d())return;let c=e.pagination.el;c=T(c);let x,N;const $=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,z=e.params.loop?Math.ceil($/e.params.slidesPerGroup):e.snapGrid.length;if(e.params.loop?(N=e.previousRealIndex||0,x=e.params.slidesPerGroup>1?Math.floor(e.realIndex/e.params.slidesPerGroup):e.realIndex):typeof e.snapIndex<"u"?(x=e.snapIndex,N=e.previousSnapIndex):(N=e.previousIndex||0,x=e.activeIndex||0),n.type==="bullets"&&e.pagination.bullets&&e.pagination.bullets.length>0){const y=e.pagination.bullets;let k,_,M;if(n.dynamicBullets&&(r=le(y[0],e.isHorizontal()?"width":"height"),c.forEach(v=>{v.style[e.isHorizontal()?"width":"height"]=`${r*(n.dynamicMainBullets+4)}px`}),n.dynamicMainBullets>1&&N!==void 0&&(h+=x-(N||0),h>n.dynamicMainBullets-1?h=n.dynamicMainBullets-1:h<0&&(h=0)),k=Math.max(x-h,0),_=k+(Math.min(y.length,n.dynamicMainBullets)-1),M=(_+k)/2),y.forEach(v=>{const S=[...["","-next","-next-next","-prev","-prev-prev","-main"].map(B=>`${n.bulletActiveClass}${B}`)].map(B=>typeof B=="string"&&B.includes(" ")?B.split(" "):B).flat();v.classList.remove(...S)}),c.length>1)y.forEach(v=>{const S=Z(v);S===x?v.classList.add(...n.bulletActiveClass.split(" ")):e.isElement&&v.setAttribute("part","bullet"),n.dynamicBullets&&(S>=k&&S<=_&&v.classList.add(...`${n.bulletActiveClass}-main`.split(" ")),S===k&&m(v,"prev"),S===_&&m(v,"next"))});else{const v=y[x];if(v&&v.classList.add(...n.bulletActiveClass.split(" ")),e.isElement&&y.forEach((S,B)=>{S.setAttribute("part",B===x?"bullet-active":"bullet")}),n.dynamicBullets){const S=y[k],B=y[_];for(let O=k;O<=_;O+=1)y[O]&&y[O].classList.add(...`${n.bulletActiveClass}-main`.split(" "));m(S,"prev"),m(B,"next")}}if(n.dynamicBullets){const v=Math.min(y.length,n.dynamicMainBullets+4),S=(r*v-r)/2-M*r,B=s?"right":"left";y.forEach(O=>{O.style[e.isHorizontal()?B:"top"]=`${S}px`})}}c.forEach((y,k)=>{if(n.type==="fraction"&&(y.querySelectorAll(R(n.currentClass)).forEach(_=>{_.textContent=n.formatFractionCurrent(x+1)}),y.querySelectorAll(R(n.totalClass)).forEach(_=>{_.textContent=n.formatFractionTotal(z)})),n.type==="progressbar"){let _;n.progressbarOpposite?_=e.isHorizontal()?"vertical":"horizontal":_=e.isHorizontal()?"horizontal":"vertical";const M=(x+1)/z;let v=1,S=1;_==="horizontal"?v=M:S=M,y.querySelectorAll(R(n.progressbarFillClass)).forEach(B=>{B.style.transform=`translate3d(0,0,0) scaleX(${v}) scaleY(${S})`,B.style.transitionDuration=`${e.params.speed}ms`})}n.type==="custom"&&n.renderCustom?(Q(y,n.renderCustom(e,x+1,z)),k===0&&t("paginationRender",y)):(k===0&&t("paginationRender",y),t("paginationUpdate",y)),e.params.watchOverflow&&e.enabled&&y.classList[e.isLocked?"add":"remove"](n.lockClass)})}function u(){const s=e.params.pagination;if(d())return;const n=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.grid&&e.params.grid.rows>1?e.slides.length/Math.ceil(e.params.grid.rows):e.slides.length;let c=e.pagination.el;c=T(c);let x="";if(s.type==="bullets"){let N=e.params.loop?Math.ceil(n/e.params.slidesPerGroup):e.snapGrid.length;e.params.freeMode&&e.params.freeMode.enabled&&N>n&&(N=n);for(let $=0;$<N;$+=1)s.renderBullet?x+=s.renderBullet.call(e,$,s.bulletClass):x+=`<${s.bulletElement} ${e.isElement?'part="bullet"':""} class="${s.bulletClass}"></${s.bulletElement}>`}s.type==="fraction"&&(s.renderFraction?x=s.renderFraction.call(e,s.currentClass,s.totalClass):x=`<span class="${s.currentClass}"></span> / <span class="${s.totalClass}"></span>`),s.type==="progressbar"&&(s.renderProgressbar?x=s.renderProgressbar.call(e,s.progressbarFillClass):x=`<span class="${s.progressbarFillClass}"></span>`),e.pagination.bullets=[],c.forEach(N=>{s.type!=="custom"&&Q(N,x||""),s.type==="bullets"&&e.pagination.bullets.push(...N.querySelectorAll(R(s.bulletClass)))}),s.type!=="custom"&&t("paginationRender",c[0])}function C(){e.params.pagination=ie(e,e.originalParams.pagination,e.params.pagination,{el:"swiper-pagination"});const s=e.params.pagination;if(!s.el)return;let n;typeof s.el=="string"&&e.isElement&&(n=e.el.querySelector(s.el)),!n&&typeof s.el=="string"&&(n=[...document.querySelectorAll(s.el)]),n||(n=s.el),!(!n||n.length===0)&&(e.params.uniqueNavElements&&typeof s.el=="string"&&Array.isArray(n)&&n.length>1&&(n=[...e.el.querySelectorAll(s.el)],n.length>1&&(n=n.find(c=>ne(c,".swiper")[0]===e.el))),Array.isArray(n)&&n.length===1&&(n=n[0]),Object.assign(e.pagination,{el:n}),n=T(n),n.forEach(c=>{s.type==="bullets"&&s.clickable&&c.classList.add(...(s.clickableClass||"").split(" ")),c.classList.add(s.modifierClass+s.type),c.classList.add(e.isHorizontal()?s.horizontalClass:s.verticalClass),s.type==="bullets"&&s.dynamicBullets&&(c.classList.add(`${s.modifierClass}${s.type}-dynamic`),h=0,s.dynamicMainBullets<1&&(s.dynamicMainBullets=1)),s.type==="progressbar"&&s.progressbarOpposite&&c.classList.add(s.progressbarOppositeClass),s.clickable&&c.addEventListener("click",p),e.enabled||c.classList.add(s.lockClass)}))}function F(){const s=e.params.pagination;if(d())return;let n=e.pagination.el;n&&(n=T(n),n.forEach(c=>{c.classList.remove(s.hiddenClass),c.classList.remove(s.modifierClass+s.type),c.classList.remove(e.isHorizontal()?s.horizontalClass:s.verticalClass),s.clickable&&(c.classList.remove(...(s.clickableClass||"").split(" ")),c.removeEventListener("click",p))})),e.pagination.bullets&&e.pagination.bullets.forEach(c=>c.classList.remove(...s.bulletActiveClass.split(" ")))}i("changeDirection",()=>{if(!e.pagination||!e.pagination.el)return;const s=e.params.pagination;let{el:n}=e.pagination;n=T(n),n.forEach(c=>{c.classList.remove(s.horizontalClass,s.verticalClass),c.classList.add(e.isHorizontal()?s.horizontalClass:s.verticalClass)})}),i("init",()=>{e.params.pagination.enabled===!1?w():(C(),u(),g())}),i("activeIndexChange",()=>{typeof e.snapIndex>"u"&&g()}),i("snapIndexChange",()=>{g()}),i("snapGridLengthChange",()=>{u(),g()}),i("destroy",()=>{F()}),i("enable disable",()=>{let{el:s}=e.pagination;s&&(s=T(s),s.forEach(n=>n.classList[e.enabled?"remove":"add"](e.params.pagination.lockClass)))}),i("lock unlock",()=>{g()}),i("click",(s,n)=>{const c=n.target,x=T(e.pagination.el);if(e.params.pagination.el&&e.params.pagination.hideOnClick&&x&&x.length>0&&!c.classList.contains(e.params.pagination.bulletClass)){if(e.navigation&&(e.navigation.nextEl&&c===e.navigation.nextEl||e.navigation.prevEl&&c===e.navigation.prevEl))return;const N=x[0].classList.contains(e.params.pagination.hiddenClass);t(N===!0?"paginationShow":"paginationHide"),x.forEach($=>$.classList.toggle(e.params.pagination.hiddenClass))}});const E=()=>{e.el.classList.remove(e.params.pagination.paginationDisabledClass);let{el:s}=e.pagination;s&&(s=T(s),s.forEach(n=>n.classList.remove(e.params.pagination.paginationDisabledClass))),C(),u(),g()},w=()=>{e.el.classList.add(e.params.pagination.paginationDisabledClass);let{el:s}=e.pagination;s&&(s=T(s),s.forEach(n=>n.classList.add(e.params.pagination.paginationDisabledClass))),F()};Object.assign(e.pagination,{enable:E,disable:w,render:u,update:g,init:C,destroy:F})}function ae({swiper:e,extendParams:l,on:i,emit:t,params:o}){e.autoplay={running:!1,paused:!1,timeLeft:0},l({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!1,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}});let r,h,d=o&&o.autoplay?o.autoplay.delay:3e3,m=o&&o.autoplay?o.autoplay.delay:3e3,f,p=new Date().getTime(),g,u,C,F,E,w;function s(b){!e||e.destroyed||!e.wrapperEl||b.target===e.wrapperEl&&(e.wrapperEl.removeEventListener("transitionend",s),!(w||b.detail&&b.detail.bySwiperTouchMove)&&k())}const n=()=>{if(e.destroyed||!e.autoplay.running)return;e.autoplay.paused?g=!0:g&&(m=f,g=!1);const b=e.autoplay.paused?f:p+m-new Date().getTime();e.autoplay.timeLeft=b,t("autoplayTimeLeft",b,b/d),h=requestAnimationFrame(()=>{n()})},c=()=>{let b;return e.virtual&&e.params.virtual.enabled?b=e.slides.find(D=>D.classList.contains("swiper-slide-active")):b=e.slides[e.activeIndex],b?parseInt(b.getAttribute("data-swiper-autoplay"),10):void 0},x=()=>{let b=e.params.autoplay.delay;const P=c();return!Number.isNaN(P)&&P>0&&(b=P),b},N=b=>{if(e.destroyed||!e.autoplay.running)return;cancelAnimationFrame(h),n();let P=b;typeof P>"u"&&(P=x(),d=P,m=P),f=P;const D=e.params.speed,J=()=>{!e||e.destroyed||(e.params.autoplay.reverseDirection?!e.isBeginning||e.params.loop||e.params.rewind?(e.slidePrev(D,!0,!0),t("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(e.slides.length-1,D,!0,!0),t("autoplay")):!e.isEnd||e.params.loop||e.params.rewind?(e.slideNext(D,!0,!0),t("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(0,D,!0,!0),t("autoplay")),e.params.cssMode&&(p=new Date().getTime(),requestAnimationFrame(()=>{N()})))};return P>0?(clearTimeout(r),r=setTimeout(()=>{J()},P)):requestAnimationFrame(()=>{J()}),P},$=()=>{p=new Date().getTime(),e.autoplay.running=!0,N(),t("autoplayStart")},z=()=>{e.autoplay.running=!1,clearTimeout(r),cancelAnimationFrame(h),t("autoplayStop")},y=(b,P)=>{if(e.destroyed||!e.autoplay.running)return;clearTimeout(r),b||(E=!0);const D=()=>{t("autoplayPause"),e.params.autoplay.waitForTransition?e.wrapperEl.addEventListener("transitionend",s):k()};if(e.autoplay.paused=!0,P){D();return}f=(f||e.params.autoplay.delay)-(new Date().getTime()-p),!(e.isEnd&&f<0&&!e.params.loop)&&(f<0&&(f=0),D())},k=()=>{e.isEnd&&f<0&&!e.params.loop||e.destroyed||!e.autoplay.running||(p=new Date().getTime(),E?(E=!1,N(f)):N(),e.autoplay.paused=!1,t("autoplayResume"))},_=()=>{if(e.destroyed||!e.autoplay.running)return;const b=U();b.visibilityState==="hidden"&&(E=!0,y(!0)),b.visibilityState==="visible"&&k()},M=b=>{b.pointerType==="mouse"&&(E=!0,w=!0,!(e.animating||e.autoplay.paused)&&y(!0))},v=b=>{b.pointerType==="mouse"&&(w=!1,e.autoplay.paused&&k())},S=()=>{e.params.autoplay.pauseOnMouseEnter&&(e.el.addEventListener("pointerenter",M),e.el.addEventListener("pointerleave",v))},B=()=>{e.el&&typeof e.el!="string"&&(e.el.removeEventListener("pointerenter",M),e.el.removeEventListener("pointerleave",v))},O=()=>{U().addEventListener("visibilitychange",_)},te=()=>{U().removeEventListener("visibilitychange",_)};i("init",()=>{e.params.autoplay.enabled&&(S(),O(),$())}),i("destroy",()=>{B(),te(),e.autoplay.running&&z()}),i("_freeModeStaticRelease",()=>{(C||E)&&k()}),i("_freeModeNoMomentumRelease",()=>{e.params.autoplay.disableOnInteraction?z():y(!0,!0)}),i("beforeTransitionStart",(b,P,D)=>{e.destroyed||!e.autoplay.running||(D||!e.params.autoplay.disableOnInteraction?y(!0,!0):z())}),i("sliderFirstMove",()=>{if(!(e.destroyed||!e.autoplay.running)){if(e.params.autoplay.disableOnInteraction){z();return}u=!0,C=!1,E=!1,F=setTimeout(()=>{E=!0,C=!0,y(!0)},200)}}),i("touchEnd",()=>{if(!(e.destroyed||!e.autoplay.running||!u)){if(clearTimeout(F),clearTimeout(r),e.params.autoplay.disableOnInteraction){C=!1,u=!1;return}C&&e.params.cssMode&&k(),C=!1,u=!1}}),i("slideChange",()=>{e.destroyed||!e.autoplay.running||e.autoplay.paused&&(f=x(),d=x())}),Object.assign(e.autoplay,{start:$,stop:z,pause:y,resume:k})}function ge(e){const{effect:l,swiper:i,on:t,setTranslate:o,setTransition:r,overwriteParams:h,perspective:d,recreateShadows:m,getEffectParams:f}=e;t("beforeInit",()=>{if(i.params.effect!==l)return;i.classNames.push(`${i.params.containerModifierClass}${l}`),d&&d()&&i.classNames.push(`${i.params.containerModifierClass}3d`);const g=h?h():{};Object.assign(i.params,g),Object.assign(i.originalParams,g)}),t("setTranslate _virtualUpdated",()=>{i.params.effect===l&&o()}),t("setTransition",(g,u)=>{i.params.effect===l&&r(u)}),t("transitionEnd",()=>{if(i.params.effect===l&&m){if(!f||!f().slideShadows)return;i.slides.forEach(g=>{g.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(u=>u.remove())}),m()}});let p;t("virtualUpdate",()=>{i.params.effect===l&&(i.slides.length||(p=!0),requestAnimationFrame(()=>{p&&i.slides&&i.slides.length&&(o(),p=!1)}))})}function fe(e,l){const i=ee(l);return i!==l&&(i.style.backfaceVisibility="hidden",i.style["-webkit-backface-visibility"]="hidden"),i}function ue({swiper:e,duration:l,transformElements:i,allSlides:t}){const{activeIndex:o}=e;if(e.params.virtualTranslate&&l!==0){let r=!1,h;h=i,h.forEach(d=>{re(d,()=>{if(r||!e||e.destroyed)return;r=!0,e.animating=!1;const m=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0});e.wrapperEl.dispatchEvent(m)})})}}function xe({swiper:e,extendParams:l,on:i}){l({fadeEffect:{crossFade:!1}}),ge({effect:"fade",swiper:e,on:i,setTranslate:()=>{const{slides:r}=e,h=e.params.fadeEffect;for(let d=0;d<r.length;d+=1){const m=e.slides[d];let p=-m.swiperSlideOffset;e.params.virtualTranslate||(p-=e.translate);let g=0;e.isHorizontal()||(g=p,p=0);const u=e.params.fadeEffect.crossFade?Math.max(1-Math.abs(m.progress),0):1+Math.min(Math.max(m.progress,-1),0),C=fe(h,m);C.style.opacity=u,C.style.transform=`translate3d(${p}px, ${g}px, 0px)`}},setTransition:r=>{const h=e.slides.map(d=>ee(d));h.forEach(d=>{d.style.transitionDuration=`${r}ms`}),ue({swiper:e,duration:r,transformElements:h,allSlides:!0})},overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!e.params.cssMode})})}const be=[{image:"/assets/images/newwban1.png",mobileImage:"/assets/images/mob1.png",href:"/1-rupee-auctions"},{image:"/assets/images/newwban2.png",mobileImage:"/assets/images/mob2.png",href:"/marketplace"},{image:"/assets/images/newwban3.png",mobileImage:"/assets/images/mob3.png",href:"/marketplace?type=auction"}];function ye(){return a.jsxs(a.Fragment,{children:[a.jsx("section",{className:"final-banner-section my-5",children:a.jsx("div",{className:"container",children:a.jsx("div",{className:"hero-banner-shell",children:a.jsx(X,{modules:[ae,xe],effect:"fade",autoplay:{delay:3e3,disableOnInteraction:!1},loop:!0,speed:1e3,className:"hero-slider",children:be.map((e,l)=>a.jsx(Y,{children:a.jsx(j,{href:e.href,className:"hero-banner-link",children:a.jsxs("picture",{children:[a.jsx("source",{media:"(max-width: 767px)",srcSet:e.mobileImage||e.image}),a.jsx("img",{src:e.image,alt:`Hero Banner ${l+1}`,className:"hero-banner-image"})]})})},e.image))})})})}),a.jsx("style",{children:`
        .hero-banner-shell {
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-slider,
        .hero-slider .swiper-wrapper,
        .hero-slider .swiper-slide {
          border-radius: 32px;
          height: 420px;
        }

        /* Override global swiper flex-centering so slide content can stretch full width */
        .hero-slider .swiper-slide {
          display: block !important;
        }

        .hero-banner-link {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-banner-link picture {
          display: block;
          width: 100%;
          height: 100%;
          line-height: 0;
        }

        .hero-banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-slider .swiper-button-prev,
        .hero-slider .swiper-button-next {
          display: none !important;
        }

        @media (min-width: 1500px) {
          .final-banner-section .container {
            max-width: 1380px;
          }
        }

        @media (max-width: 991px) {
          .hero-banner-image {
            height: 100%;
          }

          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            height: 360px;
          }

          .hero-banner-content {
            left: 28px;
            right: 28px;
            bottom: 28px;
          }
        }

        @media (max-width: 767px) {
          .final-banner-section {
            margin-top: 24px !important;
            margin-bottom: 24px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .final-banner-section .container {
            --bs-gutter-x: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .hero-banner-shell,
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide,
          .hero-banner-link {
            border-radius: 24px;
          }
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-banner-shell {
            box-shadow: none;
            background: transparent;
            margin-left: 0;
            margin-right: 0;
          }
          .hero-slider .swiper-slide {
            background: transparent;
          }
          .hero-banner-link picture {
            display: block;
            line-height: 0;
          }

          .hero-banner-image {
            height: 100%;
            width: 100%;
            max-width: 100%;
          }

          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            height: 210px;
          }
        }
      `})]})}function je({categories:e}){const{t:l}=I(),i=(e||[]).slice(0,12),t=o=>o?o.startsWith("http")?o:`${o.startsWith("/")?"":"/"}${o}`:"/images/placeholder.png";return i.length?a.jsxs("section",{className:"browsecategories pt-4 pb-4",style:{backgroundColor:"#F7F8F9"},children:[a.jsxs("div",{className:"container-fluid",children:[a.jsxs("div",{className:"home-section-header mb-3",children:[a.jsx("div",{className:"featured-heading mb-0",children:a.jsx("h2",{children:l("Categories")})}),a.jsx(j,{href:route("categories.page"),className:"section-view-all-btn",children:l("View All")})]}),a.jsx(X,{className:"categories-slider",spaceBetween:14,slidesPerView:3.1,breakpoints:{576:{slidesPerView:3.6,spaceBetween:14},768:{slidesPerView:5,spaceBetween:18},992:{slidesPerView:6,spaceBetween:20},1200:{slidesPerView:7,spaceBetween:20}},children:i.map((o,r)=>a.jsx(Y,{className:"category-item-wrapper",children:(()=>{const h=o.icon||o.image,d=!!o.icon;return a.jsxs(j,{href:route("marketplace.type",{slug:o.slug,typeSlug:"auctions"}),className:"text-decoration-none category-link",children:[a.jsx("div",{className:`image-circle ${d?"has-icon":""}`,children:a.jsx("img",{src:t(h),alt:o.name,className:"category-icon"})}),a.jsx("div",{className:"category-title-wrapper",children:a.jsx("h3",{className:"category-name",children:o.name})})]})})()},o.id||r))})]}),a.jsx("style",{children:`
        .section-title {
          font-weight: 700;
          color: #002f34;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .categories-slider {
          padding: 0 6px 4px;
        }

        .categories-slider .swiper-wrapper {
          align-items: flex-start;
        }

        .category-item-wrapper {
          width: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .category-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          width: 100%;
          height: 136px;
          padding: 4px 4px 0;
        }
        
        .image-circle {
          width: 84px;
          height: 84px;
          aspect-ratio: 1 / 1;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(67, 172, 233, 0.18);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .category-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .image-circle.has-icon {
          background: #ffffff;
          border-color: rgba(67, 172, 233, 0.28);
          padding: 17px;
        }

        .image-circle.has-icon .category-icon {
          object-fit: contain;
          border-radius: 0;
          mix-blend-mode: multiply;
        }

        .category-title-wrapper {
          width: 100%;
          max-width: 112px;
          height: 38px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .category-name {
          font-weight: 700;
          font-size: 13px;
          color: #092f36;
          margin: 0;
          line-height: 1.25;
          text-transform: capitalize;
          word-wrap: break-word;
          
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-item-wrapper:hover .category-name {
            color: #1d9ed8;
        }

        .category-link:hover .image-circle {
          transform: translateY(-3px) scale(1.02);
          border-color: rgba(67, 172, 233, 0.55);
          box-shadow: 0 14px 30px rgba(67, 172, 233, 0.18);
        }

        @media (min-width: 768px) {
          .categories-slider { padding: 0; }
          .category-link {
            height: 160px;
          }
          .image-circle {
            width: 104px;
            height: 104px;
            border-radius: 28px;
          }
          .image-circle.has-icon {
            padding: 22px;
          }
          .category-title-wrapper {
            max-width: 132px;
            height: 40px;
          }
          .category-name {
            font-size: 14px;
          }
        }
      `})]}):null}const ve=e=>{const l=e?.image_url;if(l)return l;let i=e?.album;if(typeof i=="string")try{i=JSON.parse(i)}catch{}const t=Array.isArray(i)?i[0]:i;return t?typeof t=="string"&&/^https?:\/\//i.test(t)?t:`/${String(t).replace(/^\/+/,"")}`:"/assets/images/placeholder.png"};function Ne({products:e}){const{t:l}=I(),i=(e||[]).slice(0,3);return a.jsx("section",{className:"featured-product",children:a.jsxs("div",{className:"container",children:[a.jsxs("div",{className:"home-section-header",children:[a.jsx("div",{className:"featured-heading mb-0",children:a.jsx("h2",{children:l("Featured Listings")})}),a.jsx(j,{href:"/marketplace?featured=home_featured&section=featured",className:"section-view-all-btn",children:l("View All")})]}),i.length>0?a.jsx("div",{className:"row g-4 home-mobile-scroll-row",children:i.map((t,o)=>{const r=Number(t?.bids_max_bid_amount??0),h=Number(t?.minimum_bid??0),d=Number.isFinite(r)&&r>0,m=K(t),f=q(t),p=G(t),g=l(m?"Price":d?"Current Bid":"Minimum Bid"),u=d?r:h,C=ve(t);return a.jsx("div",{className:"col-12 col-sm-6 col-lg-4",children:a.jsxs("div",{className:"product-card-wrapper h-100",children:[a.jsxs("div",{className:"pro-image",style:{position:"relative"},children:[a.jsx(H,{listingId:t.id}),a.jsx(j,{href:L(t.slug),className:"product-box",children:a.jsx("div",{className:"relative aspect-[4/3] w-full overflow-hidden",children:a.jsx("img",{src:C,alt:t.title||t.name||"Product",style:{width:"100%",height:"auto",aspectRatio:"4/3",objectFit:"cover"},className:"object-cover img-fluid",loading:o===0?"eager":"lazy"})})}),f&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"#111827",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:"Sold Out"}),!f&&p.hasDiscount&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"rgba(220, 53, 69, 0.9)",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:p.badgeText}),!f&&!m&&a.jsx(W,{startDate:t.start_date,endDate:t.end_date})]}),a.jsx(V,{owner:t.user,fallbackName:t.user?.name,fallbackAvatar:t.user?.profile_pic,isFeatured:!!t?.featured_name}),a.jsx("div",{className:"pro-title",style:{color:"black"},children:a.jsx("h2",{children:a.jsx(j,{href:L(t.slug),className:"text-color-black",children:t.title})})}),a.jsxs("div",{className:"pro-meta",children:[a.jsxs("div",{className:"pro-price",children:[a.jsx("span",{children:g}),a.jsx("div",{className:"price",children:(()=>{let F=Number(u);return m&&p.hasDiscount?a.jsxs("div",{className:"d-flex flex-column",children:[a.jsx("span",{className:"text-decoration-line-through text-muted",style:{fontSize:"0.8em",lineHeight:1},children:a.jsx(A,{amountAED:p.originalPrice})}),a.jsx("span",{className:"price text-danger",children:a.jsx(A,{amountAED:p.finalPrice})})]}):a.jsx("span",{className:"price",style:{color:"#23262F"},children:a.jsx(A,{amountAED:F})})})()})]}),a.jsx("div",{className:"pro-buy-btn",children:a.jsx("div",{className:"pro-bid-btn",children:f?a.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"12px",padding:"14px 22px",background:"#9ca3af",color:"#fff",fontWeight:600,cursor:"not-allowed"},children:l("Sold Out")}):a.jsx(j,{href:L(t.slug),children:l(m?"Buy Now":"Place Bid")})})})]})]})},`${t.slug}-${o}`)})}):a.jsx("p",{children:l("No products found.")})]})})}const ke=e=>{const l=e?.image_url;if(l)return l;let i=e?.album;if(typeof i=="string")try{i=JSON.parse(i)}catch{}const t=Array.isArray(i)?i[0]:i;return t?typeof t=="string"&&/^https?:\/\//i.test(t)?t:`/${String(t).replace(/^\/+/,"")}`:"/assets/images/placeholder.png"};function Se({products:e}){const{t:l}=I(),i=(e||[]).slice(0,3);return i.length===0?null:a.jsx("section",{className:"featured-product",style:{backgroundColor:"#F9F9F9"},children:a.jsxs("div",{className:"container",children:[a.jsxs("div",{className:"home-section-header",children:[a.jsx("div",{className:"featured-heading mb-0",children:a.jsx("h2",{children:l("Latest Vehicles")})}),a.jsx(j,{href:"/marketplace/vehicles?type=auction&section=latest_vehicles",className:"section-view-all-btn",children:l("View All")})]}),a.jsx("div",{className:"row g-4 home-mobile-scroll-row",children:i.map((t,o)=>{const r=Number(t?.bids_max_bid_amount??0),h=Number(t?.minimum_bid??0),d=Number.isFinite(r)&&r>0,m=d?r:h,f=ke(t),p=K(t),g=q(t),u=G(t);return a.jsx("div",{className:"col-12 col-sm-6 col-lg-4",children:a.jsxs("div",{className:"product-card-wrapper h-100",children:[a.jsxs("div",{className:"pro-image",style:{position:"relative"},children:[a.jsx(H,{listingId:t.id}),a.jsx(j,{href:L(t.slug),className:"product-box",children:a.jsx("div",{className:"relative aspect-[4/3] w-full overflow-hidden",children:a.jsx("img",{src:f,alt:t.title||t.name||"Product",style:{width:"100%",height:"auto",aspectRatio:"4/3",objectFit:"cover"},className:"object-cover img-fluid",loading:"lazy"})})}),g&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"#111827",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:"Sold Out"}),!g&&u.hasDiscount&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"rgba(220, 53, 69, 0.9)",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:u.badgeText}),!g&&!p&&a.jsx(W,{startDate:t.start_date,endDate:t.end_date})]}),a.jsx(V,{owner:t.user,fallbackName:t.user?.name,fallbackAvatar:t.user?.profile_pic,isFeatured:!!t?.featured_name}),a.jsx("div",{className:"pro-title",style:{color:"black"},children:a.jsx("h2",{children:a.jsx(j,{href:L(t.slug),className:"text-color-black",children:t.title||t.name})})}),a.jsxs("div",{className:"pro-meta",children:[a.jsxs("div",{className:"pro-price",children:[a.jsx("span",{children:l(p?"Price":d?"Current Bid":"Minimum Bid")}),a.jsx("div",{className:"price",children:p&&u.hasDiscount?a.jsxs("div",{className:"d-flex flex-column",children:[a.jsx("span",{className:"text-decoration-line-through text-muted",style:{fontSize:"0.8em",lineHeight:1},children:a.jsx(A,{amountAED:u.originalPrice})}),a.jsx("span",{className:"price text-danger",children:a.jsx(A,{amountAED:u.finalPrice})})]}):a.jsx("span",{className:"me-1",style:{color:"#23262F"},children:a.jsx(A,{amountAED:m})})})]}),a.jsx("div",{className:"pro-buy-btn",children:a.jsx("div",{className:"pro-bid-btn",children:g?a.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"12px",padding:"14px 22px",background:"#9ca3af",color:"#fff",fontWeight:600,cursor:"not-allowed"},children:l("Sold Out")}):a.jsx(j,{href:L(t.slug),children:l(p?"Buy Now":"Place Bid")})})})]})]})},`${t.slug}-${o}`)})})]})})}const Ce=e=>{const l=e?.image_url;if(l)return l;let i=e?.album;if(typeof i=="string")try{i=JSON.parse(i)}catch{}const t=Array.isArray(i)?i[0]:i;return t?typeof t=="string"&&/^https?:\/\//i.test(t)?t:`/${String(t).replace(/^\/+/,"")}`:"/assets/images/placeholder.png"};function _e({products:e}){const{t:l}=I(),i=(e||[]).slice(0,3);return i.length===0?null:a.jsx("section",{className:"featured-product",children:a.jsxs("div",{className:"container",children:[a.jsxs("div",{className:"home-section-header",children:[a.jsx("div",{className:"featured-heading mb-0",children:a.jsx("h2",{children:l("Latest Properties")})}),a.jsx(j,{href:"/marketplace/real-estate-property-auction?type=auction&section=latest_properties",className:"section-view-all-btn",children:l("View All")})]}),a.jsx("div",{className:"row g-4 home-mobile-scroll-row",children:i.map((t,o)=>{const r=Number(t?.bids_max_bid_amount??0),h=Number(t?.minimum_bid??0),d=Number.isFinite(r)&&r>0,m=d?r:h,f=Ce(t),p=K(t),g=q(t),u=G(t);return a.jsx("div",{className:"col-12 col-sm-6 col-lg-4",children:a.jsxs("div",{className:"product-card-wrapper h-100",children:[a.jsxs("div",{className:"pro-image",style:{position:"relative"},children:[a.jsx(H,{listingId:t.id}),a.jsx(j,{href:L(t.slug),className:"product-box",children:a.jsx("div",{className:"relative aspect-[4/3] w-full overflow-hidden",children:a.jsx("img",{src:f,alt:t.title||t.name||"Product",style:{width:"100%",height:"auto",aspectRatio:"4/3",objectFit:"cover"},className:"object-cover img-fluid",loading:"lazy"})})}),g&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"#111827",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:"Sold Out"}),!g&&u.hasDiscount&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"rgba(220, 53, 69, 0.9)",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:u.badgeText}),!g&&!p&&a.jsx(W,{startDate:t.start_date,endDate:t.end_date})]}),a.jsx(V,{owner:t.user,fallbackName:t.user?.name,fallbackAvatar:t.user?.profile_pic,isFeatured:!!t?.featured_name}),a.jsx("div",{className:"pro-title",style:{color:"black"},children:a.jsx("h2",{children:a.jsx(j,{href:L(t.slug),className:"text-color-black",children:t.title||t.name})})}),a.jsxs("div",{className:"pro-meta",children:[a.jsxs("div",{className:"pro-price",children:[a.jsx("span",{children:l(p?"Price":d?"Current Bid":"Minimum Bid")}),a.jsx("div",{className:"price",children:p&&u.hasDiscount?a.jsxs("div",{className:"d-flex flex-column",children:[a.jsx("span",{className:"text-decoration-line-through text-muted",style:{fontSize:"0.8em",lineHeight:1},children:a.jsx(A,{amountAED:u.originalPrice})}),a.jsx("span",{className:"price text-danger",children:a.jsx(A,{amountAED:u.finalPrice})})]}):a.jsx("span",{className:"me-1",style:{color:"#23262F"},children:a.jsx(A,{amountAED:m})})})]}),a.jsx("div",{className:"pro-buy-btn",children:a.jsx("div",{className:"pro-bid-btn",children:g?a.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"12px",padding:"14px 22px",background:"#9ca3af",color:"#fff",fontWeight:600,cursor:"not-allowed"},children:l("Sold Out")}):a.jsx(j,{href:L(t.slug),children:l(p?"Buy Now":"Place Bid")})})})]})]})},`${t.slug}-${o}`)})})]})})}const Be=e=>{const l=e?.image_url;if(l)return l;if(e?.listing_type==="live_auction"&&e?.youtube_video_id)return`https://img.youtube.com/vi/${e.youtube_video_id}/hqdefault.jpg`;let i=e?.album;if(typeof i=="string")try{i=JSON.parse(i)}catch{}const t=Array.isArray(i)?i[0]:i;return t?typeof t=="string"&&/^https?:\/\//i.test(t)?t:`/${String(t).replace(/^\/+/,"")}`:"/assets/images/placeholder.png"};function Pe({products:e,title:l="Latest Auctions",viewAllHref:i="/marketplace?type=auction&section=latest_auctions"}){const{t}=I(),o=(e||[]).slice(0,3);return o.length===0?null:a.jsx("section",{className:"featured-product",style:{backgroundColor:"#F9F9F9"},children:a.jsxs("div",{className:"container",children:[a.jsxs("div",{className:"home-section-header",children:[a.jsx("div",{className:"featured-heading mb-0",children:a.jsx("h2",{children:t(l)})}),a.jsx(j,{href:i,className:"section-view-all-btn",children:t("View All")})]}),a.jsx("div",{className:"row g-4 home-mobile-scroll-row",children:o.map((r,h)=>{const m=(r?.list_type||r?.listing_type)==="live_auction",f=Number(r?.bids_max_bid_amount??0),p=Number(r?.minimum_bid??0),g=Number.isFinite(f)&&f>0,u=g?f:p,C=Be(r);return a.jsx("div",{className:"col-12 col-sm-6 col-lg-4",children:a.jsxs("div",{className:"product-card-wrapper h-100",children:[a.jsxs("div",{className:"pro-image",style:{position:"relative"},children:[a.jsx(H,{listingId:r.id}),m&&a.jsxs("span",{className:"badge rounded-pill bg-danger text-white",style:{position:"absolute",top:12,left:12,zIndex:3,fontSize:12,padding:"7px 11px"},children:[a.jsx("i",{className:"fa-solid fa-circle me-1",style:{fontSize:8}}),"Live Auction"]}),a.jsx(j,{href:L(r.slug),className:"product-box",children:a.jsx("div",{className:"relative aspect-[4/3] w-full overflow-hidden",children:a.jsx("img",{src:C,alt:r.title||r.name||"Product",style:{width:"100%",height:"auto",aspectRatio:"4/3",objectFit:"cover"},className:"object-cover img-fluid",loading:"lazy"})})}),!m&&a.jsx(W,{startDate:r.start_date,endDate:r.end_date})]}),a.jsx(V,{owner:r.user,fallbackName:r.user?.name,fallbackAvatar:r.user?.profile_pic,isFeatured:!!r?.featured_name}),a.jsx("div",{className:"pro-title",style:{color:"black"},children:a.jsx("h2",{children:a.jsx(j,{href:L(r.slug),className:"text-color-black",children:r.title||r.name||"Untitled"})})}),a.jsxs("div",{className:"pro-meta",children:[a.jsxs("div",{className:"pro-price",children:[a.jsx("span",{children:t(m?g?"Live Bid":"Start Price":g?"Current Bid":"Minimum Bid")}),a.jsx("div",{className:"price",children:a.jsx("span",{className:"price",style:{color:"#23262F"},children:a.jsx(A,{amountAED:u})})})]}),a.jsx("div",{className:"pro-buy-btn",children:a.jsx("div",{className:"pro-bid-btn",children:a.jsx(j,{href:L(r.slug),children:t(m?"Join Live":"Place Bid")})})})]})]})},`${r.slug}-${h}`)})})]})})}const Le=e=>{const l=e?.image_url;if(l)return l;let i=e?.album;if(typeof i=="string")try{i=JSON.parse(i)}catch{}const t=Array.isArray(i)?i[0]:i;return t?typeof t=="string"&&/^https?:\/\//i.test(t)?t:`/${String(t).replace(/^\/+/,"")}`:"/assets/images/placeholder.png"};function Ae({products:e}){const{t:l}=I(),i=(e||[]).slice(0,3);return i.length===0?null:a.jsx("section",{className:"featured-product",children:a.jsxs("div",{className:"container",children:[a.jsxs("div",{className:"home-section-header",children:[a.jsx("div",{className:"featured-heading mb-0",children:a.jsx("h2",{children:l("Latest Listings")})}),a.jsx(j,{href:"/marketplace?type=normal&section=latest_listings",className:"section-view-all-btn",children:l("View All")})]}),a.jsx("div",{className:"row g-4 home-mobile-scroll-row",children:i.map((t,o)=>{const r=oe(t),h=ce(t),d=G(t),m=q(t),f=Le(t);return a.jsx("div",{className:"col-12 col-sm-6 col-lg-4",children:a.jsxs("div",{className:"product-card-wrapper h-100",children:[a.jsxs("div",{className:"pro-image",style:{position:"relative"},children:[a.jsx(H,{listingId:t.id}),m&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"#111827",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:"Sold Out"}),!m&&d.hasDiscount&&a.jsx("div",{style:{position:"absolute",top:"10px",left:"10px",background:"rgba(220, 53, 69, 0.9)",color:"white",padding:"5px 10px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",zIndex:10},children:d.badgeText}),a.jsx(j,{href:L(t.slug),className:"product-box",children:a.jsx("div",{className:"relative aspect-[4/3] w-full overflow-hidden",children:a.jsx("img",{src:f,alt:t.title||t.name||"Product",style:{width:"100%",height:"auto",aspectRatio:"4/3",objectFit:"cover"},className:"object-cover img-fluid",loading:"lazy"})})})]}),a.jsx(V,{owner:t.user,fallbackName:t.user?.name,fallbackAvatar:t.user?.profile_pic,isFeatured:!!t?.featured_name}),a.jsx("div",{className:"pro-title",style:{color:"black"},children:a.jsx("h2",{children:a.jsx(j,{href:L(t.slug),className:"text-color-black",children:t.title||t.name})})}),a.jsxs("div",{className:"pro-meta",children:[a.jsxs("div",{className:"pro-price",children:[a.jsx("span",{children:l(r?"Business Price":"Price")}),a.jsx("div",{className:"price",children:a.jsx("span",{className:"me-1",style:{color:"#23262F"},children:d.hasDiscount?a.jsxs("span",{className:"d-flex align-items-center gap-2",children:[a.jsx("span",{className:"text-decoration-line-through text-muted fs-6",style:{fontSize:"0.8em"},children:a.jsx(A,{amountAED:d.originalPrice})}),a.jsx("span",{className:"text-danger fw-bold",children:a.jsx(A,{amountAED:d.finalPrice})})]}):a.jsx(A,{amountAED:h})})})]}),a.jsx("div",{className:"pro-buy-btn",children:a.jsx("div",{className:"pro-bid-btn",children:m?a.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"12px",padding:"14px 22px",background:"#9ca3af",color:"#fff",fontWeight:600,cursor:"not-allowed"},children:l("Sold Out")}):a.jsx(j,{href:L(t.slug),children:l(r?"View Product":"Buy Now")})})})]})]})},`${t.slug}-${o}`)})})]})})}function De(){const{t:e}=I(),l=[{icon:a.jsx(de,{}),title:e("Real-time Auctions"),description:e("Get better offers through live bidding.")},{icon:a.jsx(me,{}),title:e("Wide Market Reach"),description:e("Pakistan, UAE & expanding regions.")},{icon:a.jsx(pe,{}),title:e("Easy Listing & Tracking"),description:e("Tools to list and manage all your sales.")}];return a.jsxs("section",{className:"why-choose-section pt-5 bg-light",children:[a.jsxs("div",{className:"container",children:[a.jsx("h2",{className:"text-center mb-4 heading-text",style:{fontWeight:700,color:"#333"},children:e("Why Choose XpertBid?")}),a.jsx(X,{modules:[ae,he],autoplay:{delay:3e3,disableOnInteraction:!1},loop:!0,pagination:{clickable:!0},spaceBetween:30,breakpoints:{360:{slidesPerView:1},640:{slidesPerView:2},1024:{slidesPerView:3},1400:{slidesPerView:3}},className:"pb-5",children:l.map((i,t)=>a.jsx(Y,{className:"h-auto",children:a.jsxs("div",{className:"card list-card text-center px-4 py-4 h-100 d-flex flex-column justify-content-center align-items-center",children:[a.jsx("div",{className:"icon-box mb-3",children:i.icon}),a.jsx("h5",{children:i.title}),a.jsx("p",{children:i.description})]})},t))})]}),a.jsx("style",{children:`
        .why-choose-section {
            background-color: #f8f9fa !important; /* bg-light */
        }
        .heading-text {
          font-weight: 700;
          color: #333;
          font-size: 30px;
        }

        .swiper-slide {
          display: flex;
          height: auto;
        }

        .list-card {
          flex: 1;
          border: 2px solid transparent;
          border-radius: 10px;
          background: #f9f9f9;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 260px;
        }

        .list-card:hover {
          border: 2px solid #43ACE9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .icon-box {
          font-size: 2.5rem;
          color: #43ACE9;
          transition: transform 0.3s ease;
        }

        .list-card:hover .icon-box {
          transform: rotate(360deg);
        }

        .list-card h5 {
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }

        .list-card p {
          color: #666;
          margin-bottom: 0;
        }

        .home-page .why-choose-section .swiper-pagination {
          margin-top: 20px;
        }

        @media (max-width: 767px) {
          .home-page .why-choose-section.py-5 {
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }

          .home-page .why-choose-section .heading-text {
            margin-bottom: 20px !important;
          }

          .home-page .why-choose-section .swiper-pagination {
            display: none !important;
          }
        }
      `})]})}const Ee=()=>{const{t:e}=I(),l=[e("seo.fair_list.item_1"),e("seo.fair_list.item_2"),e("seo.fair_list.item_3"),e("seo.fair_list.item_4"),e("seo.fair_list.item_5")],i=[e("seo.features.item_1"),e("seo.features.item_2"),e("seo.features.item_3"),e("seo.features.item_4"),e("seo.features.item_5"),e("seo.features.item_6")];return a.jsxs("section",{className:"seo-content-section",children:[a.jsxs("div",{className:"seo-content-shell container",children:[a.jsxs("div",{className:"seo-hero-card",children:[a.jsx("div",{className:"seo-badge",children:"Trusted Digital Marketplace"}),a.jsx("h1",{className:"seo-main-heading",children:e("seo.heading")}),a.jsx("p",{className:"seo-lead",children:e("seo.intro_one")}),a.jsx("p",{className:"seo-support-copy",children:e("seo.intro_two")}),a.jsxs("div",{className:"seo-highlight-grid",children:[a.jsxs("div",{className:"seo-highlight-tile",children:[a.jsx("span",{className:"seo-highlight-kicker",children:"Buy smarter"}),a.jsx("h2",{className:"seo-sub-heading",children:e("seo.smarter_title")}),a.jsx("p",{children:e("seo.smarter_one")}),a.jsx("p",{children:e("seo.smarter_two")})]}),a.jsxs("div",{className:"seo-highlight-tile seo-highlight-tile--accent",children:[a.jsx("span",{className:"seo-highlight-kicker",children:"Bid with confidence"}),a.jsx("h2",{className:"seo-sub-heading",children:e("seo.fair_title")}),a.jsx("p",{children:e("seo.fair_intro")}),a.jsx("ul",{className:"seo-check-list",children:l.map(t=>a.jsxs("li",{children:[a.jsx("span",{className:"seo-check-icon",children:a.jsx("i",{className:"fas fa-check","aria-hidden":"true"})}),a.jsx("span",{children:t})]},t))}),a.jsx("p",{className:"seo-outro-copy",children:e("seo.fair_outro")})]})]})]}),a.jsxs("div",{className:"seo-seller-panel",children:[a.jsxs("div",{className:"seo-seller-copy",children:[a.jsx("span",{className:"seo-panel-kicker",children:"For sellers"}),a.jsx("h2",{className:"seo-sub-heading",children:e("seo.sell_title")}),a.jsx("p",{children:e("seo.sell_one")}),a.jsx("p",{children:e("seo.sell_two")})]}),a.jsxs("div",{className:"seo-standout-card",children:[a.jsx("span",{className:"seo-panel-kicker",children:"Why people choose us"}),a.jsx("h3",{className:"seo-card-heading",children:e("seo.stand_out_title")}),a.jsx("div",{className:"seo-feature-grid",children:i.map(t=>a.jsxs("div",{className:"seo-feature-chip",children:[a.jsx("span",{className:"seo-feature-icon",children:a.jsx("i",{className:"fas fa-bolt","aria-hidden":"true"})}),a.jsx("span",{children:t})]},t))}),a.jsx("p",{className:"seo-closing-copy",children:e("seo.closing")})]})]})]}),a.jsx("style",{children:`
        .seo-content-section {
          position: relative;
          overflow: hidden;
          padding: 72px 0 90px;
          background:
            radial-gradient(circle at top left, rgba(242, 201, 76, 0.20), transparent 34%),
            radial-gradient(circle at top right, rgba(15, 23, 42, 0.10), transparent 30%),
            linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
          color: #0f172a;
        }
        .seo-content-section::before,
        .seo-content-section::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(10px);
        }
        .seo-content-section::before {
          width: 280px;
          height: 280px;
          top: -90px;
          left: -60px;
          background: rgba(251, 191, 36, 0.15);
        }
        .seo-content-section::after {
          width: 360px;
          height: 360px;
          right: -120px;
          bottom: -160px;
          background: rgba(14, 165, 233, 0.10);
        }
        .seo-content-shell {
          position: relative;
          z-index: 1;
        }
        .seo-hero-card {
          position: relative;
          padding: 44px;
          border-radius: 36px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.82)),
            linear-gradient(135deg, rgba(255, 255, 255, 0.55), rgba(248, 250, 252, 0.35));
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 26px 60px rgba(15, 23, 42, 0.10);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .seo-badge,
        .seo-panel-kicker,
        .seo-highlight-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .seo-badge {
          margin-bottom: 20px;
          background: linear-gradient(135deg, #fff3cd, #fef7e7);
          color: #9a6700;
          border: 1px solid rgba(242, 201, 76, 0.45);
        }
        .seo-main-heading {
          max-width: 960px;
          margin: 0 auto 20px;
          text-align: center;
          font-size: clamp(2.35rem, 4vw, 4.3rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
        }
        .seo-lead,
        .seo-support-copy {
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          color: #475569;
          line-height: 1.85;
        }
        .seo-lead {
          margin-bottom: 14px;
          font-size: 1.17rem;
        }
        .seo-support-copy {
          margin-bottom: 34px;
          font-size: 1.03rem;
        }
        .seo-highlight-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-top: 10px;
        }
        .seo-highlight-tile {
          height: 100%;
          padding: 28px;
          border-radius: 28px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
        }
        .seo-highlight-tile--accent {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        }
        .seo-sub-heading {
          margin: 14px 0 14px;
          font-size: clamp(1.6rem, 2vw, 2.15rem);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #111827;
        }
        .seo-highlight-tile p,
        .seo-seller-copy p,
        .seo-closing-copy {
          margin-bottom: 0;
          color: #475569;
          line-height: 1.8;
          font-size: 1rem;
        }
        .seo-highlight-tile p + p,
        .seo-seller-copy p + p {
          margin-top: 12px;
        }
        .seo-check-list {
          list-style: none;
          padding: 0;
          margin: 18px 0 0;
          display: grid;
          gap: 12px;
        }
        .seo-check-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #1e293b;
          font-weight: 600;
        }
        .seo-check-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          min-width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0f172a, #334155);
          color: #ffffff;
          font-size: 11px;
          margin-top: 1px;
        }
        .seo-outro-copy {
          margin-top: 18px !important;
        }
        .seo-seller-panel {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 24px;
          margin-top: 26px;
        }
        .seo-seller-copy,
        .seo-standout-card {
          padding: 30px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
        }
        .seo-card-heading {
          margin: 14px 0 18px;
          font-size: 1.7rem;
          line-height: 1.2;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
        }
        .seo-feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .seo-feature-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 64px;
          padding: 14px 16px;
          border-radius: 20px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          color: #1e293b;
          font-weight: 600;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
        }
        .seo-feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b, #facc15);
          color: #ffffff;
          font-size: 13px;
          box-shadow: 0 10px 18px rgba(245, 158, 11, 0.24);
        }
        .seo-closing-copy {
          margin-top: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        @media (max-width: 991px) {
          .seo-content-section {
            padding: 56px 0 72px;
          }
          .seo-hero-card {
            padding: 30px 22px;
            border-radius: 26px;
          }
          .seo-highlight-grid,
          .seo-seller-panel,
          .seo-feature-grid {
            grid-template-columns: 1fr;
          }
          .seo-highlight-tile,
          .seo-seller-copy,
          .seo-standout-card {
            padding: 24px 20px;
            border-radius: 24px;
          }
          .seo-main-heading {
            max-width: 100%;
          }
        }
        @media (max-width: 576px) {
          .seo-content-section {
            padding: 46px 0 58px;
          }
          .seo-main-heading {
            font-size: 2rem;
          }
          .seo-lead,
          .seo-support-copy {
            font-size: 0.98rem;
            line-height: 1.75;
          }
          .seo-sub-heading,
          .seo-card-heading {
            font-size: 1.45rem;
          }
          .seo-badge,
          .seo-panel-kicker,
          .seo-highlight-kicker {
            font-size: 11px;
            letter-spacing: 0.06em;
          }
          .seo-feature-chip {
            min-height: 58px;
          }
        }
      `})]})};function qe({auth:e,sliders:l,categories:i,featuredAuctions:t,latestAuctions:o,latestLiveAuctions:r,latestVehicles:h,latestProperties:d,latestNormalLists:m,favoriteListingIds:f}){const{t:p}=I();return a.jsx(se,{title:p("Online Auction Marketplace Pakistan | Bid & Sell on XpertBid"),children:a.jsxs("div",{className:"home-page overflow-x-hidden",children:[a.jsx(ye,{sliders:l}),a.jsx(je,{categories:i}),a.jsx(Ne,{products:t}),a.jsx(Se,{products:h}),a.jsx(_e,{products:d}),a.jsx(Pe,{products:o}),a.jsx(Ae,{products:m}),a.jsx(De,{}),a.jsx(Ee,{})]})})}export{qe as default};
