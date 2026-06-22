import{R as se,r as u,j as t,L as _,s as C,c as X,b as xe,a as J,u as qt,H as bs}from"./app-lu7_VoJP.js";import{u as ys,b as vs,C as js}from"./productUrl-COmlJyrp.js";import{P as Nt}from"./Price-YFt8wuGR.js";import{S as ws}from"./sweetalert2.esm.all-CHfsb5jC.js";import{u as de,a as ks,C as Ns}from"./useSessionKeepAlive-Bkv9Dn-d.js";var G=function(){return G=Object.assign||function(s){for(var r,n=1,a=arguments.length;n<a;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(s[o]=r[o])}return s},G.apply(this,arguments)};function Fe(e,s,r){if(r||arguments.length===2)for(var n=0,a=s.length,o;n<a;n++)(o||!(n in s))&&(o||(o=Array.prototype.slice.call(s,0,n)),o[n]=s[n]);return e.concat(o||Array.prototype.slice.call(s))}var F="-ms-",Pe="-moz-",I="-webkit-",Ut="comm",Xe="rule",xt="decl",Ss="@import",Cs="@namespace",Gt="@keyframes",_s="@layer",Ht=Math.abs,bt=String.fromCharCode,ot=Object.assign;function Es(e,s){return q(e,0)^45?(((s<<2^q(e,0))<<2^q(e,1))<<2^q(e,2))<<2^q(e,3):0}function Vt(e){return e.trim()}function ae(e,s){return(e=s.exec(e))?e[0]:e}function A(e,s,r){return e.replace(s,r)}function We(e,s,r){return e.indexOf(s,r)}function q(e,s){return e.charCodeAt(s)|0}function be(e,s,r){return e.slice(s,r)}function Q(e){return e.length}function Yt(e){return e.length}function De(e,s){return s.push(e),e}function As(e,s){return e.map(s).join("")}function St(e,s){return e.filter(function(r){return!ae(r,s)})}var Ke=1,Ne=1,Xt=0,K=0,M=0,Ee="";function Ze(e,s,r,n,a,o,i,l){return{value:e,root:s,parent:r,type:n,props:a,children:o,line:Ke,column:Ne,length:i,return:"",siblings:l}}function le(e,s){return ot(Ze("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},s)}function ke(e){for(;e.root;)e=le(e.root,{children:[e]});De(e,e.siblings)}function Ls(){return M}function Ds(){return M=K>0?q(Ee,--K):0,Ne--,M===10&&(Ne=1,Ke--),M}function ee(){return M=K<Xt?q(Ee,K++):0,Ne++,M===10&&(Ne=1,Ke++),M}function ce(){return q(Ee,K)}function qe(){return K}function Qe(e,s){return be(Ee,e,s)}function $e(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function Rs(e){return Ke=Ne=1,Xt=Q(Ee=e),K=0,[]}function Ps(e){return Ee="",e}function tt(e){return Vt(Qe(K-1,lt(e===91?e+2:e===40?e+1:e)))}function Is(e){for(;(M=ce())&&M<33;)ee();return $e(e)>2||$e(M)>3?"":" "}function Fs(e,s){for(;--s&&ee()&&!(M<48||M>102||M>57&&M<65||M>70&&M<97););return Qe(e,qe()+(s<6&&ce()==32&&ee()==32))}function lt(e){for(;ee();)switch(M){case e:return K;case 34:case 39:e!==34&&e!==39&&lt(M);break;case 40:e===41&&lt(e);break;case 92:ee();break}return K}function $s(e,s){for(;ee()&&e+M!==57;)if(e+M===84&&ce()===47)break;return"/*"+Qe(s,K-1)+"*"+bt(e===47?e:ee())}function Os(e){for(;!$e(ce());)ee();return Qe(e,K)}function zs(e){return Ps(Ue("",null,null,null,[""],e=Rs(e),0,[0],e))}function Ue(e,s,r,n,a,o,i,l,c){for(var p=0,y=0,j=i,g=0,k=0,x=0,h=1,E=1,v=1,L=0,P="",d=a,f=o,w=n,m=P;E;)switch(x=L,L=ee()){case 40:if(x!=108&&q(m,j-1)==58){We(m+=A(tt(L),"&","&\f"),"&\f",Ht(p?l[p-1]:0))!=-1&&(v=-1);break}case 34:case 39:case 91:m+=tt(L);break;case 9:case 10:case 13:case 32:m+=Is(x);break;case 92:m+=Fs(qe()-1,7);continue;case 47:switch(ce()){case 42:case 47:De(Ms($s(ee(),qe()),s,r,c),c),($e(x||1)==5||$e(ce()||1)==5)&&Q(m)&&be(m,-1,void 0)!==" "&&(m+=" ");break;default:m+="/"}break;case 123*h:l[p++]=Q(m)*v;case 125*h:case 59:case 0:switch(L){case 0:case 125:E=0;case 59+y:v==-1&&(m=A(m,/\f/g,"")),k>0&&(Q(m)-j||h===0&&x===47)&&De(k>32?_t(m+";",n,r,j-1,c):_t(A(m," ","")+";",n,r,j-2,c),c);break;case 59:m+=";";default:if(De(w=Ct(m,s,r,p,y,a,l,P,d=[],f=[],j,o),o),L===123)if(y===0)Ue(m,s,w,w,d,o,j,l,f);else{switch(g){case 99:if(q(m,3)===110)break;case 108:if(q(m,2)===97)break;default:y=0;case 100:case 109:case 115:}y?Ue(e,w,w,n&&De(Ct(e,w,w,0,0,a,l,P,a,d=[],j,f),f),a,f,j,l,n?d:f):Ue(m,w,w,w,[""],f,0,l,f)}}p=y=k=0,h=v=1,P=m="",j=i;break;case 58:j=1+Q(m),k=x;default:if(h<1){if(L==123)--h;else if(L==125&&h++==0&&Ds()==125)continue}switch(m+=bt(L),L*h){case 38:v=y>0?1:(m+="\f",-1);break;case 44:l[p++]=(Q(m)-1)*v,v=1;break;case 64:ce()===45&&(m+=tt(ee())),g=ce(),y=j=Q(P=m+=Os(qe())),L++;break;case 45:x===45&&Q(m)==2&&(h=0)}}return o}function Ct(e,s,r,n,a,o,i,l,c,p,y,j){for(var g=a-1,k=a===0?o:[""],x=Yt(k),h=0,E=0,v=0;h<n;++h)for(var L=0,P=be(e,g+1,g=Ht(E=i[h])),d=e;L<x;++L)(d=Vt(E>0?k[L]+" "+P:A(P,/&\f/g,k[L])))&&(c[v++]=d);return Ze(e,s,r,a===0?Xe:l,c,p,y,j)}function Ms(e,s,r,n){return Ze(e,s,r,Ut,bt(Ls()),be(e,2,-2),0,n)}function _t(e,s,r,n,a){return Ze(e,s,r,xt,be(e,0,n),be(e,n+1,-1),n,a)}function Kt(e,s,r){switch(Es(e,s)){case 5103:return I+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:case 6391:case 5879:case 5623:case 6135:case 4599:return I+e+e;case 4855:return I+e.replace("add","source-over").replace("substract","source-out").replace("intersect","source-in").replace("exclude","xor")+e;case 4789:return Pe+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return I+e+Pe+e+F+e+e;case 5936:switch(q(e,s+11)){case 114:return I+e+F+A(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return I+e+F+A(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return I+e+F+A(e,/[svh]\w+-[tblr]{2}/,"lr")+e}case 6828:case 4268:case 2903:return I+e+F+e+e;case 6165:return I+e+F+"flex-"+e+e;case 5187:return I+e+A(e,/(\w+).+(:[^]+)/,I+"box-$1$2"+F+"flex-$1$2")+e;case 5443:return I+e+F+"flex-item-"+A(e,/flex-|-self/g,"")+(ae(e,/flex-|baseline/)?"":F+"grid-row-"+A(e,/flex-|-self/g,""))+e;case 4675:return I+e+F+"flex-line-pack"+A(e,/align-content|flex-|-self/g,"")+e;case 5548:return I+e+F+A(e,"shrink","negative")+e;case 5292:return I+e+F+A(e,"basis","preferred-size")+e;case 6060:return I+"box-"+A(e,"-grow","")+I+e+F+A(e,"grow","positive")+e;case 4554:return I+A(e,/([^-])(transform)/g,"$1"+I+"$2")+e;case 6187:return A(A(A(e,/(zoom-|grab)/,I+"$1"),/(image-set)/,I+"$1"),e,"")+e;case 5495:case 3959:return A(e,/(image-set\([^]*)/,I+"$1$`$1");case 4968:return A(A(e,/(.+:)(flex-)?(.*)/,I+"box-pack:$3"+F+"flex-pack:$3"),/space-between/,"justify")+I+e+e;case 4200:if(!ae(e,/flex-|baseline/))return F+"grid-column-align"+be(e,s)+e;break;case 2592:case 3360:return F+A(e,"template-","")+e;case 4384:case 3616:return r&&r.some(function(n,a){return s=a,ae(n.props,/grid-\w+-end/)})?~We(e+(r=r[s].value),"span",0)?e:F+A(e,"-start","")+e+F+"grid-row-span:"+(~We(r,"span",0)?ae(r,/\d+/):+ae(r,/\d+/)-+ae(e,/\d+/))+";":F+A(e,"-start","")+e;case 4896:case 4128:return r&&r.some(function(n){return ae(n.props,/grid-\w+-start/)})?e:F+A(A(e,"-end","-span"),"span ","")+e;case 4095:case 3583:case 4068:case 2532:return A(e,/(.+)-inline(.+)/,I+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(Q(e)-1-s>6)switch(q(e,s+1)){case 109:if(q(e,s+4)!==45)break;case 102:return A(e,/(.+:)(.+)-([^]+)/,"$1"+I+"$2-$3$1"+Pe+(q(e,s+3)==108?"$3":"$2-$3"))+e;case 115:return~We(e,"stretch",0)?Kt(A(e,"stretch","fill-available"),s,r)+e:e}break;case 5152:case 5920:return A(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(n,a,o,i,l,c,p){return F+a+":"+o+p+(i?F+a+"-span:"+(l?c:+c-+o)+p:"")+e});case 4949:if(q(e,s+6)===121)return A(e,":",":"+I)+e;break;case 6444:switch(q(e,q(e,14)===45?18:11)){case 120:return A(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+I+(q(e,14)===45?"inline-":"")+"box$3$1"+I+"$2$3$1"+F+"$2box$3")+e;case 100:return A(e,":",":"+F)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return A(e,"scroll-","scroll-snap-")+e}return e}function Ve(e,s){for(var r="",n=0;n<e.length;n++)r+=s(e[n],n,e,s)||"";return r}function Ts(e,s,r,n){switch(e.type){case _s:if(e.children.length)break;case Ss:case Cs:case xt:return e.return=e.return||e.value;case Ut:return"";case Gt:return e.return=e.value+"{"+Ve(e.children,n)+"}";case Xe:if(!Q(e.value=e.props.join(",")))return""}return Q(r=Ve(e.children,n))?e.return=e.value+"{"+r+"}":""}function Bs(e){var s=Yt(e);return function(r,n,a,o){for(var i="",l=0;l<s;l++)i+=e[l](r,n,a,o)||"";return i}}function Ws(e){return function(s){s.root||(s=s.return)&&e(s)}}function qs(e,s,r,n){if(e.length>-1&&!e.return)switch(e.type){case xt:e.return=Kt(e.value,e.length,r);return;case Gt:return Ve([le(e,{value:A(e.value,"@","@"+I)})],n);case Xe:if(e.length)return As(r=e.props,function(a){switch(ae(a,n=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":ke(le(e,{props:[A(a,/:(read-\w+)/,":"+Pe+"$1")]})),ke(le(e,{props:[a]})),ot(e,{props:St(r,n)});break;case"::placeholder":ke(le(e,{props:[A(a,/:(plac\w+)/,":"+I+"input-$1")]})),ke(le(e,{props:[A(a,/:(plac\w+)/,":"+Pe+"$1")]})),ke(le(e,{props:[A(a,/:(plac\w+)/,F+"input-$1")]})),ke(le(e,{props:[a]})),ot(e,{props:St(r,n)});break}return""})}}var Us={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Y={},Se=typeof process<"u"&&Y!==void 0&&(Y.REACT_APP_SC_ATTR||Y.SC_ATTR)||"data-styled",Zt="active",Qt="data-styled-version",Je="6.3.9",yt=`/*!sc*/
`,Ie=typeof window<"u"&&typeof document<"u",me=se.createContext===void 0,Gs=!!(typeof SC_DISABLE_SPEEDY=="boolean"?SC_DISABLE_SPEEDY:typeof process<"u"&&Y!==void 0&&Y.REACT_APP_SC_DISABLE_SPEEDY!==void 0&&Y.REACT_APP_SC_DISABLE_SPEEDY!==""?Y.REACT_APP_SC_DISABLE_SPEEDY!=="false"&&Y.REACT_APP_SC_DISABLE_SPEEDY:typeof process<"u"&&Y!==void 0&&Y.SC_DISABLE_SPEEDY!==void 0&&Y.SC_DISABLE_SPEEDY!==""&&Y.SC_DISABLE_SPEEDY!=="false"&&Y.SC_DISABLE_SPEEDY),vt=Object.freeze([]),Ce=Object.freeze({});function Hs(e,s,r){return r===void 0&&(r=Ce),e.theme!==r.theme&&e.theme||s||r.theme}var Jt=new Set(["a","abbr","address","area","article","aside","audio","b","bdi","bdo","blockquote","body","button","br","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","main","map","mark","menu","meter","nav","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","slot","small","span","strong","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","switch","symbol","text","textPath","tspan","use"]),Vs=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,Ys=/(^-|-$)/g;function Et(e){return e.replace(Vs,"-").replace(Ys,"")}var Xs=/(a)(d)/gi,At=function(e){return String.fromCharCode(e+(e>25?39:97))};function ct(e){var s,r="";for(s=Math.abs(e);s>52;s=s/52|0)r=At(s%52)+r;return(At(s%52)+r).replace(Xs,"$1-$2")}var st,ue=function(e,s){for(var r=s.length;r;)e=33*e^s.charCodeAt(--r);return e},es=function(e){return ue(5381,e)};function ts(e){return ct(es(e)>>>0)}function Ks(e){return e.displayName||e.name||"Component"}function nt(e){return typeof e=="string"&&!0}var ss=typeof Symbol=="function"&&Symbol.for,ns=ss?Symbol.for("react.memo"):60115,Zs=ss?Symbol.for("react.forward_ref"):60112,Qs={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},Js={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},rs={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},en=((st={})[Zs]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},st[ns]=rs,st);function Lt(e){return("type"in(s=e)&&s.type.$$typeof)===ns?rs:"$$typeof"in e?en[e.$$typeof]:Qs;var s}var tn=Object.defineProperty,sn=Object.getOwnPropertyNames,Dt=Object.getOwnPropertySymbols,nn=Object.getOwnPropertyDescriptor,rn=Object.getPrototypeOf,Rt=Object.prototype;function as(e,s,r){if(typeof s!="string"){if(Rt){var n=rn(s);n&&n!==Rt&&as(e,n,r)}var a=sn(s);Dt&&(a=a.concat(Dt(s)));for(var o=Lt(e),i=Lt(s),l=0;l<a.length;++l){var c=a[l];if(!(c in Js||r&&r[c]||i&&c in i||o&&c in o)){var p=nn(s,c);try{tn(e,c,p)}catch{}}}}return e}function _e(e){return typeof e=="function"}function jt(e){return typeof e=="object"&&"styledComponentId"in e}function fe(e,s){return e&&s?"".concat(e," ").concat(s):e||s||""}function dt(e,s){return e.join("")}function Oe(e){return e!==null&&typeof e=="object"&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function pt(e,s,r){if(r===void 0&&(r=!1),!r&&!Oe(e)&&!Array.isArray(e))return s;if(Array.isArray(s))for(var n=0;n<s.length;n++)e[n]=pt(e[n],s[n]);else if(Oe(s))for(var n in s)e[n]=pt(e[n],s[n]);return e}function wt(e,s){Object.defineProperty(e,"toString",{value:s})}function ze(e){for(var s=[],r=1;r<arguments.length;r++)s[r-1]=arguments[r];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(e," for more information.").concat(s.length>0?" Args: ".concat(s.join(", ")):""))}var an=(function(){function e(s){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=s,this._cGroup=0,this._cIndex=0}return e.prototype.indexOfGroup=function(s){if(s===this._cGroup)return this._cIndex;var r=this._cIndex;if(s>this._cGroup)for(var n=this._cGroup;n<s;n++)r+=this.groupSizes[n];else for(n=this._cGroup-1;n>=s;n--)r-=this.groupSizes[n];return this._cGroup=s,this._cIndex=r,r},e.prototype.insertRules=function(s,r){if(s>=this.groupSizes.length){for(var n=this.groupSizes,a=n.length,o=a;s>=o;)if((o<<=1)<0)throw ze(16,"".concat(s));this.groupSizes=new Uint32Array(o),this.groupSizes.set(n),this.length=o;for(var i=a;i<o;i++)this.groupSizes[i]=0}for(var l=this.indexOfGroup(s+1),c=0,p=(i=0,r.length);i<p;i++)this.tag.insertRule(l,r[i])&&(this.groupSizes[s]++,l++,c++);c>0&&this._cGroup>s&&(this._cIndex+=c)},e.prototype.clearGroup=function(s){if(s<this.length){var r=this.groupSizes[s],n=this.indexOfGroup(s),a=n+r;this.groupSizes[s]=0;for(var o=n;o<a;o++)this.tag.deleteRule(n);r>0&&this._cGroup>s&&(this._cIndex-=r)}},e.prototype.getGroup=function(s){var r="";if(s>=this.length||this.groupSizes[s]===0)return r;for(var n=this.groupSizes[s],a=this.indexOfGroup(s),o=a+n,i=a;i<o;i++)r+=this.tag.getRule(i)+yt;return r},e})(),Ge=new Map,Ye=new Map,He=1,Re=function(e){if(Ge.has(e))return Ge.get(e);for(;Ye.has(He);)He++;var s=He++;return Ge.set(e,s),Ye.set(s,e),s},on=function(e,s){He=s+1,Ge.set(e,s),Ye.set(s,e)},ln="style[".concat(Se,"][").concat(Qt,'="').concat(Je,'"]'),cn=new RegExp("^".concat(Se,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),Pt=function(e){return typeof ShadowRoot<"u"&&e instanceof ShadowRoot||"host"in e&&e.nodeType===11},ut=function(e){if(!e)return document;if(Pt(e))return e;if("getRootNode"in e){var s=e.getRootNode();if(Pt(s))return s}return document},dn=function(e,s,r){for(var n,a=r.split(","),o=0,i=a.length;o<i;o++)(n=a[o])&&e.registerName(s,n)},pn=function(e,s){for(var r,n=((r=s.textContent)!==null&&r!==void 0?r:"").split(yt),a=[],o=0,i=n.length;o<i;o++){var l=n[o].trim();if(l){var c=l.match(cn);if(c){var p=0|parseInt(c[1],10),y=c[2];p!==0&&(on(y,p),dn(e,y,c[3]),e.getTag().insertRules(p,a)),a.length=0}else a.push(l)}}},rt=function(e){for(var s=ut(e.options.target).querySelectorAll(ln),r=0,n=s.length;r<n;r++){var a=s[r];a&&a.getAttribute(Se)!==Zt&&(pn(e,a),a.parentNode&&a.parentNode.removeChild(a))}};function un(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:null}var is=function(e){var s=document.head,r=e||s,n=document.createElement("style"),a=(function(l){var c=Array.from(l.querySelectorAll("style[".concat(Se,"]")));return c[c.length-1]})(r),o=a!==void 0?a.nextSibling:null;n.setAttribute(Se,Zt),n.setAttribute(Qt,Je);var i=un();return i&&n.setAttribute("nonce",i),r.insertBefore(n,o),n},hn=(function(){function e(s){this.element=is(s),this.element.appendChild(document.createTextNode("")),this.sheet=(function(r){var n;if(r.sheet)return r.sheet;for(var a=(n=r.getRootNode().styleSheets)!==null&&n!==void 0?n:document.styleSheets,o=0,i=a.length;o<i;o++){var l=a[o];if(l.ownerNode===r)return l}throw ze(17)})(this.element),this.length=0}return e.prototype.insertRule=function(s,r){try{return this.sheet.insertRule(r,s),this.length++,!0}catch{return!1}},e.prototype.deleteRule=function(s){this.sheet.deleteRule(s),this.length--},e.prototype.getRule=function(s){var r=this.sheet.cssRules[s];return r&&r.cssText?r.cssText:""},e})(),fn=(function(){function e(s){this.element=is(s),this.nodes=this.element.childNodes,this.length=0}return e.prototype.insertRule=function(s,r){if(s<=this.length&&s>=0){var n=document.createTextNode(r);return this.element.insertBefore(n,this.nodes[s]||null),this.length++,!0}return!1},e.prototype.deleteRule=function(s){this.element.removeChild(this.nodes[s]),this.length--},e.prototype.getRule=function(s){return s<this.length?this.nodes[s].textContent:""},e})(),mn=(function(){function e(s){this.rules=[],this.length=0}return e.prototype.insertRule=function(s,r){return s<=this.length&&(s===this.length?this.rules.push(r):this.rules.splice(s,0,r),this.length++,!0)},e.prototype.deleteRule=function(s){this.rules.splice(s,1),this.length--},e.prototype.getRule=function(s){return s<this.length?this.rules[s]:""},e})(),It=Ie,gn={isServer:!Ie,useCSSOMInjection:!Gs},os=(function(){function e(s,r,n){s===void 0&&(s=Ce),r===void 0&&(r={});var a=this;this.options=G(G({},gn),s),this.gs=r,this.names=new Map(n),this.server=!!s.isServer,!this.server&&Ie&&It&&(It=!1,rt(this)),wt(this,function(){return(function(o){for(var i=o.getTag(),l=i.length,c="",p=function(j){var g=(function(v){return Ye.get(v)})(j);if(g===void 0)return"continue";var k=o.names.get(g);if(k===void 0||!k.size)return"continue";var x=i.getGroup(j);if(x.length===0)return"continue";var h=Se+".g"+j+'[id="'+g+'"]',E="";k.forEach(function(v){v.length>0&&(E+=v+",")}),c+=x+h+'{content:"'+E+'"}'+yt},y=0;y<l;y++)p(y);return c})(a)})}return e.registerId=function(s){return Re(s)},e.prototype.rehydrate=function(){!this.server&&Ie&&rt(this)},e.prototype.reconstructWithOptions=function(s,r){r===void 0&&(r=!0);var n=new e(G(G({},this.options),s),this.gs,r&&this.names||void 0);return!this.server&&Ie&&s.target!==this.options.target&&ut(this.options.target)!==ut(s.target)&&rt(n),n},e.prototype.allocateGSInstance=function(s){return this.gs[s]=(this.gs[s]||0)+1},e.prototype.getTag=function(){return this.tag||(this.tag=(s=(function(r){var n=r.useCSSOMInjection,a=r.target;return r.isServer?new mn(a):n?new hn(a):new fn(a)})(this.options),new an(s)));var s},e.prototype.hasNameForId=function(s,r){var n,a;return(a=(n=this.names.get(s))===null||n===void 0?void 0:n.has(r))!==null&&a!==void 0&&a},e.prototype.registerName=function(s,r){Re(s);var n=this.names.get(s);n?n.add(r):this.names.set(s,new Set([r]))},e.prototype.insertRules=function(s,r,n){this.registerName(s,r),this.getTag().insertRules(Re(s),n)},e.prototype.clearNames=function(s){this.names.has(s)&&this.names.get(s).clear()},e.prototype.clearRules=function(s){this.getTag().clearGroup(Re(s)),this.clearNames(s)},e.prototype.clearTag=function(){this.tag=void 0},e})(),xn=/&/g,ie=47,he=42;function Ft(e){if(e.indexOf("}")===-1)return!1;for(var s=e.length,r=0,n=0,a=!1,o=0;o<s;o++){var i=e.charCodeAt(o);if(n!==0||a||i!==ie||e.charCodeAt(o+1)!==he)if(a)i===he&&e.charCodeAt(o+1)===ie&&(a=!1,o++);else if(i!==34&&i!==39||o!==0&&e.charCodeAt(o-1)===92){if(n===0){if(i===123)r++;else if(i===125&&--r<0)return!0}}else n===0?n=i:n===i&&(n=0);else a=!0,o++}return r!==0||n!==0}function ls(e,s){return e.map(function(r){return r.type==="rule"&&(r.value="".concat(s," ").concat(r.value),r.value=r.value.replaceAll(",",",".concat(s," ")),r.props=r.props.map(function(n){return"".concat(s," ").concat(n)})),Array.isArray(r.children)&&r.type!=="@keyframes"&&(r.children=ls(r.children,s)),r})}function bn(e){var s,r,n,a=Ce,o=a.options,i=o===void 0?Ce:o,l=a.plugins,c=l===void 0?vt:l,p=function(x,h,E){return E.startsWith(r)&&E.endsWith(r)&&E.replaceAll(r,"").length>0?".".concat(s):x},y=c.slice();y.push(function(x){x.type===Xe&&x.value.includes("&")&&(n||(n=new RegExp("\\".concat(r,"\\b"),"g")),x.props[0]=x.props[0].replace(xn,r).replace(n,p))}),i.prefix&&y.push(qs),y.push(Ts);var j=[],g=Bs(y.concat(Ws(function(x){return j.push(x)}))),k=function(x,h,E,v){h===void 0&&(h=""),E===void 0&&(E=""),v===void 0&&(v="&"),s=v,r=h,n=void 0;var L=(function(d){if(!Ft(d))return d;for(var f=d.length,w="",m=0,b=0,$=0,O=!1,D=0;D<f;D++){var T=d.charCodeAt(D);if($!==0||O||T!==ie||d.charCodeAt(D+1)!==he)if(O)T===he&&d.charCodeAt(D+1)===ie&&(O=!1,D++);else if(T!==34&&T!==39||D!==0&&d.charCodeAt(D-1)===92){if($===0)if(T===123)b++;else if(T===125){if(--b<0){for(var R=D+1;R<f;){var B=d.charCodeAt(R);if(B===59||B===10)break;R++}R<f&&d.charCodeAt(R)===59&&R++,b=0,D=R-1,m=R;continue}b===0&&(w+=d.substring(m,D+1),m=D+1)}else T===59&&b===0&&(w+=d.substring(m,D+1),m=D+1)}else $===0?$=T:$===T&&($=0);else O=!0,D++}if(m<f){var N=d.substring(m);Ft(N)||(w+=N)}return w})((function(d){if(d.indexOf("//")===-1)return d;for(var f=d.length,w=[],m=0,b=0,$=0,O=0;b<f;){var D=d.charCodeAt(b);if(D!==34&&D!==39||b!==0&&d.charCodeAt(b-1)===92)if($===0)if(D===ie&&b+1<f&&d.charCodeAt(b+1)===he){for(b+=2;b+1<f&&(d.charCodeAt(b)!==he||d.charCodeAt(b+1)!==ie);)b++;b+=2}else if(D===40&&b>=3&&(32|d.charCodeAt(b-1))==108&&(32|d.charCodeAt(b-2))==114&&(32|d.charCodeAt(b-3))==117)O=1,b++;else if(O>0)D===41?O--:D===40&&O++,b++;else if(D===he&&b+1<f&&d.charCodeAt(b+1)===ie)b>m&&w.push(d.substring(m,b)),m=b+=2;else if(D===ie&&b+1<f&&d.charCodeAt(b+1)===ie){for(b>m&&w.push(d.substring(m,b));b<f&&d.charCodeAt(b)!==10;)b++;m=b}else b++;else b++;else $===0?$=D:$===D&&($=0),b++}return m===0?d:(m<f&&w.push(d.substring(m)),w.join(""))})(x)),P=zs(E||h?"".concat(E," ").concat(h," { ").concat(L," }"):L);return i.namespace&&(P=ls(P,i.namespace)),j=[],Ve(P,g),j};return k.hash=c.length?c.reduce(function(x,h){return h.name||ze(15),ue(x,h.name)},5381).toString():"",k}var yn=new os,ht=bn(),ft={shouldForwardProp:void 0,styleSheet:yn,stylis:ht},cs=me?{Provider:function(e){return e.children},Consumer:function(e){return(0,e.children)(ft)}}:se.createContext(ft);cs.Consumer;me||se.createContext(void 0);function $t(){return me?ft:se.useContext(cs)}var ds=(function(){function e(s,r){var n=this;this.inject=function(a,o){o===void 0&&(o=ht);var i=n.name+o.hash;a.hasNameForId(n.id,i)||a.insertRules(n.id,i,o(n.rules,i,"@keyframes"))},this.name=s,this.id="sc-keyframes-".concat(s),this.rules=r,wt(this,function(){throw ze(12,String(n.name))})}return e.prototype.getName=function(s){return s===void 0&&(s=ht),this.name+s.hash},e})();function vn(e,s){return s==null||typeof s=="boolean"||s===""?"":typeof s!="number"||s===0||e in Us||e.startsWith("--")?String(s).trim():"".concat(s,"px")}var jn=function(e){return e>="A"&&e<="Z"};function Ot(e){for(var s="",r=0;r<e.length;r++){var n=e[r];if(r===1&&n==="-"&&e[0]==="-")return e;jn(n)?s+="-"+n.toLowerCase():s+=n}return s.startsWith("ms-")?"-"+s:s}var ps=function(e){return e==null||e===!1||e===""},us=function(e){var s=[];for(var r in e){var n=e[r];e.hasOwnProperty(r)&&!ps(n)&&(Array.isArray(n)&&n.isCss||_e(n)?s.push("".concat(Ot(r),":"),n,";"):Oe(n)?s.push.apply(s,Fe(Fe(["".concat(r," {")],us(n),!1),["}"],!1)):s.push("".concat(Ot(r),": ").concat(vn(r,n),";")))}return s};function ge(e,s,r,n,a){if(a===void 0&&(a=[]),typeof e=="string")return e&&a.push(e),a;if(ps(e))return a;if(jt(e))return a.push(".".concat(e.styledComponentId)),a;if(_e(e)){if(!_e(i=e)||i.prototype&&i.prototype.isReactComponent||!s)return a.push(e),a;var o=e(s);return ge(o,s,r,n,a)}var i;if(e instanceof ds)return r?(e.inject(r,n),a.push(e.getName(n))):a.push(e),a;if(Oe(e)){for(var l=us(e),c=0;c<l.length;c++)a.push(l[c]);return a}if(!Array.isArray(e))return a.push(e.toString()),a;for(c=0;c<e.length;c++)ge(e[c],s,r,n,a);return a}function wn(e){for(var s=0;s<e.length;s+=1){var r=e[s];if(_e(r)&&!jt(r))return!1}return!0}var kn=es(Je),Nn=(function(){function e(s,r,n){this.rules=s,this.staticRulesId="",this.isStatic=(n===void 0||n.isStatic)&&wn(s),this.componentId=r,this.baseHash=ue(kn,r),this.baseStyle=n,os.registerId(r)}return e.prototype.generateAndInjectStyles=function(s,r,n){var a=this.baseStyle?this.baseStyle.generateAndInjectStyles(s,r,n).className:"";if(this.isStatic&&!n.hash)if(this.staticRulesId&&r.hasNameForId(this.componentId,this.staticRulesId))a=fe(a,this.staticRulesId);else{var o=dt(ge(this.rules,s,r,n)),i=ct(ue(this.baseHash,o)>>>0);if(!r.hasNameForId(this.componentId,i)){var l=n(o,".".concat(i),void 0,this.componentId);r.insertRules(this.componentId,i,l)}a=fe(a,i),this.staticRulesId=i}else{for(var c=ue(this.baseHash,n.hash),p="",y=0;y<this.rules.length;y++){var j=this.rules[y];if(typeof j=="string")p+=j;else if(j){var g=dt(ge(j,s,r,n));c=ue(ue(c,String(y)),g),p+=g}}if(p){var k=ct(c>>>0);if(!r.hasNameForId(this.componentId,k)){var x=n(p,".".concat(k),void 0,this.componentId);r.insertRules(this.componentId,k,x)}a=fe(a,k)}}return{className:a,css:typeof window>"u"?r.getTag().getGroup(Re(this.componentId)):""}},e})(),hs=me?{Provider:function(e){return e.children},Consumer:function(e){return(0,e.children)(void 0)}}:se.createContext(void 0);hs.Consumer;var at={};function Sn(e,s,r){var n=jt(e),a=e,o=!nt(e),i=s.attrs,l=i===void 0?vt:i,c=s.componentId,p=c===void 0?(function(d,f){var w=typeof d!="string"?"sc":Et(d);at[w]=(at[w]||0)+1;var m="".concat(w,"-").concat(ts(Je+w+at[w]));return f?"".concat(f,"-").concat(m):m})(s.displayName,s.parentComponentId):c,y=s.displayName,j=y===void 0?(function(d){return nt(d)?"styled.".concat(d):"Styled(".concat(Ks(d),")")})(e):y,g=s.displayName&&s.componentId?"".concat(Et(s.displayName),"-").concat(s.componentId):s.componentId||p,k=n&&a.attrs?a.attrs.concat(l).filter(Boolean):l,x=s.shouldForwardProp;if(n&&a.shouldForwardProp){var h=a.shouldForwardProp;if(s.shouldForwardProp){var E=s.shouldForwardProp;x=function(d,f){return h(d,f)&&E(d,f)}}else x=h}var v=new Nn(r,g,n?a.componentStyle:void 0);function L(d,f){return(function(w,m,b){var $=w.attrs,O=w.componentStyle,D=w.defaultProps,T=w.foldedComponentIds,R=w.styledComponentId,B=w.target,N=me?void 0:se.useContext(hs),W=$t(),U=w.shouldForwardProp||W.shouldForwardProp,oe=Hs(m,N,D)||(me?void 0:Ce),H=(function(ve,je,Te){for(var Le,re=G(G({},je),{className:void 0,theme:Te}),et=0;et<ve.length;et+=1){var Be=_e(Le=ve[et])?Le(re):Le;for(var we in Be)we==="className"?re.className=fe(re.className,Be[we]):we==="style"?re.style=G(G({},re.style),Be[we]):re[we]=Be[we]}return"className"in je&&typeof je.className=="string"&&(re.className=fe(re.className,je.className)),re})($,m,oe),ne=H.as||B,pe={};for(var te in H)H[te]===void 0||te[0]==="$"||te==="as"||te==="theme"&&H.theme===oe||(te==="forwardedAs"?pe.as=H.forwardedAs:U&&!U(te,ne)||(pe[te]=H[te]));var Me=(function(ve,je){var Te=$t(),Le=ve.generateAndInjectStyles(je,Te.styleSheet,Te.stylis);return Le})(O,H),S=Me.className,z=Me.css,V=fe(T,R);S&&(V+=" "+S),H.className&&(V+=" "+H.className),pe[nt(ne)&&!Jt.has(ne)?"class":"className"]=V,b&&(pe.ref=b);var Ae=u.createElement(ne,pe);return me&&z?se.createElement(se.Fragment,null,se.createElement("style",{precedence:"styled-components",href:"sc-".concat(R,"-").concat(S),children:z}),Ae):Ae})(P,d,f)}L.displayName=j;var P=se.forwardRef(L);return P.attrs=k,P.componentStyle=v,P.displayName=j,P.shouldForwardProp=x,P.foldedComponentIds=n?fe(a.foldedComponentIds,a.styledComponentId):"",P.styledComponentId=g,P.target=n?a.target:e,Object.defineProperty(P,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(d){this._foldedDefaultProps=n?(function(f){for(var w=[],m=1;m<arguments.length;m++)w[m-1]=arguments[m];for(var b=0,$=w;b<$.length;b++)pt(f,$[b],!0);return f})({},a.defaultProps,d):d}}),wt(P,function(){return".".concat(P.styledComponentId)}),o&&as(P,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),P}function zt(e,s){for(var r=[e[0]],n=0,a=s.length;n<a;n+=1)r.push(s[n],e[n+1]);return r}var Mt=function(e){return Object.assign(e,{isCss:!0})};function fs(e){for(var s=[],r=1;r<arguments.length;r++)s[r-1]=arguments[r];if(_e(e)||Oe(e))return Mt(ge(zt(vt,Fe([e],s,!0))));var n=e;return s.length===0&&n.length===1&&typeof n[0]=="string"?ge(n):Mt(ge(zt(n,s)))}function mt(e,s,r){if(r===void 0&&(r=Ce),!s)throw ze(1,s);var n=function(a){for(var o=[],i=1;i<arguments.length;i++)o[i-1]=arguments[i];return e(s,r,fs.apply(void 0,Fe([a],o,!1)))};return n.attrs=function(a){return mt(e,s,G(G({},r),{attrs:Array.prototype.concat(r.attrs,a).filter(Boolean)}))},n.withConfig=function(a){return mt(e,s,G(G({},r),a))},n}var ms=function(e){return mt(Sn,e)},ye=ms;Jt.forEach(function(e){ye[e]=ms(e)});function kt(e){for(var s=[],r=1;r<arguments.length;r++)s[r-1]=arguments[r];var n=dt(fs.apply(void 0,Fe([e],s,!1))),a=ts(n);return new ds(a,n)}var Cn={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};_n(Cn);function _n(e){var s={};for(var r in e)e.hasOwnProperty(r)&&(s[e[r]]=r);return s}var Tt="#4fa94d",En={"aria-busy":!0,role:"progressbar"},An=ye.div`
  display: ${e=>e.$visible?"flex":"none"};
`,Z=242.776657104492,Ln=1.6,Dn=kt`
12.5% {
  stroke-dasharray: ${Z*.14}px, ${Z}px;
  stroke-dashoffset: -${Z*.11}px;
}
43.75% {
  stroke-dasharray: ${Z*.35}px, ${Z}px;
  stroke-dashoffset: -${Z*.35}px;
}
100% {
  stroke-dasharray: ${Z*.01}px, ${Z}px;
  stroke-dashoffset: -${Z*.99}px;
}
`;ye.path`
  stroke-dasharray: ${Z*.01}px, ${Z};
  stroke-dashoffset: 0;
  animation: ${Dn} ${Ln}s linear infinite;
`;var it=20,Rn=e=>["M"+e+" 0c0-9.94-8.06",e,e,e].join("-"),Pn=(e,s,r)=>{let n=Math.max(e,s),a=-r-n/2+1,o=r*2+n;return[a,a,o,o].join(" ")},gt=({height:e=80,width:s=80,color:r=Tt,secondaryColor:n=Tt,ariaLabel:a="oval-loading",wrapperStyle:o,wrapperClass:i,visible:l=!0,strokeWidth:c=2,strokeWidthSecondary:p,animationDuration:y=1})=>t.jsx(An,{style:o,$visible:l,className:i,"data-testid":"oval-loading","aria-label":a,...En,children:t.jsx("svg",{width:s,height:e,viewBox:Pn(Number(c),Number(p||c),it),xmlns:"http://www.w3.org/2000/svg",stroke:r,"data-testid":"oval-svg",children:t.jsx("g",{fill:"none",fillRule:"evenodd",children:t.jsxs("g",{transform:"translate(1 1)",strokeWidth:Number(p||c),"data-testid":"oval-secondary-group",children:[t.jsx("circle",{strokeOpacity:".5",cx:"0",cy:"0",r:it,stroke:n,strokeWidth:c}),t.jsx("path",{d:Rn(it),children:t.jsx("animateTransform",{attributeName:"transform",type:"rotate",from:"0 0 0",to:"360 0 0",dur:`${y}s`,repeatCount:"indefinite"})})]})})})}),In=kt`
to {
   transform: rotate(360deg);
 }
`;ye.svg`
  animation: ${In} ${e=>String(e.$animationDuration).endsWith("s")?String(e.$animationDuration):`${e.$animationDuration}s`} steps(12, end) infinite;
`;ye.polyline`
  stroke-width: ${e=>`${e.$strokeWidth}px`};
  stroke-linecap: round;

  &:nth-child(12n + 0) {
    stroke-opacity: 0.08;
  }

  &:nth-child(12n + 1) {
    stroke-opacity: 0.17;
  }

  &:nth-child(12n + 2) {
    stroke-opacity: 0.25;
  }

  &:nth-child(12n + 3) {
    stroke-opacity: 0.33;
  }

  &:nth-child(12n + 4) {
    stroke-opacity: 0.42;
  }

  &:nth-child(12n + 5) {
    stroke-opacity: 0.5;
  }

  &:nth-child(12n + 6) {
    stroke-opacity: 0.58;
  }

  &:nth-child(12n + 7) {
    stroke-opacity: 0.66;
  }

  &:nth-child(12n + 8) {
    stroke-opacity: 0.75;
  }

  &:nth-child(12n + 9) {
    stroke-opacity: 0.83;
  }

  &:nth-child(12n + 11) {
    stroke-opacity: 0.92;
  }
`;var Fn=kt`
to {
   stroke-dashoffset: 136;
 }
`;ye.polygon`
  stroke-dasharray: 17;
  animation: ${Fn} 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
`;ye.svg`
  transform-origin: 50% 65%;
`;function Bt(){const{cartItems:e,loading:s,getTotalPrice:r,removeFromCart:n}=ys(),[a,o]=u.useState(!1),[i,l]=u.useState({}),c=u.useRef(null),p=Array.isArray(e)?e:[];u.useEffect(()=>{const g=k=>{c.current&&!c.current.contains(k.target)&&o(!1)};if(a)return document.addEventListener("mousedown",g),()=>document.removeEventListener("mousedown",g)},[a]);const y=async g=>{l(x=>({...x,[g]:!0}));const k=await n(g);l(x=>({...x,[g]:!1})),k.success||ws.fire({icon:"error",title:"Error",text:k.message||"Failed to remove item"})},j=p.reduce((g,k)=>g+parseFloat(k.price||0)*(k.quantity||1),0);return t.jsxs("div",{className:"position-relative",ref:c,children:[t.jsxs("button",{onClick:()=>o(!a),className:"cart-icon-btn position-relative d-flex align-items-center justify-content-center p-2",style:{background:"none",border:"none",cursor:"pointer",transition:"transform 0.2s ease"},onMouseEnter:g=>g.currentTarget.style.transform="scale(1.1)",onMouseLeave:g=>g.currentTarget.style.transform="scale(1)",children:[t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"#23262F",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("circle",{cx:"9",cy:"21",r:"1"}),t.jsx("circle",{cx:"20",cy:"21",r:"1"}),t.jsx("path",{d:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"})]}),p.length>0&&t.jsx("span",{className:"cart-badge position-absolute badge rounded-pill",style:{backgroundColor:"#43ACE9",fontSize:"10px",padding:"4px 6px",top:"1px",right:"-2px",transform:"none"},children:p.length})]}),a&&t.jsx("div",{className:"cart-popup-container",children:t.jsxs("div",{className:"cart-popup-content shadow-lg border-0",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-center cart-popup-header",children:[t.jsx("h5",{className:"mb-0 fw-bold",style:{color:"#23262F",fontFamily:'"Inter", sans-serif'},children:"Shopping Cart"}),t.jsx("button",{onClick:()=>o(!1),className:"btn-close btn-sm shadow-none"})]}),s?t.jsx("div",{className:"text-center py-5",children:t.jsx(gt,{height:40,width:40,color:"#43ACE9"})}):p.length===0?t.jsxs("div",{className:"text-center py-5",children:[t.jsx("div",{className:"mb-3 opacity-25",children:t.jsx("i",{className:"fa-solid fa-cart-shopping fa-4x text-muted"})}),t.jsx("p",{className:"text-muted fw-medium mb-4",children:"Your Cart is empty"}),t.jsx(_,{href:C("marketplace.index"),className:"btn btn-dark px-4 py-2 small fw-bold",onClick:()=>o(!1),style:{backgroundColor:"#23262F",borderRadius:"12px"},children:"Browse Products"})]}):t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"cart-items-scroll pe-2",style:{maxHeight:"350px",overflowY:"auto"},children:p.map(g=>t.jsxs("div",{className:"cart-popup-item d-flex gap-3 mb-3 last-child-mb-0",children:[t.jsx("div",{className:"flex-shrink-0 cart-popup-item-image",children:t.jsx("img",{src:g.image?g.image.startsWith("http")?g.image:`https://admin.xpertbid.com/${g.image}`:"/assets/images/placeholder.png",alt:g.title,className:"w-100 h-100 object-fit-cover",onError:k=>k.target.src="/assets/images/WebsiteBanner2.png"})}),t.jsxs("div",{className:"cart-popup-item-details flex-grow-1 min-width-0",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-start gap-2 mb-2",children:[t.jsx("h6",{className:"mb-0 fw-bold cart-popup-item-title",children:g.title}),t.jsx("button",{onClick:()=>y(g.id),disabled:i[g.id],className:"btn btn-link text-danger p-0 border-0 shadow-none cart-popup-remove-btn",children:i[g.id]?t.jsx(gt,{height:14,width:14,color:"#dc3545"}):t.jsx("i",{className:"fa-solid fa-trash-can small"})})]}),t.jsxs("div",{className:`cart-popup-item-meta ${g.variation_name?"":"is-compact"}`,children:[g.variation_name&&t.jsx("p",{className:"small text-muted mb-0 cart-popup-item-variation",children:g.variation_name}),t.jsx("span",{className:"fw-bold text-dark cart-popup-item-price me-auto",children:t.jsx(Nt,{amountAED:g.price})}),t.jsxs("span",{className:"small text-muted cart-popup-item-qty",children:["Qty: ",g.quantity||1]})]})]})]},g.id))}),t.jsxs("div",{className:"cart-popup-footer",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[t.jsx("span",{className:"text-muted fw-medium",children:"Subtotal"}),t.jsx("span",{className:"fw-bold fs-5",style:{color:"#43ACE9"},children:t.jsx(Nt,{amountAED:j})})]}),t.jsxs("div",{className:"d-grid gap-2",children:[t.jsx(_,{href:C("cart.index"),onClick:()=>o(!1),className:"btn cart-popup-action-btn cart-popup-action-btn--dark fw-bold small",children:"View Cart"}),t.jsx(_,{href:C("checkout.index"),onClick:()=>o(!1),className:"btn cart-popup-action-btn cart-popup-action-btn--blue fw-bold shadow-sm",children:"Checkout"})]})]})]})]})}),t.jsx("style",{dangerouslySetInnerHTML:{__html:`
                            .cart-popup-container {
                                   position: absolute;
                                   top: 100%;
                                   right: 0;
                                   margin-top: 15px;
                                   width: 380px;
                                   max-width: 90vw;
                                   z-index: 1050;
                             }
                             .cart-popup-content {
                                   background-color: #fff;
                                   padding: 22px;
                                   border-radius: 20px;
                                   animation: popupFadeIn 0.3s ease-out;
                             }
                             .cart-popup-header {
                                   margin-bottom: 18px;
                                   padding-bottom: 14px;
                                   border-bottom: 1px solid #eceff3;
                             }
                             .cart-popup-item {
                                   padding: 12px 0;
                                   border-bottom: 1px solid #f3f4f6;
                             }
                             .cart-popup-item-image {
                                   width: 74px;
                                   height: 74px;
                                   border-radius: 14px;
                                   overflow: hidden;
                                   border: 1px solid #f0f0f0;
                                   background: #f8fafc;
                             }
                             .cart-popup-item-details {
                                   display: grid;
                                   grid-template-columns: minmax(0, 1fr);
                                   align-content: start;
                                   min-width: 0;
                             }
                             .cart-popup-item-title {
                                   font-size: 16px;
                                   line-height: 1.35;
                                   color: #23262F;
                                   white-space: normal;
                                   word-break: break-word;
                                   padding-right: 8px;
                             }
                             .cart-popup-item-meta {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   gap: 12px;
                                   margin-bottom: 8px;
                             }
                             .cart-popup-item-meta.is-compact {
                                   justify-content: flex-end;
                                   margin-bottom: 4px;
                              }
                             .cart-popup-item-variation {
                                   flex: 1;
                                   text-align: left;
                             }
                             .cart-popup-item-bottom {
                                   display: flex;
                                   align-items: center;
                                   justify-content: flex-start;
                             }
                             .cart-popup-item-price {
                                   font-size: 15px;
                             }
                             .cart-popup-item-qty {
                                   min-width: fit-content;
                                   white-space: nowrap;
                                   text-align: right;
                             }
                             .cart-popup-remove-btn {
                                   min-width: 18px;
                                   flex-shrink: 0;
                                   margin-top: 2px;
                             }
                             .cart-popup-footer {
                                   margin-top: 18px;
                                   padding-top: 18px;
                                   border-top: 1px solid #eceff3;
                             }
                             .cart-popup-action-btn {
                                   min-height: 48px;
                                   border-radius: 12px;
                                   font-size: 15px;
                                   padding: 10px 16px;
                                   border: none;
                             }
                             .cart-popup-action-btn--dark {
                                   background: #23262F;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--dark:hover {
                                   background: #151922;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--blue {
                                   background: #43ACE9;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--blue:hover {
                                   background: #2f9cdb;
                                   color: #fff;
                             }
                             .cart-items-scroll::-webkit-scrollbar { width: 4px; }
                             .cart-items-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
                             .cart-items-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
                             .last-child-mb-0:last-child { margin-bottom: 0 !important; }
                             @keyframes popupFadeIn {
                                   from { opacity: 0; transform: translateY(-10px); }
                                   to { opacity: 1; transform: translateY(0); }
                             }
                             @media (max-width: 576px) {
                                   .cart-popup-container {
                                          position: fixed;
                                          top: 74px;
                                          left: 50%;
                                          transform: translateX(-50%);
                                          width: 95%;
                                   }
                                   .cart-popup-content {
                                          padding: 18px;
                                          border-radius: 18px;
                                   }
                                   .cart-popup-item-title {
                                          font-size: 15px;
                                    }
                                   .cart-popup-item-meta {
                                          align-items: flex-start;
                                   }
                                   .cart-popup-action-btn {
                                          min-height: 44px;
                                          border-radius: 10px;
                                          font-size: 14px;
                                   }
                             }
                      `}})]})}function $n(){const{t:e}=de(),[s,r]=u.useState([]),[n,a]=u.useState(!1),o=u.useRef(null),i=u.useRef(null);return u.useEffect(()=>{X.get("/get-category").then(l=>r(l.data.categories||[])).catch(l=>console.error(l))},[]),u.useEffect(()=>{const l=o.current;if(!l)return;const c=()=>a(!0),p=()=>a(!1);return l.addEventListener("show.bs.dropdown",c),l.addEventListener("hide.bs.dropdown",p),()=>{l.removeEventListener("show.bs.dropdown",c),l.removeEventListener("hide.bs.dropdown",p)}},[]),t.jsxs("div",{className:"dropdown",ref:o,children:[t.jsxs("a",{className:"btn nav-link d-flex align-items-center",href:"#",ref:i,role:"button",id:"categoriesDropdown","data-bs-toggle":"dropdown","aria-expanded":n,style:{border:"none"},children:[e("Categories"),t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",className:"ms-1",children:n?t.jsx("path",{d:"M3.4001 12.5416L8.83344 7.10829C9.4751 6.46663 10.5251 6.46663 11.1668 7.10829L16.6001 12.5416",stroke:"#606060",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}):t.jsx("path",{d:"M16.5999 7.45837L11.1666 12.8917C10.5249 13.5334 9.4749 13.5334 8.83324 12.8917L3.3999 7.45837",stroke:"#606060",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),t.jsx("ul",{className:"dropdown-menu","aria-labelledby":"categoriesDropdown",children:s.map(l=>t.jsx("li",{children:t.jsx(_,{href:C("marketplace.type",{slug:l.slug,typeSlug:"auctions"}),className:"dropdown-item",children:l.name})},l.slug))})]})}function On(){const{t:e}=de(),[s,r]=u.useState([]),[n,a]=u.useState(!1),o=u.useRef();return u.useEffect(()=>{X.get("/get-all-categories").then(i=>{r(i.data.category||i.data.categories||[])}).catch(i=>console.error(i))},[]),u.useEffect(()=>{const i=o.current;if(!i)return;const l=i.parentNode;if(!l)return;function c(){a(!0)}function p(){a(!1)}return l.addEventListener("show.bs.dropdown",c),l.addEventListener("hide.bs.dropdown",p),()=>{l.removeEventListener("show.bs.dropdown",c),l.removeEventListener("hide.bs.dropdown",p)}},[]),t.jsxs("div",{className:"dropdown",children:[t.jsxs("button",{className:"btn nav-link dropdown-toggle",type:"button",id:"categoriesDropdown","data-bs-toggle":"dropdown","aria-expanded":n,ref:o,style:{border:"none",display:"inline-flex",alignItems:"center",gap:"6px"},children:[e("Categories"),t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",className:"ms-0",children:n?t.jsx("path",{d:"M3.4001 12.5416L8.83344 7.10829C9.4751 6.46663 10.5251 6.46663 11.1668 7.10829L16.6001 12.5416",stroke:"#606060",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}):t.jsx("path",{d:"M16.5999 7.45837L11.1666 12.8917C10.5249 13.5334 9.4749 13.5334 8.83324 12.8917L3.3999 7.45837",stroke:"#606060",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),t.jsx("ul",{className:"dropdown-menu","aria-labelledby":"categoriesDropdown",children:s.map(i=>t.jsx("li",{children:t.jsx(_,{href:C("marketplace.type",{slug:i.slug,typeSlug:"auctions"}),className:"dropdown-item",children:i.name})},i.id))})]})}const Wt=()=>{const{auth:e}=xe().props,[s,r]=u.useState(!1),[n,a]=u.useState([]),[o,i]=u.useState(!0),[l,c]=u.useState(null),p=u.useRef(null);u.useEffect(()=>{e.user&&y()},[e.user]),u.useEffect(()=>{const h=E=>{p.current&&!p.current.contains(E.target)&&!E.target.closest(".notification")&&r(!1)};return document.addEventListener("mousedown",h),()=>{document.removeEventListener("mousedown",h)}},[]);const y=async()=>{try{const h=await X.get("/api/notifications");a(h.data)}catch(h){console.error("Error fetching notifications:",h)}finally{i(!1)}},j=async h=>{try{await X.post(`/api/notifications/read/${h}`),a(E=>E.map(v=>v.id===h?{...v,read_at:new Date().toISOString()}:v))}catch(E){console.error("Error marking notification as read:",E)}},g=async()=>{try{await X.post("/api/notifications/read-all"),a(h=>h.map(E=>({...E,read_at:new Date().toISOString()})))}catch(h){console.error("Error marking notifications as read:",h)}},k=async()=>{if(l)try{await X.delete(`/api/notifications/${l.id}`),a(h=>h.filter(E=>E.id!==l.id)),c(null)}catch(h){console.error("Error deleting notification:",h)}},x=n.filter(h=>!h.read_at).length;return t.jsxs("div",{className:"notification-container",children:[t.jsxs("button",{className:"notification nav-notification rounded",style:{border:"none",backgroundColor:"transparent",position:"relative",padding:"8px",paddingLeft:"0px"},onClick:()=>r(!s),children:[t.jsx("img",{src:"/assets/images/notificationIcon.svg",alt:"Notifications"}),x>0&&t.jsx("span",{style:{position:"absolute",top:"2px",right:"0px",backgroundColor:"#43ACE9",color:"white",borderRadius:"50%",width:"18px",height:"18px",fontSize:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold"},children:x>99?"99+":x})]}),s&&t.jsxs("div",{className:"notification-popup",ref:p,children:[t.jsxs("div",{className:"notification-content p-3 border-bottom d-flex justify-content-between align-items-center",children:[t.jsx("h3",{className:"m-0",style:{fontSize:"1rem",color:"#23262F",fontWeight:700},children:n.length>0?"Notifications":"No new notifications"}),n.length>0&&t.jsxs("button",{className:"markAsRead btn btn-link p-0 text-decoration-none",style:{fontSize:"0.8rem",color:"#43ACE9",fontWeight:600},onClick:g,children:[t.jsx("img",{src:"/assets/images/double-tick.svg",alt:"Mark All",className:"me-1"})," Mark all read"]})]}),t.jsxs("div",{className:"notification-body",style:{maxHeight:"300px",overflowY:"auto"},children:[o&&t.jsx("p",{className:"p-3 text-center",style:{color:"#23262F"},children:"Loading notifications..."}),!o&&n.length===0&&t.jsx("p",{className:"p-3 text-center",style:{color:"#23262F"},children:"Empty"}),!o&&n.map(h=>t.jsx("div",{className:`notification-item p-2 border-bottom ${h.read_at?"opacity-50":""}`,style:{fontSize:"0.85rem"},children:t.jsxs("div",{className:"d-flex gap-2",children:[t.jsx("img",{src:h.image_url||"/assets/images/message-text.svg",alt:"",width:32,height:32}),t.jsxs("div",{className:"flex-grow-1",children:[t.jsx("p",{className:"mb-0 fw-bold",style:{color:"#23262F"},children:h.title}),t.jsx("p",{className:"mb-0 text-muted",style:{fontSize:"0.75rem"},children:new Date(h.created_at).toLocaleString()})]}),t.jsxs("div",{className:"d-flex flex-column gap-1",children:[!h.read_at&&t.jsx("button",{className:"btn btn-sm btn-link p-0",onClick:()=>j(h.id),children:t.jsx("i",{className:"fa-solid fa-check text-success"})}),t.jsx("button",{className:"btn btn-sm btn-link p-0",onClick:()=>c(h),children:t.jsx("i",{className:"fa-solid fa-xmark text-danger"})})]})]})},h.id))]}),t.jsx("div",{className:"notification-footer p-2 text-center border-top",children:t.jsx(_,{href:"/notifications-page",style:{fontSize:"0.8rem",color:"#23262F",fontWeight:600},children:"See All Notifications"})})]}),l&&t.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(15, 23, 42, 0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1200,padding:"16px"},onClick:()=>c(null),children:t.jsxs("div",{onClick:h=>h.stopPropagation(),style:{width:"100%",maxWidth:"360px",background:"#fff",borderRadius:"16px",boxShadow:"0 20px 45px rgba(15, 23, 42, 0.18)",padding:"22px"},children:[t.jsx("h4",{style:{margin:0,fontSize:"1.05rem",fontWeight:700,color:"#23262F"},children:"Delete Notification"}),t.jsx("p",{style:{margin:"10px 0 0",fontSize:"0.92rem",color:"#5B6475",lineHeight:1.6},children:"Are you sure you want to delete this notification?"}),t.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"18px"},children:[t.jsx("button",{type:"button",onClick:()=>c(null),style:{flex:1,border:"1px solid #D7DEEA",background:"#fff",color:"#23262F",borderRadius:"10px",padding:"11px 14px",fontWeight:600},children:"Cancel"}),t.jsx("button",{type:"button",onClick:k,style:{flex:1,border:"none",background:"#23262F",color:"#fff",borderRadius:"10px",padding:"11px 14px",fontWeight:600},children:"Delete"})]})]})})]})};function zn({isOpen:e,onClose:s}){const[r,n]=u.useState(""),[a,o]=u.useState([]),[i,l]=u.useState(!1),c=u.useRef(null);u.useEffect(()=>{e?(document.body.style.overflow="hidden",setTimeout(()=>c.current?.focus(),100)):(document.body.style.overflow="",n(""),o([]))},[e]),u.useEffect(()=>{if(r.length>2){const y=setTimeout(async()=>{l(!0);try{const{data:j}=await X.get("/search-auctions",{params:{query:r}});o(j.auctions||[])}catch(j){console.error(j)}l(!1)},300);return()=>clearTimeout(y)}else o([])},[r]);const p=y=>{y.preventDefault(),r.trim()&&(J.visit(`/marketplace?search=${encodeURIComponent(r.trim())}`),s())};return e?t.jsxs("div",{className:"search-overlay",children:[t.jsxs("div",{className:"search-box",children:[t.jsx("button",{className:"close-btn",onClick:s,children:t.jsx("i",{className:"fa-solid fa-xmark"})}),t.jsxs("form",{onSubmit:p,children:[t.jsx("input",{ref:c,value:r,onChange:y=>n(y.target.value),placeholder:"Search any auction listing...",onKeyDown:y=>{y.key==="Enter"&&(y.preventDefault(),r.length>2&&(J.visit(`/marketplace?search=${encodeURIComponent(r.trim())}`),s()))}}),t.jsx("button",{type:"submit",className:"search-submit-btn",children:t.jsx("i",{className:"fa-solid fa-magnifying-glass"})})]}),i&&t.jsx("p",{className:"status",children:"Searching..."}),!i&&r.length>2&&a.length===0&&t.jsx("p",{className:"status",children:"No results found"}),a.length>0&&t.jsx("ul",{className:"results",children:a.map(y=>t.jsx("li",{onClick:()=>{J.visit(vs(y.slug)),s()},children:y.title},y.id))})]}),t.jsx("style",{dangerouslySetInnerHTML:{__html:`
                            .search-overlay {
                                   position: fixed; top: 0; left: 0;
                                   width: 100%; height: 70%;
                                   background: #F9F9F9;
                                   backdrop-filter: blur(4px);
                                   z-index: 9999;
                                   display: flex;
                                   box-shadow: 0px 45px 89.4px 0px rgba(0, 0, 0, 0.20);
                                   padding: 60px 10px 0;
                                   border: none;
                            }
                            .search-box {
                                   position: relative;
                                   width: 100%;
                            }
                            .search-box form {
                                   display: flex;
                                   align-items: center;
                                   gap: 10px;
                                   width: 100%;
                            }
                            .search-box input {
                                   width: 100%;
                                   padding: 1rem 2.5rem 1rem 1rem;
                                   font-size: 1rem;
                                   border: none;
                                   border-radius: 8px;
                                   background: #ffffff;
                                   color: #111827;
                                   outline: none;
                                   box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
                            }
                            .search-box input::placeholder {
                                   color: #6b7280;
                            }
                            .search-submit-btn {
                                   background: #23262F;
                                   color: white;
                                   border: none;
                                   border-radius: 8px;
                                   padding: 0.8rem 1.5rem;
                                   cursor: pointer;
                                   font-size: 1.2rem;
                                   transition: background 0.2s;
                            }
                            .search-submit-btn:hover {
                                   background: #1a1c22;
                            }
                            .close-btn {
                                   position: absolute; top: -50px; right: 0;
                                   width: 38px;
                                   height: 38px;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   background: #ffffff;
                                   color: #111827;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 999px;
                                   font-size: 1.1rem;
                                   cursor: pointer;
                                   box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
                                   transition: background 0.2s, color 0.2s, transform 0.2s;
                            }
                            .close-btn:hover {
                                   background: #111827;
                                   color: #ffffff;
                                   transform: translateY(-1px);
                            }
                            .status {
                                   margin-top: 0.5rem;
                                   font-style: italic;
                                   color: #374151;
                            }
                            .results {
                                   margin-top: 0.5rem;
                                   list-style: none; padding: 0;
                                   max-height: 300px; overflow-y: auto;
                                   background: #ffffff;
                                   border-radius: 8px;
                                   box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
                            }
                            .results li {
                                   padding: 0.75rem 1rem;
                                   cursor: pointer;
                                   color: #111827;
                                   border-bottom: 1px solid #f3f4f6;
                            }
                            .results li:hover {
                                   background: #f0f0f0;
                            }
                     `}})]}):null}const Mn=({isOpen:e,onClose:s,onSwitchToRegister:r})=>{const{t:n}=de(),[a,o]=u.useState("loginStep"),[i,l]=u.useState(""),[c,p]=u.useState(!1),[y,j]=u.useState(60),[g,k]=u.useState(!0),[x,h]=u.useState(!1);u.useEffect(()=>{e&&(o("loginStep"),l(""),h(!1))},[e]);const{data:E,setData:v,post:L,processing:P,errors:d}=qt({email:"",password:"",remember:!1}),[f,w]=u.useState({phone:"",otp:"",countryCode:"+92",otp_type:"sms"}),[m,b]=u.useState(""),[$,O]=u.useState(""),[D,T]=u.useState({}),[R,B]=u.useState(!1),N=async S=>{S.preventDefault(),T({}),B(!0);try{await X.post("https://admin.xpertbid.com/api/forgot-password",{email:m}),O("sent")}catch(z){T(z.response?.data?.error||{email:n("auth.failed_send_link")})}finally{B(!1)}},W=S=>{S.preventDefault(),l(""),L(C("login"),{onSuccess:()=>{s()},onError:z=>{l(z.email||n("auth.invalid_credentials"))}})},U=S=>{w(z=>({...z,otp_type:S})),o("phoneLogin")},oe=S=>S.replace(/\D/g,"").length>=7,H=S=>{if(S.preventDefault(),!oe(f.phone)){l(n("auth.invalid_phone"));return}if(!f.password){l(n("auth.enter_password"));return}l("");const z=`${f.countryCode}${f.phone.replace(/^0+/,"")}`;J.post(C("login"),{email:z,password:f.password,remember:!0},{onSuccess:()=>{s()},onError:V=>{l(V.email||n("auth.invalid_credentials_forgot"))}})},ne=async()=>{if(!oe(f.phone)){l(n("auth.invalid_phone"));return}l("");try{const S=`${f.countryCode}${f.phone.replace(/^0+/,"")}`;await X.post("/api/auth/send-otp",{phone:S,type:"login",otp_type:f.otp_type}),p(!0),o("otpStep"),te()}catch(S){l(S.response?.data?.message||n("auth.failed_send_otp"))}},pe=async()=>{l("");try{const S=`${f.countryCode}${f.phone.replace(/^0+/,"")}`;await X.post("/api/auth/verify-otp",{phone:S,otp:f.otp}),s(),J.visit(C("dashboard"))}catch(S){l(S.response?.data?.message||n("auth.invalid_otp"))}},te=()=>{k(!0),j(60);const S=setInterval(()=>{j(z=>z<=1?(clearInterval(S),k(!1),0):z-1)},1e3)},Me=()=>{window.location.href=C("auth.google")};return e?t.jsx("div",{className:"loginModal",style:{display:e?"block":"none"},children:t.jsxs("div",{className:"loginModal-content",children:[t.jsx("span",{className:"close-btn",id:"closeLoginModal",onClick:s,children:t.jsx("i",{className:"fa-solid fa-xmark"})}),a==="loginStep"&&t.jsxs("div",{id:"loginStep",className:"login-form-step active text-center",children:[t.jsx("h3",{className:"mb-4 fw-bold",children:n("auth.login_or_signup")}),t.jsxs("button",{onClick:()=>U("sms"),className:"loginContinueIcon",children:[t.jsx("img",{src:"/assets/images/MobileLogo.svg",alt:"Phone",width:20,className:"me-2"}),n("auth.continue_phone")]}),t.jsxs("button",{onClick:Me,className:"loginContinueIcon",children:[t.jsx("img",{src:"/assets/images/googleLogo.svg",alt:"Google",width:20,className:"me-2"}),n("auth.continue_google")]}),t.jsxs("button",{onClick:()=>o("loginEmail"),className:"loginContinueIcon",children:[t.jsx("img",{src:"/assets/images/smsLogo.svg",alt:"Email",width:20,className:"me-2"}),n("auth.continue_email")]}),t.jsxs("button",{className:"loginContinueIcon",children:[t.jsx("img",{src:"/assets/images/appleLogo.svg",alt:"Apple",width:20,className:"me-2"}),n("auth.continue_apple")]}),t.jsxs("p",{className:"small text-left text-muted mb-0 mt-3",children:[n("auth.by_continuing_prefix")," xpertBid ",t.jsx(_,{href:"/terms",className:"text-decoration-underline text-primary",onClick:s,children:n("auth.terms_of_service")})," ",n("auth.and")," ",t.jsx(_,{href:"/privacy-policy",className:"text-decoration-underline text-primary",onClick:s,children:n("auth.privacy_policy")})]})]}),a==="phoneLogin"&&t.jsxs("div",{id:"loginStep2",className:"login-form-step",children:[t.jsxs("div",{className:"step-heading-and-back",children:[t.jsx("button",{id:"backPhoneLogin",onClick:()=>o("loginStep"),children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{className:"mb-0 fw-bold",children:n("auth.login_with_phone")})]}),t.jsxs("div",{className:"mb-3",children:[t.jsxs("select",{className:"form-select border-0 bg-light rounded-3",value:f.countryCode,onChange:S=>w({...f,countryCode:S.target.value}),style:{width:"100%",marginBottom:"20px",height:"68px",borderRadius:"12px",border:"1px solid #FAFAFA",backgroundColor:"#FAFAFA",fontSize:"18px",fontWeight:"600",color:"#23262F",boxShadow:"15px 19px 50px 0 #0000001c"},children:[t.jsx("option",{value:"+92",children:"+92 PK"}),t.jsx("option",{value:"+971",children:"+971 UAE"})]}),t.jsx("input",{type:"tel",className:"form-control",placeholder:n("auth.enter_phone_number"),value:f.phone,onChange:S=>w({...f,phone:S.target.value.replace(/\D/g,"")}),style:{width:"100%",marginBottom:"20px",height:"68px",borderRadius:"12px",border:"1px solid #FAFAFA",backgroundColor:"#FAFAFA",fontSize:"18px",fontWeight:"600",color:"#23262F",boxShadow:"15px 19px 50px 0 #0000001c"}})]}),t.jsxs("div",{className:"mb-3 position-relative",children:[t.jsx("input",{type:x?"text":"password",placeholder:n("auth.enter_password_placeholder"),value:f.password||"",onChange:S=>w({...f,password:S.target.value}),className:"form-control",style:{paddingRight:"40px",marginBottom:"20px",height:"68px",borderRadius:"12px",border:"1px solid #FAFAFA",backgroundColor:"#FAFAFA",fontSize:"18px",fontWeight:"600",color:"#23262F",boxShadow:"15px 19px 50px 0 #0000001c"}}),t.jsx("button",{type:"button",className:"btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted",onClick:()=>h(!x),style:{right:"10px",top:"34px"},children:t.jsx("i",{className:`fa-solid ${x?"fa-eye-slash":"fa-eye"}`})})]}),i&&t.jsx("div",{className:"alert alert-danger py-2 small mb-3",children:i}),t.jsx("p",{className:"mt-2 mb-4 text-muted small",children:n("auth.login_phone_hint")}),t.jsx("button",{className:"form-button-1",onClick:H,children:n("Login")})]}),a==="otpStep"&&t.jsxs("div",{id:"otpStep",className:"login-form-step",children:[t.jsxs("div",{className:"step-heading-and-back",children:[t.jsx("button",{id:"backOtpLogin",onClick:()=>o("phoneLogin"),children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{className:"mb-0 fw-bold",children:n("auth.verify_otp")})]}),t.jsxs("p",{className:"mb-4 small text-muted text-center",children:[n("auth.enter_sent_otp")," ",f.countryCode,f.phone]}),t.jsx("div",{className:"mb-4 d-flex justify-content-center gap-2",children:[0,1,2,3,4,5].map(S=>t.jsx("input",{id:`otp-input-${S}`,type:"text",maxLength:1,className:"form-control text-center fw-bold fs-4",value:f.otp[S]||"",onChange:z=>{const V=z.target.value.replace(/\D/g,"");if(!V)return;const Ae=f.otp.split("");Ae[S]=V;const ve=Ae.join("");w({...f,otp:ve}),S<5&&document.getElementById(`otp-input-${S+1}`).focus()},onKeyDown:z=>{if(z.key==="Backspace")if(!f.otp[S]&&S>0)document.getElementById(`otp-input-${S-1}`).focus();else{const V=f.otp.split("");V[S]="",w({...f,otp:V.join("")})}},onPaste:z=>{z.preventDefault();const V=z.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);w({...f,otp:V})},style:{width:"50px",height:"60px",borderRadius:"12px",border:"1px solid #FAFAFA",backgroundColor:"#FAFAFA",boxShadow:"15px 19px 50px 0 #0000001c"}},S))}),i&&t.jsx("div",{className:"alert alert-danger py-2 small mb-3",children:i}),t.jsx("button",{className:"form-button-1",disabled:f.otp.length<6,onClick:pe,children:n("auth.verify_and_login")}),t.jsx("div",{className:"text-center mt-3",children:t.jsx("button",{className:"btn btn-link text-decoration-none p-0 small text-dark fw-bold",disabled:g,onClick:ne,children:g?`${n("auth.resend_in")} ${y}s`:n("auth.resend_code")})})]}),a==="loginEmail"&&t.jsxs("div",{id:"loginEmail",className:"login-form-step",children:[t.jsxs("div",{className:"step-heading-and-back",children:[t.jsx("button",{id:"backValidationLogin",onClick:()=>o("loginStep"),children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{className:"mb-0 fw-bold",children:n("auth.login_with_email")})]}),t.jsxs("form",{onSubmit:W,children:[t.jsx("div",{className:"mb-3",children:t.jsx("input",{type:"email",placeholder:n("auth.enter_email"),value:E.email,onChange:S=>v("email",S.target.value),required:!0})}),t.jsxs("div",{className:"mb-3 position-relative",children:[t.jsx("input",{type:x?"text":"password",placeholder:n("auth.enter_password_placeholder"),value:E.password,onChange:S=>v("password",S.target.value),required:!0,style:{paddingRight:"40px"}}),t.jsx("button",{type:"button",className:"btn position-absolute end-0 translate-middle-y border-0 bg-transparent text-muted",onClick:()=>h(!x),style:{right:"10px",top:"34px"},children:t.jsx("i",{className:`fa-solid ${x?"fa-eye-slash":"fa-eye"}`})})]}),t.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[t.jsxs("div",{className:"form-check mb-0",children:[t.jsx("input",{className:"form-check-input",type:"checkbox",id:"rememberMe",checked:E.remember,onChange:S=>v("remember",S.target.checked),style:{marginTop:"0.2rem"}}),t.jsx("label",{className:"form-check-label small text-muted ms-2",htmlFor:"rememberMe",style:{paddingTop:"1px"},children:n("auth.remember_me")})]}),t.jsx("button",{type:"button",className:"btn btn-link small text-dark fw-bold text-decoration-none p-0",onClick:()=>o("forgotPassword"),children:n("auth.forgot_password")})]}),i&&t.jsx("div",{className:"alert alert-danger py-2 small mb-3",children:i}),t.jsx("button",{className:"form-button-1",disabled:P,children:n(P?"auth.logging_in":"auth.continue")})]})]}),a==="forgotPassword"&&t.jsxs("div",{id:"forgotPasswordStep",className:"login-form-step",style:{backgroundColor:"#ffffff"},children:[t.jsxs("div",{className:"step-heading-and-back",children:[t.jsx("button",{id:"backForgotPassword",onClick:()=>{O(""),o("loginEmail")},style:{position:"absolute",left:0,top:0,background:"none",border:"none",fontSize:"18px",cursor:"pointer",color:"#666"},children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{className:"mb-0 fw-bold",children:n("auth.login_or_signup")})]}),$==="sent"?t.jsxs("div",{className:"text-center py-4",children:[t.jsx("div",{className:"mb-4",children:t.jsx("img",{src:"/assets/images/send_email.png",alt:"Email sent",width:120,height:120,className:"mx-auto"})}),t.jsx("h2",{className:"fw-bold mb-3",style:{fontSize:"24px"},children:n("auth.check_email")}),t.jsxs("p",{className:"text-muted small mb-4",children:[n("auth.reset_link_sent_line_1"),t.jsx("br",{}),n("auth.reset_link_sent_line_2")]}),t.jsx("button",{className:"form-button-1",onClick:()=>{O(""),o("loginEmail")},children:n("auth.back_to_login")})]}):t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"text-center",children:[t.jsx("img",{src:"/assets/images/forgetpassword.svg",className:"mx-auto mt-4 mb-4",alt:"Forgot password illustration"}),t.jsx("h2",{className:"fw-bold mb-3",style:{fontSize:"24px"},children:n("auth.forgot_your_password")}),t.jsx("p",{className:"text-muted small mb-4",children:n("auth.forgot_password_hint")})]}),t.jsxs("div",{className:"mb-3",children:[t.jsx("input",{type:"email",placeholder:n("auth.enter_email"),value:m,onChange:S=>b(S.target.value),className:"form-control",style:{marginBottom:"20px",width:"100%",borderRadius:"12px",height:"68px",border:"1px solid #FAFAFA",backgroundColor:"#FAFAFA",fontSize:"18px",color:"#23262F",boxShadow:"15px 19px 50px 0 #0000001c",fontWeight:"600",padding:"0 20px"}}),D.email&&t.jsx("div",{className:"text-danger small mt-1",children:Array.isArray(D.email)?D.email[0]:D.email})]}),t.jsx("button",{className:"form-button-1",onClick:N,disabled:R,children:n(R?"auth.sending":"auth.send_link")})]})]})]})}):null},Tn=({isOpen:e,onClose:s,onSwitchToLogin:r})=>{const{t:n}=de(),[a,o]=u.useState("step1"),[i,l]=u.useState(""),[c,p]=u.useState(!1),[y,j]=u.useState(!1),[g,k]=u.useState(60),[x,h]=u.useState(!1),E=u.useRef([]);u.useEffect(()=>{e&&(o("step1"),l(""))},[e]);const{data:v,setData:L,post:P,processing:d,errors:f,reset:w}=qt({name:"",email:"",phone:"",password:"",countryCode:"+92",terms:!0,otp:"",signup_source:"web"}),m=N=>{o(N)},b=(N,W)=>{const U=W.replace(/\D/g,"");if(U.length>1){const ne=U.slice(0,6);L("otp",ne),E.current[Math.min(ne.length,5)]?.focus();return}const oe=(v.otp||"").padEnd(6," ").split("");oe[N]=U;const H=oe.join("").replace(/\s/g,"");L("otp",H),U&&N<5&&E.current[N+1]?.focus()},$=(N,W)=>{W.key==="Backspace"&&!(v.otp||"")[N]&&N>0&&E.current[N-1]?.focus()},O=N=>{N.preventDefault(),l(""),P(C("register"),{onSuccess:()=>{s()},onError:W=>{l(Object.values(W)[0]||n("auth.registration_failed"))}})},D=async()=>{if(!v.name||!v.phone||!v.password){l(n("auth.all_fields_required"));return}p(!0),l("");try{const N=`${v.countryCode}${v.phone.replace(/^0+/,"")}`;await X.post("/api/auth/send-otp",{phone:N,type:"register",signup_source:"web"}),j(!0),o("otpVerification"),R()}catch(N){l(N.response?.data?.message||n("auth.failed_send_otp"))}finally{p(!1)}},T=async()=>{p(!0),l("");try{const N=`${v.countryCode}${v.phone.replace(/^0+/,"")}`;await X.post("/api/auth/verify-otp",{phone:N,otp:v.otp,name:v.name,password:v.password,signup_source:"web"}),s(),J.visit(C("dashboard"))}catch(N){l(N.response?.data?.message||n("auth.invalid_otp"))}finally{p(!1)}},R=()=>{h(!0),k(60);const N=setInterval(()=>{k(W=>W<=1?(clearInterval(N),h(!1),0):W-1)},1e3)},B=()=>{window.location.href=C("auth.google")};return e?t.jsx("div",{id:"SignupModal",className:"signupModal video-modal",style:{display:e?"block":"none",position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",zIndex:1060,overflowY:"auto"},children:t.jsxs("div",{className:`signupmodal-content ${a==="otpVerification"?"signupmodal-content--otp":""}`,style:{position:"relative",margin:"50px auto",backgroundColor:"#fff",padding:"20px",borderRadius:"10px",maxWidth:"600px"},children:[t.jsx("span",{className:"close-btn",style:{position:"absolute",right:"20px",top:"20px",cursor:"pointer",zIndex:10},onClick:s,children:t.jsx("i",{className:"fa-solid fa-xmark",style:{backgroundColor:"#EDEDED",color:"#23262F",padding:"6px 8px",fontSize:"12px",borderRadius:"100%"}})}),a==="step1"&&t.jsxs("div",{className:"text-center",children:[t.jsx("h2",{className:"mb-4 fw-bold text-center",children:n("Sign Up")}),t.jsxs("button",{onClick:B,className:"signUpContinueIcon",children:[t.jsx("img",{src:"/assets/images/googleLogo.svg",alt:"Google",width:20,className:"me-2"}),n("auth.continue_google")]}),t.jsxs("button",{className:"signUpContinueIcon",children:[t.jsx("img",{src:"/assets/images/appleLogo.svg",alt:"Apple",width:20,className:"me-2"}),n("auth.continue_apple")]}),t.jsxs("button",{onClick:()=>m("emailSignup"),className:"signUpContinueIcon",children:[t.jsx("img",{src:"/assets/images/smsLogo.svg",alt:"Email",width:20,className:"me-2"}),n("auth.signup_with_email")]}),t.jsxs("button",{onClick:()=>m("phoneSignup"),className:"signUpContinueIcon",children:[t.jsx("img",{src:"/assets/images/MobileLogo.svg",alt:"Phone",width:20,className:"me-2"}),n("auth.signup_with_phone")]}),t.jsxs("p",{className:"small text-left text-muted my-4",children:[n("auth.by_continuing_prefix")," xpertBid ",t.jsx(_,{href:"/terms",className:"text-decoration-underline text-primary",onClick:s,children:n("auth.terms_of_service")})," ",n("auth.and")," ",t.jsx(_,{href:"/privacy-policy",className:"text-decoration-underline text-primary",onClick:s,children:n("auth.privacy_policy")})]})]}),a==="emailSignup"&&t.jsxs("div",{id:"stepEmail",children:[t.jsxs("div",{className:"step-heading-and-back",children:[t.jsx("button",{id:"backEmail",onClick:()=>m("step1"),children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{className:"mb-0 fw-bold",children:n("auth.signup_with_email")})]}),t.jsxs("form",{onSubmit:O,children:[t.jsx("div",{className:"mb-3",children:t.jsx("input",{type:"text",placeholder:n("auth.enter_name"),value:v.name,onChange:N=>L("name",N.target.value),required:!0})}),t.jsx("div",{className:"mb-3",children:t.jsx("input",{type:"email",placeholder:n("auth.enter_email"),value:v.email,onChange:N=>L("email",N.target.value),required:!0})}),t.jsx("div",{className:"mb-3",children:t.jsx("input",{type:"tel",placeholder:n("auth.enter_phone_number"),value:v.phone,onChange:N=>L("phone",N.target.value),required:!0})}),t.jsx("div",{className:"mb-4",children:t.jsx("input",{type:"password",placeholder:n("auth.create_password"),value:v.password,onChange:N=>L("password",N.target.value),required:!0})}),i&&t.jsx("div",{className:"alert-message",children:i}),t.jsx("button",{className:"form-button-1",disabled:d,children:n(d?"auth.creating_account":"auth.continue")})]}),t.jsxs("div",{className:"text-center mt-3",children:[t.jsxs("span",{className:"small text-muted",children:[n("auth.already_have_account")," "]}),t.jsx("button",{className:"btn btn-link text-decoration-underline p-0 small text-dark fw-bold",onClick:r,children:n("Login")})]})]}),a==="phoneSignup"&&t.jsxs("div",{id:"phoneSignup",children:[t.jsxs("div",{className:"step-heading-and-back",children:[t.jsx("button",{className:"backbuttonSignup",onClick:()=>m("step1"),children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{className:"mb-0 fw-bold",children:n("auth.signup_with_phone")})]}),t.jsx("div",{className:"mb-3",children:t.jsx("div",{className:"steps-input-select",children:t.jsx("input",{type:"text",placeholder:n("auth.enter_name"),value:v.name,onChange:N=>L("name",N.target.value),required:!0})})}),t.jsx("div",{className:"mb-3",children:t.jsxs("div",{className:"input-group steps-input-select d-flex",children:[t.jsxs("select",{className:"form-select w-auto flex-grow-0 bg-light border-end-0 rounded-start-3",value:v.countryCode,onChange:N=>L("countryCode",N.target.value),style:{maxWidth:"120px",marginBottom:"20px",borderRadius:"12px 0 0 12px"},children:[t.jsx("option",{value:"+92",children:"+92 PK"}),t.jsx("option",{value:"+971",children:"+971 UAE"})]}),t.jsx("input",{type:"tel",className:"form-control",placeholder:n("auth.enter_phone_number"),value:v.phone,onChange:N=>L("phone",N.target.value.replace(/\D/g,"")),style:{borderRadius:"0 12px 12px 0"}})]})}),t.jsx("div",{className:"mb-4",children:t.jsx("div",{className:"steps-input-select",children:t.jsx("input",{type:"password",placeholder:"Create password",value:v.password,onChange:N=>L("password",N.target.value),required:!0})})}),i&&t.jsx("div",{className:"alert-message",children:i}),t.jsx("button",{className:"form-button-1",disabled:c,onClick:D,children:c?"Sending...":"Send OTP"})]}),a==="otpVerification"&&t.jsxs("div",{id:"emailOtp-container",className:"signup-otp-panel",children:[t.jsxs("div",{className:"step-heading-and-back signup-otp-header",children:[t.jsx("button",{className:"backbuttonSignup signup-otp-back",onClick:()=>m("phoneSignup"),"aria-label":"Back",children:t.jsx("i",{className:"fa-solid fa-chevron-left"})}),t.jsx("h3",{className:"mb-0 fw-bold",children:"Verify OTP"})]}),t.jsxs("p",{className:"signup-otp-copy",children:["Enter the OTP sent to ",t.jsxs("span",{children:[v.countryCode,v.phone]})]}),t.jsx("div",{className:"signup-otp-input-wrap",onPaste:N=>{N.preventDefault(),b(0,N.clipboardData.getData("text"))},children:Array.from({length:6}).map((N,W)=>t.jsx("input",{ref:U=>E.current[W]=U,type:"text",inputMode:"numeric",className:"form-control signup-otp-input",maxLength:1,value:(v.otp||"")[W]||"",onChange:U=>b(W,U.target.value),onKeyDown:U=>$(W,U),"aria-label":`OTP digit ${W+1}`},W))}),i&&t.jsx("div",{className:"alert-message",children:i}),t.jsx("button",{className:"form-button-1 signup-otp-submit",disabled:c||!v.otp||v.otp.length<6,onClick:T,children:c?"Verifying...":"Verify & Sign Up"}),t.jsx("div",{className:"signup-otp-resend",children:t.jsx("button",{className:"btn btn-link text-decoration-none p-0 small fw-bold",disabled:x,onClick:D,children:x?`Resend in ${g}s`:"Resend Code"})})]})]})}):null},gs=u.createContext(),Bn=({children:e})=>{const{url:s}=xe(),[r,n]=u.useState(null),a=()=>n("login"),o=()=>n("register"),i=()=>{if(n(null),typeof window>"u")return;const l=new URL(window.location.href);l.searchParams.has("auth")&&(l.searchParams.delete("auth"),window.history.replaceState({},"",`${l.pathname}${l.search}${l.hash}`))};return u.useEffect(()=>{if(typeof window>"u")return;const c=new URL(window.location.href).searchParams.get("auth");c==="login"?n("login"):c==="register"&&n("register")},[s]),t.jsxs(gs.Provider,{value:{openLogin:a,openRegister:o,closeModals:i,activeModal:r},children:[e,t.jsx(Mn,{isOpen:r==="login",onClose:i,onSwitchToRegister:o}),t.jsx(Tn,{isOpen:r==="register",onClose:i,onSwitchToLogin:a})]})},xs=()=>{const e=u.useContext(gs);if(!e)throw new Error("useAuthModal must be used within an AuthModalProvider");return e};function Wn(){const{auth:e,locale:s}=xe().props,{url:r}=xe(),n=e?.user,{openLogin:a,openRegister:o}=xs(),{t:i}=de(),l=s?.current||"en",p=(s?.supported?.[l]?.direction||(l==="ur"?"rtl":"ltr"))==="rtl",y=(()=>{const R=n?.profile_pic;return R?R.startsWith("http://")||R.startsWith("https://")||R.startsWith("/")?R:`/${R.replace(/^\/+/,"")}`:"/assets/images/user.jpg"})(),j=u.useRef(null),g=u.useRef(null),k=u.useRef(null),[x,h]=u.useState(!1),[E,v]=u.useState(!1),[L,P]=u.useState(!1),[d,f]=u.useState(!1),w={width:"100%",color:"#24282B",fontFamily:'"Inter", sans-serif',direction:p?"rtl":"ltr",flexDirection:"row",justifyContent:p?"flex-end":"flex-start",textAlign:p?"right":"left"},m={...w,color:"#E94343"},b=(R,B)=>p?t.jsxs(t.Fragment,{children:[t.jsx("span",{children:R}),B]}):t.jsxs(t.Fragment,{children:[B,t.jsx("span",{children:R})]}),$=()=>{h(R=>!R)},O=()=>{f(!1)},D=()=>{J.post(C("logout"))},T=R=>{R.preventDefault(),n?J.visit(C("auctions.create")):a()};return u.useEffect(()=>{const R=B=>{j.current&&!j.current.contains(B.target)&&!B.target.closest("#header-profile-dropdown")&&h(!1),g.current&&!g.current.contains(B.target)&&!B.target.closest(".user-profile-setting")&&v(!1),k.current&&d&&!k.current.contains(B.target)&&!B.target.closest(".navbar-toggler")&&f(!1)};return document.addEventListener("mousedown",R),()=>document.removeEventListener("mousedown",R)},[d]),u.useEffect(()=>{f(!1)},[r]),t.jsxs(t.Fragment,{children:[t.jsx(zn,{isOpen:L,onClose:()=>P(!1)}),t.jsx("header",{className:"bg-white ",style:{zIndex:1050},children:t.jsx("nav",{className:"navbar navbar-expand-lg navbar-light bg-white py-2",id:"mainNavbar",children:t.jsxs("div",{className:"container-fluid px-lg-5 my-3",children:[t.jsx(_,{className:"navbar-brand d-flex align-items-center me-0 me-lg-4",href:"/",children:t.jsx("img",{src:"/assets/images/header-logo.png",alt:"XpertBid Logo",width:180,height:50,className:"logo-image",style:{height:"auto",width:"auto"}})}),t.jsxs("div",{className:"mobile-header-actions d-flex d-lg-none align-items-center gap-2 ms-auto me-2",children:[t.jsx("button",{type:"button",className:"btn btn-link p-0 text-muted",onClick:()=>P(!0),"aria-label":i("Search"),children:t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"22",height:"22",viewBox:"0 0 20 20",fill:"none",children:[t.jsx("path",{d:"M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),t.jsx("path",{d:"M18.3332 18.3332L16.6665 16.6665",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})}),t.jsx(Bt,{}),n&&t.jsx(Wt,{}),!n&&t.jsxs("div",{className:"mobile-auth-buttons d-flex align-items-center gap-2",children:[t.jsx("button",{type:"button",className:"mobile-auth-btn mobile-auth-login",onClick:a,children:i("Login")}),t.jsx("button",{type:"button",className:"mobile-auth-btn mobile-auth-signup",onClick:o,children:i("Sign Up")})]})]}),t.jsx("button",{className:"navbar-toggler d-none",type:"button",onClick:()=>f(R=>!R),"aria-controls":"navbarSupportedContent","aria-expanded":d,"aria-label":"Toggle navigation",children:t.jsx("span",{className:"navbar-toggler-icon"})}),t.jsxs("div",{ref:k,className:`navbar-collapse xpert-mobile-menu ${d?"show":""}`,id:"navbarSupportedContent",children:[t.jsxs("ul",{className:"navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center",children:[t.jsx("li",{className:"nav-item d-none d-lg-block me-3",children:t.jsxs("div",{className:"search-trigger px-3 py-1  bg-light d-flex align-items-center ",onClick:()=>P(!0),style:{cursor:"pointer",minWidth:"200px"},children:[t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"18",height:"18",viewBox:"0 0 20 20",fill:"none",children:[t.jsx("path",{d:"M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z",stroke:"#606060",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),t.jsx("path",{d:"M18.3332 18.3332L16.6665 16.6665",stroke:"#606060",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),t.jsx("span",{className:"ms-2 text-muted small",children:i("Search auctions")})]})}),t.jsxs("li",{className:"nav-item dropdown",children:[t.jsx("div",{className:"d-none d-lg-block",children:t.jsx($n,{})}),t.jsx("div",{className:"d-block d-lg-none",children:t.jsx(On,{})})]}),t.jsx("li",{className:"nav-item",children:t.jsx(_,{href:"/live-auctions",className:"nav-link",onClick:O,children:i("Live Auctions")})}),t.jsx("li",{className:"nav-item",children:t.jsx(_,{href:C("about"),className:"nav-link",onClick:O,children:i("About")})}),t.jsx("li",{className:"nav-item",children:t.jsx(_,{href:C("auctions.one_rupee"),className:"nav-link",onClick:O,children:i("1 Rupee Auctions")})})]}),t.jsxs("div",{className:"d-flex align-items-center mt-3 mt-lg-0 header-account-cluster",children:[t.jsxs("div",{className:"d-none d-lg-flex align-items-center mt-2 header-desktop-actions",children:[t.jsx("div",{className:"header-action-cart",children:t.jsx(Bt,{})}),n&&t.jsx("div",{className:"header-action-notification",children:t.jsx(Wt,{})})]}),n?t.jsxs("div",{className:"d-flex align-items-center header-user-actions",children:[t.jsxs("div",{className:"user-profile-setting-container d-none d-lg-block",ref:j,children:[t.jsxs("button",{className:"user-profile-setting btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2",id:"header-profile-dropdown",onClick:$,children:[t.jsx("img",{src:y,alt:"Profile",className:"rounded-circle border",width:"35",height:"35",referrerPolicy:"no-referrer",onError:R=>{R.currentTarget.onerror=null,R.currentTarget.src="/assets/images/user.jpg"}}),t.jsx("i",{className:"fa-solid fa-chevron-down small text-muted"})]}),x&&t.jsx("div",{id:"userProfileSettingPopup",className:"user-profile-setting-popup show",style:{position:"absolute",right:p?"auto":0,left:p?0:"auto",top:"100%"},children:t.jsx("div",{className:"user-profile-setting-content",style:{padding:p?"18px 12px 18px 18px":"18px 18px 18px 12px",textAlign:p?"right":"left"},children:t.jsxs("ul",{className:"user-setting-menu",style:{paddingLeft:0,listStyle:"none",marginBottom:0,width:"100%"},children:[t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("profile.edit"),children:b(i("Account Settings"),t.jsx("img",{src:"/assets/images/profile-setting.svg",alt:"Settings",width:20,height:20}))})}),t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("chat.index"),children:b(i("Messages"),t.jsx("i",{className:"fa-solid fa-comment-dots text-center",style:{width:"20px",fontSize:"18px"}}))})}),t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("favorites.index"),children:b(i("My Favorites"),t.jsx("img",{src:"/assets/images/setting-heart.svg",alt:"Favorites",width:20,height:20}))})}),t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("auctions.mylistings"),children:b(i("My Listings"),t.jsx("img",{src:"/assets/images/mainListing.svg",alt:"Listings",width:20,height:20}))})}),t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("bids.index"),children:b(i("My Bids"),t.jsx("img",{src:"/assets/images/myBids.svg",alt:"Bids",width:20,height:20}))})}),t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("orders.index"),children:b(i("My Orders"),t.jsx("i",{className:"fa-solid fa-box-open text-center",style:{width:"20px",fontSize:"18px"}}))})}),t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("payment_requests.index"),children:b(i("Payment Request"),t.jsx("i",{className:"fa-solid fa-money-check text-center",style:{width:"20px",fontSize:"18px"}}))})}),t.jsx("li",{style:{borderBottom:"1px solid #EDEDED",padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px"},children:t.jsx(_,{className:"d-flex align-items-center gap-2 text-decoration-none",style:w,href:C("verification.identity"),children:b(i("Verification"),t.jsx("i",{className:"fa-solid fa-id-card text-center",style:{width:"20px",fontSize:"18px"}}))})}),t.jsx("li",{style:{padding:"0px 0",fontSize:"16px",fontWeight:"400",lineHeight:"20px",display:"flex",alignItems:"center",gap:"15px",marginTop:"14px"},children:t.jsx("button",{className:"transparent-button d-flex align-items-center gap-2 border-0 bg-transparent p-0",style:m,onClick:D,children:b(i("Log Out"),t.jsx("img",{src:"/assets/images/logout.svg",alt:"Logout"}))})})]})})})]}),t.jsx("button",{className:"sellnow header-sell-btn px-3 d-none d-lg-inline-flex",onClick:T,children:i("Sell Now")})]}):t.jsxs("div",{className:"registration-btns d-flex align-items-center",children:[t.jsx("button",{className:"login me-4",onClick:a,children:i("Login")}),t.jsx("button",{className:"signup me-2",onClick:o,children:i("Sign Up")}),t.jsx("button",{className:"sellnow mx-3 px-3 d-none d-lg-inline-flex",onClick:T,children:i("Sell Now")})]})]})]})]})})}),t.jsx("style",{children:`
                        .no-caret::after {
                            display: none !important;
                        }
                        .dropdown-menu {
                            border: none;
                            border-radius: 12px;
                        }
                        .dropdown-item:active {
                            background-color: #0d6efd;
                        }
                        
                        .user-profile-setting-popup {
                            position: absolute;
                            top: 100%;
                            right: 0;
                            background-color: #FAFAFA;
                            box-shadow: 17px 17px 61px 0 #00000023;
                            width: 300px;
                            border-radius: 12px;
                            z-index: 1000;
                            margin-top: 10px;
                            display: none;
                        }
                        .user-profile-setting-popup.show {
                            display: block;
                        }
                        .user-setting-menu li a:hover {
                            opacity: 0.8;
                        }
                        .header-desktop-actions {
                            gap: 10px;
                            margin-right: 12px;
                        }
                        .header-action-cart,
                        .header-action-notification {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .header-action-cart .cart-icon-btn,
                        .header-action-notification .notification {
                            width: 38px;
                            height: 38px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 10px;
                            padding: 0 !important;
                        }
                        .user-profile-setting {
                            min-height: 38px;
                            gap: 8px !important;
                        }
                        .user-profile-setting img {
                            width: 35px;
                            height: 35px;
                            object-fit: cover;
                        }
                        .header-sell-btn {
                            margin-left: 12px;
                        }
                        
                        @media (min-width: 992px) {
                            .xpert-mobile-menu {
                                display: flex !important;
                                flex-basis: auto;
                            }
                        }

                        @media (max-width: 991px) {
                            .navbar-brand {
                                padding-left: 10px;
                                margin-right: 0 !important;
                            }
                            .logo-image {
                                width: 120px !important;
                                max-width: 120px !important;
                                height: auto !important;
                            }
                            .mobile-header-actions {
                                flex-shrink: 0;
                            }
                            .mobile-auth-buttons {
                                margin-right: 4px;
                            }
                            .mobile-auth-btn {
                                border: none;
                                border-radius: 10px;
                                height: 34px;
                                padding: 0 12px;
                                font-size: 12px;
                                font-weight: 700;
                                line-height: 1;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .mobile-auth-login {
                                background: #23262F;
                                color: #fff;
                            }
                            .mobile-auth-signup {
                                background: #43ACE9;
                                color: #fff;
                            }
                            .mobile-user-dropdown {
                                display: inline-flex;
                                align-items: center;
                            }
                            .mobile-user-trigger {
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                            }
                            .mobile-user-avatar {
                                width: 28px;
                                height: 28px;
                                object-fit: cover;
                                border: 1px solid #e5e7eb;
                            }
                            .mobile-user-menu {
                                min-width: 220px;
                                margin-top: 10px;
                            }
                            .xpert-mobile-menu {
                                display: none;
                                width: 100%;
                            }
                            .xpert-mobile-menu.show {
                                display: block;
                            }
                            .navbar-collapse {
                                background: white;
                                padding: 1rem;
                                border-radius: 0 0 12px 12px;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                            }
                            .navbar-nav .dropdown > div {
                                display: inline-flex;
                                align-items: center;
                            }
                            .navbar-nav .nav-link,
                            .navbar-nav .btn.nav-link.dropdown-toggle {
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                            }
                        }
            `})]})}function qn(){const[e,s]=u.useState([]),[r,n]=u.useState(!0),[a,o]=u.useState(null),{t:i}=de();return u.useEffect(()=>{X.get("/get-category").then(l=>s(l.data.categories||[])).catch(l=>{console.error(l),o(i("Could not load categories."))}).finally(()=>n(!1))},[]),t.jsx("footer",{className:"footer",children:t.jsxs("div",{className:"container-fluid",children:[t.jsx("div",{id:"qlwapp",className:"qlwapp qlwapp-free qlwapp-button qlwapp-bottom-left qlwapp-all qlwapp-rounded qlwapp-js-ready desktop",children:t.jsx("div",{className:"qlwapp-container",children:t.jsx("a",{className:"qlwapp-toggle","data-action":"open","data-phone":"923022113202","data-message":"",role:"button",tabIndex:"0",target:"_blank",href:"https://wa.me/923022113202",children:t.jsx("span",{className:"fa-brands fa-whatsapp gameon"})})})}),"          ",t.jsxs("div",{className:"row ",children:[t.jsxs("div",{className:"col-xl-4  col-sm-6 footer-child1",children:[t.jsx("div",{className:"logo",children:t.jsx(_,{href:"/",children:t.jsx("img",{src:"/assets/images/footer-logo.png",alt:"XpertBid Footer Logo",width:200,height:60,className:"quality-90"})})}),t.jsx("p",{children:i("First ever UAE based auction platform, providing you a one stop shop, auction marketplace/platform. From real estate, vehicles, bulk goods and much more, XpertBid powers auctions that deliver value, security, and results one auction at a time.")}),"              ",t.jsxs("div",{className:"social-icons my-3",children:[t.jsx("a",{href:"https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq",target:"_blank",rel:"noopener noreferrer",children:t.jsx("i",{className:"fa-brands fa-instagram"})}),t.jsx("a",{href:"https://www.linkedin.com/company/xpertbid/",target:"_blank",rel:"noopener noreferrer",children:t.jsx("i",{className:"fa-brands fa-linkedin"})}),t.jsx("a",{href:"https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr",target:"_blank",rel:"noopener noreferrer",children:t.jsx("i",{className:"fa-brands fa-facebook"})})]})]}),t.jsx("div",{className:"col-xl-4   col-sm-6 footer-child3",children:t.jsxs("div",{className:"footer-menu ps-0 ps-sm-4",children:[t.jsxs("p",{className:"foot-menu-heading my-4",children:[" ",i("Get To Know Us")]}),t.jsxs("ul",{children:[t.jsx("li",{children:t.jsx(_,{href:C("faq"),children:i("FAQ")})}),t.jsx("li",{children:t.jsx(_,{href:C("blogs.index"),children:i("Blogs")})}),t.jsx("li",{children:t.jsx(_,{href:C("about"),children:i("About Us")})}),t.jsx("li",{children:t.jsx(_,{href:C("contact"),children:i("Contact Us")})})]})]})}),t.jsx("div",{className:"col-xl-4   col-sm-6 footer-child3 mt-0 mt-sm-3",children:t.jsx("div",{className:"footer-menu ps-0 ps-sm-4 mt-0 mt-sm-5",children:t.jsxs("ul",{children:[t.jsx("li",{children:t.jsx(_,{href:C("refund.policy"),children:i("Refund Policy")})}),t.jsx("li",{children:t.jsx(_,{href:C("shipping.policy"),children:i("Shipping Policy")})}),t.jsx("li",{children:t.jsx(_,{href:C("seller.policy"),children:i("Seller Policy")})}),t.jsx("li",{children:t.jsx(_,{href:C("privacy.policy"),children:i("Privacy Policy")})}),t.jsx("li",{children:t.jsx(_,{href:C("terms"),children:i("Terms & Conditions")})})]})})}),t.jsx("div",{className:"col-xl-3 col-sm-6 footer-child3 mt-0 mt-sm-5",children:t.jsxs("div",{className:"footer-menu ps-0 ps-sm-4 mt-0 mt-lg-3",children:[r&&t.jsx("div",{className:"d-flex justify-content-center",children:t.jsx(gt,{height:30,width:30,ariaLabel:i("Loading categories")})}),a&&t.jsx("p",{className:"text-danger",children:a})]})})]})]})})}const Un=()=>{const{auth:e}=xe().props,s=e?.user;return s?t.jsx("div",{className:"d-flex flex-column align-items-center",children:s.profile_pic?t.jsx("img",{src:s.profile_pic,alt:"Profile",className:"rounded-circle",style:{width:24,height:24,objectFit:"cover"}}):t.jsx("img",{src:"/assets/images/user-icon.png",alt:"Profile",className:"rounded-circle",width:24,height:24})}):null};function Gn(){const{props:e,url:s}=xe(),{auth:r}=e,n=r?.user,{openLogin:a}=xs(),{t:o}=de(),[i,l]=u.useState(!1),c=u.useRef(null),p=!!n,y=()=>{J.post(C("logout")),l(!1)};u.useEffect(()=>{const x=h=>{c.current&&!c.current.contains(h.target)&&l(!1)};return document.addEventListener("mousedown",x),()=>{document.removeEventListener("mousedown",x)}},[]);const j=()=>{l(x=>!x)},g=x=>s===x||s.startsWith(x+"/"),k=x=>{x.preventDefault(),p?J.visit(C("auctions.create")):a()};return t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"mobile-bottom-nav d-lg-none",children:[t.jsxs(_,{href:"/",className:`mobile-bottom-nav__item ${s==="/"?"mobile-bottom-nav__item--active":""}`,"aria-label":"Home",children:[t.jsx("i",{className:"fa-solid fa-house mobile-bottom-nav__icon"}),t.jsx("span",{className:"mobile-bottom-nav__label",children:o("Home")})]}),p?t.jsxs(_,{href:C("chat.index"),className:`mobile-bottom-nav__item ${g("/chat")?"mobile-bottom-nav__item--active":""}`,"aria-label":"Chat",children:[t.jsx("i",{className:"fa-solid fa-comment-dots mobile-bottom-nav__icon"}),t.jsx("span",{className:"mobile-bottom-nav__label",children:o("Chat")})]}):t.jsxs("button",{type:"button",onClick:a,className:"mobile-bottom-nav__item","aria-label":"Chat",children:[t.jsx("i",{className:"fa-solid fa-comment-dots mobile-bottom-nav__icon"}),t.jsx("span",{className:"mobile-bottom-nav__label",children:o("Chat")})]}),t.jsxs("button",{onClick:k,className:`mobile-bottom-nav__item mobile-bottom-nav__item--action ${g("/auctions/create")?"mobile-bottom-nav__item--active":""}`,"aria-label":"Sell",style:{background:"transparent",border:"none",cursor:"pointer",padding:0},children:[t.jsx("i",{className:"fa-solid fa-plus mobile-bottom-nav__icon"}),t.jsx("span",{className:"mobile-bottom-nav__label",children:o("Sell")})]}),t.jsxs(_,{href:C("auctions.one_rupee"),className:"mobile-bottom-nav__item mobile-bottom-nav__item--highlight","aria-label":"1 Rupee Auctions",children:[t.jsx("i",{className:"fa-solid fa-gavel mobile-bottom-nav__icon"}),t.jsx("span",{className:"mobile-bottom-nav__label",style:{fontSize:"10px",lineHeight:"1.1",textAlign:"center"},children:o("1 Rupee")})]}),p?t.jsxs("div",{className:"mobile-bottom-nav__item mobile-bottom-nav__profile",ref:c,children:[t.jsxs("button",{type:"button",className:"mobile-bottom-nav__profile-btn",onClick:j,"aria-label":"User menu",children:[t.jsx(Un,{}),t.jsx("span",{className:"mobile-bottom-nav__label",children:o("Profile")})]}),i&&t.jsx("div",{className:"mobile-bottom-nav__dropdown shadow",children:t.jsxs("ul",{className:"user-setting-menu list-unstyled m-0 p-0",children:[t.jsx("li",{children:t.jsxs(_,{href:C("dashboard"),onClick:()=>l(!1),children:[t.jsx("i",{className:"fa-solid fa-table-columns text-center",style:{width:"20px",fontSize:"18px"}}),o("Dashboard")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("profile.edit"),onClick:()=>l(!1),children:[t.jsx("img",{src:"/assets/images/profile-setting.svg",alt:"Settings",width:20,height:20}),o("Account Settings")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("chat.index"),onClick:()=>l(!1),children:[t.jsx("i",{className:"fa-solid fa-comment-dots text-center",style:{width:"20px",fontSize:"18px"}}),o("Messages")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("favorites.index"),onClick:()=>l(!1),children:[t.jsx("img",{src:"/assets/images/setting-heart.svg",alt:"Favorites",width:20,height:20}),o("My Favorites")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("auctions.mylistings"),onClick:()=>l(!1),children:[t.jsx("img",{src:"/assets/images/mainListing.svg",alt:"Listings",width:20,height:20}),o("My Listings")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("bids.index"),onClick:()=>l(!1),children:[t.jsx("img",{src:"/assets/images/myBids.svg",alt:"Bids",width:20,height:20}),o("My Bids")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("orders.index"),onClick:()=>l(!1),children:[t.jsx("i",{className:"fa-solid fa-box-open text-center",style:{width:"20px",fontSize:"18px"}}),o("My Orders")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("payment_requests.index"),onClick:()=>l(!1),children:[t.jsx("i",{className:"fa-solid fa-money-check text-center",style:{width:"20px",fontSize:"18px"}}),o("Payment Request")]})}),t.jsx("li",{children:t.jsxs(_,{href:C("verification.identity"),onClick:()=>l(!1),children:[t.jsx("i",{className:"fa-solid fa-id-card text-center",style:{width:"20px",fontSize:"18px"}}),o("Verification")]})}),t.jsx("li",{children:t.jsxs("button",{className:"mobile-bottom-nav__logout-btn",onClick:y,children:[t.jsx("img",{src:"/assets/images/logout.svg",alt:"Logout",width:20,height:20}),o("Log Out")]})})]})})]}):t.jsxs("button",{type:"button",onClick:a,className:"mobile-bottom-nav__item","aria-label":"Login",children:[t.jsx("i",{className:"fa-regular fa-user mobile-bottom-nav__icon"}),t.jsx("span",{className:"mobile-bottom-nav__label",children:o("Profile")})]})]}),t.jsx("style",{dangerouslySetInnerHTML:{__html:`
                body {
                    padding-bottom: 70px;
                }
                @media (min-width: 992px) {
                    body {
                        padding-bottom: 0px;
                    }
                    .mobile-bottom-nav {
                        display: none !important;
                    }
                }

                .mobile-bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #ffffff;
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 8px 10px;
                    z-index: 1050;
                    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
                }

                .mobile-bottom-nav__item {
                    flex: 1;
                    text-align: center;
                    color: #606060;
                    font-family: "Inter", sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    text-decoration: none !important;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    border: none;
                    background: transparent;
                }

                .mobile-bottom-nav__item--active {
                    color: #0d6efd !important;
                }

                .mobile-bottom-nav__icon {
                    font-size: 18px;
                }

                .mobile-bottom-nav__profile {
                    position: relative;
                }

                .mobile-bottom-nav__profile-btn {
                    background: transparent;
                    border: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    color: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                }

                .mobile-bottom-nav__dropdown {
                    position: fixed;
                    left: 12px;
                    right: 12px;
                    bottom: 74px;
                    background: white;
                    border-radius: 18px;
                    overflow-y: auto;
                    padding: 10px 0;
                    border: 1px solid #eee;
                    z-index: 1060;
                    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
                }

                .user-setting-menu li a, .user-setting-menu li button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px 14px 5px;
                    color: #333;
                    text-decoration: none;
                    font-size: 15px;
                    text-align: left;
                    width: 100%;
                    border: none;
                    background: none;
                }

                .user-setting-menu li:not(:last-child) {
                    border-bottom: 1px solid #ededed;
                }

                .mobile-bottom-nav__logout-btn {
                    color: #e94343 !important;
                }

                .mobile-bottom-nav__item--highlight {
                    animation: glow-pulse 1.5s infinite ease-in-out;
                }

                @keyframes glow-pulse {
                    0% { transform: scale(1); color: #0d6efd; }
                    50% { transform: scale(1.1); color: #fd7e14; }
                    100% { transform: scale(1); color: #0d6efd; }
                }
            `}})]})}function Zn({children:e,title:s}){const{flash:r,auth:n,ziggy:a,locale:o}=xe().props,{t:i}=de(),[l,c]=u.useState({show:!1,message:"",type:"success"}),[p,y]=u.useState(!1),j=o?.current||"en",g=o?.supported?.[j]?.direction||(j==="ur"?"rtl":"ltr"),k=Object.entries(o?.supported||{}),x=n?.user?.individual_verification?.status||n?.user?.individualVerification?.status,E=n?.user?.corporate_verification?.status||n?.user?.corporateVerification?.status||x||"unverified",v=a?.location&&a.location.startsWith("http")?new URL(a.location).pathname:a?.location||"",L=!!n?.user&&E!=="verified"&&(n?.user?v!==route("verification.identity",{},!1):!1);ks(!!n?.user);const P=d=>{d!==j&&J.post(route("locale.update"),{locale:d},{preserveScroll:!0})};return u.useEffect(()=>{if(r?.success||r?.error||r?.info){c({show:!0,message:r.success||r.error||r.info,type:r.success?"success":r.error?"error":"info"}),y(!1);const d=setTimeout(()=>{y(!0),setTimeout(()=>c(f=>({...f,show:!1})),500)},5e3);return()=>clearTimeout(d)}},[r]),u.useEffect(()=>{typeof document>"u"||(document.documentElement.lang=j,document.documentElement.dir=g,document.body.classList.toggle("locale-ur",j==="ur"),document.body.classList.toggle("locale-rtl",g==="rtl"))},[j,g]),t.jsx(js,{children:t.jsxs(Bn,{children:[t.jsxs("div",{className:"min-h-screen bg-gray-100",children:[s&&t.jsx(bs,{title:s}),l.show&&t.jsx("div",{className:"toast-container",children:t.jsxs("div",{className:`premium-toast ${p?"hiding":""}`,style:{borderLeftColor:l.type==="error"?"#FF4D4D":"#43ACE9"},children:[t.jsx("div",{className:"premium-toast-icon",style:{backgroundColor:l.type==="error"?"#FF4D4D":"#43ACE9"},children:l.type==="error"?t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),t.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]}):l.type==="info"?t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("line",{x1:"12",y1:"10",x2:"12",y2:"17"}),t.jsx("line",{x1:"12",y1:"7",x2:"12.01",y2:"7"})]}):t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("polyline",{points:"20 6 9 17 4 12"})})}),t.jsxs("div",{className:"premium-toast-content",children:[t.jsx("div",{style:{fontWeight:"600",fontSize:"15px",color:"#fff"},children:l.type==="error"?i("Error"):l.type==="info"?i("Notice"):i("Success")}),t.jsx("div",{style:{fontSize:"13px",opacity:.8,color:"#fff"},children:l.message})]})]})}),t.jsxs("section",{className:"xp-brand-top-banner","aria-label":"XpertBid brand banner",children:[t.jsxs("div",{className:"xp-brand-links",children:[t.jsx(_,{className:"xp-brand-link",href:"/marketplace/real-estate-property-auction?type=auction","aria-label":"View property marketplace",children:t.jsx("img",{className:"xp-brand-logo xp-brand-logo-prop",src:"/assets/images/xp-prop-logo-clean.png",alt:"XpertBid Property"})}),t.jsx(_,{className:"xp-brand-link",href:"/marketplace/vehicles?type=auction","aria-label":"View vehicle marketplace",children:t.jsx("img",{className:"xp-brand-logo xp-brand-logo-vehicle",src:"/assets/images/xp-vehicle-logo-clean.png",alt:"XpertBid Vehicle"})})]}),t.jsxs("div",{className:"xp-brand-controls d-none d-lg-flex",children:[t.jsx("select",{className:"xp-brand-language-select",value:j,onChange:d=>P(d.target.value),"aria-label":i("Select Language"),children:k.map(([d,f])=>t.jsx("option",{value:d,children:f.native||f.name||d.toUpperCase()},d))}),t.jsx(Ns,{})]})]}),t.jsx(Wn,{}),t.jsx("main",{children:e}),L&&t.jsxs("button",{type:"button",className:"global-verify-account-btn",onClick:()=>window.location.href=route("verification.identity"),children:[t.jsx("i",{className:"fa-solid fa-user-check"}),t.jsx("span",{children:i("Verify Account")})]}),t.jsx(qn,{}),t.jsx(Gn,{})]}),t.jsx("style",{children:`
                                   /* Premium Toast Notification */
                                   .toast-container {
                                          position: fixed;
                                          top: 20px;
                                          right: 20px;
                                          z-index: 9999;
                                          display: flex;
                                          flex-direction: column;
                                          gap: 10px;
                                   }
                                   .premium-toast {
                                          background: #23262F;
                                          color: #fff;
                                          padding: 16px 24px;
                                          border-radius: 12px;
                                          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                                          display: flex;
                                          align-items: center;
                                          gap: 12px;
                                          min-width: 300px;
                                          animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                                          border-left: 4px solid #43ACE9;
                                   }
                                   .premium-toast.hiding {
                                          animation: slideOutRight 0.5s ease forwards;
                                   }
                                   .premium-toast-icon {
                                          background: #43ACE9;
                                          width: 24px;
                                          height: 24px;
                                          border-radius: 50%;
                                          display: flex;
                                          align-items: center;
                                          justify-content: center;
                                          flex-shrink: 0;
                                   }
                                   .xp-brand-top-banner {
                                          width: 100%;
                                          background: #ffffff;
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          gap: 16px;
                                          overflow: hidden;
                                          padding: 8px 48px;
                                   }
                                   .xp-brand-links {
                                          display: inline-flex;
                                          align-items: center;
                                          gap: 10px;
                                          min-width: 0;
                                   }
                                   .xp-brand-controls {
                                          align-items: center;
                                          gap: 10px;
                                          flex: 0 0 auto;
                                   }
                                   .xp-brand-language-select {
                                          height: 38px;
                                          border: 1px solid #D8E0EA;
                                          border-radius: 10px;
                                          padding: 0 12px;
                                          background: #F8FBFF;
                                          color: #23262F;
                                          font-size: 14px;
                                          font-weight: 600;
                                          outline: none;
                                   }
                                   .xp-brand-logo {
                                          height: auto;
                                          object-fit: contain;
                                          display: block;
                                          flex: 0 1 auto;
                                   }
                                   .xp-brand-link {
                                          display: inline-flex;
                                          align-items: center;
                                          line-height: 0;
                                          text-decoration: none;
                                          transition: opacity 0.2s ease;
                                   }
                                   .xp-brand-link:hover {
                                          opacity: 0.82;
                                   }
                                   .xp-brand-logo-prop {
                                          width: 180px;
                                          max-height: 54px;
                                   }
                                   .xp-brand-logo-vehicle {
                                          width: 180px;
                                          max-height: 46px;
                                   }
                                   .xp-brand-logo-mandi {
                                          width: 180px;
                                          max-height: 46px;
                                   }
                                   @keyframes slideInRight {
                                          from { transform: translateX(120%); opacity: 0; }
                                          to { transform: translateX(0); opacity: 1; }
                                   }
                                   @keyframes slideOutRight {
                                          from { transform: translateX(0); opacity: 1; }
                                          to { transform: translateX(120%); opacity: 0; }
                                   }
                                   .global-verify-account-btn {
                                          position: fixed;
                                          left: 18px;
                                          bottom: 24px;
                                          z-index: 999;
                                          display: inline-flex;
                                          align-items: center;
                                          gap: 10px;
                                          border: none;
                                          border-radius: 12px;
                                          background: #ffffff;
                                          color: #23262F;
                                          padding: 12px 18px;
                                          font-size: 14px;
                                          font-weight: 700;
                                          box-shadow: 0 10px 30px rgba(0,0,0,0.14);
                                          transition: transform 0.2s ease, box-shadow 0.2s ease;
                                   }
                                   .global-verify-account-btn i {
                                          color: #ff5a67;
                                          font-size: 16px;
                                   }
                                   .global-verify-account-btn:hover {
                                          transform: translateY(-1px);
                                          box-shadow: 0 14px 32px rgba(0,0,0,0.18);
                                   }
                                   @media (max-width: 768px) {
                                          .xp-brand-top-banner {
                                                 justify-content: center;
                                                 gap: 8px;
                                                 padding: 8px 10px;
                                          }
                                          .xp-brand-links {
                                                 justify-content: center;
                                                 gap: 6px;
                                                 width: 100%;
                                          }
                                          .xp-brand-logo-prop {
                                                 width: min(32vw, 170px);
                                                 max-height: 42px;
                                          }
                                          .xp-brand-logo-vehicle {
                                                 width: min(32vw, 170px);
                                                 max-height: 36px;
                                          }
                                          .xp-brand-logo-mandi {
                                                 width: min(32vw, 170px);
                                                 max-height: 36px;
                                          }
                                          .global-verify-account-btn {
                                                 left: 12px;
                                                 bottom: 86px;
                                                 padding: 10px 14px;
                                                 font-size: 13px;
                                          }
                                   }
                            `})]})})}export{Zn as A,gt as O,Bn as a};
