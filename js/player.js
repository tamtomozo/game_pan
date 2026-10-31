'use strict';
// プレイヤー（まるパン）
// =====================================================================
//  プレイヤー
// =====================================================================
function phb(){const p=player;return{x:p.x+3,y:p.y+4,w:p.w-6,h:p.h-5};}
function rollCircle(){const p=player;return{x:p.x+p.w/2,y:p.y+p.h-16*p.big,r:32*p.big};}
function springPlayer(){
  const p=player;let tgt=1;
  if(!p.onGround)tgt=1+clamp(-p.vy*0.012,-0.1,0.14);
  else if(K.down&&p.form==='plain'&&p.roll<=0&&G.state==='play')tgt=0.72;
  p.sv+=(tgt-p.s)*0.2;p.sv*=0.84;p.s+=p.sv;p.s=clamp(p.s,0.45,1.6);
}
function whipPts(p){
  const ph=24-p.whip,pr=Math.min(1,ph/9),ease=1-Math.pow(1-pr,3);
  const a=-2.2+ease*2.35;let len=48+132*Math.min(1,ph/6);if(ph>15)len*=Math.max(0,p.whip/9);
  const cx=p.x+p.w/2,cy=p.y+p.h*0.55,pts=[];
  for(let i=1;i<=7;i++){const t=i/7,sag=Math.sin(t*Math.PI)*7*(1-ease);pts.push({x:cx+Math.cos(a)*len*t*p.face,y:cy+Math.sin(a)*len*t+sag});}
  return{pts,a};
}

