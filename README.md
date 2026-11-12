# medisland

facilitate med learning...

網站：https://ycjaca.github.io/medisland/

## 結構

| 路徑 | 內容 |
|---|---|
| `index.html` | ycjacademy 方塊花園：Minecraft 風的 3D 世界。電腦用 WASD＋滑鼠，手機用搖桿；準星對著區域按 E 進入。左上角選單有導覽模式、區域列表、地圖與設定 |
| `islands/` | 展覽會場第一檔：家醫群島（台灣家庭醫學醫學會 115 年度秋季學術研討會） |
| `clinic/` | 門診實務：`index.html` 目錄、`hypertension.html` 高血壓、`diabetes.html` 糖尿病、`ckd.html` 慢性腎臟病 |
| `clinic/_kit/` | 門診共用套件：`kit.html`（STEP／部分收合、衛教單張產生器、插圖）＋每個主題一個 `<主題>.config.js` |
| `scripts/add_kit.py` | 把 config＋套件裝進門診頁：`python3 scripts/add_kit.py clinic/<主題>.html`（可重複執行） |
| `scripts/sync_clinic.py` | 從 claude.ai artifact 複製新版門診頁後，跑這支把站內連結改成相對路徑 |

### islands/（家醫群島）

| 檔案 | 頁面 |
|---|---|
| `islands/index.html` | 外框：在同一個畫面中載入各頁，讓連結在 claude.ai 與 GitHub Pages 都能運作 |
| `islands/home.html` | 大綱頁（群島地圖） |
| `islands/type2-diabetes.html` | 年輕發病第二型糖尿病 |
| `islands/obesity.html` | 減重與長期維持 |
| `islands/atrial-fibrillation.html` | 心房顫動中風預防 |
| `islands/ldl-c.html` | 為何 LDL-C 仍未達標 |
| `islands/sleep.html` | 失眠與睡眠呼吸中止 |
| `islands/myofascial-pain.html` | 肌筋膜疼痛症 |
| `islands/sarcopenia.html` | 2025 肌少症 |

網址 hash 對應：`islands/#metabolic` 等島名開啟大綱頁的島嶼，`islands/#obesity` 開啟深入頁，`islands/#obesity--c9` 跳到該頁章節。

純靜態 HTML，由 GitHub Pages 從 `main` 分支根目錄發布。花園的 3D 畫面使用 cdnjs 上的 three.js r128；方塊材質全部由程式產生，沒有圖片檔。

## 新增門診實務主題的規則

1. 頁面每個 STEP 用 `<section id=…><div class="no">STEP n</div><h2>…</h2>…</section>`，大段落用 `<div class="part">`。套件會自動做成可收合。
2. 算處方的函式結束時設 `window.CK_RX={items:[{name,dose}],warn:[]}`，衛教單張的「我的藥」會從這裡帶入。
3. 複製 `clinic/_kit/hypertension.config.js` 改成新主題（輸入欄位、數字儀表、餐盤比例、衛教板塊、警訊、回診天數）。
4. 跑 `python3 scripts/add_kit.py clinic/<主題>.html`，並把它加進 `clinic/index.html`。
