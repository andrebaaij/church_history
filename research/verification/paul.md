# Verification — Paul (`data/journeys/paul.yaml`, `data/places/paul.yaml`, `data/sources/paul.yaml`)

Independent check, 2026-10-14. Grading rules: `research/README.md`.

## Method

- Extracted every citation from `data/journeys/paul.yaml`: **162 citations across 87 claims**.
- **Random sample:** the brief asked for `shuf -n 12 --random-source=<(yes)`, but neither `shuf` nor `gshuf` is installed on this machine (macOS). As a reproducible substitute, the list (one row per citation, file order) was sampled with
  `python3 -c 'import random; random.Random(0).sample(range(162), 12)'` → rows 11, 56, 67, 78, 92, 99, 104, 108, 123, 125, 131, 150.
- **Forced set:** every grade-A/B claim's citation that carries a `quote` (12 rows: 36, 78, 117, 137, 138, 148, 149, 150, 152, 153, 154, 160). Rows 78 and 150 are in both sets → **22 citations checked**.
- Passages opened online: scripture on Bible Gateway (KJV, the edition the app links); 1 Clement, Ignatius, Eusebius, Tertullian on New Advent; Suetonius on LacusCurtius; Josephus (Whiston) on Perseus; Muratorian Fragment on earlychristianwritings.com (Metzger).
- Pleiades: fetched `https://pleiades.stoa.org/places/<id>/json` for all 33 places in `data/places/paul.yaml`.

## Citation checks

