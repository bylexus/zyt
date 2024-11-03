import { createApp } from "vue";
import App from "./App.vue";

import useSettings, { Settings } from "./lib/useSettings";

export default function Zyt(
  containerSelector: string,
  clockId: string = "default",
  initialSettings: Settings = {}
) {
  const settings = useSettings(clockId, initialSettings);
  createApp(App, { settings }).mount(containerSelector);
}
