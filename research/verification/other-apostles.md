# Verification — other apostles, territories, seas, common claims

Independent check, 2026-10-14. Scope: `data/journeys/{philip,james-alphaeus,thaddaeus-jude,simon-zealot,matthias}.yaml`,
`data/claims/{territories,seas,common}.yaml`, `data/places/other-apostles.yaml`, `data/sources/other-apostles.yaml`.
Grading rules: `research/README.md` (A = NT / contemporary archaeology; B = writers within ~150 years; C = later
church writers relaying older material; D = apocryphal acts/legend; E = local tradition).

## Method

- All citations extracted (claim id, grade, source, locator, quote): **122 citations**.
- **Sample deviation:** `shuf`/`gshuf` are not installed on this Mac, so the brief's
  `shuf -n 12 --random-source=<(yes)` could not be run. Instead, a reproducible pick was made with
  Python: `random.Random(0).sample(range(122), 12)` over the extraction list in file order
  (journeys philip → matthias, then territories, seas, common). Rows picked: 6, 34, 50, 52, 54, 63, 66, 98, 101, 109, 114, 118.
- Added: every grade-A/B citation that has a quote (7, one of which, `terr-roman-core`, was already in the sample).
  So **18 citations checked**.
- Texts used: Bible Gateway KJV; New Advent (Eusebius HE, NPNF2 tr. McGiffert; Ps-Hippolytus; Clement, Stromata);
  Project Gutenberg Whiston (Josephus, *Jewish War*); Perseus (Tacitus, *Annals*, tr. Church & Brodribb);
  LacusCurtius (Strabo, Loeb tr. Jones); Fordham Sourcebook (Periplus tr. Schoff; Golden Legend, Caxton/Ellis);
  Rabatak: Sims-Williams translation as reproduced on Wikipedia (no free critical edition found online).
- A few extra citations outside the sample were checked along the way; they are listed separately below.

## Sampled citations

