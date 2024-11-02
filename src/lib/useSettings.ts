import queryString from "query-string";
import { reactive, watch } from "vue";

export type Settings = {
  bgColor1: string;
  bgColor2: string;
  bgAngle: string;
  fgDimmedColor: string;
  fgActiveColor: string;
  activeShadowX: string;
  activeShadowY: string;
  activeShadowBlur: string;
  activeShadowColor: string;
  dimmedShadowX: string;
  dimmedShadowY: string;
  dimmedShadowBlur: string;
  dimmedShadowColor: string;
  keepScreenActive: false;
  lang: string;
  fontFamily: string;
  upperCase: boolean;
  disableSettings: boolean;
  clickUrl: string | null;
};

const settings: Settings = Object.assign(
  {
    bgColor1: "#000000",
    bgColor2: "#000000",
    bgAngle: "0",
    fgDimmedColor: "#333333",
    fgActiveColor: "#ffffff",
    activeShadowX: "0",
    activeShadowY: "0",
    activeShadowBlur: "9",
    activeShadowColor: "#cccccc",
    dimmedShadowX: "0",
    dimmedShadowY: "0",
    dimmedShadowBlur: "0",
    dimmedShadowColor: "#000000",
    keepScreenActive: false,
    lang: "zueri",
    fontFamily: "Montserrat",
    upperCase: true,
    disableSettings: false,
    clickUrl: null,
  },
  // override defaults with local storage items:
  JSON.parse(window.localStorage.getItem("as-clock") || "{}") || {},
  // override defaults with Query Param items:
  queryString.parse(location.search)
);

function createSettingsUrl(settings) {
  let query = Object.keys(settings)
    .map((key) => {
      let value = settings[key];
      return `${key}=${
        value === false || value === null ? "" : encodeURIComponent(value)
      }`;
    })
    .join("&");
  let base = location.href.replace(/\?.*/, "");
  return `${base}?${query}`;
}

let settingsListener = null;
function storeSettings(settings) {
  localStorage.setItem("as-clock", JSON.stringify(settings));
}

const settingsRef = reactive(settings);
watch(settingsRef, (newSettings) => {
  storeSettings(newSettings);
});
export default function useSettings() {
  return settingsRef;
}
