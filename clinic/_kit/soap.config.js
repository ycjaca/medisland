/* 門診工具箱｜慢性病 SOAP 產生器的衛教單張設定。
   不讀頁面欄位；讀產生器每次重算後放在 window.CK_SOAP 的結果：
   {mods, p(病人), res(各模組 rx/goals), fu(週), next(下次要抽的血), goals}
   mascot、sheetTitle、warn、bring 由產生器依勾選的慢性病即時改寫。 */
window.CK_CONFIG={
  key:"soap", sheetTitle:"慢性病照護單", mascot:"leaf", days:28,
  siteUrl:"https://ycjaca.github.io/medisland/clinic/toolbox/soap.html",
  inputs:[],
  numbers(){
    const S=window.CK_SOAP;if(!S)return [];const p=S.p,m=S.mods,out=[],ok=v=>v!=null&&!isNaN(v);
    if(m.includes("htn")&&ok(S.v.hs)){out.push({label:"居家血壓（722 平均）",value:S.v.hs+"/"+S.v.hd,unit:"mmHg",
      meter:{min:100,max:180,v:S.v.hs,target:130,targetLabel:"目標 130",zones:[[100,120,"#7cc47f","理想"],[120,130,"#b9db7a","正常"],[130,140,"#f2d257","偏高"],[140,160,"#f5a24b","高"],[160,180,"#e0605a","很高"]]},
      text:"目標：居家血壓 <b>&lt;130/80</b>。"});}
    if(m.includes("dm")&&ok(S.v.a1c)){const t=S.v.a1cT,eag=Math.round(28.7*S.v.a1c-46.7);out.push({label:"糖化血色素 HbA1c",value:S.v.a1c,unit:"%",
      meter:{min:4.5,max:12,v:S.v.a1c,target:t,targetLabel:"目標 "+t,zones:[[4.5,5.7,"#7cc47f","正常"],[5.7,6.5,"#f2d257","前期"],[6.5,8,"#f5a24b","偏高"],[8,12,"#e0605a","太高"]]},
      text:"過去 3 個月的平均血糖，約 <b>"+eag+" mg/dL</b>。目標：<b>&lt;"+t+"%</b>。"});}
    if(m.includes("lip")&&ok(S.v.ldl)){const t=S.v.ldlT;out.push({label:"壞膽固醇 LDL-C",value:S.v.ldl,unit:"mg/dL",
      meter:{min:30,max:220,v:S.v.ldl,target:t,targetLabel:"目標 "+t,zones:[[30,t,"#7cc47f","達標"],[t,Math.min(t+40,190),"#f2d257","偏高"],[Math.min(t+40,190),220,"#e0605a","太高"]]},
      text:"你的風險等級是<b>"+S.v.tier+"</b>，LDL 目標 <b>&lt;"+t+"</b>。"});}
    if(m.includes("ckd")&&ok(p.egfr)){out.push({label:"腎功能 eGFR",value:p.egfr,unit:"mL/min/1.73m²",
      meter:{min:0,max:120,v:p.egfr,zones:[[0,15,"#e0605a","第5期"],[15,30,"#f08a5a","第4期"],[30,60,"#f5a24b","第3期"],[60,90,"#b9db7a","第2期"],[90,120,"#7cc47f","正常"]]},
      text:ok(p.uacr)?"尿蛋白 UACR <b>"+p.uacr+" mg/g</b>"+(p.uacr>=30?"（偏高，藥物可以保護腎臟）":"（正常）")+"。":"每次回診追蹤，數字穩定就是好消息。"});}
    if((m.includes("wt")||m.includes("dm"))&&ok(p.bmi)){out.push({label:"身體質量指數 BMI",value:p.bmi,
      meter:{min:15,max:40,v:p.bmi,target:24,targetLabel:"24",zones:[[15,18.5,"#9fc9e8","過輕"],[18.5,24,"#7cc47f","正常"],[24,27,"#f2d257","過重"],[27,40,"#f5a24b","肥胖"]]},
      text:p.bmi>=24&&ok(p.wt)?"先減 5–10%（約 <b>"+Math.round(p.wt*0.05)+"–"+Math.round(p.wt*0.1)+" 公斤</b>），血壓、血糖、血脂都會改善。":"維持現在的體重。"});}
    if(m.includes("smk")&&ok(S.v.ftnd)){out.push({label:"尼古丁成癮度（FTND）",value:S.v.ftnd,unit:"/ 10",
      meter:{min:0,max:10,v:S.v.ftnd,zones:[[0,4,"#7cc47f","低"],[4,7,"#f5a24b","中"],[7,10,"#e0605a","高"]]},
      text:ok(p.cig)&&p.cig>0?"每天 "+p.cig+" 支，戒掉一個月可以省下約 <b>"+(Math.round(p.cig/20*30*130/100)*100).toLocaleString()+" 元</b>（以一包 130 元計）。":""});}
    return out;
  },
  meds(){
    const S=window.CK_SOAP;if(!S)return {lines:[]};
    const raw=(S.acRx||[]).concat(S.mods.flatMap(k=>(S.res[k]&&S.res[k].rx)||[]));
    const lines=[];
    raw.forEach(r=>{
      if(/^（|^或|^停用|^可考慮|^自費|已在/.test(r))return;
      let s=r.replace(/^[A-Z][A-Z0-9]{2,5}\s+/,"").replace(/（[^）]*）/g," ").split(/\s或\s/)[0].replace(/^＋/,"").replace(/^原 statin＋/,"").replace(/^改\s*/,"");
      let later="";const dm=s.match(/ x (\d+(?:-\d+)?) days?/);if(dm){later="共 "+dm[1]+" 天";s=s.replace(dm[0],"");}const ar=s.indexOf("→");if(ar>0){later=(later?later+"，":"")+"之後依醫師指示調整";s=s.slice(0,ar).trim();}
      s=s.replace(/（[^）]*）/g,"").trim();
      const how=[];
      if(/\bQID\b/i.test(s))how.push("每天 4 次");else if(/Q6H/i.test(s))how.push("需要時吃，間隔至少 6 小時");else if(/\bTID\b/i.test(s))how.push("每天 3 次");else if(/\bBID\b/i.test(s))how.push("每天 2 次，早晚");
      else if(/\bqw\b/i.test(s))how.push("每週 1 次，固定同一天");else if(/\bHS\b/i.test(s))how.push("睡前");
      else if(/\bQD\b|\bqd\b/.test(s))how.push("每天 1 次");if(/PRN/.test(s))how.push("需要時");
      if(/\bAC\b/.test(s))how.push("飯前");else if(/\bPC\b/.test(s))how.push("飯後");
      if(/\bSC\b/.test(s))how.push("皮下注射");
      if(later)how.push(later);
      const name=s.replace(/\d#/g,"").replace(/\b(QD|qd|BID|TID|QID|HS|qw|PC|AC|SC|PRN|q1-2h|Q6H|Q4-6H|AM|stat)\b/g,"").replace(/\b(fever\/pain|pain|cough|wheeze|nausea|cramp|palpitation)\b/g,"").replace(/\(D[^)]*\)/g,"").replace(/\s{2,}/g," ").trim();
      lines.push(name+"｜"+how.join("，"));
    });
    if(!lines.length)return {lines:[],note:"這次沒有新的藥；原本的藥照常吃，不要自己停藥。"};
    return {lines};
  },
  medInfo:[
    [/twynsta|exforge|sevikar|olsaaca/i,"兩種降血壓藥合一顆","每天固定時間吃；腳踝腫要告訴醫師。"],
    [/indapamide|natrilix/i,"降血壓、利尿","早上吃；會多跑廁所；要驗鈉、鉀、尿酸。"],
    [/doxazosin|xadosin/i,"降血壓、放鬆血管","睡前吃；起身慢一點，小心頭暈。"],
    [/leqvio|inclisiran/i,"打針降膽固醇","半年打一次，在診間施打。"],
    [/nilemdo|bempedoic/i,"降壞膽固醇（不是 statin）","可能使尿酸上升。"],
    [/contrave/i,"降食慾的口服減重藥","每週加 1 顆；不要喝酒；血壓升高或情緒變化要回診。"],
    [/xenical|orlistat/i,"減少油脂吸收","吃含油的餐才吃；會油便，睡前補綜合維生素。"],
    [/quickmist/i,"想抽時用的口腔噴劑","對著臉頰內側噴，不要吸入；一次 1–2 噴。"],
    [/acetaminophen|acetal|apap/i,"退燒止痛","兩次至少隔 4–6 小時；一天不超過 8 顆（500mg）；感冒藥水常含同成分，不要重複吃。"],
    [/naproxen|meloxicam|melicam|celebrex|celecoxib|diclofenac/i,"消炎止痛（NSAID）","飯後吃；胃痛、黑便要停藥回診；腎臟不好不要自己買來吃。"],
    [/levocetirizine|loratadine|levozine|clatine/i,"抗過敏、止鼻水","可能想睡，開車小心。"],
    [/hiros|pseudoephedrine/i,"通鼻塞","可能心悸、睡不著，下午以後少吃；高血壓要告訴醫師。"],
    [/dextromethorphan|dimemorfan|eufan/i,"止乾咳","有痰時不要一直吃。"],
    [/ambroxol|musco|acetylcysteine|actein/i,"化痰","多喝水，痰比較好咳出來。"],
    [/comfflam|benzydamine/i,"喉嚨噴劑","對著喉嚨痛的地方噴，噴完 30 分鐘內少喝水。"],
    [/amoxicillin|curam|cephalexin|azithromycin|baktar|ciprofloxacin|cinolone|doxycycline/i,"抗生素","照時間吃完全部療程，不要症狀好了就停；出疹或嚴重腹瀉要回診。"],
    [/oseltamivir|eraflu/i,"抗流感病毒","5 天吃完；可能噁心，飯後吃。"],
    [/paxlovid/i,"抗 COVID 病毒","5 天吃完；會和很多藥互相影響，其他醫師開藥要告知。"],
    [/smecta/i,"止瀉（吸附）","泡水喝；和其他藥間隔 2 小時。"],
    [/bioflor/i,"益生菌","和抗生素間隔 2 小時。"],
    [/domperidone|domtoo|metoclopramide|promeran/i,"止吐、幫助胃排空","飯前吃；吃幾天就好，不要長期吃。"],
    [/loperamide|lopedin/i,"止瀉","有發燒或血便時不要吃。"],
    [/hyoscyamine|buwecon/i,"止肚子絞痛","可能口乾、便秘。"],
    [/famotidine|voker|pantoloc|pantoprazole/i,"減少胃酸","飯前吃效果較好。"],
    [/algitab|ulstal/i,"保護胃、止逆流","飯後和睡前嚼碎吞。"],
    [/mopride|mosapride/i,"幫助胃蠕動","飯前吃。"],
    [/simethicone|kascoal/i,"消脹氣","飯後吃。"],
    [/mgo|magnesium oxide/i,"軟便","多喝水；腎臟不好要告訴醫師。"],
    [/lactul/i,"軟便","可能脹氣；調整到每天軟便 1–2 次。"],
    [/dulcolax|bisacodyl/i,"刺激排便","睡前吃，隔天早上排便；不要長期吃。"],
    [/kocel|psyllium/i,"纖維","一定要配一大杯水。"],
    [/colchicine/i,"痛風急性發作","吃到不痛就照醫師的量吃；腹瀉要減量或停。"],
    [/prednisolone/i,"類固醇消炎","早上吃，照天數吃完；血糖可能升高。"],
    [/goodgen|flurbi/i,"外用消炎止痛","擦或貼在痛的地方，不要用在傷口。"],
    [/cyclobenzaprine|musgud|mephenoxalone/i,"放鬆肌肉","會想睡，不要開車、喝酒。"],
    [/lyrica|pregabalin/i,"神經痛","會頭暈想睡，從小劑量開始。"],
    [/imigran|sumatriptan/i,"偏頭痛發作時吃","頭痛一開始就吃；2 小時後可再吃一次，一天最多 4 顆。"],
    [/propranolol/i,"降心跳、預防偏頭痛","不要突然停藥；氣喘不可用。"],
    [/flunarizine|suzin/i,"預防偏頭痛","睡前吃；可能想睡、變胖。"],
    [/diphenidol|dimenhydrinate|trimin/i,"止暈","會想睡；只吃幾天。"],
    [/betahistine|nilasen/i,"改善眩暈","飯後吃。"],
    [/synvent|salbutamol/i,"急救用支氣管擴張劑","喘的時候噴 2 下；一個月用超過一支要回診。"],
    [/symbicort/i,"氣喘控制加急救","每天早晚用，喘時也可以多噴；噴完漱口。"],
    [/momenase|mometasone nasal|鼻噴/i,"鼻噴類固醇","噴向鼻孔外側；要連續用幾天才有效。"],
    [/furosemide/i,"利尿","早上吃；頭暈、抽筋要回診驗血。"],
    [/n\.t\.g|nitroglycerin/i,"心絞痛急救","坐下、舌下含 1 顆；5 分鐘沒好再 1 顆，3 顆沒好打 119。"],
    [/aspirin|bokey/i,"抗血小板","飯後吃；黑便、流血不止要回診。"],
    [/sevikar hct/i,"三種降血壓藥合一顆","早上吃；剛開始起身慢一點，會多跑廁所。"],
    [/sevikar|exforge/i,"兩種降血壓藥合一顆","每天固定時間吃；腳踝腫要告訴醫師。"],
    [/amlodipine|nifedipine/i,"降血壓（鈣離子阻斷劑）","可能腳踝水腫、臉潮紅，通常不用停藥。"],
    [/sartan/i,"降血壓、保護腎臟與心臟","吐、拉、吃不下時先暫停；懷孕前要告訴醫師。"],
    [/spironolactone/i,"降血壓、利尿","要定期驗鉀；不要吃鹽代替品（低鈉鹽）。"],
    [/bisoprolol|labetalol/i,"降心跳、保護心臟","不要突然停藥；心跳太慢、頭暈要回診。"],
    [/glyxambi/i,"兩種降糖藥合一顆","多喝水、注意私密處清潔；吐、拉、吃不下時先暫停。"],
    [/metformin/i,"降血糖","跟飯一起吃比較不會胃不舒服；做顯影劑檢查、或吐拉吃不下時先暫停。"],
    [/gliclazide|glimepiride/i,"幫忙分泌胰島素","一定要吃飯；可能低血糖，隨身帶糖果。"],
    [/flozin/i,"從尿液排糖，也護心護腎","多喝水、注意私密處清潔；吐、拉、吃不下時先暫停。"],
    [/gliptin/i,"幫身體在飯後分泌胰島素","很少低血糖，什麼時間吃都可以。"],
    [/mounjaro|wegovy|saxenda|ozempic|glutide|tirzepatide/i,"腸泌素：降食慾、穩血糖","剛開始可能噁心：吃少一點、慢一點；固定同一天打。"],
    [/insulin|glargine/i,"補充胰島素","固定時間打、每次換位置；依空腹血糖調整；隨身帶糖果。"],
    [/statin/i,"降壞膽固醇","每天固定時間吃；全身肌肉痠痛、尿變深色要回診。"],
    [/ezetimibe|atozet/i,"減少腸道吸收膽固醇","和 statin 一起吃，效果更好。"],
    [/fenofibrate/i,"降三酸甘油脂","飯後吃；肌肉痠痛要回診。"],
    [/evolocumab/i,"打針降膽固醇","每 2 週打一次，冰箱冷藏。"],
    [/finerenone/i,"保護腎臟和心臟","要定期驗鉀。"],
    [/dapagliflozin|forxiga/i,"保護腎臟和心臟","多喝水、注意私密處清潔；吐、拉、吃不下時先暫停。"],
    [/varenicline/i,"減少想抽菸、抽起來不爽","飯後配一杯水；可能噁心、做夢多；第 8 天開始不抽。"],
    [/貼片/,"穩定補充尼古丁","早上起床貼，每天換位置；睡不好可以睡前撕掉。"],
    [/口嚼錠|口含錠/,"想抽時用","嚼到有辣味就停，放在臉頰和牙齦中間；用前 15 分鐘不喝咖啡、果汁。"],
    [/bupropion/i,"減少想抽菸","停菸日前 1–2 週開始吃；兩次間隔 8 小時，第二次不要太晚吃。"]
  ],
  plate(){
    const S=window.CK_SOAP;if(!S)return null;const m=S.mods.filter(k=>k!=="smk"&&k!=="trk");if(!m.length)return null;
    const side=[];if(m.includes("htn")||m.includes("ckd"))side.push("salt");if(m.includes("dm")||m.includes("wt"))side.push("boba");if(m.includes("ckd"))side.push("star");
    if(side.length<3&&!m.includes("ckd"))side.push("fruit");if(side.length<3)side.push("water");
    const tips=[];
    if(m.includes("htn")||m.includes("ckd"))tips.push("<b>少鹽</b>：湯不要喝完、少沾醬、少加工食品（火腿、泡麵、罐頭）");
    if(m.includes("dm"))tips.push("飯、麵、地瓜、玉米都算<b>全穀雜糧</b>，每餐固定 1/4 盤；先吃菜和肉，最後吃飯");
    if(m.includes("lip"))tips.push("<b>少油</b>：少油炸、肥肉、內臟、奶油糕點；多吃魚和豆製品");
    if(m.includes("wt"))tips.push("每餐先吃<b>蛋白質</b>（豆魚蛋肉），一天約體重 ×1.2–1.6 克，減脂不減肌");
    if(m.includes("ckd"))tips.push("<b>不吃楊桃</b>；不吃來路不明的草藥、偏方");
    tips.push("口渴喝白開水或無糖茶，不喝手搖飲和含糖飲料");
    return {title:"每餐這樣吃",fr:[.5,.25,.25],frLabel:["半盤","1/4 盤","1/4 盤"],side:side.slice(0,3),tips};
  },
  move:["每週至少 150 分鐘中等強度運動（快走、騎車、游泳），會微喘還能講話","每週 2–3 次肌力運動（深蹲、彈力帶）","飯後散步 10–15 分鐘","久坐每 30 分鐘起來動一動"],
  panels(){
    const S=window.CK_SOAP;if(!S)return [];const m=S.mods,rx=(S.acRx||[]).join(" ")+" "+S.mods.flatMap(k=>(S.res[k]&&S.res[k].rx)||[]).join(" "),out=[];
    if(S.acEdu&&S.acEdu.length)out.push({id:"acute",label:"這次的病",icon:"check",title:"這次的病，這樣照顧",on:true,items:S.acEdu});
    if(S.next&&S.next.length)out.push({id:"labs",label:"下次要抽血",icon:"check",title:"下次回診要抽血",on:true,
      items:[S.next.join("、")].concat(S.next.some(x=>/FPG|Lipid/.test(x))?["<b>要空腹</b>：前一晚 10 點後不吃東西，可以喝白開水；早上的藥抽完血再吃"]:[])});
    if(m.includes("htn"))out.push({id:"bp",label:"量血壓 722",icon:"cuff",title:"在家量血壓：722",art:"r722",on:true,
      items:["<b>7</b> 天、每天早晚 <b>2</b> 次、每次量 <b>2</b> 遍","早上：起床 1 小時內、上完廁所、吃藥和早餐前","晚上：睡前","量前坐著休息 5 分鐘，手臂和心臟同高；回診帶紀錄"]});
    if(m.includes("dm")&&/insulin|glargine|gliclazide/i.test(rx))out.push({id:"hypo",label:"低血糖怎麼辦",icon:"candy",title:"低血糖：15-15 法則",art:"r1515",on:true,
      items:["發抖、冒冷汗、心跳快、很餓，量血糖低於 70","吃 15 公克糖：方糖 3–4 顆，或果汁、汽水半杯","15 分鐘後再量；還是低就再吃一次"]});
    if(m.includes("dm"))out.push({id:"foot",label:"照顧腳與每年檢查",icon:"foot",title:"每天看腳、每年檢查",on:true,
      items:["每天洗腳擦乾，看有沒有傷口、水泡；不打赤腳","每年：眼底、尿蛋白和腎功能、足部檢查、洗牙","流感、肺炎鏈球菌疫苗"]});
    if(m.includes("ckd"))out.push({id:"kid",label:"保護腎臟",icon:"kidney",title:"保護腎臟",on:true,
      items:["<b>不要自己吃止痛藥</b>（NSAID，例如布洛芬、某些感冒藥）","看其他科、買成藥時，說自己腎功能不好","不吃草藥、偏方、楊桃；不用低鈉鹽（鉀高）","吐、拉、吃不下時，先問醫師哪些藥要暫停"]});
    if(m.includes("wt"))out.push({id:"inj",label:"減重針注意事項",icon:"pills",title:"減重針怎麼打、怎麼吃",on:true,
      items:["固定同一天打，肚子、大腿、上臂輪流換位置","噁心：少量多餐、吃慢一點、有飽足感就停、少油","便秘：多喝水（體重 ×30–35 mL）、慢慢加纖維","懷孕或計畫懷孕要先停藥，告訴醫師"]});
    if(m.includes("smk"))out.push({id:"crave",label:"想抽菸時",icon:"leaf",title:"想抽菸時，5 分鐘就會過去",on:true,
      items:["深呼吸 10 次","喝一大杯水","離開現場，去走一走","手和嘴找事做：嚼口香糖、刷牙","戒菸專線 <b>0800-636363</b>（免費）"]});
    return out;
  },
  warn:["胸痛、喘不過氣、單側手腳無力、講話不清楚：打 <b>119</b>"],
  bring:["所有藥袋"],
  nextNote(){const S=window.CK_SOAP;return S&&S.next&&S.next.length?"回診要抽："+S.next.join("、")+(S.next.some(x=>/FPG|Lipid/.test(x))?"（空腹）":""):"";}
};
