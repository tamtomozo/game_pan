'use strict';
// おと：こうかおん と BGM
// ---------- audio ----------
let AC=null,master=null,muted=false,noiseBuf=null;
function audioInit(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  try{
    AC=new(window.AudioContext||window.webkitAudioContext)();
    master=AC.createGain();master.gain.value=0.4;master.connect(AC.destination);
    noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);
    const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  }catch(e){AC=null;}
}
function tone(f,dur,type='square',vol=0.1,slide=null,delay=0,at=null){
  if(!AC||muted)return;
  const t=(at!=null?at:AC.currentTime)+delay;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol,t+0.006);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+0.05);
}
function noise(dur,vol=0.1,freq=1000,delay=0){
  if(!AC||muted)return;
  const t=AC.currentTime+delay,s=AC.createBufferSource();s.buffer=noiseBuf;
  const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=0.8;
  const g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(master);s.start(t,Math.random()*0.5);s.stop(t+dur+0.05);
}
const mf=m=>440*Math.pow(2,(m-69)/12);
const SFX={
  jump(){tone(330,0.13,'square',0.07,700);},
  pause(){tone(880,0.07,'square',0.07);tone(660,0.1,'square',0.07,null,0.07);},
  sel(){tone(1000,0.05,'square',0.05);},
  puff(){tone(520,0.1,'triangle',0.12,820);noise(0.08,0.05,2500);},
  land(){tone(170,0.09,'sine',0.18,80);},
  stomp(){tone(260,0.12,'square',0.1,620);noise(0.06,0.08,1800);},
  boing(){tone(150,0.38,'sine',0.28,560);tone(75,0.32,'triangle',0.12,280);},
  inhale(){noise(0.14,0.06,800);},
  gulp(){tone(320,0.08,'sine',0.22,120);tone(220,0.1,'sine',0.18,90,0.08);},
  transform(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,0.13,'square',0.07,null,i*0.055));},
  fire(){noise(0.16,0.09,500);tone(90,0.12,'sawtooth',0.04,60);},
  roll(){tone(110,0.45,'sawtooth',0.06,55);noise(0.3,0.05,300);},
  throw(){tone(700,0.16,'triangle',0.1,330);},
  whip(){noise(0.08,0.12,3200);tone(950,0.08,'sine',0.06,300);},
  spit(){tone(640,0.13,'square',0.09,180);},
  pop(){tone(820,0.09,'sine',0.15,1500);noise(0.05,0.06,4000);},
  hit(){tone(230,0.08,'square',0.1,110);},
  hurt(){tone(420,0.28,'sawtooth',0.11,90);},
  coin(){tone(988,0.06,'square',0.06);tone(1319,0.12,'square',0.06,null,0.06);},
  brk(){noise(0.16,0.16,1400);tone(300,0.07,'square',0.05,150);},
  heal(){[660,880,1175].forEach((f,i)=>tone(f,0.12,'triangle',0.12,null,i*0.07));},
  check(){[784,988,1175,1568].forEach((f,i)=>tone(f,0.12,'square',0.06,null,i*0.07));},
  bosshit(){tone(160,0.16,'square',0.14,70);noise(0.1,0.1,900);},
  thud(){tone(85,0.32,'sine',0.32,38);noise(0.22,0.14,260);},
  roar(){tone(120,0.7,'sawtooth',0.13,60);tone(90,0.7,'square',0.06,50);},
  shoot(){tone(300,0.16,'sawtooth',0.07,120);},
  die(){[600,480,380,300,220].forEach((f,i)=>tone(f,0.14,'square',0.08,null,i*0.11));},
  soggy(){[700,560,450,360,290].forEach((f,i)=>tone(f,0.18,'sine',0.14,f*0.7,i*0.13));noise(0.5,0.05,600,0.1);},
  swim(){tone(380,0.12,'sine',0.1,560);noise(0.06,0.03,3000);},
  air(){tone(600,0.08,'sine',0.14,1200);tone(900,0.1,'sine',0.1,1600,0.06);},
  bubpop(){tone(900,0.08,'sine',0.18,250);noise(0.1,0.12,3500);},
  warn(){tone(880,0.07,'square',0.05);tone(660,0.07,'square',0.05,null,0.09);},
  rumble(){noise(0.3,0.07,350);tone(60,0.25,'triangle',0.08,45);},
  crush(){tone(70,0.45,'sine',0.38,30);noise(0.32,0.2,220);noise(0.16,0.12,1300,0.04);},
  squash(){tone(320,0.22,'sawtooth',0.1,70);},
  crumble(){noise(0.2,0.13,700);tone(150,0.1,'square',0.05,70);},
  fall(){tone(1500,0.8,'sine',0.07,250);},
  bigjump(){tone(140,0.3,'square',0.1,520);noise(0.15,0.08,900);},
  fanfare(){[[72,0],[76,0.12],[79,0.24],[84,0.36],[79,0.6],[84,0.72]].forEach(([m,d])=>tone(mf(m),0.22,'square',0.08,null,d));
    [[48,0],[55,0.36],[60,0.72]].forEach(([m,d])=>tone(mf(m),0.4,'triangle',0.15,null,d));}
};
function sfx(n){try{SFX[n]&&SFX[n]();}catch(e){}}

