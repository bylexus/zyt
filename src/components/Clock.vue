<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import ClockWords from "./ClockWords.vue";
import { Settings } from "../lib/useSettings";
import SettingsDlg from "./SettingsDlg.vue";
import { FontInfo } from "../lib/useFonts";

const props = defineProps<{
  settings: Settings;
  fonts: FontInfo[];
}>();

const state = reactive({
  date: new Date(),
  showSettings: false,
});

const clockElement = ref<HTMLElement | null>(null);

let timer = 0;

onMounted(() => {
  timer = window.setInterval(() => {
    // Test: change time every 5 secs:
    // if (new Date().getSeconds() % 10 < 5) {
    //   state.date = new Date("2016-01-01 08:35");
    // } else {
    //   state.date = new Date("2016-01-01 10:05");
    // }
    state.date = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  window.clearInterval(timer);
});

function onToggleFullscreen() {
  console.log("fullscreen", clockElement.value);
  if (clockElement.value?.requestFullscreen) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      clockElement.value.requestFullscreen();
    }
  }
}

function onClockClick() {
  if (props.settings.clickUrl) {
    window.open(props.settings.clickUrl);
  } else {
    state.showSettings = !state.showSettings;
  }
}
</script>
<template>
  <div class="container" ref="clockElement">
    <ClockWords
      :date="state.date"
      :settings="settings"
      @click="onClockClick()"
    />
    <SettingsDlg
      :settings="settings"
      :fonts="fonts"
      :modelValue="!settings.disableSettings && state.showSettings"
      @update:modelValue="state.showSettings = $event"
      @toggle-fullscreen="onToggleFullscreen()"
    />
  </div>
</template>

<style lang="css" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
