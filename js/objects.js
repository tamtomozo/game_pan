'use strict';
// とびどうぐ・アイテム・かんばん・ゴール・パーティクル
// =====================================================================
//  とびどうぐ・アイテム・オブジェ
// =====================================================================
function updateProjs(){
  const p=player;
  for(const q of projs){
    if(q.dead)continue;
    q.t++;
    if(q.type==='fire'){
      q.x+=q.vx;q.y+=q.vy;q.vx*=0.94;q.vy-=0.03;q.r+=0.6;q.life--;
      if(q.life<=0)q.dead=true;
      if(isSolid(tileAtP(q.x,q.y))){breakAt(q.x,q.y,12);q.life=Math.min(q.life,2);}
      if(q.t%4===0)addP({type:'smoke',x:q.x,y:q.y,vx:0,vy:-0.6,life:14,size:3,color:'rgba(120,80,60,0.4)'});
    }else if(q.type==='boomer'){
      q.ang+=0.45;
      if(q.t<32){q.x+=q.vx;q.vx*=0.965;}
      else{
        const dx=p.x+p.w/2-q.x,dy=p.y+p.h/2-q.y,d=Math.hypot(dx,dy)||1,s=Math.min(14,5+(q.t-32)*0.25);
        q.x+=dx/d*s;q.y+=dy/d*s;if(d<24||q.t>240||p.dead)q.dead=true;
      }
      breakAt(q.x,q.y,q.r-3);
      if(q.t%3===0)addP({type:'star',x:q.x,y:q.y,life:12,size:4,color:'#fff3b0'});
    }else if(q.type==='star'){
      q.x+=q.vx;q.y+=q.vy;q.life--;
      if(q.t%2===0)addP({type:'star',x:q.x-Math.sign(q.vx)*10,y:q.y+rand(-6,6),vx:-q.vx*0.1,life:16,size:rand(4,7),color:'#fff6b0'});
      const fx=q.x+Math.sign(q.vx)*q.r;
      if(isSolid(tileAtP(fx,q.y))){breakAt(fx,q.y,8);sparkle(q.x,q.y,8);ring(q.x,q.y,'#fff',22);q.dead=true;}
      if(q.life<=0){sparkle(q.x,q.y,6);q.dead=true;}
    }else if(q.type==='ember'){
      q.x+=q.vx;q.y+=q.vy;q.life--;
      if(q.t%3===0)addP({type:'dot',x:q.x,y:q.y,vx:rand(-0.5,0.5),vy:rand(-1,0),life:14,size:3,color:'#ff9a3a'});
      if(q.life<=0||isSolid(tileAtP(q.x,q.y))){q.dead=true;burst(q.x,q.y,['#ff8a3a','#ffd36a'],6,3);}
    }else if(q.type==='sbub'){ // こげあわ：すこしだけ おいかけてくる
      const dx=p.x+p.w/2-q.x,dy=p.y+p.h/2-q.y,d=Math.hypot(dx,dy)||1;
      if(q.t<120){q.vx+=dx/d*0.05;q.vy+=dy/d*0.05;}
      const sp=Math.hypot(q.vx,q.vy);if(sp>3.2){q.vx*=3.2/sp;q.vy*=3.2/sp;}
      q.x+=q.vx;q.y+=q.vy+Math.sin(q.t*0.15)*0.3;q.life--;
      if(q.t%6===0)addP({type:'smoke',x:q.x,y:q.y,vy:-0.5,life:16,size:3,color:'rgba(90,60,50,0.35)'});
      if(q.life<=0||isSolid(tileAtP(q.x,q.y))){q.dead=true;bubbles(q.x,q.y,5);}
    }else if(q.type==='rock'){ // おちてくる いわ（さきに かげで しらせる）
      if(q.warn>0){q.warn--;continue;}
      q.vy=Math.min(q.vy+0.45,11);q.y+=q.vy;q.rot+=0.08;
      if(q.y+q.r>=q.gy||q.y>lv.rows*TS){q.dead=true;rockBreak(q.x,q.gy);}
    }else if(q.type==='wave'){ // すなの しょうげきは
      q.x+=q.vx;q.life--;q.r=15+Math.sin(q.t*0.4)*2;
      if(q.t%3===0)bubbles(q.x,q.y+6,1,1.2);
      if(q.life<=0||isSolid(tileAtP(q.x+Math.sign(q.vx)*q.r,q.y))){q.dead=true;bubbles(q.x,q.y,6);dust(q.x,q.y+12,4);}
    }
    if(q.dead)continue;
    if(q.friendly){
      const dmg={fire:1,boomer:2,star:5}[q.type],inv={fire:6,boomer:14,star:10}[q.type];
      for(const o of projs)if(o.type==='sbub'&&!o.dead&&Math.hypot(o.x-q.x,o.y-q.y)<o.r+q.r){o.dead=true;bubbles(o.x,o.y,6);sfx('pop');}
      for(const e of enemies){
        if(e.dead||!e.active||e.suckT>0)continue;
        if(circleRect(q.x,q.y,q.r,e)){
          if(damageEnemy(e,dmg,Math.sign(q.vx)||p.face,inv)&&q.type==='star'){q.dead=true;sparkle(q.x,q.y,8);break;}
        }
      }
      if(!q.dead&&bossVulnerable()&&circleRect(q.x,q.y,q.r,bossHB())){
        hitBoss(dmg,q.type==='fire'?7:16);
        if(q.type==='star'){q.dead=true;sparkle(q.x,q.y,10);ring(q.x,q.y,'#fff',26);}
      }
    }else if(!p.dead&&circleRect(q.x,q.y,q.r*0.8,phb())){hurtPlayer(q.x,q.crush);q.dead=true;if(q.type==='rock')rockBreak(q.x,q.y+q.r);}
  }
  projs=projs.filter(q=>!q.dead);
}
// そらから いわを おとす。x の したの じめん（あしばも）に かげが でる
function dropRock(x,delay){
  const tx=Math.floor(x/TS);let ty=Math.max(0,Math.floor(cam.y/TS));
  while(ty<lv.rows&&!isSolid(tileAt(tx,ty))&&tileAt(tx,ty)!=='=')ty++;
  projs.push({type:'rock',x,y:cam.y-40,vx:0,vy:0,r:17,warn:delay,warnMax:delay,gy:ty*TS,rot:rand(0,6),crush:true,friendly:false,t:0});
}
function rockBreak(x,y){
  burst(x,y-8,ROCK_COLS,10,4);dust(x,y,5);sfx('crumble');
  if(Math.abs(x-(cam.x+W/2))<W)G.shake=Math.max(G.shake,4);
}
function updateItems(){
  const p=player,hb=phb();
  for(const it of items){
    if(it.dead)continue;
    it.t++;
    if(it.suckT>0)it.suckT--;
    else if(it.type==='air'&&it.rise){
      it.y-=it.rise;it.x+=Math.sin(it.t*0.05)*0.4;
      const ct=tileAtP(it.x+it.w/2,it.y+it.h/2);if(ct==='>')it.x+=1.6;else if(ct==='<')it.x-=1.6;else if(ct==='^')it.y-=1.4;
      if(it.y<-30){it.dead=true;continue;}
    }
    else if(it.type==='ability'){
      if(it.delay>0)it.delay--;
      it.vy=Math.min(it.vy+0.35,8);const vx0=it.vx;moveBody(it);
      if(it.hitWall)it.vx=-vx0*0.8;
      if(it.onGround){if(it.bounce<-1.2){it.vy=it.bounce;it.bounce*=0.6;}it.vx*=0.92;}
      if(--it.life<=0||it.y>lv.rows*TS+40){it.dead=true;dust(it.x+11,it.y+11,6);continue;}
    }
    if(!p.dead&&overlap(it,hb)){
      if(it.type==='ability'){if(p.form==='plain'&&it.delay<=0){it.dead=true;transform(it.ab);}}
      else collect(it);
    }
  }
  items=items.filter(i=>!i.dead);
}
function updateObjs(){
  const p=player;if(p.dead)return;
  const pcx=p.x+p.w/2;
  for(const k of checks){
    if(!k.on&&Math.abs(pcx-k.x)<22&&p.y+p.h>k.y-80&&p.y<k.y){
      k.on=true;G.cp={x:k.x,y:k.y};sfx('check');sparkle(k.x,k.y-60,12,'#ffe27a');popText(k.x,k.y-90,'チェックポイント！','#fff');
      if(p.hp<G.maxHp)p.hp=G.maxHp;
      p.air=AIR_MAX;
    }
  }
  for(const v of lv.vents){
    v.t++;
    const near=Math.abs(v.x-(cam.x+W/2))<W;
    if(near&&v.t%150===0){items.push({type:'air',x:v.x-10,y:v.y-26,w:20,h:20,t:0,rise:0.9});bubbles(v.x,v.y-10,4);}
    else if(near&&v.t%24===0)bubbles(v.x+rand(-6,6),v.y-8,1,0.7);
  }
  if(goal){
    if(goal.appear!=null&&goal.appear<30)goal.appear++;
    else if(overlap(phb(),{x:goal.x-40,y:-400,w:80,h:goal.y+400}))stageClear();
  }
  for(const k in lv.wob){lv.wob[k]*=0.92;if(lv.wob[k]<0.02)delete lv.wob[k];}
  if(lv.dark&&lv.locked)lv.darkK+=(0.3-lv.darkK)*0.02;
}
function stageClear(){
  const p=player;p.curX=0;G.state='clear';G.clearT=0;p.roll=0;p.whip=0;p.vx=0;
  stopBGM();sfx('fanfare');
  const bonus=1000+p.hp*200;G.score+=bonus;G.clearBonus=bonus;
  for(let i=0;i<70;i++)addP({type:'conf',x:cam.x+rand(0,W),y:cam.y-rand(0,120),vx:rand(-1,1),vy:rand(1,3),life:(rand(140,220))|0,size:rand(4,7),
    color:['#ff6a6a','#ffd36a','#7ad0ff','#9ad46e','#ffa8d8'][i%5],g:0.02,drag:0.995,rot:rand(0,6),vr:rand(-0.2,0.2)});
}
function updateClear(){
  const p=player;G.clearT++;
  const ph=lv.ph;
  p.vx*=0.8;p.vy=Math.min(p.vy+ph.clearGrav,ph.clearFall);moveBody(p);
  if(p.onGround&&G.clearT>30&&G.clearT%45===0){p.vy=ph.clearHop;p.s=1.3;p.sv=0;sfx('jump');}
  springPlayer();p.face=1;p.walkT=0;
  if((G.clearT>150&&(P.start||P.jump||P.act))||G.clearT>360){
    if(G.stage<STAGES.length-1){
      const nx=G.stage+1;
      G.carryForm=(STAGES[nx].area||1)===(STAGES[G.stage].area||1)?p.form:'plain'; // おなじ エリアなら パンの かたちを もちこす
      G.cp=null;loadStage(nx);
    }
    else{G.state='ending';G.endT=0;playBGM('title');}
  }
}
function updateParticles(){
  for(const q of parts){
    q.life--;
    if(q.type!=='wind'){q.vy+=q.g;q.vx*=q.drag;q.vy*=q.drag;q.x+=q.vx;q.y+=q.vy;}
    if(q.rot!=null)q.rot+=q.vr||0;
  }
  parts=parts.filter(q=>q.life>0);
  if(parts.length>800)parts.splice(0,parts.length-800);
}
function updateCamera(){
  const p=player;
  if(lv.locked){cam.minX=cam.maxX=lv.arenaX;}
  const tx=clamp(p.x+p.w/2-W/2+p.face*60,cam.minX,cam.maxX);
  cam.x+=(tx-cam.x)*0.1;
  // たてに ながい ステージ：じめんに いるときか、がめんの はしに ちかづいたときだけ うえしたに ついていく
  if(p.onGround||p.y<cam.y+100||p.y+p.h>cam.y+H-120)cam.fy=camFocusY(p);
  cam.y+=(camTargetY()-cam.y)*0.1;
}
function camFocusY(p){return p.y+p.h/2-H*0.64;} // のぼる ステージなので うえを ひろく みせる
function camTargetY(){
  const maxY=lv.rows*TS-H;
  if(lv.rows<=ROWS)return maxY;
  if(lv.locked)return clamp((lv.arenaRow+4)*TS-H,0,maxY); // ボスべやは がめんを とめる
  return clamp(cam.fy,0,maxY);
}

