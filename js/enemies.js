'use strict';
// てき
// =====================================================================
//  てき
// =====================================================================
// ---- ふみつけ ----
// 上から落ちてきて当たったときだけ「ふんだ」あつかい（フォークは いたいので だめ）
function isStomp(topY){const p=player;return p.vy>=0&&p.prevBottom!=null&&p.prevBottom<=topY+10;}
function stompBounce(x,y,v=-8){
  const p=player;
  if(lv.water)v*=0.72;
  p.vy=K.jump?v-(lv.water?2:3):v;p.jumps=2;p.s=0.62;p.sv=0;p.y=Math.min(p.y,y-p.h);
  sfx('stomp');ring(x,y,'#fff',22);sparkle(x,y,5);dust(x,y,3);
  popText(x,y-20,'ふみっ！','#fff');
}
function damageEnemy(e,dmg,kd,inv=8){
  if(e.dead||e.hit>0)return false;
  e.hp-=dmg;e.hit=inv;
  if(e.hp<=0)killEnemy(e);
  else{sfx('hit');e.vx=kd*2;e.vy=-3;burst(e.x+e.w/2,e.y+e.h/2,ECOL[e.type],5,3);}
  return true;
}
function killEnemy(e){
  e.dead=true;const cx=e.x+e.w/2,cy=e.y+e.h/2;
  burst(cx,cy,ECOL[e.type],14,5);sparkle(cx,cy,5);ring(cx,cy,'#fff',26);addScore(100,cx,cy-12);sfx('pop');
}
// ---- よびどうさ（予備動作） ----
// jump:縦にちぢむ  dash:横にちぢんで のけぞる  turn/go:ちょっと止まって ちぢむ
// ふめない（トゲトゲ）てき：フォーク・ウニ・ふくらんだフグ
function isSpiky(e){return ENEMY[e.type].noStomp||(e.type==='fugu'&&e.pf>0.5);}
function lanternLure(e){return{x:e.x+e.w/2+e.dir*22*e.sqx,y:e.y+e.h-34*e.sqy};}
function windup(e,act,frames){e.wind=frames;e.windMax=frames;e.act=act;e.vx=0;}
function playerAhead(e,dist){const p=player;if(p.dead)return false;const dx=(p.x+p.w/2-(e.x+e.w/2))*e.dir;return dx>0&&dx<dist&&Math.abs(p.y+p.h-(e.y+e.h))<40;}
function enemyAct(e){
  const cx=e.x+e.w/2,by=e.y+e.h;
  switch(e.act){
    case'jump':e.vy=-8;e.vx=e.dir*1.7;e.sqx=0.82;e.sqy=1.28;dust(cx,by,3);break;
    case'dash':e.dash=e.type==='fork'?30:40;e.dashSp=e.type==='fork'?4.2:3.6;e.sqx=1.3;e.sqy=0.8;dust(cx-e.dir*8,by,4,-e.dir*1.5);if(e.type==='fork')e.cool=110;break;
    case'turn':e.dir*=-1;e.sqx=1.15;e.sqy=0.9;break;
    case'go':e.sqx=1.15;e.sqy=0.9;break;
  }
}
function enemyPose(e){
  let tx=1,ty=1,tl=0;
  if(e.wind>0){
    const k=Math.min(1,(1-e.wind/e.windMax)*1.7);
    if(e.act==='jump'){tx=1+0.25*k;ty=1-0.32*k;}
    else if(e.act==='dash'){tx=1-0.3*k;ty=1+0.14*k;tl=-e.dir*0.18*k;}
    else{tx=1-0.14*k;ty=1+0.06*k;}
  }else if(e.dash>0){tx=1.15;ty=0.9;tl=e.dir*0.08;}
  else if(e.type==='melon'&&!e.onGround&&e.suckT<=0){tx=0.9;ty=1.12;}
  e.sqx+=(tx-e.sqx)*0.3;e.sqy+=(ty-e.sqy)*0.3;e.lean+=(tl-e.lean)*0.3;
}
function updateEnemies(){
  const p=player;
  for(const e of enemies){
    if(e.dead)continue;
    if(!e.active){if(e.x<cam.x+W+60&&e.x+e.w>cam.x-60)e.active=true;else continue;}
    e.t++;if(e.hit>0)e.hit--;if(e.shake>0)e.shake--;
    if(e.suckT>0){e.suckT--;continue;}
    if(e.cool>0)e.cool--;
    if(e.type==='bird'||e.type==='fish'){
      const fish=e.type==='fish';
      e.y=e.baseY+Math.sin(e.t*0.06)*(fish?14:26);
      if(e.wind>0){if(--e.wind===0)enemyAct(e);}
      else{
        e.x+=e.dir*(fish?1.4:1.2);
        if((e.x>e.homeX+140&&e.dir>0)||(e.x<e.homeX-140&&e.dir<0))windup(e,'turn',14);
      }
    }else if(e.type==='jelly'){
      // ふわーっと のぼって ゆっくり おりてくる
      e.y=e.baseY-(1-Math.cos(e.t*0.025))*55;e.x=e.homeX+Math.sin(e.t*0.013)*24;
      const px=player.x+player.w/2;e.dir=px<e.x+e.w/2?-1:1;
    }else if(e.type==='fugu'){
      // ちかづくと ぷくーっと ふくらむ
      const near=!p.dead&&Math.hypot(p.x+p.w/2-(e.x+e.w/2),p.y+p.h/2-(e.y+e.h/2))<120;
      if(near&&e.pf<0.1)sfx('puff');
      e.pf+=((near?1:0)-e.pf)*(near?0.15:0.03);
      e.y=e.baseY+Math.sin(e.t*0.04)*10;
      if(e.pf<0.3){e.x+=e.dir*0.7;if((e.x>e.homeX+100&&e.dir>0)||(e.x<e.homeX-100&&e.dir<0))e.dir*=-1;}
    }else if(e.type==='lantern'){
      // ちかくに くると おいかけてくる
      const dx=p.x+p.w/2-(e.x+e.w/2),dy=p.y+p.h/2-(e.y+e.h/2),d=Math.hypot(dx,dy)||1;
      let tvx,tvy;
      if(d<280&&!p.dead){tvx=dx/d*1.1;tvy=dy/d*0.8;}
      else{tvx=(e.homeX-e.x)*0.01+Math.sin(e.t*0.02)*0.4;tvy=(e.baseY-e.y)*0.01;}
      e.vx+=(tvx-e.vx)*0.04;e.vy+=(tvy-e.vy)*0.04;
      moveBody(e);if(e.y<6){e.y=6;e.vy=Math.max(0,e.vy);}
      if(Math.abs(e.vx)>0.15)e.dir=e.vx>0?1:-1;
    }else{
      const sp={curry:0.5,anko:1.3,wiener:1.15,rat:1.5,fork:0.75,uni:0.35,crab:1}[e.type];
      if(e.thrown>0)e.thrown--;
      else if(e.wind>0){e.vx=0;if(--e.wind===0)enemyAct(e);}
      else if(e.dash>0){e.dash--;e.vx=e.dir*e.dashSp;if(e.onGround&&e.dash%4===0)dust(e.x+e.w/2-e.dir*e.w/2,e.y+e.h,1,-e.dir);}
      else if(e.type==='melon'){
        if(e.onGround){e.vx*=0.7;if(e.t%70===0){if(!groundAhead(e,24))e.dir*=-1;windup(e,'jump',16);}}
      }else if(e.type==='curry'&&(e.t%240)<50){e.vx=0;if(e.t%240===38)windup(e,'go',12);}
      else if(e.type==='crab'&&(e.t%200)<45){e.vx=0;} // ハサミを ふりあげて ひとやすみ
      else{
        e.vx=e.dir*sp;
        if(e.onGround&&(e.type==='anko'||e.type==='rat')&&e.t%170===0&&groundAhead(e,40))windup(e,'dash',20);
        else if(e.onGround&&e.type==='fork'&&e.cool<=0&&playerAhead(e,180))windup(e,'dash',24);
      }
      e.vy=Math.min(e.vy+0.5,10);
      const vx0=e.vx;moveBody(e);
      if(e.hitWall){if(e.thrown>0){e.dir*=-1;e.vx=-vx0;}else if(e.wind<=0){e.dash=0;windup(e,'turn',10);}}
      if(e.onGround){
        if(e.onDough){e.vy=-9;e.onGround=false;}
        else if(e.type!=='melon'&&e.thrown<=0&&e.wind<=0&&!groundAhead(e,2)){e.dash=0;windup(e,'turn',10);}
      }
      if(e.type==='anko')e.rot+=e.vx*0.09;
      if(e.y>ROWS*TS+80)e.dead=true;
    }
    enemyPose(e);
    if(!p.dead&&G.state==='play'){
      if(p.roll>0){const rc=rollCircle();if(circleRect(rc.x,rc.y,rc.r,e)){damageEnemy(e,99,p.face);G.shake=Math.max(G.shake,3);continue;}}
      else if(overlap(phb(),{x:e.x+2-e.pf*7,y:e.y+2-e.pf*7,w:e.w-4+e.pf*14,h:e.h-2+e.pf*14})){
        if(!isSpiky(e)&&isStomp(e.y-e.pf*7)){damageEnemy(e,3,0,6);stompBounce(e.x+e.w/2,e.y);}
        else hurtPlayer(e.x+e.w/2);
      }
    }
  }
  enemies=enemies.filter(e=>!e.dead);
}

