import { useState, createContext, useContext, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  uz: {
    appName:"Breast AI", appSub:"Multimodal diagnostika tizimi", newAnalysis:"+ Yangi tahlil", back:"← Orqaga",
    tabs:{ dashboard:"Dashboard", patients:"Bemorlar", history:"Tarix", stats:"Statistika", settings:"Sozlamalar" },
    dash:{ totalPatients:"Jami bemorlar", urgent:"Shoshilinch", inSitu:"In situ aniqlangan", aiConf:"AI ishonch", thisMonth:"Bu oy", biRads46:"BI-RADS 4–6", upTo10mm:"≤10mm", avg:"O'rtacha", quickAnalysis:"Tezkor tahlil", recentPatients:"So'nggi bemorlar" },
    modality:{ uzi:"UZI", mammo:"Mammo", combined:"Kombinatsiya" },
    patients:{ title:"Bemorlar", search:"Ism bo'yicha qidirish...", sortDate:"Sana", sortBiRads:"BI-RADS", sortName:"Ism", clear:"✕ Tozalash", notFound:"Bemor topilmadi", changeFilter:"Qidiruv yoki filtrni o'zgartiring" },
    detail:{ back:"← Orqaga", aiResult:"AI tahlil natijasi", riskProb:"xavf ehtimoli", uziFindings:"UZI topilmalari", mammoFindings:"Mammografiya topilmalari", aiSummary:"AI xulosasi", size:"O'lcham", shape:"Shakl", margin:"Chegara", echo:"Echogenlik", posterior:"Orqa akustika", orientation:"Orientasiya", location:"Joylashuv", density:"Zichlik", calcification:"Mikrokalsifikat", distortion:"Arxitektura buzilishi", asymmetry:"Asimmetriya", present:"✓ Mavjud", absent:"Yo'q", pdfExport:"📄 PDF hisobot", addAnalysis:"Yangi tahlil", inSituLabel:"In situ ehtimoli", recommendations:"Tavsiyalar", rec1:"Onkolog konsultatsiyasi", rec2:"Yadro biopsiyasi", rec3:"6 oyda kuzatuv", close:"Yopish" },
    birads:{ 1:{label:"Negativ",rec:"Muntazam skrining"}, 2:{label:"Xavfsiz",rec:"1–2 yilda 1 marta"}, 3:{label:"Ehtimol xavfsiz",rec:"6 oyda UZI"}, 4:{label:"Shubhali",rec:"Biopsi tavsiya etiladi"}, 5:{label:"Xavfli",rec:"Biopsi zarur"}, 6:{label:"Tasdiqlangan",rec:"Onkolog ko'rigi"} },
    newAnal:{ title:"Yangi tahlil", type:"Tahlil turi", uploadLabel:"DICOM yoki JPG/PNG yuklang", uploadSub:"yoki kamerani oching", uziFeatures:"UZI xususiyatlari", mammoFeatures:"Mammografiya xususiyatlari", size:"O'lcham", shape:"Shakl", echo:"Echogenlik", posterior:"Orqa akustika", orientation:"Orientasiya", density:"To'qima zichligi", calcification:"Mikrokalsifikatlar", distortion:"Arxitektura buzilishi", shapes:[["oval","Oval"],["lobular","Lobular"],["irregular","Notekis"],["spiculated","Spikula"]], echos:[["anechoic","Anechogen"],["hypoechoic","Gipoechogen"],["isoechoic","Izoechogen"],["hyperechoic","Giperechogen"]], posteriors:[["enhancement","Kuchayish"],["shadowing","Soya"],["none","O'zgarishsiz"]], orientations:[["parallel","Parallel"],["not_parallel","Vertikal"]], resultLabel:"AI tahlil natijasi", inSituNote:"In situ ehtimoli: o'lcham ≤10mm", btnStart:"✨ AI tahlil boshlash", btnRetry:"🔄 Qayta tahlil", btnLoading:"⏳ Tahlil qilinmoqda..." },
    stats:{ title:"Statistika", totalAnalyses:"Jami tahlil", aiConf:"AI ishonch", urgentCases:"Shoshilinch", biRadsDist:"BI-RADS taqsimoti", modality:"Tahlil modalligi", confLevel:"AI ishonch darajasi", inSituTitle:"In situ aniqlash (≤10mm)", inSituDesc:"bemorlar in situ bosqichida aniqlandi.", inSituEffect:"Erta aniqlash — 5 yillik omon qolish darajasini 95% gacha oshiradi.", downloadCsv:"📥 CSV yuklab olish", downloadPdf:"📄 PDF hisobot" },
    settings:{ title:"Sozlamalar", editProfile:"Tahrirlash", save:"Saqlash", cancel:"Bekor", namePlaceholder:"F.I.O.", deptPlaceholder:"Bo'lim nomi", sectionApp:"Ilova", sectionModel:"AI Model", sectionData:"Ma'lumotlar", sectionAbout:"Ilova haqida", notif:"Bildirishnomalar", autoAnalysis:"Avtomat tahlil", darkMode:"Qorong'i rejim", lang:"Til", modelVersion:"Model versiyasi", apiEndpoint:"API endpoint", backendStatus:"Backend holati", checkApi:"Tekshirish", checking:"⏳ Tekshirilmoqda...", connected:"✓ Ulangan", notConnected:"✗ Ulanmadi", pdfReport:"PDF hisobot", backup:"Zaxiralash", clearCache:"Keshni tozalash", export:"Eksport", backupSave:"Saqlash", clear:"Tozalash", version:"Versiya", license:"Litsenziya", report:"Muammo bildirish", send:"Yuborish", licenseVal:"Tadqiqot maqsadida", disclaimer:"⚠️ Bu ilova faqat tadqiqot maqsadida. Klinik qarorlar uchun mutaxassis ko'rigi zarur.", toastNotifOn:"Bildirishnomalar yoqildi ✓", toastNotifOff:"O'chirildi", toastAutoOn:"Avtomat tahlil yoqildi ✓", toastAutoOff:"O'chirildi", toastDark:"Qorong'i rejim o'zgartirildi ✓", toastSaved:"Profil saqlandi ✓", toastApi:"Endpoint saqlandi ✓", toastBackend:"Backend ulanmadi — mock rejim", toastPdf:"PDF hisobot tayyorlanmoqda...", toastCache:"Kesh tozalandi ✓", toastBackup:"Zaxira yaratildi ✓", toastReport:"Yuborildi! Rahmat ✓", toastLang:"Til o'zgartirildi ✓", pdfModalTitle:"PDF Hisobot", pdfModalDesc:"Barcha bemorlar ma'lumotlari PDF formatda yuklab olinadi.", pdfGenerate:"PDF Yaratish", backupModalTitle:"Ma'lumotlarni Zaxiralash", backupModalDesc:"Barcha tahlil natijalari JSON formatda saqlangan.", backupDownload:"JSON Yuklab olish", reportModalTitle:"Muammo Bildirish", reportModalDesc:"Muammoni ta'riflab yozing — tezda ko'rib chiqamiz.", reportPlaceholder:"Muammo ta'rifi...", reportSend:"Yuborish", close:"Yopish" },
    aiConf:"AI ishonch", inSituBadge:"in situ", age:"yosh",
  },
  ru: {
    appName:"Breast AI", appSub:"Мультимодальная диагностика", newAnalysis:"+ Новый анализ", back:"← Назад",
    tabs:{ dashboard:"Главная", patients:"Пациенты", history:"История", stats:"Статистика", settings:"Настройки" },
    dash:{ totalPatients:"Всего пациентов", urgent:"Срочные", inSitu:"Выявлено in situ", aiConf:"Точность ИИ", thisMonth:"За месяц", biRads46:"BI-RADS 4–6", upTo10mm:"≤10мм", avg:"Среднее", quickAnalysis:"Быстрый анализ", recentPatients:"Последние пациенты" },
    modality:{ uzi:"УЗИ", mammo:"Маммо", combined:"Комбинация" },
    patients:{ title:"Пациенты", search:"Поиск по имени...", sortDate:"Дата", sortBiRads:"BI-RADS", sortName:"Имя", clear:"✕ Сбросить", notFound:"Пациент не найден", changeFilter:"Измените запрос или фильтр" },
    detail:{ back:"← Назад", aiResult:"Результат ИИ", riskProb:"вероятность риска", uziFindings:"Данные УЗИ", mammoFindings:"Данные маммографии", aiSummary:"Заключение ИИ", size:"Размер", shape:"Форма", margin:"Край", echo:"Эхогенность", posterior:"Задн. акустика", orientation:"Ориентация", location:"Расположение", density:"Плотность", calcification:"Кальцификаты", distortion:"Архит. нарушение", asymmetry:"Асимметрия", present:"✓ Есть", absent:"Нет", pdfExport:"📄 PDF отчёт", addAnalysis:"Добавить анализ", inSituLabel:"Вероятность in situ", recommendations:"Рекомендации", rec1:"Консультация онколога", rec2:"Биопсия", rec3:"Контроль через 6 мес.", close:"Закрыть" },
    birads:{ 1:{label:"Негатив",rec:"Плановый скрининг"}, 2:{label:"Безопасно",rec:"1 раз в 1–2 года"}, 3:{label:"Вероятно безопасно",rec:"УЗИ через 6 мес."}, 4:{label:"Подозрительно",rec:"Рекомендуется биопсия"}, 5:{label:"Опасно",rec:"Биопсия обязательна"}, 6:{label:"Подтверждено",rec:"Консультация онколога"} },
    newAnal:{ title:"Новый анализ", type:"Тип анализа", uploadLabel:"Загрузите DICOM или JPG/PNG", uploadSub:"или откройте камеру", uziFeatures:"Параметры УЗИ", mammoFeatures:"Параметры маммографии", size:"Размер", shape:"Форма", echo:"Эхогенность", posterior:"Задн. акустика", orientation:"Ориентация", density:"Плотность ткани", calcification:"Кальцификаты", distortion:"Архит. нарушение", shapes:[["oval","Овал"],["lobular","Дольчатый"],["irregular","Неправильный"],["spiculated","Спикулы"]], echos:[["anechoic","Анэхогенный"],["hypoechoic","Гипоэхогенный"],["isoechoic","Изоэхогенный"],["hyperechoic","Гиперэхогенный"]], posteriors:[["enhancement","Усиление"],["shadowing","Тень"],["none","Без изменений"]], orientations:[["parallel","Параллельная"],["not_parallel","Вертикальная"]], resultLabel:"Результат ИИ", inSituNote:"Вероятность in situ: размер ≤10мм", btnStart:"✨ Запустить анализ", btnRetry:"🔄 Повторить", btnLoading:"⏳ Анализируется..." },
    stats:{ title:"Статистика", totalAnalyses:"Всего анализов", aiConf:"Точность ИИ", urgentCases:"Срочные", biRadsDist:"Распределение BI-RADS", modality:"Тип анализа", confLevel:"Точность ИИ", inSituTitle:"Выявление in situ (≤10мм)", inSituDesc:"пациентов выявлены на стадии in situ.", inSituEffect:"Раннее выявление повышает 5-летнюю выживаемость до 95%.", downloadCsv:"📥 Скачать CSV", downloadPdf:"📄 PDF отчёт" },
    settings:{ title:"Настройки", editProfile:"Изменить", save:"Сохранить", cancel:"Отмена", namePlaceholder:"Ф.И.О.", deptPlaceholder:"Отдел", sectionApp:"Приложение", sectionModel:"ИИ Модель", sectionData:"Данные", sectionAbout:"О приложении", notif:"Уведомления", autoAnalysis:"Авто-анализ", darkMode:"Тёмная тема", lang:"Язык", modelVersion:"Версия модели", apiEndpoint:"API эндпоинт", backendStatus:"Статус бэкенда", checkApi:"Проверить", checking:"⏳ Проверка...", connected:"✓ Подключено", notConnected:"✗ Нет связи", pdfReport:"PDF отчёт", backup:"Резервная копия", clearCache:"Очистить кэш", export:"Экспорт", backupSave:"Сохранить", clear:"Очистить", version:"Версия", license:"Лицензия", report:"Сообщить об ошибке", send:"Отправить", licenseVal:"Для исследований", disclaimer:"⚠️ Только для исследовательских целей. Клинические решения требуют консультации специалиста.", toastNotifOn:"Уведомления включены ✓", toastNotifOff:"Отключено", toastAutoOn:"Авто-анализ включён ✓", toastAutoOff:"Отключено", toastDark:"Тёмная тема изменена ✓", toastSaved:"Профиль сохранён ✓", toastApi:"Эндпоинт сохранён ✓", toastBackend:"Бэкенд недоступен — режим mock", toastPdf:"Подготовка PDF...", toastCache:"Кэш очищен ✓", toastBackup:"Копия создана ✓", toastReport:"Отправлено! Спасибо ✓", toastLang:"Язык изменён ✓", pdfModalTitle:"PDF Отчёт", pdfModalDesc:"Данные всех пациентов будут экспортированы в PDF.", pdfGenerate:"Создать PDF", backupModalTitle:"Резервная копия", backupModalDesc:"Все результаты анализов сохранены в формате JSON.", backupDownload:"Скачать JSON", reportModalTitle:"Сообщить об ошибке", reportModalDesc:"Опишите проблему — мы рассмотрим её в ближайшее время.", reportPlaceholder:"Описание проблемы...", reportSend:"Отправить", close:"Закрыть" },
    aiConf:"Точность ИИ", inSituBadge:"in situ", age:"лет",
  },
  en: {
    appName:"Breast AI", appSub:"Multimodal Diagnostic System", newAnalysis:"+ New Analysis", back:"← Back",
    tabs:{ dashboard:"Dashboard", patients:"Patients", history:"History", stats:"Statistics", settings:"Settings" },
    dash:{ totalPatients:"Total Patients", urgent:"Urgent Cases", inSitu:"In Situ Detected", aiConf:"AI Confidence", thisMonth:"This Month", biRads46:"BI-RADS 4–6", upTo10mm:"≤10mm", avg:"Average", quickAnalysis:"Quick Analysis", recentPatients:"Recent Patients" },
    modality:{ uzi:"Ultrasound", mammo:"Mammography", combined:"Combined" },
    patients:{ title:"Patients", search:"Search by name...", sortDate:"Date", sortBiRads:"BI-RADS", sortName:"Name", clear:"✕ Clear", notFound:"No patients found", changeFilter:"Change your search or filter" },
    detail:{ back:"← Back", aiResult:"AI Analysis Result", riskProb:"malignancy risk", uziFindings:"Ultrasound Findings", mammoFindings:"Mammography Findings", aiSummary:"AI Summary", size:"Size", shape:"Shape", margin:"Margin", echo:"Echogenicity", posterior:"Posterior Feature", orientation:"Orientation", location:"Location", density:"Density", calcification:"Calcification", distortion:"Arch. Distortion", asymmetry:"Asymmetry", present:"✓ Present", absent:"Absent", pdfExport:"📄 Export PDF", addAnalysis:"New Analysis", inSituLabel:"In situ probability", recommendations:"Recommendations", rec1:"Oncology consultation", rec2:"Core needle biopsy", rec3:"Follow-up in 6 months", close:"Close" },
    birads:{ 1:{label:"Negative",rec:"Routine screening"}, 2:{label:"Benign",rec:"Annual screening"}, 3:{label:"Probably Benign",rec:"6-month follow-up"}, 4:{label:"Suspicious",rec:"Biopsy recommended"}, 5:{label:"Highly Suspicious",rec:"Biopsy required"}, 6:{label:"Confirmed",rec:"Oncology referral"} },
    newAnal:{ title:"New Analysis", type:"Analysis Type", uploadLabel:"Upload DICOM or JPG/PNG", uploadSub:"or open camera", uziFeatures:"Ultrasound Features", mammoFeatures:"Mammography Features", size:"Size", shape:"Shape", echo:"Echogenicity", posterior:"Posterior Feature", orientation:"Orientation", density:"Tissue Density", calcification:"Calcifications", distortion:"Arch. Distortion", shapes:[["oval","Oval"],["lobular","Lobular"],["irregular","Irregular"],["spiculated","Spiculated"]], echos:[["anechoic","Anechoic"],["hypoechoic","Hypoechoic"],["isoechoic","Isoechoic"],["hyperechoic","Hyperechoic"]], posteriors:[["enhancement","Enhancement"],["shadowing","Shadowing"],["none","No change"]], orientations:[["parallel","Parallel"],["not_parallel","Vertical"]], resultLabel:"AI Analysis Result", inSituNote:"In situ probability: size ≤10mm", btnStart:"✨ Start AI Analysis", btnRetry:"🔄 Re-analyse", btnLoading:"⏳ Analysing..." },
    stats:{ title:"Statistics", totalAnalyses:"Total Analyses", aiConf:"AI Confidence", urgentCases:"Urgent", biRadsDist:"BI-RADS Distribution", modality:"Analysis Modality", confLevel:"AI Confidence Level", inSituTitle:"In Situ Detection (≤10mm)", inSituDesc:"patients detected at in situ stage.", inSituEffect:"Early detection raises 5-year survival to 95%.", downloadCsv:"📥 Download CSV", downloadPdf:"📄 PDF Report" },
    settings:{ title:"Settings", editProfile:"Edit", save:"Save", cancel:"Cancel", namePlaceholder:"Full name", deptPlaceholder:"Department", sectionApp:"Application", sectionModel:"AI Model", sectionData:"Data", sectionAbout:"About", notif:"Notifications", autoAnalysis:"Auto Analysis", darkMode:"Dark Mode", lang:"Language", modelVersion:"Model Version", apiEndpoint:"API Endpoint", backendStatus:"Backend Status", checkApi:"Check", checking:"⏳ Checking...", connected:"✓ Connected", notConnected:"✗ Not Connected", pdfReport:"PDF Report", backup:"Backup", clearCache:"Clear Cache", export:"Export", backupSave:"Save", clear:"Clear", version:"Version", license:"License", report:"Report Issue", send:"Send", licenseVal:"For research purposes", disclaimer:"⚠️ For research purposes only. Clinical decisions require specialist consultation.", toastNotifOn:"Notifications enabled ✓", toastNotifOff:"Disabled", toastAutoOn:"Auto analysis enabled ✓", toastAutoOff:"Disabled", toastDark:"Dark mode toggled ✓", toastSaved:"Profile saved ✓", toastApi:"Endpoint saved ✓", toastBackend:"Backend unavailable — mock mode", toastPdf:"Preparing PDF...", toastCache:"Cache cleared ✓", toastBackup:"Backup created ✓", toastReport:"Sent! Thank you ✓", toastLang:"Language changed ✓", pdfModalTitle:"PDF Report", pdfModalDesc:"All patient data will be exported to PDF format.", pdfGenerate:"Generate PDF", backupModalTitle:"Data Backup", backupModalDesc:"All analysis results saved in JSON format.", backupDownload:"Download JSON", reportModalTitle:"Report Issue", reportModalDesc:"Describe the problem — we'll review it shortly.", reportPlaceholder:"Describe the issue...", reportSend:"Send", close:"Close" },
    aiConf:"AI Confidence", inSituBadge:"in situ", age:"yrs",
  }
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppCtx = createContext({ lang:"uz", t:T.uz, setLang:()=>{}, dark:false, setDark:()=>{}, apiUrl:"https://breast-ai-backend.onrender.com", setApiUrl:()=>{}, history:[], addToHistory:()=>{} });
function useApp(){ return useContext(AppCtx); }

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PATIENTS = [
  { id:"p001", name:"Nilufar Karimova", age:42, createdAt:"2025-05-10", doctor:"Dr. Azimov S.", clinic:"Respublika Onkologiya Markazi",
    analyses:[{ id:"a001", date:"2025-05-10", modality:"combined", birads:4, confidence:0.87, malignancyRisk:30,
      uzi:{ shape:"Notekis", margin:"Noaniq", echo:"Gipoechogen", posterior:"Akustik soya", orientation:"Vertikal", sizeA:8.4, sizeB:6.1 },
      mammo:{ density:"C", calcification:false, distortion:true, asymmetry:false, location:"O'ng, UIK, 10:00" },
      notes:"O'ng ko'krak, tashqi yuqori kvadrant. Gipoechogen o'choq, vertikal orientasiya." }]},
  { id:"p002", name:"Mohinur Yusupova", age:35, createdAt:"2025-05-12", doctor:"Dr. Rashidova M.", clinic:"Toshkent Tibbiyot Akademiyasi",
    analyses:[{ id:"a002", date:"2025-05-12", modality:"uzi", birads:2, confidence:0.94, malignancyRisk:0,
      uzi:{ shape:"Oval", margin:"Aniq", echo:"Anechogen", posterior:"Orqa kuchayish", orientation:"Parallel", sizeA:12.0, sizeB:9.5 },
      mammo:null, notes:"Chap ko'krak. Anechogen o'choq, tekis chegaralar — oddiy kista." }]},
  { id:"p003", name:"Sabohat Toshmatova", age:58, createdAt:"2025-05-13", doctor:"Dr. Nazarov K.", clinic:"Respublika Onkologiya Markazi",
    analyses:[{ id:"a003", date:"2025-05-13", modality:"mammo", birads:5, confidence:0.96, malignancyRisk:95,
      uzi:null, mammo:{ density:"B", calcification:true, distortion:true, asymmetry:true, location:"O'ng, sentral, 12:00" },
      notes:"O'ng ko'krak, sentral zona. Spikula chegarali massa, mikrokalsifikatlar bilan." }]},
  { id:"p004", name:"Gulnora Mirzaeva", age:47, createdAt:"2025-05-14", doctor:"Dr. Azimov S.", clinic:"Respublika Onkologiya Markazi",
    analyses:[{ id:"a004", date:"2025-05-14", modality:"combined", birads:3, confidence:0.81, malignancyRisk:2,
      uzi:{ shape:"Lobular", margin:"Aniq", echo:"Gipoechogen", posterior:"O'zgarishsiz", orientation:"Parallel", sizeA:7.2, sizeB:5.8 },
      mammo:{ density:"C", calcification:false, distortion:false, asymmetry:false, location:"Chap, UIK, 2:00" },
      notes:"Chap ko'krak. Lobular shakl, nisbatan aniq chegaralar. 6 oyda nazorat tavsiya etiladi." }]},
  { id:"p005", name:"Barno Ergasheva", age:51, createdAt:"2025-05-15", doctor:"Dr. Rashidova M.", clinic:"Toshkent Shahar Klinikasi",
    analyses:[{ id:"a005", date:"2025-05-15", modality:"uzi", birads:4, confidence:0.89, malignancyRisk:30,
      uzi:{ shape:"Notekis", margin:"Noaniq", echo:"Gipoechogen", posterior:"Akustik soya", orientation:"Vertikal", sizeA:9.1, sizeB:7.3 },
      mammo:null, notes:"O'ng ko'krak. 9mm gipoechogen o'choq, vertikal orientasiya — in situ ehtimoli yuqori." }]},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const BC={1:"#2D9E6B",2:"#2D9E6B",3:"#BA7517",4:"#E86B2A",5:"#D63B3B",6:"#8B1A1A"};
const BB={1:"#EAF3DE",2:"#EAF3DE",3:"#FAEEDA",4:"#FAECE7",5:"#FCEBEB",6:"#FCEBEB"};
const bc=(c)=>BC[c]||"#2D9E6B";
const bb=(c)=>BB[c]||"#EAF3DE";
const ini=(n)=>n.split(" ").map(w=>w[0]).slice(0,2).join("");
const inSitu=(u)=>u&&u.sizeA<=10&&u.sizeB<=10;
const fmtD=(d)=>{const m=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dt=new Date(d);return `${dt.getDate()} ${m[dt.getMonth()]}`;};
const mc=(m)=>m==="uzi"?"#0B6E8A":m==="mammo"?"#6A3DAA":"#1A7A5E";
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



// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Card({children,style={}}){
  const {dark}=useApp();
  return <div style={{background:dark?"#1E2733":"#fff",border:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,borderRadius:16,padding:18,...style}}>{children}</div>;
}
function Badge({cat}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",background:bb(cat),color:bc(cat),borderRadius:20,fontSize:11,fontWeight:600,border:`1px solid ${bc(cat)}33`}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:bc(cat),display:"inline-block"}}/>BI-RADS {cat}
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

// ─── PATIENT DETAIL ───────────────────────────────────────────────────────────
function PatientDetail({patient,onBack}){
  const {t,dark}=useApp();
  const a=patient.analyses[0];
  const bm=t.birads[a.birads]||t.birads[2];
  const color=bc(a.birads),bg=bb(a.birads);
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A", tb=dark?"#2E3A47":"#EEF3F8";
  const row=(k,v,red)=><div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`0.5px solid ${tb}`,fontSize:13}}><span style={{color:"#8FA4B2"}}>{k}</span><span style={{color:red?"#D63B3B":tx,fontWeight:500}}>{v}</span></div>;
  return <div>
    <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#0B6E8A",fontSize:13,fontWeight:600,marginBottom:18,padding:0}}>{t.detail.back}</button>
    <Card style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:56,height:56,borderRadius:16,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:"#0B6E8A",flexShrink:0}}>{ini(patient.name)}</div>
        <div><div style={{fontWeight:700,fontSize:17,color:tx}}>{patient.name}</div><div style={{fontSize:13,color:ts}}>{patient.age} {t.age}</div><div style={{fontSize:12,color:"#8FA4B2"}}>{patient.doctor} · {patient.clinic}</div></div>
      </div>
    </Card>
    <Card style={{marginBottom:14,background:bg,borderColor:color+"44"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:12,color:ts,marginBottom:6}}>{t.detail.aiResult} · <ModalityTag m={a.modality}/></div><Badge cat={a.birads}/><div style={{fontSize:13,color:ts,marginTop:6}}>{bm.rec}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:36,fontWeight:800,color,lineHeight:1}}>{a.malignancyRisk}%</div><div style={{fontSize:11,color:"#8FA4B2"}}>{t.detail.riskProb}</div></div>
      </div>
      <div style={{marginTop:14}}><ConfBar value={a.confidence}/></div>
      {inSitu(a.uzi)&&<div style={{marginTop:10,padding:"8px 12px",background:"#EAF3DE",borderRadius:8,fontSize:12,color:"#2D9E6B",fontWeight:600}}>🎯 {t.detail.inSituLabel}: {a.uzi.sizeA}×{a.uzi.sizeB}mm</div>}
    </Card>
    {a.uzi&&<Card style={{marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#0B6E8A",marginBottom:12}}>🌊 {t.detail.uziFindings}</div>
      {row(t.detail.size,`${a.uzi.sizeA} × ${a.uzi.sizeB} mm`)}
      {row(t.detail.shape,a.uzi.shape)}
      {row(t.detail.margin,a.uzi.margin)}
      {row(t.detail.echo,a.uzi.echo)}
      {row(t.detail.posterior,a.uzi.posterior)}
      {row(t.detail.orientation,a.uzi.orientation)}
    </Card>}
    {a.mammo&&<Card style={{marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#6A3DAA",marginBottom:12}}>🔬 {t.detail.mammoFindings}</div>
      {row(t.detail.location,a.mammo.location)}
      {row(t.detail.density,`BI-RADS ${a.mammo.density}`)}
      {row(t.detail.calcification,a.mammo.calcification?t.detail.present:t.detail.absent,a.mammo.calcification)}
      {row(t.detail.distortion,a.mammo.distortion?t.detail.present:t.detail.absent,a.mammo.distortion)}
      {row(t.detail.asymmetry,a.mammo.asymmetry?t.detail.present:t.detail.absent,a.mammo.asymmetry)}
    </Card>}
    <Card style={{marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:tx,marginBottom:8}}>✨ {t.detail.aiSummary}</div>
      <p style={{fontSize:13,color:ts,lineHeight:1.6,margin:"0 0 12px"}}>{a.notes}</p>
      <div style={{fontSize:12,fontWeight:600,color:tx,marginBottom:6}}>{t.detail.recommendations}</div>
      {[t.detail.rec1,t.detail.rec2,t.detail.rec3].slice(0,a.birads>=4?3:1).map(r=>(
        <div key={r} style={{display:"flex",gap:6,alignItems:"center",fontSize:13,color:ts,marginBottom:5}}><span style={{color:"#0B6E8A"}}>›</span>{r}</div>
      ))}
    </Card>
    <button style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"#0B6E8A",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{t.detail.pdfExport}</button>
  </div>;
}

// ─── NEW ANALYSIS ─────────────────────────────────────────────────────────────
function NewAnalysis({initialModality="uzi",onBack}){
  const {t,dark,addToHistory}=useApp();
  const [mod,setMod]=useState(initialModality);
  const [shape,setShape]=useState("oval");
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
  const [patientName,setPatientName]=useState("");
  const [patientAge,setPatientAge]=useState("");
  const [patientGender,setPatientGender]=useState("Ayol");
  const [patientNotes,setPatientNotes]=useState("");
  const tx=dark?"#E8EFF5":"#0D1B2A", ts=dark?"#8FA4B2":"#52687A";

  function calcBiRads(){
    let s=0;
    if(mod==="uzi"||mod==="combined"){
      if(shape==="spiculated")s+=3;else if(shape==="irregular")s+=2;else if(shape==="lobular")s+=1;
      if(echo==="hypoechoic")s+=1;
      if(posterior==="shadowing")s+=2;
      if(orientation==="not_parallel")s+=2;
    }
    if(mod==="mammo"||mod==="combined"){if(calcification)s+=3;if(distortion)s+=2;if(density==="C"||density==="D")s+=1;}
    return s===0?2:s<=2?3:s<=5?4:5;
  }
  const cat=calcBiRads(),bm=t.birads[cat],color=bc(cat),bg=bb(cat);
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
      <div>
        <div style={{fontSize:12,color:ts,marginBottom:5}}>Qo'shimcha izoh</div>
        <textarea value={patientNotes} onChange={e=>setPatientNotes(e.target.value)} placeholder="Shikoyatlar, anamnez..." rows={2}
          style={{...inputStyle,resize:"vertical"}}/>
      </div>
    </Card>

    <div style={{fontSize:13,color:ts,marginBottom:12}}>{t.newAnal.type}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
      {[["uzi","🌊"],["mammo","🔬"],["combined","🔗"]].map(([m,e])=>(
        <button key={m} onClick={()=>{setMod(m);setAnalyzed(false);}} style={{padding:"12px 6px",borderRadius:12,border:mod===m?`2px solid ${mc(m)}`:`1px solid ${dark?"#2E3A47":"#DDE6ED"}`,background:mod===m?`${mc(m)}0F`:dark?"#1E2733":"#fff",cursor:"pointer"}}>
          <div style={{fontSize:20}}>{e}</div>
          <div style={{fontSize:11,fontWeight:600,color:mod===m?mc(m):dark?"#8FA4B2":"#52687A",marginTop:4}}>{t.modality[m]}</div>
        </button>
      ))}
    </div>
    <div style={{border:`2px dashed ${dark?"#2E3A47":"#DDE6ED"}`,borderRadius:14,padding:24,textAlign:"center",marginBottom:20,cursor:"pointer",position:"relative"}}
      onClick={()=>document.getElementById("file-upload-input").click()}>
      <input id="file-upload-input" type="file" accept="image/*,.dcm" style={{display:"none"}}
        onChange={e=>{
          const file=e.target.files[0];
          if(file){setUploadedFile(file);setAnalyzed(false);}
        }}/>
      {uploadedFile
        ?<div>
          <div style={{fontSize:28}}>✅</div>
          <div style={{fontSize:13,color:"#2D9E6B",marginTop:6,fontWeight:600}}>{uploadedFile.name}</div>
          <div style={{fontSize:11,color:"#8FA4B2"}}>{(uploadedFile.size/1024).toFixed(1)} KB</div>
        </div>
        :<div>
          <div style={{fontSize:28}}>📁</div>
          <div style={{fontSize:13,color:ts,marginTop:6}}>{t.newAnal.uploadLabel}</div>
          <div style={{fontSize:11,color:"#8FA4B2"}}>{t.newAnal.uploadSub}</div>
        </div>}
    </div>
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
      <div style={{fontSize:12,color:ts,marginBottom:10}}>✨ {t.newAnal.resultLabel}</div>
      {patientName&&<div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:8}}>👤 {patientName}{patientAge?`, ${patientAge} yosh`:""}</div>}
      <Badge cat={cat}/>
      <div style={{fontSize:13,color:ts,marginTop:8}}>{bm.rec}</div>
      {ins&&<div style={{marginTop:10,padding:"8px 12px",background:"#EAF3DE",borderRadius:8,fontSize:12,color:"#2D9E6B",fontWeight:600}}>🎯 {t.newAnal.inSituNote}</div>}
      <div style={{marginTop:12}}><ConfBar value={0.88}/></div>
    </Card>}
    {!patientName.trim()&&!analyzed&&<div style={{fontSize:12,color:"#E86B2A",textAlign:"center",marginBottom:8}}>⚠️ Bemor F.I.O. ni kiriting</div>}
    <button onClick={async()=>{
      if(!patientName.trim()){alert("Bemor F.I.O. ni kiriting!");return;}
      setLoading(true);
      await new Promise(r=>setTimeout(r,1600));
      setLoading(false);
      setAnalyzed(true);
      const cat=calcBiRads();
      addToHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        patientName,
        patientAge,
        patientGender,
        patientNotes,
        modality: mod,
        birads: cat,
        confidence: 0.88,
        sizeA: mod!=="mammo"?sizeA:null,
        sizeB: mod!=="mammo"?sizeB:null,
        isInSitu: mod!=="mammo"&&sizeA<=10&&sizeB<=10,
        shape: mod!=="mammo"?shape:null,
        echo: mod!=="mammo"?echo:null,
        density: mod!=="uzi"?density:null,
        calcification: mod!=="uzi"?calcification:null,
      });
    }}
      style={{width:"100%",padding:14,borderRadius:12,border:"none",background:loading?"#8FA4B2":"#0B6E8A",color:"#fff",fontWeight:700,fontSize:14,cursor:loading?"not-allowed":"pointer",transition:"background .2s"}}>
      {loading?t.newAnal.btnLoading:analyzed?t.newAnal.btnRetry:t.newAnal.btnStart}
    </button>
  </div>;
}

