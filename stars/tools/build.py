# -*- coding: utf-8 -*-
"""家醫星圖：用 graphify 建圖、分群（星座）、產出報告，再算星空版面。
用法：python3 build.py <repo>/stars
"""
import json, math, sys, random
from pathlib import Path
import networkx as nx
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json
import concepts

out = Path(sys.argv[1]); data = out / "data"; data.mkdir(parents=True, exist_ok=True)
ex = concepts.build()
(data / "extraction.json").write_text(json.dumps(ex, ensure_ascii=False, indent=1), encoding="utf-8")

G = build_from_json(ex, root="/home/claude/stars-src", directed=False)
communities = cluster(G)
cohesion = score_all(G, communities)
gods = god_nodes(G); surprises = surprising_connections(G, communities)

# 星座命名：依各群成員自動對應（成員改變時，以代表成員判斷）
NAMES = [  # (代表成員, 星座名, 說明)
  ("ldlc", "階梯座", "降 LDL 與早期合併"),
  ("comisa", "長夜座", "失眠與睡眠呼吸中止"),
  ("af", "心律座", "心房顫動與抗凝"),
  ("sarcopenia", "守腎座", "心腎保護、降糖藥與肌肉"),
  ("t1d_lada", "分型座", "糖尿病分型與低血糖"),
  ("tirzepatide", "減重座", "減重藥與年輕型糖尿病"),
  ("htn", "血壓座", "高血壓"),
  ("mtrp", "激痛座", "肌筋膜疼痛"),
  ("obesity", "代謝座", "肥胖與心腎代謝"),
]
labels, subs = {}, {}
for cid, members in communities.items():
  hit = next(((n, s) for key, n, s in NAMES if key in members), None)
  labels[cid] = hit[0] if hit else f"星座 {cid}"
  subs[cid] = hit[1] if hit else "、".join(G.nodes[m]["label"] for m in members[:3])

questions = suggest_questions(G, communities, labels)
detection = {"total_files": len(concepts.PAGES), "total_words": 0,
             "files": {"document": [v[0] for v in concepts.PAGES.values()]}}
report = generate(G, communities, cohesion, labels, gods, surprises, detection,
                  {"input": 0, "output": 0}, "/home/claude/stars-src", suggested_questions=questions)
report = report.replace(f"{len(concepts.PAGES)} files · ~0 words",
                        f"{len(concepts.PAGES)} 份內容規劃文件（claude.ai 專案「家醫科會議島」；語意抽取由 Claude 閱讀後完成）")
report = report.replace("- Token cost: 0 input · 0 output\n", "- 語意抽取：Claude 在對話中直接閱讀文件完成，未另計 token\n")
(data / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")
to_json(G, communities, str(data / "graph.json"), force=True, community_labels=labels)

# ── 星空版面：9 個星座排在 3×3 格子（相連多的星座放近一點），星座內再用 spring layout 排星星
import itertools
cids = sorted(communities)
comm_of = {n: c for c, ms in communities.items() for n in ms}
link = {}
for a, b in G.edges():
  ca, cb = comm_of[a], comm_of[b]
  if ca != cb: link[(min(ca, cb), max(ca, cb))] = link.get((min(ca, cb), max(ca, cb)), 0) + 1
VW, VH = 1600, 1000
cols = 3; rows = math.ceil(len(cids) / cols)
cells = [(c, r) for r in range(rows) for c in range(cols)]
def cost(perm):
  pos = dict(zip(perm, cells))
  return sum(w * math.hypot(pos[a][0] - pos[b][0], (pos[a][1] - pos[b][1]) * 1.2) for (a, b), w in link.items())
best = min(itertools.permutations(cids, len(cids)), key=cost) if len(cids) <= 9 else cids
cell_of = dict(zip(best, cells))
CW, CH = VW / cols, VH / rows
P = {}
for c in cids:
  ms = communities[c]; sub = G.subgraph(ms)
  lp = nx.spring_layout(sub, seed=5 + c, k=1.1 / math.sqrt(max(len(ms), 1)) * 2.2, iterations=500) if len(ms) > 1 else {ms[0]: (0, 0)}
  xs = [p[0] for p in lp.values()]; ys = [p[1] for p in lp.values()]
  span = max(max(xs) - min(xs), max(ys) - min(ys), 1e-6)
  rx = CW * 0.36 * min(1, 0.55 + len(ms) / 30); ry = CH * 0.27 * min(1, 0.55 + len(ms) / 30)
  mx = (max(xs) + min(xs)) / 2; my = (max(ys) + min(ys)) / 2
  ccx = (cell_of[c][0] + 0.5) * CW + (14 if cell_of[c][1] % 2 else -14); ccy = (cell_of[c][1] + 0.5) * CH - 22
  for n, (x, y) in lp.items():
    P[n] = (round(ccx + (x - mx) / span * 2 * rx, 1), round(ccy + (y - my) / span * 2 * ry, 1))

pagecount = {n: len(G.nodes[n]["pages"]) for n in G}
stars = {
  "built": "2026-11-12",
  "view": [VW, VH],
  "pages": {k: {"name": v[1], "url": v[2], "color": v[3]} for k, v in concepts.PAGES.items()},
  "constellations": [{"id": c, "name": labels[c], "sub": subs[c], "members": communities[c],
                      "cohesion": round(cohesion[c], 2)} for c in cids],
  "nodes": [{"id": n, "label": d["label"], "kind": d["kind"], "desc": d["desc"], "pages": d["pages"],
             "c": comm_of[n], "deg": G.degree(n), "x": P[n][0], "y": P[n][1]} for n, d in G.nodes(data=True)],
  "edges": [{"s": e["source"], "t": e["target"], "note": e.get("note", ""), "conf": e["confidence"],
             "score": e["confidence_score"]} for e in ex["edges"]],
  "hyper": [{"label": h["label"], "nodes": h["nodes"]} for h in ex["hyperedges"]],
  "bridges": [{"s": s["source"], "t": s["target"], "why": s["why"]} for s in surprises],
}
(out / "stars-data.js").write_text("window.STARS=" + json.dumps(stars, ensure_ascii=False) + ";\n", encoding="utf-8")
print(G.number_of_nodes(), "stars,", G.number_of_edges(), "lines,", len(cids), "constellations")
for c in cids: print(" ", labels[c], subs[c], len(communities[c]), "cohesion", round(cohesion[c], 2))
