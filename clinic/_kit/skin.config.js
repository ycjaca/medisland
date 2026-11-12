/* 常見皮膚疾病衛教單張設定。讀 STEP 8 處方產生器的 window.CK_RX（dx、items、area）。沒有餐盤與運動區塊。 */
(function(){
const STEROID=/hydrocortisone|betamethasone|mometasone|fluocinonide|clobetasol/i;
const rxDx=()=>(window.CK_RX&&window.CK_RX.dx)||"";
const inDx=(...ids)=>ids.indexOf(rxDx())>=0;
const FTU_ART='<svg viewBox="0 0 300 110" role="img" aria-label="一個指尖單位的藥膏可以擦兩個手掌大" style="display:block;width:100%;max-width:340px;height:auto;margin:2px 0 6px"><path d="M8 70q0 -13 13 -13h78q17 0 17 13t-17 13H21q-13 0 -13 -13z" fill="#f6d3bd" stroke="#c99a7e" stroke-width="2"/><path d="M74 57v26M42 57v26" stroke="#c99a7e" stroke-width="1.5"/><path d="M76 66h30" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M76 48v-7h30v7" fill="none" stroke="#2a2622" stroke-width="1.5"/><text x="91" y="34" text-anchor="middle" font-size="13" font-weight="700" fill="#2a2622">1 個單位</text><text x="150" y="76" text-anchor="middle" font-size="26" font-weight="700" fill="#3f4f8f">=</text>'+[190,246].map(x=>'<g transform="translate('+x+' 18)"><path d="M6 86V44q0 -6 6 -6t6 6V14q0 -6 6 -6t6 6v-6q0 -6 6 -6t6 6v8q0 -6 6 -6t6 6v44l6 -12q4 -6 9 -3t2 9l-12 26q-6 12 -20 12H24Q6 96 6 86z" transform="scale(.62)" fill="#f6d3bd" stroke="#c99a7e" stroke-width="3"/></g>').join("")+'<text x="232" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#2a2622">兩個手掌大</text></svg>';
const BATH_ART='<svg viewBox="0 0 300 70" role="img" aria-label="洗澡後三分鐘內擦保濕" style="display:block;width:100%;max-width:340px;height:auto;margin:2px 0 6px"><g fill="none" stroke="#3f4f8f" stroke-width="2.5" stroke-linecap="round"><path d="M14 36h64v8a16 16 0 0 1 -16 16H30a16 16 0 0 1 -16 -16z" fill="#e6e9f5"/><path d="M24 36V29a6 6 0 0 1 12 0"/></g><text x="46" y="14" text-anchor="middle" font-size="11" fill="#2a2622">溫水 10 分鐘</text><path d="M92 44h26m-8 -7l8 7 -8 7" fill="none" stroke="#2a2622" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="152" cy="42" r="20" fill="#fff" stroke="#3f4f8f" stroke-width="2.5"/><path d="M152 42V28M152 42l9 6" stroke="#3f4f8f" stroke-width="2.5" stroke-linecap="round"/><text x="152" y="14" text-anchor="middle" font-size="11" fill="#2a2622">3 分鐘內</text><path d="M186 44h26m-8 -7l8 7 -8 7" fill="none" stroke="#2a2622" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="232" y="26" width="34" height="36" rx="6" fill="#fbe9df" stroke="#c99a7e" stroke-width="2.5"/><rect x="240" y="16" width="18" height="10" rx="2" fill="#c99a7e"/><text x="249" y="49" text-anchor="middle" font-size="11" font-weight="700" fill="#2a2622">保濕</text><text x="249" y="10" text-anchor="middle" font-size="11" fill="#2a2622">擦多一點</text></svg>';
window.CK_CONFIG={
  key:"skin", sheetTitle:"皮膚照護單", mascot:"leaf", days:14, move:false,
  siteUrl:"https://ycjaca.github.io/medisland/clinic/skin.html",
  inputs:[{k:"area",label:"患部幾個手掌大",src:"xArea",step:.5}],
  numbers(v){
    if(!v.area||inDx("urt","cell","hz","hsv","wart"))return [];
    const ftu=Math.round(v.area/2*10)/10;
    return [{label:(window.CK_RX&&window.CK_RX.dxName?window.CK_RX.dxName+"：":"")+"每次要擠的藥膏量",value:ftu,unit:"個指尖單位",
      text:"患部大約 <b>"+v.area+" 個手掌</b>大。從食指指尖擠到第一個指節是 1 個單位，剛好擦兩個手掌大。擦薄薄一層、看不到白色就夠了。"}];
  },
  meds(){
    const r=window.CK_RX;if(!r||!r.items)return {lines:[]};
    const it=r.items.filter(i=>i.dose&&!/衛教|停用|抬高|液態氮|^（/.test(i.name));
    if(!it.length)return {lines:[],note:"這次不用特別的藥，照下面的方式照顧皮膚。"};
    return {lines:it.map(i=>i.name.replace(/（或[^）]*）/g,"").replace(/ 口服液（依體重）/,"口服液").trim()+"｜"+
      i.dose.replace(/一天 2 次/,"早晚各 1 次").replace(/一天 1 次/,"每天 1 次").replace(/一天 1–2 次/,"每天 1 到 2 次").replace(/，薄擦患部/,"，薄薄擦在患部"))};
  },
  medInfo:[
    [STEROID,"消炎、止癢的類固醇藥膏","只擦紅、癢的地方；好了就停。不要擦到眼睛裡。"],
    [/tacrolimus|pimecrolimus/i,"不含類固醇的消炎藥膏","前幾天擦了會熱熱刺刺的，通常一週內就習慣。"],
    [/洗髮精/,"抗黴菌的洗劑","搓出泡泡後停幾分鐘再沖掉。"],
    [/terbinafine 1%|clotrimazole|ketoconazole|nystatin/i,"殺黴菌的藥膏","擦到紅疹外圍兩公分；看起來好了還要再擦 1 到 2 週。"],
    [/terbinafine 250|fluconazole|itraconazole/i,"口服抗黴菌藥","照天數吃完。很累、沒胃口、尿變茶色要回診。"],
    [/cetirizine|levocetirizine|fexofenadine|loratadine/i,"止癢的抗過敏藥","可能會想睡，開車、操作機器要小心。"],
    [/保濕|護手霜|urea/i,"修護皮膚","量要多、次數要夠，洗澡後馬上擦。"],
    [/acyclovir/i,"抗病毒藥","要吃滿天數，多喝水。"],
    [/gabapentin|pregabalin/i,"神經痛的藥","會想睡、頭暈，起身慢一點。"],
    [/acetaminophen/i,"止痛藥","一天不超過醫師說的顆數。"],
    [/cephalexin|dicloxacillin|cefadroxil/i,"抗生素","整個療程吃完，不要好了就停。"],
    [/doxycycline/i,"消炎的抗生素","配一大杯水，吃完不要馬上躺下；出門要防曬。"],
    [/adapalene/i,"治粉刺的 A 酸","睡前擦薄薄一層。前幾週會乾、脫皮，要保濕和防曬。"],
    [/benzoyl/i,"殺痘痘菌","會讓衣服、枕頭套褪色。"],
    [/azelaic|metronidazole|ivermectin/i,"消炎的外用藥","每天規則擦，幾週後才看得出效果。"],
    [/permethrin/i,"殺疥蟲的藥膏","脖子以下全身都要擦到，8 到 14 小時後洗掉。"],
    [/prednisolone/i,"口服類固醇","早上飯後吃；照醫師給的天數慢慢減，不要自己停。"],
    [/mupirocin|fusidic/i,"抗生素藥膏","先用溫水把痂泡軟擦掉，再擦藥。"],
    [/calcipotriol/i,"乾癬用的維生素 D 藥膏","不要擦臉；擦完洗手。"],
    [/水楊酸/,"軟化角質","只擦在疣上，周圍皮膚先塗凡士林保護。"],
    [/彈性襪/,"幫助腿部血液回流","早上起床就穿，睡前脫掉。"],
    [/濕敷/,"收乾滲液",""]
  ],
  panels(v,meds){
    const st=STEROID.test(meds||"");
    return [
    {id:"ftu",label:"藥膏擠多少",icon:"pills",title:"藥膏擠多少：指尖單位",on:!inDx("urt","cell","hz","hsv"),html:FTU_ART,
     items:["一個單位擦兩個手掌大；擦太厚不會比較快好","一天擦醫師說的次數就好，多擦沒有用","擦藥前後都要洗手"]},
    {id:"steroid",label:"類固醇藥膏安心用",icon:"check",title:"類固醇藥膏這樣用最安全",on:st,
     items:["照醫師說的天數擦，紅和癢退了就可以停","臉、腋下、鼠蹊的皮膚薄，不要拿身體的藥膏去擦","不要拿給家人擦，也不要自己到藥局買來續擦","擦了反而變大圈、或 2 週沒有好，回來讓醫師看"]},
    {id:"moist",label:"洗澡與保濕",icon:"leaf",title:"洗澡與保濕",on:inDx("ad","num","stasis","contact","pom","lsc","pso","pr"),html:BATH_ART,
     items:["洗澡用溫水、10 分鐘內，不用肥皂用力搓","洗完擦乾，<b>3 分鐘內</b>擦保濕，一天至少 2 次","保濕和藥膏隔 15 到 30 分鐘","衣服選棉質、寬鬆"]},
    {id:"itch",label:"癢的時候",icon:"moon",title:"癢的時候這樣做",on:inDx("ad","num","lsc","pom","contact","urt","scab","bite","stasis","drug"),
     items:["用拍的、冰敷的，不要抓；抓破會更癢、更厚","指甲剪短","睡前擦藥和保濕；房間不要太熱","把保濕劑放冰箱，癢的時候擦"]},
    {id:"fungus",label:"黴菌感染照顧",icon:"foot",title:"黴菌怕乾：這樣不容易復發",on:inDx("tinea","tp","pv","cand","mf"),
     items:["洗澡後把趾縫、皺摺擦乾或吹乾","藥要擦到看起來好了<b>之後再 1 到 2 週</b>","襪子每天換；鞋子輪流穿、曬乾","先穿襪子再穿內褲，才不會把腳的黴菌帶到鼠蹊","毛巾、拖鞋不要和家人共用","不要自己買含類固醇的「幾合一」藥膏擦"]},
    {id:"scab",label:"疥瘡：全家一起治療",icon:"warn",title:"疥瘡：全家同一天一起治療",on:inDx("scab"),
     items:["同住的人不管癢不癢，<b>同一天一起擦藥</b>","從脖子擦到腳底：指縫、指甲下、肚臍、生殖器、屁股溝都要","擦藥期間洗了手要補擦","這 3 天穿過的衣服、床單、毛巾：用熱水洗再烘乾，或裝進塑膠袋封 7 天","治好之後還會癢 2 到 4 週，這是正常的，不要一直重複擦殺蟲藥"]},
    {id:"zoster",label:"帶狀疱疹照顧",icon:"thermo",title:"帶狀疱疹（皮蛇）照顧",on:inDx("hz"),
     items:["抗病毒藥越早吃越好，要吃滿 7 天","痛就吃止痛藥，不用忍","水疱不要弄破，用紗布蓋著，結痂前不要泡澡","結痂前避免接觸沒得過水痘的人、孕婦、新生兒","好了以後可以和醫師討論打疫苗"]},
    {id:"urt",label:"蕁麻疹照顧",icon:"check",title:"蕁麻疹照顧",on:inDx("urt"),
     items:["抗過敏藥要<b>每天規則吃</b>，不是癢了才吃","記下發作前吃的東西、藥、做的事","避免：太熱的水、緊身衣、喝酒、自己買的止痛藥","大多數幾天到幾週會好；超過 6 週要回診調藥"]},
    {id:"acne",label:"痘痘與臉部照顧",icon:"sun",title:"臉部照顧",on:inDx("acne","ros"),
     items:["洗臉一天 2 次，用溫和的洗面乳，不要用力搓","不要擠","每天防曬、擦清爽的保濕","藥要擦 8 到 12 週才看得出效果，不要太早放棄"]},
    {id:"infect",label:"傷口與感染照顧",icon:"thermo",title:"感染的照顧",on:inDx("imp","cell","fol"),
     items:["抗生素整個療程吃完","碰過患部要洗手；毛巾、刮鬍刀自己用","腿上的感染：坐著躺著都把腳抬高","用筆把紅的邊界畫起來，每天看有沒有超出去"]}
    ];
  },
  warn:["紅腫的範圍很快變大、變得很痛，或發燒","嘴巴、眼睛、生殖器破皮，或皮膚起水疱、脫皮","擦藥後反而更紅、更癢，或越長越大圈","嘴唇、眼皮腫起來，喘或喉嚨緊：馬上掛急診"],
  bring:["正在擦的所有藥膏（包含藥局買的）","最近吃的藥和保健食品","發作時拍的照片"],
  nextNote(){
    const m={cell:"2 到 3 天內回診看紅腫有沒有退。",imp:"3 到 5 天回診。",fol:"3 到 5 天回診。",hz:"1 週回診看疼痛與傷口。",acne:"8 到 12 週回診看效果。",ros:"8 到 12 週回診看效果。",urt:"2 到 4 週回診調整藥量。",scab:"1 到 2 週回診，確認要不要再擦第二次。"};
    return m[rxDx()]||"約 2 週回診。沒有好轉也要回來，可能需要刮皮屑檢查或調整診斷。";
  }
};
})();
