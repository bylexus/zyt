<script setup lang="ts">
import { computed } from "vue";
import timeInfo from "../lib/times";
import { Settings } from "../lib/useSettings";

const props = defineProps<{
  settings: Settings;
  date: Date;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const actTimeInfo = computed(() => {
  return normalizeDate(props.date);
});

const actStyles = computed(() => {
  const timeInfo = getTimeInfo();

  let actualStyle = {
    color: props.settings.fgActiveColor,
    textShadow: `${props.settings.activeShadowX}px ${props.settings.activeShadowY}px ${props.settings.activeShadowBlur}px ${props.settings.activeShadowColor}`,
    opacity: props.settings.fgActiveOpacity,
  };
  let dimmedStyle = {
    fontSize: (100 / timeInfo.words.length) * 0.9 + "vmin",
    lineHeight: (100 / timeInfo.words.length) * 1 + "vmin",
    color: props.settings.fgDimmedColor,
    textShadow: `${props.settings.dimmedShadowX}px ${props.settings.dimmedShadowY}px ${props.settings.dimmedShadowBlur}px ${props.settings.dimmedShadowColor}`,
    opacity: props.settings.fgDimmedOpacity,
  };
  return { actualStyle, dimmedStyle };
});

function indexMatch(needleArr, haystack) {
  for (let i = 0; i < haystack.length; i++) {
    if (needleArr[0] === haystack[i][0] && needleArr[1] === haystack[i][1]) {
      return true;
    }
  }
  return false;
}

function getTimeInfo() {
  return timeInfo[props.settings.lang];
}

function normalizeDate(date: Date) {
  let { times } = getTimeInfo();
  let now = date,
    hour = now.getHours(),
    minute = Math.round(now.getMinutes() / 5) * 5;
  if (minute >= times.minuteForNextHour) {
    hour++;
  }
  hour = hour % 12;
  minute = minute % 60;

  return {
    minute: times.minutes[minute],
    hour: times.hours[hour],
    always: times.always,
  };
}

function mapLinesToChars(line, lineIndex) {
  const res: any = [];
  line.forEach((item, itemIndex) => {
    let needle = [lineIndex, itemIndex];
    let style = { ...actStyles.value.dimmedStyle };
    if (
      indexMatch(needle, actTimeInfo.value.always) ||
      indexMatch(needle, actTimeInfo.value.minute) ||
      indexMatch(needle, actTimeInfo.value.hour)
    ) {
      style = { ...style, ...actStyles.value.actualStyle };
    }
    item.split("").forEach((char, charIndex) => {
      res.push({
        className:
          char === "." ? "pulse word-animation char" : "word-animation char",
        style,
        key: `${lineIndex}-${itemIndex}-${charIndex}`,
        char: props.settings.upperCase ? char.toUpperCase() : char,
      });
    });
  });
  return res;
}
</script>

<template>
  <div
    class="clock-words"
    :style="{
      backgroundColor: props.settings.bgColor1,
      backgroundImage: `linear-gradient(${props.settings.bgAngle}deg, ${props.settings.bgColor1}, ${props.settings.bgColor2})`,
    }"
    @click="emit('click')"
  >
    <div
      class="container"
      :style="{
        fontFamily: props.settings.fontFamily || 'Montserrat'
      }"
    >
      <div
        v-for="(line, lineIndex) in getTimeInfo().words"
        :key="lineIndex"
        class="line no-select"
      >
        <div
          v-for="charInfo in mapLinesToChars(line, lineIndex)"
          :class="charInfo.className"
          :style="charInfo.style"
          :key="charInfo.key"
        >
          {{ charInfo.char }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.clock-words {
  width: 100%;
  height: 100%;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding-top: 10px;
  }

  .line {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: space-between;
  }

  .char {
    flex-grow: 1;
    text-align: center;
    align-self: center;
  }

  .pulse {
    animation: pulse 1s infinite;
  }

  .word-animation {
    transition: color 2s, text-shadow 2s;
  }
}

