export type SupportedLanguage = "en" | "ta" | "te" | "kn" | "hi";

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const CROP_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  rice: { en: "Rice (Paddy)", ta: "நெல்", te: "వరి", kn: "ಭತ್ತ", hi: "धान (चावल)" },
  maize: { en: "Maize (Corn)", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", kn: "ಮೆಕ್ಕೆಜೋಳ", hi: "मक्का" },
  cotton: { en: "Cotton", ta: "பருத்தி", te: "ప్రత్తి", kn: "అత్తి", hi: "कपास" },
  groundnut: { en: "Groundnut (Peanut)", ta: "நிலக்கடலை", te: "వేరుశనగ", kn: "ಕಡಲೆಕಾಯಿ", hi: "मूंगफली" },
  chickpea: { en: "Chickpea (Gram)", ta: "கொண்டைக்கடலை", te: "శనగలు", kn: "ಕಡಲೆ", hi: "चना" },
  wheat: { en: "Wheat", ta: "கோதுமை", te: "గోధుమ", kn: "ಗೋಧಿ", hi: "गेहूं" },
  sugarcane: { en: "Sugarcane", ta: "கரும்பு", te: "చెరకు", kn: "ಕಬ್ಬು", hi: "गन्ना" },
  millet: { en: "Millet", ta: "சிறுதானியம்", te: "చిరుధాన్యాలు", kn: "ಸಿರಿಧಾನ್ಯ", hi: "बाजरा" },
};

export const RISK_LEVEL_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  LOW: { en: "Low", ta: "குறைந்த", te: "తక్కువ", kn: "ಕಡಿಮೆ", hi: "कम" },
  MODERATE: { en: "Moderate", ta: "மிதமான", te: "మధ్యస్థ", kn: "ಮಧ್ಯಮ", hi: "मध्यम" },
  HIGH: { en: "High", ta: "அதிக", te: "అధిక", kn: "ಹೆಚ್ಚು", hi: "उच्च" },
  CRITICAL: { en: "Critical", ta: "மிகவும் தீவிரமான", te: "సందర్భోచిత తీవ్ర", kn: "ಅತ್ಯಂತ ಗಂಭೀರ", hi: "गंभीर" },
};

export const SOIL_TYPE_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  "clay loam": { en: "Clay loam", ta: "களிமண் படிவு", te: "ఎర్ரరేగడి நேల", kn: "ಜೇಡಿಮಣ್ಣು", hi: "चिकनी दोमट" },
  "red sandy loam": { en: "Red sandy loam", ta: "செம்மண் வண்டல்", te: "ఎర్ర ఇసుక నేల", kn: "ಕೆಂಪು ಮರಳು ಮಣ್ಣು", hi: "लाल बलुई दोमट" },
  "black cotton soil": { en: "Black cotton soil", ta: "கருப்பு பருத்தி மண்", te: "నల్ల రేగడి నేల", kn: "ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು", hi: "काली मिट्टी" },
  "alluvial": { en: "Alluvial soil", ta: "வண்டல் மண்", te: "ఒండ్రు నేల", kn: "ಸಾರ್ವತ್ರಿಕ ಮಣ್ಣು", hi: "जलोढ़ मिट्टी" },
};

export const IRRIGATION_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  "canal irrigation": { en: "Canal irrigation", ta: "கால்வாய் பாசனம்", te: "కాలువ నీటిపారుదల", kn: "ಕಾಲುವೆ ನೀರಾವರಿ", hi: "नहर सिंचाई" },
  "drip irrigation": { en: "Drip irrigation", ta: "சொட்டு நீர் பாசனம்", te: "బిందు సేద్యం", kn: "ಹನಿ ನೀರಾವರಿ", hi: "ड्रिप सिंचाई" },
  "borewell irrigation": { en: "Borewell irrigation", ta: "ஆழ்துளை கிணற்று பாசனம்", te: "ಬೋರ್‌ವೆಲ್ నీటిపారుదల", kn: "ಬೋರ್‌ವೆಲ್ ನೀರಾವರಿ", hi: "बोरवेल सिंचाई" },
  "rainfed": { en: "Rainfed", ta: "மானாவாரி", te: "వర్షాధార", kn: "ಮಳೆ ಆಶ್ರಿತ", hi: "वर्षा आधारित" },
};

export const GROWTH_STAGE_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  germination: { en: "Germination", ta: "முளைத்தல்", te: "మొలకెత్తడం", kn: "ಮೊಳಕೆಯೊಡೆಯುವಿಕೆ", hi: "अंकुरण" },
  vegetative: { en: "Vegetative", ta: "பயிர் வளர்ச்சி", te: "శాకాహార పెరుగుదల", kn: "ಸಸ್ಯೀಯ ಬೆಳವಣಿಗೆ", hi: "वानस्पतिक वृद्धि" },
  tillering: { en: "Tillering", ta: "தூர் கட்டுதல்", te: "పిలకల తొడుగు", kn: "ಕವಲೊಡೆಯುವುದು", hi: "कल्ले निकलना" },
  flowering: { en: "Flowering", ta: "பூக்கும் நிலை", te: "పూత దశ", kn: "ಹೂಬಿಡುವ ಹಂತ", hi: "पुष्पन अवस्था" },
  "grain filling": { en: "Grain Filling", ta: "கதிர் முதிர்ச்சி", te: "గింజ పరిపక్వత", kn: "ಕಾಳು ತುಂಬುವ ಹಂತ", hi: "दाना भरना" },
  harvest: { en: "Harvest", ta: "அறுவடை", te: "కోత దశ", kn: "ಕೊಯ್ಲು ಹಂತ", hi: "कटाई अवस्था" },
};

export const SEASON_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  kharif: { en: "Kharif", ta: "காரீஃப்", te: "ఖరీఫ్", kn: "ಖರೀಫ್", hi: "खरीफ" },
  rabi: { en: "Rabi", ta: "ரபி", te: "రబీ", kn: "ರబీ", hi: "रबी" },
  zaid: { en: "Zaid", ta: "சையத்", te: "జాయెద్", kn: "ಜಾಯೇದ್", hi: "जायद" },
};
