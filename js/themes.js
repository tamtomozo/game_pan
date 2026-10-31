'use strict';
// はいけい・タイル・くらやみ
// ---------- 背景 ----------
function drawBG(theme,cx){
  const c=ctx;let g;
  if(theme===0){
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
  }else if(theme===1){
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
  }else if(theme===3){
    g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#6fd6f0');g.addColorStop(0.4,'#2a9ccc');g.addColorStop(1,'#0e4a86');c.fillStyle=g;c.fillRect(0,0,W,H);
    // みなものゆらゆら
    c.fillStyle='rgba(255,255,255,0.16)';
    for(let x=0;x<W;x+=8){const yy=6+Math.sin(x*0.03+G.t*0.05)*4+Math.sin(x*0.011-G.t*0.03)*3;c.fillRect(x,0,8,yy);}
    // ひかりのすじ
    c.save();c.globalCompositeOperation='lighter';
    const oR=cx*0.05;
    for(let i=-1;i<7;i++){
      const x=i*170-(oR%170)+Math.sin(G.t*0.01+i)*20,a=0.05+0.035*Math.sin(G.t*0.02+i*1.7);
      const rg=c.createLinearGradient(0,0,0,420);rg.addColorStop(0,'rgba(220,250,255,'+a+')');rg.addColorStop(1,'rgba(220,250,255,0)');
      c.fillStyle=rg;c.beginPath();c.moveTo(x,0);c.lineTo(x+50,0);c.lineTo(x+150,420);c.lineTo(x+40,420);c.closePath();c.fill();
    }
    c.restore();
    // とおくの いわ
    const o1=cx*0.15;c.fillStyle='rgba(20,80,130,0.55)';c.beginPath();c.moveTo(0,H);
    for(let x=0;x<=W;x+=16)c.lineTo(x,350+Math.sin((x+o1)*0.006)*40+Math.sin((x+o1)*0.017)*16);c.lineTo(W,H);c.fill();
    // かいそう・さんご
    const o2=cx*0.35;
    for(let i=Math.floor(o2/140)-1;i<=Math.floor((o2+W)/140)+1;i++){
      const x=i*140-o2+40+hash(i,3)*60,hh=90+hash(i,5)*110;
      if(hash(i,9)>0.55){
        c.fillStyle='rgba(235,110,150,0.4)';
        for(const[dx,dy,r]of[[0,-30,16],[-16,-50,11],[14,-56,12],[0,-72,9]])ell(c,x+50+dx,H+dy-hh*0.2,r,r);
      }
      c.strokeStyle='rgba(20,110,110,0.6)';c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(x,H);
      for(let k=1;k<=8;k++)c.lineTo(x+Math.sin(G.t*0.03+k*0.7+i)*k*1.6,H-k*hh/8);
      c.stroke();
    }
    // のぼる あわ
    c.strokeStyle='rgba(230,250,255,0.5)';c.lineWidth=1.5;
    for(let i=0;i<26;i++){
      const x=((i*157-cx*0.3+Math.sin(G.t*0.02+i)*14)%W+W)%W,y=H-((G.t*(0.4+(i%4)*0.2)+i*71)%(H+30));
      c.beginPath();c.arc(x,y,2+(i%3)*1.5,0,7);c.stroke();
    }
    const bg=c.createLinearGradient(0,H-160,0,H);bg.addColorStop(0,'rgba(5,30,70,0)');bg.addColorStop(1,'rgba(5,30,70,0.35)');c.fillStyle=bg;c.fillRect(0,H-160,W,160);
  }else if(theme===4){
    g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0c2850');g.addColorStop(0.45,'#061632');g.addColorStop(1,'#020a18');c.fillStyle=g;c.fillRect(0,0,W,H);
    const tg=c.createLinearGradient(0,0,0,160);tg.addColorStop(0,'rgba(80,140,200,0.18)');tg.addColorStop(1,'rgba(80,140,200,0)');c.fillStyle=tg;c.fillRect(0,0,W,160);
    const o1=cx*0.15;c.fillStyle='rgba(8,24,52,0.9)';c.beginPath();c.moveTo(0,H);
    for(let x=0;x<=W;x+=16)c.lineTo(x,330+Math.sin((x+o1)*0.007)*50+Math.sin((x+o1)*0.019)*18);c.lineTo(W,H);c.fill();
    for(let i=0;i<30;i++){
      const x=((i*211-cx*0.25)%W+W)%W,y=80+((i*97)%380),a=0.2+0.25*Math.sin(G.t*0.05+i*1.3);
      c.fillStyle=(i%2?'rgba(120,255,230,':'rgba(200,160,255,')+Math.max(0,a)+')';c.beginPath();c.arc(x,y,1.5+(i%3)*0.7,0,7);c.fill();
    }
    c.fillStyle='rgba(220,235,255,0.3)';
    for(let i=0;i<50;i++){const x=((i*131-cx*0.4+Math.sin(G.t*0.01+i)*20)%W+W)%W,y=((G.t*(0.2+(i%4)*0.08)+i*53)%(H+20))-10;c.fillRect(x,y,2,2);}
  }else{
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
  }
}

