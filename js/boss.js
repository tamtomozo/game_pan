'use strict';
// ボス：こげこげ大王
// =====================================================================
//  ボス：こげこげ大王
// =====================================================================
function bossHB(){const b=boss;if(b.water&&!b.popped)return{x:b.x+b.w/2-64,y:b.y-32,w:128,h:b.h+40};return{x:b.x+8,y:b.y+10,w:b.w-16,h:b.h-10};}
function bossVulnerable(){return boss&&!['sleep','intro','dying','gone'].includes(boss.state);}
function setB(s){boss.state=s;boss.t=0;}
function lockArena(){for(let ty=0;ty<14;ty++)lv.t[ty][lv.arenaCol]='L';lv.locked=true;G.shake=8;sfx('thud');}
function arenaPlats(){
  const r=[];if(lv.arenaCol==null)return r;
  for(let ty=0;ty<ROWS;ty++)for(let tx=lv.arenaCol;tx<lv.arenaCol+30;tx++){
    if(tileAt(tx,ty)==='='&&tileAt(tx-1,ty)!=='='){let e=tx;while(tileAt(e+1,ty)==='=')e++;r.push({cx:(tx+e+1)*TS/2,top:ty*TS});}
  }
  return r;
}
function hitBoss(d,inv=14){
  const b=boss;if(!b||b.hit>0||!bossVulnerable())return false;
  b.hp-=d;b.hit=inv;b.sv-=0.1;sfx('bosshit');
  burst(b.x+b.w/2,b.y+b.h/2,b.water?['#dff6ff','#a8e0ff','#fff']:['#3a2414','#ff8a3a','#ffd36a'],8,5);b.bw=1;popText(b.x+b.w/2,b.y-6,'-'+d,'#ffd36a');
  if(b.hp<=0){
    b.hp=0;setB('dying');stopBGM();
    for(const e of enemies)if(!e.dead)killEnemy(e);
    for(const q of projs)if(!q.friendly)q.dead=true;
    addScore(5000,b.x+b.w/2,b.y-20);G.shake=10;
  }
  return true;
}
// ボスの予備動作ポーズ
function bossPose(angry){
  const b=boss,t=b.t;let tx=1,ty=1,tl=0;
  if(b.state==='jump'){const JW=angry?12:18;if(t<JW&&b.onGround){const k=t/JW;tx=1+0.25*k;ty=1-0.3*k;}}
  else if(b.state==='charge'){if(t<36){const k=Math.min(1,t/24);tx=1-0.28*k;ty=1+0.12*k;tl=-b.dir*0.2*k;}else{tx=1.12;ty=0.92;tl=b.dir*0.1;}}
  else if(b.state==='shoot'){const ph=t<24?t/24:(angry&&t<44?(t-24)/20:0);tx=ty=1+0.16*ph;}
  else if(b.state==='summon'){const k=(t>=13&&t<25)?(t-13)/12:(t>=33&&t<45)?(t-33)/12:0;tx=1+0.15*k;ty=1-0.2*k;}
  b.sqx+=(tx-b.sqx)*0.25;b.sqy+=(ty-b.sqy)*0.25;b.lean+=(tl-b.lean)*0.25;
}
function bossNext(){
  const b=boss,p=player;
  const minions=enemies.filter(e=>!e.dead&&ENEMY[e.type].ability).length;
  const groundAb=items.some(i=>i.type==='ability');
  if(p.form==='plain'&&minions===0&&!groundAb){setB('summon');return;}
  const opts=b.water?['charge','shoot','slam','charge']:['jump','charge','shoot','jump'];if(minions<2)opts.push('summon');
  let s=opts[Math.floor(Math.random()*opts.length)];
  if(s===b.last&&Math.random()<0.6)s=opts[(opts.indexOf(s)+1)%opts.length];
  b.last=s;setB(s);
}
function updateBoss(){
  const b=boss;if(!b||b.state==='gone')return;const p=player;
  if(b.water){updateWaterBoss();return;}
  if(b.state==='sleep'){
    b.t++;
    if(lv.arenaX!=null&&p.x>lv.arenaX+64&&!p.dead){lockArena();setB('intro');playBGM('boss');setBanner('こげこげ大王 が あらわれた！','へんしんパワーで やっつけろ！',150);}
    return;
  }
  b.t++;if(b.hit>0)b.hit--;
  b.sv+=(1-b.s)*0.15;b.sv*=0.85;b.s+=b.sv;
  const angry=b.hp<=b.max/2,bcx=b.x+b.w/2,pcx=p.x+p.w/2;
  switch(b.state){
    case'intro':if(b.t===30){b.s=1.35;b.mouth=1;sfx('roar');G.shake=14;}if(b.t===75)b.mouth=0;if(b.t>100)setB('idle');break;
    case'idle':b.vx*=0.8;b.dir=pcx<bcx?-1:1;if(b.t>(angry?28:50))bossNext();break;
    case'jump':{
      const JW=angry?12:18; // ためる時間（縦にちぢむ）
      b.vx*=b.onGround?0.8:1;
      if(b.t===JW){
        // ねらう着地点：プレイヤーが足場の上ならそこ、ときどき足場、ふだんはプレイヤーの足もと
        const ground=14*TS,plats=arenaPlats();let tx=pcx,ty=ground;
        if(p.onGround&&p.y+p.h<ground-8)ty=p.y+p.h;
        else if(plats.length&&Math.random()<0.45){const pl=plats[Math.floor(Math.random()*plats.length)];tx=pl.cx;ty=pl.top;}
        const v=angry?19:17.5,dy=ty-(b.y+b.h);
        const ft=(v+Math.sqrt(Math.max(0,v*v+1.2*dy)))/0.6;
        b.dropT=ty>=ground?1:0; // 地面ねらいのときは足場をすりぬける
        b.vy=-v;b.vx=clamp((tx-bcx)/ft,-9,9);b.sqx=0.78;b.sqy=1.3;dust(bcx,b.y+b.h,6);
      }
      if(b.t>JW+2&&b.onGround){
        b.dropT=0;b.vx=0;b.sqx=1.3;b.sqy=0.72;G.shake=14;b.s=0.6;sfx('thud');dust(b.x+10,b.y+b.h,6,-1.5);dust(b.x+b.w-10,b.y+b.h,6,1.5);
        if(angry)for(const d of[-1,1])projs.push({type:'ember',x:bcx+d*50,y:b.y+b.h-12,vx:d*4.5,vy:0,r:10,life:120,friendly:false,t:0});
        setB('idle');
      }
      break;}
    case'summon':
      b.vx*=0.8;b.mouth=b.t>=12?1:0;
      if(b.t===25||b.t===45){b.sqx=0.88;b.sqy=1.22;
        const tp=ABILS[Math.floor(Math.random()*4)],D=ENEMY[tp];
        const e=spawnEnemy(tp,bcx+b.dir*30-D.w/2,b.y+20);
        e.vx=b.dir*rand(2.5,4.5);e.vy=-7;e.thrown=40;e.dir=b.dir;e.active=true;sfx('spit');
      }
      if(b.t>65){b.mouth=0;setB('idle');}
      break;
    case'charge':
      if(b.t<36){b.vx*=0.8;b.jit=(b.t%4<2?2:-2);if(b.t===1){b.dir=pcx<bcx?-1:1;sfx('roar');}}
      else{
        b.jit=0;b.vx=b.dir*(angry?8.5:6.5);if(b.t%5===0)dust(bcx-b.dir*40,b.y+b.h,2,-b.dir);
        if(b.hitWall){G.shake=12;sfx('thud');b.vx=-b.dir*3;b.vy=-6;setB('stun');}
        if(b.t>200)setB('idle');
      }
      break;
    case'stun':b.vx*=0.9;if(b.t>(angry?55:85))setB('idle');break;
    case'shoot':
      b.vx*=0.8;b.mouth=b.t>=12?1:0;
      if(b.t===24||(angry&&b.t===44)){b.sqx=0.86;b.sqy=0.9;
        const a0=Math.atan2((p.y+p.h/2)-(b.y+40),pcx-(bcx+b.dir*30));
        for(const k of[-0.28,0,0.28])projs.push({type:'ember',x:bcx+b.dir*34,y:b.y+40,vx:Math.cos(a0+k)*4.5,vy:Math.sin(a0+k)*4.5,r:10,life:160,friendly:false,t:0});
        sfx('shoot');
      }
      if(b.t>64){b.mouth=0;setB('idle');}
      break;
    case'dying':
      b.vx=0;b.mouth=1;
      if(b.t%5===0){burst(b.x+rand(0,b.w),b.y+rand(0,b.h),['#ffd36a','#ff8a3a','#3a2414','#fff'],10,5);sfx('pop');G.shake=6;}
      if(b.t>110){
        b.state='gone';
        for(let i=0;i<5;i++)ring(bcx,b.y+b.h/2,['#fff','#ffd36a','#ff8a3a'][i%3],40+i*20);
        sparkle(bcx,b.y+b.h/2,24);
        goal={x:lv.arenaX+15*TS,y:14*TS,appear:0};
        sfx('transform');setBanner('こげこげ大王を やっつけた！','ゴールの かごへ いこう！',170);playBGM('s3');
      }
      return;
  }
  bossPose(angry);
  b.vy=Math.min(b.vy+0.6,12);moveBody(b);
  bossContact();
}
function bossContact(){
  const b=boss,p=player,pcx=p.x+p.w/2,bcx=b.x+b.w/2;
  if(!p.dead&&b.state!=='intro'){
    const hb=bossHB();
    if(p.roll>0){
      const rc=rollCircle();
      if(circleRect(rc.x,rc.y,rc.r,hb)){
        hitBoss(4,20);p.roll=0;p.rollCd=25;p.hurtT=14;p.vx=(pcx<bcx?-1:1)*6;p.vy=lv.water?-4:-7;p.inv=Math.max(p.inv,30);G.shake=8;
      }
    }else if(overlap(phb(),hb)){
      if(isStomp(hb.y+6)){hitBoss(2,20);stompBounce(pcx,hb.y,-11);}
      else hurtPlayer(bcx);
    }
  }
}

