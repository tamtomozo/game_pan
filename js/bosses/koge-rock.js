'use strict';
// ボス：いただきの こげこげ大王（3-3 いわやまの いただき）
// つぶそうとしてくる！
//   press    … そらへ とんで きえる → かげが おいかけてくる → ドスーン！（おこると 2かい つづけて）
//   hop      … ぴょん ぴょん ぴょん と 3かい ふみつけに くる
//   rockfall … じめんを たたいて そらから いわを おとす（かげの ところに おちる）
function rockBossShadowY(x,toPlat){ // かげの でる たかさ
  if(!toPlat)return arenaFloor();
  const tx=Math.floor(x/TS);let ty=0;
  while(ty<lv.rows&&!isSolid(tileAt(tx,ty))&&tileAt(tx,ty)!=='=')ty++;
  return ty*TS;
}
function rockBossImpact(b,big){
  const bcx=b.x+b.w/2,by=b.y+b.h;
  G.shake=big?18:10;sfx(big?'crush':'thud');b.sqx=1.32;b.sqy=0.7;b.s=0.6;
  dust(b.x+10,by,big?8:5,-1.6);dust(b.x+b.w-10,by,big?8:5,1.6);
  burst(bcx,by-6,ROCK_COLS,big?14:6,big?5:3);
  if(big)ring(bcx,by-10,'rgba(255,240,210,0.9)',70);
}
defineBoss('kogeRock',{
  hp:30,
  wake:['いただきの こげこげ大王！','つぶされないように にげまわれ！'],
  defeat:['こげこげ大王を やっつけた！','ゴールの かごへ いこう！'],
  hudName:'こげこげ大王',hudColors:['#ffd36a','#ff4a2a','#ffb43a'],
  hitColors:['#3a2414','#ff8a3a','#b8aea0'],finishColors:['#fff','#ffd36a','#b8aea0'],
  attacks:['press','hop','rockfall','press'],
  summonVy:-7,
  brake(b){b.vx*=0.8;},
  crushing:(b,p)=>b.vy>1&&!b.onGround&&p.y+p.h/2>b.y+b.h*0.45, // うえから おちてきた
  pose(b,angry){
    if(b.state==='press'&&b.ph==='crouch'){const k=Math.min(1,b.t/(angry?14:22));return[1+0.28*k,1-0.34*k,0];}
    if(b.state==='hop'&&!b.air){const k=Math.min(1,b.w8/(angry?10:16));return[1+0.2*k,1-0.26*k,0];}
    if(b.state==='rockfall'){const ph=b.t%28;return ph<18?[1-0.08*ph/18,1+0.14*ph/18,0]:null;}
    return null;
  },
  states:{
    idle(b,angry,p){const bcx=b.x+b.w/2,pcx=p.x+p.w/2;b.vx*=0.8;b.dir=pcx<bcx?-1:1;if(b.t>(angry?30:55))bossNext();},
    press(b,angry,p){
      const pcx=p.x+p.w/2,fl=arenaFloor();
      if(b.t===1){b.ph='crouch';b.dir=pcx<b.x+b.w/2?-1:1;}
      if(b.ph==='crouch'){
        b.vx*=0.6;
        if(b.t>=(angry?14:22)){b.ph='up';b.vy=-22;b.vx=0;b.dropT=1;b.sqx=0.72;b.sqy=1.38;dust(b.x+b.w/2,b.y+b.h,8);sfx('bigjump');}
      }else if(b.ph==='up'){
        if(b.y+b.h<cam.y-60){b.ph='aim';b.k=0;b.sx=pcx+rand(-60,60);b.sy=fl;} // かげは プレイヤーの そばに でる
      }else if(b.ph==='aim'){ // そらの うえ：かげが プレイヤーを おいかける
        const lockT=angry?42:62,sp=angry?4.2:3.2; // ふだんは はしれば にげきれる はやさ
        b.k++;b.vy=0;b.y=cam.y-220;
        if(b.k<lockT)b.sx+=clamp(pcx-b.sx,-sp,sp);
        b.sx=clamp(b.sx,lv.arenaX+TS+50,lv.arenaX+29*TS-50);b.x=b.sx-b.w/2;
        if(b.k===lockT){
          b.toPlat=p.onGround&&p.y+p.h<fl-8&&Math.abs(pcx-b.sx)<70; // あしばの うえを ねらう
          b.sy=rockBossShadowY(b.sx,b.toPlat);sfx('fall');
        }
        if(b.k>=lockT+(angry?14:20)){b.ph='drop';b.vy=6;b.dropT=b.toPlat?0:1;}
      }else if(b.ph==='drop'){
        if(b.onGround){
          b.vx=0;b.dropT=0;rockBossImpact(b,true);
          if(angry)for(let i=0;i<2;i++)dropRock(lv.arenaX+rand(3,27)*TS,26+i*14);
          b.ph='done';b.chain=(b.chain||0)+1;setB('stun');
        }
      }
    },
    stun(b,angry){ // じめんに めりこんで めを まわす（チャンス！）
      b.vx*=0.9;
      if(b.t>(angry?48:80)){if(angry&&b.chain<2)setB('press');else{b.chain=0;setB('idle');}}
    },
    hop(b,angry,p){
      const bcx=b.x+b.w/2,pcx=p.x+p.w/2,WT=angry?10:16;
      if(b.t===1){b.n=0;b.air=false;b.w8=0;b.dropT=0;}
      if(b.air){
        if(b.onGround){
          b.air=false;b.w8=0;b.vx=0;rockBossImpact(b,false);
          if(angry)dropRock(clamp(pcx+rand(-70,70),lv.arenaX+2*TS,lv.arenaX+28*TS),28);
          if(b.n>=3)setB('idle');
        }
      }else{
        b.vx*=0.6;b.dir=pcx<bcx?-1:1;
        if(++b.w8>=WT){b.vy=angry?-13:-12;b.vx=clamp((pcx-bcx)/42,-7,7);b.air=true;b.n++;b.sqx=0.8;b.sqy=1.25;dust(bcx,b.y+b.h,5);sfx('jump');}
      }
    },
    rockfall(b,angry,p){ // ドン！ドン！と じめんを たたく たびに いわが ふってくる
      const pcx=p.x+p.w/2;
      b.vx*=0.8;b.mouth=b.t>=8?1:0;
      if(b.t%28===18&&b.t<(angry?100:72)){
        rockBossImpact(b,false);
        dropRock(clamp(pcx+rand(-24,24),lv.arenaX+2*TS,lv.arenaX+28*TS),34); // ひとつは プレイヤーを ねらう
        for(let i=0;i<(angry?2:1);i++)dropRock(lv.arenaX+rand(2,28)*TS,40+i*12);
      }
      if(b.t>(angry?130:100)){b.mouth=0;setB('idle');}
    },
  },
  dyingTime:110,
  dying(b){
    b.vx=0;b.mouth=1;
    if(b.t%5===0){burst(b.x+rand(0,b.w),b.y+rand(0,b.h),['#ffd36a','#ff8a3a','#3a2414','#b8aea0'],10,5);sfx('pop');G.shake=6;}
  },
  move(b){
    if(b.state==='press'&&(b.ph==='up'||b.ph==='aim')){b.y+=b.vy;b.onGround=false;return;} // そらの うえは かべを すりぬける
    const fast=b.state==='press'&&b.ph==='drop';
    b.vy=Math.min(b.vy+(fast?1.2:0.6),fast?22:12);moveBody(b);
  },
  draw(b){
    const c=ctx;
    if(b.state==='press'&&(b.ph==='aim'||b.ph==='drop')){ // かげ
      const lockT=b.ph==='aim'?(b.hp<=b.max/2?42:62):0;
      const k=b.ph==='drop'?clamp(1-(b.sy-(b.y+b.h))/500,0.5,1):clamp(b.k/Math.max(1,lockT),0,1)*0.5;
      const locked=b.ph==='drop'||b.k>=lockT,sx=b.ph==='drop'?b.x+b.w/2:b.sx;
      c.fillStyle='rgba(30,12,6,'+(0.2+0.35*k)+')';c.beginPath();c.ellipse(sx,b.sy-2,30+26*k,7+3*k,0,0,7);c.fill();
      if(locked&&b.ph==='aim'&&Math.floor(G.t/4)%2===0){c.strokeStyle='rgba(255,80,40,0.9)';c.lineWidth=3;c.beginPath();c.ellipse(sx,b.sy-2,60,11,0,0,7);c.stroke();}
      if(b.ph==='aim')txt('!',sx,b.sy-70+Math.sin(G.t*0.3)*4,40,'#ff5a3a','#fff',undefined,6);
    }
    if(b.state==='press'&&b.ph==='aim')return;
    drawKogeBody(b,false);
    if(b.state!=='dying'&&G.t%8===0)addP({type:'smoke',x:b.x+b.w/2+rand(-30,30),y:b.y+10,vx:rand(-0.3,0.3),vy:-0.8,life:40,size:6,color:'rgba(60,40,30,0.35)'});
  },
});
