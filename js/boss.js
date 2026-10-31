'use strict';
// ボス：きょうつうの しくみ（ボスごとの なかみは js/bosses/*.js）
//
// ステージに boss:'なまえ' と かいて、マップの X の ばしょに でてくる（| から さきが ボスべや）。
// defineBoss('なまえ',{
//   hp, wake:[でてきたときの バナー,サブ], defeat:[たおしたときの バナー,サブ],
//   hudName, hudColors:[なまえの いろ, バーの いろ1, バーの いろ2], hitColors:[あたったときの いろ],
//   finishColors:[きえるときの わの いろ], attacks:['charge',...]（idle の あとに えらぶ）,
//   summonVy                  … こぶんを なげる いきおい
//   pre(b)                    … まいフレーム さいしょに
//   brake(b)                  … こぶんを だすときの ブレーキ
//   introMove(b), onRoar(b), onSummon(b,e), onFinish(b)
//   states:{idle(b,angry,p), ...}  … こうげき ごとの うごき
//   dying(b), dyingTime       … やられている あいだ と その ながさ
//   move(b)                   … いどうと あたりはんてい
//   hitbox(b)                 … ないときは からだの しかく
//   draw(b)
// })
const BOSSES={};
function defineBoss(name,def){BOSSES[name]=def;}
function makeBoss(name,tx,ty){
  const D=BOSSES[name];
  return{def:D,x:tx*TS-34,y:(ty+1)*TS-92,w:100,h:92,vx:0,vy:0,hp:D.hp,max:D.hp,state:'sleep',t:0,dir:-1,hit:0,s:1,sv:0,mouth:0,jit:0,dropT:0,onGround:true,sqx:1,sqy:1,lean:0};
}
function bossHB(){const b=boss,h=b.def.hitbox&&b.def.hitbox(b);return h||{x:b.x+8,y:b.y+10,w:b.w-16,h:b.h-10};}
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
  burst(b.x+b.w/2,b.y+b.h/2,b.def.hitColors,8,5);b.bw=1;popText(b.x+b.w/2,b.y-6,'-'+d,'#ffd36a');
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
// つぎの こうげきを えらぶ（へんしんできる ぐざいが ないときは こぶんを だす）
function bossNext(){
  const b=boss,p=player;
  const minions=enemies.filter(e=>!e.dead&&ENEMY[e.type].ability).length;
  const groundAb=items.some(i=>i.type==='ability');
  if(p.form==='plain'&&minions===0&&!groundAb){setB('summon');return;}
  const opts=b.def.attacks.slice();if(minions<2)opts.push('summon');
  let s=opts[Math.floor(Math.random()*opts.length)];
  if(s===b.last&&Math.random()<0.6)s=opts[(opts.indexOf(s)+1)%opts.length];
  b.last=s;setB(s);
}
// ---- どのボスも おなじ うごき ----
function bossIntro(b,D){
  if(D.introMove)D.introMove(b);
  if(b.t===30){b.s=1.35;b.mouth=1;sfx('roar');G.shake=14;if(D.onRoar)D.onRoar(b);}
  if(b.t===75)b.mouth=0;
  if(b.t>100)setB('idle');
}
function bossSummon(b,D){ // へんしんできる こぶんを なげる
  D.brake(b);b.mouth=b.t>=12?1:0;
  if(b.t===25||b.t===45){
    b.sqx=0.88;b.sqy=1.22;
    const tp=ABILS[Math.floor(Math.random()*4)],E=ENEMY[tp];
    const e=spawnEnemy(tp,b.x+b.w/2+b.dir*30-E.w/2,b.y+20);
    e.vx=b.dir*rand(2.5,4.5);e.vy=D.summonVy;e.thrown=40;e.dir=b.dir;e.active=true;sfx('spit');
    if(D.onSummon)D.onSummon(b,e);
  }
  if(b.t>65){b.mouth=0;setB('idle');}
}
function bossDefeated(b,D){ // きえて ゴールが でる
  b.state='gone';
  const cx=b.x+b.w/2,cy=b.y+b.h/2;
  for(let i=0;i<5;i++)ring(cx,cy,D.finishColors[i%3],40+i*20);
  sparkle(cx,cy,24);
  if(D.onFinish)D.onFinish(b);
  goal={x:lv.arenaX+15*TS,y:14*TS,appear:0};
  sfx('transform');setBanner(D.defeat[0],D.defeat[1],170);playBGM(STAGES[G.stage].bgm);
}
function updateBoss(){
  const b=boss;if(!b||b.state==='gone')return;const p=player,D=b.def;
  b.t++;
  if(D.pre)D.pre(b);
  if(b.state==='sleep'){
    if(lv.arenaX!=null&&p.x>lv.arenaX+64&&!p.dead){lockArena();setB('intro');playBGM('boss');setBanner(D.wake[0],D.wake[1],150);}
    return;
  }
  if(b.hit>0)b.hit--;
  b.sv+=(1-b.s)*0.15;b.sv*=0.85;b.s+=b.sv;
  const angry=b.hp<=b.max/2;
  if(b.state==='dying'){D.dying(b);if(b.t>D.dyingTime)bossDefeated(b,D);return;}
  if(b.state==='intro')bossIntro(b,D);
  else if(b.state==='summon')bossSummon(b,D);
  else D.states[b.state](b,angry,p);
  bossPose(angry);
  D.move(b);
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
function drawBoss(){const b=boss;if(!b||b.state==='gone')return;b.def.draw(b);}
