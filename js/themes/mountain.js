'use strict';
// テーマ：ゴツゴツ いわやま（defineTheme の かきかたは js/themes.js を みてね）
// のぼるほど（cy が ちいさくなるほど）とおくの やまや くもが したへ さがって みえる
function ridge(c,ox,base,amp,col,f1,f2){
  c.fillStyle=col;c.beginPath();c.moveTo(0,H);
  for(let x=0;x<=W;x+=12){const X=x+ox;c.lineTo(x,base-Math.abs(Math.sin(X*f1))*amp-Math.sin(X*f2)*amp*0.22);}
  c.lineTo(W,H);c.closePath();c.fill();
}
function mountainBG(c,cx,cy,o){
  const up=Math.max(0,lv.rows*TS-H-(cy||0)); // どれだけ のぼったか
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,o.sky[0]);g.addColorStop(0.65,o.sky[1]);g.addColorStop(1,o.sky[2]);
  c.fillStyle=g;c.fillRect(0,0,W,H);
  if(o.sun){
    const[sx,sy,sr,col]=o.sun,yy=sy+up*0.03;
    const sg=c.createRadialGradient(sx,yy,4,sx,yy,sr*3.4);sg.addColorStop(0,col);sg.addColorStop(1,'rgba(255,255,255,0)');
    c.fillStyle=sg;c.fillRect(sx-sr*3.4,yy-sr*3.4,sr*6.8,sr*6.8);ell(c,sx,yy,sr,sr,col);
  }
  // とおくの やまなみ
  ridge(c,cx*0.06+300,330+up*0.08,140,o.far,0.0042,0.013);
  if(o.snow){ // ゆきの ぼうし
    c.save();c.beginPath();c.rect(0,0,W,250+up*0.08);c.clip();ridge(c,cx*0.06+300,330+up*0.08,140,'rgba(255,255,255,0.85)',0.0042,0.013);c.restore();
  }
  // くも（のぼると したに ながれる）
  const oc=cx*0.12+G.t*0.2,span=W+360;
  for(let i=0;i<6;i++){
    const x=(((i*290-oc)%span)+span)%span-180,y=90+(i%3)*50+up*0.3;
    if(y>H+40)continue;
    for(const[dx,dy,r]of[[0,0,30],[28,-12,24],[54,0,28],[26,9,26]])ell(c,x+dx,y+dy,r,r*0.75,o.cloud);
  }
  // ちかくの いわやま
  ridge(c,cx*0.22,430+up*0.22,110,o.mid,0.006,0.021);
  ridge(c,cx*0.4+120,520+up*0.38,90,o.near,0.009,0.027);
  if(o.embers){ // ひのこ（いただき）
    for(let i=0;i<34;i++){
      const x=((i*137-cx*0.5+Math.sin(G.t*0.01+i)*20)%W+W)%W,y=H-((G.t*(0.5+(i%5)*0.15)+i*53)%(H+40));
      c.fillStyle=`rgba(255,${120+(i%4)*30},40,${0.3+(i%3)*0.15})`;c.beginPath();c.arc(x,y,1.3+(i%3),0,7);c.fill();
    }
  }
}
// いわの じめん。o：[いわ, しま, ふち, うえの くさ1, くさ2]
function rockGround(c,x,y,tx,ty,top,h,h2,o){
  c.fillStyle=o[0];c.fillRect(x,y,TS,TS);
  c.fillStyle=o[1];c.fillRect(x,y+6+((ty*5+(tx>>2))%3)*8,TS,3);
  if(h>0.55){ell(c,x+7+h2*18,y+12+h*12,4.5,3,'rgba(255,255,255,0.12)','rgba(0,0,0,0.22)',1);}
  if(h2>0.82){c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=1.4;c.beginPath();c.moveTo(x+4+h*10,y+4);c.lineTo(x+10+h*10,y+14);c.lineTo(x+6+h*10,y+24);c.stroke();}
  if(!isSolid(tileAt(tx-1,ty))){c.fillStyle='rgba(255,255,255,0.08)';c.fillRect(x,y,3,TS);}
  if(!isSolid(tileAt(tx+1,ty))){c.fillStyle='rgba(0,0,0,0.14)';c.fillRect(x+TS-4,y,4,TS);}
  if(top){
    c.fillStyle=o[2];c.fillRect(x,y,TS,9);
    if(o[3]){
      c.fillStyle=o[3];c.fillRect(x,y,TS,6);c.fillStyle=o[4];c.fillRect(x,y,TS,3);
      for(let k=0;k<4;k++){c.fillStyle=o[3];c.beginPath();c.arc(x+4+k*8,y+5,3.4,0,Math.PI);c.fill();}
      if(h>0.88){c.strokeStyle=o[3];c.lineWidth=2;c.lineCap='round';for(const k of[-4,0,4]){c.beginPath();c.moveTo(x+16+k,y);c.lineTo(x+16+k*1.6,y-7);c.stroke();}}
    }else{c.fillStyle='rgba(255,255,255,0.18)';c.fillRect(x,y,TS,2);}
    if(h2>0.9)ell(c,x+8+h*16,y-2,4,3,o[0],'rgba(0,0,0,0.35)',1.2);
  }
}

