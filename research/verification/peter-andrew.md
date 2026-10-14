# Verification — Peter & Andrew

Independent check of `data/journeys/peter.yaml`, `data/journeys/andrew.yaml`,
`data/places/peter-andrew.yaml`, `data/sources/peter-andrew.yaml`. Checked 2026-10-14.

## Method

- All 68 citations (claim id, grade, source, locator, quote) were extracted to a TSV in
  file order (peter.yaml claims, then andrew.yaml claims, citations in order).
- Random pick: `shuf -n 12 --random-source=<(yes)` (GNU coreutils, run in a
  `debian:stable-slim` container because macOS has no `shuf`). Picks are marked **R**.
- Added: every citation on a grade-A or grade-B claim that has a `quote` (10 more,
  marked **Q**; the Revelation and Scorpiace picks were already in R). Total checked: **22**.
- Texts opened: Bible Gateway (KJV), New Advent (Eusebius HE 2–3, Jerome *De vir. ill.*,
  Irenaeus AH 3.1, 3.3, 1 Clement, Ignatius *Rom.*, Tertullian *Praescr.* and *Scorp.*,
  Lactantius *Mort. pers.*), Josephus *Ant.* 19 (Whiston, penelope.uchicago.edu),
  NASSCAL e-Clavis (Gregory of Tours; Ps.-Dorotheus).

## Citations

| claim id | citation | exists? | supports claim? | grade ok? | note |
|---|---|---|---|---|---|
| peter-crucified (R) | tertullian-scorpiace 15 — "Then is Peter girt by another, when he is made fast to the cross." | yes | yes | yes (B, c. 203–213) | Quote verbatim (New Advent ch. 15). Same paragraph opens "At Rome Nero was the first…", so the Rome link holds. |
| peter-cornelius (R) | acts 10:23-48 | yes | yes | yes (A) | Joppa → Caesarea (10:23-24), centurion Cornelius, Spirit falls (10:44), baptism (10:48). |
| andrew-upper-room (R) | acts 1:13 | yes | yes | yes (A) | Andrew is named in the upper room. Acts 1:13 is indeed his last NT mention. |
| peter-1peter-babylon (R) | revelation 14:8; 17:5, 18 — quote "Revelation also uses "Babylon" for Rome" | yes | partly | yes (A for this cite; claim B) | Verses exist ("Babylon… that great city"; 17:18 "that great city, which reigneth over the kings of the earth"). But the `quote` is an editorial gloss, not text: Revelation never names Rome. Identifying Babylon with Rome is an interpretation. |
| peter-antioch-bishop (R) | eusebius-he 3.22; 3.36.2 — "Ignatius … chosen bishop of Antioch, second in succession to Peter" | yes | yes | yes (C) | 3.36.2 quote is verbatim. 3.22 (single section) gives Evodius first, Ignatius second, without naming Peter. |
| peter-samaria (R) | acts 8:14-25 | yes | yes | yes (A) | Sent from Jerusalem (8:14), rebuke of Simon (8:20-23), return to Jerusalem (8:25). |
| andrew-acts-itinerary (R) | gregory-tours-andrew 2-21 | yes (via e-Clavis summary) | yes | yes (D) | e-Clavis: "travels of Andrew from Pontus by way of Amasia, Sinope, Nicaea, Nicomedia, Byzantium, Thrace, Perinthus, Philippi, and Thessalonica to Patras (chaps. 2–21)". Matches the claim exactly. The Latin text itself was not opened. |
| peter-cephas-party (R) | 1-corinthians 1:12; 3:22; 9:5 | yes | yes | yes (A) | 1:12 "I of Cephas", 3:22 "or Cephas", 9:5 "lead about a sister, a wife… and Cephas". |
| andrew-byzantium-stachys (R) | ps-dorotheus-lists "Andrew" | yes | yes, but the locator is wrong | yes (D) | The **Andrew** entry (apostles list) says only Bithynia, Pontus, Thrace, Scythia and burial at Patras. The Stachys ordination is in the **disciples list, entry "Stachys"**: "whom also Andrew the apostle, traversing the sea of Pontus, in Argyropolis of Thrace appointed bishop of Byzantium". |
| andrew-first-disciple (R) | mark-gospel 1:16-18, 29 | yes | yes | yes (A) | Calling of Simon and Andrew while fishing. 1:29: "the house of Simon and Andrew". |
| andrew-relics-constantinople (R) | jerome-vir-ill 7 — "in the twentieth year of Constantius" | yes | yes | **no, should be B** | Verbatim: "buried at Constantinople to which city, in the twentieth year of Constantius, his bones together with the remains of Andrew the apostle were transferred" (entry on Luke). Jerome (392/3) and Philostorgius (c. 425–433) wrote within ~40–75 years of a 356/7 event, so by the B rule ("writers within ~150 years") the claim is B, not C. Jerome does not say "from Achaia"; Philostorgius does. |
| peter-rome-early-claudius (R) | jerome-vir-ill 1 — "held the sacerdotal chair there for twenty-five years" | yes | yes | yes (C) | Verbatim. Jerome also gives "second year of Claudius" (= 42), which matches the claim. |
| peter-prison-escape (Q) | josephus-antiquities 19.343-352 — quote "death of Agrippa I (AD 44) — date anchor only" | yes (= Whiston 19.8.2) | yes, as a date anchor | yes | The passage is Agrippa's death at Caesarea "in the seventh year of his reign", the third under Claudius (= 44). The `quote` field is an editorial note, not a quotation. |
| peter-corinth-dionysius (Q) | eusebius-he 2.25.8 — "both planted and likewise taught us in our Corinth" | yes | yes | yes (B, c. 170) | Verbatim. |
| peter-rome-founding (Q) | irenaeus-ah 3.1.1; 3.3.2 — "the Church founded and organized at Rome by the two most glorious apostles, Peter and Paul" | yes | yes | yes (B) | 3.3.2 quote verbatim. 3.1.1: "Peter and Paul were preaching at Rome, and laying the foundations of the Church." |
| peter-1peter-babylon (Q) | eusebius-he 2.15.2 — "they say that he wrote [1 Peter] in Rome itself … when he calls the city, by a figure, Babylon" | yes | yes | B is defensible | Verbatim apart from the ellipsis and the bracketed insertion. The section names Clement (*Hypotyposes* 8) and Papias for the Mark story; who "they" are for the Babylon remark is ambiguous, as the claim's note already says. |
| peter-martyred-rome (Q) | 1-clement 5.4 — "Peter, through unrighteous envy, endured … departed to the place of glory" | yes (ch. 5) | yes | yes (B) | Verbatim (ANF). 1 Clement does not name the place of death; the Rome link comes from the context (a letter from Rome) and the other cites. |
| peter-martyred-rome (Q) | ignatius-romans 4.3 — "I do not, as Peter and Paul, issue commandments unto you" | yes (ch. 4) | partly | yes (B) | Verbatim. It ties Peter's authority to the Roman church, but says nothing about his death. Fine as "link with Rome" only. |
| peter-martyred-rome (Q) | eusebius-he 2.25.8 — "suffered martyrdom at the same time" | yes | yes | yes (B) | Verbatim (Dionysius of Corinth). |
| peter-crucified (Q) | tertullian-praescription 36 — "Peter endures a passion like his Lord's" | yes | yes | yes (B) | Verbatim, about the church of Rome. |
| peter-crucified (Q) | lactantius-mort-pers 2 — "crucified Peter, and slew Paul" | yes | yes | claim B ok; this cite alone is C | Verbatim (subject: Nero). Lactantius (c. 315) is a later writer. The claim stays B because of Tertullian. |
| peter-vatican-trophy (Q) | eusebius-he 2.25.7 — "if you will go to the Vatican or to the Ostian way, you will find the trophies…" | yes | yes | yes (B, Gaius c. 200) | Verbatim. |

