#!/usr/bin/env python3
"""
Build the Workshift prompt library dataset from the prompts.chat source.

Source: github.com/f/awesome-chatgpt-prompts  (prompts.csv)
License: prompt data is CC0 1.0 (public domain). Skille (rekordy multi-plik
z separatorem \\x1FFILE) są WYKLUCZANE — trafiają do sekcji "link-out", nie
rehostujemy ich (licencje per-skill niejednoznaczne).

Usage:
  python3 scripts/build-prompts-data.py [SCIEZKA_DO_prompts.csv]

Default source: ~/Projekty/_scratch/awesome-chatgpt-prompts/prompts.csv
Output:         public/prompty/prompts.json
"""
import csv, sys, json, re, os
from datetime import date

csv.field_size_limit(sys.maxsize)

DEFAULT_SRC = os.path.expanduser(
    "~/Projekty/_scratch/awesome-chatgpt-prompts/prompts.csv"
)
SRC = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
# Uwaga: katalog danych MUSI być inny niż route SPA `/prompty`, inaczej Vercel
# serwuje index.json jako index katalogu i przesłania stronę. Stąd `prompty-data`.
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "prompty-data", "prompts.json")
OVERLAY = os.path.join(os.path.dirname(__file__), "prompts-pl.json")
PERSONAS_SRC = os.path.join(os.path.dirname(__file__), "personas-pl.json")

SKILL_MARKER = "\x1fFILE:"  # rekordy multi-plik = skille, wykluczamy


def slugify(text):
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    return s.strip("-") or "prompt"


# Kategorie tematyczne. Branże targetowane przez Workshift (ICP) idą PIERWSZE
# i mają priorytet w klasyfikacji — źródło: IndustriesSection.jsx + audytQuestions.js.
# Kolejność = priorytet dopasowania (pierwszy trafiony wygrywa). "inne" = fallback.
CATEGORY_KEYWORDS = [
    # --- BRANŻE (ICP Workshift) ---
    ("prawo", [r"\blawyer\b", r"attorney", r"\blegal\b", r"paralegal",
               r"litigation", r"\bcourtroom\b", r"\bgdpr\b", r"\bpatent\b",
               r"solicitor", r"barrister", r"\bnotary\b", r"legislation",
               r"contract law", r"legal contract", r"contract drafting",
               r"regulatory compliance", r"legal compliance"]),
    ("hr", [r"recruit", r"\bhr\b", r"human resources", r"hiring", r"\bresume\b",
            r"\bcv\b", r"candidate", r"\btalent\b", r"onboarding", r"payroll",
            r"job interview", r"interviewer"]),
    ("ecommerce", [r"e-?commerce", r"shopify", r"\bamazon\b", r"product description",
                   r"online store", r"dropship", r"\bretail\b", r"checkout",
                   r"merchandis", r"product listing", r"\bbuyer\b"]),
    ("marketing", [r"marketing", r"\bseo\b", r"advertis", r"copywriter", r"copywriting",
                   r"social media", r"\bbrand\b", r"campaign", r"influencer",
                   r"newsletter", r"growth hack", r"\bppc\b", r"content creator"]),
    ("produkcja", [r"manufactur", r"supply chain", r"logistic", r"\binventory\b",
                   r"warehouse", r"procurement", r"production line", r"assembly line",
                   r"factory floor", r"shop floor"]),
    ("konsulting", [r"consultant", r"business plan", r"business strategy",
                    r"\bstartup\b", r"entrepreneur", r"\badvisor\b", r"project manager",
                    r"product manager", r"\binvestor\b", r"management consult"]),
    # --- FUNKCJE (uniwersalne) ---
    ("programowanie", [r"developer", r"programmer", r"\bcode\b", r"coding", r"software",
                       r"python", r"javascript", r"\bsql\b", r"devops", r"\bapi\b",
                       r"debug", r"frontend", r"backend", r"algorithm", r"\blinux\b",
                       r"terminal", r"\bgit\b", r"\bcss\b", r"\bhtml\b", r"react",
                       r"engineer", r"database", r"\bregex\b", r"\bbash\b", r"powershell",
                       r"kubernetes", r"docker", r"\bcli\b", r"\bide\b", r"compiler"]),
    ("dane", [r"data scientist", r"data analyst", r"statistic", r"\bexcel\b",
              r"spreadsheet", r"analytics", r"machine learning", r"\bdataset\b"]),
    ("edukacja", [r"teacher", r"\btutor\b", r"professor", r"instructor", r"lecture",
                  r"\bstudent\b", r"language teacher", r"\bexam\b", r"\bteach\b",
                  r"history\b", r"philosoph", r"mathematic", r"\bscience\b", r"\bquiz\b"]),
    ("kreatywne", [r"\bartist\b", r"designer", r"midjourney", r"stable diffusion",
                   r"\blogo\b", r"illustrat", r"\bmusic\b", r"composer", r"photograph",
                   r"painting", r"\bui/ux\b", r"image prompt", r"\bgame\b", r"character",
                   r"storytell", r"\bvoice\b", r"\bdesign\b"]),
    ("pisanie", [r"\bwriter\b", r"\bwrite\b", r"\bessay\b", r"\bblog\b", r"\bstory\b",
                 r"\bpoem\b", r"\bnovel\b", r"screenwriter", r"journalist", r"\beditor\b",
                 r"proofread", r"\barticle\b", r"ghostwriter", r"translat", r"summari",
                 r"paraphras", r"rewrit"]),
    ("produktywnosc", [r"assistant", r"productivity", r"\bplanner\b", r"schedule",
                       r"organize", r"\bcoach\b", r"motivat", r"\bhabit\b",
                       r"time management", r"personal trainer", r"\bchef\b", r"\brecipe\b",
                       r"\bfitness\b", r"\btravel\b", r"\bdiet\b"]),
]
CATEGORY_PATTERNS = [(cat, re.compile("|".join(pats), re.I)) for cat, pats in CATEGORY_KEYWORDS]

