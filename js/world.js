'use strict';
// ゲームの じょうたい・ステージの よみこみ・ぶつり・パーティクル
// =====================================================================
//  ゲーム状態
// =====================================================================
const G={state:'title',stage:0,score:0,grains:0,t:0,freeze:0,shake:0,flash:0,banner:null,cp:null,maxHp:5,paused:false,psel:0,click:null,clearT:0,endT:0,theme:'kitchen'};
let lv,player,enemies=[],items=[],projs=[],parts=[],boss=null,signs=[],checks=[],goal=null;
const cam={x:0,y:ROWS*TS-H,minX:0,maxX:0};

function isSolid(t){return t==='#'||t==='B'||t==='~'||t==='L';}
function tileAt(tx,ty){if(tx<0||tx>=lv.w)return'#';if(ty<0||ty>=ROWS)return'.';return lv.t[ty][tx];}
function tileAtP(x,y){return tileAt(Math.floor(x/TS),Math.floor(y/TS));}

function buildRows(chunks){
  const rows=Array(ROWS).fill('');
  for(const s of chunks){
    const ch=s.split('\n').map(l=>l.trim()).filter(l=>l.length);
    const w=Math.max(...ch.map(r=>r.length)),pad=ROWS-ch.length;
    for(let r=0;r<ROWS;r++)rows[r]+=(r<pad?'':ch[r-pad]).padEnd(w,'.');
  }
  return rows;
}
function setBanner(text,sub,t,form){G.banner={text,sub,t,max:t,form};}

function loadStage(i,cp){
  const S=STAGES[i];G.stage=i;G.theme=S.theme;
  const rows=buildRows(S.chunks);
  lv={w:rows[0].length,t:rows.map(r=>r.split('')),wob:{},arenaX:null,arenaCol:null,locked:false,water:!!S.water,dark:!!S.dark,darkK:1,vents:[]};
  enemies=[];items=[];projs=[];parts=[];signs=[];checks=[];goal=null;boss=null;
  let start=null,si=0;
  for(let x=0;x<lv.w;x++)for(let y=0;y<ROWS;y++){
    const c=lv.t[y][x];let clear=true;
    if(c==='P')start={x,y};
    else if(ECHAR[c]){const D=ENEMY[ECHAR[c]];spawnEnemy(ECHAR[c],x*TS+(TS-D.w)/2,(y+1)*TS-D.h);}
    else if(c==='*')items.push({type:'grain',x:x*TS+8,y:y*TS+8,w:16,h:16,t:x*7});
    else if(c==='H')items.push({type:'heart',x:x*TS+5,y:y*TS+5,w:22,h:22,t:0});
    else if(c==='O')items.push({type:'air',x:x*TS+6,y:y*TS+6,w:20,h:20,t:x*5});
    else if(c==='o')lv.vents.push({x:x*TS+16,y:(y+1)*TS,t:(x*37)%150});
    else if(c==='S')signs.push({x:x*TS+16,y:(y+1)*TS,text:S.signs[si++]||''});
    else if(c==='K')checks.push({x:x*TS+16,y:(y+1)*TS,on:false});
    else if(c==='G')goal={x:x*TS+16,y:(y+1)*TS};
    else if(c==='|'){lv.arenaX=x*TS;lv.arenaCol=x;}
    else if(c==='X')boss=makeBoss(S.boss,x,y);
    else clear=false;
    if(clear)lv.t[y][x]=(c==='*'&&x>0&&'<>^'.includes(lv.t[y][x-1]))?lv.t[y][x-1]:'.'; // ながれの なかの こむぎ
  }
  let sx=start.x*TS+4,sy=(start.y+1)*TS-26;
  if(cp){sx=cp.x-12;sy=cp.y-26;for(const k of checks)if(k.x===cp.x)k.on=true;}
  player={x:sx,y:sy,w:24,h:26,vx:0,vy:0,face:1,onGround:false,form:'plain',hp:G.maxHp,inv:0,s:1,sv:0,jumps:2,coyote:0,jbuf:0,dropT:0,
    roll:0,rollCd:0,big:1,rot:0,whip:0,whipHit:new Set(),fireT:0,inhaling:false,blinkT:120,walkT:0,dead:false,deathT:0,springT:0,
    hurtT:0,needRelease:false,lastSafe:{x:sx,y:sy},t:0,air:AIR_MAX};
  cam.minX=0;cam.maxX=lv.w*TS-W;cam.x=clamp(player.x-W/2+80,cam.minX,cam.maxX);
  G.state='play';G.freeze=0;G.paused=false;G.flash=0;
  if(cp)setBanner('もういっかい！','',70);
  else if(i>0&&(STAGES[i-1].area||1)!==(S.area||1))setBanner('エリア'+(S.area||1)+'　'+AREA_NAMES[S.area||1],'ステージ '+stageLabel(i)+'　'+S.name,200);
  else setBanner('ステージ '+stageLabel(i),S.name,160);
  playBGM(S.bgm);
}
function spawnEnemy(type,x,y){
  const D=ENEMY[type];
  const e={type,x,y,w:D.w,h:D.h,vx:0,vy:0,hp:D.hp,dir:-1,t:(Math.random()*60)|0,hit:0,shake:0,active:false,dead:false,suckT:0,thrown:0,rot:0,onGround:false,wind:0,windMax:1,act:'',dash:0,dashSp:0,cool:0,sqx:1,sqy:1,lean:0};
  e.pf=0;
  e.baseY=y;e.homeX=x; // ふわふわ うごく てきの きじゅん
  enemies.push(e);return e;
}
function startGame(){G.score=0;G.grains=0;G.cp=null;loadStage(0);}

