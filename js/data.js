'use strict';
// データ：パン・へんしん の ひょう（ステージは stages/、てきは js/enemies/ に ある）
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
// てきの データは js/enemies/*.js の defineEnemy() に ある
const AREA_NAMES={1:'パンの くに',2:'うみの せかい',3:'ゴツゴツ いわやま'};
function stageLabel(i){const a=STAGES[i].area||1;let n=0;for(let j=0;j<=i;j++)if((STAGES[j].area||1)===a)n++;return a+'-'+n;}
const AIR_MAX=100,AIR_DRAIN=AIR_MAX/(60*40); // まんたんで 40びょう もつ
// ぶつり：りく と みずのなか（ステージを よみこむと lv.ph に はいる）
const PHYS={
  land:{
    run:3.8,airAccel:0.42,airDrag:0.92,              // はしる はやさ・くうちゅうでの かそく と ブレーキ
    grav:0.55,maxFall:10,riseGrav:1.1,               // じゅうりょく・おちる はやさ・ジャンプを はなしたときの じゅうりょく
    floatGrav:0.2,floatFall:2.3,                     // ジャンプ ながおしで ふんわり
    hurtVy:-6,stompMul:1,stompBoost:3,rollBounceVy:-7, // やられ・ふみつけ・ごろごろで ボスに あたったときの はねかえり
    clearGrav:0.55,clearFall:10,clearHop:-8,         // クリアの ぴょんぴょん
  },
  water:{
    run:3,airAccel:0.3,airDrag:0.95,
    grav:0.2,maxFall:2.8,riseGrav:0.32,
    floatGrav:0.1,floatFall:1.2,sinkGrav:0.35,sinkFall:5, // ↓で はやく しずむ
    stroke:-5.2,strokeGround:-6.6,                   // ひとかき（じめんからは つよめ）
    current:2.6,upCurrent:0.55,upCurrentMax:-4.8,    // ながれ
    hurtVy:-3.5,stompMul:0.72,stompBoost:2,rollBounceVy:-4,
    clearGrav:0.2,clearFall:2.8,clearHop:-5,
  },
};
const ABILS=['curry','anko','melon','wiener'];

// ---- ステージ（下から行をそろえて連結。上は自動で空白） ----
// # 地面  = 一方通行の足場(バゲット)  B ラスクブロック  ~ パンきじ(ボヨン)
// P スタート  S 看板  K チェックポイント  G ゴール  * こむぎ  H いちごジャム
// c カレー a あんこ m メロン w ウインナー r ネズミ b スズメ f フォーク  | ボス部屋  X ボス（どのボスかは boss:'koge' のように かく）
// （みずのなか）o あわのでる かい  O シャボン(あわほきゅう)  Y かいそう  Q サンゴ  > < ^ ながれ
//   n さかな j クラゲ u ウニ k カニ g フグ l チョウチンアンコウ
// （いわやま）i ズシンいわ（したを とおると おちてくる）  I ぺったんいわ（じゅんばんに おちたり あがったり）
// たてに ながい ステージは rows:30 のように たかさを かく（チャンクは したに そろう）

// ステージは stages/*.js で STAGES.push() する（index.html に ならべた じゅんばんが ステージの じゅんばん）
const STAGES=[];
