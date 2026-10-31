'use strict';
// メインループ（さいごに よみこむ）
// =====================================================================
//  メインループ（update）
// =====================================================================
// ---------- 一時停止 ----------
const PAUSE_BTN={x:W/2-56,y:10,w:112,h:36};
const PAUSE_ITEMS=['つづける','ステージの さいしょから','タイトルへ もどる'];
function inRect(pt,r){return pt.x>=r.x&&pt.x<=r.x+r.w&&pt.y>=r.y&&pt.y<=r.y+r.h;}
function menuRect(i){return{x:W/2-170,y:H/2-46+i*62,w:340,h:50};}
function updatePauseMenu(){
  const n=PAUSE_ITEMS.length;let choose=-1;
  if(PK.up){G.psel=(G.psel+n-1)%n;sfx('sel');}
  if(PK.down){G.psel=(G.psel+1)%n;sfx('sel');}
  if(PK.ok)choose=G.psel;
  if(G.click)for(let i=0;i<n;i++)if(inRect(G.click,menuRect(i)))choose=i;
  if(choose<0)return;
  G.paused=false;sfx('pause');
  if(choose===1){G.cp=null;loadStage(G.stage);}
  else if(choose===2){G.state='title';playBGM('title');}
}
function update(){
  G.t++;
  if(P.mute){muted=!muted;}
  if(G.state==='title'){if(G.t%2===0)updateParticles();if(P.start||P.jump){audioInit();startGame();}return;}
  if(G.state==='ending'){G.endT++;updateParticles();
    if(G.endT%30===0)sparkle(rand(100,W-100),rand(80,300),6,['#ffe27a','#ffb0c0','#b0e0ff'][G.endT/30%3|0]);
    if(G.endT>90&&(P.start||P.jump)){G.state='title';playBGM('title');}return;}
  if(G.state==='play'){
    const btn=G.click&&inRect(G.click,PAUSE_BTN);
    if(P.pause||btn){G.paused=!G.paused;G.psel=0;sfx('pause');if(btn)G.click=null;}
    else if(G.paused)updatePauseMenu();
  }
  if(G.paused)return;
  if(G.banner&&--G.banner.t<=0)G.banner=null;
  G.shake=G.shake>0.5?G.shake*0.85:0;
  if(G.flash>0)G.flash=Math.max(0,G.flash-0.06);
  if(G.freeze>0){G.freeze--;springPlayer();updateParticles();return;}
  if(G.state==='clear'){updateClear();updateParticles();updateCamera();return;}
  updatePlayer();
  if(G.state!=='play')return;
  updateEnemies();updateBoss();updateProjs();updateItems();updateObjs();updateParticles();updateCamera();
}

// ---------- draw ----------
function draw(){
  ctx.setTransform(SK,0,0,SK,0,0);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(G.state==='title'){drawTitle();return;}
  if(G.state==='ending'){drawEnding();return;}
  const shx=G.shake?rand(-G.shake,G.shake):0,shy=G.shake?rand(-G.shake,G.shake):0;
  drawBG(G.theme,cam.x);
  ctx.save();ctx.translate(-Math.round(cam.x)+shx,-cam.y+shy);
  drawTiles();drawVents();drawSigns();drawItems();
  for(const e of enemies)drawEnemy(e);
  drawBoss();drawProjs();drawPlayer();drawParticles();
  ctx.restore();
  if(lv.dark)drawDarkness(shx,shy);
  if(G.flash>0){ctx.fillStyle=`rgba(255,250,220,${G.flash*0.6})`;ctx.fillRect(0,0,W,H);}
  drawHUD();drawBanner();
  if(player.dead){if(lv.water)txt('ふやけちゃった・・・',W/2,H/2,48,'#eaf6ff','#0a3a6a',undefined,8);else txt('こげちゃった…',W/2,H/2,48,'#fff','#3a1a0a',undefined,8);}
  if(G.state==='clear'){
    const k=Math.min(1,G.clearT/20);
    ctx.save();ctx.translate(W/2,H/2-40);ctx.scale(easeOutBack(k),easeOutBack(k));
    txt('ステージクリア！',0,0,60,'#ffd36a','#7a3a10',undefined,10);ctx.restore();
    if(G.clearT>40)txt('ボーナス +'+G.clearBonus,W/2,H/2+30,26,'#fff','#7a3a10');
    const nx=STAGES[G.stage+1];
    if(G.clearT>90&&nx&&(nx.area||1)!==(STAGES[G.stage].area||1))txt('つぎは '+AREA_NAMES[nx.area||1]+' へ！',W/2,H/2+118,26,'#bff0ff','#0a3a6a');
    if(G.clearT>150&&Math.floor(G.t/25)%2===0)txt('スペース で つぎへ',W/2,H/2+75,20,'#fff','#c0501a');
  }
  if(G.state==='play')drawPauseBtn();
  if(G.paused)drawPauseMenu();
}

// ---------- loop ----------
let last=performance.now(),acc=0;const STEP=1000/60;
function frame(now){
  acc+=Math.min(100,now-last);last=now;let n=0;
  while(acc>=STEP){update();for(const k in P)P[k]=false;for(const k in PK)PK[k]=false;G.click=null;acc-=STEP;if(++n>5){acc=0;break;}}
  draw();requestAnimationFrame(frame);
}
playBGM('title');
requestAnimationFrame(frame);