| claim id | citation | exists? | supports claim? | grade ok? | note |
|---|---|---|---|---|---|
| philip-feeding-five-thousand | john-gospel 6:5-7 | yes | yes | yes (A) | KJV: "Whence shall we buy bread… Two hundred pennyworth of bread is not sufficient". |
| thaddaeus-jude-one-of-twelve | luke 6:16 | yes | yes | yes (A) | KJV has "Judas *the brother* of James" (italics supplied); Greek is "Judas of James", as the claim says. Matches Matt 10:3 "Lebbaeus, whose surname was Thaddaeus" / Mark 3:18 "Thaddaeus" in the same list position. |
| simon-zealot-one-of-twelve | luke 6:15 | yes | yes | yes (A) | "Simon called Zelotes". Matt 10:4 / Mark 3:18 have "Simon the Canaanite" (KJV), "Cananaean" in modern versions. |
| simon-zealot-upper-room | acts 1:13-14 | yes | yes | yes (A) | "Simon Zelotes" in the upper room list. |
| simon-zealot-egypt | golden-legend "159 (Simon and Jude)" | yes | yes | yes (D) | Caxton/Ellis vol. 6: "Judas preached first in Mesopotamia and in Pontus, and Simon preached in Egypt, and from thence came they into Persia". Quote "Simon preached in Egypt" matches. "159" is the Graesse chapter number; in the Fordham/Ellis edition it is vol. 6, "The Lives of SS. Simon and Jude". |
| matthias-stoned-beheaded | golden-legend "St. Matthias" | yes | yes | yes (D) | Vol. 3: legend "found at Treves"; accused before "the bishop of Jerusalem"… "so was stoned… finally he was slain with an axe after the manner of the Romans". |
| terr-roman-core | tacitus-annals 1.11 | yes | partly | yes (B) | **Quote does not match** any free translation found. Church & Brodribb (Perseus) 1.11: "the number of citizens and allies under arms, of the fleets, subject kingdoms, provinces, taxes…". The passage shows Augustus' list of provinces and kingdoms; it does not by itself describe the Mediterranean extent (Strabo 17.3.24-25 carries that). |
| terr-himyar | periplus 23 | yes | yes | yes (B) | Schoff 23: "Saphar, the metropolis, in which lives Charibael, lawful king of two tribes, the Homerites [= Himyarites] and… the Sabaites". |
| terr-kushan | rabatak-inscription lines 12-14 | yes | partly | yes (B) | Lines 12-14 name "King Kujula Kadphises (his) great grandfather… King Vima Taktu (his) grandfather". They establish the dynasty and order, not the expansion into north-west India or the dates 50–100 (those are modern, from coins). |
| sea-pontus-euxinus | strabo-geography 2.5.22 | yes | yes | yes (B) | LacusCurtius 2.5.22: "the Propontis empties into another sea termed the 'Euxine' Pontus". The gloss "hospitable sea" is not in 2.5.22 (it is an etymology; Strabo discusses the name at 7.3.6). Harmless. |
| ascension | acts 1:3 | yes | yes | yes (A) | "being seen of them forty days". Year (30/33) is modern chronology, as the claim's notes already say. |
| john-lives-to-trajan | eusebius-he 3.23.3-4 | yes | yes | yes (B) | Eusebius quotes Irenaeus twice: John "remained among them until the time of Trajan". Grade B rests on Irenaeus (c. 180), correct. |
| philip-at-hierapolis | eusebius-he 3.31.3 (quoted) | yes | yes | yes (B) | **Quote does not match the locator.** At 3.31.3 McGiffert has "Philip, one of the twelve apostles, who *sleeps* in Hierapolis". The wording "who fell asleep in Hierapolis" is at **5.24.2** (the second citation of the same claim). Polycrates c. 190 ≈ 160 years after AD 30, but the README lists Irenaeus c. 180 as B, so B is consistent. |
| philip-hierapolis-evangelist | eusebius-he 3.31.4 (quoted) | yes | yes | yes (B) | Quote matches word for word (Proclus in the Dialogue of Caius). Second citation Acts 21:8-9 is quoted by Eusebius at 3.31.5 too. B ok for Proclus (c. 200); the "many scholars think" part is modern and should stay framed as such (it is). |
| simon-zealot-zealot-party | josephus-war 4.3.9 (quoted) | yes | partly | yes (B) | Quote matches Whiston exactly. But the claim says Josephus *first* uses "Zealots" here (67-68); he already writes of "those that had the name of zealots" at **War 2.22.1** (AD 66, Whiston). |
| terr-parthia | acts 2:9 (quoted) | yes | partly | **no** | Quote matches KJV. Acts 2:9 only names Parthians among Pentecost pilgrims; it says nothing about the Parthian empire ruling Mesopotamia and Iran. That part rests on Tacitus Annals 15.1-17 → grade B. |
| terr-meroe | acts 8:27 (quoted) | yes | yes | yes (A) | Quote matches. Identifying Candace's "Ethiopia" with Meroë rests on Strabo 17.1.54 / Pliny, which the claim also cites; A defensible because Acts itself names "Candace queen of the Ethiopians". |
| ascension | luke 3:1 (quoted) | yes | partly | yes (A) | Quote matches KJV. It dates John the Baptist's ministry, not the Ascension; the claim's notes say the year is modern chronology built on it. Fine as is. |

## Places — `data/places/other-apostles.yaml` (Pleiades JSON titles)

| place id | Pleiades id | Pleiades title | match? | note |
|---|---|---|---|---|
| berytus | 678060 | Beirut | yes | coords identical to Pleiades reprPoint |
| eleutheropolis | 687854 | Beth Govrin/Eleutheropolis | yes | coords identical |
| ostrakine | 687993 | Ostrakine | yes | coords identical |
| aegyptus | 981503 | Ancient Egypt (region) | yes | Pleiades reprPoint lies far south (16.1 N); data uses a sensible point near the Delta, fine |
| persis | 922698 | Persis/Pars | yes | coords identical |
| dioscurias | 857107 | Dioscurias/Sebastopolis | yes | coords identical |
| britannia | 981513 | Britannia (province) | yes | coords identical |
| artaz | — | — | n/a | no Pleiades URL; coords given; linked to claim `thaddaeus-jude-artaz-location` (grade E) |

## Extra citations checked outside the sample

