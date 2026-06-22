import{b as f,j as o,r as h,c as x}from"./app-lu7_VoJP.js";import{u as g}from"./useCurrencyList-BuOaosnQ.js";function w(){const{translations:s={}}=f().props;return{t:(t,e={})=>{let n=s[t]??t;return Object.entries(e).forEach(([c,a])=>{n=n.replaceAll(`:${c}`,String(a))}),n}}}function u(s,i,t=30){const e=new Date(Date.now()+t*864e5).toUTCString();document.cookie=`${s}=${encodeURIComponent(i)}; expires=${e}; path=/; SameSite=Lax${location.protocol==="https:"?"; Secure":""}`}function y(){const{loading:s,list:i,selected:t,choose:e}=g();if(s||!i?.length)return null;const n=new Set(["AED","PKR","USD"]),c=i.map(r=>String(r.code||"").toUpperCase()).filter(r=>n.has(r));c.includes("PKR")||c.unshift("PKR");const a=async r=>{const l=r.target.value.toUpperCase();try{await Promise.resolve(e(l)),u("xb_currency",l),u("xb_currency_userSet","1"),document.dispatchEvent(new Event("xb-currency-change")),window.dispatchEvent(new Event("xb-currency-change"))}catch(d){console.error("Failed to switch currency:",d)}},p=n.has(String(t).toUpperCase())?String(t).toUpperCase():"PKR";return o.jsxs("div",{className:"currency-picker",children:[o.jsx("select",{value:p,onChange:a,className:"form-select form-select-sm currency-picker-select","aria-label":"Select display currency",children:c.map(r=>o.jsx("option",{value:r,children:r},r))}),o.jsx("style",{children:`
                            .currency-picker {
                                   display: inline-flex;
                                   align-items: center;
                            }
                            .currency-picker-select {
                                   min-width: 78px;
                                   height: 38px;
                                   border-radius: 10px;
                                   border: 1px solid #d7deea;
                                   background-color: #ffffff;
                                   color: #23262F;
                                   font-size: 14px;
                                   font-weight: 500;
                                   padding-left: 12px;
                                   padding-right: 30px;
                                   box-shadow: none;
                                   background-position: right 12px center;
                                   background-size: 14px 10px;
                            }
                            .currency-picker-select:focus {
                                   border-color: #c6d3e6;
                                   box-shadow: 0 0 0 3px rgba(67, 172, 233, 0.08);
                            }
                     `})]})}function b(s=!1,i=600*1e3){h.useEffect(()=>{if(!s||typeof window>"u")return;let t=!1;const e=()=>{t||x.get(route("session.keepalive")).catch(()=>{})},n=()=>{document.visibilityState==="visible"&&e()};e();const c=window.setInterval(e,i);return document.addEventListener("visibilitychange",n),window.addEventListener("focus",e),()=>{t=!0,window.clearInterval(c),document.removeEventListener("visibilitychange",n),window.removeEventListener("focus",e)}},[s,i])}export{y as C,b as a,w as u};
