/* 高血壓衛教單張設定。讀上面處方產生器的 window.CK_RX（rxPlan 的結果）與輸入欄位。 */
window.CK_CONFIG={
  key:"htn", sheetTitle:"血壓照護單", mascot:"heart", days:28,
  siteUrl:"https://ycjaca.github.io/medisland/clinic/hypertension.html",
  inputs:[{k:"sbp",label:"收縮壓",src:"xS"},{k:"dbp",label:"舒張壓",src:"xD"},{k:"wt",label:"體重 kg（可留空）",src:""}],
  numbers(v){
    const r=window.CK_RX||{},out=[];
    const tgt=(r.tgt||"<130/80").replace("，可耐受時"," ，可以的話 ");
    if(v.sbp&&v.dbp)out.push({label:"今天的血壓",value:v.sbp+"/"+v.dbp,unit:"mmHg",
      meter:{min:100,max:190,v:v.sbp,target:130,targetLabel:"目標 130",zones:[[100,120,"#7cc47f","理想"],[120,130,"#f2d257","偏高"],[130,140,"#f5a24b","第 1 級"],[140,190,"#e0605a","第 2 級"]]},
      text:"上面的數字叫收縮壓，下面叫舒張壓。你的目標：<b>"+tgt.replace(/</g,"&lt;")+"</b>。在家量的血壓比診間準，請照下面的 722 記錄。"});
    if(v.wt)out.push({label:"體重",value:v.wt,unit:"kg",text:"每減 1 公斤，血壓大約降 1 mmHg。先試著減掉 5%："+Math.round(v.wt*0.05*10)/10+" 公斤。"});
    return out;
  },
  meds(){
    const r=window.CK_RX;if(!r)return {lines:[]};
    if(r.done)return {lines:[],note:"血壓已經達標了，繼續吃原本的藥，不要自己停藥或減量。"};
    if(!r.n)return {lines:[],note:"目前先不用吃藥。先從下面的少鹽飲食、運動、減重開始，在家量血壓，回診再一起看。"};
    return {lines:(r.today||[]).filter(x=>!/先不用藥|維持/.test(x))};
  },
  medInfo:[
    [/sevikar|exforge|twynsta|amlodipine.*sartan|olmesartan.*amlodipine/i,"兩種降壓藥合一顆","少數人腳踝會腫、頭暈；起身慢慢來。"],
    [/amlodipine|nifedipine|felodipine|lercanidipine/i,"降血壓","少數人腳踝會腫、臉潮紅；不要自己停，回診告訴醫師。"],
    [/sacubitril/i,"心臟與血壓用藥","起身慢慢來；不能和 ACE 抑制劑一起吃。"],
    [/sartan|pril\b|enalapril|ramipril|perindopril/i,"降血壓，也護心護腎","起身慢慢來；想懷孕或懷孕要先告訴醫師；吐、拉、吃不下時先暫停。"],
    [/indapamide|hct|hydrochlorothiazide|chlorthalidone|furosemide/i,"利尿降壓","早上吃，晚上才不會一直跑廁所；要定期抽血看鉀和尿酸。"],
    [/spironolactone/i,"幫助降壓","要定期抽血看鉀；不要自己吃鉀片或用低鈉鹽。"],
    [/bisoprolol|carvedilol|labetalol|metoprolol|propranolol/i,"穩定心跳、降血壓","不要突然自己停藥；心跳很慢、頭暈或很喘要回診。"],
    [/doxazosin|terazosin/i,"降血壓、幫助排尿","睡前吃；剛開始吃時，晚上起床上廁所要慢慢起來。"],
    [/dapagliflozin|empagliflozin/i,"護心護腎","多喝水；吐、拉、吃不下時先暫停。"],
    [/methyldopa|labetalol/i,"懷孕期間降血壓","照產科與醫師指示。"]
  ],
  plate(){return {title:"每餐這樣吃：少鹽得舒餐",fr:[.5,.25,.25],frLabel:["半盤","1/4 盤","1/4 盤"],side:["fruit","milk","salt"],
    tips:["鹽一天 <b>5 公克</b>以內，大約 1 茶匙；醬油、沾醬、湯、醃漬和加工食品都算","多吃蔬菜、水果、全穀、堅果，少紅肉、甜食和油炸","低脂奶每天 1.5–2 杯","酒最好不喝；要喝的話男性每天 2 杯、女性 1 杯以內"]};},
  move:["每週至少 150 分鐘：快走、騎腳踏車、游泳都可以","每週 2–3 次肌力運動（彈力帶、深蹲）","血壓 ≥180/110 時先不要運動，回診討論"],
  panels(){return [
    {id:"bp722",label:"在家量血壓 722",icon:"cuff",title:"在家量血壓：722",art:"r722",on:true,
     items:["<b>7</b> 天：回診前連續量 7 天","<b>2</b> 次：早上、晚上各量一次","<b>2</b> 遍：每次量 2 遍，中間隔 1 分鐘","早上：起床 1 小時內、上完廁所、吃藥和早餐之前","量之前坐好休息 5 分鐘：背靠椅背、腳踩地、手臂和心臟同高、不說話","寫下來或拍照，回診帶來"]},
    {id:"life",label:"生活小目標",icon:"leaf",title:"生活小目標",on:true,
     items:["戒菸，也避開二手菸","睡飽；打鼾很大聲、白天很想睡要告訴醫師","止痛藥、感冒藥不要自己長期買來吃，會讓血壓升高","找到適合自己的放鬆方法"]}
  ];},
  warn:["血壓 ≥180/120，又有胸痛、很喘、頭痛得很厲害、看東西模糊","一邊手腳無力、嘴歪、說話不清楚（可能是中風）","以上請立刻打 <b>119</b> 或到急診，不要等回診"],
  bring:["722 血壓紀錄","所有藥袋（包含其他醫院、自己買的）"],
  nextNote(){const r=window.CK_RX;return r&&r.n?"開始吃藥或加藥後 2–4 週回診，醫師可能會安排抽血看腎功能和鉀。":"回診前一週量 722。";}
};