| # | claim id | citation | exists? | supports claim? | grade ok? | note |
|---|---|---|---|---|---|---|
| 11 | paul-persecutor | Acts 7:58 | yes | partly | A ✓ | Supports "guards the cloaks" ("laid down their clothes at a young man's feet, whose name was Saul"). "Approves" and "ravages the church" come from 8:1-3 and the other citations. Together the citations cover the claim. |
| 56 | paul-antioch-incident | Galatians 2:11-14 | yes | partly | A ✓ | Supports Paul opposing Peter "to the face" over withdrawing from Gentile table fellowship. The John Mark split is in Acts 15:37-40 (covered by the claim's other citation). |
| 67 | paul-thessalonica | Acts 17:1-10 | yes | yes | A ✓ | Amphipolis, Apollonia, "three sabbath days", assault on Jason's house, sent away "by night unto Berea": all present. |
| 78 | paul-claudius-expulsion | Suetonius, *Claudius* 25.4 | yes | yes | B ✓ | LacusCurtius (Rolfe): "Since the Jews constantly made disturbances at the instigation of Chrestus, he expelled them from Rome." **Quote exact.** The Acts 18:2 part is also verified ("Claudius had commanded all Jews to depart from Rome"). Suetonius (c. 120) is a historian within 150 years, so B is right. |
| 92 | paul-ephesus-riot | Acts 19:23-41 | yes | yes | A ✓ | Demetrius the silversmith, shrines, "Great is Diana of the Ephesians" "about the space of two hours" (v.34), town clerk (v.35). KJV says "Diana"; the claim's "Artemis" is the Greek name and is fine. |
| 99 | paul-macedonia-2-corinthians | 2 Corinthians 8:1–9:15 | yes | yes (collection) | A ✓ | Covers the collection. Titus' arrival with good news is 7:6-7 (the claim's other citation). That Paul *writes* from Macedonia is inferred from 9:2-4, which is standard. |
| 104 | paul-spain-plan | Romans 15:22-33 | yes | yes | A ✓ | v.24/28 "I take my journey into Spain … I will come by you into Spain"; v.25-26 Jerusalem collection. |
| 108 | paul-miletus-farewell | Acts 20:17-38 | yes | yes | A ✓ | Event verified (v.25, 37-38). Claim text quotes "you all will see my face no more"; KJV v.25 reads "ye all … shall see my face no more" (paraphrase inside quote marks; see Should fix). |
| 123 | paul-malta-to-puteoli | Acts 28:11-14 | yes | yes | A ✓ | Alexandrian ship, sign "Castor and Pollux" (= the Twin Brothers / Dioscuri), Syracuse 3 days, Rhegium, Puteoli, 7 days with brethren. |
| 125 | paul-rome-two-years | Acts 28:16-31 | yes | yes | A ✓ | v.16 soldier guard, v.30 "two whole years in his own hired house". **Quote in claim text doesn't match:** claim says "with all boldness, no man forbidding him", KJV v.31 says "with all confidence, no man forbidding him" (claim text mixes ESV and KJV). |
| 131 | paul-prison-letters | Ephesians 6:20 | yes | yes | A ✓ | "an ambassador in bonds". Supports Ephesians as a prison letter. The claim's "the whole praetorium" is not KJV wording: Phil 1:13 KJV says "in all the palace" (see Should fix). |
| 150 | paul-martyrdom-rome-nero | Eusebius, *HE* 2.25.8 | yes | yes | B ✓ | "And they taught together in like manner in Italy, and suffered martyrdom at the same time." **Quote exact.** It is Dionysius of Corinth (c. 170) quoted by Eusebius. By the earliest-source rule that makes it B. |
| 36 | paul-famine-josephus | Josephus, *Ant.* 20.101 | yes | yes | B ✓ | Perseus (Whiston) chunk 20.100ff: "Under these procurators that great famine happened in Judea". **Quote exact.** Niese §101 ✓. Josephus (93/94) is a non-Christian historian within 150 years, so B. |
| 117 | paul-festus-josephus | Josephus, *Ant.* 20.182 | yes | yes | B ✓ | Perseus §182: "Now when Porcius Festus was sent as successor to Felix by Nero". **Quote exact** (with "Now when" dropped). |
| 137 | paul-spain-visit | 1 Clement 5.6-7 | yes | yes | B ✓ | New Advent ch. 5: "having taught righteousness to the whole world, and come to the extreme limit of the west". **Quote exact**, and it falls in 5.7 (standard numbering), so 5.6-7 is right. The claim's notes already flag the Rome-vs-Spain ambiguity. |
| 138 | paul-spain-visit | Muratorian Fragment, lines 38-39 | yes | yes | B ✓ | Metzger tr.: "(38) as well as the departure of Paul from the city [of Rome] (39) when he journeyed to Spain". **Quote exact** (with the editorial "[of Rome]" dropped). Line numbers match. B is acceptable given the c. 170–200 date. The notes already mention the minority 4th-c. dating. |
| 148 | paul-martyrdom-rome-nero | 1 Clement 5.5-7 | yes | yes (martyrdom) | B ✓ | "suffered martyrdom under the prefects": **quote exact**. Clement does not name Rome or Nero; those details come from the other citations. |
| 149 | paul-martyrdom-rome-nero | Ignatius, *Eph.* 12.2 | yes | partly | B ✓ | "with Paul, the holy, the martyred, the deservedly most happy": **quote exact**. But Ignatius here names **only Paul**, with no Peter and no Rome. The claim text says Ignatius remembers "Peter and Paul as the martyred founders of the church in Rome". That is **not supported** by this locator. See Must fix. |
| 152 | paul-beheaded | Tertullian, *Praescr.* 36 | yes | yes | B ✓ | "Where Paul wins his crown in a death like John's": **quote exact**, and ch. 36 is confirmed. Tertullian (c. 200) is within ~150 years. |
| 153 | paul-beheaded | Tertullian, *Scorpiace* 15 | yes | yes | B ✓ | Ch. 15 is confirmed. The original reads "That Peter is struck, that Stephen …, that James …, that Paul is beheaded has been written in their own blood." The stored quote silently cuts the list; it should start with "…" (see Should fix). |
| 154 | paul-beheaded | Eusebius, *HE* 2.25.5 | yes | yes | B ✓ (as supporting) | "It is, therefore, recorded that Paul was beheaded in Rome itself": **quote exact**. Eusebius alone would be C, but the claim's grade rests on Tertullian (B), so B is correct. |
| 160 | paul-trophy-ostian-way | Eusebius, *HE* 2.25.7 | yes | yes | B ✓ | "For if you will go to the Vatican or to the Ostian way, you will find the trophies of those who laid the foundations of this church": **quote exact**. This is Gaius (c. 200) quoted by Eusebius, so B by the earliest-source rule. |

