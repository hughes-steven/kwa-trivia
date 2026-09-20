#!/usr/bin/env python3
"""
Regenerate data/questions.js from the "Database" sheet of the KWA Trivia
Excel workbook.

Usage:
    python3 scripts/import_xlsx.py "KWA Trivia Game.xlsm" [--out data/questions.js]

Requires: pip install openpyxl

Expected sheet layout (as in the original workbook):
    - A header row per category: column B = category name, column C = "Answer"
    - Question rows: column A = number, B = question, C = answer text,
      D..G = options A..D. Blank question rows are skipped.
The correct option is found by matching the answer text against the options
(ignoring case, punctuation and a leading "A) " style prefix). Rows whose
answer can't be matched are reported so you can fix them by hand.
"""
import argparse
import json
import re
import sys

try:
    import openpyxl
except ImportError:
    sys.exit("openpyxl is required: pip install openpyxl")

SKIP_CATEGORIES = {"NOT USED RIGHT NOW"}


def norm(s):
    s = "" if s is None else str(s)
    s = re.sub(r"^\s*[A-Ea-e][\)\.]\s*", "", s)      # strip "A) " prefix
    s = re.sub(r"\s*\(.*?\)\s*", " ", s)            # drop parentheticals
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def find_answer(answer, options):
    a = norm(answer)
    opts = [norm(o) for o in options]
    if a in opts:
        return opts.index(a)
    for i, o in enumerate(opts):
        if o and (o in a or a in o):
            return i
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("workbook")
    ap.add_argument("--sheet", default="Database")
    ap.add_argument("--out", default="data/questions.js")
    args = ap.parse_args()

    wb = openpyxl.load_workbook(args.workbook, data_only=True)
    ws = wb[args.sheet]

    categories, current, problems = [], None, []
    for row in ws.iter_rows(values_only=True):
        a, b, c, *opts = (list(row) + [None] * 8)[:8]
        opts = opts[:4]
        if isinstance(b, str) and c == "Answer":
            current = {"name": b.strip(), "questions": []}
            if current["name"] not in SKIP_CATEGORIES:
                categories.append(current)
            continue
        if current is None or not isinstance(b, str) or not b.strip():
            continue
        if a == 0 or b.strip() == "Choose A Question":
            continue
        options = [str(o).strip() if o is not None else "" for o in opts]
        if not all(options):
            continue
        idx = find_answer(c, options)
        if idx is None:
            problems.append((current["name"], b, c))
            idx = 0
        current["questions"].append({"q": b.strip(), "options": options, "answer": idx})

    categories = [cat for cat in categories if cat["questions"]]
    data = {"title": "KW AccessAbility Trivia", "categories": categories}

    header = open(args.out, encoding="utf-8").read().split("window.KWA_TRIVIA")[0] if _exists(args.out) else ""
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("window.KWA_TRIVIA = ")
        f.write(json.dumps(data, indent=2, ensure_ascii=False))
        f.write(";\n")

    total = sum(len(c["questions"]) for c in categories)
    print(f"Wrote {total} questions in {len(categories)} categories to {args.out}")
    for cat, q, ans in problems:
        print(f"  CHECK: could not match answer {ans!r} in {cat}: {q[:60]}... (set to A)")


def _exists(path):
    try:
        open(path, encoding="utf-8").close()
        return True
    except OSError:
        return False


if __name__ == "__main__":
    main()