// ---------- タイル ----------
function drawTiles(){
  const th=G.theme,c=ctx;
  const c0=Math.max(0,Math.floor(cam.x/TS)-1),c1=Math.min(lv.w-1,Math.floor((cam.x+W)/TS)+1);
  for(let ty=0;ty<ROWS;ty++)for(let tx=c0;tx<=c1;tx++){
    const t=lv.t[ty][tx];if(t==='.')continue;
    const x=tx*TS,y=ty*TS;
    if(t==='#')drawGround(x,y,tx,ty,th);
    else if(t==='='){
      if(tx===c0||tileAt(tx-1,ty)!=='='){
        let s=tx;while(tileAt(s-1,ty)==='=')s--;let e=tx;while(tileAt(e+1,ty)==='=')e++;
        const bx=s*TS+1,bw=(e-s+1)*TS-2;
        const g=c.createLinearGradient(0,y,0,y+16);g.addColorStop(0,'#c27028');g.addColorStop(0.5,'#e8a050');g.addColorStop(1,'#f6cf8a');
        rr(c,bx,y+1,bw,16,8);c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle='#7a3e12';c.stroke();
        c.strokeStyle='#fbe2b0';c.lineWidth=2.5;c.lineCap='round';
        for(let k=bx+14;k<bx+bw-10;k+=24){c.beginPath();c.moveTo(k-4,y+11);c.quadraticCurveTo(k,y+4,k+6,y+4);c.stroke();}
      }
    }else if(t==='B'){
      rr(c,x+1,y+1,TS-2,TS-2,5);c.fillStyle='#efcf92';c.fill();c.lineWidth=2;c.strokeStyle='#b07e40';c.stroke();
      c.fillStyle='#fff3d0';c.fillRect(x+5,y+4,TS-10,3);
      c.fillStyle='#c79a5a';for(const[dx,dy]of[[10,12],[22,12],[10,23],[22,23],[16,17.5]]){c.beginPath();c.arc(x+dx,y+dy,1.8,0,7);c.fill();}
    }else if(t==='~'){
      const top=tileAt(tx,ty-1)!=='~';
      const g=c.createLinearGradient(0,y,0,y+TS);g.addColorStop(0,'#fff6e2');g.addColorStop(1,'#f2d8a8');
      c.fillStyle=g;
      if(top){
        const wb=(lv.wob[tx]||0),dip=Math.sin(G.t*0.5)*wb*7+wb*5;
        c.beginPath();c.moveTo(x,y+TS);c.lineTo(x,y+6);c.quadraticCurveTo(x+TS/2,y-4+dip,x+TS,y+6);c.lineTo(x+TS,y+TS);c.closePath();c.fill();
        c.strokeStyle='#d8b078';c.lineWidth=2;c.beginPath();c.moveTo(x,y+6);c.quadraticCurveTo(x+TS/2,y-4+dip,x+TS,y+6);c.stroke();
        ell(c,x+10,y+6+dip*0.5,4,1.6,'rgba(255,255,255,.7)');
      }else{c.fillRect(x,y,TS,TS);}
    }else if(t==='>'||t==='<'||t==='^'){
      c.fillStyle='rgba(190,240,255,0.1)';c.fillRect(x,y,TS,TS);
      c.strokeStyle='rgba(235,250,255,0.5)';c.lineWidth=2;c.lineCap='round';
      for(let k=0;k<2;k++){
        const o=(G.t*2.4+hash(tx,ty)*TS+k*16)%TS;c.beginPath();
        if(t==='^'){const xx=x+7+k*17;c.moveTo(xx,y+TS-o);c.lineTo(xx,y+TS-o-9);}
        else{const dd=t==='>'?1:-1,xx=dd>0?x+o:x+TS-o,yy=y+9+k*14;c.moveTo(xx,yy);c.lineTo(xx-dd*9,yy);}
        c.stroke();
      }
    }else if(t==='Q'){
      const bx=x+16,base=y+TS,col=['#ff7a9a','#ffa04a','#c88aff'][(hash(tx,ty)*3)|0],sw=Math.sin(G.t*0.03+tx)*1.5;
      c.strokeStyle=col;c.lineWidth=5;c.lineCap='round';c.lineJoin='round';c.beginPath();
      c.moveTo(bx,base);c.lineTo(bx+sw*0.5,base-30);c.moveTo(bx,base-12);c.lineTo(bx-10,base-24);c.lineTo(bx-12+sw,base-38);
      c.moveTo(bx,base-18);c.lineTo(bx+10,base-30);c.lineTo(bx+9+sw,base-44);c.stroke();
      for(const[px,py]of[[bx+sw*0.5,base-31],[bx-12+sw,base-39],[bx+9+sw,base-45]])ell(c,px,py,3.6,3.6,'rgba(255,255,255,0.55)');
    }else if(t==='Y'){
      const bx=x+16,base=y+TS;c.lineWidth=6;c.lineCap='round';
      for(const[dx,hh,col,ph]of[[-6,58,'#2f9a5a',0],[3,74,'#45b86a',1.3],[9,48,'#2a8a50',2.4]]){
        c.strokeStyle=col;c.beginPath();c.moveTo(bx+dx,base);
        for(let k=1;k<=6;k++)c.lineTo(bx+dx+Math.sin(G.t*0.04+k*0.8+ph+tx)*k*1.3,base-k*hh/6);
        c.stroke();
      }
    }else if(t==='L'){
      const wt=th>=3;
      c.fillStyle=wt?'#1c2a44':'#2a1a14';c.fillRect(x,y,TS,TS);c.fillStyle=wt?'#4a6a92':'#6a5a50';c.fillRect(x+6,y,5,TS);c.fillRect(x+20,y,5,TS);
      c.fillStyle=wt?'#78ffe6':'#ff8a3a';c.fillRect(x,y+TS-3,TS,1);
    }
  }
}
function drawGround(x,y,tx,ty,th){
  const c=ctx,ab=tileAt(tx,ty-1),top=!(ab==='#'||ab==='L'),h=hash(tx,ty),h2=hash(tx+7,ty+3);
  if(th===0){
    c.fillStyle='#a8662e';c.fillRect(x,y,TS,TS);
    c.fillStyle='#93562a';c.fillRect(x,y+6+((h*18)|0),TS,2);if(tx%4===0)c.fillRect(x,y,2,TS);
    if(h2>0.8){ell(c,x+8+h*16,y+20,3,2,'#8a4e24');}
    if(top){c.fillStyle='#d99a55';c.fillRect(x,y,TS,10);c.fillStyle='#f2c483';c.fillRect(x,y,TS,3);c.fillStyle='#7a4420';c.fillRect(x,y+10,TS,2);}
  }else if(th===1){
    c.fillStyle='#8b5a2b';c.fillRect(x,y,TS,TS);
    ell(c,x+4+h*24,y+8+h2*18,3,2,'#a87444');if(h>0.5)ell(c,x+28-h2*20,y+22,2,1.5,'#704420');
    if(top){
      c.fillStyle='#5aa838';c.fillRect(x,y,TS,11);c.fillStyle='#7cc84a';c.fillRect(x,y,TS,8);
      for(let k=0;k<4;k++){c.beginPath();c.arc(x+4+k*8,y+1,4.2,Math.PI,0);c.fill();}
      if(h>0.86){c.fillStyle='#4a9a2a';c.fillRect(x+15,y-8,2,8);ell(c,x+16,y-10,4,4,h2>0.5?'#fff':'#ffa8d8');ell(c,x+16,y-10,1.6,1.6,'#ffd34a');}
    }
  }else if(th===3){
    c.fillStyle='#d6b071';c.fillRect(x,y,TS,TS);
    if(h>0.3)ell(c,x+4+h*24,y+10+h2*16,1.8,1.2,'#b88a4c');if(h2>0.6)ell(c,x+28-h*20,y+24,1.5,1.2,'#ecd29a');
    if(ty<ROWS-1&&!isSolid(tileAt(tx,ty+1))){c.fillStyle='rgba(70,50,30,0.28)';c.fillRect(x,y+TS-5,TS,5);}
    if(top){
      c.fillStyle='#ecd59a';c.fillRect(x,y,TS,10);c.fillStyle='#fff0c0';c.fillRect(x,y,TS,3);c.fillStyle='#bf9656';c.fillRect(x,y+10,TS,2);
      if(h>0.88){
        c.save();c.translate(x+16,y+2);c.beginPath();c.arc(0,0,6,Math.PI,0);c.closePath();c.fillStyle='#ffb8c0';c.fill();c.strokeStyle='#d06a7a';c.lineWidth=1;c.stroke();
        for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(0,0);c.lineTo(k*4,-5);c.stroke();}c.restore();
      }else if(h2>0.9){
        c.save();c.translate(x+10,y+2);c.fillStyle='#ff9a4a';c.beginPath();
        for(let k=0;k<10;k++){const r=k%2?2:5.5,a=k*Math.PI/5-Math.PI/2;k?c.lineTo(Math.cos(a)*r,Math.sin(a)*r*0.6):c.moveTo(Math.cos(a)*r,Math.sin(a)*r*0.6);}
        c.closePath();c.fill();c.restore();
      }
    }
  }else if(th===4){
    c.fillStyle='#1c2a44';c.fillRect(x,y,TS,TS);
    c.fillStyle='#152036';c.fillRect(x,y+8+((h*16)|0),TS,2);if(h2>0.5)c.fillRect(x+((h*24)|0),y,2,TS);
    if(h>0.78)ell(c,x+6+h2*20,y+10+h*14,1.7,1.7,'rgba(120,255,230,'+(0.4+0.3*Math.sin(G.t*0.06+tx))+')');
    if(ty<ROWS-1&&!isSolid(tileAt(tx,ty+1))){c.fillStyle='rgba(0,0,10,0.35)';c.fillRect(x,y+TS-5,TS,5);}
    if(top){c.fillStyle='#2e4466';c.fillRect(x,y,TS,8);c.fillStyle='#4a6a92';c.fillRect(x,y,TS,2);
      if(h>0.86){for(let k=-1;k<=1;k++){c.strokeStyle='rgba(180,140,255,0.8)';c.lineWidth=2;c.beginPath();c.moveTo(x+16,y);c.lineTo(x+16+k*4+Math.sin(G.t*0.05+k)*1.5,y-7);c.stroke();}}}
  }else{
    c.fillStyle='#4a2420';c.fillRect(x,y,TS,TS);
    c.fillStyle='#2e1412';c.fillRect(x,y+15,TS,2);const off=(ty%2)*16;c.fillRect(x+off,y,2,15);c.fillRect(x+((off+16)%32),y+17,2,15);
    if(top){c.fillStyle='rgba(255,120,40,.22)';c.fillRect(x,y-5,TS,5);c.fillStyle='#6a3024';c.fillRect(x,y,TS,8);c.fillStyle='#ff8a3a';c.fillRect(x,y,TS,2);}
  }
}

