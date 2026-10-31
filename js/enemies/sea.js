'use strict';
// てき：うみの せかい（defineEnemy の かきかたは js/enemies.js を みてね）
function lanternLure(e){return{x:e.x+e.w/2+e.dir*22*e.sqx,y:e.y+e.h-34*e.sqy};}

defineEnemy('fish',{char:'n',w:28,h:20,hp:1,colors:['#5ab0e8','#ffd36a','#fff'],
  update:flyPatrol(14,1.4),
  draw(c,e,d,t){
    c.save();c.translate(-d*12,-10);c.rotate(Math.sin(t*0.3)*0.35*d);
    c.beginPath();c.moveTo(0,0);c.lineTo(-d*10,-8);c.lineTo(-d*10,8);c.closePath();c.fillStyle='#3a88c8';c.fill();c.strokeStyle='#1a4a7a';c.lineWidth=1.5;c.stroke();c.restore();
    ell(c,-d*1,-18.5,5,2.6,'#3a88c8','#1a4a7a',1.2);
    const g=c.createLinearGradient(0,-20,0,0);g.addColorStop(0,'#6ac4f4');g.addColorStop(1,'#e2f6ff');
    ell(c,0,-10,14,9.5,g,'#1a4a7a',1.8);
    c.strokeStyle='rgba(255,205,80,0.95)';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(-d*8,-13);c.quadraticCurveTo(0,-10,d*6,-13);c.stroke();
    ell(c,d*7,-12,2.9,2.9,'#fff','#1a4a7a',1);ell(c,d*7.7,-12,1.5,1.9,'#14202a');
    ell(c,d*4,-6.5,2.2,1.3,'rgba(255,120,140,0.5)');
    c.strokeStyle='#1a4a7a';c.lineWidth=1.2;c.beginPath();c.arc(d*11.5,-8,1.6,0,Math.PI);c.stroke();
  }});

defineEnemy('jelly',{char:'j',w:26,h:26,hp:1,colors:['#ffb0e0','#fff','#d080ff'],
  update(e,p){ // ふわーっと のぼって ゆっくり おりてくる
    e.y=e.baseY-(1-Math.cos(e.t*0.025))*55;e.x=e.homeX+Math.sin(e.t*0.013)*24;
    const px=p.x+p.w/2;e.dir=px<e.x+e.w/2?-1:1;
  },
  glow:e=>({x:e.x+e.w/2,y:e.y+e.h*0.4,r:48,col:'rgba(255,120,220,0.4)'}),
  draw(c,e,d,t){
    const pu=Math.sin(t*0.1);c.scale(1+pu*0.06,1-pu*0.06);
    c.strokeStyle='rgba(255,150,215,0.85)';c.lineWidth=2;c.lineCap='round';
    for(let i=0;i<4;i++){const lx=-8+i*5.3;c.beginPath();c.moveTo(lx,-10);for(let k=1;k<=4;k++)c.lineTo(lx+Math.sin(t*0.12+k+i)*2.2,-10+k*3.2);c.stroke();}
    const g=c.createRadialGradient(-3,-20,2,0,-14,15);g.addColorStop(0,'rgba(255,242,250,0.95)');g.addColorStop(1,'rgba(240,140,210,0.88)');
    c.beginPath();c.moveTo(-13,-10);c.bezierCurveTo(-14,-31,14,-31,13,-10);
    c.quadraticCurveTo(9.5,-7,6.5,-10);c.quadraticCurveTo(3.2,-7,0,-10);c.quadraticCurveTo(-3.2,-7,-6.5,-10);c.quadraticCurveTo(-9.5,-7,-13,-10);c.closePath();
    c.fillStyle=g;c.fill();c.strokeStyle='#b0509a';c.lineWidth=1.8;c.stroke();
    ell(c,-5,-21,3.5,2,'rgba(255,255,255,0.75)',null,0,-0.5);
    eyes(c,d*1.5,-16,4,0.8);
  }});

defineEnemy('uni',{char:'u',w:28,h:26,hp:3,noInhale:true,noStomp:true,colors:['#4a2a5a','#8a5aa0','#2a1030'],speed:0.35,
  draw(c,e,d,t){
    const pu=1+Math.sin(t*0.12)*0.08;
    c.strokeStyle='#2a1030';c.lineWidth=2.4;c.lineCap='round';
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2+t*0.01;c.beginPath();c.moveTo(Math.cos(a)*9,-12+Math.sin(a)*9);c.lineTo(Math.cos(a)*17*pu,-12+Math.sin(a)*17*pu);c.stroke();}
    const g=c.createRadialGradient(-4,-17,2,0,-12,12);g.addColorStop(0,'#9a6ab8');g.addColorStop(1,'#3a1a4a');
    ell(c,0,-12,11.5,11,g,'#1a0820',2);
    ell(c,-4,-17,3,1.8,'rgba(255,255,255,0.35)',null,0,-0.5);
    eyes(c,d*2,-11,3.8,0.8,true);
  }});

