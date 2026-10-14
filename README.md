# Apostles Map (c. AD 30–100)

An interactive, source-backed map of the travels of the apostles, from the Ascension to
the death of John — built for telling the story to a group and for teachers to explore.
Every route, stay and border is a *claim* with a reliability grade (A–E) and exact
citations. Live: https://andrebaaij.github.io/church_history/

| Grade | Meaning |
|---|---|
| A | New Testament text, or contemporary archaeology/inscriptions |
| B | Early writers within ~150 years (Clement, Ignatius, Irenaeus; Josephus, Tacitus) |
| C | Later church writers relaying older material (Eusebius, Jerome) |
| D | Apocryphal acts and legend |
| E | Local tradition without an early written source |

Modern retellings such as Vreugdenhil's *Church History for Young and Old* are shown
as reference works next to the graded ancient source they rest on.

## Develop

    pnpm install
    pnpm dev                    # validates data, then starts Vite
    pnpm test                   # unit tests
    pnpm build && pnpm test:e2e # end-to-end, including an offline check

## Editing data

All content is YAML in `data/` — see `docs/superpowers/specs/2026-10-13-ancient-world-map-design.md`.
`pnpm data` fails with `file › path: message` when a claim has no source or an id is unknown.
In `pnpm dev`, "Copy as story step" turns the current map view into a story step.

## Present offline

    pnpm build && pnpm preview   # then disconnect; everything is served locally

Story mode: ← → (or a presenter clicker) to move, N for speaker notes, Esc to explore.

Licences: code MIT · data CC BY-SA 4.0 · territory geometry GPL-3.0 (see `data/`).