const SONGS={
  title:{tempo:0.17,mt:'triangle',
    m:[72,0,76,0,79,0,84,0,83,0,79,0,81,79,76,0, 77,0,81,0,79,0,76,0,74,76,77,74,72,0,0,0],
    b:[48,0,55,0,52,0,55,0,47,0,55,0,53,0,55,0, 53,0,57,0,48,0,52,0,50,0,55,0,48,0,43,0]},
  s1:{tempo:0.15,
    m:[72,76,79,76,77,81,79,0, 76,79,84,79,81,79,76,0, 74,77,81,77,79,83,81,79, 76,74,72,74,72,0,0,0],
    b:[48,0,55,0,53,0,55,0, 48,0,55,0,53,0,52,0, 50,0,57,0,55,0,50,0, 48,0,55,0,48,0,43,0]},
  s2:{tempo:0.16,mt:'triangle',
    m:[79,0,76,79,81,79,76,74, 72,74,76,0,74,0,0,0, 77,0,76,77,79,77,76,74, 76,0,72,0,74,0,72,0],
    b:[48,0,52,0,53,0,55,0, 48,0,52,0,55,0,55,0, 50,0,53,0,55,0,55,0, 48,0,55,0,48,0,43,0]},
  s3:{tempo:0.15,
    m:[69,72,76,72,74,72,71,0, 69,72,76,79,77,76,74,0, 65,69,72,69,71,74,72,71, 69,0,64,0,69,0,0,0],
    b:[45,0,45,0,41,0,43,0, 45,0,45,0,41,0,40,0, 41,0,41,0,43,0,43,0, 45,0,40,0,45,0,40,0]},
  water:{tempo:0.19,mt:'triangle',
    m:[76,0,79,0,84,0,83,0, 81,0,79,0,76,0,0,0, 77,0,81,0,84,0,86,0, 84,0,83,0,79,0,0,0,
       76,0,79,0,84,0,83,0, 81,0,79,0,77,0,76,0, 74,0,77,0,81,0,79,0, 72,0,0,0,0,0,0,0],
    b:[48,0,55,0,60,0,55,0, 45,0,52,0,57,0,52,0, 41,0,48,0,53,0,48,0, 43,0,50,0,55,0,50,0,
       48,0,55,0,60,0,55,0, 45,0,52,0,57,0,52,0, 41,0,48,0,53,0,48,0, 43,0,50,0,55,0,43,0]},
  reef:{tempo:0.15,mt:'triangle',
    m:[77,0,81,84,0,81,79,0, 77,0,79,81,0,0,0,0, 74,0,77,81,0,77,76,0, 74,0,76,77,0,0,0,0,
       72,0,76,79,0,84,82,0, 81,0,79,77,0,76,74,0, 72,74,76,77,79,81,82,84, 77,0,0,0,0,0,0,0],
    b:[41,0,48,0,53,0,48,0, 41,0,48,0,53,0,48,0, 38,0,45,0,50,0,45,0, 38,0,45,0,50,0,45,0,
       36,0,43,0,48,0,43,0, 46,0,53,0,58,0,53,0, 36,0,43,0,48,0,43,0, 41,0,48,0,53,0,41,0]},
  deep:{tempo:0.22,mt:'sine',
    m:[69,0,0,72,0,0,76,0, 74,0,0,72,0,0,71,0, 69,0,0,72,0,0,77,0, 76,0,0,0,0,0,0,0,
       65,0,0,69,0,0,72,0, 71,0,0,69,0,0,68,0, 69,0,0,0,64,0,0,0, 69,0,0,0,0,0,0,0],
    b:[45,0,52,0,57,0,52,0, 45,0,52,0,56,0,52,0, 41,0,48,0,53,0,48,0, 40,0,47,0,52,0,47,0,
       41,0,48,0,53,0,48,0, 40,0,47,0,52,0,44,0, 45,0,52,0,40,0,47,0, 45,0,52,0,57,0,45,0]},
  rock:{tempo:0.14,
    m:[67,0,72,74,76,0,74,72, 74,0,71,67,69,71,72,0, 67,0,72,74,76,79,77,76, 74,72,71,74,72,0,0,0],
    b:[48,0,55,0,48,0,55,0, 43,0,50,0,43,0,50,0, 45,0,52,0,41,0,48,0, 43,0,50,0,48,0,43,0]},
  cliff:{tempo:0.16,mt:'triangle',
    m:[72,0,74,76,0,79,0,76, 77,0,76,74,0,72,0,0, 69,0,72,74,0,77,0,76, 74,0,71,0,72,0,0,0],
    b:[48,0,55,0,52,0,55,0, 41,0,48,0,53,0,48,0, 45,0,52,0,50,0,53,0, 43,0,50,0,48,0,43,0]},
  peak:{tempo:0.15,
    m:[69,0,72,0,76,0,74,72, 71,0,74,0,77,76,74,0, 72,0,76,0,79,0,77,76, 74,72,71,68,69,0,0,0],
    b:[45,0,52,0,45,0,52,0, 43,0,50,0,43,0,50,0, 41,0,48,0,41,0,48,0, 40,0,47,0,45,0,40,0]},
  boss:{tempo:0.115,
    m:[69,69,72,69,75,74,72,0, 69,69,72,69,76,75,74,0, 65,65,69,65,72,71,69,0, 64,0,68,0,71,0,74,0],
    b:[45,45,57,45,45,57,45,57, 45,45,57,45,45,57,45,57, 41,41,53,41,41,53,41,53, 40,40,52,40,44,44,47,47]},
};
const bgm={on:false,seq:null,step:0,next:0};
function playBGM(n){bgm.seq=SONGS[n];bgm.step=0;bgm.next=0;bgm.on=true;}
function stopBGM(){bgm.on=false;}
setInterval(()=>{
  if(!AC||!bgm.on||muted||!bgm.seq||G.paused)return;
  const s=bgm.seq;
  if(bgm.next<AC.currentTime)bgm.next=AC.currentTime+0.05;
  while(bgm.next<AC.currentTime+0.15){
    const i=bgm.step%s.m.length;
    if(s.m[i])tone(mf(s.m[i]),s.tempo*0.9,s.mt||'square',s.mt?0.09:0.04,null,0,bgm.next);
    if(s.b[i])tone(mf(s.b[i]),s.tempo*1.5,'triangle',0.11,null,0,bgm.next);
    bgm.step++;bgm.next+=s.tempo;
  }
},25);
