# Import issues — other apostles (Philip, James son of Alphaeus, Thaddaeus/Jude, Simon the Zealot, Matthias)

Files written: `data/journeys/{philip,james-alphaeus,thaddaeus-jude,simon-zealot,matthias}.yaml`,
`data/sources/other-apostles.yaml`, `data/places/other-apostles.yaml`.

## Corrections made during import

- **Ostrakine Pleiades id.** The research (james-alphaeus.md) gives `places/573421`, but that is
  *Ostrakina (mountain)* in Greece. The correct record is **687993 "Ostrakine"** (33.43 E, 31.12 N), verified.
- **Pleiades 981503** is "Ancient Egypt (region)"; its representative point lies far south (16° N), so the
  map point for `aegyptus` is set to 31.2 E, 30.0 N (Memphis area), as in the research.
- All other new Pleiades ids were fetched and their titles checked: 678060 Beirut, 687854 Beth
  Govrin/Eleutheropolis, 922698 Persis/Pars, 857107 Dioscurias/Sebastopolis, 981513 Britannia (province).
- `artaz` has no Pleiades record; it carries claim `thaddaeus-jude-artaz-location` (Movses 2.34 + UNESCO WHS 1262).
- The only `**CHECK**` row in `pnpm check:pleiades` is `axum` (data/places/common.yaml), not from these files.

## Dates

Almost every post-Acts tradition here is **undated in its sources**. Because every item needs a `when`, undated
items get a wide circa range inside AD 30–100, and each such claim has a note "No source gives a year".
Teachers should not read these ranges as dates.

## UNVERIFIED — not imported

| Person | Item | Why not imported |
|---|---|---|
| Philip | Gaul / "barbarians on the ocean coast" (Isidore, *De ortu et obitu patrum*) | Latin text UNVERIFIED (seen only in an English quotation) |
| Philip | Crucified and stoned (Isidore) | same |
| Philip | *Breviarium apostolorum* Gaul/Hierapolis | UNVERIFIED (text not found) |
| Philip | "Gallis" = "Galatis" scribal-error suggestion | UNVERIFIED, no citable source |
| Philip | Lightfoot p. 45; Matthews (2002) conclusions | UNVERIFIED (not read); McGiffert's note used instead in claim notes |
| James son of Alphaeus | Synaxarion of Constantinople column (Ostrakine) | UNVERIFIED column; the claim cites the verified *Prologue from Ochrid* instead and notes the Synaxarion |
| James son of Alphaeus | Edessa (with Andrew); Persia/Syria | UNVERIFIED, no primary source |
| James son of Alphaeus | Sawn asunder | UNVERIFIED |
| James son of Alphaeus | Budge page numbers for the *Martyrdom* | UNVERIFIED; cited without page |
| Thaddaeus/Jude | Egeria's reference to the Abgar letter | UNVERIFIED |
| Thaddaeus/Jude | Date of the Armenian *Martyrdom of Thaddaeus* | UNVERIFIED |
| Thaddaeus/Jude | Names of Jude's grandsons (Philip of Side) | UNVERIFIED |
| Thaddaeus/Jude | Weapon of martyrdom in Persia | UNVERIFIED in the Latin text |
| Simon | Egypt per Isidore | UNVERIFIED (only the Golden Legend is cited) |
| Simon | Mauretania / Africa / Britain (Ps.-Dorotheus; Nicephorus Callistus 2.40) | All ancient references UNVERIFIED; only Foxe (a reference work, not a source) was checked |
| Simon | Crucified at Caistor, AD 61; two visits to Britain | UNVERIFIED modern British-Israel literature |
| Simon | Sawn in two (Lipsius) | UNVERIFIED |
| Simon | Nikopsis tomb / Abkhazia (Epiphanius the Monk, George the Hagiorite) | Primary texts UNVERIFIED (via Wikipedia) |
| Simon | Peaceful death at Edessa; crucified in Samaria | UNVERIFIED, no source |
| Simon | Horsley / Hengel on the Zealot party | UNVERIFIED; the Josephus passage (verified) is used instead |
| Matthias | Colchis crucifixion (Nicephorus Callistus 2.40) | UNVERIFIED in the primary text |
| Matthias | Cappadocia / Caspian / port Hyssus | UNVERIFIED, no primary source |
| Matthias | Origen, *Hom. in Luc.* 1 (Gospel of Matthias) | UNVERIFIED wording; also after AD 100 |
| Matthias | Greek of Clement *Strom.* 2.9.45, 4.6.35, 7.13.82, 7.17.108 (Matthias vs Matthew) | UNVERIFIED; also not about his life |

