# Generuje dwa projekty HyperFrames z cover.tpl.html:
# reel/ (1080x1920, IG Reels + Story) i square/ (1080x1080, FB). Edytuj szablon, potem `python3 build.py`.
import json, os
FORMATS = {
    "reel":   dict(H=1920, SAFE_TOP=260, SAFE_BOTTOM=600, NUM=500, NAME=190, HEAD=176, CAP=46),
    "square": dict(H=1080, SAFE_TOP=90,  SAFE_BOTTOM=90,  NUM=380, NAME=140, HEAD=150, CAP=40),
}
HF = {"$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
      "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
      "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"},
      "media": {"autoProxy": True}}
src = open("cover.tpl.html", encoding="utf-8").read()
for name, vals in FORMATS.items():
    os.makedirs(name, exist_ok=True)
    if not os.path.exists(f"{name}/assets"):
        os.symlink("../assets", f"{name}/assets")
    out = src
    for k, v in vals.items():
        out = out.replace("{{%s}}" % k, str(v))
    open(f"{name}/index.html", "w", encoding="utf-8").write(out)
    json.dump(HF, open(f"{name}/hyperframes.json", "w"), indent=2)
    json.dump({"id": f"cover-08-{name}", "name": f"cover-08-{name}"}, open(f"{name}/meta.json", "w"))
    print("wrote", name)
