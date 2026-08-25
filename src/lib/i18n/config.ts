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
