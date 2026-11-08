# medisland

facilitate med learning...

網站：https://ycjaca.github.io/medisland/

## 結構

| 路徑 | 內容 |
|---|---|
| `index.html` | ycjacademy 花園：圓形 3D 花園，捲動頁面沿著小徑散步，點兩旁的區域進入 |
| `islands/` | 展覽會場第一檔：家醫群島（台灣家庭醫學醫學會 115 年度秋季學術研討會） |

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

純靜態 HTML，由 GitHub Pages 從 `main` 分支根目錄發布。花園的 3D 畫面使用 cdnjs 上的 three.js r128。