# Etykiety PL + flaga ICP (do UI). Kolejność = wyświetlanie chipów.
CATEGORY_META = [
    ("prawo", "Prawo i kancelarie", True),
    ("hr", "HR i rekrutacja", True),
    ("ecommerce", "E-commerce", True),
    ("marketing", "Marketing i reklama", True),
    ("produkcja", "Produkcja i logistyka", True),
    ("konsulting", "Konsulting i B2B", True),
    ("programowanie", "Programowanie", False),
    ("dane", "Dane i analiza", False),
    ("edukacja", "Edukacja", False),
    ("kreatywne", "Kreatywne", False),
    ("pisanie", "Pisanie i treści", False),
    ("produktywnosc", "Produktywność", False),
    ("inne", "Inne", False),
]


def categorize(act, body, ptype):
    haystack = f"{act} {body[:400]}"
    for cat, pat in CATEGORY_PATTERNS:
        if pat.search(haystack):
            return cat
    if ptype == "IMAGE":
        return "kreatywne"
    return "inne"


def main():
    with open(SRC, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    prompts = []
    seen = {}
    skipped_skills = 0
    for r in rows:
        body = r.get("prompt") or ""
        if SKILL_MARKER in body:           # to skill, nie prompt
            skipped_skills += 1
            continue
        act = (r.get("act") or "").strip()
        if not act or not body.strip():
            continue
        slug = slugify(act)
        seen[slug] = seen.get(slug, 0) + 1
        if seen[slug] > 1:
            slug = f"{slug}-{seen[slug]}"
        ptype = (r.get("type") or "TEXT").strip()
        prompts.append({
            "id": slug,
            "act": act,
            "prompt": body.strip(),
            "type": ptype,                                 # TEXT | STRUCTURED | IMAGE
            "category": categorize(act, body, ptype),
            "forDevs": (r.get("for_devs") or "").strip().lower() == "true",
            "contributor": (r.get("contributor") or "").strip(),
            "lang": "en",
            "source": "prompts.chat",
        })

    # --- Overlay PL: tłumaczenia + autorskie prompty Workshift ---
    # Ręcznie utrzymywany plik; doklejany przy każdym buildzie, żeby regeneracja
    # z CSV nie kasowała polskiej treści.
    n_translated = n_added = 0
    if os.path.exists(OVERLAY):
        overlay = json.load(open(OVERLAY, encoding="utf-8"))
        by_id = {p["id"]: p for p in prompts}
        for pid, tr in (overlay.get("translations") or {}).items():
            p = by_id.get(pid)
            if not p:
                continue
            p["actPl"] = tr["act"]
            p["promptPl"] = tr["prompt"]
            p["lang"] = "pl"
            n_translated += 1
        for a in (overlay.get("additions") or []):
            act = a["act"]
            prompts.append({
                "id": a.get("id") or "ws-" + slugify(act),
                "act": act,
                "actPl": act,
                "prompt": a["prompt"],
                "promptPl": a["prompt"],
                "type": a.get("type", "TEXT"),
                "category": a.get("category") or categorize(act, a["prompt"], "TEXT"),
                "forDevs": bool(a.get("forDevs", False)),
                "contributor": "Workshift",
                "lang": "pl",
                "source": "workshift",
            })
            n_added += 1

    # Autorskie prompty Workshift na górę, reszta zachowuje kolejność CSV.
    prompts.sort(key=lambda p: 0 if p.get("source") == "workshift" else 1)

    from collections import Counter
    cat_counts = Counter(p["category"] for p in prompts)
    categories = [
        {"key": k, "label": lbl, "industry": ind, "count": cat_counts.get(k, 0)}
        for k, lbl, ind in CATEGORY_META
        if cat_counts.get(k, 0) > 0
    ]

    meta = {
        "source": "prompts.chat (f/awesome-chatgpt-prompts)",
        "sourceUrl": "https://prompts.chat",
        "license": "CC0-1.0",
        "count": len(prompts),
        "generated": date.today().isoformat(),
        "note": "Skille wykluczone z rehostu (link-out). Prompty = CC0.",
        "categories": categories,
    }
    data = {"meta": meta, "prompts": prompts}

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

    # Lekki indeks: lista + wyszukiwarka renderują się natychmiast,
    # pełne treści promptów doczytujemy z prompts.json w tle / on-demand.
    def preview_of(p):
        src = p.get("promptPl") or p["prompt"]
        return src[:160].replace("\n", " ").strip()

    index = {
        "meta": data["meta"],
        "prompts": [{
            "id": p["id"],
            "act": p.get("actPl") or p["act"],   # tytuł PL gdy dostępny
            "type": p["type"],
            "category": p["category"],
            "forDevs": p["forDevs"],
            "lang": p.get("lang", "en"),
            "source": p.get("source", "prompts.chat"),
            "preview": preview_of(p),
        } for p in prompts],
    }
    index_out = os.path.join(os.path.dirname(OUT), "index.json")
    with open(index_out, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, separators=(",", ":"))

    # --- Persony (autorskie system prompty PL) ---
    n_personas = 0
    if os.path.exists(PERSONAS_SRC):
        psrc = json.load(open(PERSONAS_SRC, encoding="utf-8"))
        label_by_key = {k: lbl for k, lbl, _ in CATEGORY_META}
        personas = []
        for x in psrc.get("personas", []):
            personas.append({**x, "categoryLabel": label_by_key.get(x.get("category"), "")})
        personas_out = os.path.join(os.path.dirname(OUT), "personas.json")
        with open(personas_out, "w", encoding="utf-8") as f:
            json.dump({"meta": {"count": len(personas), "generated": date.today().isoformat()},
                       "personas": personas}, f, ensure_ascii=False, separators=(",", ":"))
        n_personas = len(personas)
        print(f"OK -> {os.path.relpath(personas_out)}  ({os.path.getsize(personas_out)/1024:.0f} KB)")

    print(f"OK -> {os.path.relpath(OUT)}  ({os.path.getsize(OUT)/1024:.0f} KB)")
    print(f"OK -> {os.path.relpath(index_out)}  ({os.path.getsize(index_out)/1024:.0f} KB)")
    print(f"Promptów: {len(prompts)} | pominięto skilli: {skipped_skills} | persony: {n_personas}")
    print(f"PL: przetłumaczone {n_translated} | autorskie Workshift {n_added}")
    print("Rozkład kategorii:")
    for c in categories:
        tag = " [ICP]" if c["industry"] else ""
        print(f"  {c['key']:<14} {c['count']:>4}{tag}")


if __name__ == "__main__":
    main()
