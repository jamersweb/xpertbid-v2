import{b as w,r,j as t,H as N,c as m,a as y}from"./app-lu7_VoJP.js";import{A as v}from"./AppLayout-B0xpL7z0.js";import{S as _}from"./sweetalert2.esm.all-CHfsb5jC.js";import"./productUrl-COmlJyrp.js";import"./Price-YFt8wuGR.js";import"./useCurrencyList-BuOaosnQ.js";import"./useSessionKeepAlive-Bkv9Dn-d.js";function E({notifications:o}){const{url:k}=w(),[c,f]=r.useState("most-recent"),[p,n]=r.useState(o.data),[i,l]=r.useState({show:!1,message:"",type:"success"}),d=(e,a="success")=>{l({show:!0,message:e,type:a}),setTimeout(()=>{l({show:!1,message:"",type:"success"})},3500)},u=e=>{f(e.target.value)},h=async e=>{if((await _.fire({title:"Delete notification?",text:"Are you sure you want to delete this notification?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, delete it",cancelButtonText:"Cancel",confirmButtonColor:"#43ACE9",cancelButtonColor:"#1f2937",background:"#ffffff",color:"#111827",customClass:{popup:"xb-notification-confirm",confirmButton:"xb-notification-confirm-btn",cancelButton:"xb-notification-cancel-btn"}})).isConfirmed)try{await m.delete(route("notifications.delete",e)),n(s=>s.filter(j=>j.id!==e)),d("Notification deleted successfully!","success")}catch{d("Failed to delete notification.","error")}},g=async e=>{try{await m.post(route("notifications.read",e)),n(a=>a.map(s=>s.id===e?{...s,read_at:new Date().toISOString()}:s))}catch(a){console.error("Error marking as read",a)}},b=()=>{y.post(route("notifications.read_all"),{},{onSuccess:()=>{n(e=>e.map(a=>({...a,read_at:new Date().toISOString()})))}})},x=p.filter(e=>c==="unread"?!e.read_at:!0);return t.jsxs(v,{title:"Notifications",children:[t.jsx(N,{title:"Notifications"}),t.jsxs("div",{className:"py-5 bg-light min-vh-100",children:[i.show&&t.jsx("div",{className:"notification-toast-wrap",children:t.jsxs("div",{className:`notification-toast notification-toast--${i.type}`,children:[t.jsx("div",{className:"notification-toast__icon",children:i.type==="success"?"✓":"!"}),t.jsxs("div",{className:"notification-toast__content",children:[t.jsx("div",{className:"notification-toast__title",children:i.type==="success"?"Success":"Error"}),t.jsx("div",{className:"notification-toast__message",children:i.message})]})]})}),t.jsx("div",{className:"container",children:t.jsx("div",{className:"row justify-content-center",children:t.jsxs("div",{className:"col-lg-10 col-xl-8",children:[t.jsxs("div",{className:"d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3",children:[t.jsx("h1",{className:"h2 fw-bold text-dark m-0",children:"Notifications"}),t.jsxs("div",{className:"d-flex align-items-center gap-2",children:[t.jsx("button",{onClick:b,className:"btn btn-link text-primary text-decoration-none fw-bold small",children:"Mark all as read"}),t.jsxs("select",{className:"form-select border-0 shadow-sm",style:{width:"160px"},value:c,onChange:u,children:[t.jsx("option",{value:"most-recent",children:"Most Recent"}),t.jsx("option",{value:"unread",children:"Unread"})]})]})]}),x.length===0?t.jsxs("div",{className:"text-center py-5 bg-white rounded-3 shadow-sm border",children:[t.jsx("div",{className:"mb-3",children:t.jsx("i",{className:"fa-regular fa-bell-slash fa-3x text-muted opacity-25"})}),t.jsx("h2",{className:"h5 fw-bold text-dark",children:"No notifications found"}),t.jsx("p",{className:"text-muted",children:"You're all caught up!"})]}):t.jsx("div",{className:"notification-list d-flex flex-column gap-3",children:x.map(e=>t.jsx("div",{className:`notification-item p-3 border rounded-3 bg-white shadow-sm transition-all ${e.read_at?"":"border-primary border-start border-4"}`,onClick:()=>!e.read_at&&g(e.id),style:{cursor:e.read_at?"default":"pointer"},children:t.jsxs("div",{className:"d-flex align-items-start gap-3",children:[t.jsx("div",{className:"notification-icon bg-light rounded-circle p-2 d-flex align-items-center justify-content-center",style:{width:"45px",height:"45px"},children:t.jsx("img",{src:e.image_url||"/assets/images/message-text.svg",alt:"Icon",style:{width:"24px",height:"24px"}})}),t.jsxs("div",{className:"flex-grow-1",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-start mb-1",children:[t.jsx("p",{className:`mb-0 ${e.read_at?"text-secondary":"fw-bold text-dark"}`,children:e.title}),t.jsx("button",{onClick:a=>{a.stopPropagation(),h(e.id)},className:"btn btn-link text-muted p-0 border-0",children:t.jsx("i",{className:"fa-solid fa-xmark"})})]}),t.jsxs("div",{className:"d-flex align-items-center gap-2 small text-muted font-monospace",children:[t.jsx("span",{children:new Date(e.created_at).toLocaleDateString()}),t.jsx("span",{children:"•"}),t.jsx("span",{children:new Date(e.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})]})]})},e.id))}),o.links&&o.links.length>3&&t.jsx("div",{className:"mt-4 d-flex justify-content-center"})]})})})]}),t.jsx("style",{dangerouslySetInnerHTML:{__html:`
                .notification-item {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .notification-item:hover {
                    transform: translateX(5px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }
                .border-primary {
                    border-color: #0d6efd !important;
                }
                .notification-toast-wrap {
                    position: fixed;
                    top: 96px;
                    right: 24px;
                    z-index: 9999;
                }
                .notification-toast {
                    min-width: 320px;
                    max-width: 420px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 16px;
                    color: #fff;
                    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
                    animation: notificationToastIn 0.25s ease-out;
                }
                .notification-toast--success {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-left: 4px solid #43ACE9;
                }
                .notification-toast--error {
                    background: linear-gradient(135deg, #2b1215 0%, #4a1d24 100%);
                    border-left: 4px solid #ff6b6b;
                }
                .notification-toast__icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    flex-shrink: 0;
                    background: rgba(255,255,255,0.16);
                }
                .notification-toast__title {
                    font-weight: 700;
                    font-size: 14px;
                    margin-bottom: 2px;
                }
                .notification-toast__message {
                    font-size: 13px;
                    opacity: 0.9;
                }
                .xb-notification-confirm {
                    border-radius: 22px;
                    padding: 1.5rem;
                    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
                }
                .xb-notification-confirm-btn,
                .xb-notification-cancel-btn {
                    border-radius: 999px !important;
                    padding: 10px 18px !important;
                    font-weight: 600 !important;
                    box-shadow: none !important;
                }
                @keyframes notificationToastIn {
                    from {
                        opacity: 0;
                        transform: translateX(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}})]})}export{E as default};
