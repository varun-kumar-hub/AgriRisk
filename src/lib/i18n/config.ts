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
  wheat: { en: "Wheat", ta: "கோதுமை", te: "గోధుమ", kn: "ಗೋಧಿ", hi: "गेहूं" },
  maize: { en: "Maize (Corn)", ta: "மக்காச்சோளம்", te: "మొక్కజొన్న", kn: "ಮೆಕ್ಕೆಜೋಳ", hi: "मक्का" },
  sorghum: { en: "Sorghum (Jowar)", ta: "சோளம்", te: "జొన్నలు", kn: "ಜೋಳ", hi: "ज्वार" },
  pearl_millet: { en: "Pearl Millet (Bajra)", ta: "கம்பு", te: "సజ్జలు", kn: "ಸಜ್ಜೆ", hi: "बाजरा" },
  finger_millet: { en: "Finger Millet (Ragi)", ta: "கேழ்வரகு (ராகி)", te: "రాగులు", kn: "ರಾಗಿ", hi: "रागी" },

  chickpea: { en: "Chickpea (Gram)", ta: "கொண்டைக்கடலை", te: "శనగలు", kn: "ಕಡಲೆ", hi: "चना" },
  pigeon_pea: { en: "Pigeon Pea (Tur / Arhar)", ta: "துவரை", te: "కందులు", kn: "ತೊಗರಿ", hi: "अरहर (तूर)" },
  green_gram: { en: "Green Gram (Moong)", ta: "பாசிப்பயறு", te: "పెసర్లు", kn: "ಹೆಸರು ಕಾಳು", hi: "मूंग" },
  black_gram: { en: "Black Gram (Urad)", ta: "உளுந்து", te: "మినుములు", kn: "ಉದ್ದು", hi: "उड़द" },

  groundnut: { en: "Groundnut (Peanut)", ta: "நிலக்கடலை", te: "వేరుశనగ", kn: "ಕಡಲೆಕಾಯಿ", hi: "मूंगफली" },
  mustard: { en: "Mustard / Rapeseed", ta: "கடுகு", te: "ఆవాలు", kn: "ಸಾಸಿವೆ", hi: "सरसों" },
  soybean: { en: "Soybean", ta: "சோயாபீன்ஸ்", te: "సోయాబీన్", kn: "ಸೋಯಾಬೀನ್", hi: "सोयाबीन" },
  sunflower: { en: "Sunflower", ta: "சூரியகாந்தி", te: "పొద్దుతిరుగుడు", kn: "ಸೂರ್ಯಕಾಂತಿ", hi: "सूरजमुखी" },
  sesame: { en: "Sesame (Til)", ta: "எள்", te: "నువ్వులు", kn: "ಎಳ್ಳು", hi: "तिल" },

  cotton: { en: "Cotton", ta: "பருத்தி", te: "ప్రత్తి", kn: "ಹತ್ತಿ", hi: "कपास" },
  sugarcane: { en: "Sugarcane", ta: "கரும்பு", te: "చెరకు", kn: "ಕಬ್ಬು", hi: "गन्ना" },
  jute: { en: "Jute", ta: "சணல்", te: "జనపనార", kn: "ಶಣಬು", hi: "जूट" },

  tomato: { en: "Tomato", ta: "தக்காளி", te: "టమోటా", kn: "ಟೊಮ್ಯಾಟೊ", hi: "टमाटर" },
  potato: { en: "Potato", ta: "உருளைக்கிழங்கு", te: "బంగాళాదుంప", kn: "ಆಲೂಗಡ್ಡೆ", hi: "आलू" },
  onion: { en: "Onion", ta: "வெங்காயம்", te: "ఉల్లిపాయలు", kn: "ಈರುಳ್ಳಿ", hi: "प्याज" },
  chilli: { en: "Chilli (Red / Green)", ta: "மிளகாய்", te: "మిరపకాయలు", kn: "ಮೆಣಸಿನಕಾಯಿ", hi: "मिर्च" },
  brinjal: { en: "Brinjal (Eggplant)", ta: "கத்தரிக்காய்", te: "వంకాయ", kn: "ಬದನೆಕಾಯಿ", hi: "बैंगन" },
  okra: { en: "Okra (Lady Finger)", ta: "வெண்டைக்காய்", te: "బెండకాయ", kn: "ಬೆಂಡೇಕಾಯಿ", hi: "भिंडी" },
  garlic: { en: "Garlic", ta: "பூண்டு", te: "వెల్లుల్లి", kn: "ಬೆಳ್ಳುಳ್ಳಿ", hi: "लहसुन" },

  mango: { en: "Mango", ta: "மாம்பழம்", ta2: "மாங்காய்", te: "మామిడి", kn: "ಮಾವಿನ ಹಣ್ಣು", hi: "आम" } as any,
  banana: { en: "Banana", ta: "வாழைப்பழம்", te: "అరటి", kn: "ಬಾಳೆಹಣ್ಣು", hi: "केला" },
  papaya: { en: "Papaya", ta: "பப்பாளி", te: "బొప్పాయి", kn: "ಪಪ್ಪಾಯಿ", hi: "पपीता" }
};

