import strings_de from './localizations/strings_de';
import strings_en from './localizations/strings_en';

let lang = 'en';
let strings = {};

export function init() {
    let p = new Promise((resolve, reject) => {
        if (navigator.globalization) {
            // Use Cordova globalization plugin:
            navigator.globalization.getPreferredLanguage(function(language) {
                lang = language.value.replace(/-.*/, ''); // strip away everything behind the language part
                initStrings();
                resolve();
            }, () => {
                setDefaultLanguage();
                initStrings();
                resolve();
            });
        } else {
            // Use browser-language
            let language = navigator.language || navigator.userLanguage || '';
            language = language.replace(/-.*/, ''); // strip away everything behind the language part
            if (language) {
                lang = language;
            } else {
                setDefaultLanguage();
            }
            initStrings();
            resolve();
        }
    });
    return p;
}

export function getLang() {
    return lang;
}

function setDefaultLanguage() {
    this.lang = 'en';
}

function initStrings() {
    switch (lang) {
        case 'de':
            strings = strings_de;
            break;
        default:
            strings = strings_en;
            break;
    }
}

function tr(key) {
    if (strings[key]) {
        return strings[key];
    } else {
        return key;
    }
}
export default tr;

