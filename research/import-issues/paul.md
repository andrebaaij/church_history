# Import issues — Paul

Source: `research/apostles/paul.md` → `data/journeys/paul.yaml`, `data/sources/paul.yaml`, `data/places/paul.yaml`.
Result: 63 legs, 46 stays, 101 episodes, 87 claims. `pnpm data` passes.

## UNVERIFIED references — not imported as claims

| Research item | Why not imported | What would unblock it |
|---|---|---|
| Orosius, *Hist. adv. paganos* 7.6.15 (Claudius' expulsion dated to AD 49) | Text marked UNVERIFIED. The expulsion itself is imported (Acts 18:2 + Suetonius *Claudius* 25.4, grade B); the year 49 is only mentioned in the claim notes. | Check the Orosius text online and add it as a C-grade citation. |
| Seneca, *Ep.* 104.1 (Gallio left Achaia with fever) | UNVERIFIED. | Check the letter; it could be an episode in the Corinth stay. |
| Josephus, *Ant.* 20.137–144 (Felix, Drusilla, Ananias) | Section numbers UNVERIFIED. The Felix story is imported from Acts 24 only. | Verify the section numbers on Perseus and add a B citation. |
| Judaean coins of Nero's year 5 (58/59) linked to Festus | Cited only via Wikipedia; F. F. Bruce's page UNVERIFIED. Festus is dated from Josephus *Ant.* 20.182 (B) instead. | Find a primary numismatic reference. |
| Aretas IV reign c. 9 BC – AD 40 (coins/inscriptions) | The primary numismatic reference is UNVERIFIED (blog source only). The date limit is given in the notes of `paul-damascus-escape`, not as a graded claim. | Cite a coin catalogue or inscription. |
| Tradition D: shipwreck on Mljet (Constantine VII, *De administrando imperio* 36) | Chapter number UNVERIFIED (and grade E, a 10th-c. conjecture). Not drawn on the map; mentioned in the `paul-shipwreck-malta` notes. | Verify the DAI chapter, then add a stay on Mljet (Pleiades 197376) with `alternativeTo` ↔ `paul-shipwreck-malta`. |
| Tradition D: Kefalonia (H. Warnecke 1987) | Bibliographic detail UNVERIFIED; a modern hypothesis with no grade. | — (not gradable as an ancient tradition) |
| Tradition B: no release, death c. 62 (Murphy-O'Connor) | Page reference UNVERIFIED; a modern reconstruction with no ancient source, so no grade. The release tradition is imported (`paul-release-tradition`, C) with a note that many critical scholars reject it. The competing death dates 64–65 (B) and 67–68 (C) are imported as `alternativeTo` pairs. | Verify the page and decide whether modern-scholarship claims may be shown. |
| Tradition C.5: Spanish local traditions (Tarragona) | Marked UNVERIFIED / not researched. | Research a written source. |
| Aquae Salviae / Tre Fontane execution site (Pseudo-Marcellus, *Passion of Peter and Paul*) | Text itself UNVERIFIED (cited via a 2009 papal audience). No Pleiades entry either. | Check the NASSCAL e-Clavis entry or the text, then add a stay (grade D) with a place claim. |
| Jerome, *Comm. on Philemon* v. 23 (Gischala) | UNVERIFIED. Gischala is imported from Jerome *Vir. ill.* 5 (C) only. | — |
| Eusebius *Chronicle* year entry for Peter and Paul; *Depositio martyrum* 29 June; the "37th year" variant in Jerome *Vir. ill.* 5 | All UNVERIFIED. They are not cited; the 67–68 claim rests on Jerome *Vir. ill.* 5 alone. | — |
| R. E. Brown, *Introduction to the NT* (authorship consensus) | Page refs UNVERIFIED. The authorship status is stated in claim notes only (no citation). | — |

## Research rows not imported as journey items (and why)

- **Rows 1, 1a, 2 (before AD 30):** imported as episodes in the first Jerusalem stay (`paul-jerusalem-persecutor`), per the brief. Tarsus (A) and Gischala (C) are linked through `alternativeTo`.
- **Row 55 (John continues Paul's work at Ephesus, Irenaeus 3.3.4):** this is John's story. The shared claim `john-lives-to-trajan` already exists in `data/claims/common.yaml`. Vreugdenhil's ch. 1 sentence ("John took his place and continued the work of Paul") could be added there as a `referenceWorks` entry by the coordinator (I may not edit common files).
- **Chronological anchors** are imported as episode claims: Gallio inscription (A), Sergius Paullus inscription (A, identification probable), Josephus on the famine, Agrippa's death and Festus (B), Suetonius on Claudius' expulsion (B), and Tacitus *Ann.* 15.44 (cited in `paul-death-64`).
- **Origen via Eusebius *HE* 3.1.3 and Lactantius *Mort.* 2** are not cited separately. The martyrdom claims already rest on earlier B sources, and these add no new facts.

## Mapping decisions to review

- **Grades:** release after Acts 28 = C (Eusebius "it is said"); Spain visit = B (1 Clement 5.7 + Muratorian Fragment, both ambiguous or disputed, as flagged in the notes); Acts of Peter farewell = D; beheading = B (Tertullian); Ostian Way trophy = B (Gaius via Eusebius); the radiocarbon dating of the San Paolo sarcophagus = A (archaeology; the notes say it shows early veneration, not identity).
- **Pastoral-letter travels (Crete, Ephesus, Nicopolis)** are stays at 62–66 with no connecting legs, because their order is unknown. Their claim notes flag the authorship debate.
- **Prison letters** are placed in Rome (the traditional view); the claim notes name Ephesus and Caesarea as alternatives.
- **Galatians** is shown as an episode at Antioch (49), with the 48–55 dating debate in the claim.
- **"Macedonia" (2 Cor) and the Illyricum stay:** Macedonia is pinned to Philippi. The route to Illyricum along the Via Egnatia is a guess, as the claim notes say.
- **The Hispania marker** sits on the east coast (Valencia area) rather than at Pleiades' centroid in Galicia, so the sea leg ends at the coast. No early source names a city.
- **Inland ends of sea legs:** `paul-attalea-antioch` (up the Orontes from Seleucia), `paul-beroea-athens` (Beroea to the coast), `paul-paphos-perge` (Perge up the Kestros) and `paul-caesarea-tarsus` (Tarsus up the Cydnus) end with a short overland segment. All other sea legs were checked against `data/geo/base/land.geojson` and stay at sea.

## `pnpm check:pleiades`

- `beroea` → Pleiades title "Ber(r)oia" is flagged **CHECK**. This is a false positive. The script drops tokens of ≤ 3 letters, and "Ber(r)oia" splits into "ber", "r" and "oia", so no name can ever match. Pleiades 491546 was fetched and confirmed as Beroea (Veria) at 22.201, 40.522.
- No other rows from Paul's files are flagged. (`axum` is in `common.yaml`, not mine.)

## Shared ids other sessions may reuse

Sources added in `data/sources/paul.yaml` that other apostles may need: `ephesians`, `2-thessalonians`, `1-timothy`, `ignatius-ephesians`, `muratorian-fragment`, `tertullian-praescription`, `tertullian-scorpiace`, `acts-of-paul`, `acts-of-peter`, `gallio-inscription`, `sergius-paullus-inscription`, `san-paolo-radiocarbon-2009`.