@keyframes pulse {
  0% {
    color: #333;
  }
  40% {
    color: white;
  }
  80% {
    color: #333;
  }
}

@font-face {
  font-family: "Roboto Mono";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Roboto-Mono/Roboto-Mono-regular.eot");
  src: url("../assets/fonts/Roboto-Mono/Roboto-Mono-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Roboto Mono"), local("Roboto-Mono-regular"),
    url("../assets/fonts/Roboto-Mono/Roboto-Mono-regular.woff2") format("woff2"),
    url("../assets/fonts/Roboto-Mono/Roboto-Mono-regular.woff") format("woff"),
    url("../assets/fonts/Roboto-Mono/Roboto-Mono-regular.ttf")
      format("truetype"),
    url("../assets/fonts/Roboto-Mono/Roboto-Mono-regular.svg#RobotoMono")
      format("svg");
}

@font-face {
  font-family: "Montserrat";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Montserrat/Montserrat-regular.eot");
  src: url("../assets/fonts/Montserrat/Montserrat-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Montserrat-Regular"), local("Montserrat-regular"),
    url("../assets/fonts/Montserrat/Montserrat-regular.woff2") format("woff2"),
    url("../assets/fonts/Montserrat/Montserrat-regular.woff") format("woff"),
    url("../assets/fonts/Montserrat/Montserrat-regular.ttf") format("truetype"),
    url("../assets/fonts/Montserrat/Montserrat-regular.svg#Montserrat")
      format("svg");
}

@font-face {
  font-family: "Bree Serif";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Bree-Serif/Bree-Serif-regular.eot");
  src: url("../assets/fonts/Bree-Serif/Bree-Serif-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Bree Serif"), local("Bree-Serif-regular"),
    url("../assets/fonts/Bree-Serif/Bree-Serif-regular.woff2") format("woff2"),
    url("../assets/fonts/Bree-Serif/Bree-Serif-regular.woff") format("woff"),
    url("../assets/fonts/Bree-Serif/Bree-Serif-regular.ttf") format("truetype"),
    url("../assets/fonts/Bree-Serif/Bree-Serif-regular.svg#BreeSerif")
      format("svg");
}

@font-face {
  font-family: "Libre Baskerville";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Libre-Baskerville/Libre-Baskerville-regular.eot");
  src: url("../assets/fonts/Libre-Baskerville/Libre-Baskerville-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Libre Baskerville"), local("Libre-Baskerville-regular"),
    url("../assets/fonts/Libre-Baskerville/Libre-Baskerville-regular.woff2")
      format("woff2"),
    url("../assets/fonts/Libre-Baskerville/Libre-Baskerville-regular.woff")
      format("woff"),
    url("../assets/fonts/Libre-Baskerville/Libre-Baskerville-regular.ttf")
      format("truetype"),
    url("../assets/fonts/Libre-Baskerville/Libre-Baskerville-regular.svg#LibreBaskerville")
      format("svg");
}

@font-face {
  font-family: "Ultra";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Ultra/Ultra-regular.eot");
  src: url("../assets/fonts/Ultra/Ultra-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Ultra"), local("Ultra-regular"),
    url("../assets/fonts/Ultra/Ultra-regular.woff2") format("woff2"),
    url("../assets/fonts/Ultra/Ultra-regular.woff") format("woff"),
    url("../assets/fonts/Ultra/Ultra-regular.ttf") format("truetype"),
    url("../assets/fonts/Ultra/Ultra-regular.svg#Ultra") format("svg");
}

@font-face {
  font-family: "Monoton";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Monoton/Monoton-regular.eot");
  src: url("../assets/fonts/Monoton/Monoton-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Monoton"), local("Monoton-regular"),
    url("../assets/fonts/Monoton/Monoton-regular.woff2") format("woff2"),
    url("../assets/fonts/Monoton/Monoton-regular.woff") format("woff"),
    url("../assets/fonts/Monoton/Monoton-regular.ttf") format("truetype"),
    url("../assets/fonts/Monoton/Monoton-regular.svg#Monoton") format("svg");
}

