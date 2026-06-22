import{b as c,r as p,j as t}from"./app-lu7_VoJP.js";import{A as f}from"./AppLayout-B0xpL7z0.js";import b from"./ProfileSection-DPoH17cb.js";import m from"./AddressSection-DtFNBErt.js";import u from"./SecuritySection-v8babowH.js";import x from"./ReferralSection-BKkfn66I.js";import h from"./NotificationSection-ReDkYCEA.js";import g from"./IdentityVerificationSection-D_PcUVZd.js";import"./productUrl-COmlJyrp.js";import"./sweetalert2.esm.all-CHfsb5jC.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";function q({auth:y,mustVerifyEmail:r,status:s,address:n,identity:S,notificationSettings:j}){const{url:a,props:l}=c(),{flash:v}=l,i=new URLSearchParams(a.split("?")[1]).get("tab")||"profile",[e,d]=p.useState(i==="identity_verification"?"identity":i);return t.jsxs(f,{title:"Account Settings",children:[t.jsx("section",{className:"account-setting bg-light",style:{minHeight:"100vh",padding:"80px 0"},children:t.jsxs("div",{className:"container",children:[t.jsx("h2",{className:"mkt-sec mb-5 px-3",style:{fontSize:"36px",fontWeight:"700",color:"#23262F"},children:"Account Settings"}),t.jsxs("div",{className:"row",children:[t.jsx("div",{className:"col-md-4 mb-4",children:t.jsxs("div",{className:"setting bg-white shadow-sm p-4 p-md-5",style:{borderRadius:"25px",boxShadow:"0 45px 90px 0 #00000021"},children:[t.jsx("h3",{className:"mb-4",style:{fontSize:"20px",fontWeight:"700",color:"#23262F"},children:"User Settings"}),t.jsx("ul",{className:"userSettingsMenu list-unstyled",children:[{id:"profile",label:"My Profile"},{id:"address",label:"Address"},{id:"referral",label:"My Referral Code"},{id:"notifications",label:"Notification Settings"},{id:"password",label:"Password & Login"},{id:"identity",label:"Identity Verification"}].map(o=>t.jsx("li",{className:"mb-2",children:t.jsx("button",{className:`btn w-100 text-start py-3 px-4 border-0 ${e===o.id?"active-item":""}`,style:{fontSize:"18px",fontWeight:"600",borderRadius:"30px",color:e===o.id?"#43ACE9":"#353945",backgroundColor:e===o.id?"#DCECFA":"transparent",fontFamily:'"Inter", sans-serif',transition:"all 0.3s ease"},onClick:()=>d(o.id),children:o.label})},o.id))})]})}),t.jsx("div",{className:"col-md-8",children:t.jsxs("div",{className:"user-profile bg-white shadow-sm p-4 p-md-5",style:{borderRadius:"25px",boxShadow:"0 45px 90px 0 #00000021"},children:[e==="profile"&&t.jsx(b,{mustVerifyEmail:r,status:s}),e==="address"&&t.jsx(m,{},n?.id||"new-address"),e==="referral"&&t.jsx(x,{}),e==="password"&&t.jsx(u,{}),e==="notifications"&&t.jsx(h,{}),e==="identity"&&t.jsx(g,{})]})})]})]})}),t.jsx("style",{children:`
                .active-item {
                    color: #43ACE9 !important;
                    background-color: #DCECFA !important;
                    border-radius: 30px !important;
                }
                .userSettingsMenu button {
                    transition: all 0.3s ease !important;
                    padding: 10px 16px !important;
                    border-radius: 30px !important;
                }
                .userSettingsMenu button:hover:not(.active-item) {
                    background-color: #F8F8F8 !important;
                    color: #23262F !important;
                }
                .account-setting h3, .account-setting h4, .account-setting h2 {
                    font-family: "Inter", sans-serif;
                    color: #23262F;
                }
                .user-profile {
                    background: #fff;
                }
                .form-label {
                    color: #777E91;
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                .form-control, .form-select {
                    border-radius: 12px !important;
                    padding: 12px 20px !important;
                    font-weight: 500;
                    color: #23262F;
                    border: 1px solid #E6E8EC !important;
                }
                
                /* Global Button Styles from xpertbid-frontend */
                .button-style-1 {
                    background-color: #43ACE9;
                    color: #fff;
                    border: 1px solid #43ACE9;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                .button-style-2 {
                    background-color: #23262F;
                    color: #fff;
                    border: 1px solid #23262F;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                .button-style-3 {
                    background-color: transparent;
                    color: #23262F;
                    border: 1px solid #23262F;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                
                /* Shine effect */
                .button-style-1, .button-style-2, .button-style-3 {
                    position: relative;
                    overflow: hidden;
                }
                .button-style-1::after, .button-style-2::after, .button-style-3::after {
                    content: "";
                    position: absolute;
                    top: -70%;
                    left: -140%;
                    width: 80%;
                    height: 240%;
                    background: linear-gradient(115deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0) 100%);
                    transform: rotate(20deg);
                    opacity: 0;
                }
                .button-style-1:hover::after, .button-style-2:hover::after, .button-style-3:hover::after {
                    animation: button-shine-sweep 0.9s ease forwards;
                }
                @keyframes button-shine-sweep {
                    0% { left: -140%; opacity: 0; }
                    20% { opacity: 0.7; }
                    100% { left: 160%; opacity: 0; }
                }
                .button-style-1:hover, .button-style-2:hover, .button-style-3:hover {
                    filter: brightness(1.1);
                }

            `})]})}export{q as default};
