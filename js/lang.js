'use strict';
// ことば：にほんご と えいご（core.js の つぎに よみこむ）
//
// がめんの もじは T('key') で だす。{name} のような ところには T('key',{name:'...'}) で なかみを いれる。
// ステージ・パン・ボスの データは name:{ja:'...',en:'...'} のように かいて、L(...) で いまの ことばを とりだす。
// タイトルで L キー（または みぎうえの ボタン）で きりかえ。えらんだ ことばは ブラウザに おぼえておく。
const LANGS=['ja','en'];
const LANG_KEY='pan2-lang';
let LANG=(()=>{
  try{const s=localStorage.getItem(LANG_KEY);if(LANGS.includes(s))return s;}catch(_){}
  return /^ja\b/i.test(navigator.language||'')?'ja':'en';
})();

const TEXT={
  ja:{
    docTitle:'やきたて！まるパン だいぼうけん',
    // タイトル
    title1:'やきたて！',title2:'まるパン だいぼうけん',
    titleHelp1:'←→ いどう　　Z / スペース ジャンプ（ながおしで ふんわり）',
    titleHelp2:'X ながおし：ぐざいを すいこんで へんしん　X：こうげき',
    titleHelp3:'↓ / C：ぐざいを はきだして まるパンに もどる',
    pressStart:'スペース / エンター で スタート！',
    langBtn:'English (L)',
    // HUD
    spitHint:'　↓/C:はきだす',score:'スコア {n}',muted:'おと なし（M）',air:'あわ',pause:'ポーズ',
    helpLand:'←→:いどう　Z:ジャンプ(ながおし:ふんわり)　X:すいこみ/こうげき　↓/C:はきだす　P:ポーズ　M:おと',
    helpWater:'Z:およぐ(れんだで うえへ・ながおしで ゆっくり)　↓:はやく しずむ　シャボンに さわるか すいこんで あわ ほきゅう',
    // ポーズ
    paused:'ポーズちゅう',pauseResume:'つづける',pauseRestart:'ステージの さいしょから',pauseTitle:'タイトルへ もどる',
    pauseHelp:'↑↓ えらぶ　Z / エンター けってい　P / エスケープ もどる',
    // デバッグ
    debugTitle:'デバッグ：ステージを えらぶ',bossMark:'　★ボス',debugHelp:'↑↓ えらぶ　Z / エンター スタート　T / エスケープ もどる',
    // ステージ
    stageNo:'ステージ {n}',stageNoName:'ステージ {n}　{name}',areaNo:'エリア{n}　{name}',tryAgain:'もういっかい！',stillForm:'{name} の まま！',
    deadWater:'ふやけちゃった・・・',deadCrush:'つぶされちゃった・・・',deadBurn:'こげちゃった・・・',
    stageClear:'ステージクリア！',bonus:'ボーナス +{n}',nextArea:'つぎは {name} へ！',pressNext:'スペース で つぎへ',
    // プレイヤー・アイテム
    transform:'{name} に へんしん！',grain50:'こむぎ50こ！ +1',airRefill:'あわ ほきゅう！',heal:'げんき +2',
    bubblePop:'あわが われちゃった！',squash:'ぺしゃんこ！',stomp:'ふみっ！',checkpoint:'チェックポイント！',goal:'ゴール',
    // ボス
    bossSleep:'ぐうぐう…',bubbleBurst:'パチーン！',
    // エンディング
    endTitle:'ぜんぶ おいしく やけました！',endText:'こげこげ大王を 3かいも やっつけて パンの せかいに へいわが もどった！',
    endScore:'スコア  {n}',endGrains:'あつめた こむぎ  {n} こ',pressTitle:'スペース / エンター で タイトルへ',
    // スマホの ボタン
    btnDown:'はく',btnAct:'すう',btnJump:'ジャンプ',
  },
  en:{
    docTitle:'Fresh Baked! Round Bun\'s Big Adventure',
    title1:'Fresh Baked!',title2:'Round Bun\'s Big Adventure',
    titleHelp1:'←→ Move    Z / Space Jump (hold to float)',
    titleHelp2:'Hold X: inhale a filling to transform    X: attack',
    titleHelp3:'↓ / C: spit out the filling to turn back',
    pressStart:'Press Space / Enter to start!',
    langBtn:'日本語 (L)',
    spitHint:'  ↓/C: spit out',score:'Score {n}',muted:'Sound off (M)',air:'Air',pause:'Pause',
    helpLand:'←→: Move   Z: Jump (hold: float)   X: Inhale/Attack   ↓/C: Spit   P: Pause   M: Sound',
    helpWater:'Z: Swim (tap to go up, hold to go slow)   ↓: Sink fast   Touch or inhale bubbles for air',
    paused:'Paused',pauseResume:'Continue',pauseRestart:'Restart stage',pauseTitle:'Back to title',
    pauseHelp:'↑↓ Choose   Z / Enter OK   P / Esc Back',
    debugTitle:'Debug: choose a stage',bossMark:'  ★Boss',debugHelp:'↑↓ Choose   Z / Enter Start   T / Esc Back',
    stageNo:'Stage {n}',stageNoName:'Stage {n}  {name}',areaNo:'Area {n}  {name}',tryAgain:'Try again!',stillForm:'Still a {name}!',
    deadWater:'Too soggy...',deadCrush:'Squashed...',deadBurn:'Burnt...',
    stageClear:'Stage Clear!',bonus:'Bonus +{n}',nextArea:'Next: {name}!',pressNext:'Space: next',
    transform:'You\'re a {name}!',grain50:'50 wheat! +1',airRefill:'Air refill!',heal:'Health +2',
    bubblePop:'Your bubble popped!',squash:'Squish!',stomp:'Stomp!',checkpoint:'Checkpoint!',goal:'GOAL',
    bossSleep:'Zzz…',bubbleBurst:'POP!',
    endTitle:'Everything is baked just right!',endText:'You beat the Burnt King 3 times. Peace is back in the bread world!',
    endScore:'Score  {n}',endGrains:'Wheat collected  {n}',pressTitle:'Press Space / Enter for the title',
    btnDown:'Spit',btnAct:'Inhale',btnJump:'Jump',
  },
};

// がめんの もじ
function T(key,vars){
  let s=TEXT[LANG][key];if(s==null)s=TEXT.ja[key];if(s==null)return key;
  return vars?s.replace(/\{(\w+)\}/g,(m,k)=>vars[k]!=null?vars[k]:m):s;
}
// データの もじ（{ja,en} なら いまの ことばを えらぶ。ただの もじなら そのまま）
function L(v){
  if(v&&typeof v==='object'&&!Array.isArray(v))return v[LANG]!=null?v[LANG]:v.ja;
  return v;
}
function applyLang(){
  document.documentElement.lang=LANG;document.title=T('docTitle');
  const K={down:'btnDown',act:'btnAct',jump:'btnJump'};
  document.querySelectorAll('#touch .tb').forEach(b=>{if(K[b.dataset.k])b.textContent=T(K[b.dataset.k]);});
}
function setLang(l){
  LANG=l;try{localStorage.setItem(LANG_KEY,l);}catch(_){}
  applyLang();
}
function toggleLang(){setLang(LANGS[(LANGS.indexOf(LANG)+1)%LANGS.length]);}
applyLang();