// ---------- アイテム・オブジェ ----------
function drawHeart(x,y,r,full){
  const c=ctx;c.beginPath();c.moveTo(x,y+r*0.95);
  c.bezierCurveTo(x-r*1.7,y-r*0.15,x-r*0.65,y-r*1.35,x,y-r*0.45);
  c.bezierCurveTo(x+r*0.65,y-r*1.35,x+r*1.7,y-r*0.15,x,y+r*0.95);
  c.fillStyle=full?'#ff5068':'#e6d6c4';c.fill();c.lineWidth=2;c.strokeStyle=full?'#8a1a2a':'#a89880';c.stroke();
  if(full){c.fillStyle='rgba(255,255,255,0.6)';c.beginPath();c.ellipse(x-r*0.5,y-r*0.35,r*0.25,r*0.15,-0.6,0,7);c.fill();}
}
function drawGrain(x,y,s=1){
  const c=ctx;c.save();c.translate(x,y);c.scale(s,s);c.rotate(0.5);
  c.beginPath();c.ellipse(0,0,5,8,0,0,7);c.fillStyle='#f5c542';c.fill();c.lineWidth=1.6;c.strokeStyle='#a8741a';c.stroke();
  c.beginPath();c.moveTo(0,-5);c.lineTo(0,5);c.strokeStyle='rgba(168,116,26,.7)';c.lineWidth=1.2;c.stroke();
  c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.ellipse(-2,-3,1.4,2.4,0,0,7);c.fill();
  c.restore();
}
function drawStar4(x,y,s,col){
  const c=ctx;c.fillStyle=col;c.beginPath();
  c.moveTo(x,y-s);c.quadraticCurveTo(x,y,x+s,y);c.quadraticCurveTo(x,y,x,y+s);c.quadraticCurveTo(x,y,x-s,y);c.quadraticCurveTo(x,y,x,y-s);c.fill();
}
function drawItems(){
  for(const it of items){
    const cx=it.x+it.w/2,cy=it.y+it.h/2;
    if(cx<cam.x-40||cx>cam.x+W+40)continue;
    if(it.type==='grain'){drawGrain(cx,cy+Math.sin((G.t+it.t*13)*0.06)*3);if((G.t+it.x)%90<8)drawStar4(cx+6,cy-8,4,'#fff');}
    else if(it.type==='heart'){
      const yy=cy+Math.sin(G.t*0.07)*3;
      rr(ctx,cx-10,yy-6,20,16,4);ctx.fillStyle='rgba(255,255,255,.75)';ctx.fill();ctx.strokeStyle='#c08a6a';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#e8c89a';ctx.fillRect(cx-11,yy-9,22,5);
      drawHeart(cx,yy+2,6.5,true);
    }else if(it.type==='air'){
      const r=it.w/2+Math.sin((G.t+it.t)*0.12)*0.8,yy=cy+(it.rise?0:Math.sin((G.t+it.t)*0.06)*3);
      drawBubble(ctx,cx,yy,r,r,{plain:true});
    }else if(it.type==='ability'){
      if(it.life<120&&it.life%8<4)continue;
      const yy=cy;
      ctx.beginPath();ctx.arc(cx,yy,14,0,7);ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(255,255,255,0.9)';ctx.stroke();
      drawIngredient(ctx,it.ab,cx,yy,0.95);
      drawStar4(cx-7,yy-8,3.5,'#fff');
    }
  }
}
function drawVents(){
  const c=ctx;
  for(const v of lv.vents){
    if(v.x<cam.x-60||v.x>cam.x+W+60)continue;
    const ph=v.t%150,open=ph>125?(ph-125)/25:ph<20?1-ph/20:0;
    c.save();c.translate(v.x,v.y);
    c.beginPath();c.ellipse(0,-6,18,7,0,0,Math.PI);c.closePath();c.fillStyle='#f0a0b4';c.fill();c.lineWidth=2;c.strokeStyle='#a04a64';c.stroke();
    if(open>0){ell(c,0,-8,5,5,'#fff6fa','#c89aaa',1);ell(c,-1.5,-9.5,1.6,1.2,'#fff');}
    c.translate(0,-6-open*9);c.rotate(-open*0.15);
    c.beginPath();c.ellipse(0,0,18,13,0,Math.PI,Math.PI*2);c.closePath();
    const g=c.createLinearGradient(0,-13,0,0);g.addColorStop(0,'#ffd0dc');g.addColorStop(1,'#f090a8');c.fillStyle=g;c.fill();c.strokeStyle='#a04a64';c.lineWidth=2;c.stroke();
    c.strokeStyle='rgba(160,74,100,0.55)';c.lineWidth=1.3;
    for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(k*0.55)*16,-Math.cos(k*0.55)*12);c.stroke();}
    c.restore();
  }
}
function drawSigns(){
  const p=player,pcx=p.x+p.w/2;
  for(const s of signs){
    if(s.x<cam.x-300||s.x>cam.x+W+300)continue;
    const c=ctx;
    c.fillStyle='#8a5a2a';c.fillRect(s.x-3,s.y-26,6,26);
    rr(c,s.x-17,s.y-44,34,24,4);c.fillStyle='#e0a868';c.fill();c.lineWidth=2;c.strokeStyle='#7a4a1e';c.stroke();
    txt('!',s.x,s.y-32,16,'#7a3a10',null);
    if(Math.abs(pcx-s.x)<90&&!p.dead){
      ctx.font=`bold 16px ${FONT}`;const tw=ctx.measureText(s.text).width;
      const bw=tw+28,bx=clamp(s.x-bw/2,cam.x+8,cam.x+W-bw-8),by=s.y-100;
      rr(c,bx,by,bw,36,12);c.fillStyle='rgba(255,252,240,0.96)';c.fill();c.lineWidth=2.5;c.strokeStyle='#a8682a';c.stroke();
      c.beginPath();c.moveTo(s.x-8,by+35);c.lineTo(s.x,by+48);c.lineTo(s.x+8,by+35);c.fillStyle='rgba(255,252,240,0.96)';c.fill();
      txt(s.text,bx+bw/2,by+18,16,'#5a2a0c',null);
    }
  }
  for(const k of checks){
    const c=ctx;c.fillStyle='#8a6a4a';c.fillRect(k.x-2,k.y-72,4,72);ell(c,k.x,k.y-74,4,4,'#ffd36a','#8a5a00',1.5);
    if(k.on){
      const w=Math.sin(G.t*0.15)*3;
      c.beginPath();c.moveTo(k.x+2,k.y-70);c.quadraticCurveTo(k.x+18,k.y-72+w,k.x+34,k.y-64+w);c.quadraticCurveTo(k.x+18,k.y-54-w,k.x+2,k.y-50);c.closePath();
      c.fillStyle='#ff6a5a';c.fill();c.strokeStyle='#8a1a1a';c.lineWidth=1.5;c.stroke();
      c.save();c.translate(k.x+15,k.y-55);c.scale(0.38,0.38);drawBread(c,'plain',{face:1,happy:true});c.restore();
    }else{
      c.beginPath();c.moveTo(k.x+2,k.y-70);c.lineTo(k.x+12,k.y-46);c.lineTo(k.x+2,k.y-44);c.closePath();c.fillStyle='#b8b0a8';c.fill();
    }
  }
  if(goal)drawGoal(goal);
}
function drawGoal(g){
  const c=ctx,k=g.appear!=null?Math.min(1,g.appear/30):1;
  c.save();c.translate(g.x,g.y);c.scale(k,k);
  c.fillStyle='#8a5a2a';c.fillRect(30,-120,5,120);ell(c,32.5,-122,5,5,'#ffd36a','#8a5a00',1.5);
  const w=Math.sin(G.t*0.12)*4;
  c.beginPath();c.moveTo(35,-118);c.quadraticCurveTo(60,-122+w,86,-110+w);c.quadraticCurveTo(60,-96-w,35,-92);c.closePath();
  c.fillStyle='#ff6a5a';c.fill();c.strokeStyle='#8a1a1a';c.lineWidth=2;c.stroke();
  txt('ゴール',58,-106+w*0.4,13,'#fff',null);
  c.save();c.translate(0,-30);
  for(const[x,f,s]of[[-20,'curry',0.7],[0,'melon',0.8],[20,'anko',0.7]]){c.save();c.translate(x,0);c.scale(s,s);drawBread(c,f,{face:1,happy:true});c.restore();}
  c.restore();
  c.beginPath();c.moveTo(-44,-34);c.lineTo(44,-34);c.lineTo(34,0);c.lineTo(-34,0);c.closePath();
  const bg=c.createLinearGradient(0,-34,0,0);bg.addColorStop(0,'#d99a4a');bg.addColorStop(1,'#a8682a');c.fillStyle=bg;c.fill();c.strokeStyle='#6a3a10';c.lineWidth=2.5;c.stroke();
  c.save();c.clip();c.strokeStyle='rgba(106,58,16,.5)';c.lineWidth=1.5;
  for(let y=-28;y<0;y+=7){c.beginPath();c.moveTo(-50,y);c.lineTo(50,y);c.stroke();}
  for(let x=-44;x<50;x+=9){c.beginPath();c.moveTo(x,-34);c.lineTo(x-2,0);c.stroke();}
  c.restore();
  rr(c,-48,-40,96,9,4);c.fillStyle='#c27a32';c.fill();c.stroke();
  for(let i=0;i<6;i++){c.fillStyle=i%2?'#fff':'#e84a4a';c.beginPath();c.moveTo(-40+i*14,-38);c.lineTo(-33+i*14,-38);c.lineTo(-36+i*14,-26);c.closePath();c.fill();}
  c.restore();
  if(k>=1&&G.t%20===0)sparkle(g.x+rand(-40,40),g.y-rand(30,70),2,'#fff6b0');
}
function drawProjs(){
  const c=ctx;
  for(const q of projs){
    if(q.type==='fire'){
      const a=q.life/q.max;c.save();c.globalCompositeOperation='lighter';
      c.globalAlpha=Math.min(1,a*1.4);
      ell(c,q.x,q.y,q.r,q.r,a>0.6?'#ffb030':a>0.3?'#ff6a1a':'#a02a10');
      ell(c,q.x,q.y,q.r*0.55,q.r*0.55,a>0.5?'#fff2a0':'#ffb030');
      c.restore();
    }else if(q.type==='boomer'){
      c.save();c.translate(q.x,q.y);c.rotate(q.ang);c.scale(q.r/14,q.r/14);
      ell(c,0,0,13,13,'#f3d27a','#a8782a',2);
      c.strokeStyle='rgba(168,120,42,.6)';c.lineWidth=1.2;c.beginPath();for(let d=-12;d<=12;d+=6){c.moveTo(d-8,-12);c.lineTo(d+8,12);c.moveTo(d+8,-12);c.lineTo(d-8,12);}c.save();c.beginPath();c.arc(0,0,12,0,7);c.clip();c.stroke();c.restore();
      ell(c,-4,-4,4,2.5,'rgba(255,255,255,.5)');
      c.restore();
    }else if(q.type==='star'){
      c.save();c.translate(q.x,q.y);c.rotate(q.t*0.3);c.scale(q.r/13,q.r/13);
      c.fillStyle='#ffe27a';c.strokeStyle='#c8901a';c.lineWidth=2;c.beginPath();
      for(let i=0;i<10;i++){const r=i%2?7:16,a=i*Math.PI/5-Math.PI/2;i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r):c.moveTo(Math.cos(a)*r,Math.sin(a)*r);}
      c.closePath();c.fill();c.stroke();c.restore();
      drawIngredient(c,q.ab,q.x,q.y,0.7*q.r/13);
    }else if(q.type==='ember'){
      const g=c.createRadialGradient(q.x,q.y,1,q.x,q.y,q.r*1.6);g.addColorStop(0,'#fff0a0');g.addColorStop(0.4,'#ff6a1a');g.addColorStop(1,'rgba(255,60,20,0)');
      c.fillStyle=g;c.beginPath();c.arc(q.x,q.y,q.r*1.6,0,7);c.fill();
      ell(c,q.x,q.y,q.r*0.55,q.r*0.55,'#3a1a10');
    }else if(q.type==='sbub'){
      const g=c.createRadialGradient(q.x-4,q.y-4,1,q.x,q.y,q.r);g.addColorStop(0,'rgba(255,170,90,0.65)');g.addColorStop(0.6,'rgba(90,50,40,0.5)');g.addColorStop(1,'rgba(40,20,15,0.85)');
      ell(c,q.x,q.y,q.r,q.r,g,'rgba(255,140,60,0.85)',2);
      ell(c,q.x-q.r*0.4,q.y-q.r*0.4,q.r*0.25,q.r*0.15,'rgba(255,255,255,0.7)',null,0,-0.7);
    }else if(q.type==='rock'){
      // かげ：おちてくる まえは ちかちか、ちかづくほど こくなる
      const k=q.warn>0?1-q.warn/q.warnMax:1,near=clamp(1-(q.gy-q.y)/420,0,1);
      if(q.warn<=0||Math.floor(q.warn/5)%2===0){c.fillStyle='rgba(40,20,10,'+(0.18+0.3*Math.max(k*0.5,near))+')';c.beginPath();c.ellipse(q.x,q.gy-2,10+12*Math.max(k*0.6,near),4,0,0,7);c.fill();}
      if(q.warn<=0){c.save();c.translate(q.x,q.y);c.rotate(q.rot);drawRockLump(c,q.r);c.restore();}
    }else if(q.type==='wave'){
      ell(c,q.x,q.y,q.r*1.25,q.r,'rgba(240,220,170,0.8)','rgba(255,255,255,0.85)',2);
      for(let i=0;i<3;i++){const a=q.t*0.3+i*2.1;ell(c,q.x+Math.cos(a)*q.r*0.9,q.y-6+Math.sin(a)*q.r*0.6,3.5,3.5,null,'rgba(255,255,255,0.8)',1.5);}
      ell(c,q.x-q.r*0.4,q.y-q.r*0.4,q.r*0.3,q.r*0.15,'rgba(255,255,255,0.7)');
    }
  }
}
// ちいさな いわの かたまり（ボスの いわおとし）
function drawRockLump(c,r){
  c.beginPath();
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,rr=r*(0.82+0.18*((i*37)%5)/4);i?c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}
  c.closePath();
  const g=c.createRadialGradient(-r*0.3,-r*0.4,2,0,0,r);g.addColorStop(0,'#c8bcae');g.addColorStop(1,'#6a6058');
  c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle='#3a342e';c.stroke();
  c.strokeStyle='rgba(58,52,46,0.6)';c.lineWidth=1.5;c.beginPath();c.moveTo(-r*0.3,-r*0.1);c.lineTo(r*0.1,r*0.2);c.lineTo(r*0.4,r*0.05);c.stroke();
}
function drawParticles(){
  const c=ctx;
  for(const q of parts){
    const a=Math.max(0,q.life/q.max);c.globalAlpha=Math.min(1,a*1.3);
    switch(q.type){
      case'dot':c.fillStyle=q.color;c.beginPath();c.arc(q.x,q.y,q.size*(0.4+a*0.6),0,7);c.fill();break;
      case'ring':c.strokeStyle=q.color;c.lineWidth=3*a+0.5;c.beginPath();c.arc(q.x,q.y,q.size*(1-a)+4,0,7);c.stroke();break;
      case'star':drawStar4(q.x,q.y,q.size*(0.4+a*0.6),q.color);break;
      case'text':txt(q.text,q.x,q.y,16,q.color,'#5a2a0c');break;
      case'smoke':c.fillStyle=q.color;c.beginPath();c.arc(q.x,q.y,q.size*(1.6-a*0.8),0,7);c.fill();break;
      case'wind':{const k=1-a,x=lerp(q.sx,q.tx,k),y=lerp(q.sy,q.ty,k);c.strokeStyle=q.color;c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(x+(q.tx-q.sx)*0.18,y+(q.ty-q.sy)*0.18);c.stroke();break;}
      case'bub':c.strokeStyle=q.color;c.lineWidth=1.5;c.beginPath();c.arc(q.x,q.y,q.size,0,7);c.stroke();ell(c,q.x-q.size*0.35,q.y-q.size*0.35,q.size*0.3,q.size*0.3,'rgba(255,255,255,0.8)');break;
      case'conf':c.save();c.translate(q.x,q.y);c.rotate(q.rot);c.fillStyle=q.color;c.fillRect(-q.size/2,-q.size/4,q.size,q.size/2);c.restore();break;
    }
  }
  c.globalAlpha=1;
}