// ---- みずのなかの こげこげ大王（あわに つつまれている。あわの たいきゅうど＝ライフ）
function updateWaterBoss(){
  const b=boss,p=player;
  b.t++;b.dropT=1;b.bw=(b.bw||0)*0.92;
  if(b.state==='sleep'){
    if(lv.arenaX!=null&&p.x>lv.arenaX+64&&!p.dead){lockArena();setB('intro');playBGM('boss');setBanner('あわに つつまれた こげこげ大王！','あわを こわせば かちだ！',150);}
    return;
  }
  if(b.hit>0)b.hit--;
  b.sv+=(1-b.s)*0.15;b.sv*=0.85;b.s+=b.sv;
  const angry=b.hp<=b.max/2,bcx=b.x+b.w/2,bcy=b.y+b.h/2,pcx=p.x+p.w/2,pcy=p.y+p.h/2;
  const floatY=7*TS+Math.sin(b.t*0.05)*18; // ふだん ただよう たかさ
  const steer=(tvx,tvy,k)=>{b.vx+=(tvx-b.vx)*k;b.vy+=(tvy-b.vy)*k;};
  switch(b.state){
    case'intro':
      steer(0,(floatY-b.y)*0.03,0.1);
      if(b.t===30){b.s=1.35;b.mouth=1;sfx('roar');G.shake=14;bubbles(bcx,bcy,20,2);}
      if(b.t===75)b.mouth=0;
      if(b.t>100)setB('idle');
      break;
    case'idle':
      b.dir=pcx<bcx?-1:1;
      steer(clamp((pcx-bcx)*0.008,-1.2,1.2),(floatY-b.y)*0.03,0.06);
      if(b.t>(angry?40:65))bossNext();
      break;
    case'charge': // プレイヤーと おなじ たかさに あわせて とっしん
      if(b.t<40){
        if(b.t===1){b.dir=pcx<bcx?-1:1;sfx('roar');}
        b.jit=b.t%4<2?2:-2;
        steer(0,(clamp(pcy-b.h/2,2*TS,14*TS-b.h)-b.y)*0.06,0.2);
      }else{
        b.jit=0;b.vy*=0.9;b.vx=b.dir*(angry?8:6.5);
        if(b.t%3===0)bubbles(bcx-b.dir*50,bcy,2,1);
        if(b.hitWall){G.shake=12;sfx('thud');b.vx=-b.dir*3;b.vy=-2;bubbles(bcx+b.dir*60,bcy,10,2);setB('stun');}
        else if(b.t>200)setB('idle');
      }
      break;
    case'stun':b.vx*=0.92;b.vy*=0.92;if(b.t>(angry?55:85))setB('idle');break;
    case'shoot': // こげあわ を はく
      steer(0,0,0.1);b.mouth=b.t>=12?1:0;
      if(b.t===24||(angry&&b.t===54)){
        b.sqx=0.86;b.sqy=0.9;const n=angry?5:3,a0=Math.atan2(pcy-(bcy+10),pcx-(bcx+b.dir*40));
        for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*0.38;projs.push({type:'sbub',x:bcx+b.dir*40,y:bcy+10,vx:Math.cos(a)*3,vy:Math.sin(a)*3,r:13,life:220,friendly:false,t:0});}
        sfx('shoot');bubbles(bcx+b.dir*40,bcy+10,6);
      }
      if(b.t>(angry?90:70)){b.mouth=0;setB('idle');}
      break;
    case'slam': // うえへ のぼって ドスーン！
      if(b.t<50)steer(clamp((pcx-bcx)*0.04,-5,5),(TS-b.y)*0.05,0.12);
      else if(b.t<64){b.vx*=0.8;b.vy*=0.8;b.jit=b.t%4<2?2:-2;b.sqx=1.12;b.sqy=0.9;}
      else{
        b.jit=0;b.vx=0;b.vy=Math.min(b.vy+0.9,14);
        if(b.onGround){
          G.shake=14;sfx('thud');b.sqx=1.3;b.sqy=0.72;b.s=0.6;bubbles(bcx,b.y+b.h,14,2);dust(b.x+10,b.y+b.h,6,-1.5);dust(b.x+b.w-10,b.y+b.h,6,1.5);
          for(const d of[-1,1])projs.push({type:'wave',x:bcx+d*56,y:b.y+b.h-16,vx:d*(angry?5:4),vy:0,r:15,life:120,friendly:false,t:0});
          setB('idle');
        }
      }
      if(b.t>220)setB('idle');
      break;
    case'summon':
      steer(0,0,0.1);b.mouth=b.t>=12?1:0;
      if(b.t===25||b.t===45){
        b.sqx=0.88;b.sqy=1.22;
        const tp=ABILS[Math.floor(Math.random()*4)],D=ENEMY[tp];
        const e=spawnEnemy(tp,bcx+b.dir*30-D.w/2,b.y+20);
        e.vx=b.dir*rand(2.5,4.5);e.vy=-5;e.thrown=40;e.dir=b.dir;e.active=true;sfx('spit');bubbles(bcx+b.dir*30,b.y+30,5);
      }
      if(b.t>65){b.mouth=0;setB('idle');}
      break;
    case'dying': // あわが われて ふやけていく
      b.jit=0;b.vx*=0.9;b.vy+=(0.7-b.vy)*0.05;b.mouth=1;b.soggy=Math.min(1,b.t/70);
      if(b.t===1){b.popped=true;sfx('bubpop');G.shake=16;for(let i=0;i<3;i++)ring(bcx,bcy,['#fff','#c8f0ff','#8ad0ff'][i],60+i*25);bubbles(bcx,bcy,40,3);popText(bcx,b.y-30,'パチーン！','#c8f0ff');}
      if(b.t===24)sfx('soggy');
      if(b.t%6===0)bubbles(bcx+rand(-40,40),b.y+rand(0,40),1,0.7);
      moveBody(b);
      if(b.t>160){
        b.state='gone';
        for(let i=0;i<5;i++)ring(bcx,bcy,['#fff','#c8f0ff','#ffd36a'][i%3],40+i*20);
        sparkle(bcx,bcy,24);bubbles(bcx,bcy,30,2.5);
        goal={x:lv.arenaX+15*TS,y:14*TS,appear:0};
        sfx('transform');setBanner('こげこげ大王が ふやけちゃった！','ゴールの かごへ いこう！',170);playBGM('deep');
      }
      return;
  }
  bossPose(angry);
  moveBody(b);if(b.y<4){b.y=4;if(b.vy<0)b.vy=0;}
  bossContact();
}

