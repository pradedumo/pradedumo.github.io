# Paul Ryan Dedumo — Portfolio

Personal portfolio of Paul Ryan Dedumo — QA Engineer · AI Video Creator · Sales Research.

**Live:** https://pradedumo.github.io/

## What this repo demonstrates

Static site (plain HTML/CSS/JS, no framework) with the same discipline I apply to product QA:

- **Prettier** formatting enforced on commit (`.githooks/pre-commit`) and re-checked on push.
- **HTMLHint** standards check on every push (`.github/workflows/lint.yml`).
- **Link validation** on every push (`.github/workflows/validate.yml`).
- Case studies, reels, and spec creatives are real work — no placeholder metrics.

## Local

```bash
npm install          # also wires the git hooks
npm run format       # prettier --write
npm run lint:html    # htmlhint index.html
python3 -m http.server 8080   # then open http://localhost:8080
```