@font-face {
  font-family: "Macondo Swash Caps";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Macondo-Swash-Caps/Macondo-Swash-Caps-regular.eot");
  src: url("../assets/fonts/Macondo-Swash-Caps/Macondo-Swash-Caps-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Macondo Swash Caps"), local("Macondo-Swash-Caps-regular"),
    url("../assets/fonts/Macondo-Swash-Caps/Macondo-Swash-Caps-regular.woff2")
      format("woff2"),
    url("../assets/fonts/Macondo-Swash-Caps/Macondo-Swash-Caps-regular.woff")
      format("woff"),
    url("../assets/fonts/Macondo-Swash-Caps/Macondo-Swash-Caps-regular.ttf")
      format("truetype"),
    url("../assets/fonts/Macondo-Swash-Caps/Macondo-Swash-Caps-regular.svg#MacondoSwashCaps")
      format("svg");
}

@font-face {
  font-family: "Stardos Stencil";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Stardos-Stencil/Stardos-Stencil-regular.eot");
  src: url("../assets/fonts/Stardos-Stencil/Stardos-Stencil-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Stardos Stencil Regular"), local("Stardos-Stencil-regular"),
    url("../assets/fonts/Stardos-Stencil/Stardos-Stencil-regular.woff2")
      format("woff2"),
    url("../assets/fonts/Stardos-Stencil/Stardos-Stencil-regular.woff")
      format("woff"),
    url("../assets/fonts/Stardos-Stencil/Stardos-Stencil-regular.ttf")
      format("truetype"),
    url("../assets/fonts/Stardos-Stencil/Stardos-Stencil-regular.svg#StardosStencil")
      format("svg");
}

@font-face {
  font-family: "Crushed";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Crushed/Crushed-regular.eot");
  src: url("../assets/fonts/Crushed/Crushed-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Crushed"), local("Crushed-regular"),
    url("../assets/fonts/Crushed/Crushed-regular.woff2") format("woff2"),
    url("../assets/fonts/Crushed/Crushed-regular.woff") format("woff"),
    url("../assets/fonts/Crushed/Crushed-regular.ttf") format("truetype"),
    url("../assets/fonts/Crushed/Crushed-regular.svg#Crushed") format("svg");
}

@font-face {
  font-family: "Merienda One";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Merienda-One/Merienda-One-regular.eot");
  src: url("../assets/fonts/Merienda-One/Merienda-One-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Merienda One"), local("Merienda-One-regular"),
    url("../assets/fonts/Merienda-One/Merienda-One-regular.woff2")
      format("woff2"),
    url("../assets/fonts/Merienda-One/Merienda-One-regular.woff") format("woff"),
    url("../assets/fonts/Merienda-One/Merienda-One-regular.ttf")
      format("truetype"),
    url("../assets/fonts/Merienda-One/Merienda-One-regular.svg#MeriendaOne")
      format("svg");
}

@font-face {
  font-family: "Syncopate";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Syncopate/Syncopate-regular.eot");
  src: url("../assets/fonts/Syncopate/Syncopate-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Syncopate"), local("Syncopate-regular"),
    url("../assets/fonts/Syncopate/Syncopate-regular.woff2") format("woff2"),
    url("../assets/fonts/Syncopate/Syncopate-regular.woff") format("woff"),
    url("../assets/fonts/Syncopate/Syncopate-regular.ttf") format("truetype"),
    url("../assets/fonts/Syncopate/Syncopate-regular.svg#Syncopate")
      format("svg");
}

@font-face {
  font-family: "Spicy Rice";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Spicy-Rice/Spicy-Rice-regular.eot");
  src: url("../assets/fonts/Spicy-Rice/Spicy-Rice-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Spicy Rice"), local("Spicy-Rice-regular"),
    url("../assets/fonts/Spicy-Rice/Spicy-Rice-regular.woff2") format("woff2"),
    url("../assets/fonts/Spicy-Rice/Spicy-Rice-regular.woff") format("woff"),
    url("../assets/fonts/Spicy-Rice/Spicy-Rice-regular.ttf") format("truetype"),
    url("../assets/fonts/Spicy-Rice/Spicy-Rice-regular.svg#SpicyRice")
      format("svg");
}