// ---------- 物理 ----------
function moveBody(b){
  b.hitWall=0;
  const dx=b.vx+(b.curX||0); // curX：ながれで おされる ぶん
  b.x+=dx;
  let x0=Math.floor(b.x/TS),x1=Math.floor((b.x+b.w-0.01)/TS),y0=Math.floor(b.y/TS),y1=Math.floor((b.y+b.h-0.01)/TS);
  if(dx>0){for(let ty=y0;ty<=y1;ty++)if(isSolid(tileAt(x1,ty))){b.x=x1*TS-b.w;b.vx=0;b.hitWall=1;break;}}
  else if(dx<0){for(let ty=y0;ty<=y1;ty++)if(isSolid(tileAt(x0,ty))){b.x=(x0+1)*TS;b.vx=0;b.hitWall=-1;break;}}
  const prevBottom=b.y+b.h;
  b.y+=b.vy;
  x0=Math.floor(b.x/TS);x1=Math.floor((b.x+b.w-0.01)/TS);y0=Math.floor(b.y/TS);y1=Math.floor((b.y+b.h-0.01)/TS);
  b.onGround=false;b.onDough=false;b.onOneWay=false;
  if(b.vy>0){
    let land=false,solid=false,dough=false;
    for(let tx=x0;tx<=x1;tx++){
      const t=tileAt(tx,y1);
      if(isSolid(t)){land=true;solid=true;if(t==='~')dough=true;}
      else if(t==='='&&!b.dropT&&prevBottom<=y1*TS+1)land=true;
    }
    if(land){b.y=y1*TS-b.h;b.vy=0;b.onGround=true;b.onDough=dough;b.onOneWay=!solid;}
  }else if(b.vy<0){
    for(let tx=x0;tx<=x1;tx++)if(isSolid(tileAt(tx,y0))){b.y=(y0+1)*TS;b.vy=0;break;}
  }
}
function breakAt(x,y,r){
  let hit=false;
  const x0=Math.floor((x-r)/TS),x1=Math.floor((x+r)/TS),y0=Math.floor((y-r)/TS),y1=Math.floor((y+r)/TS);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
    if(ty<0||ty>=ROWS||tx<0||tx>=lv.w)continue;
    if(lv.t[ty][tx]==='B'){
      lv.t[ty][tx]='.';hit=true;
      burst(tx*TS+16,ty*TS+16,['#f0d29a','#c99a5a','#fff0c8'],10,4);sfx('brk');G.shake=Math.max(G.shake,3);
    }
  }
  return hit;
}
function groundAhead(e,dist){
  const fx=e.dir>0?e.x+e.w+dist:e.x-dist;const t=tileAt(Math.floor(fx/TS),Math.floor((e.y+e.h+2)/TS));
  return isSolid(t)||t==='=';
}

// ---------- パーティクル ----------
function addP(o){const q=Object.assign({type:'dot',x:0,y:0,vx:0,vy:0,life:30,size:3,color:'#fff',g:0,drag:1},o);q.max=q.life;parts.push(q);return q;}
function burst(x,y,cols,n=12,sp=4){for(let i=0;i<n;i++){const a=rand(0,6.283),s=rand(sp*0.3,sp);addP({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:(rand(18,34))|0,size:rand(2,4.5),color:cols[i%cols.length],g:0.15,drag:0.96});}}
function sparkle(x,y,n=6,col='#fff8c0'){for(let i=0;i<n;i++){const a=rand(0,6.283),s=rand(1,3.5);addP({type:'star',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:(rand(20,36))|0,size:rand(4,8),color:col,drag:0.93});}}
function ring(x,y,color,size=30){addP({type:'ring',x,y,life:18,size,color});}
function dust(x,y,n=5,dir=0){for(let i=0;i<n;i++)addP({type:'smoke',x:x+rand(-8,8),y:y-rand(0,4),vx:rand(-1.2,1.2)+dir,vy:rand(-1,-0.2),life:(rand(16,26))|0,size:rand(4,7),color:'rgba(255,245,225,0.8)',drag:0.94});}
function bubbles(x,y,n=4,sp=1){for(let i=0;i<n;i++)addP({type:'bub',x:x+rand(-6,6),y:y+rand(-4,4),vx:rand(-0.6,0.6)*sp,vy:rand(-1.6,-0.6)*sp,life:(rand(30,55))|0,size:rand(2,4.5),color:'rgba(235,250,255,0.85)',g:-0.02,drag:0.97});}
function popText(x,y,s,color='#fff'){addP({type:'text',x,y,vy:-1.3,life:50,text:s,color,drag:0.97});}
function addScore(n,x,y){G.score+=n;if(x!=null)popText(x,y,'+'+n,'#fff6b0');}
