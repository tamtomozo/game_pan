'use strict';
// てき：きょうつうの しくみ（てき1しゅるいずつの なかみは js/enemies/*.js）
//
// defineEnemy('なまえ',{
//   char:'c', w,h,hp, colors:[はじけるときの いろ],     … マップの きごう・おおきさ・たいりょく
//   ability:'curry'          … すいこむと へんしんできる
//   noInhale / noStomp       … すいこめない / ふめない
//   spiky(e)                 … そのときだけ トゲトゲ（ふめない・すいこめない）
//   ── あるく てき（update が ないとき）──
//   speed, think(e), onWalk(e), afterMove(e), dash:{frames,speed,cool}, noEdgeTurn, stretchInAir
//   ── じぶんで うごく てき ──
//   update(e,player)
//   glow(e)                  … まっくらな ステージで ひかる ところ {x,y,r,col}
//   draw(c,e,d,t)            … あしもとが (0,0)。d は むき、t は じかん
// })
const ENEMY={},ECHAR={};
function defineEnemy(type,def){ENEMY[type]=def;ECHAR[def.char]=type;}

// ---- ふみつけ ----
// 上から落ちてきて当たったときだけ「ふんだ」あつかい（フォークは いたいので だめ）
function isStomp(topY){const p=player;return p.vy>=0&&p.prevBottom!=null&&p.prevBottom<=topY+10;}
function stompBounce(x,y,v=-8){
  const p=player;
  v*=lv.ph.stompMul;
  p.vy=K.jump?v-lv.ph.stompBoost:v;p.jumps=2;p.s=0.62;p.sv=0;p.y=Math.min(p.y,y-p.h);
  sfx('stomp');ring(x,y,'#fff',22);sparkle(x,y,5);dust(x,y,3);
  popText(x,y-20,'ふみっ！','#fff');
}
function damageEnemy(e,dmg,kd,inv=8){
  if(e.dead||e.hit>0)return false;
  e.hp-=dmg;e.hit=inv;
  if(e.hp<=0)killEnemy(e);
  else{sfx('hit');e.vx=kd*2;e.vy=-3;burst(e.x+e.w/2,e.y+e.h/2,ENEMY[e.type].colors,5,3);}
  return true;
}
function killEnemy(e){
  e.dead=true;const cx=e.x+e.w/2,cy=e.y+e.h/2;
  burst(cx,cy,ENEMY[e.type].colors,14,5);sparkle(cx,cy,5);ring(cx,cy,'#fff',26);addScore(100,cx,cy-12);sfx('pop');
}
// ふめない（トゲトゲ）／すいこめない
function isSpiky(e){const D=ENEMY[e.type];return D.noStomp||(D.spiky&&D.spiky(e));}
function cantInhale(e){const D=ENEMY[e.type];return D.noInhale||(D.spiky&&D.spiky(e));}
// ---- よびどうさ（予備動作） ----
// jump:縦にちぢむ  dash:横にちぢんで のけぞる  turn/go:ちょっと止まって ちぢむ
function windup(e,act,frames){e.wind=frames;e.windMax=frames;e.act=act;e.vx=0;}
function playerAhead(e,dist){const p=player;if(p.dead)return false;const dx=(p.x+p.w/2-(e.x+e.w/2))*e.dir;return dx>0&&dx<dist&&Math.abs(p.y+p.h-(e.y+e.h))<40;}
const DASH={frames:40,speed:3.6};
function enemyAct(e){
  const cx=e.x+e.w/2,by=e.y+e.h;
  switch(e.act){
    case'jump':e.vy=-8;e.vx=e.dir*1.7;e.sqx=0.82;e.sqy=1.28;dust(cx,by,3);break;
    case'dash':{const DS=ENEMY[e.type].dash||DASH;e.dash=DS.frames;e.dashSp=DS.speed;e.sqx=1.3;e.sqy=0.8;dust(cx-e.dir*8,by,4,-e.dir*1.5);if(DS.cool)e.cool=DS.cool;break;}
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
  else if(ENEMY[e.type].stretchInAir&&!e.onGround&&e.suckT<=0){tx=0.9;ty=1.12;}
  e.sqx+=(tx-e.sqx)*0.3;e.sqy+=(ty-e.sqy)*0.3;e.lean+=(tl-e.lean)*0.3;
}
// ---- うごきかたの ひながた ----
// そらや みずの なかを いったりきたり（ふわふわ ゆれる）
function flyPatrol(bob,speed){
  return e=>{
    e.y=e.baseY+Math.sin(e.t*0.06)*bob;
    if(e.wind>0){if(--e.wind===0)enemyAct(e);}
    else{
      e.x+=e.dir*speed;
      if((e.x>e.homeX+140&&e.dir>0)||(e.x<e.homeX-140&&e.dir<0))windup(e,'turn',14);
    }
  };
}
// じめんを あるく（はしっこや かべで ふりかえる）
function walkEnemy(e,D){
  if(e.thrown>0)e.thrown--;
  else if(e.wind>0){e.vx=0;if(--e.wind===0)enemyAct(e);}
  else if(e.dash>0){e.dash--;e.vx=e.dir*e.dashSp;if(e.onGround&&e.dash%4===0)dust(e.x+e.w/2-e.dir*e.w/2,e.y+e.h,1,-e.dir);}
  else if(!(D.think&&D.think(e))){e.vx=e.dir*D.speed;if(D.onWalk)D.onWalk(e);}
  e.vy=Math.min(e.vy+0.5,10);
  const vx0=e.vx;moveBody(e);
  if(e.hitWall){if(e.thrown>0){e.dir*=-1;e.vx=-vx0;}else if(e.wind<=0){e.dash=0;windup(e,'turn',10);}}
  if(e.onGround){
    if(e.onDough){e.vy=-9;e.onGround=false;}
    else if(!D.noEdgeTurn&&e.thrown<=0&&e.wind<=0&&!groundAhead(e,2)){e.dash=0;windup(e,'turn',10);}
  }
  if(D.afterMove)D.afterMove(e);
  if(e.y>ROWS*TS+80)e.dead=true;
}
function updateEnemies(){
  const p=player;
  for(const e of enemies){
    if(e.dead)continue;
    if(!e.active){if(e.x<cam.x+W+60&&e.x+e.w>cam.x-60)e.active=true;else continue;}
    e.t++;if(e.hit>0)e.hit--;if(e.shake>0)e.shake--;
    if(e.suckT>0){e.suckT--;continue;}
    if(e.cool>0)e.cool--;
    const D=ENEMY[e.type];
    if(D.update)D.update(e,p);else walkEnemy(e,D);
    enemyPose(e);
    if(!p.dead&&G.state==='play'){
      if(p.roll>0){const rc=rollCircle();if(circleRect(rc.x,rc.y,rc.r,e)){damageEnemy(e,99,p.face);G.shake=Math.max(G.shake,3);continue;}}
      else if(overlap(phb(),{x:e.x+2-e.pf*7,y:e.y+2-e.pf*7,w:e.w-4+e.pf*14,h:e.h-2+e.pf*14})){ // ふくらんだ フグは おおきい
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
  const c=ctx;c.save();
  let x=e.x+e.w/2,y=e.y+e.h;if(e.shake>0)x+=rand(-2,2);
  c.translate(x,y);
  if(e.hit>0&&e.hit%4<2)c.globalAlpha=0.45;
  if(e.suckT>0){c.translate(0,-e.h/2);c.rotate(Math.sin(G.t*0.9)*0.3);c.scale(0.85,1.1);c.translate(0,e.h/2);}
  if(e.wind>0&&e.act==='dash'&&e.wind<8)c.translate(rand(-1,1),0);
  c.rotate(e.lean);c.scale(e.sqx,e.sqy);
  ENEMY[e.type].draw(c,e,e.dir,e.t);
  c.restore();
}
