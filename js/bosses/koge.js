'use strict';
// ボス：こげこげ大王（1-3 こげこげオーブン城）
defineBoss('koge',{
  hp:30,
  wake:['こげこげ大王 が あらわれた！','へんしんパワーで やっつけろ！'],
  defeat:['こげこげ大王を やっつけた！','ゴールの かごへ いこう！'],
  hudName:'こげこげ大王',hudColors:['#ffd36a','#ff4a2a','#ffb43a'],
  hitColors:['#3a2414','#ff8a3a','#ffd36a'],finishColors:['#fff','#ffd36a','#ff8a3a'],
  attacks:['jump','charge','shoot','jump'],
  summonVy:-7,
  brake(b){b.vx*=0.8;},
  states:{
    idle(b,angry,p){const bcx=b.x+b.w/2,pcx=p.x+p.w/2;b.vx*=0.8;b.dir=pcx<bcx?-1:1;if(b.t>(angry?28:50))bossNext();},
    jump(b,angry,p){
      const bcx=b.x+b.w/2,pcx=p.x+p.w/2;
      const JW=angry?12:18; // ためる時間（縦にちぢむ）
      b.vx*=b.onGround?0.8:1;
      if(b.t===JW){
        // ねらう着地点：プレイヤーが足場の上ならそこ、ときどき足場、ふだんはプレイヤーの足もと
        const ground=arenaFloor(),plats=arenaPlats();let tx=pcx,ty=ground;
        if(p.onGround&&p.y+p.h<ground-8)ty=p.y+p.h;
        else if(plats.length&&Math.random()<0.45){const pl=plats[Math.floor(Math.random()*plats.length)];tx=pl.cx;ty=pl.top;}
        const v=angry?19:17.5,dy=ty-(b.y+b.h);
        const ft=(v+Math.sqrt(Math.max(0,v*v+1.2*dy)))/0.6;
        b.dropT=ty>=ground?1:0; // 地面ねらいのときは足場をすりぬける
        b.vy=-v;b.vx=clamp((tx-bcx)/ft,-9,9);b.sqx=0.78;b.sqy=1.3;dust(bcx,b.y+b.h,6);
      }
      if(b.t>JW+2&&b.onGround){
        b.dropT=0;b.vx=0;b.sqx=1.3;b.sqy=0.72;G.shake=14;b.s=0.6;sfx('thud');dust(b.x+10,b.y+b.h,6,-1.5);dust(b.x+b.w-10,b.y+b.h,6,1.5);
        if(angry)for(const d of[-1,1])projs.push({type:'ember',x:bcx+d*50,y:b.y+b.h-12,vx:d*4.5,vy:0,r:10,life:120,friendly:false,t:0});
        setB('idle');
      }
    },
    charge(b,angry,p){
      const bcx=b.x+b.w/2,pcx=p.x+p.w/2;
      if(b.t<36){b.vx*=0.8;b.jit=(b.t%4<2?2:-2);if(b.t===1){b.dir=pcx<bcx?-1:1;sfx('roar');}}
      else{
        b.jit=0;b.vx=b.dir*(angry?8.5:6.5);if(b.t%5===0)dust(bcx-b.dir*40,b.y+b.h,2,-b.dir);
        if(b.hitWall){G.shake=12;sfx('thud');b.vx=-b.dir*3;b.vy=-6;setB('stun');}
        if(b.t>200)setB('idle');
      }
    },
    stun(b,angry){b.vx*=0.9;if(b.t>(angry?55:85))setB('idle');},
    shoot(b,angry,p){
      const bcx=b.x+b.w/2,pcx=p.x+p.w/2;
      b.vx*=0.8;b.mouth=b.t>=12?1:0;
      if(b.t===24||(angry&&b.t===44)){b.sqx=0.86;b.sqy=0.9;
        const a0=Math.atan2((p.y+p.h/2)-(b.y+40),pcx-(bcx+b.dir*30));
        for(const k of[-0.28,0,0.28])projs.push({type:'ember',x:bcx+b.dir*34,y:b.y+40,vx:Math.cos(a0+k)*4.5,vy:Math.sin(a0+k)*4.5,r:10,life:160,friendly:false,t:0});
        sfx('shoot');
      }
      if(b.t>64){b.mouth=0;setB('idle');}
    },
  },
  dyingTime:110,
  dying(b){
    b.vx=0;b.mouth=1;
    if(b.t%5===0){burst(b.x+rand(0,b.w),b.y+rand(0,b.h),['#ffd36a','#ff8a3a','#3a2414','#fff'],10,5);sfx('pop');G.shake=6;}
  },
  move(b){b.vy=Math.min(b.vy+0.6,12);moveBody(b);},
  draw(b){
    drawKogeBody(b,false);
    if(b.state!=='dying'&&G.t%8===0)addP({type:'smoke',x:b.x+b.w/2+rand(-30,30),y:b.y+10,vx:rand(-0.3,0.3),vy:-0.8,life:40,size:6,color:'rgba(60,40,30,0.35)'});
  },
});

