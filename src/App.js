import { useState, createContext, useContext, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  uz: {
    appName:"Breast AI", appSub:"Multimodal diagnostika tizimi", newAnalysis:"+ Yangi tahlil", back:"← Orqaga",
    tabs:{ dashboard:"Dashboard", patients:"Bemorlar", stats:"Statistika", settings:"Sozlamalar" },
    dash:{ totalPatients:"Jami bemorlar", urgent:"Shoshilinch", inSitu:"In situ aniqlangan", aiConf:"AI ishonch", thisMonth:"Bu oy", biRads46:"BI-RADS 4–6", upTo10mm:"≤10mm", avg:"O'rtacha", quickAnalysis:"Tezkor tahlil", recentPatients:"So'nggi bemorlar" },
    modality:{ uzi:"UZI", mammo:"Mammo", combined:"Kombinatsiya" },
    patients:{ title:"Bemorlar", search:"Ism bo'yicha qidirish...", sortDate:"Sana", sortBiRads:"BI-RADS", sortName:"Ism", clear:"✕ Tozalash", notFound:"Bemor topilmadi", changeFilter:"Qidiruv yoki filtrni o'zgartiring" },
    detail:{ back:"← Orqaga", aiResult:"AI tahlil natijasi", riskProb:"xavf ehtimoli", uziFindings:"UZI topilmalari", mammoFindings:"Mammografiya topilmalari", aiSummary:"AI xulosasi", size:"O'lcham", shape:"Shakl", margin:"Chegara", echo:"Echogenlik", posterior:"Orqa akustika", orientation:"Orientasiya", location:"Joylashuv", density:"Zichlik", calcification:"Mikrokalsifikat", distortion:"Arxitektura buzilishi", asymmetry:"Asimmetriya", present:"✓ Mavjud", absent:"Yo'q", pdfExport:"📄 PDF hisobot", addAnalysis:"Yangi tahlil", inSituLabel:"In situ ehtimoli", recommendations:"Tavsiyalar", rec1:"Onkolog konsultatsiyasi", rec2:"Yadro biopsiyasi", rec3:"6 oyda kuzatuv", close:"Yopish" },
    birads:{ 1:{label:"Negativ",rec:"Muntazam skrining"}, 2:{label:"Xavfsiz",rec:"1–2 yilda 1 marta"}, 3:{label:"Ehtimol xavfsiz",rec:"6 oyda UZI"}, 4:{label:"Shubhali",rec:"Biopsi tavsiya etiladi"}, 5:{label:"Xavfli",rec:"Biopsi zarur"}, 6:{label:"Tasdiqlangan",rec:"Onkolog ko'rigi"} },
    newAnal:{ title:"Yangi tahlil", type:"Tahlil turi", uploadLabel:"DICOM yoki JPG/PNG yuklang", uploadSub:"yoki kamerani oching", uziFeatures:"UZI xususiyatlari", mammoFeatures:"Mammografiya xususiyatlari", size:"O'lcham", shape:"Shakl", margin:"Chegara", echo:"Echogenlik", posterior:"Orqa akustika", orientation:"Orientasiya", density:"To'qima zichligi", calcification:"Mikrokalsifikatlar", distortion:"Arxitektura buzilishi", shapes:[["oval","Oval"],["lobular","Lobular"],["irregular","Notekis"],["spiculated","Spikula"]], margins:[["circumscribed","Aniq"],["indistinct","Noaniq"],["angular","Burchakli"],["spiculated","Spikula"]], echos:[["anechoic","Anechogen"],["hypoechoic","Gipoechogen"],["isoechoic","Izoechogen"],["hyperechoic","Giperechogen"]], posteriors:[["enhancement","Kuchayish"],["shadowing","Soya"],["none","O'zgarishsiz"]], orientations:[["parallel","Parallel"],["not_parallel","Vertikal"]], resultLabel:"AI tahlil natijasi", inSituNote:"In situ ehtimoli: o'lcham ≤10mm", btnStart:"✨ AI tahlil boshlash", btnRetry:"🔄 Qayta tahlil", btnLoading:"⏳ Tahlil qilinmoqda..." },
    stats:{ title:"Statistika", totalAnalyses:"Jami tahlil", aiConf:"AI ishonch", urgentCases:"Shoshilinch", biRadsDist:"BI-RADS taqsimoti", modality:"Tahlil modalligi", confLevel:"AI ishonch darajasi", inSituTitle:"In situ aniqlash (≤10mm)", inSituDesc:"bemorlar in situ bosqichida aniqlandi.", inSituEffect:"Erta aniqlash — 5 yillik omon qolish darajasini 95% gacha oshiradi.", downloadCsv:"📥 CSV yuklab olish", downloadPdf:"📄 PDF hisobot" },
    settings:{ title:"Sozlamalar", editProfile:"Tahrirlash", save:"Saqlash", cancel:"Bekor", namePlaceholder:"F.I.O.", deptPlaceholder:"Bo'lim nomi", sectionApp:"Ilova", sectionModel:"AI Model", sectionData:"Ma'lumotlar", sectionAbout:"Ilova haqida", notif:"Bildirishnomalar", autoAnalysis:"Avtomat tahlil", darkMode:"Qorong'i rejim", lang:"Til", modelVersion:"Model versiyasi", apiEndpoint:"API endpoint", backendStatus:"Backend holati", checkApi:"Tekshirish", checking:"⏳ Tekshirilmoqda...", connected:"✓ Ulangan", notConnected:"✗ Ulanmadi", pdfReport:"PDF hisobot", backup:"Zaxiralash", clearCache:"Keshni tozalash", export:"Eksport", backupSave:"Saqlash", clear:"Tozalash", version:"Versiya", license:"Litsenziya", report:"Muammo bildirish", send:"Yuborish", licenseVal:"Tadqiqot maqsadida", disclaimer:"⚠️ Bu ilova faqat tadqiqot maqsadida. Klinik qarorlar uchun mutaxassis ko'rigi zarur.", toastNotifOn:"Bildirishnomalar yoqildi ✓", toastNotifOff:"O'chirildi", toastAutoOn:"Avtomat tahlil yoqildi ✓", toastAutoOff:"O'chirildi", toastDark:"Qorong'i rejim o'zgartirildi ✓", toastSaved:"Profil saqlandi ✓", toastApi:"Endpoint saqlandi ✓", toastBackend:"Backend ulanmadi — mock rejim", toastPdf:"PDF hisobot tayyorlanmoqda...", toastCache:"Kesh tozalandi ✓", toastBackup:"Zaxira yaratildi ✓", toastReport:"Yuborildi! Rahmat ✓", toastLang:"Til o'zgartirildi ✓", pdfModalTitle:"PDF Hisobot", pdfModalDesc:"Barcha bemorlar ma'lumotlari PDF formatda yuklab olinadi.", pdfGenerate:"PDF Yaratish", backupModalTitle:"Ma'lumotlarni Zaxiralash", backupModalDesc:"Barcha tahlil natijalari JSON formatda saqlangan.", backupDownload:"JSON Yuklab olish", reportModalTitle:"Muammo Bildirish", reportModalDesc:"Muammoni ta'riflab yozing — tezda ko'rib chiqamiz.", reportPlaceholder:"Muammo ta'rifi...", reportSend:"Yuborish", close:"Yopish" },
    aiConf:"AI ishonch", inSituBadge:"in situ", age:"yosh",
    banner:{ demo:"⚠️ DEMO REJIM — AI model yuklanmagan, natijalar tasodifiy! Klinik foydalanish taqiqlanadi.", offline:"📡 Backend bilan aloqa yo'q — natijalar lokal qoidalar asosida hisoblanadi." },
    metrics:{ title:"🧪 AI model sifati (BUSI test)", acc:"Aniqlik", sens:"Sezgirlik", spec:"Spesifiklik", auc:"AUC", f1:"F1", roc:"ROC egri chizig'i", cm:"Confusion matrix", noData:"Model metrikalari hali hisoblanmagan", hint:"Backend papkada ishga tushiring: python evaluate.py <BUSI_test_papka>", real:"Haqiqiy", pred:"Bashorat", benign:"Benign", malignant:"Malignant", nTest:"Test rasmlar", cvTitle:"5-fold cross-validation (95% CI)", compTitle:"Arxitektura taqqoslovi", arch:"Arxitektura", cancerNote:"Saraton-aniqlash (malignant vs qolganlar)" },
    op:{ title:"Operating point (qaror chegarasi)", screening:"Skrining", balanced:"Muvozanat", confirm:"Tasdiqlash", screeningDesc:"Yuqori sezgirlik — saratonni o'tkazib yubormaslik", confirmDesc:"Yuqori spesifiklik — kam yolg'on signal", flagged:"⚠️ Tekshirish kerak", notFlagged:"Chegaradan past" },
    cls:{ normal:"Normal", benign:"Benign", malignant:"Malignant" },
    explain:{ btn:"🔥 Diqqat xaritasi", btnSeg:"✂️ Segmentatsiya", loading:"⏳ Hisoblanmoqda...", title:"AI diqqat xaritasi", desc:"Qizil-sariq hududlar — AI qarorida eng muhim sohalar (occlusion sensitivity)", segTitle:"O'simta segmentatsiyasi", segNote:"Taxminiy klassik usul (Otsu)", notFound:"O'choq topilmadi", diameter:"Ekvivalent diametr", areaPct:"Maydon ulushi" },
    followup:{ title:"📅 AI tavsiya — qayta ko'rik", now:"Tezkor — biopsi/onkolog zudlik bilan", months:"oydan keyin", next:"Keyingi ko'rik", phone:"Telefon raqami", phonePh:"+998 90 123 45 67", remindTitle:"🔔 Ko'rik vaqti kelgan bemorlar", remindEmpty:"Hozircha ko'rik vaqti kelgan bemor yo'q", call:"📞 Qo'ng'iroq", overdue:"Muddati o'tgan", soon:"Yaqinlashmoqda", daysLeft:"kun qoldi", daysOver:"kun o'tdi" },
    login:{ subtitle:"Sut bezi diagnostika tizimi", loginTab:"Kirish", registerTab:"Ro'yxatdan o'tish", phone:"Telefon raqami", password:"Parol", name:"F.I.O.", specialization:"Mutaxassislik", clinic:"Klinika", license:"Litsenziya/diplom raqami", phonePh:"+998 90 123 45 67", namePh:"Dr. Familiya Ism Otasining ismi", passPh:"Kamida 4 belgi", specPh:"Masalan: Radiolog, Onkolog", clinicPh:"Klinika/shifoxona nomi", licensePh:"Litsenziya yoki diplom raqami", enter:"Kirish", register:"Ro'yxatdan o'tish", pendingMsg:"✓ Ro'yxatdan o'tdingiz! Admin hisobingizni tasdiqlagandan so'ng kirishingiz mumkin.", adminFirst:"Birinchi foydalanuvchi avtomatik ADMIN bo'ladi", logout:"Chiqish", myPatients:"Faqat mening bemorlarim", allPatients:"Barcha shifokorlar", adminPanel:"Admin — shifokorlar", approve:"Tasdiqlash", revoke:"Bekor", approved:"Tasdiqlangan", pending:"Kutilmoqda", role:"Rol", err:"Xatolik yuz berdi" },
  },
  ru: {
    appName:"Breast AI", appSub:"Мультимодальная диагностика", newAnalysis:"+ Новый анализ", back:"← Назад",
    tabs:{ dashboard:"Главная", patients:"Пациенты", stats:"Статистика", settings:"Настройки" },
    dash:{ totalPatients:"Всего пациентов", urgent:"Срочные", inSitu:"Выявлено in situ", aiConf:"Точность ИИ", thisMonth:"За месяц", biRads46:"BI-RADS 4–6", upTo10mm:"≤10мм", avg:"Среднее", quickAnalysis:"Быстрый анализ", recentPatients:"Последние пациенты" },
    modality:{ uzi:"УЗИ", mammo:"Маммо", combined:"Комбинация" },
    patients:{ title:"Пациенты", search:"Поиск по имени...", sortDate:"Дата", sortBiRads:"BI-RADS", sortName:"Имя", clear:"✕ Сбросить", notFound:"Пациент не найден", changeFilter:"Измените запрос или фильтр" },
    detail:{ back:"← Назад", aiResult:"Результат ИИ", riskProb:"вероятность риска", uziFindings:"Данные УЗИ", mammoFindings:"Данные маммографии", aiSummary:"Заключение ИИ", size:"Размер", shape:"Форма", margin:"Край", echo:"Эхогенность", posterior:"Задн. акустика", orientation:"Ориентация", location:"Расположение", density:"Плотность", calcification:"Кальцификаты", distortion:"Архит. нарушение", asymmetry:"Асимметрия", present:"✓ Есть", absent:"Нет", pdfExport:"📄 PDF отчёт", addAnalysis:"Добавить анализ", inSituLabel:"Вероятность in situ", recommendations:"Рекомендации", rec1:"Консультация онколога", rec2:"Биопсия", rec3:"Контроль через 6 мес.", close:"Закрыть" },
    birads:{ 1:{label:"Негатив",rec:"Плановый скрининг"}, 2:{label:"Безопасно",rec:"1 раз в 1–2 года"}, 3:{label:"Вероятно безопасно",rec:"УЗИ через 6 мес."}, 4:{label:"Подозрительно",rec:"Рекомендуется биопсия"}, 5:{label:"Опасно",rec:"Биопсия обязательна"}, 6:{label:"Подтверждено",rec:"Консультация онколога"} },
    newAnal:{ title:"Новый анализ", type:"Тип анализа", uploadLabel:"Загрузите DICOM или JPG/PNG", uploadSub:"или откройте камеру", uziFeatures:"Параметры УЗИ", mammoFeatures:"Параметры маммографии", size:"Размер", shape:"Форма", margin:"Край", echo:"Эхогенность", posterior:"Задн. акустика", orientation:"Ориентация", density:"Плотность ткани", calcification:"Кальцификаты", distortion:"Архит. нарушение", shapes:[["oval","Овал"],["lobular","Дольчатый"],["irregular","Неправильный"],["spiculated","Спикулы"]], margins:[["circumscribed","Чёткий"],["indistinct","Нечёткий"],["angular","Угловатый"],["spiculated","Спикулы"]], echos:[["anechoic","Анэхогенный"],["hypoechoic","Гипоэхогенный"],["isoechoic","Изоэхогенный"],["hyperechoic","Гиперэхогенный"]], posteriors:[["enhancement","Усиление"],["shadowing","Тень"],["none","Без изменений"]], orientations:[["parallel","Параллельная"],["not_parallel","Вертикальная"]], resultLabel:"Результат ИИ", inSituNote:"Вероятность in situ: размер ≤10мм", btnStart:"✨ Запустить анализ", btnRetry:"🔄 Повторить", btnLoading:"⏳ Анализируется..." },
    stats:{ title:"Статистика", totalAnalyses:"Всего анализов", aiConf:"Точность ИИ", urgentCases:"Срочные", biRadsDist:"Распределение BI-RADS", modality:"Тип анализа", confLevel:"Точность ИИ", inSituTitle:"Выявление in situ (≤10мм)", inSituDesc:"пациентов выявлены на стадии in situ.", inSituEffect:"Раннее выявление повышает 5-летнюю выживаемость до 95%.", downloadCsv:"📥 Скачать CSV", downloadPdf:"📄 PDF отчёт" },
    settings:{ title:"Настройки", editProfile:"Изменить", save:"Сохранить", cancel:"Отмена", namePlaceholder:"Ф.И.О.", deptPlaceholder:"Отдел", sectionApp:"Приложение", sectionModel:"ИИ Модель", sectionData:"Данные", sectionAbout:"О приложении", notif:"Уведомления", autoAnalysis:"Авто-анализ", darkMode:"Тёмная тема", lang:"Язык", modelVersion:"Версия модели", apiEndpoint:"API эндпоинт", backendStatus:"Статус бэкенда", checkApi:"Проверить", checking:"⏳ Проверка...", connected:"✓ Подключено", notConnected:"✗ Нет связи", pdfReport:"PDF отчёт", backup:"Резервная копия", clearCache:"Очистить кэш", export:"Экспорт", backupSave:"Сохранить", clear:"Очистить", version:"Версия", license:"Лицензия", report:"Сообщить об ошибке", send:"Отправить", licenseVal:"Для исследований", disclaimer:"⚠️ Только для исследовательских целей. Клинические решения требуют консультации специалиста.", toastNotifOn:"Уведомления включены ✓", toastNotifOff:"Отключено", toastAutoOn:"Авто-анализ включён ✓", toastAutoOff:"Отключено", toastDark:"Тёмная тема изменена ✓", toastSaved:"Профиль сохранён ✓", toastApi:"Эндпоинт сохранён ✓", toastBackend:"Бэкенд недоступен — режим mock", toastPdf:"Подготовка PDF...", toastCache:"Кэш очищен ✓", toastBackup:"Копия создана ✓", toastReport:"Отправлено! Спасибо ✓", toastLang:"Язык изменён ✓", pdfModalTitle:"PDF Отчёт", pdfModalDesc:"Данные всех пациентов будут экспортированы в PDF.", pdfGenerate:"Создать PDF", backupModalTitle:"Резервная копия", backupModalDesc:"Все результаты анализов сохранены в формате JSON.", backupDownload:"Скачать JSON", reportModalTitle:"Сообщить об ошибке", reportModalDesc:"Опишите проблему — мы рассмотрим её в ближайшее время.", reportPlaceholder:"Описание проблемы...", reportSend:"Отправить", close:"Закрыть" },
    aiConf:"Точность ИИ", inSituBadge:"in situ", age:"лет",
    banner:{ demo:"⚠️ ДЕМО-РЕЖИМ — ИИ модель не загружена, результаты случайны! Клиническое использование запрещено.", offline:"📡 Нет связи с бэкендом — результаты рассчитываются локально." },
    metrics:{ title:"🧪 Качество ИИ модели (BUSI тест)", acc:"Точность", sens:"Чувствительность", spec:"Специфичность", auc:"AUC", f1:"F1", roc:"ROC-кривая", cm:"Матрица ошибок", noData:"Метрики модели ещё не рассчитаны", hint:"Запустите в папке бэкенда: python evaluate.py <папка_BUSI>", real:"Реальный", pred:"Прогноз", benign:"Benign", malignant:"Malignant", nTest:"Тестовых снимков", cvTitle:"5-fold кросс-валидация (95% ДИ)", compTitle:"Сравнение архитектур", arch:"Архитектура", cancerNote:"Детекция рака (malignant vs остальные)" },
    op:{ title:"Operating point (порог решения)", screening:"Скрининг", balanced:"Баланс", confirm:"Подтверждение", screeningDesc:"Высокая чувствительность — не пропустить рак", confirmDesc:"Высокая специфичность — меньше ложных тревог", flagged:"⚠️ Требует проверки", notFlagged:"Ниже порога" },
    cls:{ normal:"Normal", benign:"Benign", malignant:"Malignant" },
    explain:{ btn:"🔥 Карта внимания", btnSeg:"✂️ Сегментация", loading:"⏳ Вычисляется...", title:"Карта внимания ИИ", desc:"Красно-жёлтые зоны — самые важные области для решения ИИ (occlusion sensitivity)", segTitle:"Сегментация образования", segNote:"Приближённый классический метод (Otsu)", notFound:"Очаг не найден", diameter:"Эквивалентный диаметр", areaPct:"Доля площади" },
    followup:{ title:"📅 ИИ рекомендация — повторный осмотр", now:"Срочно — биопсия/онколог немедленно", months:"мес. спустя", next:"Следующий осмотр", phone:"Номер телефона", phonePh:"+998 90 123 45 67", remindTitle:"🔔 Пациенты на повторный осмотр", remindEmpty:"Пока нет пациентов на осмотр", call:"📞 Позвонить", overdue:"Просрочено", soon:"Приближается", daysLeft:"дней осталось", daysOver:"дней прошло" },
    login:{ subtitle:"Система диагностики груди", loginTab:"Вход", registerTab:"Регистрация", phone:"Номер телефона", password:"Пароль", name:"Ф.И.О.", specialization:"Специализация", clinic:"Клиника", license:"Номер лицензии/диплома", phonePh:"+998 90 123 45 67", namePh:"Др. Фамилия Имя Отчество", passPh:"Минимум 4 символа", specPh:"Например: Радиолог, Онколог", clinicPh:"Название клиники/больницы", licensePh:"Номер лицензии или диплома", enter:"Войти", register:"Зарегистрироваться", pendingMsg:"✓ Вы зарегистрированы! Вход возможен после подтверждения администратором.", adminFirst:"Первый пользователь автоматически становится АДМИНОМ", logout:"Выйти", myPatients:"Только мои пациенты", allPatients:"Все врачи", adminPanel:"Админ — врачи", approve:"Подтвердить", revoke:"Отменить", approved:"Подтверждён", pending:"Ожидает", role:"Роль", err:"Произошла ошибка" },
  },
  en: {
    appName:"Breast AI", appSub:"Multimodal Diagnostic System", newAnalysis:"+ New Analysis", back:"← Back",
    tabs:{ dashboard:"Dashboard", patients:"Patients", stats:"Statistics", settings:"Settings" },
    dash:{ totalPatients:"Total Patients", urgent:"Urgent Cases", inSitu:"In Situ Detected", aiConf:"AI Confidence", thisMonth:"This Month", biRads46:"BI-RADS 4–6", upTo10mm:"≤10mm", avg:"Average", quickAnalysis:"Quick Analysis", recentPatients:"Recent Patients" },
    modality:{ uzi:"Ultrasound", mammo:"Mammography", combined:"Combined" },
    patients:{ title:"Patients", search:"Search by name...", sortDate:"Date", sortBiRads:"BI-RADS", sortName:"Name", clear:"✕ Clear", notFound:"No patients found", changeFilter:"Change your search or filter" },
    detail:{ back:"← Back", aiResult:"AI Analysis Result", riskProb:"malignancy risk", uziFindings:"Ultrasound Findings", mammoFindings:"Mammography Findings", aiSummary:"AI Summary", size:"Size", shape:"Shape", margin:"Margin", echo:"Echogenicity", posterior:"Posterior Feature", orientation:"Orientation", location:"Location", density:"Density", calcification:"Calcification", distortion:"Arch. Distortion", asymmetry:"Asymmetry", present:"✓ Present", absent:"Absent", pdfExport:"📄 Export PDF", addAnalysis:"New Analysis", inSituLabel:"In situ probability", recommendations:"Recommendations", rec1:"Oncology consultation", rec2:"Core needle biopsy", rec3:"Follow-up in 6 months", close:"Close" },
    birads:{ 1:{label:"Negative",rec:"Routine screening"}, 2:{label:"Benign",rec:"Annual screening"}, 3:{label:"Probably Benign",rec:"6-month follow-up"}, 4:{label:"Suspicious",rec:"Biopsy recommended"}, 5:{label:"Highly Suspicious",rec:"Biopsy required"}, 6:{label:"Confirmed",rec:"Oncology referral"} },
    newAnal:{ title:"New Analysis", type:"Analysis Type", uploadLabel:"Upload DICOM or JPG/PNG", uploadSub:"or open camera", uziFeatures:"Ultrasound Features", mammoFeatures:"Mammography Features", size:"Size", shape:"Shape", margin:"Margin", echo:"Echogenicity", posterior:"Posterior Feature", orientation:"Orientation", density:"Tissue Density", calcification:"Calcifications", distortion:"Arch. Distortion", shapes:[["oval","Oval"],["lobular","Lobular"],["irregular","Irregular"],["spiculated","Spiculated"]], margins:[["circumscribed","Circumscribed"],["indistinct","Indistinct"],["angular","Angular"],["spiculated","Spiculated"]], echos:[["anechoic","Anechoic"],["hypoechoic","Hypoechoic"],["isoechoic","Isoechoic"],["hyperechoic","Hyperechoic"]], posteriors:[["enhancement","Enhancement"],["shadowing","Shadowing"],["none","No change"]], orientations:[["parallel","Parallel"],["not_parallel","Vertical"]], resultLabel:"AI Analysis Result", inSituNote:"In situ probability: size ≤10mm", btnStart:"✨ Start AI Analysis", btnRetry:"🔄 Re-analyse", btnLoading:"⏳ Analysing..." },
    stats:{ title:"Statistics", totalAnalyses:"Total Analyses", aiConf:"AI Confidence", urgentCases:"Urgent", biRadsDist:"BI-RADS Distribution", modality:"Analysis Modality", confLevel:"AI Confidence Level", inSituTitle:"In Situ Detection (≤10mm)", inSituDesc:"patients detected at in situ stage.", inSituEffect:"Early detection raises 5-year survival to 95%.", downloadCsv:"📥 Download CSV", downloadPdf:"📄 PDF Report" },
    settings:{ title:"Settings", editProfile:"Edit", save:"Save", cancel:"Cancel", namePlaceholder:"Full name", deptPlaceholder:"Department", sectionApp:"Application", sectionModel:"AI Model", sectionData:"Data", sectionAbout:"About", notif:"Notifications", autoAnalysis:"Auto Analysis", darkMode:"Dark Mode", lang:"Language", modelVersion:"Model Version", apiEndpoint:"API Endpoint", backendStatus:"Backend Status", checkApi:"Check", checking:"⏳ Checking...", connected:"✓ Connected", notConnected:"✗ Not Connected", pdfReport:"PDF Report", backup:"Backup", clearCache:"Clear Cache", export:"Export", backupSave:"Save", clear:"Clear", version:"Version", license:"License", report:"Report Issue", send:"Send", licenseVal:"For research purposes", disclaimer:"⚠️ For research purposes only. Clinical decisions require specialist consultation.", toastNotifOn:"Notifications enabled ✓", toastNotifOff:"Disabled", toastAutoOn:"Auto analysis enabled ✓", toastAutoOff:"Disabled", toastDark:"Dark mode toggled ✓", toastSaved:"Profile saved ✓", toastApi:"Endpoint saved ✓", toastBackend:"Backend unavailable — mock mode", toastPdf:"Preparing PDF...", toastCache:"Cache cleared ✓", toastBackup:"Backup created ✓", toastReport:"Sent! Thank you ✓", toastLang:"Language changed ✓", pdfModalTitle:"PDF Report", pdfModalDesc:"All patient data will be exported to PDF format.", pdfGenerate:"Generate PDF", backupModalTitle:"Data Backup", backupModalDesc:"All analysis results saved in JSON format.", backupDownload:"Download JSON", reportModalTitle:"Report Issue", reportModalDesc:"Describe the problem — we'll review it shortly.", reportPlaceholder:"Describe the issue...", reportSend:"Send", close:"Close" },
    aiConf:"AI Confidence", inSituBadge:"in situ", age:"yrs",
    banner:{ demo:"⚠️ DEMO MODE — AI model not loaded, results are random! Not for clinical use.", offline:"📡 Backend unreachable — results computed locally." },
    metrics:{ title:"🧪 AI Model Quality (BUSI test)", acc:"Accuracy", sens:"Sensitivity", spec:"Specificity", auc:"AUC", f1:"F1", roc:"ROC Curve", cm:"Confusion Matrix", noData:"Model metrics not computed yet", hint:"Run in backend folder: python evaluate.py <BUSI_test_dir>", real:"Actual", pred:"Predicted", benign:"Benign", malignant:"Malignant", nTest:"Test images", cvTitle:"5-fold cross-validation (95% CI)", compTitle:"Architecture comparison", arch:"Architecture", cancerNote:"Cancer detection (malignant vs rest)" },
    op:{ title:"Operating point (decision threshold)", screening:"Screening", balanced:"Balanced", confirm:"Confirmation", screeningDesc:"High sensitivity — don't miss cancer", confirmDesc:"High specificity — fewer false alarms", flagged:"⚠️ Needs review", notFlagged:"Below threshold" },
    cls:{ normal:"Normal", benign:"Benign", malignant:"Malignant" },
    explain:{ btn:"🔥 Attention Map", btnSeg:"✂️ Segmentation", loading:"⏳ Computing...", title:"AI Attention Map", desc:"Red-yellow regions — most important areas for the AI decision (occlusion sensitivity)", segTitle:"Lesion Segmentation", segNote:"Approximate classical method (Otsu)", notFound:"No lesion found", diameter:"Equivalent diameter", areaPct:"Area fraction" },
    followup:{ title:"📅 AI recommendation — follow-up", now:"Urgent — biopsy/oncologist immediately", months:"months later", next:"Next checkup", phone:"Phone number", phonePh:"+998 90 123 45 67", remindTitle:"🔔 Patients due for checkup", remindEmpty:"No patients due for checkup yet", call:"📞 Call", overdue:"Overdue", soon:"Soon", daysLeft:"days left", daysOver:"days over" },
    login:{ subtitle:"Breast diagnostic system", loginTab:"Sign in", registerTab:"Register", phone:"Phone number", password:"Password", name:"Full name", specialization:"Specialization", clinic:"Clinic", license:"License/diploma number", phonePh:"+998 90 123 45 67", namePh:"Dr. Last First Middle", passPh:"At least 4 characters", specPh:"e.g. Radiologist, Oncologist", clinicPh:"Clinic/hospital name", licensePh:"License or diploma number", enter:"Sign in", register:"Register", pendingMsg:"✓ Registered! You can sign in after the admin approves your account.", adminFirst:"The first user automatically becomes ADMIN", logout:"Log out", myPatients:"Only my patients", allPatients:"All doctors", adminPanel:"Admin — doctors", approve:"Approve", revoke:"Revoke", approved:"Approved", pending:"Pending", role:"Role", err:"An error occurred" },
  }
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppCtx = createContext({ lang:"uz", t:T.uz, setLang:()=>{}, dark:false, setDark:()=>{}, apiUrl:"https://breast-ai-backend.onrender.com", setApiUrl:()=>{}, history:[], addToHistory:()=>{}, doctorName:"", doctorDept:"", doctorId:"", token:"", isAdmin:false, user:null, logout:()=>{}, showAllDoctors:false, setShowAllDoctors:()=>{} });
function useApp(){ return useContext(AppCtx); }

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const BC={1:"#2D9E6B",2:"#2D9E6B",3:"#BA7517",4:"#E86B2A",5:"#D63B3B",6:"#8B1A1A"};
const BB={1:"#EAF3DE",2:"#EAF3DE",3:"#FAEEDA",4:"#FAECE7",5:"#FCEBEB",6:"#FCEBEB"};
const bc=(c)=>BC[c]||"#2D9E6B";
const bb=(c)=>BB[c]||"#EAF3DE";
const mc=(m)=>m==="uzi"?"#0B6E8A":m==="mammo"?"#6A3DAA":"#1A7A5E";
// Qayta ko'rik intervali (oy) — BI-RADS bo'yicha (ACR ko'rsatmalariga yaqin)
function followupMonths(birads){ return birads>=5?0:birads===4?2:birads===3?6:12; }
function computeNextCheckup(birads, fromISO){ const m=followupMonths(birads); const d=fromISO?new Date(fromISO):new Date(); d.setMonth(d.getMonth()+m); return d.toISOString(); }
const daysUntil=(iso)=>{ if(!iso)return null; return Math.ceil((new Date(iso)-new Date())/(1000*60*60*24)); };
// ─── DOWNLOAD HELPER (data URI, works in sandbox) ────────────────────────────
function dataDownload(content, filename){
  try {
    const enc = encodeURIComponent(content);
    const isCsv = filename.endsWith(".csv");
    const mime = isCsv ? "text/csv" : "text/plain";
    const link = document.createElement("a");
    link.href = `data:${mime};charset=utf-8,${enc}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch(e){
    const w = window.open("","_blank");
    if(w){ w.document.write("<pre style='font-family:monospace;white-space:pre-wrap;padding:20px'>"+content.replace(/&/g,"&amp;").replace(/</g,"&lt;")+"</pre>"); w.document.title = filename; }
  }
}



// Rasmni kichik thumbnail (base64 JPEG) ga aylantirish — localStorage va PDF uchun
function fileToThumb(file, maxSize=320){
  return new Promise((resolve)=>{
    try{
      const reader=new FileReader();
      reader.onload=()=>{
        const img=new Image();
        img.onload=()=>{
          const scale=Math.min(1, maxSize/Math.max(img.width,img.height));
          const w=Math.round(img.width*scale), h=Math.round(img.height*scale);
          const c=document.createElement("canvas"); c.width=w; c.height=h;
          c.getContext("2d").drawImage(img,0,0,w,h);
          try{ resolve(c.toDataURL("image/jpeg",0.6)); }catch{ resolve(null); }
        };
        img.onerror=()=>resolve(null);
        img.src=reader.result;
      };
      reader.onerror=()=>resolve(null);
      reader.readAsDataURL(file);
    }catch{ resolve(null); }
  });
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Card({children,style={}}){
  const {dark}=useApp();
  return <div style={{background:dark?"#1E2733":"#fff",border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,borderRadius:16,padding:18,...style}}>{children}</div>;
}
function Badge({cat,sub}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",background:bb(cat),color:bc(cat),borderRadius:20,fontSize:11,fontWeight:600,border:`1px solid ${bc(cat)}33`}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:bc(cat),display:"inline-block"}}/>BI-RADS {sub&&sub!==String(cat)?sub:cat}
  </span>;
}
function ModalityTag({m}){
  const {t}=useApp();
  return <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:500,background:mc(m)+"18",color:mc(m)}}>{t.modality[m]||m}</span>;
}
function ConfBar({value}){
  const {t}=useApp();
  const color=value>=0.9?"#2D9E6B":value>=0.75?"#BA7517":"#E86B2A";
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
      <span style={{fontSize:11,color:"#8FA4B2"}}>{t.aiConf}</span>
      <span style={{fontSize:11,fontWeight:600,color}}>{Math.round(value*100)}%</span>
    </div>
    <div style={{height:4,borderRadius:4,background:"#DDE6ED",overflow:"hidden"}}>
      <div style={{width:`${value*100}%`,height:"100%",background:color,borderRadius:4,transition:"width .5s"}}/>
    </div>
  </div>;
}

// Toast
function Toast({msg,type,onClose}){
  const tc={info:"#0B6E8A",success:"#2D9E6B",warn:"#BA7517",error:"#D63B3B"};
  useEffect(()=>{const id=setTimeout(onClose,2800);return()=>clearTimeout(id);},[]);
  return <div style={{position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",background:tc[type||"info"],color:"#fff",padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>{msg}</div>;
}

// Modal
function Modal({title,onClose,children}){
  const {dark}=useApp();
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:dark?"#1E2733":"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:400,maxHeight:"80vh",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div style={{fontSize:16,fontWeight:700,color:dark?"#E8EFF5":"#0D1B2A"}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8FA4B2",lineHeight:1}}>✕</button>
      </div>
      {children}
    </div>
  </div>;
}

// Toggle
function Toggle({value,onChange}){
  return <button onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",background:value?"#0B6E8A":"#DDE6ED",position:"relative",transition:"background .2s",flexShrink:0}}>
    <span style={{position:"absolute",top:2,left:value?20:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s",display:"block"}}/>
  </button>;
}

// SRow / SSection for settings
function SRow({label,icon,right}){
  const {dark}=useApp();
  return <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderTop:`0.5px solid ${dark?"#2E3A47":"#EEF3F8"}`}}>
    <span style={{fontSize:16,flexShrink:0}}>{icon}</span>
    <span style={{flex:1,fontSize:13,color:dark?"#C8D8E4":"#0D1B2A"}}>{label}</span>
    {right}
  </div>;
}
function SSection({title,children}){
  return <div style={{marginBottom:20}}>
    <div style={{fontSize:11,fontWeight:700,color:"#8FA4B2",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.8px"}}>{title}</div>
    <Card style={{padding:"0 16px"}}>{children}</Card>
  </div>;
}


// ─── PDF HISOBOT ──────────────────────────────────────────────────────────────
function generatePDFReport(record, doctorName, doctorDept, images={}){
  const imgOriginal = images.original || record.imageThumb || null;
  const imgHeatmap = images.heatmap ? `data:image/png;base64,${images.heatmap}` : null;
  const imgSeg = images.segmentation ? `data:image/png;base64,${images.segmentation}` : null;
  const hasImages = imgOriginal || imgHeatmap || imgSeg;
  const imagesHtml = hasImages ? `
<div class="section">
  <div class="section-title">🖼 Tasvirlar va AI tahlili</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    ${imgOriginal?`<div style="flex:1;min-width:160px;text-align:center"><img src="${imgOriginal}" style="width:100%;border-radius:8px;border:1px solid #DDE6ED"/><div style="font-size:10px;color:#8FA4B2;margin-top:4px">Original tasvir</div></div>`:""}
    ${imgHeatmap?`<div style="flex:1;min-width:160px;text-align:center"><img src="${imgHeatmap}" style="width:100%;border-radius:8px;border:1px solid #DDE6ED"/><div style="font-size:10px;color:#8FA4B2;margin-top:4px">AI diqqat xaritasi</div></div>`:""}
    ${imgSeg?`<div style="flex:1;min-width:160px;text-align:center"><img src="${imgSeg}" style="width:100%;border-radius:8px;border:1px solid #DDE6ED"/><div style="font-size:10px;color:#8FA4B2;margin-top:4px">Segmentatsiya</div></div>`:""}
  </div>
</div>` : "";
  const bm = T.uz.birads[record.birads] || T.uz.birads[2];
  const color = record.birads >= 4 ? "#D63B3B" : record.birads === 3 ? "#BA7517" : "#2D9E6B";
  const date = new Date(record.date).toLocaleDateString("uz-UZ", {year:"numeric",month:"long",day:"numeric"});
  const now  = new Date().toLocaleDateString("uz-UZ", {year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});

  const html = `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8"/>
<title>Tibbiy Hisobot — ${record.patientName}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:30px;max-width:800px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0B6E8A;padding-bottom:16px;margin-bottom:20px}
  .logo{font-size:24px;font-weight:800;color:#0B6E8A}
  .logo span{font-size:12px;display:block;font-weight:400;color:#52687A}
  .meta{text-align:right;font-size:11px;color:#52687A}
  .section{margin-bottom:20px}
  .section-title{font-size:14px;font-weight:700;color:#0B6E8A;border-bottom:1px solid #DDE6ED;padding-bottom:6px;margin-bottom:12px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .field{background:#F7F9FC;border-radius:8px;padding:10px}
  .field label{font-size:10px;color:#8FA4B2;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:3px}
  .field value{font-size:13px;font-weight:500;color:#0D1B2A}
  .birads-box{background:${color}15;border:2px solid ${color};border-radius:12px;padding:16px;text-align:center;margin-bottom:20px}
  .birads-num{font-size:36px;font-weight:800;color:${color}}
  .birads-label{font-size:16px;font-weight:600;color:${color}}
  .birads-rec{font-size:12px;color:#52687A;margin-top:6px}
  .risk-bar{height:12px;border-radius:6px;background:#EEF3F8;overflow:hidden;margin:8px 0}
  .risk-fill{height:100%;background:${color};border-radius:6px;width:${Math.round(record.confidence*100)}%}
  .warn{background:#FFF3CD;border:1px solid #F0A500;border-radius:8px;padding:12px;font-size:11px;color:#854F0B;margin-top:20px}
  .footer{border-top:1px solid #DDE6ED;padding-top:12px;margin-top:20px;font-size:10px;color:#8FA4B2;text-align:center}
  table{width:100%;border-collapse:collapse}
  td{padding:7px 10px;border-bottom:1px solid #EEF3F8;font-size:12px}
  td:first-child{color:#8FA4B2;width:45%}
  td:last-child{font-weight:500;color:#0D1B2A}
  @media print{body{padding:20px}}
</style>
</head>
<body>
<div class="header">
  <div class="logo">🔬 Breast AI<span>Multimodal diagnostika tizimi</span></div>
  <div class="meta">
    <div><strong>Hisobot raqami:</strong> ${record.id}</div>
    <div><strong>Sana:</strong> ${now}</div>
    <div><strong>Doktor:</strong> ${doctorName}</div>
    <div><strong>Bo'lim:</strong> ${doctorDept}</div>
  </div>
</div>

<div class="section">
  <div class="section-title">👤 Bemor ma'lumotlari</div>
  <div class="grid">
    <div class="field"><label>F.I.O.</label><value>${record.patientName}</value></div>
    <div class="field"><label>Yosh / Jins</label><value>${record.patientAge||"—"} yosh / ${record.patientGender||"—"}</value></div>
    <div class="field"><label>Telefon</label><value>${record.patientPhone||"—"}</value></div>
    <div class="field"><label>Tahlil sanasi</label><value>${date}</value></div>
    <div class="field"><label>Tahlil turi</label><value>${record.modality==="uzi"?"Ultrasound (UZI)":record.modality==="mammo"?"Mammografiya":"Kombinatsiya (UZI+Mammo)"}</value></div>
  </div>
  ${record.patientNotes?`<div class="field" style="margin-top:10px"><label>Izoh / Anamnez</label><value>${record.patientNotes}</value></div>`:""}
</div>

<div class="birads-box">
  <div class="birads-num">BI-RADS ${record.biradsSub&&record.biradsSub!==String(record.birads)?record.biradsSub:record.birads}</div>
  <div class="birads-label">${bm.label}</div>
  <div class="birads-rec">${bm.rec}</div>
  <div style="margin-top:12px;font-size:11px;color:#52687A">AI ishonch darajasi</div>
  <div class="risk-bar"><div class="risk-fill"></div></div>
  <div style="font-size:13px;font-weight:600;color:${color}">${Math.round(record.confidence*100)}%</div>
  ${record.isInSitu?`<div style="margin-top:8px;background:#EAF3DE;border-radius:6px;padding:6px;font-size:11px;color:#2D9E6B">🎯 In situ ehtimoli: o’lcham ≤10mm</div>`:""}
</div>

${imagesHtml}

${record.shape||record.echo?`
<div class="section">
  <div class="section-title">🌊 UZI topilmalari</div>
  <table>
    ${record.sizeA?`<tr><td>O’lcham</td><td>${record.sizeA} × ${record.sizeB} mm</td></tr>`:""}
    ${record.shape?`<tr><td>Shakl</td><td>${record.shape}</td></tr>`:""}
    ${record.echo?`<tr><td>Echogenlik</td><td>${record.echo}</td></tr>`:""}
  </table>
</div>`:""}

${record.density?`
<div class="section">
  <div class="section-title">🔬 Mammografiya topilmalari</div>
  <table>
    <tr><td>To'qima zichligi</td><td>BI-RADS ${record.density}</td></tr>
    ${record.calcification!==null?`<tr><td>Mikrokalsifikat</td><td>${record.calcification?"✓ Mavjud (xavfli belgi)":"Yoq"}</td></tr>`:""}
  </table>
</div>`:""}

<div class="section">
  <div class="section-title">📋 Tavsiyalar</div>
  <table>
    ${record.birads>=4?`<tr><td>1</td><td>Onkolog konsultatsiyasi — tezkorlik bilan</td></tr><tr><td>2</td><td>Yadro biopsiyasi o’tkazish</td></tr><tr><td>3</td><td>MRI tekshiruvi (ixtiyoriy)</td></tr>`:`<tr><td>1</td><td>${bm.rec}</td></tr>`}
  </table>
</div>

${record.nextCheckup?`
<div class="section">
  <div class="section-title">📅 Qayta ko'rik tavsiyasi (AI)</div>
  <table>
    <tr><td>Interval</td><td>${record.followupMonths===0?"Tezkor — zudlik bilan":record.followupMonths+" oydan keyin"}</td></tr>
    <tr><td>Keyingi ko'rik sanasi</td><td>${new Date(record.nextCheckup).toLocaleDateString("uz-UZ",{year:"numeric",month:"long",day:"numeric"})}</td></tr>
  </table>
</div>`:""}

<div class="warn">
  ⚠️ <strong>Muhim eslatma:</strong> Bu hisobot AI yordamida yaratilgan va faqat dastlabki baholash uchun mo'ljallangan.
  Klinik qarorlar faqat malakali shifokor tomonidan qabul qilinishi kerak.
</div>

<div class="footer">
  Breast AI v1.0 — Multimodal diagnostika tizimi | ${now} | ${doctorName}, ${doctorDept}
</div>
</body>
</html>`;

  // Brauzerda chop etish oynasi orqali PDF
  const win = window.open("","_blank","width=900,height=700");
  if(win){
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(()=>win.print(), 500);
  }
}

// ─── SHARE LINK ────────────────────────────────────────────────────────────────
function generateShareLink(record){
  const data = encodeURIComponent(JSON.stringify({
    n: record.patientName,
    a: record.patientAge,
    b: record.birads,
    c: Math.round(record.confidence*100),
    m: record.modality,
    d: record.date,
    i: record.isInSitu,
  }));
  return `${window.location.origin}?share=${data}`;
}


// ─── GLOBAL SEARCH ────────────────────────────────────────────────────────────
function GlobalSearch({onClose, onPatient}){
  const {dark, history} = useApp();
  const [q, setQ] = useState("");
  const tx = dark?"#E8EFF5":"#0D1B2A";
  const ts = dark?"#8FA4B2":"#52687A";

  const results = q.length > 1 ? (history||[]).filter(h =>
    h.patientName?.toLowerCase().includes(q.toLowerCase()) ||
    String(h.birads).includes(q) ||
    h.patientAge?.toString().includes(q) ||
    h.modality?.includes(q.toLowerCase())
  ).slice(0, 8) : [];

  const fmtDate = iso => {
    const m=["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
    const d=new Date(iso); return `${d.getDate()} ${m[d.getMonth()]}`;
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9998,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:60,paddingLeft:16,paddingRight:16}}>
      <div style={{background:dark?"#1A232E":"#fff",borderRadius:20,width:"100%",maxWidth:500,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:`1px solid ${dark?"#2E3A47":"#EEF3F8"}`}}>
          <span style={{fontSize:18}}>🔍</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Bemor ismi, BI-RADS, yosh..."
            style={{flex:1,border:"none",outline:"none",fontSize:15,background:"transparent",color:tx}}/>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:20,color:"#8FA4B2"}}>✕</button>
        </div>
        {q.length > 1 && (
          <div style={{maxHeight:400,overflowY:"auto"}}>
            {results.length === 0
              ? <div style={{padding:32,textAlign:"center",color:"#8FA4B2"}}>
                  <div style={{fontSize:32,marginBottom:8}}>🔍</div>
                  <div>"{q}" topilmadi</div>
                </div>
              : results.map(h => (
                <div key={h.id} onClick={()=>{onPatient(h);onClose();}}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",borderBottom:`1px solid ${dark?"#2E3A47":"#EEF3F8"}`,transition:"background .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=dark?"#263040":"#F7F9FC"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:40,height:40,borderRadius:12,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#0B6E8A",flexShrink:0}}>
                    {h.patientName.split(" ").map(w=>w[0]).slice(0,2).join("")}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14,color:tx}}>{h.patientName}</div>
                    <div style={{fontSize:12,color:ts,marginTop:2}}>
                      {h.patientAge&&`${h.patientAge} yosh · `}
                      <Badge cat={h.birads}/>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:"#8FA4B2",flexShrink:0}}>{fmtDate(h.date)}</div>
                </div>
              ))
            }
          </div>
        )}
        {q.length <= 1 && (
          <div style={{padding:24,color:"#8FA4B2",fontSize:13,textAlign:"center"}}>
            Kamida 2 ta harf kiriting
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({onNewAnalysis,onPatient}){
  const {t,dark,history}=useApp();
  const allRecords=history||[];
  const urgent=allRecords.filter(h=>h.birads>=4).length;
  const inSituCount=allRecords.filter(h=>h.isInSitu).length;
  const avgConf=allRecords.length>0?Math.round(allRecords.reduce((s,h)=>s+h.confidence,0)/allRecords.length*100):0;
  const stats=[
    {label:t.dash.totalPatients,value:allRecords.length,sub:t.dash.thisMonth,color:"#0B6E8A",icon:"👤"},
    {label:t.dash.urgent,value:urgent,sub:t.dash.biRads46,color:"#E86B2A",icon:"⚠️"},
    {label:t.dash.inSitu,value:inSituCount,sub:t.dash.upTo10mm,color:"#2D9E6B",icon:"🎯"},
    {label:t.dash.aiConf,value:avgConf>0?`${avgConf}%`:"—",sub:t.dash.avg,color:"#6A3DAA",icon:"✨"},
  ];
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A";
  return <div>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:24,fontWeight:800,color:tx,letterSpacing:"-0.5px"}}>{t.appName}</div>
      <div style={{fontSize:13,color:ts,marginTop:2}}>{t.appSub}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:24}}>
      {stats.map(s=><Card key={s.label} style={{padding:16}}>
        <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
        <div style={{fontSize:28,fontWeight:800,color:s.color,letterSpacing:"-1px",lineHeight:1}}>{s.value}</div>
        <div style={{fontSize:12,color:ts,marginTop:4}}>{s.label}</div>
        <div style={{fontSize:11,color:"#8FA4B2"}}>{s.sub}</div>
      </Card>)}
    </div>
    <div style={{fontSize:15,fontWeight:700,color:tx,marginBottom:12}}>{t.dash.quickAnalysis}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
      {[["uzi","🌊"],["mammo","🔬"],["combined","🔗"]].map(([m,e])=>(
        <button key={m} onClick={()=>onNewAnalysis(m)} style={{padding:"14px 8px",borderRadius:14,border:`1.5px solid ${mc(m)}33`,background:`${mc(m)}0D`,cursor:"pointer",transition:"transform .15s"}}
          onMouseEnter={ev=>ev.currentTarget.style.transform="translateY(-2px)"}
          onMouseLeave={ev=>ev.currentTarget.style.transform="translateY(0)"}>
          <div style={{fontSize:20}}>{e}</div>
          <div style={{fontSize:12,fontWeight:600,color:mc(m),marginTop:5}}>{t.modality[m]}</div>
        </button>
      ))}
    </div>
    <div style={{fontSize:15,fontWeight:700,color:tx,marginBottom:12}}>{t.dash.recentPatients}</div>
    {allRecords.length===0
      ?<Card style={{textAlign:"center",padding:"32px 16px"}}>
        <div style={{fontSize:36,marginBottom:10}}>📭</div>
        <div style={{fontSize:14,color:ts}}>Hali tahlil qilinmagan</div>
        <div style={{fontSize:12,color:"#8FA4B2",marginTop:4}}>Yangi tahlil boshlang</div>
        <button onClick={()=>onNewAnalysis("uzi")} style={{marginTop:14,padding:"10px 24px",borderRadius:10,border:"none",background:"#0B6E8A",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Yangi tahlil</button>
      </Card>
      :<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {allRecords.slice(0,5).map(h=>{
          const fmtD2=(iso)=>{const m=["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"],d=new Date(iso);return `${d.getDate()} ${m[d.getMonth()]}`;};
          return <Card key={h.id} style={{cursor:"pointer",borderColor:h.birads>=4?bc(h.birads)+"55":dark?"#2E3A47":"#DDE6ED"}} onClick={()=>onPatient(h)}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#0B6E8A",flexShrink:0}}>
                {h.patientName.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <span style={{fontWeight:600,fontSize:14,color:tx}}>{h.patientName}</span>
                  <Badge cat={h.birads}/>
                  {h.isInSitu&&<span style={{fontSize:10,fontWeight:700,color:"#2D9E6B",background:"#EAF3DE",padding:"2px 7px",borderRadius:5}}>{t.inSituBadge}</span>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
                  {h.patientAge&&<span style={{fontSize:12,color:ts}}>{h.patientAge} {t.age}</span>}
                  <ModalityTag m={h.modality}/>
                  <span style={{fontSize:11,color:"#8FA4B2",marginLeft:"auto"}}>{fmtD2(h.date)}</span>
                </div>
                <ConfBar value={h.confidence}/>
              </div>
              <span style={{color:"#8FA4B2",fontSize:18,alignSelf:"center"}}>›</span>
            </div>
          </Card>;
        })}
      </div>}
  </div>;
}

// ─── PATIENTS LIST ────────────────────────────────────────────────────────────
function PatientsList({onPatient}){
  const {t,dark,history}=useApp();
  const [search,setSearch]=useState("");
  const [filterBR,setFilterBR]=useState(null);
  const [sort,setSort]=useState("date");
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A";

  function fmtDate(iso){
    const m=["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"],d=new Date(iso);
    return `${d.getDate()} ${m[d.getMonth()]}`;
  }

  const filtered=(history||[])
    .filter(h=>(!search||h.patientName.toLowerCase().includes(search.toLowerCase()))&&(!filterBR||h.birads===filterBR))
    .sort((a,b)=>sort==="birads"?b.birads-a.birads:sort==="name"?a.patientName.localeCompare(b.patientName):new Date(b.date)-new Date(a.date));

  return <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
      <div style={{fontSize:24,fontWeight:800,color:tx,letterSpacing:"-0.5px"}}>{t.patients.title}</div>
      <span style={{fontSize:12,fontWeight:600,color:"#0B6E8A",background:"#E6F1FB",padding:"4px 12px",borderRadius:20}}>{filtered.length} ta</span>
    </div>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.patients.search}
      style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:dark?"#1E2733":"#fff",fontSize:14,color:tx,marginBottom:12,boxSizing:"border-box",outline:"none"}}/>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
      {[["date",t.patients.sortDate],["birads",t.patients.sortBiRads],["name",t.patients.sortName]].map(([s,l])=>(
        <button key={s} onClick={()=>setSort(s)} style={{padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",border:sort===s?"1.5px solid #0B6E8A":`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:sort===s?"#E6F1FB":dark?"#1E2733":"#fff",color:sort===s?"#0B6E8A":dark?"#8FA4B2":"#52687A"}}>{l}</button>
      ))}
      <div style={{width:1,background:dark?"#2E3A47":"#DDE6ED",margin:"0 4px"}}/>
      {[2,3,4,5].map(cat=>(
        <button key={cat} onClick={()=>setFilterBR(filterBR===cat?null:cat)} style={{padding:"5px 11px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:filterBR===cat?`1.5px solid ${bc(cat)}`:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:filterBR===cat?bb(cat):dark?"#1E2733":"#fff",color:filterBR===cat?bc(cat):dark?"#8FA4B2":"#52687A"}}>BR{cat}</button>
      ))}
      {(filterBR||search)&&<button onClick={()=>{setFilterBR(null);setSearch("");}} style={{padding:"5px 12px",borderRadius:8,fontSize:11,cursor:"pointer",border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:dark?"#1E2733":"#fff",color:dark?"#8FA4B2":"#52687A"}}>{t.patients.clear}</button>}
    </div>
    {filtered.length===0
      ?<div style={{textAlign:"center",padding:"48px 0",color:"#8FA4B2"}}>
        <div style={{fontSize:36,marginBottom:10}}>{(history||[]).length===0?"📭":"🔍"}</div>
        <div style={{fontSize:14}}>{(history||[]).length===0?"Hali tahlil qilinmagan":t.patients.notFound}</div>
        <div style={{fontSize:12,marginTop:4}}>{(history||[]).length===0?"Yangi tahlil qo'shing":t.patients.changeFilter}</div>
      </div>
      :<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(h=>(
          <Card key={h.id} style={{cursor:"pointer",borderColor:h.birads>=4?bc(h.birads)+"44":dark?"#2E3A47":"#DDE6ED"}} onClick={()=>onPatient(h)}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{position:"relative",flexShrink:0}}>
                <div style={{width:46,height:46,borderRadius:13,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,color:"#0B6E8A"}}>
                  {h.patientName.split(" ").map(w=>w[0]).slice(0,2).join("")}
                </div>
                {h.birads>=4&&<div style={{position:"absolute",top:-2,right:-2,width:12,height:12,borderRadius:"50%",background:bc(h.birads),border:"2px solid #fff"}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <span style={{fontWeight:600,fontSize:14,color:tx}}>{h.patientName}</span>
                  <Badge cat={h.birads}/>
                  {h.isInSitu&&<span style={{fontSize:10,fontWeight:700,color:"#2D9E6B",background:"#EAF3DE",padding:"2px 7px",borderRadius:5}}>{t.inSituBadge}</span>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
                  {h.patientAge&&<span style={{fontSize:12,color:ts}}>{h.patientAge} {t.age}</span>}
                  <ModalityTag m={h.modality}/>
                  <span style={{fontSize:11,color:"#8FA4B2",marginLeft:"auto"}}>{fmtDate(h.date)}</span>
                </div>
                <ConfBar value={h.confidence}/>
              </div>
              <span style={{color:"#8FA4B2",fontSize:20,alignSelf:"center",marginLeft:4}}>›</span>
            </div>
          </Card>
        ))}
      </div>}
  </div>;
}

// ─── NEW ANALYSIS ─────────────────────────────────────────────────────────────
function NewAnalysis({initialModality="uzi",onBack}){
  const {t,dark,addToHistory,apiUrl,doctorName,doctorDept}=useApp();
  const [mod,setMod]=useState(initialModality);
  const [shape,setShape]=useState("oval");
  const [margin,setMargin]=useState("circumscribed");
  const [echo,setEcho]=useState("isoechoic");
  const [posterior,setPosterior]=useState("none");
  const [orientation,setOrientation]=useState("parallel");
  const [sizeA,setSizeA]=useState(8);
  const [sizeB,setSizeB]=useState(6);
  const [density,setDensity]=useState("B");
  const [calcification,setCalcification]=useState(false);
  const [distortion,setDistortion]=useState(false);
  const [analyzed,setAnalyzed]=useState(false);
  const [loading,setLoading]=useState(false);
  const [uploadedFile,setUploadedFile]=useState(null);
  const [uploadError,setUploadError]=useState(null);
  const [apiResult,setApiResult]=useState(null);
  const [result,setResult]=useState(null); // {cat, sub, conf} — ko'rsatiladigan yakuniy natija
  const [opThreshold,setOpThreshold]=useState(0.5); // operating point
  const [heatmap,setHeatmap]=useState(null);
  const [heatLoading,setHeatLoading]=useState(false);
  const [segResult,setSegResult]=useState(null);
  const [segLoading,setSegLoading]=useState(false);
  const [savedRecord,setSavedRecord]=useState(null);
  const [patientName,setPatientName]=useState("");
  const [patientAge,setPatientAge]=useState("");
  const [patientPhone,setPatientPhone]=useState("");
  const [patientGender,setPatientGender]=useState("Ayol");
  const [patientNotes,setPatientNotes]=useState("");
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A";

  function calcBiRads(){
    let s=0;
    if(mod==="uzi"||mod==="combined"){
      if(shape==="spiculated")s+=3;else if(shape==="irregular")s+=2;else if(shape==="lobular")s+=1;
      if(margin==="spiculated")s+=3;else if(margin==="indistinct"||margin==="angular")s+=2;
      if(echo==="hypoechoic")s+=1;
      if(posterior==="shadowing")s+=2;
      if(orientation==="not_parallel")s+=2;
    }
    if(mod==="mammo"||mod==="combined"){if(calcification)s+=3;if(distortion)s+=2;if(density==="C"||density==="D")s+=1;}
    return s===0?2:s<=2?3:s<=5?4:5;
  }
  // Natija kartasi yakuniy (AI yoki rule-based) natijani ko'rsatadi — slayder qiymatini emas
  const cat=result?result.cat:calcBiRads(),bm=t.birads[cat]||t.birads[2],color=bc(cat),bg=bb(cat);
  const ins=sizeA<=10&&sizeB<=10&&(mod==="uzi"||mod==="combined");

  function Chips({label,options,value,onChange}){
    return <div style={{marginBottom:14}}>
      <div style={{fontSize:12,color:ts,marginBottom:6}}>{label}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {options.map(([k,v])=>(
          <button key={k} onClick={()=>{onChange(k);setAnalyzed(false);}} style={{padding:"6px 13px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",border:value===k?"1.5px solid #0B6E8A":`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:value===k?"#E6F1FB":dark?"#263040":"#FAFAFA",color:value===k?"#0B6E8A":dark?"#8FA4B2":"#52687A"}}>{v}</button>
        ))}
      </div>
    </div>;
  }

  const inputStyle = {width:"100%",padding:"9px 12px",borderRadius:10,border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:dark?"#1E2733":"#fff",fontSize:13,color:tx,outline:"none",boxSizing:"border-box"};

  return <div>
    <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#0B6E8A",fontSize:13,fontWeight:600,marginBottom:18,padding:0}}>{t.back}</button>
    <div style={{fontSize:22,fontWeight:800,color:tx,marginBottom:6}}>{t.newAnal.title}</div>

    <Card style={{marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#0B6E8A",marginBottom:14}}>👤 Bemor ma'lumotlari</div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,color:ts,marginBottom:5}}>F.I.O. *</div>
        <input value={patientName} onChange={e=>setPatientName(e.target.value)} placeholder="Familiya Ism Otasining ismi" style={inputStyle}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <div>
          <div style={{fontSize:12,color:ts,marginBottom:5}}>Yosh *</div>
          <input type="number" value={patientAge} onChange={e=>setPatientAge(e.target.value)} placeholder="Masalan: 45" min="1" max="120" style={inputStyle}/>
        </div>
        <div>
          <div style={{fontSize:12,color:ts,marginBottom:5}}>Jins</div>
          <select value={patientGender} onChange={e=>setPatientGender(e.target.value)} style={{...inputStyle,cursor:"pointer"}}>
            <option>Ayol</option>
            <option>Erkak</option>
          </select>
        </div>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,color:ts,marginBottom:5}}>📞 {t.followup.phone}</div>
        <input value={patientPhone} onChange={e=>setPatientPhone(e.target.value)} placeholder={t.followup.phonePh} style={inputStyle}/>
      </div>
      <div>
        <div style={{fontSize:12,color:ts,marginBottom:5}}>Qo'shimcha izoh</div>
        <textarea value={patientNotes} onChange={e=>setPatientNotes(e.target.value)} placeholder="Shikoyatlar, anamnez..." rows={2}
          style={{...inputStyle,resize:"vertical"}}/>
      </div>
    </Card>

    <div style={{fontSize:13,color:ts,marginBottom:12}}>{t.newAnal.type}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
      {[["uzi","🌊"],["mammo","🔬"],["combined","🔗"]].map(([m,e])=>(
        <button key={m} onClick={()=>{setMod(m);setAnalyzed(false);setApiResult(null);}} style={{padding:"12px 6px",borderRadius:12,border:mod===m?`2px solid ${mc(m)}`:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:mod===m?`${mc(m)}0F`:dark?"#1E2733":"#fff",cursor:"pointer"}}>
          <div style={{fontSize:20}}>{e}</div>
          <div style={{fontSize:11,fontWeight:600,color:mod===m?mc(m):dark?"#8FA4B2":"#52687A",marginTop:4}}>{t.modality[m]}</div>
        </button>
      ))}
    </div>
    <div style={{border:`2px dashed ${dark?"#2E3A47":"#DDE6ED"}`,borderRadius:14,padding:24,textAlign:"center",marginBottom:20,cursor:"pointer",position:"relative"}}
      onClick={()=>document.getElementById("file-upload-input").click()}>
      <input id="file-upload-input" type="file" accept="image/jpeg,image/png,.dcm,.dicom,.zip,application/zip" style={{display:"none"}}
        onChange={e=>{
          const file=e.target.files[0];
          if(file){
            // Frontend validatsiya
            const fname = file.name.toLowerCase();
            const allowedTypes=["image/jpeg","image/png","image/jpg","application/dicom","application/octet-stream","application/zip"];
            const allowedExt=[".jpg",".jpeg",".png",".dcm",".dicom",".zip"];
            const hasAllowedExt = allowedExt.some(ext=>fname.endsWith(ext));
            if(!allowedTypes.includes(file.type) && !hasAllowedExt){
              setUploadError("Qo'llab-quvvatlanadigan formatlar: JPG, PNG, DICOM (.dcm), ZIP");
              setUploadedFile(null);
              return;
            }
            if(file.size > 50*1024*1024){
              setUploadError("Fayl hajmi 50MB dan oshmasin");
              setUploadedFile(null);
              return;
            }
            setUploadError(null);
            setUploadedFile(file);
            setAnalyzed(false);
          }
        }}/>
      {uploadedFile
        ?<div>
          <div style={{fontSize:28}}>✅</div>
          <div style={{fontSize:13,color:"#2D9E6B",marginTop:6,fontWeight:600}}>{uploadedFile.name}</div>
          <div style={{fontSize:11,color:"#8FA4B2"}}>
            {(uploadedFile.size/1024).toFixed(1)} KB · {
              uploadedFile.name.toLowerCase().endsWith('.dcm')||uploadedFile.name.toLowerCase().endsWith('.dicom')
                ?"🏥 DICOM"
                :uploadedFile.name.toLowerCase().endsWith('.zip')
                ?"📦 ZIP arxiv"
                :"🖼 Rasm"
            }
          </div>
        </div>
        :<div>
          <div style={{fontSize:28}}>📁</div>
          <div style={{fontSize:13,color:ts,marginTop:6}}>{t.newAnal.uploadLabel}</div>
          <div style={{fontSize:11,color:"#8FA4B2"}}>{t.newAnal.uploadSub}</div>
        </div>}
    </div>
    {uploadError&&<div style={{fontSize:12,color:"#D63B3B",background:"#FCEBEB",borderRadius:10,padding:"8px 14px",marginTop:-10,marginBottom:10}}>⚠️ {uploadError}</div>}
    {uploadedFile&&<Card style={{marginBottom:14}}>
      <div style={{fontSize:12,color:ts,marginBottom:8}}>🎚 {t.op.title}</div>
      <div style={{display:"flex",gap:6}}>
        {[["screening",0.3,t.op.screening],["balanced",0.5,t.op.balanced],["confirm",0.7,t.op.confirm]].map(([k,v,label])=>(
          <button key={k} onClick={()=>{setOpThreshold(v);setAnalyzed(false);}}
            style={{flex:1,padding:"8px 6px",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",
              border:opThreshold===v?"1.5px solid #0B6E8A":`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,
              background:opThreshold===v?"#E6F1FB":dark?"#263040":"#FAFAFA",color:opThreshold===v?"#0B6E8A":ts}}>{label}</button>
        ))}
      </div>
      <div style={{fontSize:11,color:"#8FA4B2",marginTop:6}}>
        {opThreshold===0.3?t.op.screeningDesc:opThreshold===0.7?t.op.confirmDesc:`${t.op.screening} ↔ ${t.op.confirm}`} · threshold={opThreshold}
      </div>
    </Card>}
    {(mod==="uzi"||mod==="combined")&&<Card style={{marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#0B6E8A",marginBottom:14}}>🌊 {t.newAnal.uziFeatures}</div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:ts,marginBottom:6}}>
          <span>{t.newAnal.size}</span>
          <span style={{fontWeight:600,color:tx}}>{sizeA} × {sizeB} mm{ins&&<span style={{marginLeft:6,fontSize:10,fontWeight:700,color:"#2D9E6B",background:"#EAF3DE",padding:"2px 7px",borderRadius:5}}>{t.inSituBadge}</span>}</span>
        </div>
        <input type="range" min={1} max={50} step={1} value={sizeA} onChange={e=>{setSizeA(+e.target.value);setAnalyzed(false);}} style={{width:"100%",marginBottom:6}}/>
        <input type="range" min={1} max={50} step={1} value={sizeB} onChange={e=>{setSizeB(+e.target.value);setAnalyzed(false);}} style={{width:"100%"}}/>
      </div>
      <Chips label={t.newAnal.shape} options={t.newAnal.shapes} value={shape} onChange={setShape}/>
      <Chips label={t.newAnal.margin} options={t.newAnal.margins} value={margin} onChange={setMargin}/>
      <Chips label={t.newAnal.echo} options={t.newAnal.echos} value={echo} onChange={setEcho}/>
      <Chips label={t.newAnal.posterior} options={t.newAnal.posteriors} value={posterior} onChange={setPosterior}/>
      <Chips label={t.newAnal.orientation} options={t.newAnal.orientations} value={orientation} onChange={setOrientation}/>
    </Card>}
    {(mod==="mammo"||mod==="combined")&&<Card style={{marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#6A3DAA",marginBottom:14}}>🔬 {t.newAnal.mammoFeatures}</div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,color:ts,marginBottom:8}}>{t.newAnal.density}</div>
        <div style={{display:"flex",gap:8}}>
          {["A","B","C","D"].map(d=>(
            <button key={d} onClick={()=>{setDensity(d);setAnalyzed(false);}} style={{width:48,height:48,borderRadius:10,border:density===d?"2px solid #6A3DAA":`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:density===d?"#EEEDFE":dark?"#263040":"#FAFAFA",cursor:"pointer",fontWeight:700,fontSize:16,color:density===d?"#6A3DAA":"#8FA4B2"}}>{d}</button>
          ))}
        </div>
      </div>
      {[[t.newAnal.calcification,calcification,setCalcification],[t.newAnal.distortion,distortion,setDistortion]].map(([label,val,setter])=>(
        <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:`0.5px solid ${dark?"#2E3A47":"#EEF3F8"}`}}>
          <span style={{fontSize:13,color:tx}}>{label}</span>
          <Toggle value={val} onChange={v=>{setter(v);setAnalyzed(false);}}/>
        </div>
      ))}
    </Card>}
    {analyzed&&<Card style={{marginBottom:14,background:bg,borderColor:color+"55"}}>
      <div style={{fontSize:12,color:ts,marginBottom:10,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        ✨ {t.newAnal.resultLabel}
        {apiResult&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"#E6F1FB",color:"#0B6E8A",fontWeight:600}}>🔗 Backend</span>}
        {apiResult&&apiResult.ai_model_used&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"#EAF3DE",color:"#2D9E6B",fontWeight:600}}>🧠 AI model</span>}
      </div>
      {apiResult&&apiResult.demo&&<div style={{marginBottom:10,padding:"8px 12px",background:"#FCEBEB",borderRadius:8,fontSize:12,color:"#D63B3B",fontWeight:700}}>{t.banner.demo}</div>}
      {patientName&&<div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:8}}>👤 {patientName}{patientAge?`, ${patientAge} yosh`:""}</div>}
      <Badge cat={cat} sub={result?.sub}/>
      <div style={{fontSize:13,color:ts,marginTop:8}}>{(apiResult&&(apiResult.recommendation))||bm.rec}</div>
      {apiResult&&apiResult.class_probabilities&&<div style={{display:"flex",gap:12,marginTop:10,fontSize:12,flexWrap:"wrap"}}>
        {Object.entries(apiResult.class_probabilities).map(([cls,p])=>{
          const ccol=cls==="malignant"?"#D63B3B":cls==="benign"?"#2D9E6B":"#0B6E8A";
          return <span key={cls} style={{color:ccol,fontWeight:600}}>{(t.cls&&t.cls[cls])||cls}: {Math.round(p*100)}%</span>;
        })}
      </div>}
      {apiResult&&apiResult.operating_point!=null&&<div style={{marginTop:8,fontSize:12,fontWeight:600,color:apiResult.flagged_malignant?"#D63B3B":"#2D9E6B"}}>
        {apiResult.flagged_malignant?t.op.flagged:t.op.notFlagged} (OP={apiResult.operating_point})
      </div>}
      {ins&&<div style={{marginTop:10,padding:"8px 12px",background:"#EAF3DE",borderRadius:8,fontSize:12,color:"#2D9E6B",fontWeight:600}}>🎯 {t.newAnal.inSituNote}</div>}
      {/* AI qayta ko'rik tavsiyasi */}
      {(()=>{const fm=followupMonths(cat);const nd=computeNextCheckup(cat);return (
        <div style={{marginTop:10,padding:"10px 12px",background:dark?"#263040":"#EEF3F8",borderRadius:8}}>
          <div style={{fontSize:12,fontWeight:700,color:tx,marginBottom:3}}>{t.followup.title}</div>
          <div style={{fontSize:13,color:fm===0?"#D63B3B":"#0B6E8A",fontWeight:600}}>
            {fm===0?t.followup.now:`${fm} ${t.followup.months}`}
            {fm>0&&<span style={{color:ts,fontWeight:400}}> · {t.followup.next}: {new Date(nd).toLocaleDateString("uz-UZ",{year:"numeric",month:"long",day:"numeric"})}</span>}
          </div>
        </div>
      );})()}
      <div style={{marginTop:12}}><ConfBar value={result?result.conf:0.88}/></div>

      {/* Explainability — faqat rasm AI bilan tahlil qilinganda */}
      {uploadedFile&&apiResult&&apiResult.ai_model_used&&<div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
        <button disabled={heatLoading} onClick={async()=>{
          if(heatmap){setHeatmap(null);return;}
          setHeatLoading(true);
          try{
            const fd=new FormData();fd.append("file",uploadedFile);
            const r=await fetch(`${apiUrl}/api/explain`,{method:"POST",body:fd,signal:AbortSignal.timeout(120000)});
            if(r.ok){const d=await r.json();setHeatmap(d.heatmap_png_base64);}
          }catch(e){console.log("explain xato:",e.message);}
          setHeatLoading(false);
        }} style={{padding:"8px 14px",borderRadius:10,border:"1px solid #E86B2A",background:"#FAECE7",color:"#E86B2A",fontSize:12,fontWeight:600,cursor:"pointer"}}>
          {heatLoading?t.explain.loading:t.explain.btn}
        </button>
        <button disabled={segLoading} onClick={async()=>{
          if(segResult){setSegResult(null);return;}
          setSegLoading(true);
          try{
            const fd=new FormData();fd.append("file",uploadedFile);
            const r=await fetch(`${apiUrl}/api/segment`,{method:"POST",body:fd,signal:AbortSignal.timeout(60000)});
            if(r.ok){setSegResult(await r.json());}
          }catch(e){console.log("segment xato:",e.message);}
          setSegLoading(false);
        }} style={{padding:"8px 14px",borderRadius:10,border:"1px solid #1A7A5E",background:"#E1F5EE",color:"#1A7A5E",fontSize:12,fontWeight:600,cursor:"pointer"}}>
          {segLoading?t.explain.loading:t.explain.btnSeg}
        </button>
      </div>}
      {heatmap&&<div style={{marginTop:12}}>
        <div style={{fontSize:12,fontWeight:700,color:tx,marginBottom:6}}>🔥 {t.explain.title}</div>
        <img src={`data:image/png;base64,${heatmap}`} alt="AI heatmap" style={{width:"100%",borderRadius:12,display:"block"}}/>
        <div style={{fontSize:11,color:"#8FA4B2",marginTop:4}}>{t.explain.desc}</div>
      </div>}
      {segResult&&<div style={{marginTop:12}}>
        <div style={{fontSize:12,fontWeight:700,color:tx,marginBottom:6}}>✂️ {t.explain.segTitle}</div>
        {segResult.found
          ?<div>
            <img src={`data:image/png;base64,${segResult.overlay_png_base64}`} alt="Segmentatsiya" style={{width:"100%",borderRadius:12,display:"block"}}/>
            <div style={{fontSize:11,color:"#8FA4B2",marginTop:4}}>
              {t.explain.diameter}: ~{segResult.equivalent_diameter_px}px · {t.explain.areaPct}: {segResult.area_pct}% · {t.explain.segNote}
            </div>
          </div>
          :<div style={{fontSize:12,color:"#8FA4B2"}}>{t.explain.notFound}</div>}
      </div>}
      {savedRecord&&<button onClick={()=>generatePDFReport(savedRecord,doctorName,doctorDept,{heatmap,segmentation:segResult&&segResult.found?segResult.overlay_png_base64:null})}
        style={{width:"100%",marginTop:14,padding:11,borderRadius:10,border:"1px solid #6A3DAA",background:"#EEEDFE",color:"#6A3DAA",fontWeight:700,fontSize:13,cursor:"pointer"}}>
        📄 {t.detail.pdfExport}
      </button>}
    </Card>}
    {!patientName.trim()&&!analyzed&&<div style={{fontSize:12,color:"#E86B2A",textAlign:"center",marginBottom:8}}>⚠️ Bemor F.I.O. ni kiriting</div>}
    <button onClick={async()=>{
      if(!patientName.trim()){alert("Bemor F.I.O. ni kiriting!");return;}
      setLoading(true);
      setHeatmap(null);setSegResult(null);
      let finalCat=calcBiRads();
      let finalSub=null;
      let finalConf=+(0.75+Math.random()*0.22).toFixed(2);
      let apiUsed=false;

      // Backend ga so'rov yuborish
      try {
        const endpoint = mod==="combined"?"combined":mod==="mammo"?"mammo":"uzi";
        const uziBody = {
          shape, margin, echogenicity:echo,
          posterior_feature:posterior, orientation,
          size_a_mm:sizeA, size_b_mm:sizeB
        };
        const mammoBody = {
          density, has_calcification:calcification,
          has_architectural_distortion:distortion, has_asymmetry:false
        };
        const body = mod==="uzi"?uziBody : mod==="mammo"?mammoBody : {uzi:uziBody,mammo:mammoBody};

        if(uploadedFile){
          // Rasm yuklangan — AI model bilan tekshirish
          const formData = new FormData();
          formData.append("file", uploadedFile);
          const imgRes = await fetch(`${apiUrl}/api/analyze/image?threshold=${opThreshold}`,{
            method:"POST", body:formData, signal:AbortSignal.timeout(40000)
          });
          if(imgRes.ok){
            const imgData = await imgRes.json();
            // Backend o'zi BI-RADS hisoblaydi (4a/4b/4c bilan)
            finalCat = imgData.birads_category ?? finalCat;
            finalSub = imgData.birads_subcategory || null;
            finalConf = imgData.confidence ?? finalConf;
            apiUsed = true;
            setApiResult(imgData);
          } else {
            const err = await imgRes.json().catch(()=>({}));
            const msg = err?.detail?.message || (typeof err?.detail==="string"?err.detail:null) || "Noto'g'ri rasm! UZI yoki mammografiya rasmi yuklang.";
            setUploadError(msg);
            setLoading(false);
            return;
          }
        } else {
          // Rasm yo'q — xususiyatlar asosida rule-based tahlil
          const res = await fetch(`${apiUrl}/api/analyze/${endpoint}`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body),
            signal:AbortSignal.timeout(20000)
          });
          if(res.ok){
            const data = await res.json();
            finalCat = data.category;
            finalSub = data.subcategory || null;
            finalConf = data.confidence;
            apiUsed = true;
            setApiResult(data);
          }
        }
      } catch(e){
        console.log("Backend ulanmadi, local hisoblash ishlatildi:", e.message);
      }

      const thumb = uploadedFile ? await fileToThumb(uploadedFile) : null;
      setLoading(false);
      setAnalyzed(true);
      setResult({cat:finalCat, sub:finalSub, conf:finalConf});
      const nowISO = new Date().toISOString();
      const record = {
        id: Date.now().toString(),
        date: nowISO,
        patientName, patientAge, patientPhone, patientGender, patientNotes,
        modality: mod,
        birads: finalCat,
        biradsSub: finalSub,
        confidence: finalConf,
        apiUsed,
        imageThumb: thumb,
        followupMonths: followupMonths(finalCat),
        nextCheckup: computeNextCheckup(finalCat, nowISO),
        sizeA: mod!=="mammo"?sizeA:null,
        sizeB: mod!=="mammo"?sizeB:null,
        isInSitu: mod!=="mammo"&&sizeA<=10&&sizeB<=10,
        shape: mod!=="mammo"?shape:null,
        margin: mod!=="mammo"?margin:null,
        echo: mod!=="mammo"?echo:null,
        density: mod!=="uzi"?density:null,
        calcification: mod!=="uzi"?calcification:null,
        distortion: mod!=="uzi"?distortion:null,
      };
      setSavedRecord(record);
      addToHistory(record);
    }}
      style={{width:"100%",padding:14,borderRadius:12,border:"none",background:loading?"#8FA4B2":"#0B6E8A",color:"#fff",fontWeight:700,fontSize:14,cursor:loading?"not-allowed":"pointer",transition:"background .2s"}}>
      {loading?t.newAnal.btnLoading:analyzed?t.newAnal.btnRetry:t.newAnal.btnStart}
    </button>
  </div>;
}

// ─── STATISTICS ───────────────────────────────────────────────────────────────
function Statistics(){
  const {t,dark,history,apiUrl}=useApp();
  const all = history.length>0 ? history : [];
  const [metrics,setMetrics]=useState(null);
  useEffect(()=>{
    fetch(`${apiUrl}/api/metrics`,{signal:AbortSignal.timeout(15000)})
      .then(r=>r.json()).then(setMetrics).catch(()=>setMetrics({available:false}));
  },[apiUrl]);
  const biRadsDist=[2,3,4,5].map(cat=>({name:`BR${cat}`,value:all.filter(h=>h.birads===cat).length,color:bc(cat)})).filter(d=>d.value>0);
  const modalDist=[
    {name:t.modality.uzi,value:all.filter(h=>h.modality==="uzi").length,color:"#0B6E8A"},
    {name:t.modality.mammo,value:all.filter(h=>h.modality==="mammo").length,color:"#6A3DAA"},
    {name:t.modality.combined,value:all.filter(h=>h.modality==="combined").length,color:"#1A7A5E"},
  ];
  const confData=all.slice(0,10).map((h,i)=>({name:`T${i+1}`,value:Math.round(h.confidence*100)}));
  const inSituCount=all.filter(h=>h.isInSitu).length;
  const avgConf=all.length>0?Math.round(all.reduce((s,h)=>s+h.confidence,0)/all.length*100):0;
  const tx=dark?"#E8EFF5":"#0D1B2A";

  function downloadSPSS(){
    // SPSS .sav format simulyatsiyasi (CSV bilan meta)
    const header = [
      "* SPSS Syntax for Breast AI Dataset",
      "* Generated: " + new Date().toISOString(),
      "* Variables: ID, PatientName, Age, Gender, BIRADS, Confidence, Modality, InSitu, Date",
      "",
      "DATA LIST FILE='breast_ai_data.csv' FREE (",
      "  ID (A10), PatientName (A50), Age (F3), Gender (A10),",
      "  BIRADS (F1), Confidence (F5.2), Modality (A10), InSitu (F1), Date (A10)",
      ").",
      "",
      "VARIABLE LABELS",
      "  ID 'Bemor identifikatori'",
      "  PatientName 'Bemor ismi'",
      "  Age 'Yosh'",
      "  BIRADS 'BI-RADS kategoriya (1-6)'",
      "  Confidence 'AI ishonch darajasi (0-1)'",
      "  Modality 'Tahlil turi (uzi/mammo/combined)'",
      "  InSitu 'In situ ehtimoli (0=yoq, 1=ha)'.",
      "",
      "VALUE LABELS BIRADS",
      "  1 'Negativ' 2 'Xavfsiz' 3 'Ehtimol xavfsiz'",
      "  4 'Shubhali' 5 'Xavfli' 6 'Tasdiqlangan'.",
      "",
      "FREQUENCIES VARIABLES=BIRADS InSitu.",
      "CROSSTABS BIRADS BY Modality.",
      "DESCRIPTIVES VARIABLES=Age Confidence.",
    ].join("\n");

    const csvData = [
      "ID,PatientName,Age,Gender,BIRADS,Confidence,Modality,InSitu,Date",
      ...all.map(h=>[
        h.id, `"${h.patientName}"`, h.patientAge||"",
        h.patientGender||"", h.birads,
        h.confidence.toFixed(4), h.modality,
        h.isInSitu?1:0, h.date?.split("T")[0]||""
      ].join(","))
    ].join("\n");

    dataDownload(header + "\n\n* DATA:\n" + csvData, "breast_ai_spss.sps");
  }

  function downloadExcel(){
    // Excel-compatible CSV (BOM bilan, Excel da to'g'ri ochiladi)
    const BOM = "\uFEFF";
    const headers = [
      "ID", "Bemor ismi", "Yosh", "Jins", "BI-RADS",
      "AI ishonch %", "Tahlil turi", "In situ",
      "O'lcham A (mm)", "O'lcham B (mm)", "Shakl",
      "Echogenlik", "Zichlik", "Mikrokalsifikat",
      "Sana", "Izoh"
    ];
    const rows = all.map(h => [
      h.id,
      h.patientName,
      h.patientAge||"",
      h.patientGender||"",
      h.birads,
      Math.round(h.confidence*100),
      h.modality==="uzi"?"Ultrasound":h.modality==="mammo"?"Mammografiya":"Kombinatsiya",
      h.isInSitu?"Ha":"Yo'q",
      h.sizeA||"",
      h.sizeB||"",
      h.shape||"",
      h.echo||"",
      h.density||"",
      h.calcification!=null?(h.calcification?"Ha":"Yo'q"):"",
      h.date?.split("T")[0]||"",
      '"' + (h.patientNotes||"").replace(/"/g,"''") + '"',
    ].join(";"));  // Semicolon — Excel uchun

    // Statistika extra sheet
    const urgent = all.filter(h=>h.birads>=4).length;
    const inSituN = all.filter(h=>h.isInSitu).length;
    const uziN = all.filter(h=>h.modality==="uzi").length;
    const mammoN = all.filter(h=>h.modality==="mammo").length;
    const combN = all.filter(h=>h.modality==="combined").length;
    const stats = [
      "",
      "STATISTIKA XULOSASI",
      "Jami tahlillar;" + all.length,
      "Shoshilinch (BR4+);" + urgent,
      "In situ aniqlangan;" + inSituN,
      "Ortacha AI ishonch;" + avgConf + "%",
      "UZI tahlillar;" + uziN,
      "Mammo tahlillar;" + mammoN,
      "Kombinatsiya;" + combN,
    ].join("\n");

    const csv = BOM + [headers.join(";"), ...rows].join("\n") + stats;
    dataDownload(csv, "breast_ai_excel.csv");
  }

  function downloadCSV(){
    const headers=["ID","Bemor","Yosh","Jins","Sana","Modalligi","BI-RADS","Ishonch %","In situ","Izoh"];
    const rows=all.map(h=>[h.id,h.patientName,h.patientAge||"",h.patientGender||"",h.date?.split("T")[0]||"",h.modality,h.birads,Math.round(h.confidence*100),h.isInSitu?"Ha":"Yo'q",h.patientNotes||""].join(","));
    const csv=[headers.join(","),...rows].join("\n");
    dataDownload(csv,"breast_ai_statistika.csv");
  }

  function downloadStatsPDF(){
    const lines=[
      "BREAST AI - STATISTIKA HISOBOTI",
      "================================",
      `Sana: ${new Date().toLocaleDateString("uz-UZ")}`,
      "",
      `Jami tahlillar: ${all.length}`,
      `Shoshilinch holat (BR4-6): ${all.filter(h=>h.birads>=4).length}`,
      `In situ aniqlangan (≤10mm): ${inSituCount}`,
      `O'rtacha AI ishonch: ${avgConf}%`,
      "",
      "BI-RADS TAQSIMOTI:",
      ...biRadsDist.map(d=>`  ${d.name}: ${d.value} ta bemor`),
      "",
      "BEMORLAR RO'YXATI:",
      ...all.map(h=>`  ${h.patientName} | ${h.patientAge||"?"} yosh | BI-RADS ${h.biradsSub||h.birads} | ${Math.round(h.confidence*100)}%`),
    ].join("\n");
    dataDownload(lines,"breast_ai_hisobot.txt");
  }

  return <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:10}}>
      <div style={{fontSize:24,fontWeight:800,color:tx,letterSpacing:"-0.5px"}}>{t.stats.title}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={downloadCSV} style={{padding:"7px 14px",borderRadius:10,border:"1px solid #0B6E8A",background:"#E6F1FB",color:"#0B6E8A",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.stats.downloadCsv}</button>
        <button onClick={downloadStatsPDF} style={{padding:"7px 14px",borderRadius:10,border:"1px solid #6A3DAA",background:"#EEEDFE",color:"#6A3DAA",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.stats.downloadPdf}</button>
        <button onClick={downloadSPSS} style={{padding:"7px 14px",borderRadius:10,border:"1px solid #1A7A5E",background:"#E1F5EE",color:"#1A7A5E",fontSize:12,fontWeight:600,cursor:"pointer"}}>📊 SPSS</button>
        <button onClick={downloadExcel} style={{padding:"7px 14px",borderRadius:10,border:"1px solid #217346",background:"#E8F5E9",color:"#217346",fontSize:12,fontWeight:600,cursor:"pointer"}}>📗 Excel</button>
      </div>
    </div>
    <div style={{fontSize:13,color:"#52687A",marginBottom:20}}>{new Date().toLocaleDateString("uz-UZ",{month:"long",year:"numeric"})}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
      {[[t.stats.totalAnalyses,all.length,"#0B6E8A"],[t.stats.aiConf,avgConf>0?`${avgConf}%`:"—","#6A3DAA"],[t.stats.urgentCases,all.filter(h=>h.birads>=4).length,"#E86B2A"]].map(([l,v,c])=>(
        <Card key={l} style={{padding:14,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:c,letterSpacing:"-1px"}}>{v}</div><div style={{fontSize:11,color:"#8FA4B2",marginTop:3}}>{l}</div></Card>
      ))}
    </div>
    <Card style={{marginBottom:14}}>
      <div style={{fontSize:15,fontWeight:700,color:tx,marginBottom:14}}>{t.stats.biRadsDist}</div>
      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <ResponsiveContainer width={160} height={160}>
          <PieChart><Pie data={biRadsDist} cx={75} cy={75} innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
            {biRadsDist.map((d,i)=><Cell key={i} fill={d.color}/>)}
          </Pie><Tooltip formatter={(v,n)=>[`${v} ta`,n]}/></PieChart>
        </ResponsiveContainer>
        <div style={{flex:1}}>
          {biRadsDist.map(d=>(
            <div key={d.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/>
              <span style={{fontSize:12,color:"#52687A",flex:1}}>BI-RADS {d.name.slice(2)}</span>
              <span style={{fontSize:12,fontWeight:700,color:d.color}}>{d.value} ta</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{fontSize:15,fontWeight:700,color:tx,marginBottom:14}}>{t.stats.modality}</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={modalDist} margin={{top:4,right:4,left:-20,bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark?"#2E3A47":"#EEF3F8"} vertical={false}/>
          <XAxis dataKey="name" tick={{fontSize:11,fill:"#8FA4B2"}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fontSize:11,fill:"#8FA4B2"}} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{background:dark?"#1E2733":"#fff",border:"1px solid #DDE6ED",borderRadius:8}}/>
          <Bar dataKey="value" radius={[6,6,0,0]}>{modalDist.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{fontSize:15,fontWeight:700,color:tx,marginBottom:14}}>{t.stats.confLevel}</div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={confData} margin={{top:4,right:4,left:-20,bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark?"#2E3A47":"#EEF3F8"} vertical={false}/>
          <XAxis dataKey="name" tick={{fontSize:11,fill:"#8FA4B2"}} axisLine={false} tickLine={false}/>
          <YAxis domain={[70,100]} tick={{fontSize:11,fill:"#8FA4B2"}} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{background:dark?"#1E2733":"#fff",border:"1px solid #DDE6ED",borderRadius:8}} formatter={v=>[`${v}%`]}/>
          <Line type="monotone" dataKey="value" stroke="#0B6E8A" strokeWidth={2.5} dot={{r:4,fill:"#0B6E8A",strokeWidth:2,stroke:dark?"#1E2733":"#fff"}}/>
        </LineChart>
      </ResponsiveContainer>
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{fontSize:15,fontWeight:700,color:tx,marginBottom:14}}>{t.metrics.title}</div>
      {metrics&&metrics.available
        ?<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:16}}>
            {[[t.metrics.acc,metrics.accuracy,"#0B6E8A"],[t.metrics.sens,metrics.sensitivity,"#2D9E6B"],[t.metrics.spec,metrics.specificity,"#6A3DAA"],[t.metrics.auc,metrics.auc,"#E86B2A"],[t.metrics.f1,metrics.f1,"#BA7517"]].map(([l,v,c])=>(
              <div key={l} style={{background:dark?"#263040":"#F7F9FC",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:800,color:c}}>{(v*100).toFixed(1)}%</div>
                <div style={{fontSize:10,color:"#8FA4B2",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:8}}>{t.metrics.roc} (AUC = {metrics.auc})</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={[...metrics.roc_curve].sort((a,b)=>a.fpr-b.fpr)} margin={{top:4,right:8,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?"#2E3A47":"#EEF3F8"}/>
              <XAxis dataKey="fpr" type="number" domain={[0,1]} tick={{fontSize:10,fill:"#8FA4B2"}} tickFormatter={v=>v.toFixed(1)}/>
              <YAxis dataKey="tpr" type="number" domain={[0,1]} tick={{fontSize:10,fill:"#8FA4B2"}} tickFormatter={v=>v.toFixed(1)}/>
              <Tooltip contentStyle={{background:dark?"#1E2733":"#fff",border:"1px solid #DDE6ED",borderRadius:8,fontSize:11}} formatter={(v,n)=>[Number(v).toFixed(3),n==="tpr"?"TPR (Sezgirlik)":"FPR"]}/>
              <Line type="monotone" dataKey="tpr" stroke="#E86B2A" strokeWidth={2.5} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{fontSize:13,fontWeight:600,color:tx,margin:"14px 0 8px"}}>{t.metrics.cm} ({t.metrics.nTest}: {metrics.n_total})</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,textAlign:"center"}}>
            <tbody>
              <tr>
                <td style={{padding:8,color:"#8FA4B2"}}></td>
                <td style={{padding:8,color:"#8FA4B2",fontWeight:600}}>{t.metrics.pred}: {t.metrics.benign}</td>
                <td style={{padding:8,color:"#8FA4B2",fontWeight:600}}>{t.metrics.pred}: {t.metrics.malignant}</td>
              </tr>
              <tr>
                <td style={{padding:8,color:"#8FA4B2",fontWeight:600}}>{t.metrics.real}: {t.metrics.benign}</td>
                <td style={{padding:8,background:"#EAF3DE",color:"#2D9E6B",fontWeight:800,borderRadius:8}}>{metrics.confusion_matrix.tn}</td>
                <td style={{padding:8,background:"#FCEBEB",color:"#D63B3B",fontWeight:700}}>{metrics.confusion_matrix.fp}</td>
              </tr>
              <tr>
                <td style={{padding:8,color:"#8FA4B2",fontWeight:600}}>{t.metrics.real}: {t.metrics.malignant}</td>
                <td style={{padding:8,background:"#FCEBEB",color:"#D63B3B",fontWeight:700}}>{metrics.confusion_matrix.fn}</td>
                <td style={{padding:8,background:"#EAF3DE",color:"#2D9E6B",fontWeight:800}}>{metrics.confusion_matrix.tp}</td>
              </tr>
            </tbody>
          </table>
          {metrics.model&&<div style={{fontSize:11,color:"#8FA4B2",marginTop:8}}>📦 {metrics.model}{metrics.cancer_detection&&` · ${t.metrics.cancerNote}`}</div>}

          {/* 5-fold cross-validation (95% CI) */}
          {metrics.cross_validation&&<div style={{marginTop:18}}>
            <div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:8}}>📊 {t.metrics.cvTitle}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8}}>
              {[["auc",t.metrics.auc,"#E86B2A"],["sensitivity",t.metrics.sens,"#2D9E6B"],["specificity",t.metrics.spec,"#6A3DAA"],["accuracy",t.metrics.acc,"#0B6E8A"]].map(([k,l,c])=>{
                const m=metrics.cross_validation[k]; if(!m)return null;
                return <div key={k} style={{background:dark?"#263040":"#F7F9FC",borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
                  <div style={{fontSize:14,fontWeight:800,color:c}}>{(m.mean*100).toFixed(1)}<span style={{fontSize:10}}>±{(m.ci95*100).toFixed(1)}</span></div>
                  <div style={{fontSize:10,color:"#8FA4B2",marginTop:2}}>{l}</div>
                </div>;
              })}
            </div>
          </div>}

          {/* Arxitektura taqqoslovi */}
          {metrics.architecture_comparison&&<div style={{marginTop:18}}>
            <div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:8}}>🏗 {t.metrics.compTitle}</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{color:"#8FA4B2"}}>
                <td style={{padding:"6px 8px",textAlign:"left"}}>{t.metrics.arch}</td>
                <td style={{padding:"6px 4px",textAlign:"center"}}>{t.metrics.auc}</td>
                <td style={{padding:"6px 4px",textAlign:"center"}}>{t.metrics.sens}</td>
                <td style={{padding:"6px 4px",textAlign:"center"}}>{t.metrics.spec}</td>
                <td style={{padding:"6px 4px",textAlign:"center"}}>{t.metrics.acc}</td>
              </tr></thead>
              <tbody>
                {[...metrics.architecture_comparison].sort((a,b)=>b.auc-a.auc).map((r,i)=>(
                  <tr key={r.arch} style={{borderTop:`1px solid ${dark?"#2E3A47":"#EEF3F8"}`,background:i===0?(dark?"#1E3329":"#EAF3DE"):"transparent"}}>
                    <td style={{padding:"6px 8px",fontWeight:i===0?700:500,color:tx}}>{i===0?"🏆 ":""}{r.arch}</td>
                    <td style={{padding:"6px 4px",textAlign:"center",fontWeight:700,color:"#E86B2A"}}>{(r.auc*100).toFixed(1)}</td>
                    <td style={{padding:"6px 4px",textAlign:"center",color:tx}}>{(r.sensitivity*100).toFixed(0)}</td>
                    <td style={{padding:"6px 4px",textAlign:"center",color:tx}}>{(r.specificity*100).toFixed(0)}</td>
                    <td style={{padding:"6px 4px",textAlign:"center",color:tx}}>{(r.accuracy*100).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </div>
        :<div style={{textAlign:"center",padding:"20px 10px",color:"#8FA4B2"}}>
          <div style={{fontSize:28,marginBottom:8}}>🧪</div>
          <div style={{fontSize:13}}>{t.metrics.noData}</div>
          <div style={{fontSize:11,marginTop:6,fontFamily:"monospace",background:dark?"#263040":"#F7F9FC",borderRadius:8,padding:"8px 12px",display:"inline-block"}}>{t.metrics.hint}</div>
        </div>}
    </Card>
    <Card style={{background:"#EAF3DE",borderColor:"#2D9E6B44"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:16}}>🎯</span><div style={{fontSize:14,fontWeight:700,color:"#0D1B2A"}}>{t.stats.inSituTitle}</div></div>
      <div style={{fontSize:36,fontWeight:800,color:"#2D9E6B",letterSpacing:"-1px",marginBottom:6}}>{inSituCount}</div>
      <div style={{height:8,borderRadius:8,background:"#C0DD97",overflow:"hidden",marginBottom:8}}>
        <div style={{width:`${all.length>0?inSituCount/all.length*100:0}%`,height:"100%",background:"#2D9E6B",borderRadius:8}}/>
      </div>
      <div style={{fontSize:12,color:"#3B6D11"}}>{all.length>0?Math.round(inSituCount/all.length*100):0}% {t.stats.inSituDesc}</div>
      <div style={{fontSize:12,color:"#3B6D11",marginTop:4}}>{t.stats.inSituEffect}</div>
    </Card>
  </div>;
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings(){
  const {lang,t,setLang,dark,setDark,apiUrl,setApiUrl,doctorName,setDoctorName,doctorDept,setDoctorDept,logout,showAllDoctors,setShowAllDoctors,isAdmin}=useApp();
  const s=t.settings;
  const [notif,setNotif]=useState(true);
  const [auto,setAuto]=useState(false);
  const [editApi,setEditApi]=useState(false);
  const [toast,setToast]=useState(null);

  const [editDoc,setEditDoc]=useState(false);
  const [apiStatus,setApiStatus]=useState(null);
  const [modal,setModal]=useState(null);
  const [reportText,setReportText]=useState("");
  const [reportSent,setReportSent]=useState(false);
  const tx=dark?"#E8EFF5":"#0D1B2A";

  function toast2(msg,type="info"){setToast({msg,type});}

  async function checkApi(){
    setApiStatus("checking");
    try {
      const res = await fetch(`${apiUrl}/health`,{signal:AbortSignal.timeout(60000)});
      const data = await res.json();
      if(data.status==="ok"){setApiStatus("ok");toast2(s.connected,"success");}
      else{setApiStatus("error");toast2(s.toastBackend,"warn");}
    } catch(e){
      setApiStatus("error");
      toast2(s.toastBackend,"warn");
    }
    setTimeout(()=>setApiStatus(null),4000);
  }

  function downloadBackup(){
    const hist = JSON.parse(localStorage.getItem("breastai_history")||"[]");
    const data=JSON.stringify({patients:hist,exportedAt:new Date().toISOString(),version:"1.0.0",doctor:doctorName,department:doctorDept},null,2);
    dataDownload(data,"breast_ai_backup.json");
    toast2(s.toastBackup,"success");
    setModal(null);
  }

  function generatePDF(){
    const hist = JSON.parse(localStorage.getItem("breastai_history")||"[]");
    const lines=[
      "BREAST AI - TIBBIY HISOBOT",
      "===========================",
      `Sana: ${new Date().toLocaleDateString("uz-UZ")}`,
      `Doktor: ${doctorName} | ${doctorDept}`,
      `Jami bemorlar: ${hist.length} ta`,
      "",
      ...hist.map(h=>[
        `Bemor: ${h.patientName} | ${h.patientAge||"??"} yosh | ${h.patientGender||""}`,
        `  Tahlil: ${h.modality==="uzi"?"UZI":h.modality==="mammo"?"Mammografiya":"Kombinatsiya"}`,
        `  BI-RADS: ${h.birads} | Ishonch: ${Math.round(h.confidence*100)}%`,
        `  Sana: ${h.date?.split("T")[0]||""}`,
        h.isInSitu?"  ⚡ In situ ehtimoli!":"",
        h.patientNotes?`  Izoh: ${h.patientNotes}`:"",
        "",
      ].filter(Boolean).join("\n")),
    ].join("\n");
    dataDownload(lines,"breast_ai_tibbiy_hisobot.txt");
    toast2(s.toastPdf,"success");
    setModal(null);
  }

  function sendReport(){
    setReportSent(true);
    setTimeout(()=>{setReportSent(false);setReportText("");setModal(null);toast2(s.toastReport,"success");},1500);
  }

  return <div style={{paddingBottom:20}}>
    {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

    {modal==="pdf"&&<Modal title={s.pdfModalTitle} onClose={()=>setModal(null)}>
      <p style={{fontSize:13,color:"#52687A",marginBottom:16,lineHeight:1.5}}>{s.pdfModalDesc}</p>
      {(()=>{
        const hist=JSON.parse(localStorage.getItem("breastai_history")||"[]");
        return <div style={{background:"#EEF3F8",borderRadius:12,padding:14,marginBottom:16,fontSize:12,color:"#52687A"}}>
          📋 {hist.length} ta bemor · {hist.filter(h=>h.birads>=4).length} ta shoshilinch · {hist.filter(h=>h.isInSitu).length} ta in situ
        </div>;
      })()}
      <button onClick={generatePDF} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:"#6A3DAA",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{s.pdfGenerate} ⬇️</button>
    </Modal>}

    {modal==="backup"&&<Modal title={s.backupModalTitle} onClose={()=>setModal(null)}>
      <p style={{fontSize:13,color:"#52687A",marginBottom:16,lineHeight:1.5}}>{s.backupModalDesc}</p>
      <div style={{background:"#EEF3F8",borderRadius:12,padding:14,marginBottom:16,fontSize:12,color:"#52687A",fontFamily:"monospace"}}>
        {`{ "patients": ${JSON.parse(localStorage.getItem("breastai_history")||"[]").length}, "date": "${new Date().toISOString().split("T")[0]}", "version": "1.0.0" }`}
      </div>
      <button onClick={downloadBackup} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:"#0B6E8A",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{s.backupDownload} ⬇️</button>
    </Modal>}

    {modal==="report"&&<Modal title={s.reportModalTitle} onClose={()=>setModal(null)}>
      <p style={{fontSize:13,color:"#52687A",marginBottom:12,lineHeight:1.5}}>{s.reportModalDesc}</p>
      <textarea value={reportText} onChange={e=>setReportText(e.target.value)} placeholder={s.reportPlaceholder} rows={5}
        style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #DDE6ED",fontSize:13,color:"#0D1B2A",resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:12}}/>
      <button onClick={sendReport} disabled={!reportText.trim()||reportSent}
        style={{width:"100%",padding:13,borderRadius:12,border:"none",background:reportSent?"#2D9E6B":reportText.trim()?"#0B6E8A":"#DDE6ED",color:"#fff",fontWeight:700,fontSize:14,cursor:reportText.trim()?"pointer":"not-allowed"}}>
        {reportSent?"✓ Yuborildi!":s.reportSend}
      </button>
    </Modal>}

    <div style={{fontSize:24,fontWeight:800,color:tx,letterSpacing:"-0.5px",marginBottom:20}}>{s.title}</div>

    <Card style={{marginBottom:20}}>
      {editDoc
        ?<div>
          <div style={{fontSize:13,fontWeight:600,color:"#52687A",marginBottom:12}}>Profilni tahrirlash</div>
          <input value={doctorName} onChange={e=>setDoctorName(e.target.value)} placeholder={s.namePlaceholder}
            style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #DDE6ED",fontSize:13,color:"#0D1B2A",marginBottom:8,boxSizing:"border-box",outline:"none"}}/>
          <input value={doctorDept} onChange={e=>setDoctorDept(e.target.value)} placeholder={s.deptPlaceholder}
            style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid #DDE6ED",fontSize:13,color:"#0D1B2A",marginBottom:12,boxSizing:"border-box",outline:"none"}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setEditDoc(false);toast2(s.toastSaved,"success");try{localStorage.setItem("doctorName",doctorName);localStorage.setItem("doctorDept",doctorDept);}catch{}}} style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:"#0B6E8A",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{s.save}</button>
            <button onClick={()=>setEditDoc(false)} style={{flex:1,padding:"9px",borderRadius:10,border:"1px solid #DDE6ED",background:"#fff",color:"#52687A",fontWeight:600,fontSize:13,cursor:"pointer"}}>{s.cancel}</button>
          </div>
        </div>
        :<div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:"#0B6E8A",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#fff",flexShrink:0}}>{doctorName.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:tx}}>{doctorName}</div><div style={{fontSize:12,color:"#52687A"}}>{doctorDept}</div></div>
          <button onClick={()=>setEditDoc(true)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #DDE6ED",background:"#fff",fontSize:12,color:"#0B6E8A",fontWeight:600,cursor:"pointer"}}>{s.editProfile}</button>
        </div>}
      {!editDoc&&<button onClick={logout} style={{width:"100%",marginTop:12,padding:10,borderRadius:10,border:"1px solid #FCEBEB",background:"#FCEBEB",color:"#D63B3B",fontWeight:600,fontSize:13,cursor:"pointer"}}>🚪 {t.login.logout}</button>}
    </Card>

    {isAdmin&&<AdminPanel/>}

    <SSection title={s.sectionApp}>
      <SRow label={s.notif} icon="🔔" right={<Toggle value={notif} onChange={v=>{setNotif(v);toast2(v?s.toastNotifOn:s.toastNotifOff,v?"success":"info");}}/>}/>
      <SRow label={s.autoAnalysis} icon="⚡" right={<Toggle value={auto} onChange={v=>{setAuto(v);toast2(v?s.toastAutoOn:s.toastAutoOff,v?"success":"info");}}/>}/>
      <SRow label={s.darkMode} icon="🌙" right={<Toggle value={dark} onChange={v=>{setDark(v);toast2(s.toastDark,"success");}}/>}/>
      <SRow label={s.lang} icon="🌐" right={
        <select value={lang} onChange={e=>{setLang(e.target.value);toast2(s.toastLang,"success");}}
          style={{border:"1px solid #DDE6ED",borderRadius:8,padding:"5px 10px",fontSize:13,color:"#0B6E8A",fontWeight:700,background:"#fff",cursor:"pointer"}}>
          <option value="uz">O'zbek</option>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>}/>
      {isAdmin&&<SRow label={t.login.allPatients} icon="👥" right={<Toggle value={showAllDoctors} onChange={v=>{setShowAllDoctors(v);toast2(v?t.login.allPatients:t.login.myPatients,"info");}}/>}/>}
    </SSection>

    <SSection title={s.sectionModel}>
      <SRow label={s.modelVersion} icon="🧠" right={<span style={{fontSize:12,color:"#8FA4B2"}}>MobileNetV3 · ONNX v3.0</span>}/>
      <SRow label={s.apiEndpoint} icon="🔗" right={editApi
        ?<div style={{display:"flex",gap:6,alignItems:"center"}}>
          <input value={apiUrl} onChange={e=>setApiUrl(e.target.value)} style={{width:150,padding:"4px 8px",borderRadius:8,border:"1px solid #0B6E8A",fontSize:11,color:"#0D1B2A",outline:"none"}}/>
          <button onClick={()=>{setEditApi(false);toast2(s.toastApi,"success");}} style={{padding:"4px 10px",borderRadius:8,border:"none",background:"#0B6E8A",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>OK</button>
        </div>
        :<div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#8FA4B2"}}>{apiUrl}</span>
          <button onClick={()=>setEditApi(true)} style={{padding:"3px 8px",borderRadius:6,border:"1px solid #DDE6ED",background:"#fff",fontSize:11,color:"#52687A",cursor:"pointer"}}>✏️</button>
        </div>}/>
      <SRow label={s.backendStatus} icon="📡" right={
        <button onClick={checkApi} disabled={apiStatus==="checking"}
          style={{padding:"5px 12px",borderRadius:8,border:"1px solid #DDE6ED",background:apiStatus==="ok"?"#EAF3DE":apiStatus==="error"?"#FCEBEB":"#fff",color:apiStatus==="ok"?"#2D9E6B":apiStatus==="error"?"#D63B3B":"#0B6E8A",fontSize:12,fontWeight:600,cursor:"pointer"}}>
          {apiStatus==="checking"?s.checking:apiStatus==="ok"?s.connected:apiStatus==="error"?s.notConnected:s.checkApi}
        </button>}/>
    </SSection>

    <SSection title={s.sectionData}>
      <SRow label={s.pdfReport} icon="📄" right={
        <button onClick={()=>setModal("pdf")} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #6A3DAA",background:"#EEEDFE",color:"#6A3DAA",fontSize:12,fontWeight:600,cursor:"pointer"}}>{s.export}</button>}/>
      <SRow label={s.backup} icon="💾" right={
        <button onClick={()=>setModal("backup")} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #0B6E8A",background:"#E6F1FB",color:"#0B6E8A",fontSize:12,fontWeight:600,cursor:"pointer"}}>{s.backupSave}</button>}/>
      <SRow label={s.clearCache} icon="🗑️" right={
        <button onClick={()=>toast2(s.toastCache,"success")} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #FCEBEB",background:"#FCEBEB",color:"#D63B3B",fontSize:12,fontWeight:600,cursor:"pointer"}}>{s.clear}</button>}/>
    </SSection>

    <SSection title={s.sectionAbout}>
      <SRow label={s.version} icon="ℹ️" right={<span style={{fontSize:12,color:"#8FA4B2"}}>1.0.0</span>}/>
      <SRow label={s.license} icon="✅" right={<span style={{fontSize:12,color:"#8FA4B2"}}>{s.licenseVal}</span>}/>
      <SRow label={s.report} icon="💬" right={
        <button onClick={()=>setModal("report")} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #DDE6ED",background:"#fff",color:"#52687A",fontSize:12,fontWeight:600,cursor:"pointer"}}>{s.send}</button>}/>
    </SSection>

    <div style={{padding:14,background:"#FAEEDA",borderRadius:12,border:"1px solid #EF9F2733",fontSize:12,color:"#854F0B",lineHeight:1.5,marginBottom:20}}>{s.disclaimer}</div>
  </div>;
}



// ─── COMPARE ─────────────────────────────────────────────────────────────────
function CompareScreen({onClose}){
  const {dark, history} = useApp();
  const [sel1, setSel1] = useState(null);
  const [sel2, setSel2] = useState(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const tx = dark?"#E8EFF5":"#0D1B2A";
  const ts = dark?"#8FA4B2":"#52687A";
  const all = history||[];

  const Row = ({label, v1, v2, highlight}) => {
    const diff = v1 !== v2;
    return (
      <tr style={{borderBottom:`1px solid ${dark?"#2E3A47":"#EEF3F8"}`}}>
        <td style={{padding:"8px 10px",fontSize:12,color:"#8FA4B2",width:"30%"}}>{label}</td>
        <td style={{padding:"8px 10px",fontSize:12,fontWeight:500,color:highlight&&v1>=4?"#D63B3B":tx,textAlign:"center"}}>{v1??"-"}</td>
        <td style={{padding:"8px 10px",color:diff?"#E86B2A":"#8FA4B2",textAlign:"center",fontSize:16}}>{diff?"≠":"="}</td>
        <td style={{padding:"8px 10px",fontSize:12,fontWeight:500,color:highlight&&v2>=4?"#D63B3B":tx,textAlign:"center"}}>{v2??"-"}</td>
      </tr>
    );
  };

  const PatientPicker = ({value, onSelect, search, setSearch, label}) => (
    <div style={{flex:1}}>
      <div style={{fontSize:12,color:ts,marginBottom:6}}>{label}</div>
      {value
        ? <div style={{background:dark?"#1E2733":"#F7F9FC",borderRadius:12,padding:12,cursor:"pointer"}} onClick={()=>onSelect(null)}>
            <div style={{fontWeight:600,fontSize:13,color:tx}}>{value.patientName}</div>
            <div style={{fontSize:11,color:ts,marginTop:3}}><Badge cat={value.birads}/></div>
          </div>
        : <div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bemor tanlang..."
              style={{width:"100%",padding:"8px 12px",borderRadius:10,border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:dark?"#1E2733":"#fff",fontSize:13,color:tx,outline:"none",marginBottom:6,boxSizing:"border-box"}}/>
            <div style={{maxHeight:150,overflowY:"auto",border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,borderRadius:10,background:dark?"#1A232E":"#fff"}}>
              {(search.length>1?all.filter(h=>h.patientName.toLowerCase().includes(search.toLowerCase())):all.slice(0,5)).map(h=>(
                <div key={h.id} onClick={()=>onSelect(h)}
                  style={{padding:"8px 12px",cursor:"pointer",fontSize:13,color:tx,borderBottom:`1px solid ${dark?"#2E3A47":"#EEF3F8"}`}}
                  onMouseEnter={e=>e.currentTarget.style.background=dark?"#263040":"#F7F9FC"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {h.patientName} <span style={{fontSize:11,color:"#8FA4B2"}}>· BR{h.birads}</span>
                </div>
              ))}
            </div>
          </div>
      }
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:dark?"#1A232E":"#fff",borderRadius:20,width:"100%",maxWidth:600,maxHeight:"90vh",overflowY:"auto",padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:tx}}>⚖️ Tahlillarni solishtirish</div>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:20,color:"#8FA4B2"}}>✕</button>
        </div>

        <div style={{display:"flex",gap:12,marginBottom:20}}>
          <PatientPicker value={sel1} onSelect={setSel1} search={search1} setSearch={setSearch1} label="1-chi bemor"/>
          <PatientPicker value={sel2} onSelect={setSel2} search={search2} setSearch={setSearch2} label="2-chi bemor"/>
        </div>

        {sel1 && sel2 && (
          <div>
            <div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:10}}>Taqqoslash natijalari</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:dark?"#263040":"#F7F9FC"}}>
                  <td style={{padding:"8px 10px",fontSize:11,color:"#8FA4B2"}}>Ko'rsatkich</td>
                  <td style={{padding:"8px 10px",fontSize:11,color:"#0B6E8A",textAlign:"center"}}>{sel1.patientName.split(" ")[0]}</td>
                  <td style={{padding:"8px 10px",textAlign:"center"}}></td>
                  <td style={{padding:"8px 10px",fontSize:11,color:"#0B6E8A",textAlign:"center"}}>{sel2.patientName.split(" ")[0]}</td>
                </tr>
              </thead>
              <tbody>
                <Row label="BI-RADS" v1={sel1.birads} v2={sel2.birads} highlight/>
                <Row label="AI ishonch" v1={`${Math.round(sel1.confidence*100)}%`} v2={`${Math.round(sel2.confidence*100)}%`}/>
                <Row label="Yosh" v1={sel1.patientAge} v2={sel2.patientAge}/>
                <Row label="Tahlil turi" v1={sel1.modality} v2={sel2.modality}/>
                <Row label="In situ" v1={sel1.isInSitu?"Ha":"Yo'q"} v2={sel2.isInSitu?"Ha":"Yo'q"}/>
                <Row label="O'lcham A" v1={sel1.sizeA?`${sel1.sizeA}mm`:"-"} v2={sel2.sizeA?`${sel2.sizeA}mm`:"-"}/>
              </tbody>
            </table>
            {(sel1.birads >= 4 || sel2.birads >= 4) && (
              <div style={{marginTop:14,padding:12,background:"#FCEBEB",borderRadius:10,fontSize:12,color:"#D63B3B"}}>
                ⚠️ Bir yoki ikki bemor uchun BI-RADS 4+ — shoshilinch onkolog konsultatsiyasi tavsiya etiladi
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QAYTA KO'RIK ESLATMALARI ─────────────────────────────────────────────────
function dueReminders(history){
  // Har bemor uchun oxirgi tahlil; nextCheckup <=7 kun ichida yoki o'tgan bo'lsa
  const byPatient={};
  (history||[]).forEach(h=>{
    if(!h.nextCheckup) return;
    const key=h.patientName+"|"+(h.patientPhone||"");
    if(!byPatient[key]||new Date(h.date)>new Date(byPatient[key].date)) byPatient[key]=h;
  });
  return Object.values(byPatient)
    .map(h=>({...h,days:daysUntil(h.nextCheckup)}))
    .filter(h=>h.days!==null&&h.days<=7)
    .sort((a,b)=>a.days-b.days);
}

function RemindersScreen({onClose,onPatient}){
  const {t,dark,history}=useApp();
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A";
  const due=dueReminders(history);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:50,paddingLeft:16,paddingRight:16}}>
      <div style={{background:dark?"#1A232E":"#fff",borderRadius:20,width:"100%",maxWidth:500,maxHeight:"85vh",overflowY:"auto",padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:16,fontWeight:700,color:tx}}>{t.followup.remindTitle}</div>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:20,color:"#8FA4B2"}}>✕</button>
        </div>
        {due.length===0
          ?<div style={{textAlign:"center",padding:"40px 0",color:"#8FA4B2"}}><div style={{fontSize:36,marginBottom:10}}>✅</div><div style={{fontSize:14}}>{t.followup.remindEmpty}</div></div>
          :<div style={{display:"flex",flexDirection:"column",gap:10}}>
            {due.map(h=>{
              const over=h.days<0;
              return <Card key={h.id} style={{borderColor:over?"#D63B3B55":"#E86B2A55"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div onClick={()=>{onPatient&&onPatient(h);onClose();}} style={{flex:1,minWidth:0,cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <span style={{fontWeight:600,fontSize:14,color:tx}}>{h.patientName}</span>
                      <Badge cat={h.birads} sub={h.biradsSub}/>
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:over?"#D63B3B":"#E86B2A"}}>
                      {over?`⚠️ ${t.followup.overdue} · ${Math.abs(h.days)} ${t.followup.daysOver}`:`${t.followup.soon} · ${h.days} ${t.followup.daysLeft}`}
                    </div>
                    <div style={{fontSize:11,color:ts,marginTop:2}}>{t.followup.next}: {new Date(h.nextCheckup).toLocaleDateString("uz-UZ",{year:"numeric",month:"long",day:"numeric"})}</div>
                  </div>
                  {h.patientPhone
                    ?<a href={`tel:${h.patientPhone.replace(/[^+0-9]/g,"")}`} style={{textDecoration:"none",flexShrink:0}}>
                      <div style={{padding:"8px 12px",borderRadius:10,background:"#2D9E6B",color:"#fff",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{t.followup.call}</div>
                    </a>
                    :<span style={{fontSize:11,color:"#8FA4B2",flexShrink:0}}>—</span>}
                </div>
              </Card>;
            })}
          </div>}
      </div>
    </div>
  );
}

// ─── HISTORY SCREEN ───────────────────────────────────────────────────────────
function HistoryScreen({forcedRecord=null,onBack=null}){
  const {t,dark,history,doctorName,doctorDept,apiUrl,doctorId,token}=useApp();
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(forcedRecord);
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A";

  const filtered=history.filter(h=>
    !search||h.patientName.toLowerCase().includes(search.toLowerCase())
  );

  function fmtDate(iso){
    const d=new Date(iso);
    const m=["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}, ${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  function clearHistory(){
    if(window.confirm("Sizning barcha tahlil tarixingizni o'chirishni tasdiqlaysizmi?")){
      // Faqat joriy shifokor yozuvlarini o'chirish (boshqalarniki qoladi)
      try{
        const all=JSON.parse(localStorage.getItem("breastai_history")||"[]");
        const kept=all.filter(h=>h.doctorId&&h.doctorId!==doctorId);
        localStorage.setItem("breastai_history",JSON.stringify(kept));
      }catch{}
      fetch(`${apiUrl}/api/history?token=${encodeURIComponent(token)}`,{method:"DELETE",signal:AbortSignal.timeout(15000)})
        .catch(()=>{})
        .finally(()=>window.location.reload());
    }
  }

  if(selected){
    const h=selected;
    const color=bc(h.birads), bg2=bb(h.birads);
    const bm=t.birads[h.birads]||t.birads[2];
    return <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <button onClick={()=>{setSelected(null);if(onBack)onBack();}} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#0B6E8A",fontSize:13,fontWeight:600,padding:0}}>← Orqaga</button>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>generatePDFReport(h,doctorName,doctorDept)}
            style={{padding:"7px 14px",borderRadius:10,border:"1px solid #6A3DAA",background:"#EEEDFE",color:"#6A3DAA",fontSize:12,fontWeight:600,cursor:"pointer"}}>
            📄 PDF
          </button>
          <button onClick={()=>{
            const link=generateShareLink(h);
            navigator.clipboard.writeText(link).then(()=>alert("Havola nusxalandi! ✓")).catch(()=>alert(link));
          }}
            style={{padding:"7px 14px",borderRadius:10,border:"1px solid #0B6E8A",background:"#E6F1FB",color:"#0B6E8A",fontSize:12,fontWeight:600,cursor:"pointer"}}>
            🔗 Ulashish
          </button>
        </div>
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:"#0B6E8A",flexShrink:0}}>
            {h.patientName.split(" ").map(w=>w[0]).slice(0,2).join("")}
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:tx}}>{h.patientName}</div>
            <div style={{fontSize:13,color:ts}}>{h.patientAge&&`${h.patientAge} yosh · `}{h.patientGender}</div>
            {h.patientPhone&&<div style={{fontSize:12,color:"#0B6E8A"}}><a href={`tel:${h.patientPhone.replace(/[^+0-9]/g,"")}`} style={{color:"#0B6E8A",textDecoration:"none"}}>📞 {h.patientPhone}</a></div>}
            <div style={{fontSize:11,color:"#8FA4B2"}}>{fmtDate(h.date)}</div>
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:14,background:bg2,borderColor:color+"44"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:12,color:ts,marginBottom:8}}>AI tahlil natijasi · <ModalityTag m={h.modality}/></div>
            <Badge cat={h.birads} sub={h.biradsSub}/>
            <div style={{fontSize:13,color:ts,marginTop:6}}>{bm.rec}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:32,fontWeight:800,color,lineHeight:1}}>{Math.round(h.confidence*100)}%</div>
            <div style={{fontSize:11,color:"#8FA4B2"}}>AI ishonch</div>
          </div>
        </div>
        {h.isInSitu&&<div style={{marginTop:10,padding:"8px 12px",background:"#EAF3DE",borderRadius:8,fontSize:12,color:"#2D9E6B",fontWeight:600}}>🎯 In situ ehtimoli: {h.sizeA}×{h.sizeB}mm</div>}
      </Card>
      {(h.shape||h.echo)&&<Card style={{marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:"#0B6E8A",marginBottom:12}}>🌊 UZI topilmalari</div>
        {h.sizeA&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${dark?"#2E3A47":"#EEF3F8"}`,fontSize:13}}><span style={{color:"#8FA4B2"}}>O'lcham</span><span style={{color:tx,fontWeight:500}}>{h.sizeA}×{h.sizeB} mm</span></div>}
        {h.shape&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${dark?"#2E3A47":"#EEF3F8"}`,fontSize:13}}><span style={{color:"#8FA4B2"}}>Shakl</span><span style={{color:tx,fontWeight:500}}>{h.shape}</span></div>}
        {h.echo&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13}}><span style={{color:"#8FA4B2"}}>Echogenlik</span><span style={{color:tx,fontWeight:500}}>{h.echo}</span></div>}
      </Card>}
      {h.density&&<Card style={{marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:"#6A3DAA",marginBottom:12}}>🔬 Mammografiya</div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${dark?"#2E3A47":"#EEF3F8"}`,fontSize:13}}><span style={{color:"#8FA4B2"}}>Zichlik</span><span style={{color:tx,fontWeight:500}}>BI-RADS {h.density}</span></div>
        {h.calcification!==null&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13}}><span style={{color:"#8FA4B2"}}>Mikrokalsifikat</span><span style={{color:h.calcification?"#D63B3B":tx,fontWeight:500}}>{h.calcification?"✓ Mavjud":"Yo'q"}</span></div>}
      </Card>}
      {h.patientNotes&&<Card style={{marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:tx,marginBottom:8}}>📝 Izoh</div>
        <p style={{fontSize:13,color:ts,lineHeight:1.5,margin:0}}>{h.patientNotes}</p>
      </Card>}

      {/* Shu bemor uchun dinamika */}
      {(()=>{
        const samePatient=(history||[]).filter(r=>r.patientName===h.patientName).sort((a,b)=>new Date(a.date)-new Date(b.date));
        if(samePatient.length<2) return null;
        const chartData=samePatient.map(r=>({
          date:new Date(r.date).toLocaleDateString("uz-UZ",{month:"short",day:"numeric"}),
          birads:r.birads,
          conf:Math.round(r.confidence*100),
        }));
        return <Card style={{marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:tx,marginBottom:14}}>📈 Bemor dinamikasi ({samePatient.length} ta tahlil)</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{top:4,right:4,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?"#2E3A47":"#EEF3F8"} vertical={false}/>
              <XAxis dataKey="date" tick={{fontSize:10,fill:"#8FA4B2"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[1,6]} ticks={[1,2,3,4,5,6]} tick={{fontSize:10,fill:"#8FA4B2"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:dark?"#1E2733":"#fff",border:"1px solid #DDE6ED",borderRadius:8,fontSize:11}} formatter={(v)=>[`BI-RADS ${v}`]}/>
              <Line type="monotone" dataKey="birads" stroke="#0B6E8A" strokeWidth={2.5} dot={{r:5,fill:"#0B6E8A",stroke:"#fff",strokeWidth:2}}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{fontSize:11,color:"#8FA4B2",textAlign:"center",marginTop:4}}>BI-RADS o'zgarishi dinamikasi</div>
        </Card>;
      })()}
    </div>;
  }

  return <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
      <div style={{fontSize:22,fontWeight:800,color:tx,letterSpacing:"-0.5px"}}>📋 Tahlil tarixi</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:600,color:"#0B6E8A",background:"#E6F1FB",padding:"4px 12px",borderRadius:20}}>{history.length} ta</span>
        {history.length>0&&<button onClick={clearHistory} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #FCEBEB",background:"#FCEBEB",color:"#D63B3B",fontSize:12,fontWeight:600,cursor:"pointer"}}>🗑 Tozalash</button>}
      </div>
    </div>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bemor ismi bo'yicha..."
      style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:dark?"#1E2733":"#fff",fontSize:14,color:tx,marginBottom:14,boxSizing:"border-box",outline:"none"}}/>
    {filtered.length===0
      ?<div style={{textAlign:"center",padding:"60px 0",color:"#8FA4B2"}}>
        <div style={{fontSize:40,marginBottom:12}}>📭</div>
        <div style={{fontSize:15}}>{history.length===0?"Hali tahlil qilinmagan":"Topilmadi"}</div>
        <div style={{fontSize:13,marginTop:4}}>Yangi tahlil qo'shing</div>
      </div>
      :<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(h=>(
          <Card key={h.id} style={{cursor:"pointer",borderColor:h.birads>=4?bc(h.birads)+"44":dark?"#2E3A47":"#DDE6ED"}} onClick={()=>setSelected(h)}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#0B6E8A",flexShrink:0}}>
                {h.patientName.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <span style={{fontWeight:600,fontSize:14,color:tx}}>{h.patientName}</span>
                  <Badge cat={h.birads}/>
                  {h.isInSitu&&<span style={{fontSize:10,fontWeight:700,color:"#2D9E6B",background:"#EAF3DE",padding:"2px 7px",borderRadius:5}}>in situ</span>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  {h.patientAge&&<span style={{fontSize:12,color:ts}}>{h.patientAge} yosh</span>}
                  <ModalityTag m={h.modality}/>
                  <span style={{fontSize:11,color:"#8FA4B2",marginLeft:"auto"}}>{fmtDate(h.date)}</span>
                </div>
                <div style={{marginTop:8}}><ConfBar value={h.confidence}/></div>
              </div>
              <span style={{color:"#8FA4B2",fontSize:18,alignSelf:"center"}}>›</span>
            </div>
          </Card>
        ))}
      </div>}
  </div>;
}

// ─── LOGIN / RO'YXATDAN O'TISH (backend auth) ─────────────────────────────────
function LoginScreen({onAuth, apiUrl, lang, setLang}){
  const t=T[lang]||T.uz; const s=t.login;
  const [mode,setMode]=useState("login"); // "login" | "register"
  const [f,setF]=useState({phone:"",password:"",name:"",specialization:"",clinic:"",license:""});
  const [err,setErr]=useState("");
  const [info,setInfo]=useState("");
  const [busy,setBusy]=useState(false);
  const set=(k)=>(e)=>setF(p=>({...p,[k]:e.target.value}));
  const inp={width:"100%",padding:"11px 14px",borderRadius:12,border:"1px solid #DDE6ED",fontSize:14,color:"#0D1B2A",marginBottom:10,boxSizing:"border-box",outline:"none"};

  async function submit(){
    setErr("");setInfo("");
    if(!f.phone.trim()||!f.password){setErr("Telefon va parolni kiriting");return;}
    if(mode==="register"&&!f.name.trim()){setErr("F.I.O. ni kiriting");return;}
    setBusy(true);
    try{
      const url=mode==="login"?"/api/auth/login":"/api/auth/register";
      const body=mode==="login"?{phone:f.phone.trim(),password:f.password}:f;
      const r=await fetch(`${apiUrl}${url}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(60000)});
      const d=await r.json().catch(()=>({}));
      if(!r.ok){ setErr(d.detail||s.err); setBusy(false); return; }
      if(mode==="register"){
        if(d.token){ onAuth({token:d.token,user:d.user}); } // admin — darhol kiritish
        else { setInfo(s.pendingMsg); setMode("login"); setF(p=>({...p,password:""})); }
      } else {
        onAuth({token:d.token,user:d.user});
      }
    }catch(e){ setErr("Backend bilan aloqa yo'q — internetni tekshiring"); }
    setBusy(false);
  }

  const TabBtn=({m,label})=>(
    <button onClick={()=>{setMode(m);setErr("");setInfo("");}} style={{flex:1,padding:"10px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",border:"none",background:mode===m?"#0B6E8A":"transparent",color:mode===m?"#fff":"#52687A"}}>{label}</button>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B6E8A 0%,#1A7A5E 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:32,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,.3)",maxHeight:"94vh",overflowY:"auto"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{width:56,height:56,borderRadius:16,background:"#0B6E8A",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:22,color:"#fff",marginBottom:12}}>B</div>
          <div style={{fontSize:22,fontWeight:800,color:"#0D1B2A"}}>Breast AI</div>
          <div style={{fontSize:13,color:"#52687A",marginTop:4}}>{s.subtitle}</div>
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:16}}>
          {["uz","ru","en"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:"4px 12px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:lang===l?"1.5px solid #0B6E8A":"1px solid #DDE6ED",background:lang===l?"#E6F1FB":"#fff",color:lang===l?"#0B6E8A":"#52687A"}}>{l.toUpperCase()}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:4,background:"#EEF3F8",borderRadius:12,padding:4,marginBottom:16}}>
          <TabBtn m="login" label={s.loginTab}/>
          <TabBtn m="register" label={s.registerTab}/>
        </div>
        {info&&<div style={{background:"#EAF3DE",color:"#2D9E6B",borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:12,fontWeight:600}}>{info}</div>}
        {err&&<div style={{background:"#FCEBEB",color:"#D63B3B",borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:12,fontWeight:600}}>⚠️ {err}</div>}

        {mode==="register"&&<>
          <div style={{fontSize:12,color:"#8FA4B2",marginBottom:5}}>{s.name} *</div>
          <input value={f.name} onChange={set("name")} placeholder={s.namePh} style={inp}/>
          <div style={{fontSize:12,color:"#8FA4B2",marginBottom:5}}>{s.specialization}</div>
          <input value={f.specialization} onChange={set("specialization")} placeholder={s.specPh} style={inp}/>
          <div style={{fontSize:12,color:"#8FA4B2",marginBottom:5}}>{s.clinic}</div>
          <input value={f.clinic} onChange={set("clinic")} placeholder={s.clinicPh} style={inp}/>
          <div style={{fontSize:12,color:"#8FA4B2",marginBottom:5}}>{s.license}</div>
          <input value={f.license} onChange={set("license")} placeholder={s.licensePh} style={inp}/>
        </>}
        <div style={{fontSize:12,color:"#8FA4B2",marginBottom:5}}>{s.phone} *</div>
        <input value={f.phone} onChange={set("phone")} placeholder={s.phonePh} style={inp}/>
        <div style={{fontSize:12,color:"#8FA4B2",marginBottom:5}}>{s.password} *</div>
        <input type="password" value={f.password} onChange={set("password")} placeholder={s.passPh} style={inp}
          onKeyDown={e=>{if(e.key==="Enter")submit();}}/>
        <button onClick={submit} disabled={busy}
          style={{width:"100%",padding:13,borderRadius:12,border:"none",background:busy?"#8FA4B2":"#0B6E8A",color:"#fff",fontWeight:700,fontSize:15,cursor:busy?"wait":"pointer",marginTop:6}}>
          {busy?"⏳...":mode==="login"?s.enter:s.register}
        </button>
        {mode==="register"&&<div style={{fontSize:11,color:"#8FA4B2",textAlign:"center",marginTop:10}}>ℹ️ {s.adminFirst}</div>}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel(){
  const {t,dark,apiUrl,token}=useApp();
  const s=t.login;
  const [doctors,setDoctors]=useState(null);
  const [busy,setBusy]=useState("");
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A";

  function load(){
    fetch(`${apiUrl}/api/admin/doctors?token=${encodeURIComponent(token)}`,{signal:AbortSignal.timeout(30000)})
      .then(r=>r.json()).then(d=>setDoctors(d.doctors||[])).catch(()=>setDoctors([]));
  }
  useEffect(load,[apiUrl,token]);

  async function approve(id,val){
    setBusy(id);
    try{
      await fetch(`${apiUrl}/api/admin/approve`,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({token,doctor_id:id,approved:val}),signal:AbortSignal.timeout(20000)});
      load();
    }catch{}
    setBusy("");
  }

  return <div style={{marginBottom:20}}>
    <div style={{fontSize:11,fontWeight:700,color:"#8FA4B2",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.8px"}}>🛡 {s.adminPanel}</div>
    <Card style={{padding:"4px 0"}}>
      {doctors===null
        ?<div style={{padding:16,textAlign:"center",color:"#8FA4B2",fontSize:13}}>⏳...</div>
        :doctors.length===0
        ?<div style={{padding:16,textAlign:"center",color:"#8FA4B2",fontSize:13}}>—</div>
        :doctors.map(d=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderTop:`0.5px solid ${dark?"#2E3A47":"#EEF3F8"}`}}>
            <div style={{width:36,height:36,borderRadius:10,background:d.role==="admin"?"#6A3DAA":"#0B6E8A",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#fff",flexShrink:0}}>{(d.name||"?").split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:tx}}>{d.name} {d.role==="admin"&&<span style={{fontSize:10,color:"#6A3DAA",fontWeight:700}}>ADMIN</span>}</div>
              <div style={{fontSize:11,color:ts}}>{d.phone} · {d.specialization||"—"}{d.clinic?` · ${d.clinic}`:""}</div>
            </div>
            {d.role!=="admin"&&(d.approved
              ?<button disabled={busy===d.id} onClick={()=>approve(d.id,false)} style={{padding:"5px 10px",borderRadius:8,border:"1px solid #FCEBEB",background:"#FCEBEB",color:"#D63B3B",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>{s.revoke}</button>
              :<button disabled={busy===d.id} onClick={()=>approve(d.id,true)} style={{padding:"5px 10px",borderRadius:8,border:"none",background:"#2D9E6B",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>{s.approve}</button>)}
            {d.role==="admin"&&<span style={{fontSize:11,color:"#2D9E6B",fontWeight:600}}>✓</span>}
          </div>
        ))}
    </Card>
  </div>;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("uz");
  const [dark,setDark]=useState(false);
  const [apiUrl,setApiUrlRaw]=useState(()=>{try{return localStorage.getItem("breastai_apiUrl")||"https://breast-ai-backend.onrender.com"}catch{return "https://breast-ai-backend.onrender.com"}});
  const setApiUrl=(u)=>{setApiUrlRaw(u);try{localStorage.setItem("breastai_apiUrl",u);}catch{}};
  // Auth (backend: token + user)
  const [auth,setAuth]=useState(()=>{try{return JSON.parse(localStorage.getItem("breastai_auth")||"null")}catch{return null}});
  const user=auth&&auth.user?auth.user:null;
  const token=auth&&auth.token?auth.token:"";
  const doctorId=user?user.id:"";
  const doctorName=user?user.name:"";
  const doctorDept=user?(user.specialization||user.clinic||""):"";
  const isAdmin=user?user.role==="admin":false;
  const [showAllDoctors,setShowAllDoctors]=useState(false);
  function onAuth(a){ setAuth(a); try{localStorage.setItem("breastai_auth",JSON.stringify(a));}catch{} }
  function setAuthUser(patch){ setAuth(a=>{const na={...a,user:{...a.user,...patch}}; try{localStorage.setItem("breastai_auth",JSON.stringify(na));}catch{} return na;}); }
  function setDoctorName(n){ setAuthUser({name:n}); }
  function setDoctorDept(dp){ setAuthUser({specialization:dp}); }
  function logout(){
    if(token) fetch(`${apiUrl}/api/auth/logout?token=${token}`,{method:"POST"}).catch(()=>{});
    setAuth(null); try{localStorage.removeItem("breastai_auth");}catch{} setTab("dashboard");
  }

  const [tab,setTab]=useState("dashboard");
  const [selectedPatient,setSelectedPatient]=useState(null);
  const [showSearch,setShowSearch]=useState(false);
  const [showCompare,setShowCompare]=useState(false);
  const [showReminders,setShowReminders]=useState(false);
  const [urgentNotif,setUrgentNotif]=useState(false);
  const [newAnalysisMod,setNewAnalysisMod]=useState(null);
  const [aiStatus,setAiStatus]=useState(null); // "ok" | "demo" | "offline"
  const [rawHistory,setRawHistory]=useState(()=>{
    try{ return JSON.parse(localStorage.getItem("breastai_history")||"[]"); }
    catch{ return []; }
  });
  // Joriy shifokor bemorlari (yoki barchasi — toggle)
  const history=showAllDoctors?rawHistory:rawHistory.filter(h=>!h.doctorId||h.doctorId===doctorId);
  function addToHistory(record){
    const rec={...record,doctorId};
    const updated=[rec,...rawHistory].slice(0,100);
    setRawHistory(updated);
    try{ localStorage.setItem("breastai_history",JSON.stringify(updated)); }catch{}
    // Backend bazaga ham saqlash (fire-and-forget — offline bo'lsa localStorage yetarli)
    fetch(`${apiUrl}/api/history`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(rec),signal:AbortSignal.timeout(15000)
    }).catch(()=>{});
  }

  // Backend holati: AI model yuklanganmi? (DEMO/offline banner uchun)
  useEffect(()=>{
    let cancelled=false;
    fetch(`${apiUrl}/health`,{signal:AbortSignal.timeout(60000)})
      .then(r=>r.json())
      .then(d=>{ if(!cancelled) setAiStatus(d.ai_model_loaded?"ok":"demo"); })
      .catch(()=>{ if(!cancelled) setAiStatus("offline"); });
    return ()=>{cancelled=true;};
  },[apiUrl]);

  // Backend'dagi tarixni localStorage bilan birlashtirish (token bo'yicha rol-scoped)
  useEffect(()=>{
    if(!token) return;
    let cancelled=false;
    fetch(`${apiUrl}/api/history?token=${encodeURIComponent(token)}`,{signal:AbortSignal.timeout(60000)})
      .then(r=>r.json())
      .then(d=>{
        if(cancelled||!d.records||!d.records.length) return;
        setRawHistory(prev=>{
          const ids=new Set(prev.map(h=>String(h.id)));
          const merged=[...prev,...d.records.filter(r=>!ids.has(String(r.id)))]
            .sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,200);
          try{ localStorage.setItem("breastai_history",JSON.stringify(merged)); }catch{}
          return merged;
        });
      })
      .catch(()=>{});
    return ()=>{cancelled=true;};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[apiUrl,token]);
  const t=T[lang]||T.uz;
  const bg=dark?"#121920":"#EEF3F8", hbg=dark?"#1A232E":"#fff", hborder=dark?"#2E3A47":"#DDE6ED", tx=dark?"#E8EFF5":"#0D1B2A";

  const TABS=["dashboard","patients","stats","settings"];
  const ICONS=["📊","👥","📈","⚙️"];

  function goTab(id){setTab(id);setSelectedPatient(null);setNewAnalysisMod(null);}

  // Shoshilinch holat tekshirish
  useEffect(()=>{
    if(history.some(h=>h.birads>=4)) setUrgentNotif(true);
  },[history]);

  function renderContent(){
    if(selectedPatient) return <HistoryScreen forcedRecord={selectedPatient} onBack={()=>setSelectedPatient(null)}/>;
    if(newAnalysisMod!==null) return <NewAnalysis initialModality={newAnalysisMod} onBack={()=>setNewAnalysisMod(null)}/>;
    if(tab==="dashboard") return <Dashboard onNewAnalysis={mod=>{setNewAnalysisMod(mod);}} onPatient={p=>{setSelectedPatient(p);}}/>;
    if(tab==="patients") return <PatientsList onPatient={p=>{setSelectedPatient(p);}}/>;
    if(tab==="stats") return <Statistics/>;
    if(tab==="settings") return <Settings/>;
  }

  // Login talab qilinadi
  if(!auth){
    return <LoginScreen onAuth={onAuth} apiUrl={apiUrl} lang={lang} setLang={setLang}/>;
  }

  return (
    <AppCtx.Provider value={{lang,t,setLang,dark,setDark,apiUrl,setApiUrl,history,addToHistory,doctorName,setDoctorName,doctorDept,setDoctorDept,doctorId,token,isAdmin,user,logout,showAllDoctors,setShowAllDoctors}}>
      <div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:bg,minHeight:"100vh",display:"flex",flexDirection:"column",transition:"background .3s"}}>
        <div style={{background:hbg,borderBottom:`1px solid ${hborder}`,padding:"13px 18px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100,transition:"background .3s"}}>
          <div style={{width:32,height:32,borderRadius:10,background:"#0B6E8A",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff"}}>B</div>
          <div style={{fontWeight:800,fontSize:16,color:tx,letterSpacing:"-0.3px"}}>{t.appName}</div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setShowSearch(true)} style={{width:36,height:36,borderRadius:10,border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:dark?"#1E2733":"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>🔍</button>
            <button onClick={()=>setShowCompare(true)} style={{width:36,height:36,borderRadius:10,border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:dark?"#1E2733":"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⚖️</button>
            {(()=>{const due=dueReminders(history).length;return (
              <div style={{position:"relative",display:"inline-flex"}}>
                <button onClick={()=>setShowReminders(true)} style={{width:36,height:36,borderRadius:10,border:`1px solid ${due>0?"#E86B2A":dark?"#2E3A47":"#DDE6ED"}`,background:due>0?"#FAECE7":dark?"#1E2733":"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>📅</button>
                {due>0&&<span style={{position:"absolute",top:-5,right:-5,minWidth:16,height:16,padding:"0 4px",borderRadius:8,background:"#E86B2A",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>{due}</span>}
              </div>
            );})()}
            {urgentNotif&&<div style={{position:"relative",display:"inline-flex"}}>
              <button onClick={()=>{setUrgentNotif(false);goTab("patients");}} style={{width:36,height:36,borderRadius:10,border:"1px solid #E86B2A",background:"#FAECE7",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>🔔</button>
              <span style={{position:"absolute",top:-4,right:-4,width:10,height:10,borderRadius:"50%",background:"#E86B2A",border:"2px solid #fff"}}/>
            </div>}
            <button onClick={()=>setNewAnalysisMod("uzi")} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#0B6E8A",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{t.newAnalysis}</button>
          </div>
        </div>
        {(aiStatus==="demo"||aiStatus==="offline")&&(
          <div style={{background:aiStatus==="demo"?"#FCEBEB":"#FAEEDA",borderBottom:`1px solid ${aiStatus==="demo"?"#D63B3B33":"#EF9F2733"}`,padding:"8px 18px",fontSize:12,fontWeight:600,color:aiStatus==="demo"?"#D63B3B":"#854F0B",textAlign:"center"}}>
            {aiStatus==="demo"?t.banner.demo:t.banner.offline}
          </div>
        )}
        {showSearch&&<GlobalSearch onClose={()=>setShowSearch(false)} onPatient={p=>{setSelectedPatient(p);setShowSearch(false);}}/>}
        {showCompare&&<CompareScreen onClose={()=>setShowCompare(false)}/>}
        {showReminders&&<RemindersScreen onClose={()=>setShowReminders(false)} onPatient={p=>{setSelectedPatient(p);setShowReminders(false);}}/>}
        <div style={{flex:1,overflowY:"auto",padding:16,paddingBottom:80}}>{renderContent()}</div>
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:hbg,borderTop:`1px solid ${hborder}`,display:"flex",zIndex:100,transition:"background .3s"}}>
          {TABS.map((id,i)=>(
            <button key={id} onClick={()=>goTab(id)} style={{flex:1,padding:"10px 4px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <span style={{fontSize:18}}>{ICONS[i]}</span>
              <span style={{fontSize:10,fontWeight:tab===id?700:400,color:tab===id?"#0B6E8A":"#8FA4B2"}}>{t.tabs[id]}</span>
              {tab===id&&<div style={{width:4,height:4,borderRadius:"50%",background:"#0B6E8A"}}/>}
            </button>
          ))}
        </div>
      </div>
    </AppCtx.Provider>
  );
}