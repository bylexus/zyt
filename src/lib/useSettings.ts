import { reactive, toValue, watch } from "vue";

export type Background = ColorBackground | GradientBackground;

export type ColorBackground = {
  type: "color";
  color: string;
};

export type GradientBackground = {
  type: "gradient";
  angle: number;
  colors: Array<{ color: string; offset: number }>;
};

export type Settings = {
  background?: Background;
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
  background: {
    type: "gradient",
    angle: 135,
    colors: [
      { color: "#225d59", offset: 0 },
      { color: "#000000", offset: 100 },
    ],
  },
  fgDimmedColor: "#0e6261",
  fgDimmedOpacity: "0.3",
  fgActiveColor: "#ffffff",
  fgActiveOpacity: "1",
  activeShadowX: "0",
  activeShadowY: "0",
  activeShadowBlur: "10",
  activeShadowColor: "#ffffff",
  dimmedShadowX: "0",
  dimmedShadowY: "0",
  dimmedShadowBlur: "0",
  dimmedShadowColor: "#000000",
  keepScreenActive: false,
  lang: "zueri",
  fontFamily: "sans-serif",
  upperCase: true,
  disableSettings: false,
  clickUrl: null,
};

export function createSettingsUrl(settings: Settings): string {
  let query = Object.keys(settings)
    .map((key) => {
      if (!key) {
        return null;
      }
      let value = settings[key];
      if (!value) {
        value = "";
      } else if (typeof value === "string") {
        value = value;
      } else {
        value = JSON.stringify(value);
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");
  let base = location.href.replace(/\?.*/, "");
  return `${base}?${query}`;
}

export function createSettingsJson(settings: Settings): string {
  const jsonString = JSON.stringify(settings);
  const blob = new Blob([jsonString], { type: "application/json" });
  return URL.createObjectURL(blob);
}

function storeSettings(clockId: string, settings) {
  settings = toValue(settings);
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
export default function useSettings(
  clockId: string = "default",
  initialSettings: Settings = {}
) {
  const settingsRef = reactive({
    ...defaultSettings,
    // override defaults with local storage items:
    ...(JSON.parse(window.localStorage.getItem(`zyt-${clockId}`) || "{}") ||
      {}),
    // override defaults with initial settings:
    ...initialSettings,
  });

  // On settings change, store in local storage:
  watch(
    settingsRef,
    (newSettings) => {
      storeSettings(clockId, newSettings);
    },
    { immediate: true }
  );
  return settingsRef;
}
