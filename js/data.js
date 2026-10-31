'use strict';
// データ：パン・へんしん・てき の ひょう（ステージは stages/ に ある）
// =====================================================================
//  データ
// =====================================================================
const BREAD={
  plain:{rx:17,h:28,top:'#c47530',mid:'#e8a85a',bot:'#f9deaa',line:'#7a431a'},
  curry:{rx:19,h:26,top:'#b0581a',mid:'#d98a3a',bot:'#f0c278',line:'#6a3510'},
  anko:{rx:17,h:28,top:'#6e3414',mid:'#a2582a',bot:'#ebbd80',line:'#43200a'},
  melon:{rx:18,h:29,top:'#e3c050',mid:'#f2da84',bot:'#fcf0c4',line:'#8a6a20'},
  wiener:{rx:19,h:25,top:'#c27a32',mid:'#e5a75e',bot:'#f8dca6',line:'#7a431a'},
};
const FORMS={
  plain:{name:'まるパン',desc:'X ながおし：すいこみ'},
  curry:{name:'カレーパン',desc:'X ながおし：ファイヤーブレス'},
  anko:{name:'アンパン',desc:'X：おおきくなって ごろごろアタック'},
  melon:{name:'メロンパン',desc:'X：クッキーブーメラン'},
  wiener:{name:'ウインナーパン',desc:'X：ウインナーむち'},
};
const ENEMY={
  curry:{w:28,h:22,hp:1,ability:'curry'},
  anko:{w:24,h:24,hp:1,ability:'anko'},
  melon:{w:24,h:24,hp:1,ability:'melon'},
  wiener:{w:30,h:18,hp:1,ability:'wiener'},
  rat:{w:28,h:18,hp:1},
  bird:{w:26,h:20,hp:1},
  fork:{w:20,h:36,hp:3,noInhale:true,noStomp:true},
  fish:{w:28,h:20,hp:1},
  jelly:{w:26,h:26,hp:1},
  uni:{w:28,h:26,hp:3,noInhale:true,noStomp:true},
  crab:{w:30,h:20,hp:1},
  fugu:{w:26,h:22,hp:1},
  lantern:{w:36,h:28,hp:3,noInhale:true},
};
const ECOL={curry:['#d98a3a','#ff8c2a','#f5dc8c'],anko:['#5a2030','#8a4040','#fff'],melon:['#9ad46e','#e4f7c8','#5e9e3e'],
  wiener:['#d0503a','#ffb0a0','#a8301e'],rat:['#a8a8b8','#f2a8b8'],bird:['#a8743c','#f6e4c0'],fork:['#dfe6ee','#9aa6b4'],
  fish:['#5ab0e8','#ffd36a','#fff'],jelly:['#ffb0e0','#fff','#d080ff'],uni:['#4a2a5a','#8a5aa0','#2a1030'],
  crab:['#e8603e','#ff9a6a','#7a1a10'],fugu:['#f2d27a','#fff0b0','#a8782a'],lantern:['#4a4a6a','#ffe060','#2a2a44']};
const ECHAR={c:'curry',a:'anko',m:'melon',w:'wiener',r:'rat',b:'bird',f:'fork',n:'fish',j:'jelly',u:'uni',k:'crab',g:'fugu',l:'lantern'};
const AREA_NAMES={1:'パンの くに',2:'うみの せかい'};
function stageLabel(i){const a=STAGES[i].area||1;let n=0;for(let j=0;j<=i;j++)if((STAGES[j].area||1)===a)n++;return a+'-'+n;}
const AIR_MAX=100,AIR_DRAIN=AIR_MAX/(60*40); // まんたんで 40びょう もつ
const ABILS=['curry','anko','melon','wiener'];

// ---- ステージ（下から行をそろえて連結。上は自動で空白） ----
// # 地面  = 一方通行の足場(バゲット)  B ラスクブロック  ~ パンきじ(ボヨン)
// P スタート  S 看板  K チェックポイント  G ゴール  * こむぎ  H いちごジャム
// c カレー a あんこ m メロン w ウインナー r ネズミ b スズメ f フォーク  | ボス部屋  X ボス
// （みずのなか）o あわのでる かい  O シャボン(あわほきゅう)  Y かいそう  Q サンゴ  > < ^ ながれ
//   n さかな j クラゲ u ウニ k カニ g フグ l チョウチンアンコウ

// ステージは stages/*.js で STAGES.push() する（index.html に ならべた じゅんばんが ステージの じゅんばん）
const STAGES=[];
