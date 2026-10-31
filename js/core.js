'use strict';
// きほん：がめんの おおきさ・べんりな かんすう・にゅうりょく
// =====================================================================
//  やきたて！まるパン だいぼうけん
// =====================================================================
const W=960,H=540,TS=32,ROWS=17;
const FONT='"Hiragino Maru Gothic ProN","BIZ UDPGothic","Yu Gothic UI","Meiryo",sans-serif';
const cv=document.getElementById('game'),ctx=cv.getContext('2d');
let SK=1;
function resize(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const s=Math.min(innerWidth/W,innerHeight/H);
  cv.style.width=W*s+'px';cv.style.height=H*s+'px';
  cv.width=Math.round(W*s*dpr);cv.height=Math.round(H*s*dpr);
  SK=cv.width/W;
}
addEventListener('resize',resize);resize();

// ---------- utils ----------
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rand=(a,b)=>a+Math.random()*(b-a);
const lerp=(a,b,t)=>a+(b-a)*t;
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295;}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function circleRect(cx,cy,r,b){const nx=clamp(cx,b.x,b.x+b.w),ny=clamp(cy,b.y,b.y+b.h);const dx=cx-nx,dy=cy-ny;return dx*dx+dy*dy<r*r;}
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function ell(c,x,y,rx,ry,fill,stroke,lw,rot){c.beginPath();c.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot||0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineWidth=lw||2;c.strokeStyle=stroke;c.stroke();}}
function txt(s,x,y,size,fill='#fff',stroke='#5a2a0c',align='center',lw){
  ctx.font=`bold ${size}px ${FONT}`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.lineJoin='round';
  if(stroke){ctx.lineWidth=lw||Math.max(3,size/5);ctx.strokeStyle=stroke;ctx.strokeText(s,x,y);}
  ctx.fillStyle=fill;ctx.fillText(s,x,y);
}
// あわ（プレイヤー・ボス・シャボンで つかう）
//   lw:ふちの ふとさ  warn:あかく てんめつ  plain:にじいろの ふち なしの こい あわ（シャボン）
function drawBubble(c,x,y,rx,ry,o={}){
  const lw=o.lw||2,g=c.createRadialGradient(x-rx*0.3,y-ry*0.35,lw,x,y,Math.max(rx,ry));
  if(o.plain){g.addColorStop(0,'rgba(255,255,255,0.6)');g.addColorStop(0.6,'rgba(170,230,255,0.25)');g.addColorStop(1,'rgba(210,245,255,0.65)');}
  else{g.addColorStop(0,'rgba(255,255,255,0.22)');g.addColorStop(0.7,'rgba(170,225,255,0.1)');g.addColorStop(1,'rgba(205,240,255,0.45)');}
  ell(c,x,y,rx,ry,g,o.warn&&Math.floor(G.t/8)%2===0?'rgba(255,150,150,0.9)':'rgba(255,255,255,0.85)',lw);
  if(!o.plain){
    const k=lw*2-1;c.lineWidth=lw;
    c.strokeStyle='rgba(255,170,235,0.5)';c.beginPath();c.ellipse(x,y,rx-k,ry-k,0,0.25,1.3);c.stroke();
    c.strokeStyle='rgba(140,255,215,0.45)';c.beginPath();c.ellipse(x,y,rx-k,ry-k,0,3.5,4.4);c.stroke();
    ell(c,x+rx*0.52,y+ry*0.39,lw*1.3,lw*1.3,'rgba(255,255,255,0.6)');
  }
  ell(c,x-rx*0.44,y-ry*0.46,rx*0.21,ry*0.11,'rgba(255,255,255,0.9)',null,0,-0.7);
}
function seeded(n,seed){let s=seed;const r=()=>(s=(s*16807)%2147483647)/2147483647;return[...Array(n)].map(()=>[r(),r(),r()]);}
const CRUMB_PTS=seeded(36,11);

// ---------- input ----------
const K={},P={},PK={};
const MENUK={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Enter:'ok',KeyZ:'ok',Space:'ok',KeyX:'ok'};
const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',KeyZ:'jump',
  KeyX:'act',KeyJ:'act',ArrowDown:'down',KeyS:'down',KeyC:'spit',KeyK:'spit',Enter:'start',KeyP:'pause',Escape:'pause',KeyM:'mute'};
function press(a){if(!K[a])P[a]=true;K[a]=true;}
function release(a){K[a]=false;}
addEventListener('keydown',e=>{const a=KEYMAP[e.code];if(!a)return;e.preventDefault();audioInit();if(!e.repeat){press(a);if(MENUK[e.code])PK[MENUK[e.code]]=true;}});
addEventListener('keyup',e=>{const a=KEYMAP[e.code];if(a)release(a);});
function autoPause(){for(const k in K)K[k]=false;if(G.state==='play'&&!G.paused&&!player.dead){G.paused=true;G.psel=0;}}
addEventListener('blur',autoPause);
document.addEventListener('visibilitychange',()=>{if(document.hidden)autoPause();});
const touchEl=document.getElementById('touch');
if(('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches)touchEl.classList.add('on');
touchEl.querySelectorAll('.tb').forEach(b=>{
  const a=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();audioInit();press(a);if(a==='jump')P.start=true;try{b.setPointerCapture(e.pointerId);}catch(_){}});
  const up=e=>{e.preventDefault();release(a);};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);
});
cv.addEventListener('pointerdown',e=>{audioInit();P.start=true;const r=cv.getBoundingClientRect();G.click={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};});
