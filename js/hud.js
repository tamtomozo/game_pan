'use strict';
// HUD・ポーズがめん・タイトル・エンディング
// ---------- HUD ----------
function drawHUD(){
  const p=player,c=ctx;
  rr(c,10,10,286,78,14);c.fillStyle='rgba(255,248,230,0.88)';c.fill();c.lineWidth=2.5;c.strokeStyle='#c08a4a';c.stroke();
  for(let i=0;i<G.maxHp;i++)drawHeart(30+i*26,30,9.5,i<p.hp);
  c.save();c.translate(36,80);c.scale(0.72,0.72);const bb=Math.sin(G.t*0.12)*0.05;c.scale(1-bb,1+bb);drawBread(c,p.form,{face:1});c.restore();
  txt(FORMS[p.form].name,62,57,18,'#7a3a10',null,'left');
  txt(FORMS[p.form].desc+(p.form!=='plain'?'　↓/C:はきだす':''),62,76,12,'#a0603a',null,'left');
  rr(c,W-200,10,190,58,14);c.fillStyle='rgba(255,248,230,0.88)';c.fill();c.stroke();
  drawGrain(W-178,30,1.1);txt('× '+G.grains,W-160,30,18,'#7a3a10',null,'left');
  txt('スコア '+G.score,W-20,53,16,'#7a3a10',null,'right');
  if(muted)txt('おと なし（M）',W-105,82,12,'#fff','#5a2a0c');
  if(lv.water){
    const a=clamp(p.air/AIR_MAX,0,1),low=a<0.25,fl=low&&Math.floor(G.t/8)%2===0;
    rr(c,10,94,226,30,12);c.fillStyle='rgba(235,250,255,0.88)';c.fill();c.lineWidth=2.5;c.strokeStyle=fl?'#e04a4a':'#5aa8d8';c.stroke();
    ell(c,30,109,9,9,'rgba(170,230,255,0.5)','#fff',2);ell(c,27,106,2.6,1.6,'#fff');
    txt('あわ',58,109,14,'#2a6a9a',null);
    rr(c,80,103,144,12,6);c.fillStyle='#c8dce8';c.fill();
    if(a>0){rr(c,80,103,Math.max(0.5,144*a),12,6);c.fillStyle=low?(fl?'#ff6a6a':'#ff9a9a'):'#5ac8f4';c.fill();}
  }
  if(boss&&boss.state!=='sleep'&&boss.state!=='gone'){
    const bw=360,bx=W/2-bw/2,by=H-38;
    rr(c,bx-8,by-22,bw+16,44,12);c.fillStyle='rgba(30,10,5,0.75)';c.fill();
    const hc=boss.def.hudColors;
    txt(boss.def.hudName,W/2,by-10,13,hc[0],null);
    rr(c,bx,by,bw,12,6);c.fillStyle='#3a1a10';c.fill();
    rr(c,bx,by,Math.max(0.001,bw*boss.hp/boss.max),12,6);const hg=c.createLinearGradient(bx,0,bx+bw,0);hg.addColorStop(0,hc[1]);hg.addColorStop(1,hc[2]);c.fillStyle=hg;c.fill();
  }else if(G.stage===0&&!G.paused){
    txt('←→:いどう　Z:ジャンプ(ながおし:ふんわり)　X:すいこみ/こうげき　↓/C:はきだす　P:ポーズ　M:おと',W/2,H-14,13,'#fff','rgba(70,35,10,0.75)');
  }else if(STAGES[G.stage].waterHint&&!G.paused){
    txt('Z:およぐ(れんだで うえへ・ながおしで ゆっくり)　↓:はやく しずむ　シャボンに さわるか すいこんで あわ ほきゅう',W/2,H-14,13,'#fff','rgba(10,40,80,0.75)');
  }
}
function drawBanner(){
  const b=G.banner;if(!b)return;
  const age=b.max-b.t,k=age<14?easeOutBack(age/14):1,al=b.t<20?b.t/20:1;
  ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,150);ctx.scale(k,k);
  ctx.font=`bold 36px ${FONT}`;const tw=Math.max(ctx.measureText(b.text).width,200);
  rr(ctx,-tw/2-34,-38,tw+68,b.sub?86:64,22);ctx.fillStyle='rgba(255,248,228,0.93)';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#d0883a';ctx.stroke();
  txt(b.text,0,-6,36,'#ff8a2a','#6a2a08',undefined,6);
  if(b.sub)txt(b.sub,0,30,18,'#7a3a10',null);
  ctx.restore();
}
function drawPauseBtn(){
  const r=PAUSE_BTN,c=ctx;
  rr(c,r.x,r.y,r.w,r.h,12);c.fillStyle=G.paused?'rgba(255,211,106,0.95)':'rgba(255,248,230,0.88)';c.fill();c.lineWidth=2.5;c.strokeStyle='#c08a4a';c.stroke();
  c.fillStyle='#7a3a10';c.fillRect(r.x+18,r.y+10,5,16);c.fillRect(r.x+27,r.y+10,5,16);
  txt('ポーズ',r.x+70,r.y+r.h/2+1,16,'#7a3a10',null);
}
function drawPauseMenu(){
  const c=ctx;
  c.fillStyle='rgba(30,15,5,0.55)';c.fillRect(0,0,W,H);
  rr(c,W/2-220,H/2-150,440,330,24);c.fillStyle='rgba(255,248,228,0.97)';c.fill();c.lineWidth=4;c.strokeStyle='#d0883a';c.stroke();
  txt('ポーズちゅう',W/2,H/2-108,36,'#ff8a2a','#6a2a08',undefined,6);
  PAUSE_ITEMS.forEach((s,i)=>{
    const r=menuRect(i),on=i===G.psel;
    rr(c,r.x,r.y,r.w,r.h,14);c.fillStyle=on?'#ffd36a':'#fff';c.fill();c.lineWidth=on?3:2;c.strokeStyle=on?'#c0501a':'#d8b890';c.stroke();
    txt(s,W/2+10,r.y+r.h/2+1,20,on?'#7a2a08':'#8a5a30',null);
    if(on){const b=Math.abs(Math.sin(G.t*0.15));c.save();c.translate(r.x+30,r.y+r.h-8-b*6);c.scale(0.8*(1+(b<0.2?0.12:0)),0.8*(1-(b<0.2?0.12:0)));drawBread(c,player.form,{face:1,happy:true});c.restore();}
  });
  txt('↑↓ えらぶ　Z / エンター けってい　P / エスケープ もどる',W/2,H/2+152,14,'#a0603a',null);
}
function easeOutBack(t){const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);}

