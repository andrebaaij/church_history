# Apostles research — shared brief

Goal: per-apostle timelines (c. AD 30 – c. 100) with sources, feeding an interactive
historical map used first at a youth group evening, then published for teachers.
Rule: **"Claude says so" doesn't count.** Every claim needs a citable source.

## Reliability grade (per CLAIM, not per source)

| Grade | Meaning | Examples |
|---|---|---|
| A | New Testament text, or archaeology corroborating it | Acts 13–28; Gallio inscription (Delphi) |
| B | Early church writers within ~150 years | 1 Clement (c. 96), Ignatius, Papias, Irenaeus (c. 180) |
| C | Later church writers relaying older material | Eusebius (c. 300), Origen via Eusebius, Jerome |
| D | Apocryphal acts and legend | Acts of Thomas (3rd c.), Acts of Andrew, Acts of Peter |
| E | Local tradition without an early written source | Thomas in Kerala/Mylapore oral tradition |

The same author can yield different grades: Eusebius quoting a 2nd-c. document ≠
Eusebius reporting "it is said". Grade the claim by its earliest traceable source.

## Reference works (no grade of their own)

Modern retellings are recorded but never graded. Most important:
**Vreugdenhil, *Church History for Young and Old*** (Dutch: *Kerkgeschiedenis voor
jong en oud*), widely accepted in our churches. English chapters (free PDFs):
https://defenceofthetruth.com/church-history/church-history-for-young-and-old/
Relevant: ch. 1 The Apostolic Age, 2 Jewish revolt, 3–4 Destruction of Jerusalem,
5 The stone which became a mountain, 6 Nero, 7 Domitian. PDF pattern:
`https://defenceofthetruth.com/resources/church_history_for_young_&_old/1.The_Apostolic_Age.pdf`
For every claim, note whether Vreugdenhil tells it (chapter + short quote), and what
ancient source his version rests on.

## Rules

- Exact references: book chapter:verse; ancient works by book.chapter(.section);
  give a free online edition URL where one exists (e.g. CCEL, New Advent, Perseus).
- Places: modern name, ancient name, and a **Pleiades** URL (https://pleiades.stoa.org)
  where one exists. Give approximate lat/lon if not.
- Dates: always a range plus the basis for it ("c. 46–48, from Gallio-anchored
  chronology"). Note when scholars disagree.
- Competing traditions: list each separately with its own sources and grade. Do not
  pick a winner; you may note which is majority scholarly view, with a cite.
- Do not invent sources. If you can't verify a reference online, mark it
  `UNVERIFIED` rather than dropping or guessing it.
- Research only: write ONLY your own file(s) under `research/apostles/`. No code,
  no git commits, don't touch other sessions' files.

## File template — `research/apostles/<slug>.md`

```markdown
# <Apostle name>

Summary (3–5 sentences, for a youth-group audience).

## Timeline

| # | Years (AD) | Place (modern / ancient) | Event | Grade | Sources | Vreugdenhil |
|---|---|---|---|---|---|---|
| 1 | c. 30–33 | Jerusalem / Hierosolyma ([Pleiades](…)) | … | A | Acts 1:13 | ch. 1: "…" |

## Competing traditions
### Tradition X — <short name>
Claim, earliest source, grade, later sources, notes.

## Death / martyrdom
(same detail; competing accounts listed separately)

## Places (for the map)
| Place | Ancient name | Pleiades | lat, lon | Used in rows |

## Sources
Full bibliography: author, work, reference, edition/translation, URL, date written.

## Open questions / uncertainties
```