// ひるの いわやま（3-1）
defineTheme('rocky',{
  lock:['#3a3430','#7a7068','#ffb04a'],
  bg(c,cx,cy){mountainBG(c,cx,cy,{sky:['#5ab4f0','#bfe6ff','#e8f6ff'],sun:[800,80,30,'rgba(255,250,210,0.95)'],far:'#9ab8d8',snow:true,cloud:'rgba(255,255,255,0.9)',mid:'#8c9a80',near:'#6e7a60'});},
  ground(c,x,y,tx,ty,top,h,h2){rockGround(c,x,y,tx,ty,top,h,h2,['#8a7a6a','#7a6a5a','#6a5a4a','#5f9a44','#86c25a']);},
});

// くもの うえの がけ（3-2）
defineTheme('cliff',{
  lock:['#3a3430','#7a7068','#ffb04a'],
  bg(c,cx,cy){mountainBG(c,cx,cy,{sky:['#3a7ad8','#9ad0f8','#fff0d8'],sun:[180,110,26,'rgba(255,245,200,0.95)'],far:'#b0c4e4',snow:true,cloud:'rgba(255,255,255,0.95)',mid:'#a08a74',near:'#82705c'});},
  ground(c,x,y,tx,ty,top,h,h2){rockGround(c,x,y,tx,ty,top,h,h2,['#9a7458','#86624a','#74543e','#6a9a4a','#8cc05e']);},
});

// ゆうやけの いただき（3-3・こげこげ大王の すみか）
defineTheme('summit',{
  lock:['#2a1a14','#6a5a50','#ff8a3a'],
  bg(c,cx,cy){
    mountainBG(c,cx,cy,{sky:['#3a2050','#d8604a','#ffb870'],sun:[700,250,40,'rgba(255,200,120,0.95)'],far:'#7a4a6a',cloud:'rgba(255,190,160,0.55)',mid:'#5a3a3a',near:'#3e2828',embers:true});
    const sg=c.createLinearGradient(0,0,0,160);sg.addColorStop(0,'rgba(40,20,20,0.35)');sg.addColorStop(1,'rgba(40,20,20,0)');c.fillStyle=sg;c.fillRect(0,0,W,160); // けむり
  },
  ground(c,x,y,tx,ty,top,h,h2){
    rockGround(c,x,y,tx,ty,top,h,h2,['#5a4440','#4a3632','#3a2a26']);
    if(top){c.fillStyle='rgba(255,120,40,'+(0.35+0.2*Math.sin(G.t*0.08+tx))+')';c.fillRect(x,y,TS,2);}
    else if(h>0.86)ell(c,x+6+h2*20,y+10+h*14,2.2,1.6,'rgba(255,140,60,'+(0.4+0.3*Math.sin(G.t*0.06+tx))+')');
  },
});
