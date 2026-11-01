'use strict';
// てき：いわやま（defineEnemy の かきかたは js/enemies.js を みてね）
// ズシンいわ(i)：したを とおると ゆれて ドスーン！と おちてくる
// ぺったんいわ(I)：じゅんばんに おちたり あがったりを くりかえす
// どちらも うえには のれる（あがるときは いっしょに のぼれる）。おちてくる したに いると つぶされる
//   wait まつ → shake ゆれる → fall おちる → land じめんで ひとやすみ → rise もとの たかさへ もどる
const ROCK_COLS=['#8a8078','#b8aea0','#5a524a']; // くだけるときの いろ
function rockSees(e,p){ // したに プレイヤーが いる？
  if(p.dead)return false;
  const pcx=p.x+p.w/2;
  return pcx>e.x-26&&pcx<e.x+e.w+26&&p.y>e.y+e.h-4&&p.y<e.y+e.h+8*TS;
}
function rockUpdate(timed){
  return (e,p)=>{
    e.prevY=e.y;e.vx=0;
    if(!e.st){e.st='wait';e.k=timed?Math.floor(hash(e.homeX,3)*80):0;} // となりどうしで タイミングを ずらす
    e.k++;
    switch(e.st){
      case'wait':
        e.y=e.baseY;
        if(timed?e.k>=90:(e.k>30&&rockSees(e,p))){e.st='shake';e.k=0;if(rockOnScreen(e))sfx('rumble');}
        break;
      case'shake':
        if(e.k%5===0)addP({x:e.x+rand(6,e.w-6),y:e.y+e.h,vy:rand(0.5,1.5),life:22,size:2.5,color:'#8a8078',g:0.2});
        if(e.k>=(timed?14:18)){e.st='fall';e.k=0;e.vy=1;}
        break;
      case'fall':
        e.vy=Math.min(e.vy+0.9,13);moveBody(e);
        if(e.onGround){
          e.st='land';e.k=0;e.sqx=1.22;e.sqy=0.8;
          if(rockOnScreen(e)){G.shake=Math.max(G.shake,7);sfx('crush');}
          dust(e.x+6,e.y+e.h,4,-1.2);dust(e.x+e.w-6,e.y+e.h,4,1.2);burst(e.x+e.w/2,e.y+e.h-4,ROCK_COLS,6,3);
        }else if(e.y>lv.rows*TS)e.dead=true;
        break;
      case'land':if(e.k>=(timed?30:55)){e.st='rise';e.k=0;}break;
      case'rise':
        e.y-=timed?2:1.4;
        if(e.y<=e.baseY){e.y=e.baseY;e.st='wait';e.k=0;}
        break;
    }
  };
}
function rockOnScreen(e){return e.x<cam.x+W&&e.x+e.w>cam.x&&e.y<cam.y+H&&e.y+e.h>cam.y;}
// うえに のる／したから ぶつかる／よこから おす。おちてくる ときに したに いたら つぶされる
function rockContact(e,p){
  if(p.x+p.w-3<=e.x+2||p.x+3>=e.x+e.w-2)return; // よこに はなれている
  const pb=p.y+p.h;
  if(p.vy>=0&&p.prevBottom!=null&&p.prevBottom<=e.prevY+8&&pb>=e.y-1&&pb<=e.y+e.h*0.6){
    p.y=e.y-p.h;p.vy=0;p.onGround=true;p.onOneWay=false;p.onDough=false;
    return;
  }
  if(!overlap(phb(),{x:e.x+2,y:e.y+2,w:e.w-4,h:e.h-2}))return;
  const pcx=p.x+p.w/2,ecx=e.x+e.w/2;
  if(e.st==='fall'&&p.y+p.h/2>e.y+e.h*0.5){hurtPlayer(ecx,true);return;}
  if(p.prevBottom-p.h>=e.prevY+e.h-8){p.y=e.y+e.h;if(p.vy<0)p.vy=0;return;} // したから ゴツン
  // よこから：そとへ おしだす（かべが あるときは はんたいがわへ）
  const left=e.x-p.w+3,right=e.x+e.w-3,my=Math.floor((p.y+p.h/2)/TS);
  const blocked=x=>isSolid(tileAt(Math.floor((x+4)/TS),my))||isSolid(tileAt(Math.floor((x+p.w-4)/TS),my));
  let nx=pcx<ecx?left:right;
  if(blocked(nx))nx=nx===left?right:left;
  if(!blocked(nx)){p.x=nx;if((p.vx>0&&nx===left)||(p.vx<0&&nx===right))p.vx=0;}
}
function drawRockBody(c,e,t,pal,moss){
  const sh=e.st==='shake'?rand(-1.6,1.6):0;c.translate(sh,0);
  c.fillStyle='rgba(0,0,0,0.18)';if(e.st==='land'){c.beginPath();c.ellipse(0,0,22,4,0,0,7);c.fill();}
  c.beginPath();
  const P=[[-22,-3],[-23,-22],[-17,-36],[-5,-41],[9,-40],[19,-33],[23,-20],[22,-3],[15,0],[-15,0]];
  P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
  const g=c.createLinearGradient(0,-41,0,0);g.addColorStop(0,pal[0]);g.addColorStop(1,pal[1]);
  c.fillStyle=g;c.fill();c.lineWidth=2.4;c.lineJoin='round';c.strokeStyle=pal[2];c.stroke();
  c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=1.6;
  c.beginPath();c.moveTo(-18,-28);c.lineTo(-12,-24);c.lineTo(-14,-17);c.moveTo(14,-8);c.lineTo(18,-14);c.stroke();
  ell(c,-9,-33,6,2.6,'rgba(255,255,255,0.3)',null,0,-0.3);
  if(moss){c.fillStyle='#6a9a4a';c.beginPath();c.moveTo(-14,-37);c.quadraticCurveTo(-4,-46,10,-40);c.quadraticCurveTo(0,-37,-14,-37);c.fill();}
}
// いわの かお。mood：'sleep' 'calm' 'angry' 'proud'
function drawRockFace(c,e,d,mood){
  const ey=-24,fx=d*2;
  if(mood==='sleep'){
    c.strokeStyle='#2a221c';c.lineWidth=2;c.lineCap='round';
    for(const k of[-1,1]){c.beginPath();c.moveTo(fx+k*8-4,ey);c.lineTo(fx+k*8+4,ey);c.stroke();}
    c.beginPath();c.arc(fx,ey+10,3,0.1*Math.PI,0.9*Math.PI);c.stroke();
    return;
  }
  for(const k of[-1,1]){ell(c,fx+k*8,ey,4.5,mood==='angry'?4:5,'#fff8ea','#2a221c',1.5);ell(c,fx+k*8+d*1.5,ey+0.5,2,2.4,'#1a1410');}
  c.strokeStyle='#2a221c';c.lineWidth=2.6;c.lineCap='round';
  if(mood==='angry'){
    for(const k of[-1,1]){c.beginPath();c.moveTo(fx+k*13,ey-8);c.lineTo(fx+k*4,ey-4);c.stroke();}
    rr(c,fx-8,ey+8,16,7,2);c.fillStyle='#fff8ea';c.fill();c.lineWidth=1.6;c.stroke();
    c.beginPath();for(let i=-1;i<=1;i++){c.moveTo(fx+i*4,ey+8);c.lineTo(fx+i*4,ey+15);}c.stroke();
  }else if(mood==='proud'){
    c.beginPath();c.arc(fx,ey+8,6,0.1*Math.PI,0.9*Math.PI);c.stroke();
  }else{
    for(const k of[-1,1]){c.beginPath();c.moveTo(fx+k*12,ey-8);c.lineTo(fx+k*5,ey-9);c.stroke();}
    c.beginPath();c.moveTo(fx-5,ey+11);c.lineTo(fx+5,ey+11);c.stroke();
  }
}
const ROCK_BASE={w:44,h:40,hp:8,noInhale:true,noStomp:true,colors:ROCK_COLS,contact:rockContact};

defineEnemy('zushin',Object.assign({char:'i',update:rockUpdate(false),
  draw(c,e,d,t){
    const pd=player.x+player.w/2<e.x+e.w/2?-1:1; // プレイヤーを みている
    drawRockBody(c,e,t,['#a89c8e','#6e645a','#3a342e'],true);
    drawRockFace(c,e,pd,e.st==='wait'||e.st==='rise'?'calm':e.st==='land'?'proud':'angry');
  }},ROCK_BASE));

defineEnemy('pettan',Object.assign({char:'I',update:rockUpdate(true),
  draw(c,e,d,t){
    drawRockBody(c,e,t,['#b88a6a','#7a5440','#3e2a1e'],false);
    // おでこの しるし（ぺったんいわ）
    c.strokeStyle='rgba(255,230,200,0.55)';c.lineWidth=2;c.beginPath();c.moveTo(-8,-34);c.lineTo(8,-34);c.moveTo(-5,-30);c.lineTo(5,-30);c.stroke();
    drawRockFace(c,e,1,e.st==='wait'?'sleep':e.st==='land'?'proud':e.st==='rise'?'calm':'angry');
  }},ROCK_BASE));
