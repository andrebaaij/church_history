# Import issues — Peter & Andrew

Source research: `research/apostles/peter.md`, `research/apostles/andrew.md`.
Imported into: `data/journeys/peter.yaml`, `data/journeys/andrew.yaml`,
`data/sources/peter-andrew.yaml`, `data/places/peter-andrew.yaml`.

## Not imported: marked UNVERIFIED in the research

| Item | Research ref | Why not imported |
|---|---|---|
| Origen, *Homily 6 on Luke* (Ignatius "second" bishop of Antioch after Peter) | peter.md row 15, Trad. 1 | Origen's text UNVERIFIED (known only from the DCB "Ignatius" article). The Antioch-bishop claim (`peter-antioch-bishop`, C) cites only Eusebius *HE* 3.22, 3.36.2 and Jerome *De vir. ill.* 1. |
| Eusebius, *Chronicle*: late-60s date for Peter's death | peter.md Death | UNVERIFIED. The death window (64–68) rests on 1 Clement, Tacitus *Ann.* 15.44 and Jerome (in the claim notes). |
| *Apocalypse of Peter* (Rainer fragment), "city of the west" | peter.md Open q. 8 | UNVERIFIED; the research had already left it out. |
| "Most modern commentators accept Babylon = Rome" | peter.md Trad. 4 | The majority-view citation is UNVERIFIED. The claim text does not state a majority view. |
| "Most modern scholars reject the 25-year episcopate" | peter.md Trad. 7 | The majority-view citation is UNVERIFIED. The claim `peter-rome-early-claudius` gives only the NT counter-evidence (Acts 15, Gal 2:11, Rom 16). |
| "Babylon" = the Babylon fortress in Egypt (Old Cairo), Coptic tradition | peter.md Trad. 6 | Earliest written source UNVERIFIED. Mentioned only in the notes of `peter-1peter-babylon`. |
| Andrew's death "c. 60" / "under Nero" | andrew.md row 11, Death | UNVERIFIED; no ancient source gives a year. See "Date windows" below. |
| Byzantium foundation "AD 38" | andrew.md row 15, Trad. 5 | The source of the year is UNVERIFIED. `andrew-byzantium-stachys` is imported without that date. |
| Feast of 30 November | andrew.md Death | Earliest attestation UNVERIFIED (and outside the map's scope). |
| X-shaped cross: first datable instance / National Gallery page | andrew.md Account C | UNVERIFIED (page not opened). No claim was created for the saltire. Vreugdenhil's ch. 1 quote is attached to `andrew-crucified-patras`, and that claim's notes say the X shape is medieval. The episode `andrew-hung-on-olive-tree` says so too. **Teachers: Vreugdenhil's "St Andrew's cross" is later tradition.** |
| Ion Corvin cave coordinates | andrew.md Places, row 17 | Coordinates UNVERIFIED. The E-grade Dobruja tradition is mapped at Tomis (Pleiades 217016) instead. |
| Peter M. Peterson, *Andrew, Brother of Simon Peter* (1958) | andrew.md Sources | UNVERIFIED and modern; not cited. |

## Not imported: other reasons

| Item | Why |
|---|---|
| Calvin: "Babylon" = literal Babylon in Mesopotamia (peter.md Trad. 5) | Reformation-era reading with no ancient source, so it has no grade. It is noted in `peter-1peter-babylon` only. |
| Zwierlein 2009: Peter never in Rome (peter.md Trad. 9) | Modern scholarship, not graded. Possible future reference-work entry. |
| *Ascension of Isaiah* 4:2–3 (peter.md Account A) | The grade is unresolved (B/D) and the date is disputed (before 68 vs c. 100–130). The translation text was not opened. |
| Justin, *1 Apol.* 26 (Simon Magus in Rome under Claudius) | Does not mention Peter. |
| *Memoria ad Catacumbas* / *Depositio Martyrum* 258 (peter.md Burial) | Dates from AD 258/354, outside AD 30–100, and its interpretation is disputed. |
| Identification of Peter's bones (1968) | Disputed. The Vatican stay (`peter-vatican-grave`) cites Gaius only, and its notes say the excavation confirms a c. 160 memorial, not bones. The excavation reports (Apollonj Ghetti 1951; Toynbee & Ward-Perkins 1956) were not checked by the researcher, so they are not cited. |
| *Acts of Andrew and Matthias*, "city of the cannibals" (andrew.md row 10) | The place (Myrmidonia) cannot be located, and the text is often dated to the 4th–5th century. |
| Muratorian Fragment: Andrew and the writing of John's Gospel (andrew.md Trad. 8) | The grade is disputed (B vs C, 2nd vs 4th century) and no place is given. |
| Dvornik 1958 | Known only from a review summary. It is mentioned in the notes of `andrew-byzantium-stachys` but not cited as a source. |
| Gospel-period rows (Peter rows 1–2; Andrew rows 1–4) | Before AD 30. Imported only as short episodes in the first Jerusalem stay, as the brief allows. Bethany beyond Jordan (Pleiades 697641) was not added as a place. |

## Imported with caveats (please review)

- **Date windows (editorial, not from sources).** No ancient source dates these items, but the schema needs a `when`:
  - Peter in Asia Minor (`peter-in-asia-minor`, C) and Peter at Corinth (`peter-corinth`, B): c. 50–64 / 50–55. These fall between Antioch (Gal 2:11) and Rome.
  - Peter's arrival in Rome (`peter-rome`): c. 60–64, after Romans 16 and Acts 28, which do not mention him. The research suggests this window as "most defensible".
  - **Every Andrew item after Acts 1:13** (Scythia, Epirus, Achaia, *Acts of Andrew* itinerary, martyrdom, Byzantium, Kyiv, Dobruja) uses AD 33–100 (circa), i.e. "1st century, date unknown", as the research recommends (andrew.md Open q. 3). On the map these show across the whole slider range. If the UI needs something tighter, the maintainer should decide.
- **Peter's Asia Minor stay** is drawn at Galatia (`galatia` from `data/places/paul.yaml`, Pleiades 619161) as the centre of the five regions in 1 Pet 1:1.
- **Vatican stay** (`peter-vatican-grave`) uses the Vatican Hill place (Pleiades 463398874). Its claim is Gaius (B, c. 200); the memorial itself dates to c. 146–161.
- **Head-downward crucifixion** (`peter-crucified-head-down`) is graded C (Origen via Eusebius; Jerome). Its earliest narrative, the *Acts of Peter* 37–38 (D), is named in the notes and not cited, so the C grade is not mixed with a D source. Vreugdenhil ch. 6 is attached there and ch. 1 to `peter-crucified` (B, Tertullian).
- ***Acts of Peter* chapter numbers** (35, 37–38) were confirmed by the researcher only from secondary summaries.
- **Jerome *Ep.* 59.5** (NPNF summary only) and **Gaudentius *Sermon* 17** (Cult of Saints summary only) are cited for `andrew-achaia` (C). The Latin texts were not checked.
- ***Acts of Andrew* itinerary** (`andrew-acts-itinerary`, D) was checked only via the e-Clavis summary of Gregory of Tours. The leg order follows the research (Amaseia → Sinope → Nicaea → Nicomedia → Byzantium → Perinthus → Philippi → Thessalonica → Patras). The land-leg waypoints are plausible roads, not attested routes.
- ***Russian Primary Chronicle*** (`andrew-kyiv-chronicle`, E): the Andrew passage of the translation was not opened by the researcher. Kyiv and Novgorod have no Pleiades record, so they carry `claim: andrew-kyiv-chronicle`. The Dnieper leg uses `mode: land` (there is no river mode) with waypoints along the river.
- **Competing traditions linked with `alternativeTo`:**
  - Peter: `peter-rome-founding` (B, late arrival) ↔ `peter-rome-early-claudius` (C, 42–67).
  - Andrew: `andrew-scythia` ↔ `andrew-epirus` ↔ `andrew-achaia`, all pairwise.
- **Sea legs** (`peter-antioch-corinth`, `peter-corinth-rome`, `andrew-sinope-chersonesos`): every waypoint-to-waypoint segment was checked against `data/geo/base/land.geojson` with turf and does not cross land. The first and last segments touch land only because Antioch and Rome lie inland. The Corinth–Rome route goes south of Sicily, because the Strait of Messina is too narrow for the base map.

## Shared ids reused from other sessions' files

`tertullian-praescription`, `tertullian-scorpiace` and `acts-of-peter` come from `data/sources/paul.yaml`, and `ps-dorotheus-lists` from `data/sources/other-apostles.yaml`. `galatia`, `philippi` and `thessalonica` come from `data/places/paul.yaml`. My own duplicates were deleted.
