# AGENTS.md

Slide decks for Tailcall talks, built with remark.js. Everything lives in `docs/`.

## Layout

- `docs/index.html`: remark shell. It loads `./<deck>.md` from the `?deck=<name>` query param. With no param, it loads `index.md`, the deck list.
- `docs/*.md`: one file per deck. Slides are separated by `---`, and `--` reveals the rest of a slide as an extra step.
- `docs/app.css`: shared styles.
- `docs/img/`: images and animated SVG diagrams. Use `skill://animated-svg-diagrams` when creating or editing them.

## Run

```bash
npx live-server docs --port=55922 --no-browser
```

Check whether a server is already running before you start one: `curl -sI http://127.0.0.1:55922/`.

## Test slides in a browser

Use `skill://agent-browser` to check every visual change. Don't drive headless Chrome directly. Its `--virtual-time-budget` screenshots hang without a timeout and don't advance SMIL animations inside `<img>`.

```bash
# Open a deck at a page, screenshot it, then read the PNG to look at it
agent-browser batch --bail \
  "set viewport 1600 900" \
  "open http://127.0.0.1:55922/?deck=soa-coding-agents#6" \
  "wait 1500" \
  "screenshot /tmp/slide-6.png"

# Step forward like a presenter (reveals `--` steps too)
agent-browser batch "press ArrowRight" "wait 500" "get url" "screenshot /tmp/slide-7.png"

# Read the visible slide counter
agent-browser eval --stdin <<'EOF'
document.querySelector('.remark-visible .remark-slide-number')?.innerText
EOF

agent-browser close
```

Things to know:

- **Page numbers:** the `#N` in the URL counts `--` steps, but the on-slide counter (`5 / 7`) doesn't. Map pages to slides by stepping with `ArrowRight` and reading `get url`.
- **Missing pages:** a page past the end of a deck renders as a solid orange screen.
- **Viewport:** use 1600×900 so the deck fills a 16:9 frame with no orange bars.
- **Diagrams:** to check an SVG animation at different moments, open the SVG directly, e.g. `http://127.0.0.1:55922/img/factory.svg`, take screenshots after different waits, then check the slide once for layout.
- **Validation:** validate SVGs with `xmllint --noout docs/img/<name>.svg` before screenshotting.
- **Cleanup:** run `agent-browser close` when you're done.

## Conventions

- Commit after each change with a short message describing it, then push to `origin main`.
- Don't use emojis in slides or diagrams. Use Lucide icons: `.icon[name]` in markdown, or inline paths in SVGs.
- Use title case in headings and diagram labels, and keep acronyms uppercase.