// ---------- タイトル / エンディング ----------
function drawBreadRow(y0,big){
  const forms=['curry','anko','plain','melon','wiener'];
  forms.forEach((f,i)=>{
    const a=G.t*0.07+i*0.9,s=Math.abs(Math.sin(a));
    const x=W/2+(i-2)*(big?120:100),y=y0-s*(big?70:50);
    let sy=s<0.25?0.72+s*1.1:1+(s-0.25)*0.12,sx=1/Math.pow(sy,0.85);
    ctx.fillStyle='rgba(60,30,10,0.18)';ctx.beginPath();ctx.ellipse(x,y0+2,22*(1-s*0.4),4,0,0,7);ctx.fill();
    ctx.save();ctx.translate(x,y);const sc=big&&f==='plain'?2.3:1.8;ctx.scale(sc*sx,sc*sy);drawBread(ctx,f,{face:i<2?1:i>2?-1:1,happy:s>0.6,mouth:s>0.8?'open':'smile'});ctx.restore();
  });
}
function drawTitle(){
  drawBG('field',G.t*1.5);
  const bob=Math.sin(G.t*0.05)*4;
  txt('やきたて！',W/2,92+bob,40,'#fff8e0','#a0521c',undefined,8);
  txt('まるパン だいぼうけん',W/2,152+bob,64,'#ffd36a','#7a3a10',undefined,11);
  drawBreadRow(345,true);
  rr(ctx,W/2-330,385,660,108,16);ctx.fillStyle='rgba(255,250,235,0.9)';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#d0a060';ctx.stroke();
  txt('←→ いどう　　Z / スペース ジャンプ（ながおしで ふんわり）',W/2,408,17,'#6a3a10',null);
  txt('X ながおし：ぐざいを すいこんで へんしん　X：こうげき',W/2,436,17,'#6a3a10',null);
  txt('↓ / C：ぐざいを はきだして まるパンに もどる',W/2,464,17,'#6a3a10',null);
  if(Math.floor(G.t/30)%2===0)txt('スペース / エンター で スタート！',W/2,518,24,'#fff','#c0501a');
  drawParticles();
}
// ---------- デバッグメニュー ----------
function drawDebugMenu(){
  const c=ctx;
  drawBG('field',G.t*1.5);c.fillStyle='rgba(30,15,5,0.55)';c.fillRect(0,0,W,H);
  txt('デバッグ：ステージを えらぶ',W/2,50,32,'#ffd36a','#6a2a08',undefined,6);
  const AC={1:'#ffd36a',2:'#9ad8ff',3:'#d8c0a0'};
  STAGES.forEach((s,i)=>{
    const r=debugRect(i),on=i===G.dsel,a=s.area||1;
    rr(c,r.x,r.y,r.w,r.h,12);c.fillStyle=on?'#fff6d8':'rgba(255,248,228,0.85)';c.fill();
    c.lineWidth=on?4:2;c.strokeStyle=on?'#c0501a':'#d8b890';c.stroke();
    rr(c,r.x+8,r.y+6,64,r.h-12,8);c.fillStyle=AC[a]||'#ddd';c.fill();
    txt(stageLabel(i),r.x+40,r.y+r.h/2+1,18,'#5a2a0c',null);
    txt(s.name+(s.boss?'　★ボス':''),r.x+86,r.y+r.h/2+1,18,on?'#7a2a08':'#8a5a30',null,'left');
  });
  txt('↑↓ えらぶ　Z / エンター スタート　T / エスケープ もどる',W/2,H-24,15,'#fff','#5a2a0c');
}
function drawEnding(){
  drawBG('field',G.endT*2);
  txt('ぜんぶ おいしく やけました！',W/2,110,46,'#ffd36a','#7a3a10',undefined,9);
  txt('こげこげ大王を 3かいも やっつけて パンの せかいに へいわが もどった！',W/2,170,20,'#fff','#7a3a10');
  drawBreadRow(360,false);
  rr(ctx,W/2-200,400,400,80,16);ctx.fillStyle='rgba(255,250,235,0.92)';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#d0a060';ctx.stroke();
  txt('スコア  '+G.score,W/2,425,26,'#c0501a',null);
  txt('あつめた こむぎ  '+G.grains+' こ',W/2,458,18,'#7a3a10',null);
  if(G.endT>90&&Math.floor(G.t/30)%2===0)txt('スペース / エンター で タイトルへ',W/2,512,20,'#fff','#c0501a');
  drawParticles();
}