defineEnemy('crab',{char:'k',w:30,h:20,hp:1,colors:['#e8603e','#ff9a6a','#7a1a10'],speed:1,
  think(e){if((e.t%200)<45){e.vx=0;return true;}return false;}, // ハサミを ふりあげて ひとやすみ
  draw(c,e,d,t){
    const claw=e.vx===0&&e.onGround?Math.abs(Math.sin(t*0.15))*0.6:0;
    c.strokeStyle='#a8301e';c.lineWidth=2.2;c.lineCap='round';
    for(const k of[-1,1])for(let i=0;i<3;i++){const lx=k*(6+i*3.5),ph=Math.sin(t*0.4+i*1.3+k)*2;c.beginPath();c.moveTo(lx,-6);c.lineTo(lx+k*5,-2+ph*0.4);c.lineTo(lx+k*6,0);c.stroke();}
    for(const k of[-1,1]){
      c.save();c.translate(k*12,-10);c.rotate(k*(-0.4-claw));
      c.strokeStyle='#c8442e';c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.lineTo(k*4,-6);c.stroke();
      ell(c,k*5,-10,5,4,'#e8603e','#7a1a10',1.5);c.strokeStyle='#7a1a10';c.lineWidth=1.5;c.beginPath();c.moveTo(k*5,-10);c.lineTo(k*9.5,-12);c.stroke();
      c.restore();
    }
    const g=c.createLinearGradient(0,-18,0,-3);g.addColorStop(0,'#ff8a5a');g.addColorStop(1,'#c8442e');
    ell(c,0,-9,13,8,g,'#7a1a10',2);
    for(const k of[-1,1]){c.strokeStyle='#7a1a10';c.lineWidth=1.6;c.beginPath();c.moveTo(k*4,-15);c.lineTo(k*5,-21);c.stroke();ell(c,k*5,-22,2.8,2.8,'#fff','#7a1a10',1);ell(c,k*5+d*0.8,-22,1.3,1.6,'#14100a');}
    c.strokeStyle='#7a1a10';c.lineWidth=1.3;c.beginPath();c.arc(0,-8.5,3,0.15*Math.PI,0.85*Math.PI);c.stroke();
    ell(c,-5,-13,3,1.5,'rgba(255,255,255,0.4)',null,0,-0.4);
  }});

defineEnemy('fugu',{char:'g',w:26,h:22,hp:1,colors:['#f2d27a','#fff0b0','#a8782a'],
  spiky:e=>e.pf>0.5, // ふくらむと トゲトゲ（ふめない・すいこめない）
  update(e,p){ // ちかづくと ぷくーっと ふくらむ
    const near=!p.dead&&Math.hypot(p.x+p.w/2-(e.x+e.w/2),p.y+p.h/2-(e.y+e.h/2))<120;
    if(near&&e.pf<0.1)sfx('puff');
    e.pf+=((near?1:0)-e.pf)*(near?0.15:0.03);
    e.y=e.baseY+Math.sin(e.t*0.04)*10;
    if(e.pf<0.3){e.x+=e.dir*0.7;if((e.x>e.homeX+100&&e.dir>0)||(e.x<e.homeX-100&&e.dir<0))e.dir*=-1;}
  },
  draw(c,e,d,t){
    const pf=e.pf,R=11*(1+0.55*pf);
    c.translate(0,-11);
    c.save();c.translate(-d*(R-1),0);c.rotate(Math.sin(t*0.3)*0.3);c.beginPath();c.moveTo(0,0);c.lineTo(-d*7,-5);c.lineTo(-d*7,5);c.closePath();c.fillStyle='#d8a848';c.fill();c.strokeStyle='#8a6a20';c.lineWidth=1.2;c.stroke();c.restore();
    if(pf>0.15){c.strokeStyle='#8a6a20';c.lineWidth=1.8;c.lineCap='round';for(let i=0;i<14;i++){const a=i/14*Math.PI*2;c.beginPath();c.moveTo(Math.cos(a)*R*0.9,Math.sin(a)*R*0.9);c.lineTo(Math.cos(a)*(R+6*pf),Math.sin(a)*(R+6*pf));c.stroke();}}
    const g=c.createRadialGradient(-R*0.3,-R*0.4,1,0,0,R);g.addColorStop(0,'#fff4c0');g.addColorStop(1,'#e2b04a');
    ell(c,0,0,R,R*0.92,g,'#8a6a20',1.8);
    ell(c,0,R*0.42,R*0.7,R*0.38,'rgba(255,255,240,0.85)');
    for(const[a,b]of[[-0.4,-0.5],[0.1,-0.7],[-0.1,-0.2],[-0.6,0]])ell(c,a*R,b*R,1.6,1.6,'#b8882a');
    ell(c,-d*2,2,3,4.5,'#d8a848',null,0,d*0.5);
    eyes(c,d*R*0.35,-R*0.22,3.6,0.8,pf>0.5);
    if(pf>0.5)ell(c,d*(R-2.5),R*0.18,1.9,1.9,'#6a3a10');
    else{c.strokeStyle='#6a3a10';c.lineWidth=1.2;c.beginPath();c.arc(d*(R-3.5),R*0.12,1.8,0,Math.PI);c.stroke();}
  }});

