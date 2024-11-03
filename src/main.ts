import { createApp } from "vue";
import App from "./App.vue";

import useSettings, { Settings } from "./lib/useSettings";
import { FontInfo, useFonts } from "./lib/useFonts";

export type ZytSettings = {
  clockSettings?: Settings;
  fonts?: FontInfo[];
};

export default function Zyt(
  containerSelector: string,
  clockId: string = "default",
  settings: ZytSettings = {}
) {
  const clockSettings = useSettings(clockId, settings.clockSettings || {});
  const fonts = useFonts();
  if (settings.fonts) {
    fonts.setFonts(settings.fonts);
  }
  createApp(App, { settings: clockSettings, fonts: fonts.fonts.value }).mount(
    containerSelector
  );
}
