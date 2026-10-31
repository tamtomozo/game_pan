'use strict';
// パンの えがきかた（プレイヤー・HUD・タイトルで つかう）
// =====================================================================
//  描画：パン
// =====================================================================
function bunPath(c,rx,h){
  c.beginPath();
  c.moveTo(-rx*0.78,0);
  c.quadraticCurveTo(-rx*1.04,0,-rx,-h*0.32);
  c.bezierCurveTo(-rx,-h*1.23,rx,-h*1.23,rx,-h*0.32);
  c.quadraticCurveTo(rx*1.04,0,rx*0.78,0);
  c.closePath();
}
function domeY(x,rx,h){const k=x/rx;return -h*(1-k*k*0.62);}
function drawFace(c,rx,h,o){
  const fd=o.face||1,fx=fd*rx*(o.mouth==='big'?0.24:0.16),ey=-h*0.52,ex=rx*0.3,dark='#3b200c';
  c.fillStyle=dark;c.strokeStyle=dark;c.lineWidth=1.8;c.lineCap='round';
  if(o.dead){
    for(const k of[-1,1]){const x=fx+k*ex;c.beginPath();c.moveTo(x-2.6,ey-2.6);c.lineTo(x+2.6,ey+2.6);c.moveTo(x+2.6,ey-2.6);c.lineTo(x-2.6,ey+2.6);c.stroke();}
  }else if(o.hurt){
    for(const k of[-1,1]){const x=fx+k*ex;c.beginPath();c.moveTo(x-k*2.8,ey-2.8);c.lineTo(x+k*1.6,ey);c.lineTo(x-k*2.8,ey+2.8);c.stroke();}
  }else if(o.blink||o.happy){
    for(const k of[-1,1]){c.beginPath();if(o.happy)c.arc(fx+k*ex,ey+1.5,2.8,Math.PI*1.1,Math.PI*1.9);else c.arc(fx+k*ex,ey-1,2.8,Math.PI*0.15,Math.PI*0.85);c.stroke();}
  }else{
    for(const k of[-1,1]){c.beginPath();c.ellipse(fx+k*ex,ey,2.5,3.5,0,0,7);c.fill();}
    c.fillStyle='#fff';for(const k of[-1,1]){c.beginPath();c.arc(fx+k*ex-0.8,ey-1.3,0.95,0,7);c.fill();}
  }
  c.fillStyle='rgba(255,105,105,0.5)';
  for(const k of[-1,1]){c.beginPath();c.ellipse(fx+k*ex*1.7,ey+h*0.19,3.8,2.3,0,0,7);c.fill();}
  const my=ey+h*0.25;
  if(o.mouth==='big'){
    c.fillStyle='#6a1a10';c.beginPath();c.ellipse(fx+fd*2,my+1,6.5,7.5,0,0,7);c.fill();
    c.fillStyle='#ff8a8a';c.beginPath();c.ellipse(fx+fd*2,my+5,4,2.5,0,0,7);c.fill();
  }else if(o.mouth==='open'){
    c.fillStyle='#6a1a10';c.beginPath();c.ellipse(fx,my,3.6,3.8,0,0,7);c.fill();
  }else{
    c.strokeStyle=dark;c.lineWidth=1.5;c.beginPath();
    c.arc(fx-2,my-0.8,2,0.1*Math.PI,0.95*Math.PI);c.moveTo(fx+4,my-0.8);c.arc(fx+2,my-0.8,2,0.05*Math.PI,0.9*Math.PI);c.stroke();
  }
}
function drawBread(c,form,o={}){
  const B=BREAD[form],rx=B.rx,h=B.h;
  if(form==='wiener'){
    const sg=c.createLinearGradient(0,-h*0.62,0,-h*0.22);sg.addColorStop(0,'#e8664c');sg.addColorStop(1,'#9a2e1e');
    rr(c,-rx-9,-h*0.6,rx*2+18,h*0.4,h*0.2);c.fillStyle=sg;c.fill();c.lineWidth=2;c.strokeStyle='#5a1a10';c.stroke();
    c.fillStyle='rgba(255,255,255,0.35)';rr(c,-rx-5,-h*0.56,8,3,1.5);c.fill();rr(c,rx-2,-h*0.56,8,3,1.5);c.fill();
  }
  bunPath(c,rx,h);
  const g=c.createLinearGradient(0,-h,0,0);g.addColorStop(0,B.top);g.addColorStop(0.55,B.mid);g.addColorStop(1,B.bot);
  c.fillStyle=g;c.fill();
  c.save();c.clip();
  if(form==='curry'){
    for(const[a,b,s]of CRUMB_PTS){c.fillStyle=s<0.5?'rgba(255,225,160,0.85)':'rgba(110,50,12,0.55)';c.beginPath();c.arc((a*2-1)*rx,-b*h*1.05,1.2+s*1.5,0,7);c.fill();}
  }else if(form==='melon'){
    c.strokeStyle='rgba(176,132,40,0.55)';c.lineWidth=1.4;c.beginPath();
    for(let d=-50;d<=50;d+=9){c.moveTo(d-18,-h-3);c.lineTo(d+18,3);c.moveTo(d+18,-h-3);c.lineTo(d-18,3);}
    c.stroke();
    c.fillStyle='rgba(255,255,255,0.9)';for(let i=0;i<16;i++){const[a,b]=CRUMB_PTS[i];c.fillRect((a*2-1)*rx,-b*h,1.4,1.4);}
  }else if(form==='anko'){
    c.fillStyle='rgba(60,20,5,0.35)';c.beginPath();c.ellipse(0,-h*0.93,4.5,2.4,0,0,7);c.fill();
  }
  c.fillStyle='rgba(255,255,255,0.36)';c.beginPath();c.ellipse(-rx*0.42,-h*0.76,rx*0.28,h*0.13,-0.5,0,7);c.fill();
  if(form==='anko'){c.fillStyle='rgba(255,255,255,0.22)';c.beginPath();c.ellipse(rx*0.35,-h*0.7,rx*0.12,h*0.08,0.5,0,7);c.fill();}
  if(o.burnt){c.fillStyle='rgba(40,18,8,0.65)';c.fillRect(-rx*2,-h*2,rx*4,h*2.2);}
  if(o.soggy){
    c.fillStyle='rgba(228,242,255,0.6)';c.fillRect(-rx*2,-h*2,rx*4,h*2.2);
    c.fillStyle='rgba(150,200,240,0.45)';for(let i=0;i<12;i++){const[a,b,s]=CRUMB_PTS[i];c.beginPath();c.arc((a*2-1)*rx,-b*h,1.5+s*2.5,0,7);c.fill();}
  }
  c.restore();
  bunPath(c,rx,h);c.lineWidth=2.2;c.strokeStyle=B.line;c.lineJoin='round';c.stroke();
  if(form==='anko'){
    c.fillStyle='#fffbe8';for(const[sx,sy,r]of[[-3,-h+1.5,0.3],[0,-h+0.5,-0.2],[3,-h+1.8,0.5],[-1.5,-h+3.5,0.1],[1.8,-h+3.6,-0.4]]){c.beginPath();c.ellipse(sx,sy,1.5,0.9,r,0,7);c.fill();}
  }
  if(form==='wiener'){
    c.lineCap='round';c.lineJoin='round';
    const zig=(col,lw,off)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();for(let i=0;i<=8;i++){const x=-rx*0.62+i*rx*0.155;const y=domeY(x,rx,h)+3+(i%2?3.2:-0.8)+off;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();};
    zig('#d8261c',3.2,0);zig('#ffd23a',1.5,2.2);
  }
  if(form==='curry'&&o.fire){c.fillStyle='rgba(255,140,40,0.5)';}
  drawFace(c,rx,h,o);
}
// ---------- 具材アイコン ----------
function drawIngredient(c,ab,x,y,s=1){
  c.save();c.translate(x,y);c.scale(s,s);
  if(ab==='curry'){ell(c,0,0,10,8,'#c8701e','#5a2a0c',1.5);ell(c,-3,-1,3,2,'#ff8c2a');ell(c,3,2,3,2.4,'#f5dc8c');ell(c,-3,-4,3,1.4,'rgba(255,255,255,.5)');}
  else if(ab==='anko'){ell(c,0,0,9,8,'#5a2030','#2a0a10',1.5);c.strokeStyle='#fff';c.lineWidth=1.6;c.beginPath();c.moveTo(-3,-5);c.quadraticCurveTo(0,-7,3,-5);c.stroke();}
  else if(ab==='melon'){ell(c,0,0,9,9,'#8fd06a','#3e7e2e',1.5);c.strokeStyle='rgba(230,250,200,.8)';c.lineWidth=1;c.beginPath();c.ellipse(0,0,4,9,0,0,7);c.ellipse(0,0,9,4,0,0,7);c.stroke();}
  else if(ab==='wiener'){rr(c,-11,-5,22,10,5);c.fillStyle='#c8442e';c.fill();c.strokeStyle='#5a1a10';c.lineWidth=1.5;c.stroke();c.fillStyle='rgba(255,255,255,.4)';rr(c,-7,-3,10,2,1);c.fill();}
  c.restore();
}
