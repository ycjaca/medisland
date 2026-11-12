/* 血脂衛教單張設定。讀 STEP 8 處方產生器的 window.CK_RX（items、tgt）與輸入欄位。 */
window.CK_CONFIG={
  key:"lipid", sheetTitle:"血脂照護單", mascot:"leaf", days:56,
  siteUrl:"https://ycjaca.github.io/medisland/clinic/dyslipidemia.html",
  inputs:[{k:"ldl",label:"LDL（壞膽固醇）",src:"rLdl"},{k:"tgt",label:"LDL 目標",src:"nTgt"},{k:"tg",label:"三酸甘油脂",src:"rTg"}],
  numbers(v){
    const out=[];
    if(v.ldl){const t=v.tgt||100;
      out.push({label:"壞膽固醇 LDL",value:v.ldl,unit:"mg/dL",meter:{min:30,max:220,v:v.ldl,target:t,targetLabel:"目標 "+t,zones:[[30,t,"#7cc47f","達標"],[t,Math.max(t+30,130),"#f2d257","偏高"],[Math.max(t+30,130),190,"#f5a24b","太高"],[190,220,"#e0605a","很高"]]},
        text:"LDL 會堆在血管壁形成斑塊，越低越好。依你的心血管風險，目標是 <b>&lt;"+t+"</b>"+(v.ldl>=t?"，還要再降 <b>"+Math.round((1-(t-1)/v.ldl)*100)+"%</b>。":"，已經達標。")});}
    if(v.tg)out.push({label:"三酸甘油脂 TG",value:v.tg,unit:"mg/dL",meter:{min:50,max:600,v:v.tg,target:150,targetLabel:"150",zones:[[50,150,"#7cc47f","正常"],[150,200,"#f2d257","偏高"],[200,500,"#f5a24b","高"],[500,600,"#e0605a","很高"]]},
        text:v.tg>=500?"太高會引起胰臟炎：一定要戒酒、少吃甜食和油炸。":v.tg>=150?"跟甜食、飲料、喝酒、體重最有關係，少吃這些很快就會降。":"維持現在的飲食。"});
    return out;
  },
  meds(){
    const r=window.CK_RX;if(!r||!r.items)return {lines:[]};
    if(r.done)return {lines:[],note:"膽固醇已經達標了，繼續吃原本的藥，不要自己停藥。"};
    if(r.none)return {lines:[],note:"目前先不用吃藥。先從下面的飲食和運動開始，過幾個月再抽血看看。"};
    const it=r.items.filter(i=>/statin|ezetimibe|atozet|vytorin|fenofibrate|bempedoic|^改高強度|^加 /i.test(i.name)&&!/^或/.test(i.name));
    if(!it.length)return {lines:[],note:"原本的藥照常吃；這次要調整的藥，請醫師寫在這裡。"};
    return {lines:it.map(i=>i.name.replace(/^改高強度：|^加 /,"").replace(/（.*?）/g,"").replace(/\s*qd$/i,"").trim()+"｜每天 1 次，固定時間吃")};
  },
  medInfo:[
    [/atozet|vytorin|tonvasca/i,"兩種降膽固醇藥合一顆","固定時間吃；肌肉很痠或尿變茶色要回診。"],
    [/simvastatin|pravastatin|lovastatin/i,"降膽固醇","晚上吃效果比較好；肌肉很痠、沒力或尿變茶色要回診。"],
    [/statin/i,"降膽固醇、保護血管","每天固定時間吃，早晚都可以；肌肉很痠、沒力或尿變茶色要回診。"],
    [/ezetimibe/i,"減少腸道吸收膽固醇","每天 1 顆，什麼時間都可以；副作用很少。"],
    [/fenofibrate/i,"降三酸甘油脂","跟飯一起吃；要定期抽血看腎功能。"],
    [/bempedoic/i,"降膽固醇（自費）","每天 1 顆；有痛風的人注意關節痛。"]
  ],
  plate(){return {title:"每餐這樣吃：護心餐盤",fr:[.5,.25,.25],frLabel:["半盤","1/4 盤","1/4 盤"],side:["fruit","water","boba"],
    tips:["少吃<b>肥肉、豬皮、雞皮、內臟、奶油、酥皮</b>和油炸、加工肉（香腸、培根）","多吃燕麥、豆類、蔬菜，可溶性纖維會帶走膽固醇","蛋白質多選魚、豆腐、去皮雞肉；用植物油、少量堅果","三酸甘油脂高：<b>少甜食和含糖飲料，不喝酒</b>"]};},
  move:["每週至少 150 分鐘中等強度運動：快走、騎腳踏車、游泳","體重過重的人先減 5–10%，膽固醇和三酸甘油脂都會降","戒菸：好膽固醇會上升，心血管風險明顯下降"],
  panels(){return [
    {id:"muscle",label:"肌肉痠痛怎麼辦",icon:"pills",title:"吃降膽固醇藥，肌肉痠痛怎麼辦",on:true,
     items:["大部分人吃了都沒事；就算痠痛，多數換藥或減量後就可以繼續吃","痠痛但還能忍受：先不要自己停藥，回診時告訴醫師","很痛、沒力爬樓梯、或尿變成茶色：先停藥，<b>盡快回診</b>","不要自己吃紅麴，它和降膽固醇藥是同一種成分"]},
    {id:"blood",label:"抽血時間",icon:"check",title:"什麼時候要抽血",on:true,
     items:["開始吃藥或換藥後 <b>6–8 週</b>抽血看效果","達標後大約每 6 個月抽一次","驗膽固醇<b>不一定要空腹</b>；三酸甘油脂很高時醫師會請你空腹"]},
    {id:"why",label:"為什麼要一直吃",icon:"leaf",title:"為什麼要一直吃",on:false,
     items:["膽固醇降下來是因為有吃藥，停藥 2–3 個月就會回到原來的數字","長期把 LDL 壓低，心肌梗塞和中風的機會會明顯下降","有任何副作用，先跟醫師討論換藥，不要自己停"]}
  ];},
  warn:["胸口悶痛、冒冷汗超過 5 分鐘，或突然單側手腳無力、講話不清楚：打 <b>119</b>","肌肉劇痛、全身無力、尿變茶色","肚子劇痛（三酸甘油脂很高的人要特別注意胰臟炎）"],
  bring:["所有藥袋","其他醫院的抽血報告"],
  nextNote(){return "約 6–8 週後回診抽血，看藥有沒有效。";}
};
