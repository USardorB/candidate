# Answers / Ответы / Жавоблар

Name / Имя / Исм: Sardor Uchqunov

## Part 2 — Bugs / Ошибки / Хатолар

1. Dates show the previous month
   - Cause: JavaScript'da `getUTCMonth()` oylarni 0 dan boshlab sanaydi, shuning uchun ekranda doim 1 oy orqada ko'rsatgan.
   - Fix: `formatDate` funksiyasida oy qiymatiga `+ 1` qo'shildi.
2. Crash when opening order 4000105
   - Cause: Operatsiyasi bo'lmagan buyurtmalarda `order.Operations` maydoni yo'q yoki `results` mavjud emas, shuning uchun `undefined.results` xatosi chiqib dastur ishdan chiqgan.
   - Fix: `getOperations` funksiyasida xavfsiz murojaat qilindi, error o'rniga bo'sh massiv qaytariladi.
3. Total hours show `02.51.5`
   - Cause: `PlannedHours` json'da string sifatida kelgani uchun raqamlar qo'shilmasdan bir-biriga ulanib ketgan (`"0" + "2.5" + "1.5"`).
   - Fix: `reduce` ichida har bir operatsiya soatini stringdan songa parse qilib keyin qo'shildi.

## Part 3 — Plant 2000 config

Why the file looks like this:
`config/plant-2000.json` faylida faqatgina standartdan farq qiladigan sozlamalar qoldirildi. `src/config.js` ichidagi `merge` funksiyasi massivlarni to'liq almashtirishi sababli, `requiredFields` massiviga standart maydonlar bilan birga yangi majburiy `MalfunctionStart` ham kiritildi. Qolgan umumiy narsalar esa `default.json`dan avtomatik meros qilib olinadi.

## Part 4 — Questions / Вопросы / Саволлар

1. **Uskunalar, xabarnomalar va buyurtmalar qanday bog'langan va nega ular alohida obyektlar?**
   Ma'lumotlarda har bir uskunaning EquipmentIdsi bor. Notification ham, Order ham aynan shu EquipmentId'si orqali unga ulanadi. 
   Ular nega alohida: Xabarnoma — bu shunchaki sexdagi operator payqagan signal ("nima bo'ldi", masalan: shlangdan moy oqayapti). Buni oddiy ishchi ham tezda yoza olishi kerak. Buyurtma esa — bu muammoni hal qilish rejasi ("qanday tuzatamiz", qancha vaqt, qaysi ustaxonalar va ehtiyot qismlar kerak). Hayotda har bir arzigan xabarga remont buyurtmasi ochilavermaydi va asosan, orderni tasdiqlaydigan alohida masul shaxs bo'ladi, va bu esa, userni bilimsizligi/tushunmovchilik orqali ochilgan notificationlarni filterlab turadi. Shuning uchun ularning roli ham, javobgari ham alohida bo'lgani qulay.

2. **`/Date(1790000000000)/` formati qanday son va nega oddiy matndan ko'ra yaxshiroq?**
   Bu son — Unix timestamp. SAP OData tizimlari sanani shunday formatda uzatadi.
   Nega `"05.10.2026"` qilib yubormaydi: Birinchidan, matnli sanada chalkashlik ko'p (masalan, 5-oktyabrmi yoki 10-maymi, davlatga qarab xar xil o'qiladi). Ikkinchidan, timezonega bog'liq emas, uni saralash, taqqoslash va istalgan formatga o'girish ancha yengil hamda xatosiz bo'ladi.

3. **Buyurtma planshetda bajarilgan, lekin SAP'ga yetib bormagan — tekshirish tartibi:**
   Mobil dasturchi sifatida muammoni quyidagicha qidirardim:
   1. **Masofaviy loglar va monitoring (Remote telemetry):** Agar ilovada log jo'natish tizimi (Crashlytics, Sentry yoki o'zimizning log collector servisimiz) bo'lsa, birinchi navbatda foydalanuvchi/planshet ID bo'yicha so'nggi xatoliklarni tekshiraman: tarmoq timeout'i bo'lganmi, 4xx/5xx xatosi qaytganmi yoki token eskirganmi.
   2. **Planshetdagi lokal holat (Lokal DB / Outbox navbati):** Agar foydalanuvchi bilan aloqa bo'lsa, ilova interfeysidagi sinxronizatsiya bo'limini tekshiramiz. Bajarilgan buyurtma lokal SQLite / Realm bazasida `PENDING_SYNC` yoki `FAILED` bo'lib turib qolgan bo'lishi mumkin (masalan, internet yo'qligi yoki conflict tufayli).
   3. **Qurilmaga to'g'ridan-to'g'ri kirish (ADB / DevTools orqali reproduksiya):** Agar qurilma qo'limizda bo'lsa yoki USB/Wi-Fi orqali ulana olsak:
      - `adb logcat` orqali real vaqtda crash, background worker (masalan, WorkManager/JobScheduler) va network loglarini filtrlab ko'raman.
      - Network inspector (Charles Proxy / Flipper / Chucker) orqali SAP Gateway'ga aniq qanday payload ketayotgani va serverdan qanday javob (HTTP status va response body) kelayotganini tekshiraman.

## Part 5 — Bonus (optional) / Бонус / Бонус

Option (5A / 5B / 5C / 5D): 5C

What I did and why (3–5 sentences):
`data/history.json` faylidagi 12 oylik nosozliklar asosida har bir uskunaning MTBF (Mean Time Between Failures — buzilishlar orasidagi o'rtacha ishlash vaqti) va MTTR (Mean Time To Repair — o'rtacha ta'mirlash vaqti) ko'rsatkichlarini avtomatik hisoblaydigan skript yozdim (`bonus/analyze.js` va batafsil hisobot: `bonus/MTBF_ANALYSIS.md`). Ushbu task tanlanishi, bizda aniq data mavjud va bu biznes samaradorligi uchun muhim bo'lgan omillardan hisoblanadi. Quida `data/history.json` faylidan analiz qilingan malumotlar: 
1) **Press line 1** — eng ko'p buzilgan (9 marta, MTBF eng past: ~970 soat); 
2) **Extrusion press B1** — eng ko'p to'xtab turgan (jami 39.5 soat downtime); 
3) **Extrusion press 2** — ta'mirlash eng uzoq vaqt oladigan uskuna (MTTR = 6.0 soat).
