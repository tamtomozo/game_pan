'use strict';
// はいけい・タイル・くらやみ：きょうつうの しくみ（テーマごとの なかみは js/themes/*.js）
//
// ステージに theme:'sea' のように かく。
// defineTheme('なまえ',{
//   lock:[かべ,ぼう,ふち]                 … ボスべやが しまるときの とびらの いろ
//   bg(c,cx)                             … はいけい（cx は カメラの いち。おくの ものほど ゆっくり うごかす）
//   ground(c,x,y,tx,ty,top,h,h2)         … じめん 1マス（top：うえが あいている  h,h2：マスごとに きまった らんすう）
// })
const THEMES={};
function defineTheme(name,def){THEMES[name]=def;}
function drawBG(theme,cx){THEMES[theme].bg(ctx,cx);}

// ---------- タイル ----------
function drawTiles(){
  const th=THEMES[G.theme],c=ctx;
  const c0=Math.max(0,Math.floor(cam.x/TS)-1),c1=Math.min(lv.w-1,Math.floor((cam.x+W)/TS)+1);
  for(let ty=0;ty<ROWS;ty++)for(let tx=c0;tx<=c1;tx++){
    const t=lv.t[ty][tx];if(t==='.')continue;
    const x=tx*TS,y=ty*TS;
    if(t==='#')drawGround(x,y,tx,ty,th);
    else if(t==='='){
      if(tx===c0||tileAt(tx-1,ty)!=='='){
        let s=tx;while(tileAt(s-1,ty)==='=')s--;let e=tx;while(tileAt(e+1,ty)==='=')e++;
        const bx=s*TS+1,bw=(e-s+1)*TS-2;
        const g=c.createLinearGradient(0,y,0,y+16);g.addColorStop(0,'#c27028');g.addColorStop(0.5,'#e8a050');g.addColorStop(1,'#f6cf8a');
        rr(c,bx,y+1,bw,16,8);c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle='#7a3e12';c.stroke();
        c.strokeStyle='#fbe2b0';c.lineWidth=2.5;c.lineCap='round';
        for(let k=bx+14;k<bx+bw-10;k+=24){c.beginPath();c.moveTo(k-4,y+11);c.quadraticCurveTo(k,y+4,k+6,y+4);c.stroke();}
      }
    }else if(t==='B'){
      rr(c,x+1,y+1,TS-2,TS-2,5);c.fillStyle='#efcf92';c.fill();c.lineWidth=2;c.strokeStyle='#b07e40';c.stroke();
      c.fillStyle='#fff3d0';c.fillRect(x+5,y+4,TS-10,3);
      c.fillStyle='#c79a5a';for(const[dx,dy]of[[10,12],[22,12],[10,23],[22,23],[16,17.5]]){c.beginPath();c.arc(x+dx,y+dy,1.8,0,7);c.fill();}
    }else if(t==='~'){
      const top=tileAt(tx,ty-1)!=='~';
      const g=c.createLinearGradient(0,y,0,y+TS);g.addColorStop(0,'#fff6e2');g.addColorStop(1,'#f2d8a8');
      c.fillStyle=g;
      if(top){
        const wb=(lv.wob[tx]||0),dip=Math.sin(G.t*0.5)*wb*7+wb*5;
        c.beginPath();c.moveTo(x,y+TS);c.lineTo(x,y+6);c.quadraticCurveTo(x+TS/2,y-4+dip,x+TS,y+6);c.lineTo(x+TS,y+TS);c.closePath();c.fill();
        c.strokeStyle='#d8b078';c.lineWidth=2;c.beginPath();c.moveTo(x,y+6);c.quadraticCurveTo(x+TS/2,y-4+dip,x+TS,y+6);c.stroke();
        ell(c,x+10,y+6+dip*0.5,4,1.6,'rgba(255,255,255,.7)');
      }else{c.fillRect(x,y,TS,TS);}
    }else if(t==='>'||t==='<'||t==='^'){
      c.fillStyle='rgba(190,240,255,0.1)';c.fillRect(x,y,TS,TS);
      c.strokeStyle='rgba(235,250,255,0.5)';c.lineWidth=2;c.lineCap='round';
      for(let k=0;k<2;k++){
        const o=(G.t*2.4+hash(tx,ty)*TS+k*16)%TS;c.beginPath();
        if(t==='^'){const xx=x+7+k*17;c.moveTo(xx,y+TS-o);c.lineTo(xx,y+TS-o-9);}
        else{const dd=t==='>'?1:-1,xx=dd>0?x+o:x+TS-o,yy=y+9+k*14;c.moveTo(xx,yy);c.lineTo(xx-dd*9,yy);}
        c.stroke();
      }
    }else if(t==='Q'){
      const bx=x+16,base=y+TS,col=['#ff7a9a','#ffa04a','#c88aff'][(hash(tx,ty)*3)|0],sw=Math.sin(G.t*0.03+tx)*1.5;
      c.strokeStyle=col;c.lineWidth=5;c.lineCap='round';c.lineJoin='round';c.beginPath();
      c.moveTo(bx,base);c.lineTo(bx+sw*0.5,base-30);c.moveTo(bx,base-12);c.lineTo(bx-10,base-24);c.lineTo(bx-12+sw,base-38);
      c.moveTo(bx,base-18);c.lineTo(bx+10,base-30);c.lineTo(bx+9+sw,base-44);c.stroke();
      for(const[px,py]of[[bx+sw*0.5,base-31],[bx-12+sw,base-39],[bx+9+sw,base-45]])ell(c,px,py,3.6,3.6,'rgba(255,255,255,0.55)');
    }else if(t==='Y'){
      const bx=x+16,base=y+TS;c.lineWidth=6;c.lineCap='round';
      for(const[dx,hh,col,ph]of[[-6,58,'#2f9a5a',0],[3,74,'#45b86a',1.3],[9,48,'#2a8a50',2.4]]){
        c.strokeStyle=col;c.beginPath();c.moveTo(bx+dx,base);
        for(let k=1;k<=6;k++)c.lineTo(bx+dx+Math.sin(G.t*0.04+k*0.8+ph+tx)*k*1.3,base-k*hh/6);
        c.stroke();
      }
    }else if(t==='L'){
      const[base,bar,line]=th.lock;
      c.fillStyle=base;c.fillRect(x,y,TS,TS);c.fillStyle=bar;c.fillRect(x+6,y,5,TS);c.fillRect(x+20,y,5,TS);
      c.fillStyle=line;c.fillRect(x,y+TS-3,TS,1);
    }
  }
}
function drawGround(x,y,tx,ty,th){
  const ab=tileAt(tx,ty-1),top=!(ab==='#'||ab==='L');
  th.ground(ctx,x,y,tx,ty,top,hash(tx,ty),hash(tx+7,ty+3));
}

