import strings_de from "../localizations/strings_de";
import strings_en from "../localizations/strings_en";

let lang = "en";
let strings = {};

// Use browser-language, and init strings
let language = navigator.language || "";
language = language.replace(/-.*/, ""); // strip away everything behind the language part
if (language) {
  lang = language;
} else {
  lang = "en";
}
switch (lang) {
  case "de":
    strings = strings_de;
    break;
  default:
    strings = strings_en;
    break;
}

export function getLang() {
  return lang;
}

export function tr(key) {
  if (strings[key]) {
    return strings[key];
  } else {
    return key;
  }
}
