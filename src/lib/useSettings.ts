import { reactive, watch } from "vue";

export type Settings = {
  bgColor1?: string;
  bgColor2?: string;
  bgAngle?: string;
  fgDimmedColor?: string;
  fgDimmedOpacity?: string;
  fgActiveColor?: string;
  fgActiveOpacity?: string;
  activeShadowX?: string;
  activeShadowY?: string;
  activeShadowBlur?: string;
  activeShadowColor?: string;
  dimmedShadowX?: string;
  dimmedShadowY?: string;
  dimmedShadowBlur?: string;
  dimmedShadowColor?: string;
  keepScreenActive?: false;
  lang?: string;
  fontFamily?: string;
  upperCase?: boolean;
  disableSettings?: boolean;
  clickUrl?: string | null;
};

const defaultSettings: Settings = {
  bgColor1: "#000000",
  bgColor2: "#000000",
  bgAngle: "0",
  fgDimmedColor: "#333333",
  fgDimmedOpacity: "1",
  fgActiveColor: "#ffffff",
  fgActiveOpacity: "1",
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
};

export function createSettingsUrl(settings: Settings): string {
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

function storeSettings(clockId: string, settings) {
  localStorage.setItem(`zyt-${clockId}`, JSON.stringify(settings));
}

/**
 * Returns a new reactive Settings object for a given clock id.
 * Note that each call to useSettings() emits a new settings instance,
 * so please make sure to keep a reference to the returned object and pass it around.
 * 
 * @param clockId 
 * @param initialSettings 
 * @returns 
 */
export default function useSettings(clockId: string = "default", initialSettings: Settings = {}) {
  const settingsRef = reactive({
    ...defaultSettings,
    // override defaults with local storage items:
    ...(JSON.parse(window.localStorage.getItem(`zyt-${clockId}`) || "{}") || {}),
    // override defaults with Query Param items:
    // ...queryString.parse(location.search),
    // override defaults with initial settings:
    ...initialSettings,
  });

  watch(
    settingsRef,
    (newSettings) => {
      storeSettings(clockId, newSettings);
    },
    { immediate: true }
  );
  return settingsRef;
}
