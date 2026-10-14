# Import issues — far-east-south (Thomas, Bartholomew, Matthew)

Imported from `research/apostles/thomas.md`, `bartholomew.md`, `matthew.md` into
`data/journeys/{thomas,bartholomew,matthew}.yaml`, `data/sources/far-east-south.yaml`,
`data/places/far-east-south.yaml` on 2026-10-14.

| Person | Claims | Legs | Stays | Episodes |
|---|---|---|---|---|
| Thomas | 17 | 9 | 6 | 15 |
| Bartholomew | 10 | 5 | 7 | 8 |
| Matthew | 13 | 3 | 6 | 9 |

## 1. Not imported: marked UNVERIFIED in the research

| Research row / reference | Why not imported |
|---|---|
| Thomas row 14: Ephrem, *Carmina Nisibena* 42 (relics brought to Edessa) | Quoted only from a secondary translation (nasrani.net), not checked against Beck, CSCO 240. Also after AD 100. |
| Thomas: Gregory of Nazianzus, *Or.* 33 "§11" ("Thomas with India") | Section number unverified. Socrates 1.19 is used for the Parthia claim instead. |
| Thomas: Ambrose, Jerome and Paulinus on Thomas in India | Individual references unverified (Catholic Encyclopedia only). |
| Thomas: Cosmas Indicopleustes, *Christian Topography* 3 (Christians in "Male") | Reference unverified. Also 6th c. context, not about Thomas. |
| Thomas: medieval relic chain (Chios 1258, Ortona, Marco Polo 1293, San Thomé 1523) | Primary references unverified. Also outside AD 30–100. |
| Thomas / Bartholomew / Matthew: Rufinus, *HE* 10.9, Latin | The Latin is not checked online. The claims cite Socrates, *HE* 1.19 (verified, relays Rufinus) and mention Rufinus in the notes. |
| Bartholomew row 2: Nathanael = Bartholomew (Isho'dad of Merv, 9th c.) | Primary reference unverified. Imported only the grade-A Gospel story of Nathanael, with a note and episode text saying the identification is an inference ("many think…"). |
| Bartholomew row 11 / Tradition C: Lycaonia, Phrygia, Mesopotamia, Persia, Egypt, Black Sea | No primary references (Catholic Encyclopedia only). |
| Bartholomew: Latin *Passio Bartholomaei* (flaying) | Primary text unverified. The flaying is imported only as **Armenian tradition (E)**, citing that tradition, not the Passio. |
| Bartholomew: Movses Khorenatsʿi and other Armenian historians | Unverified in this research file. The other-apostles session has a `movses-khorenatsi` source (HA 2.34) for Thaddaeus. Someone should check whether it also names Bartholomew; if so, the `bartholomew-armenia` claim could gain a C/D citation. |
| Bartholomew: Caucasian Albania as Albanopolis | Unverified. |
| Bartholomew: Benevento 838, Rome 983/998 | Secondary sources only. Also outside AD 30–100. |
| Bartholomew: composition date of the Greek *Martyrdom* | Unverified. Source `martyrdom-bartholomew` carries a wide placeholder (400–600) and the edition note says "date uncertain". |
| Matthew row 7: "fifteen years" preaching to the Hebrews (Clement of Alexandria via the Catholic Encyclopedia) | No passage traced. |
| Matthew row 13 / Tradition D: Persia, Macedonia, Syria | No primary references. |
| Matthew: Catholic Encyclopedia "Ethiopia south of the Caspian" | No ancient basis traced. Not mapped. |
| Matthew: Ethiopian Orthodox (Aksumite) tradition about Matthew | Unverified, so `axum` is **not** used as a Matthew location (see §3). |
| Matthew: Ambrose / Paulinus of Nola on Parthia | Unverified. |
| Matthew: Salerno relics (954) | Primary source unverified. Also outside AD 30–100. |
| Vreugdenhil ch. 4 | The PDF did not download during research, so it is unchecked for these three apostles. |

## 2. Not imported: outside AD 30–100 (verified, but out of scope)

- Thomas: relic cult at Edessa (Socrates 4.18; Egeria 17–19; *Chronicle of Edessa* 394). Gregory of Tours, *GM* 31–32.
- Bartholomew: Pantaenus' journey c. 180–190 is used only as the *evidence* inside the India stay's episode, not as its own item. Dara relic (c. 507). Lipari (Gregory of Tours, *GM* 33/34; this also gives a death "in Asia" with no place or manner).
- Matthew context rows C1 (Strabo 17.1.54, 25–22 BC) and C5 (shipping volume). C5 is used in Thomas' `thomas-monsoon-route` claim.

## 3. Modelling decisions to review

- **Placeholder dates.** Apart from the NT rows, Kerala (52/72) and the Gondophares anchor (c. 19–46), the sources give **no years**. The leg and stay `when` ranges for Parthia, India, Arabia, Armenia, Ethiopia, Myrna and Parthia (Matthew) are placeholders inside AD 33–80. Each claim says so in its notes.
- **Routes are modern placements.** No source names a route or port, except the Acts of Thomas' unidentified "Andrapolis".
  - Thomas, Kerala (E): Jerusalem → Alexandria → Coptos → Berenike → Muziris. This is the standard route in Pliny, *NH* 6.26 (Coptos–Berenike 12 days; Okelis → Muziris 40 days). The sea leg passes Bab-el-Mandeb and Socotra and crosses the Arabian Sea through the Nine Degree Channel of the Lakshadweep. Its episode cites the route claim (B: Strabo/Pliny/Periplus), not the tradition.
  - Thomas, India (D): Jerusalem → Aila → (Red Sea, Arabian Sea) → Barbarikon → up the Indus to Taxila. Taxila (Sirkap) is chosen because it was Gondophares' capital. The Acts does not name it.
  - Bartholomew, Arabia: the incense road via Petra, Hegra and Najran.
  - Matthew, Ethiopia: Pelusium, then up the Nile to Syene, then to Meroë.
- **Sea legs vs land.** I sampled the lines against `data/geo/base/land.geojson`. Only the first or last few km at the port cities touch land. Exception: Barbarikon. Pleiades puts it at 69.02 E, east of the modern Indus channel, so the leg follows the Indus mouth and channel up to 68.15 E and then cuts about 90 km overland to the Pleiades point. The ancient delta channels differed from today's.
- **Which "India" / "Ethiopia".**
  - Bartholomew, Eusebius 5.10.3: "India" is unidentified. The marker is Muziris, because Jerome's "Brahmans" points to India proper. The notes list South Arabia and Aksum as equally possible readings. Treat it as an area, not a point.
  - Bartholomew, Socrates 1.19 ("India contiguous to Ethiopia"): marked at Eudaimon Arabia (Aden), as a separate competing claim.
  - Greek *Martyrdom of Bartholomew*: the India is unnamed, so the death stay shares the Muziris marker. The notes say so.
  - Matthew, Socrates 1.19 "Ethiopia": **Meroë (Kush)**, not Aksum. Socrates calls Aksum "India interior" in the same chapter. The *Passio Matthaei* ties its Naddaver to Candace's eunuch (Acts 8 = Kush). Aksum appears only in an episode, with a B-grade claim (*Periplus* 4–5), as "not the same kingdom". `axum` is not used as a location, because no verified source puts Matthew there.
- **Region markers.** Ctesiphon stands in for Parthia (Thomas and Matthew). The `pontus` region (Pleiades 857287) stands in for Myrna, "city of the man-eaters". The basis for that is a Greek manuscript title "in Ponto", so treat it as an area, not a point.
- **Places without Pleiades.** `mylapore` cites claim `thomas-mylapore-location` (E). `albac` (Armenian Albanopolis, Başkale) cites `bartholomew-albac-location` (E). Pleiades 481711 "Albanopolis" is in Illyria and was deliberately **not** used.
- **Claims with no map item.** `thomas-death-natural` and `matthew-death-natural` (Heracleon via Clement, *Strom.* 4.9, grade B) give no place. They exist only as claims, linked through `alternativeTo` to the death stays, so the panel shows them side by side. If the UI should show them on the map, they need a design decision (e.g. a placeless "note" item).
- **Competing groups (alternativeTo, all symmetric):**
  - Thomas mission: parthia / india-gundaphorus / kerala.
  - Thomas death: natural / calamina (AcTh + Ps-Hippolytus, D) / mylapore (E).
  - Bartholomew mission: india-pantaenus / india-near-ethiopia / armenia.
  - Bartholomew death: india-beheaded / allanum / flayed.
  - Matthew mission: ethiopia / myrna / parthia.
  - Matthew death: natural / death-ethiopia / myrna / parthia. Myrna and Parthia are both mission and death claims.
- **Gondophares.** `thomas-gondophares-real` (A) reuses the `takht-i-bahi-inscription` source from `data/sources/territories.yaml`. I first defined my own copy and deleted it after `pnpm data` reported the duplicate.
- **Shared sources defined here.** `clement-stromata` is also cited by `data/journeys/philip.yaml`. `socrates-he`, `clement-paedagogus`, `thomas-christian-tradition`, `armenian-bartholomew-tradition`, `martyrdom-bartholomew`, `acts-of-matthew` and `passio-matthaei` are new.
- **Vreugdenhil.** Ch. 1 quotes are attached to the Thomas India death claims and the India mission claim ("Most likely, the savages in India murdered Thomas."). They are also on Bartholomew's and Matthew's martyrdom claims ("…all died the martyrs death.") and on `matthew-writes-gospel`. His general "apostles spread out" remark is not attached to the Acts 1:13 claims, because it does not tell those claims.

## 4. Validation status

- `pnpm data`: ✓ passes (300 claims, 90 sources, 104 places, 14 journeys). An earlier run hit a `nabataea` place/territory clash in another session's files; it has since been fixed there.
- `pnpm check:pleiades`: all 12 places from this import with a Pleiades URL are `ok`. Two CHECK rows belong to other files:
  - `axum` (common.yaml): Pleiades title "A(u)xoume", which is the correct place. The token matcher just fails on the spelling.
  - `beroea` (another session's file).
