"""Insert or refresh the clinic kit (collapsible steps + 衛教單張 generator) in 門診實務 pages.

usage: python3 scripts/add_kit.py clinic/hypertension.html clinic/diabetes.html clinic/ckd.html

For clinic/<name>.html it uses clinic/_kit/<name>.config.js as the page's handout settings,
and clinic/_kit/kit.html as the shared code. Both are placed just before </body>,
between marker comments, so running it again replaces the old copy.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = open(os.path.join(ROOT, "clinic/_kit/kit.html"), encoding="utf-8").read().strip()

def block(start, end, inner):
    return start + "\n" + inner.strip() + "\n" + end

for path in sys.argv[1:]:
    name = os.path.splitext(os.path.basename(path))[0]
    cfg_path = os.path.join(ROOT, "clinic/_kit", name + ".config.js")
    html = open(path, encoding="utf-8").read()
    html = re.sub(r"\n?<!-- ck-config start -->.*?<!-- ck-config end -->", "", html, flags=re.S)
    html = re.sub(r"\n?<!-- clinic-kit v\d+ start.*?<!-- clinic-kit v\d+ end -->", "", html, flags=re.S)
    add = ""
    if os.path.exists(cfg_path):
        add += "\n" + block("<!-- ck-config start -->", "<!-- ck-config end -->", "<script>\n" + open(cfg_path, encoding="utf-8").read().strip() + "\n</script>")
    else:
        print(path, "no config file", cfg_path, "→ only collapsible steps, no handout")
    add += "\n" + KIT + "\n"
    i = html.rfind("</body>")
    html = html[:i].rstrip() + add + html[i:]
    open(path, "w", encoding="utf-8").write(html)
    print(path, "kit added" + (" with handout" if os.path.exists(cfg_path) else ""))
