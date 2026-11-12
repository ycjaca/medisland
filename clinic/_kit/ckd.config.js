/* 慢性腎臟病衛教單張設定。讀 STEP 9 處方產生器的 window.CK_RX（items）與輸入欄位。 */
window.CK_CONFIG={
  key:"ckd", sheetTitle:"護腎照護單", mascot:"kidney", days:90,
  siteUrl:"https://ycjaca.github.io/medisland/clinic/ckd.html",
  inputs:[{k:"egfr",label:"eGFR",src:"rEgfr"},{k:"acr",label:"UACR mg/g",src:"rAcr"},{k:"k",label:"鉀 K",src:"rK",step:.1},{k:"sbp",label:"收縮壓",src:"rSbp"}],
  numbers(v){
    const out=[];
    if(v.egfr!=null){const g=v.egfr>=90?"G1":v.egfr>=60?"G2":v.egfr>=45?"G3a":v.egfr>=30?"G3b":v.egfr>=15?"G4":"G5";
      out.push({label:"腎絲球過濾率 eGFR（第 "+g+" 期）",value:v.egfr,unit:"mL/min",meter:{min:0,max:120,v:v.egfr,zones:[[0,15,"#d9534f","G5"],[15,30,"#e8744a","G4"],[30,45,"#f5a24b","G3b"],[45,60,"#f2d257","G3a"],[60,90,"#a9d47e","G2"],[90,120,"#7cc47f","G1"]]},
        text:"可以想成腎臟過濾的能力大約剩 <b>"+Math.round(v.egfr)+" 分</b>（滿分約 100）。目標是讓它慢一點往下掉。"});}
    if(v.acr!=null){const a=v.acr<30?"A1":v.acr<=300?"A2":"A3";
      out.push({label:"尿蛋白 UACR（"+a+"）",value:v.acr,unit:"mg/g",meter:{min:3,max:3000,log:true,v:v.acr,target:30,targetLabel:"30",zones:[[3,30,"#7cc47f","正常"],[30,300,"#f2d257","中度"],[300,3000,"#e0605a","重度"]]},
        text:"尿裡的蛋白是腎臟受傷的訊號，<b>越低越好</b>。吃對藥、控制血壓血糖，可以讓它下降。"});}
    if(v.k!=null)out.push({label:"血鉀 K",value:v.k,unit:"mmol/L",meter:{min:3,max:6.5,v:v.k,zones:[[3,3.5,"#f2d257","偏低"],[3.5,5,"#7cc47f","正常"],[5,5.5,"#f5a24b","偏高"],[5.5,6.5,"#e0605a","太高"]]},
        text:v.k>5?"鉀偏高：請看下面「少吃高鉀食物」。":"鉀在正常範圍。"});
    if(v.sbp)out.push({label:"今天的收縮壓",value:v.sbp,unit:"mmHg",meter:{min:100,max:180,v:v.sbp,target:120,targetLabel:"目標 120",zones:[[100,120,"#7cc47f","理想"],[120,130,"#f2d257","可以更好"],[130,180,"#f5a24b","偏高"]]},text:"血壓控制好是護腎最重要的事之一。"});
    return out;
  },
  meds(){
    const r=window.CK_RX;if(!r||!r.items)return {lines:[]};
    const it=r.items.filter(i=>!/：|未建議|不適用|非必要|無法使用|不新開|已達/.test(i.name));
    return {lines:it.map(i=>i.name.replace(/加到最大耐受劑量|維持最大耐受劑量/,"（護腎血壓藥）").replace(/繼續用/,"").replace(/^起始 /,""))};
  },
  medInfo:[
    [/ACEi|ARB|sartan|pril\b/i,"護腎、降尿蛋白、降血壓","起身慢慢來；吐、拉、吃不下時先暫停；要定期抽血看鉀。"],
    [/SGLT2|flozin/i,"護腎護心","多喝水；吐、拉、吃不下時先暫停。"],
    [/finerenone/i,"護腎、減少尿蛋白","要定期抽血看鉀。"],
    [/statin/i,"降血脂、保護血管","肌肉痠痛無力要告訴醫師。"],
    [/GLP-1|glutide/i,"降血糖、護腎","剛開始可能噁心：吃少一點、慢一點。"],
    [/patiromer|zirconium|kayexalate|calcium polystyrene/i,"降血鉀","照醫師說的時間吃，和其他藥隔開。"],
    [/bicarbonate|小蘇打/i,"矯正血液偏酸",""]
  ],
  plate(v){const kHigh=v.k!=null&&v.k>5;return {title:"每餐這樣吃：護腎餐盤",fr:[.45,.17,.38],frLabel:["近半盤","適量，約一掌心","1/3 多"],proLabel:"豆魚蛋肉",side:["water","salt","star"],
    tips:["鹽一天 <b>5 公克</b>以內；<b>不要用低鈉鹽</b>（含鉀）","豆魚蛋肉要吃但<b>不要過量</b>，一餐大約一個掌心","熱量要夠，主食不用刻意少吃，才不會消耗肌肉","<b>不吃楊桃</b>，也不吃來路不明的中草藥、偏方"].concat(kHigh?["鉀偏高：蔬菜先切小再用滾水燙過再炒，湯汁不要喝"]:[])};},
  move:["每週 150 分鐘中等強度運動，量力而為","每週 2–3 次肌力運動，保住肌肉","戒菸"],
  panels(v,meds){return [
    {id:"protect",label:"護腎五件事",icon:"kidney",title:"護腎五件事",on:true,
     items:["止痛藥只吃醫師開的；藥局自己買的止痛藥、來路不明的中草藥不要吃","看別科、做電腦斷層或打顯影劑前，先說「我腎臟不好」","控制血壓、血糖","吐、拉、吃不下、發燒時，先暫停降血糖藥、血壓藥、利尿劑、止痛藥，能吃喝 1–2 天後再恢復","每 3–6 個月抽血驗尿，把數字記下來"]},
    {id:"potassium",label:"少吃高鉀食物",icon:"warn",title:"鉀偏高：這些先少吃",on:v.k!=null&&v.k>5,
     items:["香蕉、奇異果、哈密瓜、番茄","馬鈴薯、地瓜葉等深綠色蔬菜要先燙過","果汁、雞精、濃湯、肉湯、火鍋湯","低鈉鹽、薄鹽醬油（多半含鉀）"]},
    {id:"bp",label:"在家量血壓",icon:"cuff",title:"在家量血壓",on:true,
     items:["早晚各量一次，回診前連續 7 天","目標收縮壓 120 左右（醫師會依你的情況調整）","帶紀錄回診"]}
  ];},
  warn:["尿量明顯變少，或全身腫、喘到不能躺平","全身無力、心跳不規則或很慢（可能是鉀太高）","吐、拉好幾天吃不下，頭暈站不起來"],
  bring:["血壓紀錄","所有藥袋（包含中藥、保健食品）","其他醫院的抽血報告"],
  nextNote(){return "每 3–6 個月抽血驗尿；剛開始吃護腎血壓藥或加藥，2–4 週要抽血看腎功能和鉀。";}
};