function updatePlayer(){
  const p=player;p.t++;
  if(p.dead){
    p.deathT--;
    if(lv.water){ // ふやけて ゆっくり しずんでいく
      p.vy+=(0.7-p.vy)*0.04;p.y+=p.vy;p.rot=Math.sin(p.deathT*0.07)*0.3;
      if(p.deathT%9===0)bubbles(p.x+p.w/2,p.y,1,0.7);
      if(p.deathT%5===0)addP({x:p.x+p.w/2+rand(-12,12),y:p.y+p.h-rand(0,10),vy:rand(0.3,1),life:30,size:2.5,color:'rgba(190,225,255,0.8)'});
    }else{p.vy=Math.min(p.vy+0.35,8);p.y+=p.vy;p.rot+=0.12;}
    if(p.deathT<=0)loadStage(G.stage,G.cp);return;}
  if(p.inv>0)p.inv--;if(p.dropT>0)p.dropT--;if(p.rollCd>0)p.rollCd--;if(p.springT>0)p.springT--;if(p.hurtT>0)p.hurtT--;
  if(--p.blinkT<-6)p.blinkT=(rand(120,280))|0;
  if(!K.act||P.act)p.needRelease=false;
  const actH=K.act&&!p.needRelease,actP=P.act;
  const f=p.form,move=(K.left?-1:0)+(K.right?1:0),wet=lv.water;
  p.inhaling=f==='plain'&&actH&&p.hurtT<=0;
  const breathing=f==='curry'&&actH&&p.hurtT<=0;

  // はきだす
  if((P.down||P.spit)&&f!=='plain'&&p.hurtT<=0)spit();
  // こうげき開始
  if(actP&&p.hurtT<=0){
    if(f==='anko'&&p.roll<=0&&p.rollCd<=0){p.roll=80;sfx('roll');p.s=0.7;p.sv=0;}
    else if(f==='melon'&&!projs.some(q=>q.type==='boomer')){projs.push({type:'boomer',x:p.x+p.w/2+p.face*16,y:p.y+p.h*0.45,vx:p.face*11,vy:0,r:28,ang:0,friendly:true,t:0});sfx('throw');p.s=0.85;}
    else if(f==='wiener'&&p.whip<=0){p.whip=24;p.whipHit=new Set();sfx('whip');}
  }
  // 横移動
  if(p.roll>0){
    p.roll--;p.vx=p.face*8.5;if(p.roll===0)p.rollCd=18;
    if(p.onGround&&G.t%3===0)dust(p.x+p.w/2-p.face*14,p.y+p.h,1,-p.face);
    const rc=rollCircle();breakAt(rc.x+p.face*rc.r*0.7,rc.y,rc.r*0.75);
  }else if(p.hurtT>0){p.vx*=0.93;}
  else{
    let mx=wet?3:3.8;if(p.inhaling)mx=0.9;else if(breathing)mx=1.3;else if(p.whip>0&&p.onGround)mx=1.6;
    if(move){
      p.vx+=move*(p.onGround?0.6:wet?0.3:0.42);
      if(p.vx>mx)p.vx=Math.max(mx,p.vx-0.8);if(p.vx<-mx)p.vx=Math.min(-mx,p.vx+0.8);
      if(!p.inhaling&&!breathing&&p.whip<=0)p.face=move;
    }else{p.vx*=p.onGround?0.7:wet?0.95:0.92;if(Math.abs(p.vx)<0.1)p.vx=0;}
  }
  // ジャンプ
  if(p.onGround){p.coyote=6;p.jumps=2;}else if(p.coyote>0)p.coyote--;
  if(P.jump)p.jbuf=7;else if(p.jbuf>0)p.jbuf--;
  if(p.jbuf>0&&!p.inhaling&&p.hurtT<=0){
    if(K.down&&p.onGround&&p.onOneWay){p.dropT=14;p.jbuf=0;p.coyote=0;p.y+=2;}
    else if(wet){ // みずのなか：おすたびに ひとかき
      p.vy=p.coyote>0?-6.6:-5.2;p.coyote=0;p.jbuf=0;p.s=1.25;p.sv=0;sfx('swim');bubbles(p.x+p.w/2,p.y+p.h,3);
    }
    else if(p.coyote>0){p.vy=-11;p.coyote=0;p.jbuf=0;p.s=1.32;p.sv=0;sfx('jump');dust(p.x+p.w/2,p.y+p.h,4);}
    else if(P.jump&&p.jumps>0){
      p.jumps--;p.vy=-9;p.jbuf=0;p.s=1.25;p.sv=0;sfx('puff');
      ring(p.x+p.w/2,p.y+p.h,'rgba(255,255,255,0.9)',18);
      for(let i=0;i<4;i++)addP({type:'smoke',x:p.x+p.w/2+rand(-10,10),y:p.y+p.h,vx:rand(-1.5,1.5),vy:rand(0.5,1.5),life:18,size:5,color:'rgba(255,255,255,0.85)',drag:0.92});
    }
  }
  // ながれ
  if(wet){
    const ct=tileAtP(p.x+p.w/2,p.y+p.h/2),tgt=ct==='>'?2.6:ct==='<'?-2.6:0;
    p.curX=(p.curX||0)+(tgt-(p.curX||0))*0.12;
    if(ct==='^')p.vy=Math.max(p.vy-0.55,-4.8);
    if('<>^'.includes(ct)&&G.t%6===0)bubbles(p.x+p.w/2,p.y+p.h/2,1,0.5);
  }
  // 重力
  let g=0.55,maxFall=10;p.floating=false;
  if(wet){
    g=0.2;maxFall=2.8;
    if(p.vy<0&&!K.jump)g=0.32;
    if(K.down&&!p.onGround){g=0.35;maxFall=5;}
    else if(K.jump&&p.vy>0&&p.roll<=0&&p.hurtT<=0){g=0.1;maxFall=1.2;p.floating=true;}
  }else{
    if(p.vy<0&&!K.jump&&p.springT<=0)g=1.1;
    if(K.jump&&p.vy>0&&p.roll<=0&&p.hurtT<=0){g=0.2;maxFall=2.3;p.floating=true;}
  }
  p.vy=Math.min(p.vy+g,maxFall);
  const wasGround=p.onGround,preVy=p.vy;
  p.prevBottom=p.y+p.h;
  moveBody(p);
  if(wet&&p.y<6){p.y=6;if(p.vy<0)p.vy=0;}
  if(p.roll>0&&p.hitWall){p.face*=-1;G.shake=4;sfx('hit');sparkle(p.x+p.w/2-p.face*20,p.y+p.h/2,4);}
  if(p.onGround&&!wasGround){
    p.sv-=Math.min(0.32,0.05+preVy*0.028);
    if(preVy>5){dust(p.x+p.w/2,p.y+p.h,5);sfx('land');}
  }
  if(p.onGround&&p.onDough){
    p.vy=K.jump?-16.5:-14;p.onGround=false;p.springT=40;p.jumps=2;p.s=0.5;p.sv=0;
    const tx=Math.floor((p.x+p.w/2)/TS);lv.wob[tx]=1;lv.wob[tx-1]=Math.max(lv.wob[tx-1]||0,0.6);lv.wob[tx+1]=Math.max(lv.wob[tx+1]||0,0.6);
    sfx('boing');ring(p.x+p.w/2,p.y+p.h,'rgba(255,240,200,0.9)',26);
  }
  if(p.onGround&&!p.onDough)p.lastSafe={x:p.x,y:p.y};
  if(p.y>ROWS*TS+80){p.x=p.lastSafe.x;p.y=p.lastSafe.y-6;p.vy=0;p.vx=0;dust(p.x+p.w/2,p.y+p.h,8);sfx('puff');}
  springPlayer();
  if(p.onGround&&Math.abs(p.vx)>0.3&&p.roll<=0)p.walkT+=Math.abs(p.vx)*0.085;else p.walkT=0;
  p.big+=((p.roll>0?2:1)-p.big)*0.2;
  if(p.roll>0)p.rot+=p.vx/(16*p.big);else p.rot=0;

  // あわ
  if(wet){
    p.air-=AIR_DRAIN;
    if(p.air<AIR_MAX*0.25&&G.t%40===0)sfx('warn');
    if(G.t%70===0)bubbles(p.x+p.w/2,p.y-8,1,0.6);
    if(p.air<=0){popBubble();if(p.dead)return;}
  }
  // ファイヤー
  if(breathing){
    p.fireT++;
    if(p.fireT%3===1)projs.push({type:'fire',x:p.x+p.w/2+p.face*16,y:p.y+p.h*0.5+rand(-3,3),vx:p.face*rand(13,17)+p.vx*0.4,vy:rand(-0.7,0.5),r:12,life:24,max:24,friendly:true,t:0});
    if(p.fireT%10===1)sfx('fire');
  }else p.fireT=0;
  // すいこみ
  if(p.inhaling)doInhale();
  // むち
  if(p.whip>0){
    p.whip--;const ph=24-p.whip;
    if(ph>=4&&ph<=15){
      const{pts}=whipPts(p);
      for(let i=2;i<pts.length;i++){
        const pt=pts[i];breakAt(pt.x,pt.y,20);
        for(const e of enemies){if(!e.dead&&e.active&&!p.whipHit.has(e)&&circleRect(pt.x,pt.y,26,e)){p.whipHit.add(e);damageEnemy(e,3,p.face,4);}}
        if(boss&&!p.whipHit.has(boss)&&bossVulnerable()&&circleRect(pt.x,pt.y,26,bossHB())){p.whipHit.add(boss);hitBoss(3,12);}
      }
    }
  }
}
function doInhale(){
  const p=player,mx=p.x+p.w/2+p.face*10,my=p.y+p.h*0.55,R=270;
  if(G.t%2===0){const sx=mx+p.face*rand(40,R),sy=my+rand(-34,34);addP({type:'wind',x:sx,y:sy,sx,sy,tx:mx,ty:my,life:14,color:'rgba(255,255,255,0.8)'});}
  if(G.t%12===0)sfx('inhale');
  const inCone=(cx,cy)=>{const dx=(cx-mx)*p.face,dy=cy-my;return dx>-14&&dx<R&&Math.abs(dy)<56+dx*0.35;};
  for(const e of enemies){
    if(e.dead||!e.active)continue;
    const cx=e.x+e.w/2,cy=e.y+e.h/2;if(!inCone(cx,cy))continue;
    if(cantInhale(e)){e.shake=3;continue;}
    const dx=mx-cx,dy=my-cy,d=Math.hypot(dx,dy)||1,sp=Math.min(d,2.6+(R-d)*0.075);
    e.x+=dx/d*sp;e.y+=dy/d*sp;e.suckT=3;
    if(d<18){swallow(e);return;}
  }
  for(const it of items){
    if(it.dead)continue;
    const cx=it.x+it.w/2,cy=it.y+it.h/2;if(!inCone(cx,cy))continue;
    const dx=mx-cx,dy=my-cy,d=Math.hypot(dx,dy)||1,sp=Math.min(d,3+(R-d)*0.08);
    it.x+=dx/d*sp;it.y+=dy/d*sp;it.suckT=3;
    if(d<18){if(it.type==='ability'){it.dead=true;sfx('gulp');transform(it.ab);return;}collect(it);}
  }
}
function swallow(e){
  const p=player;e.dead=true;sfx('gulp');
  const ab=ENEMY[e.type].ability;
  if(ab)transform(ab);
  else{addScore(100,p.x+p.w/2,p.y-10);p.s=0.7;p.sv=0;}
}
function transform(ab){
  const p=player;p.form=ab;p.needRelease=true;G.freeze=28;G.flash=1;p.s=1.45;p.sv=0;p.roll=0;p.whip=0;
  const cx=p.x+p.w/2,cy=p.y+p.h/2;ring(cx,cy,'#fff',52);ring(cx,cy,'#ffd36a',36);sparkle(cx,cy,12);
  sfx('transform');setBanner(FORMS[ab].name+' に へんしん！',FORMS[ab].desc,120,ab);
}
function spit(){
  const p=player;
  projs.push({type:'star',ab:p.form,x:p.x+p.w/2+p.face*18,y:p.y+p.h*0.5,vx:p.face*10,vy:0,r:26,life:160,friendly:true,t:0});
  p.form='plain';p.roll=0;p.whip=0;p.s=0.7;p.sv=0;p.vx-=p.face*2;
  sfx('spit');ring(p.x+p.w/2+p.face*16,p.y+p.h/2,'#fff',16);
}
function collect(it){
  const p=player;it.dead=true;const cx=it.x+it.w/2,cy=it.y+it.h/2;
  if(it.type==='grain'){
    G.grains++;G.score+=10;sfx('coin');sparkle(cx,cy,4,'#ffe27a');
    if(G.grains%50===0&&p.hp<G.maxHp){p.hp++;sfx('heal');popText(cx,cy-16,'こむぎ50こ！ +1','#ffb0c0');}
  }else if(it.type==='air'){
    p.air=Math.min(AIR_MAX,p.air+35);sfx('air');ring(cx,cy,'rgba(220,245,255,0.95)',22);bubbles(cx,cy,5);popText(cx,cy-12,'あわ ほきゅう！','#c8f0ff');
  }else if(it.type==='heart'){
    p.hp=Math.min(G.maxHp,p.hp+2);sfx('heal');sparkle(cx,cy,10,'#ffb0c0');popText(cx,cy-10,'げんき +2','#ffb0c0');
  }
}
function popBubble(){
  const p=player,cx=p.x+p.w/2,cy=p.y+p.h/2;
  p.air=AIR_MAX*0.6;sfx('bubpop');ring(cx,cy,'rgba(220,245,255,0.95)',44);bubbles(cx,cy,14,1.6);
  popText(cx,cy-44,'あわが われちゃった！','#c8f0ff');
  p.inv=0;p.roll=0;hurtPlayer(cx-p.face);
}
function hurtPlayer(srcX){
  const p=player;if(p.dead||p.inv>0||p.roll>0||G.state!=='play')return;
  p.hp--;p.inv=100;p.hurtT=16;
  const kx=(p.x+p.w/2<srcX)?-1:1;p.vx=kx*4.5;p.vy=lv.water?-3.5:-6;p.s=0.6;p.sv=0;p.whip=0;
  G.shake=8;sfx('hurt');burst(p.x+p.w/2,p.y+p.h/2,['#fff','#ffd36a'],8,4);
  if(p.form!=='plain'){
    items.push({type:'ability',ab:p.form,x:p.x+1,y:p.y-6,w:22,h:22,vx:-kx*2.5,vy:-8,bounce:-5,life:480,delay:45,t:0});
    p.form='plain';
  }
  if(p.hp<=0){
    p.dead=true;p.rot=0;stopBGM();G.shake=10;
    if(lv.water){p.deathT=150;p.vy=-2;p.s=1;p.sv=0;sfx('soggy');ring(p.x+p.w/2,p.y+p.h/2,'rgba(220,245,255,0.95)',44);bubbles(p.x+p.w/2,p.y+p.h/2,16,1.6);}
    else{p.deathT=120;p.vy=-9;sfx('die');}
  }
}

