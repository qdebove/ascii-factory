# ASCIIFactory V2

Implementation of the attached development plan, P0 and P1; P2 intentionally excluded.

## Runtime

The existing static Canvas application remains dependency-free. `engine.js` owns deterministic simulation and save migration; `world.js` owns rendering and Pointer Events; `game.js` owns UI and persistence. `offline-worker.js` runs the same simulation away from the UI thread. No server or account data is needed.

## Implemented

- Authored French game dictionary, raw/valid word value, exact material recipes, weighted or recipe-directed letter production.
- Physical word and phrase pipeline, spacing, capitalization, punctuation, structural validation, rejection routes and sentence archive.
- Permanent local longest-sentence record, word count, earliest-material duration, longest word, vocabulary collection and fastest >=100-word sentence.
- ASCII clipboard card, text copy and OS share with clipboard fallback.
- Progressive milestones, achievements, research branches, scaled building cost and gated upgrades.
- Splitter, merger, filter, buffer, recycler, priority/overflow and fast belts.
- Status, missing-letter diagnostics, lateral rejection diagnostics, stock views, output/efficiency metrics.
- Offline catch-up (up to 8 hours at 1x), pause persistence, no unlimited income through full storage, return summary.
- V1 migration preserving the map/items, local autosave, JSON export/import with confirmation and basic validation; corrupt saves are not overwritten automatically.
- Mobile canvas + bottom navigation/sheets (half/full/closed), all basic controls accessible by touch, pan/pinch and 44px minimum map cells; desktop retains sidebars.
- Interactive first-chain tutorial, lightweight opt-in synthesized audio, reduced-motion setting respected.

## Deliberate rules

Vocabulary is a small authored game lexicon, not a comprehensive language dictionary. Form validation checks >=3 recognized tokens, spaces, leading capital, terminal `. ! ?`. Optional syntax is a simple article/noun/verb prefix rule. It is not a linguistic parser. Reuse of existing phrases preserves tokens; only newly assembled phrases create new archive counts. Maximum product text is 20,000 characters and the maximum phrase target is 2,048 words.

Surplus letters do not disappear: dictionary assemblers route excess to their right and block if no receiver exists. The player must route or recycle them. Auto-sale is configurable, not globally forced. Offline and live use the same 250ms simulation step. Speed multipliers only apply while playing.

## Validation

Run `node --test tests/*.test.mjs` and `node --check dist/game.js`.

18 tests cover core progression, exact recipe consumption, physical phrase production, record persistence, validation rejection, filter/splitter/overflow conservation, recycling yield, offline/live equivalence, storage blocking, pause/cap, research rules, save migration/validation, upgrade throughput, simple syntax, container-based canvas sizing, and Pointer Events pan/tap/cancel/pinch.

Real-browser visual/mobile QA was NOT run: the required Control Browser skill was unavailable in this session. Pointer tests mock the DOM/canvas and do not establish layout correctness. Remaining manual checks: 360×800, 390×844, 412×915, 768×1024; horizontal overflow, sheets/focus/closing, portrait-to-landscape, real device pinch, save restoration, worker catch-up in a browser. No claim of passing these checks is made.
