import { createApp } from "vue";
import App from "./App.vue";

import { init as initI18n, tr } from "./lib/i18n";
import useSettings, { Settings } from "./lib/useSettings";

export default function Zyt(
  containerSelector: string,
  clockId: string = "default",
  initialSettings: Settings = {}
) {
  const settings = useSettings(clockId, initialSettings);
  initI18n();
  createApp(App, { settings }).mount(containerSelector);
}
