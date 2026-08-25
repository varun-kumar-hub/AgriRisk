import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/lib/i18n/locales");
const languages = ["en", "ta", "te", "kn", "hi"];

function getNestedKeys(obj, prefix = "") {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys = keys.concat(getNestedKeys(obj[key], `${prefix}${key}.`));
    } else {
      keys.push(`${prefix}${key}`);
    }
  }
  return keys;
}

console.log("🔍 Verifying AgriRisk i18n translation key completeness across all 5 languages...\n");

const baseFilePath = path.join(localesDir, "en.json");
if (!fs.existsSync(baseFilePath)) {
  console.error("❌ Base translation file en.json not found!");
  process.exit(1);
}

const baseContent = JSON.parse(fs.readFileSync(baseFilePath, "utf8"));
const baseKeys = getNestedKeys(baseContent).sort();

console.log(`✅ Base language (en.json) has ${baseKeys.length} total translation keys.`);

let errorsCount = 0;

languages.forEach((lang) => {
  if (lang === "en") return;

  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Translation file ${lang}.json is missing!`);
    errorsCount++;
    return;
  }

  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const langKeys = getNestedKeys(content).sort();

  const missingKeys = baseKeys.filter((k) => !langKeys.includes(k));
  const extraKeys = langKeys.filter((k) => !baseKeys.includes(k));

  if (missingKeys.length > 0) {
    console.error(`❌ [${lang}.json] Missing ${missingKeys.length} keys:`);
    missingKeys.forEach((k) => console.error(`   - ${k}`));
    errorsCount++;
  }

  if (extraKeys.length > 0) {
    console.warn(`⚠️ [${lang}.json] ${extraKeys.length} extra keys found (not in en.json):`);
    extraKeys.forEach((k) => console.warn(`   + ${k}`));
  }

  if (missingKeys.length === 0) {
    console.log(`✅ [${lang}.json] 100% key parity with en.json (${langKeys.length} keys).`);
  }
});

if (errorsCount > 0) {
  console.error(`\n💥 Verification failed with ${errorsCount} language error(s).`);
  process.exit(1);
} else {
  console.log("\n🎉 All 5 translation files have 100% key completeness & parity!");
}
