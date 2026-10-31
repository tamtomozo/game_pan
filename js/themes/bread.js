'use strict';
// テーマ：パンの くに（defineTheme の かきかたは js/themes.js を みてね）
// パン工房（1-1）
defineTheme('kitchen',{
  lock:['#2a1a14','#6a5a50','#ff8a3a'],
  bg(c,cx){
    let g;
    g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fff3dc');g.addColorStop(1,'#f2c993');c.fillStyle=g;c.fillRect(0,0,W,H);
    const o0=(cx*0.1)%60;c.fillStyle='rgba(230,170,110,0.13)';for(let x=-o0-60;x<W+60;x+=60)c.fillRect(x,0,26,H);
    const o1=cx*0.2;
    for(let i=Math.floor(o1/520)-1;i<=Math.floor((o1+W)/520)+1;i++){
      const x=i*520-o1+140;
      c.fillStyle='rgba(255,240,180,0.2)';c.beginPath();c.moveTo(x,220);c.lineTo(x+180,220);c.lineTo(x+280,470);c.lineTo(x+60,470);c.fill();
      c.fillStyle='#a8662e';rr(c,x-9,61,198,168,10);c.fill();
      const sg=c.createLinearGradient(0,70,0,220);sg.addColorStop(0,'#a8dcff');sg.addColorStop(1,'#fff4cf');c.fillStyle=sg;c.fillRect(x,70,180,150);
      ell(c,x+132,108,20,20,'rgba(255,225,130,0.95)');
      ell(c,x+48,160,24,9,'rgba(255,255,255,.9)');ell(c,x+66,154,16,11,'rgba(255,255,255,.9)');
      c.fillStyle='#a8662e';c.fillRect(x+87,70,6,150);c.fillRect(x,142,180,6);
      c.fillStyle='#f6a0a0';c.beginPath();c.moveTo(x-12,58);c.quadraticCurveTo(x+10,140,x-12,232);c.lineTo(x-24,232);c.lineTo(x-24,58);c.fill();
      c.beginPath();c.moveTo(x+192,58);c.quadraticCurveTo(x+170,140,x+192,232);c.lineTo(x+204,232);c.lineTo(x+204,58);c.fill();
    }
    const o2=cx*0.4;
    for(let i=Math.floor(o2/400)-1;i<=Math.floor((o2+W)/400)+1;i++){
      const x=i*400-o2+40;
      const cols=['#e0a050','#c8783a','#ecc070','#b86a30'];
      for(let j=0;j<4;j++){c.save();c.translate(x+32+j*58,330);c.scale(1.2-(j%2)*0.2,1);bunPath(c,22,26);c.globalAlpha=0.6;c.fillStyle=cols[(i+j+40)%4];c.fill();c.restore();}
      c.fillStyle='#c48448';c.fillRect(x,330,250,10);c.fillStyle='#9a6432';c.fillRect(x,340,250,4);c.fillRect(x+16,344,6,18);c.fillRect(x+228,344,6,18);
    }
  },
  ground(c,x,y,tx,ty,top,h,h2){
    c.fillStyle='#a8662e';c.fillRect(x,y,TS,TS);
    c.fillStyle='#93562a';c.fillRect(x,y+6+((h*18)|0),TS,2);if(tx%4===0)c.fillRect(x,y,2,TS);
    if(h2>0.8){ell(c,x+8+h*16,y+20,3,2,'#8a4e24');}
    if(top){c.fillStyle='#d99a55';c.fillRect(x,y,TS,10);c.fillStyle='#f2c483';c.fillRect(x,y,TS,3);c.fillStyle='#7a4420';c.fillRect(x,y+10,TS,2);}
  },
});