| claim id | citation | result |
|---|---|---|
| philip-preached-phrygia / philip-death-crucified | ps-hippolytus-twelve 5 | ok — "Philip preached in Phrygia, and was crucified in Hierapolis with his head downward in the time of Domitian" |
| james-alphaeus-stoned-claudius | ps-hippolytus-twelve 9 | ok — quote matches (New Advent has "And James…"; no Claudius in this text, the Claudius detail must come from the Coptic martyrdom) |
| thaddaeus-jude-death-berytus | ps-hippolytus-twelve 10 | ok — quote matches |
| simon-zealot-death-jerusalem | ps-hippolytus-twelve 11; eusebius-he 3.32.1-6 | ok — "Simon the Zealot, the son of Clopas… bishop of Jerusalem after James the Just… at the age of 120"; HE 3.32 is Hegesippus on Symeon son of Clopas, crucified under Trajan |
| matthias-preached-jerusalem | ps-hippolytus-twelve 12 | ok — quote matches |
| philip-not-martyred-heracleon | clement-stromata 4.9 | ok — "Of whom are Matthew, Philip, Thomas, Levi". Note: the ANF text reads "for all the saved have confessed…", which drops the "not" of the Greek (οὐ γὰρ πάντες); the claim follows the correct sense. |
| philip-papias-daughters | eusebius-he 3.39.9 | ok |
| matthias-one-of-seventy | eusebius-he 1.12.3 | ok — quote matches; C correct ("are said") |
| terr-thrace-client / terr-thrace-province | tacitus-annals 2.64-67 | supports the client kings (Rhescuporis/Cotys, AD 19) but **not** the province of AD 46 — see Must fix |

## Must fix

1. **philip-at-hierapolis** — quote on `eusebius-he 3.31.3` is the wording of 5.24.2. Correct to either
   `{ source: eusebius-he, locator: "3.31.3", quote: "Philip, one of the twelve apostles, who sleeps in Hierapolis" }`
   or move the current quote to the `5.24.2` citation and drop it from 3.31.3.
2. **terr-roman-core** — quote "how many provinces and client kingdoms" is not in the cited translation.
   Replace with the Church & Brodribb text: `quote: "the number of citizens and allies under arms, of the fleets, subject kingdoms, provinces, taxes"`
   (locator can be tightened to `1.11.4`).
3. **terr-parthia** — wrong grade. Acts 2:9 does not attest the content of the claim (Parthian rule over Mesopotamia and Iran).
   Change `grade: A` → `grade: B` (resting on Tacitus Annals 15.1-17), keep Acts 2:9 as an illustrative citation.
4. **terr-thrace-province** — the only citation (Tacitus Annals 2.64-67, events of AD 19) does not support a province in AD 46,
   so the claim has no supporting ancient source. Remove that citation and either cite an ancient witness to the annexation
   (candidate to check: Suetonius, *Vespasian* 8.4, which lists Thrace among territories made provinces — note it credits
   Vespasian, not Claudius) or mark the claim as resting on modern chronology (and then it cannot be graded B on this basis).
5. **simon-zealot-zealot-party** — claim text says Josephus "first" uses "Zealots" for a party in 67-68, but War 2.22.1 (AD 66)
   already speaks of "those that had the name of zealots". Change text to e.g. "Josephus uses 'Zealots' as the name of a rebel
   party during the Jewish War (from 66) and explains the name at War 4.3.9…", add `{ source: josephus-war, locator: "2.22.1" }`,
   and set `when: { from: 66, to: 68, circa: true }`.

### Should fix (minor)

- **terr-kushan** — Rabatak lines 12-14 support the kings' names and succession only; add a note that the expansion into
  north-west India and the dates c. 50–100 are modern reconstructions (coinage), or soften the text.
- **sea-pontus-euxinus** — "('hospitable sea')" is not in Strabo 2.5.22; either drop it or add Strabo 7.3.6 for the name.
- **thaddaeus-jude-one-of-twelve** — fine; optionally mention that the KJV reads "Judas the brother of James" so a teacher
  checking the KJV link is not confused.

## Summary

18 sampled/mandatory citations checked (12 random + 6 extra grade-A/B quoted), plus 7 Pleiades URLs and 9 extra citations.
All locators exist. 5 must-fix items (2 quote mismatches, 1 wrong grade, 1 unsupported claim, 1 inaccurate claim text);
3 minor. All Pleiades ids match their places.
