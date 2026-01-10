# Copilot instructions for Quick Quest 🎮

Purpose: give AI coding agents the minimal, concrete context to be productive working on this TypeScript + Vite game.

## Big picture
- This is a small ExcaliburJS game (see `src/main.ts`) composed of Scenes, Actors, and a tiny global state (`src/Game/quest-state.ts`).
- Engine bootstrap: `src/main.ts` creates an Excalibur `Engine` and registers scenes (e.g., `ThroneRoom` in `src/Scenes/throneRoom.ts`). Assets are loaded via the Excalibur `Loader` exported from `src/resources.ts` and passed to `game.start(loader)`.
- Cross-component communication uses a single EventEmitter `conley` and typed event constants in `src/Events/eventTypes.ts` + event classes in `src/Events/events.ts`.

## Key files to reference
- App entry: `src/main.ts` (Engine config, scene bootstrap)
- Scenes: `src/Scenes/*` (game screens; add new scenes here)
- Actors: `src/Actors/*` (player, verbal actors, etc.) — look at `player.ts` and `verbal-actor.ts` for movement and dialog patterns
- Dialog system: `src/Dialog/*` (`dialog.ts`, `typewriter.ts`, `dialog-text.ts`), uses `DialogEvents` and `TypeWriterEvents` to show/advance dialog
- Global state: `src/Game/quest-state.ts` (flag-based scenario selection — `requires`, `bypass`, `addFlag` fields)
- Resources & assets: `src/resources.ts` and `public/` (fonts, images)
- Tests: unit tests in `tests/unit/` (vitest) and integration in `tests/` (playwright & screenshot snapshots)

## Conventions & patterns (project-specific)
- Small singletons: prefer a single exported instance for app-level state (e.g., `questState` in `src/Game/quest-state.ts`).
- Event-driven UI: components listen/emit on `conley` using typed constants (e.g., `DialogEvents.ShowDialog`) rather than ad-hoc callbacks.
- Dialog selection: dialog scenarios are arrays of `DialogScenario` (see `src/Actors/verbal-actor.ts`). `questState.getScenario` picks the first matching scenario using `requires` and `bypass` arrays.
- Asset loading: images/fonts live in `public/`; resources are registered in `src/resources.ts` and added to the loader. Use these resources instead of referencing assets ad-hoc.
- Tests mock engine input where appropriate (see `tests/unit/Actors/player.spec.ts`) — prefer creating small fakes over starting a full Engine in unit tests.

## How to run / debug / test (commands)
- Start dev server (fast iteration): `npm run dev` (Vite)
- Build (production): `npm run build` (runs `tsc && vite build`)
- Preview built site (used by integration tests): `npm run serve` (Vite preview, default port in Playwright config is 4173)
- Unit tests: `npm test` (runs `vitest run --config vitest.config.js`)
- Integration tests: `npm run test:integration` (runs `npm run build` then `npx playwright test`)
- Update Playwright screenshots: `npm run test:integration-update` (handy when intentional visual changes are made)

Notes: Playwright config increases server timeout and disables reuse on CI; integration tests assert visual snapshots (`tests/main.spec.ts` + snapshot directory `tests/main.spec.ts-snapshots/`).

## PR / change guidance (practical tips for small changes)
- When adding dialog flows, add scenarios to a `VerbalActor` in `src/Actors/*` and rely on `questState` flags to gate/advance conversation.
- If changing visuals, run integration tests and update snapshots intentionally with `npm run test:integration-update`.
- For logic changes related to movement/collision, add a unit test in `tests/unit/Actors/*` mocking input and tilemap as in `player.spec.ts`.

## Common pitfalls & gotchas
- `questState.getScenario` contains early `console.warn(scene)` which will log during tests and may be noisy — keep this in mind when running test output.
- Playwright expects `npm run serve` (preview) on port 4173; don't point integration tests to Vite dev server by default.
- The project uses strict typing: follow existing small, explicit types and exported `type` aliases (e.g., `DialogScenario`, `PortraitConfig`).

## If you're an agent making a change
- Read the relevant small files first (e.g., `dialog.ts`, `verbal-actor.ts`, `quest-state.ts`) to understand flow before changing event names or payloads.
- Add unit tests for behaviour changes (see `tests/unit/*`) and run `npm test`. For visual changes, run `npm run test:integration` and update snapshots intentionally with `npm run test:integration-update`.

---
If anything in this summary is unclear or you want more examples (e.g., how dialog messages are structured, or example Playwright debug steps), I can expand specific sections. ✅