// しんかい：プレイヤーの まわり だけ みえる。ひかる ものは くらやみでも ひかる
function drawDarkness(ox,oy){
  const c=ctx,p=player,sx=x=>x-Math.round(cam.x)+ox,sy=y=>y-cam.y+oy;
  const px=sx(p.x+p.w/2),py=sy(p.y+p.h/2),R=210+Math.sin(G.t*0.05)*6;
  const g=c.createRadialGradient(px,py,40,px,py,R);
  const k=lv.darkK; // ボスせんでは すこし あかるくなる
  g.addColorStop(0,'rgba(2,8,24,0)');g.addColorStop(0.55,'rgba(2,8,24,'+(0.5*k)+')');g.addColorStop(1,'rgba(2,8,24,'+(0.92*k)+')');
  c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalCompositeOperation='lighter';
  const glow=(x,y,r,col)=>{const X=sx(x),Y=sy(y);if(X<-r||X>W+r)return;const gg=c.createRadialGradient(X,Y,0,X,Y,r);gg.addColorStop(0,col);gg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gg;c.fillRect(X-r,Y-r,r*2,r*2);};
  for(const e of enemies){
    const gl=!e.dead&&ENEMY[e.type].glow;
    if(gl){const q=gl(e);glow(q.x,q.y,q.r,q.col);}
  }
  for(const it of items){
    if(it.type==='air')glow(it.x+it.w/2,it.y+it.h/2,32,'rgba(160,230,255,0.4)');
    else if(it.type==='grain')glow(it.x+it.w/2,it.y+it.h/2,16,'rgba(255,220,100,0.3)');
    else glow(it.x+it.w/2,it.y+it.h/2,30,'rgba(255,200,220,0.35)');
  }
  for(const v of lv.vents)glow(v.x,v.y-8,36,'rgba(255,170,200,0.35)');
  for(const q of projs)if(q.type==='fire')glow(q.x,q.y,q.r*2.5,'rgba(255,150,60,0.35)');else if(q.type==='sbub')glow(q.x,q.y,32,'rgba(255,140,60,0.35)');
  if(boss&&boss.state!=='gone')glow(boss.x+boss.w/2,boss.y+boss.h/2,150,'rgba(150,210,255,0.22)');
  for(const k of checks)glow(k.x,k.y-60,50,'rgba(255,220,140,0.3)');
  if(goal)glow(goal.x,goal.y-60,100,'rgba(255,230,160,0.4)');
  c.restore();
}
