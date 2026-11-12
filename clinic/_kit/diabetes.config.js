/* 糖尿病衛教單張設定。讀 STEP 9 處方產生器的 window.CK_RX（items）與輸入欄位。 */
window.CK_CONFIG={
  key:"dm", sheetTitle:"血糖照護單", mascot:"drop", days:90,
  siteUrl:"https://ycjaca.github.io/medisland/clinic/diabetes.html",
  inputs:[{k:"a1c",label:"HbA1c %",src:"rA1c",step:.1},{k:"tgt",label:"目標 %",src:"rTgt",step:.5},{k:"bmi",label:"BMI",src:"rBmi",step:.1},{k:"wt",label:"體重 kg",src:"rWt"}],
  numbers(v){
    const out=[];
    if(v.a1c){const eag=Math.round(28.7*v.a1c-46.7),t=v.tgt||7;
      out.push({label:"糖化血色素 HbA1c",value:v.a1c,unit:"%",meter:{min:4.5,max:12,v:v.a1c,target:t,targetLabel:"目標 "+t,zones:[[4.5,5.7,"#7cc47f","正常"],[5.7,6.5,"#f2d257","前期"],[6.5,8,"#f5a24b","偏高"],[8,12,"#e0605a","太高"]]},
        text:"代表過去 3 個月的平均血糖，大約等於平均血糖 <b>"+eag+" mg/dL</b>。你的目標：<b>&lt;"+t+"%</b>。"});}
    if(v.bmi)out.push({label:"身體質量指數 BMI",value:v.bmi,meter:{min:15,max:35,v:v.bmi,target:24,targetLabel:"24",zones:[[15,18.5,"#9fc9e8","過輕"],[18.5,24,"#7cc47f","正常"],[24,27,"#f2d257","過重"],[27,35,"#f5a24b","肥胖"]]},
        text:v.bmi>=24&&v.wt?"減重 5–7%（約 "+Math.round(v.wt*0.05)+"–"+Math.round(v.wt*0.07)+" 公斤）血糖就會明顯改善。":"維持現在的體重。"});
    return out;
  },
  meds(){
    const r=window.CK_RX;if(!r||!r.items)return {lines:[]};
    const it=r.items.filter(i=>!/^或|^先|^超過|：|生活型態處方|或等滿/.test(i.name));
    if(r.items.some(i=>/維持現有藥物/.test(i.name)))return {lines:[],note:"血糖已經達標，繼續吃原本的藥，不要自己停藥。"};
    if(!it.length)return r.items.some(i=>/生活型態處方/.test(i.name))||!r.items.length
      ?{lines:[],note:"目前先不用吃藥。先從下面的餐盤吃法、運動、減重開始，3 個月後再驗 HbA1c。"}
      :{lines:[],note:"原本的藥照常吃；這次要調整的藥，請醫師寫在這裡。"};
    return {lines:it.map(i=>{const n=i.name.trim();
      if(/\s維持$/.test(n))return n.replace(/\s維持$/,"")+"｜照原本的方式繼續吃";
      if(/^metformin$/i.test(n)&&i.dose)return "Metformin "+i.dose.split(/[，；。]/)[0];
      return n;})};
  },
  medInfo:[
    [/glyxambi|qtern|trijardy/i,"兩種降糖藥合一顆","多喝水、注意私密處清潔；吐、拉、吃不下時先暫停。"],
    [/soliqua|xultophy/i,"胰島素加腸泌素","固定時間打；一開始可能噁心。"],
    [/metformin/i,"降血糖","跟飯一起吃，比較不會胃不舒服；要做顯影劑檢查、或吐拉吃不下時先暫停。"],
    [/gliclazide|glimepiride|glipizide|glibenclamide/i,"幫忙分泌胰島素","一定要吃飯；可能會低血糖，隨身帶糖果。"],
    [/flozin/i,"從尿液排糖，也護心護腎","多喝水、注意私密處清潔；吐、拉、吃不下時先暫停。"],
    [/gliptin/i,"幫身體在飯後分泌胰島素","很少低血糖，什麼時間吃都可以。"],
    [/glutide|tirzepatide|GLP-1/i,"降血糖、幫助減重（腸泌素）","剛開始可能噁心：吃少一點、慢一點；固定同一天打。"],
    [/胰島素|insulin|glargine|degludec|detemir/i,"補充胰島素","固定時間打、每次換位置；照醫師給的規則依空腹血糖調整；隨身帶糖果。"],
    [/pioglitazone/i,"讓胰島素更有效","注意腳腫或體重增加太快。"]
  ],
  plate(){return {title:"每餐這樣吃：糖尿病餐盤",fr:[.5,.25,.25],frLabel:["半盤","1/4 盤","1/4 盤"],side:["fruit","milk","boba"],
    tips:["飯、麵、地瓜、玉米、南瓜、芋頭都算<b>全穀雜糧</b>，每餐固定 1/4 盤","先吃菜和豆魚蛋肉，最後吃飯，飯後血糖比較穩","水果一餐一份，約一個拳頭大；不要打成果汁","口渴喝白開水或無糖茶，不喝手搖飲和含糖飲料"]};},
  move:["每週至少 150 分鐘中等強度運動，不要連續 2 天不動","飯後散步 10–15 分鐘，可以降飯後血糖","每週 2–3 次肌力運動","有用胰島素或磺醯脲類：運動前量血糖，隨身帶糖果"],
  panels(v,meds0){const st=document.getElementById("rStep"),meds=meds0+" "+(st&&st.selectedIndex>=0?st.options[st.selectedIndex].text:"");return [
    {id:"smbg",label:"量血糖",icon:"meter",title:"自己量血糖",on:/胰島素|insulin|gliclazide|glimepiride/i.test(meds),
     items:["用胰島素：每天量空腹（起床還沒吃東西時）","偶爾量飯前和飯後 2 小時，看哪一餐讓血糖最高","寫下來或拍照，回診時帶來"]},
    {id:"hypo",label:"低血糖怎麼辦",icon:"candy",title:"低血糖：15-15 法則",art:"r1515",on:/胰島素|insulin|gliclazide|glimepiride|glipizide|SU/i.test(meds),
     items:["發抖、冒冷汗、心跳快、頭暈、很餓，量血糖低於 70","吃 15 公克糖：方糖 3–4 顆，或果汁、汽水半杯（120 mL）","15 分鐘後再量；還是低就再吃一次","好了以後吃正餐或點心"]},
    {id:"sick",label:"生病時怎麼吃藥",icon:"thermo",title:"生病時（吐、拉、吃不下、發燒）",on:/flozin|metformin|glyxambi|qtern/i.test(meds),
     items:["先暫停：SGLT2 抑制劑（藥名結尾 -flozin）、metformin、磺醯脲類","<b>胰島素不要自己停</b>，多量血糖，打電話問醫師","多喝水；能正常吃喝 1–2 天後再恢復吃藥"]},
    {id:"foot",label:"照顧腳",icon:"foot",title:"每天看一次腳",on:true,
     items:["洗完腳擦乾，特別是腳趾縫","看看有沒有傷口、水泡、變色；看不到可以用鏡子","不打赤腳，穿合腳的鞋和襪子","指甲平剪，不要剪太深"]},
    {id:"yearly",label:"每年檢查",icon:"eye",title:"每年要做的檢查",on:true,
     items:["眼底檢查","驗尿蛋白（UACR）和腎功能","足部檢查","洗牙、牙周檢查","打流感、肺炎鏈球菌等疫苗"]}
  ];},
  warn:["低血糖吃糖後 15 分鐘還是沒改善，或叫不醒、意識不清：打 <b>119</b>","血糖一直超過 300，非常口渴、尿很多、噁心嘔吐、呼吸很喘","用 SGLT2 抑制劑的人：吐、肚子痛、很喘、很累，就算血糖不高也要就醫"],
  bring:["血糖紀錄","所有藥袋","其他醫院的檢驗報告"],
  nextNote(){return "約 3 個月回診驗 HbA1c；剛開始吃藥或調藥，醫師可能請你早一點回來。";}
};