// しんかい：プレイヤーの まわり だけ みえる。ひかる ものは くらやみでも ひかる
function drawDarkness(ox,oy){
  const c=ctx,p=player,sx=x=>x-Math.round(cam.x)+ox,sy=y=>y-cam.y+oy;
  const px=sx(p.x+p.w/2),py=sy(p.y+p.h/2),R=210+Math.sin(G.t*0.05)*6;
  const g=c.createRadialGradient(px,py,40,px,py,R);
  const k=lv.darkK; // ボスせんでは すこし あかるくなる
  g.addColorStop(0,'rgba(2,8,24,0)');g.addColorStop(0.55,'rgba(2,8,24,'+(0.5*k)+')');g.addColorStop(1,'rgba(2,8,24,'+(0.92*k)+')');
  c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalCompositeOperation='lighter';
  const glow=(x,y,r,col)=>{const X=sx(x),Y=sy(y);if(X<-r||X>W+r)return;const gg=c.createRadialGradient(X,Y,0,X,Y,r);gg.addColorStop(0,col);gg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gg;c.fillRect(X-r,Y-r,r*2,r*2);};
  for(const e of enemies){
    const gl=!e.dead&&ENEMY[e.type].glow;
    if(gl){const q=gl(e);glow(q.x,q.y,q.r,q.col);}
  }
  for(const it of items){
    if(it.type==='air')glow(it.x+it.w/2,it.y+it.h/2,32,'rgba(160,230,255,0.4)');
    else if(it.type==='grain')glow(it.x+it.w/2,it.y+it.h/2,16,'rgba(255,220,100,0.3)');
    else glow(it.x+it.w/2,it.y+it.h/2,30,'rgba(255,200,220,0.35)');
  }
  for(const v of lv.vents)glow(v.x,v.y-8,36,'rgba(255,170,200,0.35)');
  for(const q of projs)if(q.type==='fire')glow(q.x,q.y,q.r*2.5,'rgba(255,150,60,0.35)');else if(q.type==='sbub')glow(q.x,q.y,32,'rgba(255,140,60,0.35)');
  if(boss&&boss.state!=='gone')glow(boss.x+boss.w/2,boss.y+boss.h/2,150,'rgba(150,210,255,0.22)');
  for(const k of checks)glow(k.x,k.y-60,50,'rgba(255,220,140,0.3)');
  if(goal)glow(goal.x,goal.y-60,100,'rgba(255,230,160,0.4)');
  c.restore();
}