// ─── STATISTICS ───────────────────────────────────────────────────────────────
function Statistics(){
  const {t,dark,history}=useApp();
  const all = history.length>0 ? history : [];
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

  function downloadCSV(){
    const headers=["ID","Ism","Yosh","Sana","Modalligi","BI-RADS","Ishonch %","Xavf %","In situ"];
    const rows=PATIENTS.map(p=>{const a=p.analyses[0];return[p.id,p.name,p.age,a.date,a.modality,a.birads,Math.round(a.confidence*100),a.malignancyRisk,inSitu(a.uzi)?"Ha":"Yo'q"].join(",");});
    const csv=[headers.join(","),...rows].join("\n");
    dataDownload(csv,"breast_ai_statistika.csv");
  }

  function downloadStatsPDF(){
    const lines=[
      "BREAST AI - STATISTIKA HISOBOTI",
      "================================",
      `Sana: ${new Date().toLocaleDateString("uz-UZ")}`,
      "",
      `Jami bemorlar: ${PATIENTS.length}`,
      `Shoshilinch holat (BR4-6): ${PATIENTS.filter(p=>p.analyses[0].birads>=4).length}`,
      `In situ aniqlangan (≤10mm): ${inSituCount}`,
      `O'rtacha AI ishonch: ${avgConf}%`,
      "",
      "BI-RADS TAQSIMOTI:",
      ...biRadsDist.map(d=>`  ${d.name}: ${d.value} ta bemor`),
      "",
      "BEMORLAR RO'YXATI:",
      ...PATIENTS.map(p=>{const a=p.analyses[0];return`  ${p.name} | ${p.age} yosh | BI-RADS ${a.birads} | ${Math.round(a.confidence*100)}%`;}),
    ].join("\n");
    dataDownload(lines,"breast_ai_hisobot.txt");
  }

  return <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:10}}>
      <div style={{fontSize:24,fontWeight:800,color:tx,letterSpacing:"-0.5px"}}>{t.stats.title}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={downloadCSV} style={{padding:"7px 14px",borderRadius:10,border:"1px solid #0B6E8A",background:"#E6F1FB",color:"#0B6E8A",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.stats.downloadCsv}</button>
        <button onClick={downloadStatsPDF} style={{padding:"7px 14px",borderRadius:10,border:"1px solid #6A3DAA",background:"#EEEDFE",color:"#6A3DAA",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.stats.downloadPdf}</button>
      </div>
    </div>
    <div style={{fontSize:13,color:"#52687A",marginBottom:20}}>May 2025</div>
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
    <Card style={{background:"#EAF3DE",borderColor:"#2D9E6B44"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:16}}>🎯</span><div style={{fontSize:14,fontWeight:700,color:"#0D1B2A"}}>{t.stats.inSituTitle}</div></div>
      <div style={{fontSize:36,fontWeight:800,color:"#2D9E6B",letterSpacing:"-1px",marginBottom:6}}>{inSituCount}</div>
      <div style={{height:8,borderRadius:8,background:"#C0DD97",overflow:"hidden",marginBottom:8}}>
        <div style={{width:`${inSituCount/PATIENTS.length*100}%`,height:"100%",background:"#2D9E6B",borderRadius:8}}/>
      </div>
      <div style={{fontSize:12,color:"#3B6D11"}}>{all.length>0?Math.round(inSituCount/all.length*100):0}% {t.stats.inSituDesc}</div>
      <div style={{fontSize:12,color:"#3B6D11",marginTop:4}}>{t.stats.inSituEffect}</div>
    </Card>
  </div>;
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings(){
  const {lang,t,setLang,dark,setDark,apiUrl,setApiUrl}=useApp();
  const s=t.settings;
  const [notif,setNotif]=useState(true);
  const [auto,setAuto]=useState(false);
  const [editApi,setEditApi]=useState(false);
  const [toast,setToast]=useState(null);
  const [doctorName,setDoctorName]=useState("Dr.Rashidova Mahliyo");
  const [doctorDept,setDoctorDept]=useState("Diagnostika bo'limi");
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
    const data=JSON.stringify({patients:PATIENTS,exportedAt:new Date().toISOString(),version:"1.0.0"},null,2);
    dataDownload(data,"breast_ai_backup.json");
    toast2(s.toastBackup,"success");
    setModal(null);
  }

  function generatePDF(){
    const lines=[
      "BREAST AI - TIBBIY HISOBOT",
      "===========================",
      `Sana: ${new Date().toLocaleDateString("uz-UZ")}`,
      `Doktor: ${doctorName} | ${doctorDept}`,
      "",
      ...PATIENTS.map(p=>{
        const a=p.analyses[0];
        return [`Bemor: ${p.name} | ${p.age} yosh`,`  BI-RADS: ${a.birads} | Ishonch: ${Math.round(a.confidence*100)}%`,`  Tavsiya: ${t.birads[a.birads]?.rec||""}`,`  Izoh: ${a.notes}`,""].join("\n");
      }),
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
      <div style={{background:"#EEF3F8",borderRadius:12,padding:14,marginBottom:16,fontSize:12,color:"#52687A"}}>
        📋 {PATIENTS.length} ta bemor · {PATIENTS.filter(p=>p.analyses[0].birads>=4).length} ta shoshilinch · {PATIENTS.filter(p=>inSitu(p.analyses[0].uzi)).length} ta in situ
      </div>
      <button onClick={generatePDF} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:"#6A3DAA",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{s.pdfGenerate} ⬇️</button>
    </Modal>}

    {modal==="backup"&&<Modal title={s.backupModalTitle} onClose={()=>setModal(null)}>
      <p style={{fontSize:13,color:"#52687A",marginBottom:16,lineHeight:1.5}}>{s.backupModalDesc}</p>
      <div style={{background:"#EEF3F8",borderRadius:12,padding:14,marginBottom:16,fontSize:12,color:"#52687A",fontFamily:"monospace"}}>
        {`{ "patients": ${PATIENTS.length}, "date": "${new Date().toISOString().split("T")[0]}", "version": "1.0.0" }`}
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
            <button onClick={()=>{setEditDoc(false);toast2(s.toastSaved,"success");}} style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:"#0B6E8A",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{s.save}</button>
            <button onClick={()=>setEditDoc(false)} style={{flex:1,padding:"9px",borderRadius:10,border:"1px solid #DDE6ED",background:"#fff",color:"#52687A",fontWeight:600,fontSize:13,cursor:"pointer"}}>{s.cancel}</button>
          </div>
        </div>
        :<div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:"#0B6E8A",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#fff",flexShrink:0}}>{doctorName.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:tx}}>{doctorName}</div><div style={{fontSize:12,color:"#52687A"}}>{doctorDept}</div></div>
          <button onClick={()=>setEditDoc(true)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #DDE6ED",background:"#fff",fontSize:12,color:"#0B6E8A",fontWeight:600,cursor:"pointer"}}>{s.editProfile}</button>
        </div>}
    </Card>

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
    </SSection>

    <SSection title={s.sectionModel}>
      <SRow label={s.modelVersion} icon="🧠" right={<span style={{fontSize:12,color:"#8FA4B2"}}>v1.2.0 (mock)</span>}/>
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


// ─── HISTORY SCREEN ───────────────────────────────────────────────────────────
function HistoryScreen({forcedRecord=null,onBack=null}){
  const {t,dark,history,addToHistory}=useApp();
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
    if(window.confirm("Barcha tarixni o'chirishni tasdiqlaysizmi?")){
      localStorage.removeItem("breastai_history");
      window.location.reload();
    }
  }

  if(selected){
    const h=selected;
    const color=bc(h.birads), bg2=bb(h.birads);
    const bm=t.birads[h.birads]||t.birads[2];
    return <div>
      <button onClick={()=>{setSelected(null);if(onBack)onBack();}} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#0B6E8A",fontSize:13,fontWeight:600,marginBottom:18,padding:0}}>← Orqaga</button>
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:"#E6F1FB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:"#0B6E8A",flexShrink:0}}>
            {h.patientName.split(" ").map(w=>w[0]).slice(0,2).join("")}
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:tx}}>{h.patientName}</div>
            <div style={{fontSize:13,color:ts}}>{h.patientAge&&`${h.patientAge} yosh · `}{h.patientGender}</div>
            <div style={{fontSize:11,color:"#8FA4B2"}}>{fmtDate(h.date)}</div>
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:14,background:bg2,borderColor:color+"44"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:12,color:ts,marginBottom:8}}>AI tahlil natijasi · <ModalityTag m={h.modality}/></div>
            <Badge cat={h.birads}/>
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

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("uz");
  const [dark,setDark]=useState(false);
  const [apiUrl,setApiUrl]=useState("https://breast-ai-backend.onrender.com");
  const [tab,setTab]=useState("dashboard");
  const [selectedPatient,setSelectedPatient]=useState(null);
  const [newAnalysisMod,setNewAnalysisMod]=useState(null);
  const [history,setHistory]=useState(()=>{
    try{ return JSON.parse(localStorage.getItem("breastai_history")||"[]"); }
    catch{ return []; }
  });
  function addToHistory(record){
    const updated=[record,...history].slice(0,100);
    setHistory(updated);
    try{ localStorage.setItem("breastai_history",JSON.stringify(updated)); }catch{}
  }
  const t=T[lang]||T.uz;
  const bg=dark?"#121920":"#EEF3F8", hbg=dark?"#1A232E":"#fff", hborder=dark?"#2E3A47":"#DDE6ED", tx=dark?"#E8EFF5":"#0D1B2A";

  const TABS=["dashboard","patients","history","stats","settings"];
  const ICONS=["📊","👥","📋","📈","⚙️"];

  function goTab(id){setTab(id);setSelectedPatient(null);setNewAnalysisMod(null);}

  function renderContent(){
    if(selectedPatient) return <HistoryScreen forcedRecord={selectedPatient} onBack={()=>setSelectedPatient(null)}/>;
    if(newAnalysisMod!==null) return <NewAnalysis initialModality={newAnalysisMod} onBack={()=>setNewAnalysisMod(null)}/>;
    if(tab==="dashboard") return <Dashboard onNewAnalysis={mod=>{setNewAnalysisMod(mod);}} onPatient={p=>{setSelectedPatient(p);}}/>;
    if(tab==="patients") return <PatientsList onPatient={p=>{setSelectedPatient(p);}}/>;
    if(tab==="history") return <HistoryScreen/>;
    if(tab==="stats") return <Statistics/>;
    if(tab==="settings") return <Settings/>;
  }

  return (
    <AppCtx.Provider value={{lang,t,setLang,dark,setDark,apiUrl,setApiUrl,history,addToHistory}}>
      <div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:bg,minHeight:"100vh",display:"flex",flexDirection:"column",transition:"background .3s"}}>
        <div style={{background:hbg,borderBottom:`1px solid ${hborder}`,padding:"13px 18px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100,transition:"background .3s"}}>
          <div style={{width:32,height:32,borderRadius:10,background:"#0B6E8A",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff"}}>B</div>
          <div style={{fontWeight:800,fontSize:16,color:tx,letterSpacing:"-0.3px"}}>{t.appName}</div>
          <div style={{marginLeft:"auto"}}>
            <button onClick={()=>setNewAnalysisMod("uzi")} style={{padding:"8px 16px",borderRadius:10,border:"none",background:"#0B6E8A",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{t.newAnalysis}</button>
          </div>
        </div>
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