// ---------- 敵の描画 ----------
function eyes(c,x,y,gap,s=1,angry=false){
  c.fillStyle='#2a160a';for(const k of[-1,1]){c.beginPath();c.ellipse(x+k*gap,y,2.2*s,3*s,0,0,7);c.fill();}
  c.fillStyle='#fff';for(const k of[-1,1]){c.beginPath();c.arc(x+k*gap-0.7*s,y-1.1*s,0.8*s,0,7);c.fill();}
  if(angry){c.strokeStyle='#2a160a';c.lineWidth=1.6;c.lineCap='round';for(const k of[-1,1]){c.beginPath();c.moveTo(x+k*(gap+3.2*s),y-6*s);c.lineTo(x+k*(gap-2.4*s),y-3.6*s);c.stroke();}}
}
function drawEnemy(e){
  if(e.x>cam.x+W+60||e.x+e.w<cam.x-60)return;
  const c=ctx,d=e.dir,t=e.t;c.save();
  let x=e.x+e.w/2,y=e.y+e.h;if(e.shake>0)x+=rand(-2,2);
  c.translate(x,y);
  if(e.hit>0&&e.hit%4<2)c.globalAlpha=0.45;
  if(e.suckT>0){c.translate(0,-e.h/2);c.rotate(Math.sin(G.t*0.9)*0.3);c.scale(0.85,1.1);c.translate(0,e.h/2);}
  if(e.wind>0&&e.act==='dash'&&e.wind<8)c.translate(rand(-1,1),0);
  c.rotate(e.lean);c.scale(e.sqx,e.sqy);
  switch(e.type){
    case'curry':{
      const sq=1+Math.sin(t*0.15)*0.07;c.scale(1/sq,sq);
      const g=c.createLinearGradient(0,-22,0,0);g.addColorStop(0,'#e48e36');g.addColorStop(1,'#a8501a');
      c.beginPath();c.moveTo(-15,0);c.bezierCurveTo(-17,-12,-11,-21,-4,-20);c.bezierCurveTo(0,-25,8,-23,9,-18);c.bezierCurveTo(15,-16,17,-6,15,0);c.closePath();
      c.fillStyle=g;c.fill();c.strokeStyle='#5a2a0c';c.lineWidth=2;c.stroke();
      c.fillStyle='#ff8c2a';rr(c,-12,-9,7,5,2);c.fill();c.fillStyle='#f5dc8c';rr(c,6,-7,7,6,2);c.fill();
      ell(c,-1,-4,1.8,1.8,'#7a3a12');ell(c,-6,-16,4,2,'rgba(255,255,255,.4)',null,0,-0.3);
      eyes(c,d*3,-13,4.5);
      c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2;c.lineCap='round';
      for(const k of[-4,5]){c.beginPath();for(let i=0;i<=6;i++){const yy=-25-i*2.4,xx=k+Math.sin(i*0.9+t*0.12+k)*2.2;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}
      break;}
    case'anko':{
      const g=c.createRadialGradient(-4,-17,2,0,-12,13);g.addColorStop(0,'#9a5050');g.addColorStop(1,'#4a1824');
      ell(c,0,-12,12.5,12,g,'#2a0a10',2);
      c.save();c.translate(0,-12);c.rotate(e.rot);c.strokeStyle='#fff';c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(-4,-8.5);c.quadraticCurveTo(0,-10.5,4,-8.5);c.stroke();c.restore();
      ell(c,-5,-18,3.5,2,'rgba(255,255,255,.35)',null,0,-0.5);
      eyes(c,d*2.5,-11,4.2);
      break;}
    case'melon':{
      const g=c.createRadialGradient(-4,-17,2,0,-12,13);g.addColorStop(0,'#c5ef9a');g.addColorStop(1,'#5a9a3c');
      ell(c,0,-12,12,12,g,'#2e6a22',2);
      c.strokeStyle='rgba(235,255,210,.75)';c.lineWidth=1.1;c.beginPath();c.ellipse(0,-12,4.5,11.5,0,0,7);c.ellipse(0,-12,9,11.5,0,0,7);c.ellipse(0,-12,11.5,5,0,0,7);c.stroke();
      c.strokeStyle='#7a5a2a';c.lineWidth=2.2;c.beginPath();c.moveTo(0,-24);c.lineTo(0,-28);c.moveTo(-3,-28);c.lineTo(3,-28);c.stroke();
      ell(c,5,-26,4,2,'#6ab84a',null,0,-0.4);
      eyes(c,d*2.5,-11,4.2);
      break;}
    case'wiener':{
      for(let i=0;i<4;i++){const lx=-10+i*6.6,ly=Math.sin(t*0.35+i*1.6)*1.6;c.strokeStyle='#9a2e1e';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(lx,-4);c.lineTo(lx+d*1.5,-0.5+ly*0.5);c.stroke();}
      const g=c.createLinearGradient(0,-17,0,-4);g.addColorStop(0,'#ec6a50');g.addColorStop(1,'#a8301e');
      rr(c,-15,-17,30,13,6.5);c.fillStyle=g;c.fill();c.strokeStyle='#5a1a10';c.lineWidth=2;c.stroke();
      c.strokeStyle='rgba(255,210,190,.8)';c.lineWidth=1.4;for(const k of[0,4]){c.beginPath();c.moveTo(-d*(10-k),-15);c.lineTo(-d*(7-k),-8);c.stroke();}
      c.fillStyle='rgba(255,255,255,.4)';rr(c,-8,-15.5,14,2.4,1.2);c.fill();
      eyes(c,d*7,-11,3.6,0.85);
      break;}
    case'rat':{
      c.strokeStyle='#d58a9a';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(-d*12,-5);c.quadraticCurveTo(-d*22,-4+Math.sin(t*0.2)*3,-d*22,-14);c.stroke();
      for(const k of[-6,5]){ell(c,k+Math.sin(t*0.4+k)*1.5,-1,3,1.8,'#8a8a98');}
      ell(c,0,-8,14,8.5,'#a8a8b8','#5a5a6a',2);
      ell(c,d*4,-15,4.8,4.8,'#a8a8b8','#5a5a6a',1.5);ell(c,d*4,-15,2.6,2.6,'#f2a8b8');
      ell(c,d*14,-8,2.2,2.2,'#f07890');
      ell(c,d*8,-10,1.8,2.4,'#2a160a');
      c.strokeStyle='rgba(60,60,70,.6)';c.lineWidth=0.8;c.beginPath();c.moveTo(d*13,-7);c.lineTo(d*19,-9);c.moveTo(d*13,-7);c.lineTo(d*19,-5);c.stroke();
      break;}
    case'bird':{
      ell(c,-d*10,-11,5,2.6,'#7a4a22',null,0,d*0.4);
      ell(c,0,-10,10,9.5,'#a8743c','#5a3414',1.8);
      ell(c,d*2,-6,6.5,5,'#f6e4c0');
      ell(c,-d*1,-12,7,4,'#7a4a22',null,0,Math.sin(t*0.45)*0.7*d);
      c.fillStyle='#ffa030';c.beginPath();c.moveTo(d*9,-13);c.lineTo(d*14,-11);c.lineTo(d*9,-9);c.closePath();c.fill();
      ell(c,d*5,-13,1.8,2.2,'#2a160a');
      break;}
    case'fish':{
      c.save();c.translate(-d*12,-10);c.rotate(Math.sin(t*0.3)*0.35*d);
      c.beginPath();c.moveTo(0,0);c.lineTo(-d*10,-8);c.lineTo(-d*10,8);c.closePath();c.fillStyle='#3a88c8';c.fill();c.strokeStyle='#1a4a7a';c.lineWidth=1.5;c.stroke();c.restore();
      ell(c,-d*1,-18.5,5,2.6,'#3a88c8','#1a4a7a',1.2);
      const g=c.createLinearGradient(0,-20,0,0);g.addColorStop(0,'#6ac4f4');g.addColorStop(1,'#e2f6ff');
      ell(c,0,-10,14,9.5,g,'#1a4a7a',1.8);
      c.strokeStyle='rgba(255,205,80,0.95)';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(-d*8,-13);c.quadraticCurveTo(0,-10,d*6,-13);c.stroke();
      ell(c,d*7,-12,2.9,2.9,'#fff','#1a4a7a',1);ell(c,d*7.7,-12,1.5,1.9,'#14202a');
      ell(c,d*4,-6.5,2.2,1.3,'rgba(255,120,140,0.5)');
      c.strokeStyle='#1a4a7a';c.lineWidth=1.2;c.beginPath();c.arc(d*11.5,-8,1.6,0,Math.PI);c.stroke();
      break;}
    case'jelly':{
      const pu=Math.sin(t*0.1);c.scale(1+pu*0.06,1-pu*0.06);
      c.strokeStyle='rgba(255,150,215,0.85)';c.lineWidth=2;c.lineCap='round';
      for(let i=0;i<4;i++){const lx=-8+i*5.3;c.beginPath();c.moveTo(lx,-10);for(let k=1;k<=4;k++)c.lineTo(lx+Math.sin(t*0.12+k+i)*2.2,-10+k*3.2);c.stroke();}
      const g=c.createRadialGradient(-3,-20,2,0,-14,15);g.addColorStop(0,'rgba(255,242,250,0.95)');g.addColorStop(1,'rgba(240,140,210,0.88)');
      c.beginPath();c.moveTo(-13,-10);c.bezierCurveTo(-14,-31,14,-31,13,-10);
      c.quadraticCurveTo(9.5,-7,6.5,-10);c.quadraticCurveTo(3.2,-7,0,-10);c.quadraticCurveTo(-3.2,-7,-6.5,-10);c.quadraticCurveTo(-9.5,-7,-13,-10);c.closePath();
      c.fillStyle=g;c.fill();c.strokeStyle='#b0509a';c.lineWidth=1.8;c.stroke();
      ell(c,-5,-21,3.5,2,'rgba(255,255,255,0.75)',null,0,-0.5);
      eyes(c,d*1.5,-16,4,0.8);
      break;}
    case'uni':{
      const pu=1+Math.sin(t*0.12)*0.08;
      c.strokeStyle='#2a1030';c.lineWidth=2.4;c.lineCap='round';
      for(let i=0;i<14;i++){const a=i/14*Math.PI*2+t*0.01;c.beginPath();c.moveTo(Math.cos(a)*9,-12+Math.sin(a)*9);c.lineTo(Math.cos(a)*17*pu,-12+Math.sin(a)*17*pu);c.stroke();}
      const g=c.createRadialGradient(-4,-17,2,0,-12,12);g.addColorStop(0,'#9a6ab8');g.addColorStop(1,'#3a1a4a');
      ell(c,0,-12,11.5,11,g,'#1a0820',2);
      ell(c,-4,-17,3,1.8,'rgba(255,255,255,0.35)',null,0,-0.5);
      eyes(c,d*2,-11,3.8,0.8,true);
      break;}
    case'crab':{
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
      break;}
    case'fugu':{
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
      break;}
    case'lantern':{
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
      break;}
    case'fork':{
      for(const k of[-4,4])ell(c,k,-1,3.5,2,'#6a7480');
      const g=c.createLinearGradient(-4,0,4,0);g.addColorStop(0,'#f4f8fc');g.addColorStop(1,'#8a96a4');
      rr(c,-3.5,-22,7,21,3);c.fillStyle=g;c.fill();c.strokeStyle='#4a5460';c.lineWidth=1.5;c.stroke();
      for(let i=0;i<4;i++){rr(c,-8.5+i*4.6,-44,3,14,1.5);c.fillStyle=g;c.fill();c.stroke();}
      rr(c,-10,-33,20,11,4);c.fillStyle=g;c.fill();c.stroke();
      eyes(c,d*1.5,-27.5,4,0.75,true);
      break;}
  }
  c.restore();
}