@font-face {
  font-family: "Ubuntu";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Ubuntu/Ubuntu-regular.eot");
  src: url("../assets/fonts/Ubuntu/Ubuntu-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Ubuntu"), local("Ubuntu-regular"),
    url("../assets/fonts/Ubuntu/Ubuntu-regular.woff2") format("woff2"),
    url("../assets/fonts/Ubuntu/Ubuntu-regular.woff") format("woff"),
    url("../assets/fonts/Ubuntu/Ubuntu-regular.ttf") format("truetype"),
    url("../assets/fonts/Ubuntu/Ubuntu-regular.svg#Ubuntu") format("svg");
}

@font-face {
  font-family: "Bungee Inline";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Bungee-Inline/Bungee-Inline.eot");
  src: url("../assets/fonts/Bungee-Inline/Bungee-Inline.eot?#iefix")
      format("embedded-opentype"),
    local("Bungee Inline"),
    url("../assets/fonts/Bungee-Inline/Bungee-Inline.woff2") format("woff2"),
    url("../assets/fonts/Bungee-Inline/Bungee-Inline.woff") format("woff");
}

@font-face {
  font-family: "Wallpoet";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Wallpoet/Wallpoet-regular.eot");
  src: url("../assets/fonts/Wallpoet/Wallpoet-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Wallpoet"), local("Wallpoet-regular"),
    url("../assets/fonts/Wallpoet/Wallpoet-regular.woff2") format("woff2"),
    url("../assets/fonts/Wallpoet/Wallpoet-regular.woff") format("woff"),
    url("../assets/fonts/Wallpoet/Wallpoet-regular.ttf") format("truetype"),
    url("../assets/fonts/Wallpoet/Wallpoet-regular.svg#Wallpoet") format("svg");
}

@font-face {
  font-family: "Faster One";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Faster-One/Faster-One-regular.eot");
  src: url("../assets/fonts/Faster-One/Faster-One-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Faster One"), local("Faster-One-regular"),
    url("../assets/fonts/Faster-One/Faster-One-regular.woff2") format("woff2"),
    url("../assets/fonts/Faster-One/Faster-One-regular.woff") format("woff"),
    url("../assets/fonts/Faster-One/Faster-One-regular.ttf") format("truetype"),
    url("../assets/fonts/Faster-One/Faster-One-regular.svg#FasterOne")
      format("svg");
}

@font-face {
  font-family: "Audiowide";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Audiowide/Audiowide-regular.eot");
  src: url("../assets/fonts/Audiowide/Audiowide-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Audiowide"), local("Audiowide-regular"),
    url("../assets/fonts/Audiowide/Audiowide-regular.woff2") format("woff2"),
    url("../assets/fonts/Audiowide/Audiowide-regular.woff") format("woff"),
    url("../assets/fonts/Audiowide/Audiowide-regular.ttf") format("truetype"),
    url("../assets/fonts/Audiowide/Audiowide-regular.svg#Audiowide")
      format("svg");
}

@font-face {
  font-family: "Black Ops One";
  font-weight: 400;
  font-style: normal;
  src: url("../assets/fonts/Black-Ops-One/Black-Ops-One-regular.eot");
  src: url("../assets/fonts/Black-Ops-One/Black-Ops-One-regular.eot?#iefix")
      format("embedded-opentype"),
    local("Black Ops One"), local("Black-Ops-One-regular"),
    url("../assets/fonts/Black-Ops-One/Black-Ops-One-regular.woff2")
      format("woff2"),
    url("../assets/fonts/Black-Ops-One/Black-Ops-One-regular.woff")
      format("woff"),
    url("../assets/fonts/Black-Ops-One/Black-Ops-One-regular.ttf")
      format("truetype"),
    url("../assets/fonts/Black-Ops-One/Black-Ops-One-regular.svg#BlackOpsOne")
      format("svg");
}
</style>
