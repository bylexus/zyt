import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { init as initI18n, tr } from "./lib/i18n";
initI18n();

createApp(App).mount("#app");
