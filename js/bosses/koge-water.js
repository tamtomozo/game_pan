'use strict';
// ボス：あわに つつまれた こげこげ大王（2-3 まっくら しんかい）
// あわの たいきゅうど＝ライフ。あわが われると ふやけて しずむ
const bossFloatY=b=>7*TS+Math.sin(b.t*0.05)*18; // ふだん ただよう たかさ
function bossSteer(b,tvx,tvy,k){b.vx+=(tvx-b.vx)*k;b.vy+=(tvy-b.vy)*k;}
defineBoss('kogeWater',{
  hp:30,
  wake:['あわに つつまれた こげこげ大王！','あわを こわせば かちだ！'],
  defeat:['こげこげ大王が ふやけちゃった！','ゴールの かごへ いこう！'],
  hudName:'こげこげ大王の あわ',hudColors:['#bff0ff','#3aa8f4','#bff0ff'],
  hitColors:['#dff6ff','#a8e0ff','#fff'],finishColors:['#fff','#c8f0ff','#ffd36a'],
  attacks:['charge','shoot','slam','charge'],
  summonVy:-5,
  pre(b){b.dropT=1;b.bw=(b.bw||0)*0.92;}, // あしばは すりぬける・あわの ゆれが おさまる
  brake(b){bossSteer(b,0,0,0.1);},
  introMove(b){bossSteer(b,0,(bossFloatY(b)-b.y)*0.03,0.1);},
  onRoar(b){bubbles(b.x+b.w/2,b.y+b.h/2,20,2);},
  onSummon(b){bubbles(b.x+b.w/2+b.dir*30,b.y+30,5);},
  onFinish(b){bubbles(b.x+b.w/2,b.y+b.h/2,30,2.5);},
  states:{
    idle(b,angry,p){
      const bcx=b.x+b.w/2,pcx=p.x+p.w/2;
      b.dir=pcx<bcx?-1:1;
      bossSteer(b,clamp((pcx-bcx)*0.008,-1.2,1.2),(bossFloatY(b)-b.y)*0.03,0.06);
      if(b.t>(angry?40:65))bossNext();
    },
    charge(b,angry,p){ // プレイヤーと おなじ たかさに あわせて とっしん
      const bcx=b.x+b.w/2,bcy=b.y+b.h/2,pcx=p.x+p.w/2,pcy=p.y+p.h/2;
      if(b.t<40){
        if(b.t===1){b.dir=pcx<bcx?-1:1;sfx('roar');}
        b.jit=b.t%4<2?2:-2;
        bossSteer(b,0,(clamp(pcy-b.h/2,2*TS,14*TS-b.h)-b.y)*0.06,0.2);
      }else{
        b.jit=0;b.vy*=0.9;b.vx=b.dir*(angry?8:6.5);
        if(b.t%3===0)bubbles(bcx-b.dir*50,bcy,2,1);
        if(b.hitWall){G.shake=12;sfx('thud');b.vx=-b.dir*3;b.vy=-2;bubbles(bcx+b.dir*60,bcy,10,2);setB('stun');}
        else if(b.t>200)setB('idle');
      }
    },
    stun(b,angry){b.vx*=0.92;b.vy*=0.92;if(b.t>(angry?55:85))setB('idle');},
    shoot(b,angry,p){ // こげあわ を はく
      const bcx=b.x+b.w/2,bcy=b.y+b.h/2,pcx=p.x+p.w/2,pcy=p.y+p.h/2;
      bossSteer(b,0,0,0.1);b.mouth=b.t>=12?1:0;
      if(b.t===24||(angry&&b.t===54)){
        b.sqx=0.86;b.sqy=0.9;const n=angry?5:3,a0=Math.atan2(pcy-(bcy+10),pcx-(bcx+b.dir*40));
        for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*0.38;projs.push({type:'sbub',x:bcx+b.dir*40,y:bcy+10,vx:Math.cos(a)*3,vy:Math.sin(a)*3,r:13,life:220,friendly:false,t:0});}
        sfx('shoot');bubbles(bcx+b.dir*40,bcy+10,6);
      }
      if(b.t>(angry?90:70)){b.mouth=0;setB('idle');}
    },
    slam(b,angry,p){ // うえへ のぼって ドスーン！
      const bcx=b.x+b.w/2,pcx=p.x+p.w/2;
      if(b.t<50)bossSteer(b,clamp((pcx-bcx)*0.04,-5,5),(TS-b.y)*0.05,0.12);
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
    },
  },
  dyingTime:160,
  dying(b){ // あわが われて ふやけていく
    const bcx=b.x+b.w/2,bcy=b.y+b.h/2;
    b.jit=0;b.vx*=0.9;b.vy+=(0.7-b.vy)*0.05;b.mouth=1;b.soggy=Math.min(1,b.t/70);
    if(b.t===1){b.popped=true;sfx('bubpop');G.shake=16;for(let i=0;i<3;i++)ring(bcx,bcy,['#fff','#c8f0ff','#8ad0ff'][i],60+i*25);bubbles(bcx,bcy,40,3);popText(bcx,b.y-30,'パチーン！','#c8f0ff');}
    if(b.t===24)sfx('soggy');
    if(b.t%6===0)bubbles(bcx+rand(-40,40),b.y+rand(0,40),1,0.7);
    moveBody(b);
  },
  move(b){moveBody(b);if(b.y<4){b.y=4;if(b.vy<0)b.vy=0;}},
  hitbox(b){return b.popped?null:{x:b.x+b.w/2-64,y:b.y-32,w:128,h:b.h+40};}, // あわの おおきさ
  draw(b){
    drawKogeBody(b,true);
    drawBossBubble(b);
    if(G.t%20===0)bubbles(b.x+b.w/2+rand(-30,30),b.y+10,1,0.6);
  },
});

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
