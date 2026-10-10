---
name: animated-svg-diagrams
description: Create or revise animated SVG diagrams for dark presentation decks, especially workflow, architecture, systems, and process diagrams. Use whenever asked to draw, recreate, animate, or style an SVG diagram for slides, including when a reference image is provided. Emphasize clean diagram composition, readable labels, consistent geometry, iconography, and purposeful animation.
---

# Animated SVG Diagrams for Slides

Create presentation-ready SVGs that communicate a system at a glance and animate meaningfully inside a plain `<img>`. Follow the host deck's visual system rather than introducing a new visual language.

## Workflow

1. Inspect the target slide, its stylesheet, adjacent SVGs, and any reference image. Identify the slide's aspect ratio, available space, font, palette, label casing, icon assets, and animation conventions before editing.
2. Translate the reference into a semantic model: components, groups/stacks, directed flows, feedback loops, statuses, and what the animation should teach. Keep essential relationships; simplify decorative material and text only when it improves legibility.
3. Plan a grid before drawing. Align stacks to shared top/bottom baselines, use consistent box sizes and gaps within a stack, and route connectors through deliberate lanes. Avoid overlaps, dangling fragments, unexplained dots, and arbitrary spacing.
4. Implement as standalone SVG with embedded vector icons and SMIL animation only if it must work as an `<img>`. Do not rely on JavaScript, external CSS, fonts, or runtime icon downloads.
5. Validate XML, inspect a browser screenshot at the final slide size, and check the animation at multiple times where possible. Fix clipping, overlap, unreadable text, misplaced arrowheads, and animation that suggests the wrong causal order.
6. Summarize the model and animation, note any intentional simplifications, and commit changes when the user has asked for ongoing commits.

## Visual language

- For this deck, use a transparent SVG background, dark slide, Space Mono / system monospace labels, square-corner geometry, and the established accent family: orange `#f97316`, cyan `#22d3ee`, red `#ef4444`, lime `#a3e635`, dark fills `#141414`/`#111`, and bright neutral text. Check the current assets for exact usage.
- Keep ordinary boxes square-cornered when the deck asks for hard-edged geometry. Rounded corners are suitable for the outer feedback loop when explicitly desired; do not round all boxes by default.
- Use Lucide-style icons embedded as SVG paths. Align icon and label as a single visual unit around the box centerline; use consistent icon size, stroke width, and spacing. Do not substitute emoji when the deck uses icons.
- Use title case for labels in this deck; preserve acronyms exactly (e.g. LLM, MCP, CI, PM, CXO). Keep labels concise and ensure longer text fits without touching edges.
- Use color intentionally. Components may retain their identity colors; use a distinct accent for a feedback/update path. Do not make all elements monochrome unless requested. Ensure neutral labels and wire strokes remain bright enough on the dark background.
- Avoid using circles as generic message decorations if animated dashes and arrowheads already communicate flow. Reserve symbols such as sparkles for a semantically distinct signal (for example, improvement updates).

## Geometry and layout

- Choose a `viewBox` matching the slide slot and target aspect ratio. Leave margins for titles/captions and consider how the slide renderer scales the image.
- Establish a coordinate grid first. Align repeated columns/stacks to shared y positions and baselines. Use consistent dimensions and spacing within each family of boxes; make arrows land at box edges, not in empty space.
- Route orthogonal connectors with clean turns. If rounded wire joints are requested, use small arcs or quadratic corners; this does not imply rounded component boxes.
- Show direction with small, consistent arrowheads at destination edges. Keep arrowheads outside box fills and scale them for the rendered slide, not just raw SVG coordinates.
- Separate distinct concepts: requesters may feed triage without being members of a system's self-improvement boundary; outer loops should enclose only the systems they actually tune.
- Prefer a clean hierarchy: major subsystem stacks, their connecting workflow, then feedback/observability loops. Avoid a central hub unless the system actually has one.

## Animation design

- Animation should explain causality, not merely decorate the diagram. Decide what each moving element means (work item, incident, signal, improvement) and make its direction, color, destination, and timing consistent.
- Use SMIL (`animate`, `animateMotion`, `animateTransform`) for SVGs displayed as images. Give looping animations negative `begin` offsets so the diagram is active immediately.
- Coordinate related events on a shared cycle where practical: source event → signal → receiving component highlight → resulting state change. Stagger repeated events to avoid a synchronized mechanical look.
- Animate dashed-wire flow with `stroke-dashoffset` for ongoing direction. Use arrowheads to indicate direction. If moving dots add no extra semantic information, omit them; do not layer animated dashes, arrowheads, and generic dots unnecessarily.
- Use a distinct moving glyph only for a distinct semantic signal (e.g., sparkles for self-improvement). Make the glyph disappear when its trip ends so it does not park on a connector joint.
- Time arrival flashes to the actual packet/arrow arrival. Keep flashes brief and restrained; avoid free-running highlights that have no triggering event.
- For failure and scaling, choreograph cause and response: failure → work returned/reassigned → instance recovery; scale-out while demand rises and scale-in when it falls.
- Ensure `animateMotion` paths enter the destination box far enough that a paused item cannot sit visibly on its border. Keep moving items behind destination boxes when appropriate.
- Keep a single coherent loop duration where feasible. If a sub-animation uses a different duration, ensure its phase still makes sense with the main flow.

## SVG implementation and verification

- Embed icon paths directly. Do not use external `<image>` assets or network-loaded resources unless the slide deck explicitly allows them.
- Keep text as SVG `<text>` with explicit font sizing, fill, and alignment. Avoid full stops in slide labels if that is the deck's style.
- Use `<defs>` with named `<path>` elements for routes reused by both visible wires and `animateMotion`; this prevents route/packet mismatch.
- Use reusable helpers or a small generator when the diagram has many repeated tiles, cards, boxes, or animations. Keep the generator with the project when future edits are expected; do not leave the only source of truth in `/tmp`.
- Run `xmllint --noout path/to/diagram.svg` (or another XML parser) after edits.
- Verify the SVG in the actual slide/browser size and inspect screenshots visually. For SMIL, also inspect at multiple animation phases; headless screenshots of an SVG embedded in `<img>` may freeze time, so test the SVG directly or in a real browser when needed.
- Search for unintended `rx` values, stray guide lines, duplicate labels, stale wires, old terminology, and inaccessible low-contrast text after layout changes.

## Report

State which files changed, what the diagram represents, what animated elements mean and how their timing relates, what was validated visually/XML-wise, and any intentional simplifications or unresolved caveats. Never claim animation or visual validation that was not actually checked.
