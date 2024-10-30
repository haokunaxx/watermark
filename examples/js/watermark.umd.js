(function(i,f){typeof exports=="object"&&typeof module<"u"?module.exports=f():typeof define=="function"&&define.amd?define(f):(i=typeof globalThis<"u"?globalThis:i||self,i.Watermark=f())})(this,function(){"use strict";var U=Object.defineProperty;var P=(i,f,m)=>f in i?U(i,f,{enumerable:!0,configurable:!0,writable:!0,value:m}):i[f]=m;var w=(i,f,m)=>P(i,typeof f!="symbol"?f+"":f,m);const i={zIndex:999999,rotate:-20,gap:[24,24],offset:[0,0],textAlign:"center",fontStyle:{fontSize:"16px",color:"rgba(0, 0, 0, 0.15)",fontFamily:"sans-serif",fontWeight:"normal"}};function f(c){return c==null}function m(c,e){if(!c)return e;if(Object.prototype.toString.call(c)==="[object Number]")return c;const t=parseFloat(c);return isNaN(t)?e:t}function M(c){const{image:e,gap:t,rotate:n}=c,h=document.createElement("canvas"),a=h.getContext("2d"),l=({width:g,height:s})=>{const r=window.devicePixelRatio,o=t[0]+g,u=t[1]+s;h.setAttribute("width",`${o*r}px`),h.setAttribute("height",`${u*r}px`),h.style.width=`${o}px`,h.style.height=`${u}px`,a.translate(o*r/2,u*r/2),a.scale(r,r);const p=Math.PI*n/180;a.rotate(p)},d=(g,s,r)=>{let o=0,u=0;const p=[];for(const k of s){const{width:v,fontBoundingBoxAscent:E,fontBoundingBoxDescent:$}=g.measureText(k),x=E+$;o+=x,u<v&&(u=v),p.push({width:v,height:x})}return{contentSizeInfoList:p,contentWidth:u,contentHeight:o,width:Math.ceil(Math.abs(Math.sin(r)*o)+Math.abs(Math.cos(r)*u)),height:Math.ceil(Math.abs(Math.sin(r)*u)+Math.abs(Math.cos(r)*o))}},b=()=>{const{content:g,rotate:s,fontStyle:r,textAlign:o}=c,{fontFamily:u,fontSize:p,fontWeight:k,color:v}=r,E=parseInt(p)||16,$=Math.PI*s/180;a.font=`${k} ${E}px ${u}`;const x=d(a,g,$),W=c.width||x.width,I=c.height||x.height;return l({width:W,height:I}),a.fillStyle=v,a.font=`${k} ${E}px ${u}`,a.textBaseline="top",g.forEach((B,z)=>{const S=x.contentSizeInfoList[z],A=o==="center"?-S.width/2:12,N=-(c.height||x.contentHeight)/2+S.height*z;a.fillText(B,A,N,c.width||x.contentWidth)}),Promise.resolve({watermarkBase64Url:h.toDataURL(),width:W,height:I})};return e?new Promise(g=>{const s=new Image;s.crossOrigin="anonymous",s.referrerPolicy="no-referrer",s.onload=()=>{let{width:r,height:o}=c;return!r&&!o?(r=s.width,o=s.height):(!r||!o)&&(r?o=s.height/s.width*+r:r=s.width/s.height*+o),l({width:r,height:o}),a.drawImage(s,-r/2,-o/2,r,o),g({watermarkBase64Url:h.toDataURL(),width:r,height:o})},s.onerror=()=>b(),s.src=e}):b()}class C{constructor(e){w(this,"mutationObserver",null);w(this,"options");w(this,"watermarkEl",null);w(this,"draw",async e=>{e&&(this.options=this.mergeOptions(e));const t=this.options;if(!t)return;const n=t.getContainer();if(!n)return;const{watermarkBase64Url:h,width:a,height:l}=await M(t);this.removeWatermarkEl(),this.appendWatermarkEl(n,this.buildWatermarkEl(h,a,l,t)),this.observe()});w(this,"destroy",()=>{var e;(e=this.mutationObserver)==null||e.disconnect(),this.removeWatermarkEl(),this.mutationObserver=null});w(this,"appendWatermarkEl",(e,t)=>{this.watermarkEl=t,e.append(t)});w(this,"removeWatermarkEl",()=>{var n,h;(n=this.mutationObserver)==null||n.disconnect();const e=this.watermarkEl,t=(h=this.options)==null?void 0:h.getContainer();e&&(t&&t.contains(e)?t.removeChild(e):e.remove())});w(this,"observe",()=>{var t;if(!this.mutationObserver){if(!this.watermarkEl)return;this.mutationObserver=new MutationObserver(n=>{n.some(a=>{let l=!1;return a.removedNodes.length&&(l=Array.from(a.removedNodes).some(d=>d===this.watermarkEl)),a.attributeName==="style"&&a.target===this.watermarkEl&&(l=!0),l})&&(this.removeWatermarkEl(),this.draw())})}const e=(t=this.options)==null?void 0:t.getContainer();!this.mutationObserver||!e||this.mutationObserver.observe(e,{subtree:!0,attributes:!0,childList:!0})});w(this,"mergeOptions",e=>{var h,a,l,d,b,y,g,s,r,o;const t=e||{},n={...t,getContainer:t.getContainer,rotate:t.rotate||i.rotate,width:m(t.width,void 0),height:m(t.height,void 0),textAlign:t.textAlign||"center",gap:[m((h=t==null?void 0:t.gap)==null?void 0:h[0],(a=i==null?void 0:i.gap)==null?void 0:a[0]),m((l=t==null?void 0:t.gap)==null?void 0:l[1],(d=i==null?void 0:i.gap)==null?void 0:d[1])],fontStyle:{...i.fontStyle,...t.fontStyle||{}},zIndex:t.zIndex||i.zIndex};return n.offset=[m((b=n==null?void 0:n.offset)==null?void 0:b[0],(y=i==null?void 0:i.offset)==null?void 0:y[0]),m(f((g=n==null?void 0:n.offset)==null?void 0:g[1])?(s=n==null?void 0:n.offset)==null?void 0:s[0]:(r=n==null?void 0:n.offset)==null?void 0:r[1],(o=i==null?void 0:i.offset)==null?void 0:o[1])],n});this.options=this.mergeOptions(e)}buildWatermarkEl(e,t,n,h){const{zIndex:a,gap:l,offset:d}=h,b=document.createElement("div");return b.setAttribute("style",`position: absolute;z-index: ${a};left: ${d[0]||0}px;top: ${d[1]||0}px;width: calc(100% - ${d[0]||0}px);height: calc(100% - ${d[1]||0}px);background-position: 0 0;background-repeat: repeat;background-size: ${l[0]+t}px ${l[1]+n}px;background-image: url(${e});pointer-events: none;`),b}}return C});