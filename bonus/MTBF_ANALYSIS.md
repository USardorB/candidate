# Bonus 5C — MTBF va MTTR Tahlili (Uskunalar ishonchliligi)

Ushbu tahlil `data/history.json` faylidagi 12 oylik nosozliklar tarixi asosida hisoblandi.

Hisoblash skripti: `node bonus/analyze.js`

---

## 1. Asosiy ko'rsatkichlar (Metrikalar)

- **MTBF (Mean Time Between Failures)** — Nosozliklar orasidagi (buzulmasdan) o'rtacha ishlash vaqti (soatlarda). 
  - Formula: `MTBF = (Jami vaqt - Jami to'xtash vaqti) / Nosozliklar soni`
  - *Ma'nosi:* MTBF qancha yuqori bo'lsa, uskuna shuncha ishonchli, kam buziladigan.
- **MTTR (Mean Time To Repair)** — Ta'mirlashga ketgan o'rtacha vaqt (soatlarda).
  - Formula: `MTTR = Jami to'xtash vaqti / Nosozliklar soni`
  - *Ma'nosi:* MTTR qancha kichik bo'lsa, uskuna nosozligi shuncha tez bartaraf etiladi.
- **Availability (Tayyorlik koeffitsienti):** `(Ishlash vaqti / Jami vaqt) × 100%`

---

## 2. Natijalar jadvali

| Uskuna ID | Nomi | Zavod | Buzilishlar soni | Jami to'xtash (soat) | MTBF (soat) | MTTR (soat) | Availability |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| `000000000010000101` | **Press line 1** | 1000 | **9 marta** | 31.5 | **969.8** | 3.5 | 99.64% |
| `000000000010000201` | **Extrusion press B1** | 2000 | **7 marta** | **39.5** | **1245.8** | 5.6 | 99.55% |
| `000000000010000105` | **Powder paint line** | 1000 | **6 marta** | 7.5 | **1458.8** | 1.3 | 99.91% |
| `000000000010000102` | **Extrusion press 2** | 1000 | 5 marta | 30.3 | 1746.0 | **6.0** | 99.65% |
| `000000000010000103` | Compressor A | 1000 | 4 marta | 8.8 | 2187.8 | 2.2 | 99.90% |
| `000000000010000104` | Cooling tower | 1000 | 3 marta | 12.8 | 2915.8 | 4.3 | 99.85% |
| `000000000010000202` | Compressor B | 2000 | 2 marta | 2.5 | 4378.8 | 1.3 | 99.97% |
| `000000000010000203` | Overhead crane B | 2000 | 1 marta | 11.0 | 8749.0 | 11.0 | 99.87% |

---

## 3. Manager e'tibor qaratishi kerak bo'lgan 3 ta asosiy uskuna

1. **Press line 1 (1000-zavod):**
   - **Sabab:** Yil davomida eng ko'p buzilgan uskuna (9 marta) va MTBF eng past (atigi ~970 soat, ya'ni deyarli har 40 kunda bir marta jiddiy nosozlik yuz beradi).
2. **Extrusion press B1 (2000-zavod):**
   - **Sabab:** Korxonadagi barcha uskunalar ichida eng ko'p to'xtab turgan (39.5 soat umumiy downtime) va eng past tayyorlikka (99.55%) ega uskuna. MTTR ham 5.6 soatni tashkil qiladi — har bir ta'mir uzoq vaqt olmoqda.
3. **Extrusion press 2 (1000-zavod):**
   - **Sabab:** Ta'mirlash eng qiyin va uzoq kechadigan uskuna (MTTR = 6.0 soat, 30.3 soat umumiy to'xtash).