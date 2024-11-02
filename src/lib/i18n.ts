import strings_de from "../localizations/strings_de";
import strings_en from "../localizations/strings_en";

let lang = "en";
let strings = {};

export function init() {
  // Use browser-language
  let language = navigator.language || "";
  language = language.replace(/-.*/, ""); // strip away everything behind the language part
  if (language) {
    lang = language;
  } else {
    setDefaultLanguage();
  }
  initStrings();
}

export function getLang() {
  return lang;
}

function setDefaultLanguage() {
  lang = "en";
}

function initStrings() {
  switch (lang) {
    case "de":
      strings = strings_de;
      break;
    default:
      strings = strings_en;
      break;
  }
}

export function tr(key) {
  if (strings[key]) {
    return strings[key];
  } else {
    return key;
  }
}
