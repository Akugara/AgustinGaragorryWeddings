#!/usr/bin/env python3
"""
Static include builder for the site.

Shared blocks (nav, footer, Instagram) live once in partials/*.html.
Each page marks where a block goes with:

    <!-- @include nav -->
    ...whatever is here gets replaced by partials/nav.html...
    <!-- @endinclude nav -->

Run `python3 build.py` after editing a partial (e.g. adding a new wedding to
partials/nav.html), then commit. Output stays plain static HTML for GitHub Pages.
"""
import re, glob, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PARTIALS_DIR = os.path.join(ROOT, "partials")

def main():
    partials = {}
    for path in glob.glob(os.path.join(PARTIALS_DIR, "*.html")):
        name = os.path.splitext(os.path.basename(path))[0]
        partials[name] = open(path, encoding="utf-8").read().strip("\n")

    if not partials:
        sys.exit("No partials found in partials/")

    changed = 0
    for f in glob.glob(os.path.join(ROOT, "*.html")):
        s = open(f, encoding="utf-8").read()
        orig = s
        for name, html in partials.items():
            pat = re.compile(
                r"<!-- @include " + re.escape(name) + r" -->.*?<!-- @endinclude " + re.escape(name) + r" -->",
                re.S,
            )
            repl = f"<!-- @include {name} -->\n{html}\n<!-- @endinclude {name} -->"
            s = pat.sub(lambda _: repl, s)
        if s != orig:
            open(f, "w", encoding="utf-8").write(s)
            changed += 1
            print(f"  updated {os.path.basename(f)}")
    print(f"Done. {changed} file(s) updated, {len(partials)} partial(s): {', '.join(sorted(partials))}")

if __name__ == "__main__":
    main()