## Places (Pleiades `/json` titles)

| place id | Pleiades id | Pleiades title | match? |
|---|---|---|---|
| joppa | 687931 | Ioppe | yes |
| vatican-hill | 463398874 | Vaticanus Mons | yes |
| scythia | 1273 | Scythia | yes |
| epirus | 530871 | Epirus | yes |
| amaseia | 857018 | Amaseia | yes |
| sinope | 857321 | Sinope | yes |
| nicaea | 511268 | Helikore/Nicaea | yes |
| nicomedia | 511337 | Nicomedia | yes |
| perinthus | 511357 | Perinthus/Heraclea | yes |
| chersonesos | 226564 | Chersonesos (alt. names include Korsun) | yes |
| tomis | 217016 | Tomis | yes |

kyiv and novgorod have no Pleiades URL, which is correct: neither was an ancient place.
All coordinates match the Pleiades reprPoint to 3 decimals.

## Must fix

1. **andrew-byzantium-stachys**: wrong locator. Change `locator: "Andrew"` to
   `locator: "Disciples list, Stachys (cf. Apostles list, Andrew)"`, and optionally add
   `quote: "whom also Andrew the apostle, traversing the sea of Pontus, in Argyropolis of Thrace appointed bishop of Byzantium"`.
   The Andrew entry itself does not mention Byzantium or Stachys.
2. **andrew-relics-constantinople**: wrong grade by the stated rule. Change `grade: C` to
   `grade: B`. Both sources wrote well within 150 years of the 356/7 translation.
   If the project means B to apply only to writers within ~150 years of the *apostolic age*,
   the README should say so. In that case keep C and add a note.
3. **peter-1peter-babylon / revelation**: the `quote` is not a quotation. Replace it with
   real text, e.g. `quote: "that great city, which reigneth over the kings of the earth"` (17:18),
   and put "Babylon is commonly read as Rome (cf. 17:9, seven mountains)" in `notes`.
4. **peter-prison-escape / josephus-antiquities**: the `quote` is not a quotation. Move
   "death of Agrippa I (AD 44) — date anchor only" to `notes` (or the locator), or quote the
   text, e.g. `quote: "in the fifty fourth year of his age, and in the seventh year of his reign"` (Whiston).

No wrong places and no unsupported claims found in the sample. Not opened: the Latin
text of Gregory of Tours (checked via the e-Clavis summary only).