defineEnemy('lantern',{char:'l',w:36,h:28,hp:3,noInhale:true,colors:['#4a4a6a','#ffe060','#2a2a44'],
  update(e,p){ // ちかくに くると おいかけてくる
    const dx=p.x+p.w/2-(e.x+e.w/2),dy=p.y+p.h/2-(e.y+e.h/2),d=Math.hypot(dx,dy)||1;
    let tvx,tvy;
    if(d<280&&!p.dead){tvx=dx/d*1.1;tvy=dy/d*0.8;}
    else{tvx=(e.homeX-e.x)*0.01+Math.sin(e.t*0.02)*0.4;tvy=(e.baseY-e.y)*0.01;}
    e.vx+=(tvx-e.vx)*0.04;e.vy+=(tvy-e.vy)*0.04;
    moveBody(e);if(e.y<6){e.y=6;e.vy=Math.max(0,e.vy);}
    if(Math.abs(e.vx)>0.15)e.dir=e.vx>0?1:-1;
  },
  glow:e=>{const L=lanternLure(e);return{x:L.x,y:L.y,r:70,col:'rgba(255,235,130,0.6)'};},
  draw(c,e,d,t){
    c.strokeStyle='#3a3a58';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(d*4,-26);c.quadraticCurveTo(d*14,-44,d*22,-36);c.stroke();
    const lg=c.createRadialGradient(d*22,-34,0,d*22,-34,10);lg.addColorStop(0,'#fffbe0');lg.addColorStop(0.5,'#ffe060');lg.addColorStop(1,'rgba(255,220,80,0)');
    c.fillStyle=lg;c.beginPath();c.arc(d*22,-34,10,0,7);c.fill();
    const tw=Math.sin(t*0.2)*3;
    c.beginPath();c.moveTo(-d*15,-14);c.lineTo(-d*26,-23+tw);c.lineTo(-d*26,-5+tw);c.closePath();c.fillStyle='#3a3a58';c.fill();c.strokeStyle='#14142a';c.lineWidth=1.6;c.stroke();
    const g=c.createRadialGradient(-4,-20,2,0,-14,18);g.addColorStop(0,'#62628a');g.addColorStop(1,'#26263e');
    ell(c,0,-14,18,14,g,'#14142a',2);
    c.fillStyle='#1a0a14';c.beginPath();c.ellipse(d*10,-8,7,5,0,0,7);c.fill();
    c.fillStyle='#f4f0e0';for(let i=0;i<4;i++){const tx=d*(5+i*3);c.beginPath();c.moveTo(tx-1.4,-12);c.lineTo(tx+1.4,-12);c.lineTo(tx,-8.5);c.closePath();c.fill();}
    ell(c,d*6,-20,3.6,3.6,'#fff','#14142a',1);ell(c,d*6.8,-20,1.8,2.2,'#14100a');
    c.strokeStyle='#14142a';c.lineWidth=1.8;c.beginPath();c.moveTo(d*2,-26);c.lineTo(d*9,-23.5);c.stroke();
    ell(c,-d*3,-6,4,6,'#3a3a58',null,0,d*0.6);
    ell(c,-7,-22,4,2,'rgba(255,255,255,0.25)',null,0,-0.4);
  }});
