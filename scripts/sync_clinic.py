"""Rewrite a 門診實務 page copied from its claude.ai artifact so it works inside this site.

usage: python3 scripts/sync_clinic.py clinic/hypertension.html clinic/diabetes.html clinic/ckd.html

Links to other pages of this site become relative paths and open in the same tab.
Run it after copying a newer artifact version over a file in clinic/.
"""
import re, sys

SITE = {
    "https://claude.ai/artifact/W4L8AycTWAkj5ceXV7fHNX": "../",                      # garden
    "https://claude.ai/artifact/GoW34KJ2JKNixjYsTUm3gv": "hypertension.html",
    "https://claude.ai/artifact/MduFP3DfAx3cnTSzD9FSef": "diabetes.html",
    "https://claude.ai/artifact/QvQEDByHShRVr2o1tnkenz": "ckd.html",
    "https://claude.ai/artifact/XAGh8aTC6b3aEaNrSYWRgx": "../islands/#ldl-c",
    "https://claude.ai/artifact/YFqwB8sBG1N1NjVyNtmLXp": "../islands/#type2-diabetes",
    "https://claude.ai/artifact/AsRZrXcHpEmiWy2jMqytGM": "../islands/#obesity",
    "https://claude.ai/artifact/WVRQmxhQwAukZJoLNRhgkB": "../islands/#atrial-fibrillation",
    "https://claude.ai/artifact/VKrmtoSvoJyvkYUy6Fyi5h": "../islands/#sleep",
    "https://claude.ai/artifact/BxpoPFfCYsdA94Pb2raxEK": "../islands/#sarcopenia",
    "https://claude.ai/artifact/15ViyxNx6uCaKusbcYuZJb": "../islands/#myofascial-pain",
    "https://claude.ai/artifact/15rWYiiNvKvS12RoHrhYNF": "../islands/",
    "https://ycjaca.github.io/medisland/#obesity": "../islands/#obesity",
    "https://ycjaca.github.io/medisland/islands/": "../islands/",
    "https://ycjaca.github.io/medisland/stars/": "../stars/",
    "https://ycjaca.github.io/medisland/clinic/": "./",
    "https://ycjaca.github.io/medisland/": "../",
}

def fix(html):
    def repl(m):
        tag = m.group(0)
        href = m.group(2)
        for full, rel in SITE.items():
            if href == full or href.startswith(full + "#") and full.startswith("https://claude.ai/"):
                new = rel + href[len(full):] if href != full else rel
                tag = tag.replace(f'href="{href}"', f'href="{new}"')
                tag = re.sub(r'\s+target="_(blank|top)"', "", tag)
                tag = re.sub(r'\s+rel="noopener(?: noreferrer)?"', "", tag)
                return tag
        return tag
    html = re.sub(r'<a\b([^>]*?)href="([^"]+)"[^>]*>', repl, html)
    # the hypertension page's breadcrumb has no link: give it one
    html = html.replace('<div class="crumb">ycjacademy／', '<div class="crumb"><a href="../">ycjacademy</a>／', 1)
    return html

for path in sys.argv[1:]:
    s = open(path, encoding="utf-8").read()
    t = fix(s)
    open(path, "w", encoding="utf-8").write(t)
    left = sorted(set(re.findall(r"https://claude\.ai/artifact/[A-Za-z0-9]+", t)))
    print(path, "ok" if not left else "still links to claude.ai: " + ", ".join(left))