## Deliberately not imported (verified, but out of scope)

| Person | Item | Reason |
|---|---|---|
| Philip | Philip the **evangelist** rows (Acts 6:5; 8:5–40; 21:8–9) | A different person; research says not to show them as the apostle's journeys. Acts 21:8–9 is cited only in the "which Philip?" alternative claim |
| Philip | Scythia, twenty years (Golden Legend) | Region without a mappable point |
| Philip | Journeys in the *Acts of Philip* (Athens, Parthia, Azotus, "Nicatera") | Translation not consulted; only the Martyrdom (via e-Clavis) is cited |
| Philip | 5th-c. Martyrion and tomb at Hierapolis (D'Andria 2011) | Outside AD 30–100; good candidate for an `evidence` media item on the Hierapolis stay later |
| Philip | Clement *Strom.* 3.6 (Philip gave his daughters in marriage) | Not about place or time; could be added as an episode |
| Philip | Foxe (AD 54), van Braght, Britannica 1797 | Reference works, no ancient source; mentioned in the note on the crucifixion claim |
| James son of Alphaeus | Leader of the Jerusalem church 30–62 (only if = Lord's brother) | Belongs to `james-brother-of-jesus`; covered in one identification claim on the AD 62 stay |
| James son of Alphaeus | Levi/Matthew as his brother; Clopas = Alphaeus | Grade E / C kinship notes, no place or time |
| Thaddaeus/Jude | Jude's grandsons before Domitian (Hegesippus via HE 3.19–20, B; Vreugdenhil ch. 7) | About Jude **the Lord's brother**, not necessarily the apostle; better on a Jude-the-brother or Domitian track |
| Thaddaeus/Jude | *Doctrine of Addai* (Addai of the Seventy dies in Edessa) | About Addai "one of the seventy-two", not the apostle |
| Thaddaeus/Jude | *Breviarium* "Beirut, a city in Armenia"; Mesopotamia / inner Pontus | Garbled place; regions only |
| Simon | Veriosp'or (Movses 2.34, C, hedged by the author) | Place unidentified; no coordinates should be shown |
| Simon | *Breviarium*: crucified under Hadrian, buried "in the Bosphorus" | Outside AD 30–100 |
| Simon | Symeon son of Clopas (Hegesippus, B) | A different person; cited only to explain the Jerusalem conflation claim |
| Matthias | *Acts of Andrew and Matthias* (city of the man-eaters) | Unlocated legendary city; fits better as an episode on Andrew's track |
| Matthias | Gonio-Apsaros grave (local tradition, E) | Only Wikipedia / tourism pages; no date for the tradition |
| Matthias | Basilides, Gospel/Traditions of Matthias, Clement's quotations | After AD 100; not evidence about his life |
| Matthias | Helena's relics to Rome / Trier (326; 1127) | Outside AD 30–100 |
| Matthias | Acts 2:14 and 6:2 (Matthias implied among the Twelve) | Inferences only; not separate items |

## Open points for the verifier

- Pseudo-Hippolytus section numbers used: Philip §5, James son of Alphaeus §9, Jude §10, Simon §11,
  Matthias §12 — all checked against https://www.newadvent.org/fathers/0524.htm during import.
- The `philip-at-hierapolis` / `philip-hierapolis-evangelist` pair are alternatives (apostle vs evangelist);
  both are B.
- `james-alphaeus-if-james-the-just` is graded **C** (Jerome's identification), although Josephus (B) is
  cited for the stoning itself.
- Grade choices for mixed research grades: Ps.-Hippolytus "C/D" → D; Ostrakine "D/E" → D; Movses "D/E" → D.
