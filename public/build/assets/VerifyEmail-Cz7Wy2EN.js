import{b as j,r as w,u as x,j as e,H as k}from"./app-lu7_VoJP.js";import{M as N}from"./Modal-CNa80zdM.js";import{P as z}from"./PrimaryButton-DpHZDSAn.js";import{A as D}from"./AppLayout-B0xpL7z0.js";import"./transition-DC8ucG1J.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";function H({status:n}){const{auth:h}=j().props,o=w.useRef([]),{data:t,setData:s,post:g,processing:d,errors:f,clearErrors:u}=x({code:""}),l=x({}),c=(i,r)=>{u("code");const a=r.replace(/\D/g,"");if(a.length>1){const p=a.slice(0,6);s("code",p),o.current[Math.min(p.length,5)]?.focus();return}const m=(t.code||"").padEnd(6," ").split("");m[i]=a;const _=m.join("").replace(/\s/g,"");s("code",_),a&&i<5&&o.current[i+1]?.focus()},v=(i,r)=>{r.key==="Backspace"&&!(t.code||"")[i]&&i>0&&o.current[i-1]?.focus()},y=i=>{i.preventDefault(),g(route("verification.code.verify"))},b=i=>{i.preventDefault(),l.post(route("verification.send"),{preserveScroll:!0})};return e.jsxs(D,{title:"Email Verification",children:[e.jsx(k,{title:"Email Verification"}),e.jsx("div",{className:"verify-email-shell","aria-hidden":"true",children:e.jsx("div",{className:"verify-email-shell__inner"})}),e.jsx(N,{show:!0,closeable:!1,maxWidth:"2xl",children:e.jsxs("div",{className:"verify-email-modal",children:[e.jsx("div",{className:"verify-email-modal__header",children:e.jsx("h2",{children:"Verify Email"})}),e.jsx("div",{className:"verify-email-modal__divider"}),e.jsxs("p",{children:["Enter the 6-digit verification code sent to"," ",e.jsx("span",{children:h?.user?.email||"your email address"}),"."]}),n==="verification-code-sent"&&e.jsx("div",{className:"verify-email-alert verify-email-alert--success",children:"A new verification code has been sent."}),n==="verification-code-failed"&&e.jsx("div",{className:"verify-email-alert verify-email-alert--error",children:"We could not send the verification code right now. Please try again later."}),e.jsxs("form",{onSubmit:y,className:"verify-email-code-form",children:[e.jsx("div",{className:"verify-email-code-inputs",onPaste:i=>{i.preventDefault(),c(0,i.clipboardData.getData("text"))},children:Array.from({length:6}).map((i,r)=>e.jsx("input",{ref:a=>o.current[r]=a,type:"text",inputMode:"numeric",maxLength:1,value:(t.code||"")[r]||"",onChange:a=>c(r,a.target.value),onKeyDown:a=>v(r,a),"aria-label":`Verification code digit ${r+1}`},r))}),f.code&&e.jsx("div",{className:"verify-email-alert verify-email-alert--error",children:f.code}),e.jsx(z,{disabled:d||t.code.length<6,children:d?"Verifying...":"Verify Email"})]}),e.jsxs("div",{className:"verify-email-modal__actions",children:[e.jsx("button",{type:"button",className:"verify-email-modal__link",disabled:l.processing,onClick:b,children:l.processing?"Sending...":"Resend Code"}),e.jsx("span",{className:"verify-email-modal__muted",children:"Check spam folder if you do not see the email."})]})]})}),e.jsx("style",{children:`
                .verify-email-shell {
                    min-height: 62vh;
                    background: #f6f8fb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .verify-email-shell__inner {
                    width: min(720px, calc(100vw - 32px));
                    height: 220px;
                    border: 1px dashed #d8e0ea;
                    border-radius: 8px;
                    background: #ffffff;
                    opacity: 0.45;
                }
                #modal .verify-email-modal {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .verify-email-modal {
                    padding: 20px 20px 28px;
                    text-align: center;
                    color: #23262f;
                }
                .verify-email-modal__header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .verify-email-modal h2 {
                    margin: 0;
                    font-size: 25px;
                    line-height: 1.25;
                    font-weight: 800;
                    letter-spacing: 0;
                }
                .verify-email-modal__divider {
                    height: 1px;
                    background: #eceef2;
                    margin: 0 0 40px;
                }
                .verify-email-modal p {
                    margin: 0 0 28px;
                    color: #5f6472;
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 1.6;
                    text-align: left;
                }
                .verify-email-modal p span {
                    color: #23262f;
                    display: block;
                    margin-top: 12px;
                    border-radius: 10px;
                    background: #eaf1ff;
                    border: 1px solid #dce7ff;
                    padding: 18px 20px;
                    font-size: 16px;
                    font-weight: 800;
                    overflow-wrap: anywhere;
                }
                .verify-email-code-form {
                    margin: 0;
                }
                .verify-email-code-inputs {
                    display: grid;
                    grid-template-columns: repeat(6, minmax(0, 1fr));
                    gap: 10px;
                    margin: 0 0 34px;
                }
                .verify-email-code-inputs input {
                    width: 100%;
                    height: 66px;
                    border: 1px solid #eef2f7;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #23262f;
                    font-size: 26px;
                    font-weight: 800;
                    text-align: center;
                    outline: none;
                    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                .verify-email-code-inputs input:focus {
                    border-color: #dce7ff;
                    background: #eaf1ff;
                    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08), 0 0 0 3px rgba(67, 172, 233, 0.12);
                }
                .verify-email-code-form > button {
                    min-height: 66px;
                    width: 100%;
                    justify-content: center;
                    border-radius: 10px;
                    background: #23262f;
                    font-size: 17px;
                    font-weight: 800;
                    text-transform: none;
                }
                .verify-email-alert {
                    margin: 0 0 16px;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1.45;
                }
                .verify-email-alert--success {
                    background: #ecfdf3;
                    color: #027a48;
                }
                .verify-email-alert--error {
                    background: #fff1f3;
                    color: #c01048;
                }
                .verify-email-modal__actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                    flex-wrap: wrap;
                    margin-top: 18px;
                }
                .verify-email-modal__link {
                    border: 0;
                    background: transparent;
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: underline;
                    cursor: pointer;
                    min-height: 36px;
                    padding: 0 4px;
                }
                .verify-email-modal__link:hover {
                    color: #23262f;
                }
                .verify-email-modal__link:disabled {
                    cursor: not-allowed;
                    opacity: 0.65;
                }
                .verify-email-modal__muted {
                    color: #8a90a0;
                    font-size: 13px;
                    font-weight: 600;
                }
                @media (max-width: 640px) {
                    .verify-email-shell {
                        min-height: 46vh;
                    }
                    .verify-email-modal {
                        padding: 18px 16px 24px;
                    }
                    .verify-email-modal h2 {
                        font-size: 22px;
                    }
                    .verify-email-modal__divider {
                        margin-bottom: 28px;
                    }
                    .verify-email-modal p {
                        font-size: 15px;
                    }
                    .verify-email-code-inputs {
                        gap: 6px;
                    }
                    .verify-email-code-inputs input {
                        height: 54px;
                        font-size: 21px;
                    }
                    .verify-email-code-form > button {
                        min-height: 54px;
                    }
                }
            `})]})}export{H as default};
