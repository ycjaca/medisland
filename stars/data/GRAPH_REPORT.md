# Graph Report - stars-src  (2026-11-12)

## Corpus Check
- 8 份內容規劃文件（claude.ai 專案「家醫科會議島」；語意抽取由 Claude 閱讀後完成）
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 123 nodes · 184 edges · 9 communities
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.81)
- 語意抽取：Claude 在對話中直接閱讀文件完成，未另計 token

## Community Hubs (Navigation)
- 階梯座
- 長夜座
- 心律座
- 守腎座
- 分型座
- 減重座
- 血壓座
- 激痛座
- 代謝座

## God Nodes (most connected - your core abstractions)
1. `第二型糖尿病` - 17 edges
2. `高血壓` - 15 edges
3. `LDL-C 目標` - 14 edges
4. `阻塞型睡眠呼吸中止` - 12 edges
5. `Tirzepatide` - 12 edges
6. `肥胖` - 11 edges
7. `心房顫動` - 10 edges
8. `肌少症` - 10 edges
9. `慢性腎臟病` - 7 edges
10. `GLP-1 受體促效劑` - 7 edges

## Surprising Connections (you probably didn't know these)
- `心腎代謝症候群 CKM` --rationale_for--> `第二型糖尿病`  [INFERRED]
  sources/減重與長期維持_深入頁內容規劃.md → sources/第二型糖尿病_深入頁內容規劃.md
- `持續活化因子` --rationale_for--> `第二型糖尿病`  [EXTRACTED]
  sources/肌筋膜疼痛症_深入頁內容規劃.md → sources/第二型糖尿病_深入頁內容規劃.md
- `以體重為中心` --rationale_for--> `肥胖`  [INFERRED]
  sources/第二型糖尿病_深入頁內容規劃.md → sources/減重與長期維持_深入頁內容規劃.md
- `心腎代謝症候群 CKM` --rationale_for--> `慢性腎臟病`  [INFERRED]
  sources/減重與長期維持_深入頁內容規劃.md → sources/第二型糖尿病_深入頁內容規劃.md
- `阻塞型睡眠呼吸中止` --conceptually_related_to--> `心房顫動`  [INFERRED]
  sources/失眠與睡眠呼吸中止_深入頁內容規劃.md → sources/心房顫動中風預防_深入頁內容規劃.md

## Hyperedges (group relationships)
- **五種降 LDL 藥作用在不同位置，可以疊加** — statin, ezetimibe, bempedoic, pcsk9mab, inclisiran [EXTRACTED 1.00]
- **糖心腎代謝軸** — t2d, ckd, ascvd, obesity, hf [EXTRACTED 1.00]
- **失眠與 OSA 在 COMISA 會合** — insomnia, osa, comisa, cbti, cpap [EXTRACTED 1.00]

## Communities (9 total, 0 thin omitted)

### Community 0 - "階梯座"
Cohesion: 0.13
Nodes (17): Bempedoic acid, 糖心腎整合照護提升費, DPP-4 抑制劑, Ezetimibe, 家族性高膽固醇血症, HbA1c, Inclisiran, LDL-C 目標 (+9 more)

### Community 1 - "長夜座"
Cohesion: 0.16
Nodes (15): AASM 指引, AD109, BZRA 安眠藥, CBT-I, COMISA, CPAP, 食慾素受體拮抗劑 DORA, HABIT (+7 more)

### Community 2 - "心律座"
Cohesion: 0.12
Nodes (15): 導管電燒, ADA 2026, 心房顫動, 中風風險分數, DOAC 抗凝劑, EAST-AFNET 4, ESC 2024 AF 指引, Factor XI 抑制劑 (+7 more)

### Community 3 - "守腎座"
Cohesion: 0.20
Nodes (14): ACEi／ARB, AWGS 2025, 小腿圍・SARC-F・指環測試, 慢性腎臟病, eGFR／腎功能, GLP-1 受體促效劑, 握力, 心衰竭 (+6 more)

### Community 4 - "分型座"
Cohesion: 0.16
Nodes (12): C-peptide 與胰島抗體, DiRECT, 糖尿病共同照護網, 低血糖, 胰島素, MODY 單基因糖尿病, ORION／VICTORION, 成人預防保健 (+4 more)

### Community 5 - "減重座"
Cohesion: 0.16
Nodes (12): FIB-4, 脂肪肝 MASLD, 下一代減重藥, SELECT／SURPASS-CVOT, 自費項目, Semaglutide, STEP 1, SURMOUNT-4／STEP 4 (+4 more)

### Community 6 - "血壓座"
Cohesion: 0.20
Nodes (11): 醛固酮腎素比 ARR, Baxdrostat, BaxHTN, 鈣離子阻斷劑 CCB, 722 居家血壓, 高血壓, 台美歐高血壓指引, Spironolactone／MRA (+3 more)

### Community 7 - "激痛座"
Cohesion: 0.24
Nodes (9): Delphi 2018 激痛點共識, 五十肩, 徒手治療, 肌筋膜疼痛症, 激痛點 MTrP, 乾針與激痛點注射, 激痛點觸診, 肩痛紅旗 (+1 more)

### Community 8 - "代謝座"
Cohesion: 0.29
Nodes (7): ASCVD 動脈硬化心血管病, 肌肉量 ASM, BMI 與腰圍, Naltrexone／Bupropion, 肥胖, Orlistat, 台灣 2025 肥胖指引

## Knowledge Gaps
- **41 isolated node(s):** `顱內出血`, `家族性高膽固醇血症`, `Orlistat`, `Statin`, `Bempedoic acid` (+36 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 42 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `第二型糖尿病` connect `分型座` to `階梯座`, `長夜座`, `心律座`, `守腎座`, `減重座`, `激痛座`, `代謝座`?**
  _High betweenness centrality (0.408) - this node is a cross-community bridge._
- **What connects `顱內出血`, `家族性高膽固醇血症`, `Orlistat` to the rest of the system?**
  _41 weakly-connected nodes found - possible missing edges._
- **Should `階梯座` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._
- **Why does `高血壓` connect `血壓座` to `階梯座`, `長夜座`, `心律座`, `守腎座`, `代謝座`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **Should `心律座` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Why does `阻塞型睡眠呼吸中止` connect `長夜座` to `代謝座`, `心律座`, `減重座`, `血壓座`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._