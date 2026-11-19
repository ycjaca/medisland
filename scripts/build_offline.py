"""Build an offline copy of the whole site (garden, islands, stars, clinic, toolbox).

usage: python3 scripts/build_offline.py [OUT_DIR]      (default: ../ycjacademy-offline)

The result opens by double-clicking index.html, with no internet:
- Google Fonts and three.js are replaced by local copies in vendor/ (downloaded once with npm).
- islands/index.html normally fetch()es its pages, which browsers block on file://,
  so the pages are embedded into it.
- Links to folders ("../", "islands/", "clinic/toolbox/") get an explicit index.html,
  because file:// does not open index.html by itself.
Reference links to papers and guidelines stay online links.
"""
import json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "..", "ycjacademy-offline"))
DEPS = os.environ.get("OFFLINE_DEPS", os.path.join(ROOT, "..", ".offline-deps"))
SKIP = {".git", "scripts", ".github"}
SKIP_FILES = {"README.md", ".nojekyll"}
SKIP_SUB = [os.path.join("stars", "tools")]

FONTS = [("noto-sans-tc", [400, 500, 700]), ("lxgw-wenkai-tc", [400, 700]), ("ibm-plex-mono", [400, 500])]


def deps():
    nm = os.path.join(DEPS, "node_modules")
    if not os.path.isdir(os.path.join(nm, "three")):
        os.makedirs(DEPS, exist_ok=True)
        subprocess.run(["npm", "init", "-y"], cwd=DEPS, check=True, stdout=subprocess.DEVNULL)
        subprocess.run(["npm", "i", "-s", "three@0.128.0"] + ["@fontsource/" + f for f, _ in FONTS], cwd=DEPS, check=True)
    return nm


def vendor(nm):
    v = os.path.join(OUT, "vendor")
    os.makedirs(os.path.join(v, "fonts"), exist_ok=True)
    shutil.copy(os.path.join(nm, "three", "build", "three.min.js"), os.path.join(v, "three.min.js"))
    css = []
    for fam, weights in FONTS:
        base = os.path.join(nm, "@fontsource", fam)
        for w in weights:
            t = open(os.path.join(base, "%d.css" % w), encoding="utf-8").read()
            t = re.sub(r",\s*url\(\./files/[^)]+\.woff\) format\('woff'\)", "", t)
            for f in re.findall(r"url\(\./files/([^)]+\.woff2)\)", t):
                shutil.copy(os.path.join(base, "files", f), os.path.join(v, "fonts", f))
            css.append(t.replace("url(./files/", "url("))
    open(os.path.join(v, "fonts", "fonts.css"), "w", encoding="utf-8").write("\n".join(css))


DIR_STR = re.compile(r"""(["'])((?:\.\./)+|\./|(?:\.\./)*(?:islands|stars|clinic|toolbox)(?:/[\w-]+)*/)(#[^"']*)?\1""")


def fix_html(html, rel):
    html = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.g[^>]*>', "", html)
    html = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?[^"]*" rel="stylesheet">',
                  '<link href="%svendor/fonts/fonts.css" rel="stylesheet">' % rel, html)
    html = html.replace("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", rel + "vendor/three.min.js")
    # site links that point at the GitHub Pages copy
    html = re.sub(r"https://ycjaca\.github\.io/medisland/([^\"'\s)<]*)",
                  lambda m: rel + (m.group(1) if m.group(1) and not m.group(1).startswith("#") else "index.html" + m.group(1)), html)
    html = DIR_STR.sub(lambda m: m.group(1) + m.group(2) + "index.html" + (m.group(3) or "") + m.group(1), html)
    return html


def main():
    nm = deps()
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    for d, dirs, files in os.walk(ROOT):
        r = os.path.relpath(d, ROOT)
        dirs[:] = [x for x in dirs if x not in SKIP and os.path.normpath(os.path.join(r, x)) not in SKIP_SUB]
        for f in files:
            if r == "." and f in SKIP_FILES:
                continue
            src, dst = os.path.join(d, f), os.path.join(OUT, r, f)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if f.endswith(".html"):
                depth = 0 if r == "." else len(r.split(os.sep))
                txt = fix_html(open(src, encoding="utf-8").read(), "../" * depth)
                open(dst, "w", encoding="utf-8").write(txt)
            else:
                shutil.copy(src, dst)
    vendor(nm)

    # islands: embed pages so the shell works without fetch()
    isl = os.path.join(OUT, "islands")
    shell = os.path.join(isl, "index.html")
    pages = {f[:-5]: open(os.path.join(isl, f), encoding="utf-8").read()
             for f in os.listdir(isl) if f.endswith(".html") and f != "index.html"}
    s = open(shell, encoding="utf-8").read()
    hook = "async function getPage(page){\n  if(cache[page]) return cache[page];"
    assert hook in s, "islands getPage changed; update build_offline.py"
    s = s.replace(hook, hook + "\n  if(window.OFFLINE_PAGES && OFFLINE_PAGES[page]) return cache[page] = OFFLINE_PAGES[page];")
    blob = json.dumps(pages, ensure_ascii=False).replace("</", "<\\/")
    s = s.replace("</head>", "<script>window.OFFLINE_PAGES=" + blob + ";</script>\n</head>", 1)
    open(shell, "w", encoding="utf-8").write(s)

    # a plain table of contents, in case the 3D garden is too heavy for a computer
    toc = [("花園（3D 方塊世界）", "index.html"), ("家醫群島", "islands/index.html"), ("家醫星圖", "stars/index.html"),
           ("門診實務目錄", "clinic/index.html")]
    for f in sorted(os.listdir(os.path.join(OUT, "clinic"))):
        if f.endswith(".html") and f != "index.html":
            t = re.search(r"<title>([^<]*)", open(os.path.join(OUT, "clinic", f), encoding="utf-8").read())
            toc.append(("　" + (t.group(1) if t else f), "clinic/" + f))
    for f in sorted(os.listdir(os.path.join(OUT, "clinic", "toolbox"))):
        if f.endswith(".html"):
            t = re.search(r"<title>([^<]*)", open(os.path.join(OUT, "clinic", "toolbox", f), encoding="utf-8").read())
            toc.append(("　工具箱｜" + (t.group(1) if t else f), "clinic/toolbox/" + f))
    li = "\n".join('<li><a href="%s">%s</a></li>' % (h, n) for n, h in toc)
    open(os.path.join(OUT, "目錄.html"), "w", encoding="utf-8").write(
        '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>ycjacademy 離線版目錄</title><link href="vendor/fonts/fonts.css" rel="stylesheet"><style>'
        'body{font-family:"Noto Sans TC",sans-serif;max-width:640px;margin:40px auto;padding:0 18px;color:#2a2622;background:#faf7f2;line-height:1.7}'
        'h1{font-family:"LXGW WenKai TC",serif;font-size:28px}a{color:#2f6f6a;text-decoration:none}a:hover{text-decoration:underline}'
        'li{padding:4px 0}ul{list-style:none;padding:0}small{color:#857}</style></head><body><h1>ycjacademy 離線版</h1>'
        '<ul>' + li + '</ul><small>不用連網即可使用。文獻與指引的參考連結仍需連網開啟。</small></body></html>')
    print("built", OUT)


if __name__ == "__main__":
    main()
