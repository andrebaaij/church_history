# Verification — Thomas, Bartholomew, Matthew (far-east-south)

Independent check, 2026-10-14. Scope: `data/journeys/{thomas,bartholomew,matthew}.yaml`,
`data/places/far-east-south.yaml`, `data/sources/far-east-south.yaml`. Nothing under `data/` was edited.

## Method

- All 58 citations were extracted (file, claim id, grade, source, locator, quote) and numbered 1–58 in file order.
- Random pick: `shuf -n 12 --random-source=<(yes)` (GNU coreutils 9.7, run in a `debian:stable-slim`
  container because macOS has no `shuf`). It picked rows 4, 7, 12, 19, 21, 31, 33, 35, 40, 48, 52, 58.
- Added every other grade-A/B citation that has a quote: rows 5, 6, 15, 20, 29, 47, 50, 57.
  That makes **20 citations checked**.
- Texts were read at: Bible Gateway (KJV); New Advent (Eusebius HE 3 = `250103`, 5 = `250105`;
  Socrates HE 1 = `26011`; Irenaeus AH 3.1 = `0103301`; Jerome De vir. ill. = `2708`; Clement Strom. 4 = `02104`,
  Paed. 2 = `02092`; Martyrdom of Bartholomew = `0825`; Acts of Thomas = `0823`, Consummation of Thomas = `0824`);
  Perseids CTS (Acts of Thomas, tr. M. R. James 1924, §§162–170); LacusCurtius (Strabo 2.5.12, Jones' Loeb translation);
  NASSCAL e-Clavis (Passion of Matthew); Epigraphia Indica 18 / Gandhari.org CKI 53 (Takht-i-Bahi inscription).

## Results

| # | claim id | citation | exists? | supports claim? | grade ok? | note |
|---|---|---|---|---|---|---|
| 4 | thomas-one-of-twelve (A) | Luke 6:15 | yes | yes | yes | "Matthew and Thomas, James the son of Alphaeus…". The choosing is in 6:13; 6:15 gives the name. |
| 5 | thomas-die-with-him (A) | John 11:16 "Let us also go, that we may die with him." | yes | yes | yes | Quote is exact KJV. |
| 6 | thomas-asks-the-way (A) | John 14:5-6 "Lord, we know not whither thou goest; and how can we know the way?" | yes | yes | yes | Quote is exact (14:5). 14:6 gives "I am the way, the truth, and the life". |
| 7 | thomas-doubts-and-confesses (A) | John 20:24-29 "My Lord and my God." | yes | yes | yes | Quote is exact (20:28). "After eight days" is in 20:26. |
| 12 | thomas-parthia (C) | Socrates HE 1.19 "Thomas received the apostleship of the Parthians" | yes | yes | yes | Exact NPNF wording, Book I ch. 19. A 5th-c. writer relaying older material, so C. |
| 15 | thomas-monsoon-route (B) | Strabo 2.5.12 "about one hundred and twenty ships sail from Myos-hormos to India" | yes | yes (for the Red Sea–India sailings) | yes | Right passage. The quote is Hamilton & Falconer's wording (1903, Perseus); Jones (Loeb/LacusCurtius) has "as many as one hundred and twenty vessels were sailing from Myos Hormos to India". The source record names no edition. Strabo does not mention Okelis, Muziris or the 40 days; those come from the Pliny 6.26 citation in the same claim. A contemporary historian, so B is right. |
| 19 | thomas-gondophares-real (A) | Takht-i-Bahi inscription, line 1 (year 103, regnal year 26) | yes | yes | yes (contemporary inscription) | The inscription exists: CKI 53, "So-called Takht-i-Bahi inscription of the year 103", Lahore Museum, ed. Konow (CII II.1; EI 18). It names Guduvhara, year 103 and regnal year 26. I could not see the line-by-line edition online, so "line 1" is **unverified**. The findspot is uncertain (hence "so-called"). AD 46 depends on the era equation, which the notes already flag. |
| 20 | thomas-death-natural (B) | Clement, Stromata 4.9 "Of whom are Matthew, Philip, Thomas, Levi, and many others." | yes | yes, with a caveat | yes (Heracleon c. 170) | The quote is exact, in Book IV ch. 9 (§71). Caveat: the ANF English just before it reads "for all the saved have confessed with the confession made by the voice, and departed", which seems to say the **opposite** of the claim. The claim follows the usual reading of the Greek ("not all the saved…"). The Greek was not checked online. Suggest a note so a teacher who clicks the link isn't confused. |
| 21 | thomas-death-calamina (D) | Acts of Thomas 164-168 | yes, but not at the linked URL | yes | yes | §§164–168 (James numbering): Misdaeus decides on death (164), hands him to four soldiers and an officer to "take him into the mountain and there pierce him with spears" (165), and "the four came and pierced him with their spears" (168). Problem: the source URL (New Advent `0823`) has only the first part of the Acts and no section numbers. The death is on New Advent `0824` (*Consummation of Thomas*). |
| 29 | bartholomew-nathanael-story (A) | John 1:45-51 "Behold an Israelite indeed, in whom is no guile!" | yes | yes | yes | Exact (1:47). The Nathanael = Bartholomew link is rightly flagged as a later inference in the notes. Cana is in 21:2, the claim's other citation. |
| 31 | bartholomew-india-pantaenus (C) | Eusebius HE 5.10.3 "For Bartholomew, one of the apostles, had preached to them, and left with them the writing of Matthew in the Hebrew language" | yes | yes | yes | Exact NPNF wording. Eusebius hedges ("is said", "It is reported"), so C is right. |
| 33 | bartholomew-india-near-ethiopia (C) | Socrates HE 1.19 "Matthew was allotted Ethiopia; and Bartholomew the part of India contiguous to that country" | yes | yes | yes | Exact. "Most likely South Arabia" is a modern inference, but the notes mark it as one. |
| 35 | bartholomew-death-india-beheaded (D) | Martyrdom of Bartholomew, "final section" "…beaten with rods; and after having been thus scourged, to be beheaded" | yes | yes | yes | Exact. Polymius' demoniac daughter and Astreges as "the elder brother" are confirmed. The locator is loose: it is the second-to-last paragraph (the sea burial and Polymius as bishop follow). |
| 40 | matthew-called (A) | Matthew 9:9 | yes | mostly | yes | "Follow me. And he arose, and followed him." Capernaum is named in neither Matt 9:9 nor the cited Mark 2:14 or Luke 5:27-28 (Matt 9:1 has only "his own city"). It is in **Mark 2:1**. "Levi son of Alphaeus" comes from Mark 2:14; that Matthew = Levi is a harmonisation, though a standard one. |
| 47 | matthew-writes-gospel (B) | Eusebius HE 3.39.16 "Matthew wrote the oracles in the Hebrew language, and every one interpreted them as he was able." | yes | yes | yes | Exact. Papias c. 110–130 is the earliest source, so B. |
| 48 | matthew-writes-gospel (B) | Irenaeus AH 3.1.1 | yes | yes | yes | "Matthew also issued a written Gospel among the Hebrews in their own dialect, while Peter and Paul were preaching at Rome". This matches the claim word for word. |
| 50 | matthew-diet (B) | Clement, Paedagogus 2.1 "the apostle Matthew partook of seeds, and nuts, and vegetables, without flesh" | yes | yes | yes | Exact (Book II ch. 1). Clement c. 190–200 falls within the ~150-year window. |
| 52 | matthew-ethiopia-is-kush (A) | Acts 8:27 "a man of Ethiopia, an eunuch of great authority under Candace queen of the Ethiopians" | yes | **partly** | **no** | The quote is exact. But Acts says nothing about Kush/Meroë or Candace being a dynastic title. That part of the claim rests on Pliny NH 6.35 (a historian, c. 77, so grade B). The claim as a whole is graded A on the strength of the Acts half alone. |
| 57 | matthew-death-natural (B) | Clement, Stromata 4.9 (same quote as #20) | yes | yes, with the same caveat as #20 | yes | Heracleon lists Matthew and Levi separately, as the notes say. |
| 58 | matthew-death-ethiopia (D) | Passio Matthaei, "Naddaver narrative (summary in NASSCAL e-Clavis)" | yes (NASSCAL entry) | yes | yes | NASSCAL: "The city of Naddaver in Ethiopia is plagued by two magicians"; Matthew stays with "an Ethiopian named Candace, who had been baptized by Philip"; "a guard of Hyrtacus strikes Matthew with a sword, killing him." The locator points to a modern summary, not a passage of the text. The NASSCAL entry gives no date, so "probably 6th c." (and `written: 500–600`) is not backed by the linked page. |

## Places — Pleiades check (`data/places/far-east-south.yaml`)

All 10 Pleiades ids resolve. Each JSON title matches the place, and every `reprPoint` equals the coordinates in the file.

| place id | Pleiades id | JSON title | ok? |
|---|---|---|---|
| muziris | 50146 | Muziris | yes |
| berenike | 785986 | Berenice/Berenike | yes |
| coptos | 786010 | Coptos | yes |
| aila | 746700 | Aelana/Aila | yes |
| barbarikon | 59734 | Barbarikon | yes |
| taxila | 801825162 | Sirkap | yes (Sirkap = the 1st-c. city of Taxila) |
| calamina | 49933 | Calamina | yes |
| eudaimon-arabia | 39269 | Adane/Athenae/Eudaimon Arabia | yes |
| armenia-maior | 863747 | Armenia Maior | yes |
| pontus | 857287 | Pontus | yes |

`mylapore` and `albac` have no Pleiades URL. They are correctly backed by grade-E location claims instead.

## Must fix

1. **matthew-ethiopia-is-kush — wrong grade.** Change `grade: A` → `grade: B`. The Kush/Meroë and "Candace = dynastic
   title" part rests on Pliny NH 6.35 (6.186), a 1st-c. historian (grade B). Acts 8:27 only says "Candace queen of the
   Ethiopians". Alternative: split into an A claim (Acts 8:27: the queen of the Ethiopians was called Candace) and a
   B claim (Pliny: Ethiopia = Meroë, Candace a dynastic name).
2. **acts-of-thomas source — URL does not contain the cited sections.** The cited §§164–168 (the martyrdom) are not on
   `https://www.newadvent.org/fathers/0823.htm`, and that page has no section numbers. Either add the James translation
   with numbered sections (e.g. `https://cts.perseids.org/read/greekLit/tlg2038/tlg001/1st1K-eng1/162-170`) as the
   `url`/edition (M. R. James, *The Apocryphal New Testament*, 1924), or add a separate source for the ANF
   *Consummation of Thomas* (`https://www.newadvent.org/fathers/0824.htm`) and point `thomas-death-calamina` at it.
3. **matthew-called — Capernaum unsupported by the cited verses.** Add citation `{ source: mark-gospel, locator: "2:1" }`
   (Jesus "entered into Capernaum"; the call follows at 2:13-14), or drop "at Capernaum" from the claim text.

## Should fix (not wrong, but weak)

- **thomas-gondophares-real**: "line 1" could not be checked online. Either cite as `CII II.1 no. XX / CKI 53` with
  the Gandhari.org URL, or mark the line `UNVERIFIED`. Optionally write "the so-called Takht-i-Bahi inscription"
  (the findspot is uncertain; the stone is in the Lahore Museum).
- **thomas-monsoon-route / Strabo**: give the `strabo-geography` source an `edition` (Hamilton & Falconer 1903, Perseus)
  that matches the quoted wording, or switch the quote to the Jones (Loeb) wording.
- **thomas-death-natural / matthew-death-natural**: add a note that the ANF English of Strom. 4.9 is garbled ("for all
  the saved have confessed…"), and that the claim follows the Greek reading "not all the saved…". Cite 4.9.71 for precision.
- **matthew-death-ethiopia**: replace the locator with a reference to the Latin text (BHL 5690, Passio Matthaei
  ch. on Naddaver) and source the "probably 6th c." date (NASSCAL does not give it), or mark the date `UNVERIFIED`.
- **bartholomew-death-india-beheaded**: the locator "final section" should be "second-to-last paragraph"
  (before the sea burial of the relics and Polymius' episcopate).