// こげこげ大王の からだ（wet：みずのなかで ふやけて しずむ やられかた）
function drawKogeBody(b,wet){
  const c=ctx,bcx=b.x+b.w/2;
  c.save();c.translate(bcx+(b.jit||0),b.y+b.h);
  if(b.state==='dying'){
    if(wet){const k=1+0.2*(b.soggy||0);c.scale(k*1.06,k*0.96);c.rotate(Math.sin(b.t*0.08)*0.12);}
    else{const k=Math.max(0.05,1-b.t/110);c.scale(k,k);c.rotate(Math.sin(b.t*0.6)*0.15);}
  }
  const sy=b.s,sx=1+(1-b.s)*0.8;c.rotate(b.lean||0);c.scale(sx*(b.sqx||1),sy*(b.sqy||1));
  if(b.hit>0&&b.hit%4<2)c.globalAlpha=0.55;
  const rx=50,h=88,fd=b.dir*6;
  if(!wet||b.onGround){c.fillStyle='rgba(0,0,0,0.25)';c.beginPath();c.ellipse(0,1,rx,6,0,0,7);c.fill();}
  bunPath(c,rx,h);
  const g=c.createLinearGradient(0,-h,0,0);g.addColorStop(0,'#24130a');g.addColorStop(0.5,'#4a2a16');g.addColorStop(1,'#8a5a30');
  c.fillStyle=g;c.fill();
  c.save();c.clip();
  c.strokeStyle='rgba(255,120,40,'+(0.55+Math.sin(G.t*0.15)*0.25)+')';c.lineWidth=2.2;c.lineJoin='round';
  for(const[x0,y0,dx]of[[-34,-70,1],[22,-62,-1],[-12,-30,1],[34,-34,-1]]){c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+dx*6,y0+7);c.lineTo(x0+dx*2,y0+12);c.lineTo(x0+dx*9,y0+20);c.stroke();}
  c.fillStyle='rgba(0,0,0,0.3)';for(const[x0,y0,r]of[[-26,-50,7],[30,-74,5],[10,-18,6]]){c.beginPath();c.arc(x0,y0,r,0,7);c.fill();}
  c.fillStyle='rgba(255,255,255,0.12)';c.beginPath();c.ellipse(-22,-74,14,6,-0.5,0,7);c.fill();
  if(b.soggy){
    c.fillStyle='rgba(225,240,255,'+(0.65*b.soggy)+')';c.fillRect(-60,-100,120,110);
    c.fillStyle='rgba(150,200,240,'+(0.5*b.soggy)+')';for(let i=0;i<14;i++){const[a,q,r]=CRUMB_PTS[i];c.beginPath();c.arc((a*2-1)*rx,-q*h,2+r*4,0,7);c.fill();}
  }
  c.restore();
  bunPath(c,rx,h);c.lineWidth=3;c.strokeStyle='#120804';c.stroke();
  // おうかん
  c.save();c.translate(0,-h+6);c.rotate(Math.sin(G.t*0.05)*0.05);
  c.beginPath();c.moveTo(-20,0);c.lineTo(-22,-20);c.lineTo(-11,-9);c.lineTo(0,-24);c.lineTo(11,-9);c.lineTo(22,-20);c.lineTo(20,0);c.closePath();
  c.fillStyle='#ffcc33';c.fill();c.strokeStyle='#8a5a00';c.lineWidth=2;c.stroke();
  ell(c,0,-7,3.5,3.5,'#ff3a4a');ell(c,-12,-4,2.4,2.4,'#3ab0ff');ell(c,12,-4,2.4,2.4,'#3ab0ff');
  c.restore();
  // かお
  const ey=-52;
  if(b.state==='sleep'){
    c.strokeStyle='#ffb070';c.lineWidth=3;c.lineCap='round';for(const k of[-1,1]){c.beginPath();c.arc(fd+k*17,ey,7,0.15*Math.PI,0.85*Math.PI);c.stroke();}
  }else if(b.state==='stun'||b.state==='dying'){
    c.strokeStyle='#fff';c.lineWidth=2;for(const k of[-1,1]){c.beginPath();for(let i=0;i<20;i++){const a=i*0.6+G.t*0.2*k,r=i*0.45;const xx=fd+k*17+Math.cos(a)*r,yy=ey+Math.sin(a)*r;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}
  }else{
    for(const k of[-1,1]){ell(c,fd+k*17,ey,9,10,'#fff3d0','#120804',2);ell(c,fd+k*17+b.dir*3,ey+1,4,5,'#e0201a');ell(c,fd+k*17+b.dir*3-1,ey-1,1.3,1.3,'#fff');}
    c.strokeStyle='#120804';c.lineWidth=5;c.lineCap='round';for(const k of[-1,1]){c.beginPath();c.moveTo(fd+k*29,ey-15);c.lineTo(fd+k*8,ey-8);c.stroke();}
  }
  if(b.mouth||b.state==='intro'&&b.t>30&&b.t<75){
    c.fillStyle='#3a0a06';c.beginPath();c.ellipse(fd,-24,17,12,0,0,7);c.fill();c.strokeStyle='#120804';c.lineWidth=2;c.stroke();
    c.fillStyle='#fff';for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(fd+i*6-3,-34);c.lineTo(fd+i*6+3,-34);c.lineTo(fd+i*6,-28);c.closePath();c.fill();}
  }else if(b.state!=='sleep'){
    c.strokeStyle='#120804';c.lineWidth=3;c.beginPath();c.moveTo(fd-14,-24);c.lineTo(fd-7,-28);c.lineTo(fd,-24);c.lineTo(fd+7,-28);c.lineTo(fd+14,-24);c.stroke();
  }else{
    c.strokeStyle='#120804';c.lineWidth=2.5;c.beginPath();c.arc(fd,-28,6,0.2*Math.PI,0.8*Math.PI);c.stroke();
  }
  if(b.state==='stun'){c.fillStyle='#8ad0ff';c.beginPath();c.moveTo(rx-6,-80);c.quadraticCurveTo(rx+2,-68,rx-6,-64);c.quadraticCurveTo(rx-14,-68,rx-6,-80);c.fill();}
  c.restore();
  if(b.state==='sleep')txt('ぐうぐう…',bcx+40+Math.sin(G.t*0.05)*4,b.y-10-((G.t*0.3)%14),18,'#fff','#3a1a0a');
}