export const RISK_LEVEL_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  LOW: { en: "Low", ta: "குறைந்த", te: "తక్కువ", kn: "ಕಡಿಮೆ", hi: "कम" },
  MODERATE: { en: "Moderate", ta: "மிதமான", te: "మధ్యస్థ", kn: "ಮಧ್ಯಮ", hi: "मध्यम" },
  HIGH: { en: "High", ta: "அதிக", te: "అధిక", kn: "ಹೆಚ್ಚು", hi: "उच्च" },
  CRITICAL: { en: "Critical", ta: "மிகவும் தீவிரமான", te: "తీవ్ర", kn: "ಅತ್ಯಂತ ಗಂಭೀರ", hi: "गंभीर" },
};

export const SOIL_TYPE_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  "clay loam": { en: "Clay loam", ta: "களிமண் படிவு", te: "ఎర్రరేగడి నేల", kn: "ಜೇಡಿಮಣ್ಣು", hi: "चिकनी दोमट" },
  "red sandy loam": { en: "Red sandy loam", ta: "செம்மண் வண்டல்", te: "ఎర్ర ఇసుక నేల", kn: "ಕೆಂಪು ಮರಳು ಮಣ್ಣು", hi: "लाल बलुई दोमट" },
  "black cotton soil": { en: "Black cotton soil", ta: "கருப்பு பருத்தி மண்", te: "నల్ల రేగడి నేల", kn: "ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು", hi: "काली मिट्टी" },
  "alluvial": { en: "Alluvial soil", ta: "வண்டல் மண்", te: "ఒండ్రు నేల", kn: "ಸಾರ್ವತ್ರಿಕ ಮಣ್ಣು", hi: "जलोढ़ मिट्टी" },
};

export const IRRIGATION_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  "canal irrigation": { en: "Canal irrigation", ta: "கால்வாய் பாசனம்", te: "కాలువ నీటిపారుదల", kn: "ಕಾಲುವೆ ನೀರಾವರಿ", hi: "नहर सिंचाई" },
  "drip irrigation": { en: "Drip irrigation", ta: "சொட்டு நீர் பாசனம்", te: "బిందు సేద్యం", kn: "ಹನಿ ನೀರಾವರಿ", hi: "ड्रिप सिंचाई" },
  "borewell irrigation": { en: "Borewell irrigation", ta: "ஆழ்துளை கிணற்று பாசனம்", te: "బోర్‌వెల్ నీటిపారుదల", kn: "ಬೋರ್‌ವೆಲ್ ನೀರಾವರಿ", hi: "बोरवेल सिंचाई" },
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
  rabi: { en: "Rabi", ta: "ரபி", te: "రబీ", kn: "రబీ", hi: "रबी" },
  zaid: { en: "Zaid", ta: "சையத்", te: "జాయెద్", kn: "ಜಾಯೇದ್", hi: "जायद" },
};