function drawPlayer(){
  const p=player,f=p.form,B=BREAD[f];
  if(p.inv>0&&!p.dead&&Math.floor(p.inv/4)%2===0&&G.state==='play')ctx.globalAlpha=0.45;
  const cx=p.x+p.w/2,by=p.y+p.h;
  let sy=p.s,sx=1+(1-p.s)*0.85,hop=0;
  if(p.onGround&&p.walkT>0){const ph=Math.sin(p.walkT);hop=Math.abs(ph)*6;const sq=1-Math.max(0,0.35-Math.abs(ph))*0.5;sy*=sq;sx/=sq;}
  if(p.onGround&&Math.abs(p.vx)<=0.3&&!p.dead){const b=Math.sin(G.t*0.09)*0.035;sy*=1+b;sx*=1-b;}
  if(p.inhaling){sx*=1.12+Math.sin(G.t*0.8)*0.02;sy*=0.95;}
  // かげ
  if(p.onGround&&!p.dead){ctx.fillStyle='rgba(60,30,10,0.18)';ctx.beginPath();ctx.ellipse(cx,by+1,B.rx*p.big*(1-hop*0.03),3.2,0,0,7);ctx.fill();}
  // むち
  if(p.whip>0&&f==='wiener')drawWhip(p);
  ctx.save();ctx.translate(cx,by-hop);
  if(p.dead){ctx.translate(0,-B.h/2);ctx.rotate(p.rot);ctx.translate(0,B.h/2);}
  if(p.dead&&lv.water){const k=1+0.3*Math.min(1,1-p.deathT/150);sx*=k*1.08;sy*=k*0.94;}
  if(p.big>1.02||p.roll>0){const k=p.big;ctx.translate(0,-B.h*0.5*k);ctx.rotate(p.rot);ctx.scale(k,k);ctx.translate(0,B.h*0.5);}
  ctx.scale(sx,sy);
  const breathing=f==='curry'&&K.act&&!p.needRelease&&G.state==='play';
  let mouth='smile';if(p.inhaling)mouth='big';else if(breathing||p.whip>0||(f==='plain'&&!p.onGround&&p.floating))mouth='open';
  drawBread(ctx,f,{face:p.face,mouth,blink:p.blinkT<0,hurt:p.hurtT>0,dead:p.dead,burnt:p.dead&&!lv.water,soggy:p.dead&&lv.water,happy:G.state==='clear'});
  ctx.restore();
  if(lv.water&&!p.dead)drawPlayerBubble(p,cx,by-hop,sx,sy);
  ctx.globalAlpha=1;
  if(p.roll>0&&p.onGround){ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=3;for(let i=0;i<3;i++){const yy=by-10-i*14;ctx.beginPath();ctx.moveTo(cx-p.face*(30+i*6),yy);ctx.lineTo(cx-p.face*(50+i*8),yy);ctx.stroke();}}
}
// パンを つつむ あわ（あわゲージで おおきさが かわる）
function drawPlayerBubble(p,cx,by,sx,sy){
  const c=ctx,a=clamp(p.air/AIR_MAX,0,1),low=a<0.25;
  const R=(20+6*a)*p.big,wob=low?Math.sin(G.t*0.5)*2:0;
  const rx=R*(0.85+0.15*sx)+wob,ry=R*(0.85+0.15*sy)-wob,y=by-ry*0.92;
  const g=c.createRadialGradient(cx-rx*0.3,y-ry*0.35,2,cx,y,Math.max(rx,ry));
  g.addColorStop(0,'rgba(255,255,255,0.22)');g.addColorStop(0.7,'rgba(170,225,255,0.1)');g.addColorStop(1,'rgba(205,240,255,0.45)');
  ell(c,cx,y,rx,ry,g,low&&Math.floor(G.t/8)%2===0?'rgba(255,150,150,0.9)':'rgba(255,255,255,0.8)',2);
  c.lineWidth=2;
  c.strokeStyle='rgba(255,170,235,0.5)';c.beginPath();c.ellipse(cx,y,rx-3,ry-3,0,0.25,1.3);c.stroke();
  c.strokeStyle='rgba(140,255,215,0.45)';c.beginPath();c.ellipse(cx,y,rx-3,ry-3,0,3.5,4.4);c.stroke();
  ell(c,cx-rx*0.45,y-ry*0.45,rx*0.2,ry*0.1,'rgba(255,255,255,0.9)',null,0,-0.7);
  ell(c,cx+rx*0.5,y+ry*0.38,2.2,2.2,'rgba(255,255,255,0.6)');
}
function drawWhip(p){
  const{pts,a}=whipPts(p);
  ctx.save();
  for(let i=0;i<pts.length;i++){
    const pt=pts[i],last=i===pts.length-1,rx=last?16:9,ry=last?9:6;
    ctx.beginPath();ctx.ellipse(pt.x,pt.y,rx,ry,a*p.face,0,7);
    ctx.fillStyle=last?'#d0503a':'#c2402c';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle='#5a1a10';ctx.stroke();
    if(last){ctx.fillStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.ellipse(pt.x,pt.y-2,5,1.6,a*p.face,0,7);ctx.fill();}
  }
  ctx.restore();
}