// こむぎばたけ（1-2・タイトル・エンディング）
defineTheme('field',{
  lock:['#2a1a14','#6a5a50','#ff8a3a'],
  bg(c,cx){
    let g;
    g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#86ccff');g.addColorStop(0.7,'#fff1c8');c.fillStyle=g;c.fillRect(0,0,W,H);
    const sg=c.createRadialGradient(820,90,10,820,90,110);sg.addColorStop(0,'rgba(255,250,200,1)');sg.addColorStop(0.35,'rgba(255,240,150,0.6)');sg.addColorStop(1,'rgba(255,240,150,0)');
    c.fillStyle=sg;c.fillRect(700,0,260,220);ell(c,820,90,34,34,'#fff6c0');
    const oc=cx*0.08+G.t*0.15,span=W+300;
    for(let i=0;i<5;i++){const x=(((i*330-oc)%span)+span)%span-150,y=60+(i%3)*42;for(const[dx,dy,r]of[[0,0,26],[24,-10,22],[46,0,24],[22,8,22]])ell(c,x+dx,y+dy,r,r*0.8,'rgba(255,255,255,0.92)');}
    const o1=cx*0.2;
    c.fillStyle='#bfe28c';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,320+Math.sin((x+o1)*0.005)*30+Math.sin((x+o1)*0.011)*14);c.lineTo(W,H);c.fill();
    for(let i=Math.floor(o1/900)-1;i<=Math.floor((o1+W)/900)+1;i++){
      const x=i*900-o1+300,y=300+Math.sin((x+o1)*0.005)*30+Math.sin((x+o1)*0.011)*14;
      c.fillStyle='#fff8ec';c.beginPath();c.moveTo(x-14,y+10);c.lineTo(x-8,y-70);c.lineTo(x+8,y-70);c.lineTo(x+14,y+10);c.fill();
      ell(c,x,y-72,10,8,'#d8604a');
      c.save();c.translate(x,y-70);c.rotate(G.t*0.02);c.fillStyle='rgba(250,240,220,0.95)';for(let k=0;k<4;k++){c.rotate(Math.PI/2);c.fillRect(-4,-52,8,48);}c.restore();
      ell(c,x,y-70,4,4,'#6a4a2a');
    }
    const o2=cx*0.45;
    c.fillStyle='#f0c050';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=12)c.lineTo(x,395+Math.sin((x+o2)*0.007)*22);c.lineTo(W,H);c.fill();
    c.strokeStyle='#d89a30';c.lineWidth=2;
    for(let x=-((o2)%14);x<W;x+=14){const yy=395+Math.sin((x+o2)*0.007)*22;c.beginPath();c.moveTo(x,yy+8);c.lineTo(x+Math.sin(G.t*0.03+x)*2,yy-12);c.stroke();ell(c,x+Math.sin(G.t*0.03+x)*2,yy-14,2.4,5,'#e8a838');}
  },
  ground(c,x,y,tx,ty,top,h,h2){
    c.fillStyle='#8b5a2b';c.fillRect(x,y,TS,TS);
    ell(c,x+4+h*24,y+8+h2*18,3,2,'#a87444');if(h>0.5)ell(c,x+28-h2*20,y+22,2,1.5,'#704420');
    if(top){
      c.fillStyle='#5aa838';c.fillRect(x,y,TS,11);c.fillStyle='#7cc84a';c.fillRect(x,y,TS,8);
      for(let k=0;k<4;k++){c.beginPath();c.arc(x+4+k*8,y+1,4.2,Math.PI,0);c.fill();}
      if(h>0.86){c.fillStyle='#4a9a2a';c.fillRect(x+15,y-8,2,8);ell(c,x+16,y-10,4,4,h2>0.5?'#fff':'#ffa8d8');ell(c,x+16,y-10,1.6,1.6,'#ffd34a');}
    }
  },
});

// こげこげオーブン城（1-3）
defineTheme('oven',{
  lock:['#2a1a14','#6a5a50','#ff8a3a'],
  bg(c,cx){
    let g;
    g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a0806');g.addColorStop(0.6,'#4a170d');g.addColorStop(1,'#7a2a12');c.fillStyle=g;c.fillRect(0,0,W,H);
    const o0=cx*0.15;c.strokeStyle='rgba(255,120,60,0.07)';c.lineWidth=2;
    for(let y=0;y<H;y+=28){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();const off=((y/28)%2)*40;for(let x=-((o0+off)%80);x<W;x+=80){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+28);c.stroke();}}
    const o1=cx*0.25;
    for(let i=Math.floor(o1/320)-1;i<=Math.floor((o1+W)/320)+1;i++){
      const x=i*320-o1+80;
      const ag=c.createLinearGradient(0,150,0,340);ag.addColorStop(0,'rgba(255,150,60,0.55)');ag.addColorStop(1,'rgba(255,80,30,0.15)');
      c.fillStyle=ag;c.beginPath();c.moveTo(x,340);c.lineTo(x,200);c.arc(x+45,200,45,Math.PI,0);c.lineTo(x+90,340);c.fill();
      c.strokeStyle='rgba(30,10,5,0.8)';c.lineWidth=4;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x+k*22.5,160);c.lineTo(x+k*22.5,340);c.stroke();}
    }
    const o2=cx*0.4;c.fillStyle='#240c08';
    for(let i=Math.floor(o2/360)-1;i<=Math.floor((o2+W)/360)+1;i++){const x=i*360-o2+250;c.fillRect(x,0,44,H);c.fillStyle='#3a160e';c.fillRect(x+4,0,6,H);c.fillStyle='#240c08';}
    for(let i=0;i<40;i++){
      const x=((i*137-cx*0.5+Math.sin(G.t*0.01+i)*20)%W+W)%W,y=H-((G.t*(0.5+(i%5)*0.15)+i*53)%(H+40));
      c.fillStyle=`rgba(255,${120+(i%4)*30},40,${0.4+(i%3)*0.2})`;c.beginPath();c.arc(x,y,1.5+(i%3),0,7);c.fill();
    }
    const bg=c.createLinearGradient(0,H-180,0,H);bg.addColorStop(0,'rgba(255,90,30,0)');bg.addColorStop(1,'rgba(255,90,30,0.35)');c.fillStyle=bg;c.fillRect(0,H-180,W,180);
  },
  ground(c,x,y,tx,ty,top,h,h2){
    c.fillStyle='#4a2420';c.fillRect(x,y,TS,TS);
    c.fillStyle='#2e1412';c.fillRect(x,y+15,TS,2);const off=(ty%2)*16;c.fillRect(x+off,y,2,15);c.fillRect(x+((off+16)%32),y+17,2,15);
    if(top){c.fillStyle='rgba(255,120,40,.22)';c.fillRect(x,y-5,TS,5);c.fillStyle='#6a3024';c.fillRect(x,y,TS,8);c.fillStyle='#ff8a3a';c.fillRect(x,y,TS,2);}
  },
});
