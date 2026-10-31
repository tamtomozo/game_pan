'use strict';
// てき：パンの くに（defineEnemy の かきかたは js/enemies.js を みてね）
defineEnemy('curry',{char:'c',w:28,h:22,hp:1,ability:'curry',colors:['#d98a3a','#ff8c2a','#f5dc8c'],speed:0.5,
  think(e){if((e.t%240)<50){e.vx=0;if(e.t%240===38)windup(e,'go',12);return true;}return false;}, // ときどき たちどまる
  draw(c,e,d,t){
    const sq=1+Math.sin(t*0.15)*0.07;c.scale(1/sq,sq);
    const g=c.createLinearGradient(0,-22,0,0);g.addColorStop(0,'#e48e36');g.addColorStop(1,'#a8501a');
    c.beginPath();c.moveTo(-15,0);c.bezierCurveTo(-17,-12,-11,-21,-4,-20);c.bezierCurveTo(0,-25,8,-23,9,-18);c.bezierCurveTo(15,-16,17,-6,15,0);c.closePath();
    c.fillStyle=g;c.fill();c.strokeStyle='#5a2a0c';c.lineWidth=2;c.stroke();
    c.fillStyle='#ff8c2a';rr(c,-12,-9,7,5,2);c.fill();c.fillStyle='#f5dc8c';rr(c,6,-7,7,6,2);c.fill();
    ell(c,-1,-4,1.8,1.8,'#7a3a12');ell(c,-6,-16,4,2,'rgba(255,255,255,.4)',null,0,-0.3);
    eyes(c,d*3,-13,4.5);
    c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2;c.lineCap='round';
    for(const k of[-4,5]){c.beginPath();for(let i=0;i<=6;i++){const yy=-25-i*2.4,xx=k+Math.sin(i*0.9+t*0.12+k)*2.2;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}
  }});

defineEnemy('anko',{char:'a',w:24,h:24,hp:1,ability:'anko',colors:['#5a2030','#8a4040','#fff'],speed:1.3,
  onWalk(e){if(e.onGround&&e.t%170===0&&groundAhead(e,40))windup(e,'dash',20);},
  afterMove(e){e.rot+=e.vx*0.09;},
  draw(c,e,d,t){
    const g=c.createRadialGradient(-4,-17,2,0,-12,13);g.addColorStop(0,'#9a5050');g.addColorStop(1,'#4a1824');
    ell(c,0,-12,12.5,12,g,'#2a0a10',2);
    c.save();c.translate(0,-12);c.rotate(e.rot);c.strokeStyle='#fff';c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(-4,-8.5);c.quadraticCurveTo(0,-10.5,4,-8.5);c.stroke();c.restore();
    ell(c,-5,-18,3.5,2,'rgba(255,255,255,.35)',null,0,-0.5);
    eyes(c,d*2.5,-11,4.2);
  }});

defineEnemy('melon',{char:'m',w:24,h:24,hp:1,ability:'melon',colors:['#9ad46e','#e4f7c8','#5e9e3e'],noEdgeTurn:true,stretchInAir:true,
  think(e){if(e.onGround){e.vx*=0.7;if(e.t%70===0){if(!groundAhead(e,24))e.dir*=-1;windup(e,'jump',16);}}return true;}, // ぴょんぴょん はねる
  draw(c,e,d,t){
    const g=c.createRadialGradient(-4,-17,2,0,-12,13);g.addColorStop(0,'#c5ef9a');g.addColorStop(1,'#5a9a3c');
    ell(c,0,-12,12,12,g,'#2e6a22',2);
    c.strokeStyle='rgba(235,255,210,.75)';c.lineWidth=1.1;c.beginPath();c.ellipse(0,-12,4.5,11.5,0,0,7);c.ellipse(0,-12,9,11.5,0,0,7);c.ellipse(0,-12,11.5,5,0,0,7);c.stroke();
    c.strokeStyle='#7a5a2a';c.lineWidth=2.2;c.beginPath();c.moveTo(0,-24);c.lineTo(0,-28);c.moveTo(-3,-28);c.lineTo(3,-28);c.stroke();
    ell(c,5,-26,4,2,'#6ab84a',null,0,-0.4);
    eyes(c,d*2.5,-11,4.2);
  }});

defineEnemy('wiener',{char:'w',w:30,h:18,hp:1,ability:'wiener',colors:['#d0503a','#ffb0a0','#a8301e'],speed:1.15,
  draw(c,e,d,t){
    for(let i=0;i<4;i++){const lx=-10+i*6.6,ly=Math.sin(t*0.35+i*1.6)*1.6;c.strokeStyle='#9a2e1e';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(lx,-4);c.lineTo(lx+d*1.5,-0.5+ly*0.5);c.stroke();}
    const g=c.createLinearGradient(0,-17,0,-4);g.addColorStop(0,'#ec6a50');g.addColorStop(1,'#a8301e');
    rr(c,-15,-17,30,13,6.5);c.fillStyle=g;c.fill();c.strokeStyle='#5a1a10';c.lineWidth=2;c.stroke();
    c.strokeStyle='rgba(255,210,190,.8)';c.lineWidth=1.4;for(const k of[0,4]){c.beginPath();c.moveTo(-d*(10-k),-15);c.lineTo(-d*(7-k),-8);c.stroke();}
    c.fillStyle='rgba(255,255,255,.4)';rr(c,-8,-15.5,14,2.4,1.2);c.fill();
    eyes(c,d*7,-11,3.6,0.85);
  }});

defineEnemy('rat',{char:'r',w:28,h:18,hp:1,colors:['#a8a8b8','#f2a8b8'],speed:1.5,
  onWalk(e){if(e.onGround&&e.t%170===0&&groundAhead(e,40))windup(e,'dash',20);},
  draw(c,e,d,t){
    c.strokeStyle='#d58a9a';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(-d*12,-5);c.quadraticCurveTo(-d*22,-4+Math.sin(t*0.2)*3,-d*22,-14);c.stroke();
    for(const k of[-6,5]){ell(c,k+Math.sin(t*0.4+k)*1.5,-1,3,1.8,'#8a8a98');}
    ell(c,0,-8,14,8.5,'#a8a8b8','#5a5a6a',2);
    ell(c,d*4,-15,4.8,4.8,'#a8a8b8','#5a5a6a',1.5);ell(c,d*4,-15,2.6,2.6,'#f2a8b8');
    ell(c,d*14,-8,2.2,2.2,'#f07890');
    ell(c,d*8,-10,1.8,2.4,'#2a160a');
    c.strokeStyle='rgba(60,60,70,.6)';c.lineWidth=0.8;c.beginPath();c.moveTo(d*13,-7);c.lineTo(d*19,-9);c.moveTo(d*13,-7);c.lineTo(d*19,-5);c.stroke();
  }});

defineEnemy('bird',{char:'b',w:26,h:20,hp:1,colors:['#a8743c','#f6e4c0'],
  update:flyPatrol(26,1.2),
  draw(c,e,d,t){
    ell(c,-d*10,-11,5,2.6,'#7a4a22',null,0,d*0.4);
    ell(c,0,-10,10,9.5,'#a8743c','#5a3414',1.8);
    ell(c,d*2,-6,6.5,5,'#f6e4c0');
    ell(c,-d*1,-12,7,4,'#7a4a22',null,0,Math.sin(t*0.45)*0.7*d);
    c.fillStyle='#ffa030';c.beginPath();c.moveTo(d*9,-13);c.lineTo(d*14,-11);c.lineTo(d*9,-9);c.closePath();c.fill();
    ell(c,d*5,-13,1.8,2.2,'#2a160a');
  }});

defineEnemy('fork',{char:'f',w:20,h:36,hp:3,noInhale:true,noStomp:true,colors:['#dfe6ee','#9aa6b4'],speed:0.75,dash:{frames:30,speed:4.2,cool:110},
  onWalk(e){if(e.onGround&&e.cool<=0&&playerAhead(e,180))windup(e,'dash',24);}, // まえに いると つっこんでくる
  draw(c,e,d,t){
    for(const k of[-4,4])ell(c,k,-1,3.5,2,'#6a7480');
    const g=c.createLinearGradient(-4,0,4,0);g.addColorStop(0,'#f4f8fc');g.addColorStop(1,'#8a96a4');
    rr(c,-3.5,-22,7,21,3);c.fillStyle=g;c.fill();c.strokeStyle='#4a5460';c.lineWidth=1.5;c.stroke();
    for(let i=0;i<4;i++){rr(c,-8.5+i*4.6,-44,3,14,1.5);c.fillStyle=g;c.fill();c.stroke();}
    rr(c,-10,-33,20,11,4);c.fillStyle=g;c.fill();c.stroke();
    eyes(c,d*1.5,-27.5,4,0.75,true);
  }});
