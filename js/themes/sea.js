'use strict';
// テーマ：うみの せかい（defineTheme の かきかたは js/themes.js を みてね）
// あかるい うみ（2-1・2-2）
defineTheme('sea',{
  lock:['#1c2a44','#4a6a92','#78ffe6'],
  bg(c,cx){
    let g;
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
  },
  ground(c,x,y,tx,ty,top,h,h2){
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
  },
});

// まっくらな しんかい（2-3）
defineTheme('deep',{
  lock:['#1c2a44','#4a6a92','#78ffe6'],
  bg(c,cx){
    let g;
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
  },
  ground(c,x,y,tx,ty,top,h,h2){
    c.fillStyle='#1c2a44';c.fillRect(x,y,TS,TS);
    c.fillStyle='#152036';c.fillRect(x,y+8+((h*16)|0),TS,2);if(h2>0.5)c.fillRect(x+((h*24)|0),y,2,TS);
    if(h>0.78)ell(c,x+6+h2*20,y+10+h*14,1.7,1.7,'rgba(120,255,230,'+(0.4+0.3*Math.sin(G.t*0.06+tx))+')');
    if(ty<ROWS-1&&!isSolid(tileAt(tx,ty+1))){c.fillStyle='rgba(0,0,10,0.35)';c.fillRect(x,y+TS-5,TS,5);}
    if(top){c.fillStyle='#2e4466';c.fillRect(x,y,TS,8);c.fillStyle='#4a6a92';c.fillRect(x,y,TS,2);
      if(h>0.86){for(let k=-1;k<=1;k++){c.strokeStyle='rgba(180,140,255,0.8)';c.lineWidth=2;c.beginPath();c.moveTo(x+16,y);c.lineTo(x+16+k*4+Math.sin(G.t*0.05+k)*1.5,y-7);c.stroke();}}}
  },
});
