<script setup lang="ts">
import Clock from "./components/Clock.vue";
import { FontInfo } from "./lib/useFonts";
import { Settings } from "./lib/useSettings";

const props = defineProps<{
  settings: Settings;
  fonts: FontInfo[]
}>();
</script>

<template>
  <Clock :settings="settings" :fonts="fonts" />
</template>
