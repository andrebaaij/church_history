# Verification — John, James son of Zebedee, James brother of Jesus

Independent check, 2026-10-14. Scope: `data/journeys/john.yaml`, `data/journeys/james-zebedee.yaml`,
`data/journeys/james-brother-of-jesus.yaml`, `data/places/john-james.yaml`, `data/sources/john-james.yaml`
(+ the shared sources in `data/sources/common.yaml` that these files cite).

## Method

- 102 citations extracted (claim id, claim grade, source, locator, quote), numbered 1–102 in file order
  (john → james-zebedee → james-brother-of-jesus, claims and citations in YAML order).
- **Random pick:** `shuf` is not installed on this machine (no GNU coreutils), so
  `shuf -n 12 --random-source=<(yes)` could not be run. Substitute, equally reproducible:
  `python3 -c "import random; random.seed(0); random.sample(lines, 12)"` over the numbered list →
  #6, 34, 39, 46, 50, 52, 54, 62, 63, 66, 98, 101.
- **Plus every citation in a grade-A or grade-B claim that has a `quote`** → #9, 17, 19, 20, 27, 32, 33, 37, 38,
  39, 40, 43, 44, 46, 66, 69, 70, 71, 79, 80, 95, 97, 98, 100.
- Union = **32 citations checked**.
- Texts compared against the edition the source entry names: scripture = KJV on Bible Gateway (the `locatorUrl`);
  Irenaeus, Eusebius (NPNF2, McGiffert), Jerome, Tertullian, Clement, Victorinus = New Advent; Josephus = Whiston
  (Project Gutenberg #2848); Philip of Side = P. Kirby, *Putting Papias in Order*.
- "Grade ok?" applies the README rule: grade the claim by its earliest traceable source.

## Results

| # | claim id | citation | exists? | supports claim? | grade ok? | note |
|---|---|---|---|---|---|---|
| 6 | john-inner-three | Mark 14:33 | yes | yes | yes (A) | "he taketh with him Peter and James and John" (Gethsemane). |
| 9 | john-beloved-disciple-mary | Irenaeus AH 3.1.1 | yes | yes (identification only) | yes | Quote exact. Claim is A via John 19; Irenaeus supports only the note's "beloved disciple = John", which the note correctly grades B. |
| 17 | john-patmos-under-domitian | Irenaeus AH 5.30.3 | yes | yes | yes (B) | Quote exact: "towards the end of Domitian's reign". |
| 19 | john-patmos-under-domitian | Victorinus, Comm. Apoc. on 10:11 | yes | yes | yes | Quote exact. Victorinus (c. 260–304) is itself C-level, but the claim's B rests on Irenaeus. |
| 20 | john-patmos-under-domitian | Jerome, Vir. ill. 9 | yes | yes | yes | Quote exact. Jerome (392) is C-level on its own; claim grade still B via Irenaeus. |
| 27 | john-returns-to-ephesus | Clement, Quis dives 42 | yes | yes | yes (B) | Quote exact. |
| 32 | john-gospel-at-ephesus | Irenaeus AH 3.1.1 | yes | yes | yes (B) | Quote exact (ellipsis legitimate). |
| 33 | john-gospel-at-ephesus | Eusebius HE 6.14.7 | yes | yes | yes (B) | Clement's Hypotyposes quoted: "last of all, John … composed a spiritual Gospel." |
| 34 | john-gospel-at-ephesus | Jerome, Vir. ill. 9 | yes | yes | yes | Jerome: John wrote "most recently of all the evangelists … at the request of the bishops of Asia". |
| 37 | john-teaches-polycarp | Eusebius HE 5.20.6 | yes | yes | yes (B) | Irenaeus to Florinus: "the accounts which he gave of his intercourse with John". |
| 38 | john-teaches-polycarp | Irenaeus AH 3.3.4 | yes | partly | yes | **Quote reorders the text** (see Must fix). 3.3.4 says Polycarp was appointed "by apostles in Asia" — it does not name John. |
| 39 | john-teaches-polycarp | Tertullian, Praescr. 32 | yes | yes | yes (B) | Quote exact. |
| 40 | john-two-johns-papias | Eusebius HE 3.39.4 | yes | yes | yes (B) | Papias quote exact (ellipses legitimate). |
| 43 | john-dies-at-ephesus | Irenaeus AH 2.22.5 | yes | yes | yes (B) | Quote exact: "he remained among them up to the times of Trajan". |
| 44 | john-dies-at-ephesus | Eusebius HE 3.31.3 | yes | yes | yes (B) | **Quote wording not at this locator** (see Must fix). 3.31.3 (NPNF) reads "He also sleeps at Ephesus."; "He fell asleep at Ephesus." is the same Polycrates letter at HE 5.24.3. |
| 46 | john-dies-at-ephesus | Jerome, Vir. ill. 9 | yes | yes | yes | Quote exact. |
| 50 | john-killed-by-the-jews | Philip of Side epitome, Cod. Barocc. 142 | yes | yes | yes (C) | Quote exact per Kirby/Lightfoot. C correct: later epitome relaying a lost Papias passage. |
| 52 | james-zebedee-called | Mark 1:19-20 | yes | yes | yes (A) | "in the ship mending their nets … left their father Zebedee in the ship". |
| 54 | james-zebedee-called | Luke 5:10 | yes | yes | yes (A) | "James, and John, the sons of Zebedee, which were partners with Simon". |
| 62 | james-zebedee-the-cup | Mark 10:35-40 | yes | yes | yes (A) | Claim text's quote "The cup that I drink you will drink" is ESV wording, not the linked KJV ("Ye shall indeed drink of the cup that I drink of"). Acceptable as paraphrase; see Should fix. |
| 63 | james-zebedee-the-cup | Matthew 20:20-23 | yes | yes (with nuance) | yes (A) | In Matthew the *mother* of the sons of Zebedee makes the request; claim text follows Mark. |
| 66 | james-zebedee-chooses-james-the-just | Eusebius HE 2.1.3 | yes | yes | yes (B) | Clement, Hypotyposes 6: "Peter and James and John … chose James the Just bishop of Jerusalem". |
| 69 | james-zebedee-killed-by-herod | Josephus, Ant. 19.8.2 | yes | yes (dating context only) | yes | Quote matches Whiston (spelling "Cæsarea"). Corroborates Agrippa's death at Caesarea, not James' death; claim is A via Acts 12. |
| 70 | james-zebedee-killed-by-herod | Jerome, Vir. ill. 9 | yes | yes | yes | Quote exact. Jerome alone would be C; claim is A via Acts 12:2. |
| 71 | james-zebedee-accuser-converted | Eusebius HE 2.9.2-3 | yes | yes | yes (B) | Clement, Hypotyposes 7; quote exact. |
| 79 | james-brother-of-jesus-chosen-bishop | Eusebius HE 2.1.2-3 | yes | yes | yes (B) | 2.1.2 is Eusebius' own "is recorded"; Clement's words are 2.1.3. Fine. |
| 80 | james-brother-of-jesus-chosen-bishop | Eusebius HE 2.23.4 | yes | yes | yes (B) | Hegesippus; quote exact. |
| 95 | james-brother-of-jesus-stoned-by-ananus | Josephus, Ant. 20.9.1 | yes | yes | yes (B) | Quote matches Whiston exactly. Non-Christian near-contemporary historian → B per brief. |
| 97 | james-brother-of-jesus-thrown-from-temple | Eusebius HE 2.23.4-18 | yes | yes | yes (B) | Hegesippus runs 2.23.4–18; prayer quote exact (2.23.16); "immediately Vespasian besieged them" at 2.23.18. |
| 98 | james-brother-of-jesus-thrown-from-temple | Eusebius HE 2.1.4 | yes | yes | yes (B) | Clement, Hypotyposes 7; quote exact. |
| 100 | james-brother-of-jesus-symeon-successor | Eusebius HE 4.22.4 | yes | yes | yes (B) | Hegesippus: "Symeon, the son of the Lord's uncle, Clopas, was appointed the next bishop". |
| 101 | james-brother-of-jesus-symeon-successor | Eusebius HE 3.11 | yes | yes | yes | "it is said" (C-level), as the claim note already states; 3.11.2 cites Hegesippus for Clopas = brother of Joseph. |

### Pleiades (`data/places/john-james.yaml`)

| place id | Pleiades | JSON title | match? |
|---|---|---|---|
| smyrna | 550893 | Smyrna/Eurydikeia | yes |
| pergamum | 550812 | Pergamum | yes |
| thyatira | 550924 | Thyateira | yes |
| sardis | 550867 | Sardis/Hyde? | yes |
| philadelphia-lydia | 550822 | Philadelpheia | yes |
| laodicea | 638955 | Laodicea ad Lycum/Diospolis/Roas | yes |
| iria-flavia | 236491 | Iria Flavia | yes |

All seven coordinates also agree with the Pleiades `reprPoint` to ~3 decimals.

## Must fix

1. **john-dies-at-ephesus — eusebius-he "3.31.3"** (`data/journeys/john.yaml:210`): the quoted words "He fell asleep at
   Ephesus." are not at 3.31.3 in the cited edition (NPNF2, McGiffert), which reads "He also sleeps at Ephesus."
   The quoted wording is at HE 5.24.3 (same Polycrates letter). Correct to either
   `{ source: eusebius-he, locator: "3.31.3", quote: "(quoting Polycrates of Ephesus, c. 190) He also sleeps at Ephesus." }`
   or `{ source: eusebius-he, locator: "5.24.3", quote: "(quoting Polycrates of Ephesus, c. 190) He fell asleep at Ephesus." }`.
2. **john-teaches-polycarp — irenaeus-ah "3.3.4"**: the quote "appointed bishop… by apostles in Asia" reverses the
   original word order ("by apostles in Asia, appointed bishop of the Church in Smyrna"); an ellipsis may not reorder text.
   Correct quote to: `by apostles in Asia, appointed bishop of the Church in Smyrna`.

No wrong locators beyond #1, no unsupported claims, no wrong grades and no wrong places were found in the sample.

## Should fix (not errors, but worth tidying)

- **james-zebedee-the-cup** claim text, and citation #51 (john-killed-by-the-jews, Mark 10:39, quote "the cup that
  I drink you will drink" — outside the sample, noticed in passing): the wording is ESV, but the source links KJV
  ("Ye shall indeed drink of the cup that I drink of"). Either use KJV wording or mark it as a paraphrase.
- **james-zebedee-the-cup**: Matthew 20:20-21 has the mother make the request; the text could say "James and John
  (in Matthew, their mother) ask…".
- **john-teaches-polycarp**: Irenaeus AH 3.3.4 does not name John; the John link rests on Eus. HE 5.20.6 and
  Tertullian. Fine as is, but don't let 3.3.4 stand alone if other citations are trimmed.
- Grade-A claims **james-zebedee-killed-by-herod** and **john-beloved-disciple-mary** include later supporting
  citations (Jerome, Josephus, Irenaeus). Grades are correct (claim graded by earliest source), but the UI should
  not suggest those later citations are themselves grade A.

Not checked (outside sample): the other 70 citations, incl. all grade-C/D/E citations except #50.
