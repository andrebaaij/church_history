# Import issues — john-james

Import of `research/apostles/john.md`, `james-zebedee.md`, `james-brother-of-jesus.md`
into `data/journeys/{john,james-zebedee,james-brother-of-jesus}.yaml`,
`data/sources/john-james.yaml`, `data/places/john-james.yaml`.

## Not imported: UNVERIFIED in the research

| Research item | Why not imported |
|---|---|
| john.md row 14 / Vreugdenhil ch. 1: robber story city "probably Smyrna" | No ancient source for Smyrna; Clement *QDS* 42 leaves the city unnamed. The story is imported (claim `john-ephesus-churches`) without a city; the Vreugdenhil reference has no quote, and the claim's note says Smyrna is unsourced. |
| john.md Vreugdenhil table: "Ignatius a student of John" (ch. 8) | Not in Ignatius' letters; the later martyrdom acts were not checked (UNVERIFIED). |
| john.md 2b: Bauckham, *Jesus and the Eyewitnesses*, chapter numbers; "many conservative scholars" hold both Papias Johns are the apostle | UNVERIFIED modern references. The Papias passage itself is imported (`john-two-johns-papias`). |
| john.md: R.E. Brown, *Introduction to the NT*, exact wording on the date | UNVERIFIED; not needed for any claim. |
| john.md: Papias fragment numbers (Lightfoot/Holmes) | UNVERIFIED. The Philip of Side fragment is cited by manuscript (Codex Baroccianus 142) via Kirby's page, with no fragment number. |
| james-zebedee.md Tradition 2: *Breviarium Apostolorum* Latin wording; Pseudo-Isidore *De ortu et obitu patrum* chapter in PL 83; Julian of Toledo passage; hymn *O Dei verbum* Latin text | UNVERIFIED primary texts. The Spain tradition is imported only on Aldhelm *Carm. eccl.* 4.4 (verified with edition and translation pages), grade D. |
| james-zebedee.md row 11: Usuard, *Martyrology* (c. 865) | Primary text UNVERIFIED (seen only through Fletcher). Translation legend imported on the *Epistola Leonis* only. |
| james-zebedee.md Tradition 4: Our Lady of the Pillar, Zaragoza (AD 40) | Primary documents UNVERIFIED; earliest note is from 1297 (popular-source report). |
| james-brother-of-jesus.md: Tertullian on the "brothers" (*De carne Christi* 7; *Adv. Marc.* 4.19) | UNVERIFIED wording. The identity question is only mentioned in a claim note. |
| james-brother-of-jesus.md row 15: Epiphanius *Pan.* 29.7, 30.2 on Pella | UNVERIFIED wording. The Pella flight is imported on Eusebius *HE* 3.5.3 only (grade C). |
| james-brother-of-jesus.md: modern survey on the authenticity of *Ant.* 20.9.1; printed handbook (Schürer) for Festus' death in 62 | UNVERIFIED. The 62 date is kept (Josephus' own sequence Festus → Albinus), but a printed source should be added before publication. |

## Not imported: outside AD 30–100 or not a map item

- john.md row 20 — Justinian's basilica at Ayasuluk (6th c.) and the tomb site: outside the time range.
- john.md Competing 3 — Mary at Ephesus: grade E, no sources researched.
- james-zebedee.md row 11 — 9th-century discovery of the tomb at Santiago: outside the range. It appears only in the notes of `james-zebedee-body-to-galicia`. No Santiago place was created (Pleiades has no ancient name for it); the leg ends at Iria Flavia, the place named in the legend.
- james-brother-of-jesus.md, "Who were the brothers of the Lord?" and "Was he one of the Twelve?": confessional and identity questions with no place or date. They are summarised in the note on `james-brother-of-jesus-unbelieving-brothers`.
- Gospel-period rows before 30 are episodes in the first Jerusalem stay of each person, as instructed.

## Decisions to review

- **Grades.**
  - Josephus *Ant.* 20.9.1 (James stoned, 62) is graded B, per the binding grade table (non-Christian historian).
  - The Syriac title naming Nero is graded D; the research said "D/C".
  - Theophylact (11th c., "Trajan condemned John") is graded D: very late, and probably a misreading of Irenaeus.
  - Augustine's "John sleeps in his tomb" is graded E (local legend), with Augustine as the reporting source.
  - Citations via Eusebius name the quoted author in the `quote` field, e.g. "(quoting Hegesippus)". The grade follows that earliest author.
- **Patmos dating.** The four datings (Domitian, Nero, Claudius, Trajan) are separate Patmos stays. Their date claims list each other in `alternativeTo`. I extended the existing claim `john-patmos-under-domitian` with extra citations, Vreugdenhil, Swete and the alternatives; its id and text are unchanged.
- **John's death.** There are three competing stays:
  - natural death at Ephesus (B): `john-dies-at-ephesus`;
  - the Acts of John trench (D);
  - "killed by the Jews" (C, Papias via Philip of Side).

  The last one has no place or date in its source. It is shown at Jerusalem, following the Syriac martyrology "John and James… at Jerusalem", over 44–100. Its claim note says so.
- **The map's end year** rests on `john-lives-to-trajan` from `data/claims/common.yaml`. It is the claim of the stay `john-ephesus-last-years`, and is not duplicated.
- **James the brother of the Lord.** His two death accounts (Josephus 62 vs Hegesippus 62–69) are separate stays with symmetric `alternativeTo`. Vreugdenhil's ch. 1 temple story is attached to the Hegesippus claim, with a note that he calls him "the apostle James". The same warning is in the note on `james-zebedee-killed-by-herod`.
- **Undated movements.** No source dates John's move to Asia; it is drawn 60–70, the usual inference, with a stay at Ephesus 70–94. No source gives a route from Ephesus to Rome either: the Rome boiling-oil stay (94–95, Tertullian) has no incoming leg, and the leg Rome → Patmos follows Tertullian's "then banished to his island".
- **Spain tradition.** The stay at `hispania` (D) is an alternative to `james-zebedee-in-jerusalem` (A).

## Ids shared with other sessions

- `hispania`: import-paul defines it in `data/places/paul.yaml`. I deleted mine and use theirs.
- `tertullian-praescription`: import-paul defines the *Prescription against Heretics* there. I deleted my duplicate `tertullian-praescr`. `data/journeys/peter.yaml` still cites `tertullian-praescr`; I messaged import-peter-andrew to switch to `tertullian-praescription`.

## Map-line notes

A script checked every sea leg against `data/geo/base/land.geojson`. All open-sea segments are clear. Only the first or last stretch crosses land, where the endpoint lies inland:
- Rome → coast near Ostia
- Kuşadası gulf → Ephesus (the ancient harbour has since silted up)
- Jerusalem → coast near Jaffa
- Ría de Arousa → Padrón (Iria Flavia)

The sources name no ports, so I added none.

## Pleiades

All new places pass `pnpm check:pleiades`: Smyrna 550893, Pergamum 550812 (correctly Pergamum, not Perga), Thyateira 550924, Sardis 550867, Philadelpheia 550822, Laodicea ad Lycum 638955, Iria Flavia 236491.