// ---------- ボス描画 ----------
function drawBoss(){
  const b=boss;if(!b||b.state==='gone')return;const c=ctx;
  const bcx=b.x+b.w/2;
  c.save();c.translate(bcx+(b.jit||0),b.y+b.h);
  if(b.state==='dying'){
    if(b.water){const k=1+0.2*(b.soggy||0);c.scale(k*1.06,k*0.96);c.rotate(Math.sin(b.t*0.08)*0.12);}
    else{const k=Math.max(0.05,1-b.t/110);c.scale(k,k);c.rotate(Math.sin(b.t*0.6)*0.15);}
  }
  const sy=b.s,sx=1+(1-b.s)*0.8;c.rotate(b.lean||0);c.scale(sx*(b.sqx||1),sy*(b.sqy||1));
  if(b.hit>0&&b.hit%4<2)c.globalAlpha=0.55;
  const rx=50,h=88,fd=b.dir*6;
  if(!b.water||b.onGround){c.fillStyle='rgba(0,0,0,0.25)';c.beginPath();c.ellipse(0,1,rx,6,0,0,7);c.fill();}
  bunPath(c,rx,h);
  const g=c.createLinearGradient(0,-h,0,0);g.addColorStop(0,'#24130a');g.addColorStop(0.5,'#4a2a16');g.addColorStop(1,'#8a5a30');
  c.fillStyle=g;c.fill();
  c.save();c.clip();
  c.strokeStyle='rgba(255,120,40,'+(0.55+Math.sin(G.t*0.15)*0.25)+')';c.lineWidth=2.2;c.lineJoin='round';
  for(const[x0,y0,dx]of[[-34,-70,1],[22,-62,-1],[-12,-30,1],[34,-34,-1]]){c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+dx*6,y0+7);c.lineTo(x0+dx*2,y0+12);c.lineTo(x0+dx*9,y0+20);c.stroke();}
  c.fillStyle='rgba(0,0,0,0.3)';for(const[x0,y0,r]of[[-26,-50,7],[30,-74,5],[10,-18,6]]){c.beginPath();c.arc(x0,y0,r,0,7);c.fill();}
  c.fillStyle='rgba(255,255,255,0.12)';c.beginPath();c.ellipse(-22,-74,14,6,-0.5,0,7);c.fill();
  if(b.soggy){
    c.fillStyle='rgba(225,240,255,'+(0.65*b.soggy)+')';c.fillRect(-60,-100,120,110);
    c.fillStyle='rgba(150,200,240,'+(0.5*b.soggy)+')';for(let i=0;i<14;i++){const[a,q,r]=CRUMB_PTS[i];c.beginPath();c.arc((a*2-1)*rx,-q*h,2+r*4,0,7);c.fill();}
  }
  c.restore();
  bunPath(c,rx,h);c.lineWidth=3;c.strokeStyle='#120804';c.stroke();
  // おうかん
  c.save();c.translate(0,-h+6);c.rotate(Math.sin(G.t*0.05)*0.05);
  c.beginPath();c.moveTo(-20,0);c.lineTo(-22,-20);c.lineTo(-11,-9);c.lineTo(0,-24);c.lineTo(11,-9);c.lineTo(22,-20);c.lineTo(20,0);c.closePath();
  c.fillStyle='#ffcc33';c.fill();c.strokeStyle='#8a5a00';c.lineWidth=2;c.stroke();
  ell(c,0,-7,3.5,3.5,'#ff3a4a');ell(c,-12,-4,2.4,2.4,'#3ab0ff');ell(c,12,-4,2.4,2.4,'#3ab0ff');
  c.restore();
  // かお
  const ey=-52;
  if(b.state==='sleep'){
    c.strokeStyle='#ffb070';c.lineWidth=3;c.lineCap='round';for(const k of[-1,1]){c.beginPath();c.arc(fd+k*17,ey,7,0.15*Math.PI,0.85*Math.PI);c.stroke();}
  }else if(b.state==='stun'||b.state==='dying'){
    c.strokeStyle='#fff';c.lineWidth=2;for(const k of[-1,1]){c.beginPath();for(let i=0;i<20;i++){const a=i*0.6+G.t*0.2*k,r=i*0.45;const xx=fd+k*17+Math.cos(a)*r,yy=ey+Math.sin(a)*r;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}
  }else{
    for(const k of[-1,1]){ell(c,fd+k*17,ey,9,10,'#fff3d0','#120804',2);ell(c,fd+k*17+b.dir*3,ey+1,4,5,'#e0201a');ell(c,fd+k*17+b.dir*3-1,ey-1,1.3,1.3,'#fff');}
    c.strokeStyle='#120804';c.lineWidth=5;c.lineCap='round';for(const k of[-1,1]){c.beginPath();c.moveTo(fd+k*29,ey-15);c.lineTo(fd+k*8,ey-8);c.stroke();}
  }
  if(b.mouth||b.state==='intro'&&b.t>30&&b.t<75){
    c.fillStyle='#3a0a06';c.beginPath();c.ellipse(fd,-24,17,12,0,0,7);c.fill();c.strokeStyle='#120804';c.lineWidth=2;c.stroke();
    c.fillStyle='#fff';for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(fd+i*6-3,-34);c.lineTo(fd+i*6+3,-34);c.lineTo(fd+i*6,-28);c.closePath();c.fill();}
  }else if(b.state!=='sleep'){
    c.strokeStyle='#120804';c.lineWidth=3;c.beginPath();c.moveTo(fd-14,-24);c.lineTo(fd-7,-28);c.lineTo(fd,-24);c.lineTo(fd+7,-28);c.lineTo(fd+14,-24);c.stroke();
  }else{
    c.strokeStyle='#120804';c.lineWidth=2.5;c.beginPath();c.arc(fd,-28,6,0.2*Math.PI,0.8*Math.PI);c.stroke();
  }
  if(b.state==='stun'){c.fillStyle='#8ad0ff';c.beginPath();c.moveTo(rx-6,-80);c.quadraticCurveTo(rx+2,-68,rx-6,-64);c.quadraticCurveTo(rx-14,-68,rx-6,-80);c.fill();}
  c.restore();
  if(b.state==='sleep')txt('ぐうぐう…',bcx+40+Math.sin(G.t*0.05)*4,b.y-10-((G.t*0.3)%14),18,'#fff','#3a1a0a');
  if(b.water){drawBossBubble(b);if(G.t%20===0)bubbles(bcx+rand(-30,30),b.y+10,1,0.6);}
  else if(b.state!=='dying'&&G.t%8===0)addP({type:'smoke',x:bcx+rand(-30,30),y:b.y+10,vx:rand(-0.3,0.3),vy:-0.8,life:40,size:6,color:'rgba(60,40,30,0.35)'});
}
// こげこげ大王を つつむ あわ。ダメージを うけるほど ひびが ふえる
function drawBossBubble(b){
  if(b.popped)return;
  const c=ctx,a=b.hp/b.max,low=a<0.3,w=b.bw||0,wv=Math.sin(G.t*0.6)*w*0.08;
  const bcx=b.x+b.w/2+(b.jit||0),rx=72*(1+wv)*Math.pow(b.sqx||1,0.3),ry=68*(1-wv)*Math.pow(b.sqy||1,0.3),cy=b.y+b.h-58;
  const g=c.createRadialGradient(bcx-rx*0.3,cy-ry*0.35,4,bcx,cy,Math.max(rx,ry));
  g.addColorStop(0,'rgba(255,255,255,0.2)');g.addColorStop(0.7,'rgba(170,225,255,0.08)');g.addColorStop(1,'rgba(205,240,255,0.42)');
  ell(c,bcx,cy,rx,ry,g,low&&Math.floor(G.t/8)%2===0?'rgba(255,150,150,0.95)':'rgba(255,255,255,0.85)',3);
  c.lineWidth=3;
  c.strokeStyle='rgba(255,170,235,0.5)';c.beginPath();c.ellipse(bcx,cy,rx-5,ry-5,0,0.25,1.3);c.stroke();
  c.strokeStyle='rgba(140,255,215,0.45)';c.beginPath();c.ellipse(bcx,cy,rx-5,ry-5,0,3.5,4.4);c.stroke();
  ell(c,bcx-rx*0.45,cy-ry*0.48,rx*0.2,ry*0.09,'rgba(255,255,255,0.9)',null,0,-0.7);
  ell(c,bcx+rx*0.55,cy+ry*0.4,4,4,'rgba(255,255,255,0.6)');
  const cracks=Math.floor((1-a)*9);
  c.strokeStyle='rgba(255,255,255,0.9)';c.lineWidth=2;c.lineJoin='round';
  for(let i=0;i<cracks;i++){
    const ang=i*2.39+0.5;let x=bcx+Math.cos(ang)*rx*0.97,y=cy+Math.sin(ang)*ry*0.97;
    c.beginPath();c.moveTo(x,y);
    for(let k=0;k<3;k++){const aa=ang+(k%2?0.7:-0.7);x-=Math.cos(aa)*10;y-=Math.sin(aa)*10;c.lineTo(x,y);}
    c.stroke();
  }
}
