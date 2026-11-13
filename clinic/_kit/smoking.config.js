/* 戒菸衛教單張設定。讀 STEP 6 處方產生器的 window.CK_RX（items、drug、patch、short）與輸入欄位。 */
(function(){
const rx=()=>window.CK_RX||{};
const D4_ART='<svg viewBox="0 0 320 92" role="img" aria-label="想抽菸時：等一下、深呼吸、喝水、做別的事" style="display:block;width:100%;max-width:360px;height:auto;margin:2px 0 6px">'+
 [["等 5 分鐘","#3d7a5a",'<circle cx="40" cy="34" r="20" fill="#fff" stroke="#3d7a5a" stroke-width="3"/><path d="M40 22v12l8 5" stroke="#3d7a5a" stroke-width="3" fill="none" stroke-linecap="round"/>'],
  ["深呼吸","#4b7f99",'<path d="M22 40q10-22 36 0" stroke="#4b7f99" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M26 28q14-10 28 0" stroke="#9cc4d6" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="40" cy="46" r="5" fill="#4b7f99"/>'],
  ["喝口水","#3c8dbc",'<path d="M28 16h24l-3 38H31z" fill="#dff0fa" stroke="#3c8dbc" stroke-width="3" stroke-linejoin="round"/><path d="M30 30h20" stroke="#3c8dbc" stroke-width="2"/>'],
  ["做別的事","#a3520c",'<circle cx="40" cy="18" r="6" fill="#f6d2b4"/><path d="M40 25v16M40 30l-10 6M40 30l10-4M40 41l-8 12M40 41l9 11" stroke="#a3520c" stroke-width="4" stroke-linecap="round" fill="none"/>']
 ].map((a,i)=>'<g transform="translate('+(i*80)+' 0)"><rect x="4" y="2" width="72" height="88" rx="10" fill="#fff" stroke="#e6e0d4" stroke-width="1.5"/>'+a[2]+'<text x="40" y="78" text-anchor="middle" font-size="12.5" font-weight="700" fill="'+a[1]+'">'+a[0]+'</text></g>').join("")+'</svg>';
const TIME_ART=(()=>{const pts=[["20 分","心跳","血壓下降"],["12 小時","一氧化碳","回到正常"],["2–12 週","比較","不喘"],["1 年","心臟病","風險減半"],["10 年","肺癌死亡","風險減半"]];
  let s='<svg viewBox="0 0 320 84" role="img" aria-label="戒菸後身體的變化" style="display:block;width:100%;max-width:360px;height:auto;margin:2px 0 6px"><path d="M16 30H304" stroke="#9fcfb2" stroke-width="6" stroke-linecap="round"/>';
  pts.forEach((p,i)=>{const x=24+i*68;s+='<circle cx="'+x+'" cy="30" r="9" fill="#3d7a5a" stroke="#fff" stroke-width="3"/><text x="'+x+'" y="14" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2a2622">'+p[0]+'</text><text x="'+x+'" y="56" text-anchor="middle" font-size="10.5" fill="#4a443c">'+p[1]+'</text><text x="'+x+'" y="70" text-anchor="middle" font-size="10.5" fill="#4a443c">'+p[2]+'</text>';});
  return s+'</svg>';})();
const PATCH_ART='<svg viewBox="0 0 320 90" role="img" aria-label="貼片貼在上臂、胸前或背部，每天換位置" style="display:block;width:100%;max-width:340px;height:auto;margin:2px 0 6px"><g fill="#f6d2b4" stroke="#c48a63" stroke-width="2"><circle cx="60" cy="16" r="11"/><path d="M36 32q24-8 48 0l6 50H30z"/><path d="M36 34l-14 38M84 34l14 38" stroke-width="10" stroke-linecap="round"/></g>'+
 '<g fill="#e6f3ec" stroke="#3d7a5a" stroke-width="2"><rect x="44" y="40" width="14" height="12" rx="2"/><rect x="66" y="52" width="14" height="12" rx="2"/><rect x="20" y="48" width="10" height="12" rx="2"/></g>'+
 '<text x="196" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="#2a2622">貼在沒毛、乾淨的皮膚</text><text x="196" y="50" text-anchor="middle" font-size="12" fill="#4a443c">上臂、胸前、背部</text><text x="196" y="70" text-anchor="middle" font-size="12" fill="#4a443c">每天換位置，壓 10 秒</text></svg>';
const CHEW_ART='<svg viewBox="0 0 320 70" role="img" aria-label="咀嚼錠：嚼到有辣味就停，夾在臉頰邊，味道淡了再嚼" style="display:block;width:100%;max-width:340px;height:auto;margin:2px 0 6px">'+
 [["慢慢嚼","有辣味"],["停！夾在","臉頰邊"],["淡了","再嚼"]].map((t,i)=>{const x=50+i*110;return '<circle cx="'+x+'" cy="26" r="20" fill="#fff" stroke="#3d7a5a" stroke-width="2.5"/><text x="'+x+'" y="31" text-anchor="middle" font-size="15" font-weight="700" fill="#3d7a5a">'+(i+1)+'</text><text x="'+x+'" y="58" text-anchor="middle" font-size="11.5" fill="#2a2622">'+t[0]+t[1]+'</text>'+(i<2?'<path d="M'+(x+26)+' 26h56" stroke="#b9b1a4" stroke-width="3"/><path d="M'+(x+76)+' 20l8 6-8 6" fill="none" stroke="#b9b1a4" stroke-width="3"/>':'');}).join("")+
 '<text x="270" y="16" font-size="16" fill="#e2493b" font-weight="700">↺</text></svg>';

window.CK_CONFIG={
  key:"smoke", sheetTitle:"戒菸計畫單", mascot:"lung", days:14,
  siteUrl:"https://ycjaca.github.io/medisland/clinic/smoking.html",
  inputs:[{k:"cpd",label:"每天幾支",src:"rCpd"},{k:"ftnd",label:"尼古丁成癮度",src:"rFtnd"},{k:"price",label:"一包菸多少錢",src:"mPrice"}],
  numbers(v){
    const out=[];
    if(v.ftnd!=null)out.push({label:"尼古丁成癮度",value:v.ftnd,unit:"／10 分",meter:{min:0,max:10,v:v.ftnd,zones:[[0,4,"#7cc47f","低"],[4,7,"#f2d257","中"],[7,10,"#e0605a","高"]]},
      text:v.ftnd>=7?"身體很依賴尼古丁，<b>一定要用藥</b>，單靠意志力很辛苦。":v.ftnd>=4?"中度依賴：用藥加上衛教，成功的機會多 2–3 倍。":"依賴不高，照計畫戒，很有機會成功。"});
    if(v.cpd&&v.price){const m=Math.round(v.price*v.cpd/20*30),y=Math.round(v.price*v.cpd/20*365);
      out.push({label:"戒菸省下的錢",value:m.toLocaleString(),unit:"元／月",text:"一年可以省下 <b>"+y.toLocaleString()+" 元</b>。把錢存進一個罐子，看著它變多。"});}
    return out;
  },
  meds(){
    const r=rx();if(!r.items||!r.items.length)return {lines:[],note:r.drug==="none"?"這次先不用藥。照下面的方法準備戒菸，下次回診再討論。":""};
    return {lines:r.items.map(i=>i.name.replace(/（[^）]*）/g,"").replace(/克菸貼片 TTS \d+/,"克菸貼片").trim()+(/Varenicline 0.5/.test(i.name)?"（第 1 週）":/Varenicline 1 mg/.test(i.name)&&r.items.length>1?"（第 2 週起）":"")+"｜"+i.dose)};
  },
  medInfo:[
    [/varenicline/i,"戒菸藥：減少想抽的感覺，抽了也沒味道","飯後配一大杯水。會噁心通常 1–2 週就好；晚上那顆不要太晚吃，比較不會做怪夢。"],
    [/bupropion/i,"戒菸藥：減少戒斷與想抽","下午那顆不要太晚吃，以免失眠；先吃 1–2 週再停菸。"],
    [/貼片/,"慢慢補充尼古丁，不會那麼難受","每天早上換新的一片、換位置。睡不好可以睡前撕下。貼著時不要再抽菸。"],
    [/口含錠/,"想抽時的急救","含著慢慢溶，不要嚼、不要吞。"],
    [/咀嚼錠/,"想抽時的急救","不是口香糖：嚼到辣就停，夾在臉頰邊。"],
    [/噴霧/,"想抽時的急救","噴在口腔，不要吸進喉嚨；一次 1–2 下。"],
    [/短效/,"想抽時的急救","想抽才用，越用越少。"]
  ],
  plate(){return {title:"戒菸不怕胖：這樣吃",fr:[.5,.25,.25],frLabel:["半盤","1/4 盤","1/4 盤"],side:["water","fruit","boba"],
    tips:["嘴饞時吃<b>無糖</b>的東西：小黃瓜、番茄、無糖口香糖、白開水","三餐定時，不要用零食取代香菸","少喝含糖飲料，少吃甜點、餅乾","咖啡、茶先減半：戒菸後咖啡因會變得比較強"]};},
  move:["想抽的時候起來走 5 分鐘，渴望通常 3–5 分鐘就會過去","每天快走 30 分鐘：減少戒斷的煩躁，也能控制體重","飯後原本抽菸的時間，改成散步或刷牙"],
  panels(){const r=rx();return [
    {id:"crave",label:"想抽的時候",icon:"warn",title:"想抽的時候：4 個方法",on:true,html:D4_ART,
     items:["想抽的感覺一次只會持續 <b>3–5 分鐘</b>，撐過去就好","手上找事做：握壓力球、玩手機、刷牙","避開飯後、喝酒、喝咖啡、壓力大這些「想抽時刻」"]},
    {id:"prep",label:"戒菸日準備",icon:"check",title:"戒菸日前要做的事",on:true,
     items:["在月曆上圈出戒菸日，告訴家人和同事","戒菸日前把<b>菸、打火機、菸灰缸</b>全部丟掉","洗衣服、清車子，去掉菸味","想好最難熬的時候要做什麼","戒菸日那天起，<b>一口都不抽</b>"]},
    {id:"var",label:"戒菸藥（varenicline）",icon:"pills",title:"吃戒菸藥要知道",on:r.drug==="var",
     items:["第 1 週照常抽菸沒關係，<b>第 8 天</b>停菸","第 1 週劑量慢慢增加，照藥袋吃","飯後吃、配一大杯水，比較不會噁心","心情變得很差、有傷害自己的念頭、行為很不一樣：<b>先停藥、馬上回診</b>"]},
    {id:"patch",label:"尼古丁貼片",icon:"leaf",title:"貼片怎麼貼",on:!!r.patch,html:PATCH_ART,
     items:["戒菸日早上開始貼，每天換新的","貼的地方癢紅：換位置，一週內不貼同一處","貼著時不要抽菸，會心悸、頭暈","洗澡、游泳都可以貼著"]},
    {id:"short",label:"咀嚼錠、口含錠",icon:"pills",title:"咀嚼錠、口含錠怎麼用",on:!!r.short,html:CHEW_ART,
     items:["前幾週<b>定時用</b>（每 1–2 小時），不是忍不住才用","用前 15 分鐘不要喝咖啡、果汁、汽水","口含錠：含著慢慢溶，不要嚼、不要吞"]},
    {id:"benefit",label:"戒菸後身體的變化",icon:"leaf",title:"戒菸後身體的變化",on:true,html:TIME_ART,
     items:["前幾週可能咳嗽變多：是肺在把髒東西排出來","味覺、嗅覺會變好，爬樓梯比較不喘"]},
    {id:"slip",label:"不小心抽了一支",icon:"check",title:"不小心抽了一支怎麼辦",on:false,
     items:["抽了一支不等於失敗，<b>藥繼續吃</b>","想想是什麼情況讓你抽，下次避開","今天開始再一次都不抽"]},
    {id:"family",label:"家人一起來",icon:"check",title:"給家人的話",on:false,
     items:["多鼓勵，不要嘮叨；他可能比較煩躁，那是戒斷","家裡、車上都不抽菸，也不要在他面前抽","家裡有人也抽：一起來戒菸門診"]},
    {id:"help",label:"戒菸專線",icon:"check",title:"一個人戒很辛苦，打電話找幫手",on:true,
     items:["免費戒菸專線 <b>0800-636363</b>（週一到週六 9–21 點）","LINE 搜尋 <b>@tsh0800636363</b>","回診時告訴醫師卡在哪裡，可以調藥"]}
  ];},
  warn:["吃戒菸藥後心情很差、有傷害自己的念頭，或行為變得很不一樣：先停藥並回診","胸口悶痛、冒冷汗超過 5 分鐘：打 <b>119</b>","抽搐、意識不清","全身起疹子、嘴唇或眼皮腫"],
  bring:["所有藥袋、剩下的藥","這幾天抽了幾支的紀錄"],
  nextNote(){const r=rx();return r.stage==="0"?"約 1–2 週後回診，看戒菸日過得如何、藥有沒有副作用。":"約 2–4 週後回診，量一氧化碳、調整藥量。";}
};
})();