**Result:** all 22 locators exist and point at the right passage. All 12 stored `quote`s that were checked match the original, apart from one silent cut (#153). All grades follow the README rules. One claim text overstates what its citation says (#149). Two quotations inside claim texts don't match the edition the app links (#125, and #108 more loosely).

## Pleiades checks (`data/places/paul.yaml`, 33 places)

All 33 IDs resolve, and every JSON `title` matches the place:

| place id | Pleiades id | Pleiades title | ok? |
|---|---|---|---|
| tarsus | 648789 | Tarsus/Antiochia ad Cydnum | ✓ |
| nabataea | 29677 | Nabataea (region) | ✓ |
| perge | 639048 | Perge | ✓ |
| pisidian-antioch | 609307 | Antiochia/Col. Caesarea (Yalvac) | ✓ |
| iconium | 648647 | Iconium/Claudiconium | ✓ |
| lystra | 648699 | Lystra/Col. Iulia Felix Gemina | ✓ |
| derbe | 648621 | Derbe | ✓ |
| attalea | 638778 | Attalea | ✓ |
| galatia | 619161 | Galatia | ✓ |
| troas | 550434 | Antigoneia/(Col. Augusta) Alexandria Troas | ✓ |
| neapolis | 501523 | Neapolis (Kavalla) | ✓ |
| philippi | 501482 | Krenides/Philippi/Col. Augusta Iulia Philippensis | ✓ |
| thessalonica | 491741 | Thessalonica | ✓ |
| beroea | 491546 | Ber(r)oia | ✓ |
| cenchreae | 570347 | Kenchreai | ✓ |
| illyricum | 481865 | Illyricum | ✓ |
| assos | 550463 | Assos/Apollonia | ✓ |
| miletus | 599799 | Miletus | ✓ |
| patara | 639042 | Patara/Arsinoe | ✓ |
| tyre | 678437 | Tyrus/Col. Septimia Severa | ✓ |
| ptolemais | 678010 | Ake/Ptolemais | ✓ |
| sidon | 678393 | Sidon/Col. Aurelia Pia | ✓ |
| myra | 639005 | Myra | ✓ |
| cnidus | 599575 | Cnidus (Tekir) | ✓ |
| fair-havens | 589834 | Kaloi Limenes | ✓ |
| malta | 462311 | Melita/Malta (island) | ✓ |
| syracuse | 462503 | Syracusae/Syrakousai | ✓ |
| rhegium | 452416 | Rhegion/Regium | ✓ |
| puteoli | 432815 | Dikaiarcheia/Puteoli | ✓ |
| hispania | 1027 | Hispania | ✓ (coords deliberately moved to the east coast; already commented in the file) |
| gortyn | 589796 | Gortyn(a) | ✓ |
| nicopolis | 531013 | Nicopolis | ✓ |
| via-ostiensis | 390205932 | Via Ostiensis | ✓ (road entry; the marker is at the basilica, already commented in the file) |

Coordinates in the file match each Pleiades `reprPoint` to 3 decimals, except the two intentional, commented offsets (hispania, via-ostiensis).

## Must fix

1. **`paul-martyrdom-rome-nero`: claim text overstates Ignatius (citation `ignatius-ephesians` 12.2).** Ignatius, *Eph.* 12.2 calls *Paul* "the holy, the martyred". He names neither Peter nor Rome. Correct the text to something like:
   > "Paul dies as a martyr in Rome under Nero (AD 54–68). Clement of Rome (c. 96) tells of the martyrdom of Peter and Paul; Ignatius (c. 110) calls Paul 'the holy, the martyred'; Dionysius of Corinth (c. 170) and Irenaeus (c. 180) name Peter and Paul as founders of the church in Rome who suffered martyrdom."

   Keep the citations as they are. Clement 5.5-7 also does not name Rome or Nero, so the "in Rome under Nero" part rests on Dionysius via Eusebius 2.25.8, Irenaeus 3.3.2 and Eusebius 2.25.5. The wording above makes that clear.
2. **`paul-rome-two-years`: the quotation in the claim text doesn't match the linked KJV.** Change `'with all boldness, no man forbidding him'` to `'with all confidence, no man forbidding him'` (Acts 28:31 KJV). The alternative is to drop the quote marks.

## Should fix (minor, not errors of fact)

- `paul-miletus-farewell`: the quoted words `'you all will see my face no more'` should match KJV Acts 20:25: `'ye all … shall see my face no more'`.
- `paul-prison-letters`: `'the whole praetorium'` is not in KJV (Phil 1:13 "in all the palace"). Either quote the KJV, or say "the praetorium (imperial guard)" without quote marks.
- `paul-beheaded`, citation `tertullian-scorpiace` 15: prefix the quote with an ellipsis: `"… that Paul is beheaded has been written in their own blood"`.
- `paul-beheaded`: none of the cited passages says "the death of a Roman citizen". That is an inference from Acts 22:25-28 plus Roman practice, so move it to `notes`.
- `josephus-antiquities` and `suetonius-caesars` (in `data/sources/common.yaml`, outside this file set) have no `url`/`locatorUrl`. Candidates: Perseus `https://www.perseus.tufts.edu/hopper/text?doc=J.+AJ+{locator}` (note that Perseus serves 20.101 inside the chunk starting at 20.100) and LacusCurtius `https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Suetonius/12Caesars/Claudius*.html`.
