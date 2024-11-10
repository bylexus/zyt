<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import timeInfo from "../lib/times";
import { Gradient, Settings } from "../lib/useSettings";

const props = defineProps<{
  settings: Settings;
  date: Date;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const charContainer = ref<HTMLElement | null>(null);

const actTimeInfo = computed(() => {
  return normalizeDate(props.date);
});

// calc the font size based on the container's width/height:
// The goal is to fit all the chars in the container
const containerSize = reactive({ width: 0, height: 0 });
const fontSize = computed(() => {
  const timeInfo = getTimeInfo();
  const minSize = Math.min(
    containerSize.width / timeInfo.words[0].join("").length,
    containerSize.height / timeInfo.words.length
  );
  return minSize;
});

const actStyles = computed(() => {
  let actualStyle = {
    color: props.settings.fgActiveColor,
    textShadow: `${props.settings.activeShadowX}px ${props.settings.activeShadowY}px ${props.settings.activeShadowBlur}px ${props.settings.activeShadowColor}`,
    opacity: props.settings.fgActiveOpacity,
  };
  let dimmedStyle = {
    fontSize: fontSize.value * 0.9 + "px",
    lineHeight: fontSize.value * 1 + "px",
    color: props.settings.fgDimmedColor,
    textShadow: `${props.settings.dimmedShadowX}px ${props.settings.dimmedShadowY}px ${props.settings.dimmedShadowBlur}px ${props.settings.dimmedShadowColor}`,
    opacity: props.settings.fgDimmedOpacity,
  };
  return { actualStyle, dimmedStyle };
});

const backgroundStyle = computed(() => {
  const bgConfig = props.settings.background;
  let ret = {};
  if (bgConfig?.type === "color") {
    ret = {
      backgroundColor: bgConfig.color,
    };
  } else if (bgConfig?.type === "gradient") {
    const colorStops = bgConfig.colors.map(
      (c) => `${c.color} ${c.offset ? String(c.offset) + "%" : ""}`
    );
    ret = {
      backgroundImage: `linear-gradient(${
        bgConfig.angle || "0"
      }deg, ${colorStops.join(",")})`,
    };
  } else {
    ret = {
      backgroundColor: "#000000",
    };
  }
  return ret;
});

// We calculate the inner size of the clock container,
// and watch for size changes:
let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    const styles = getComputedStyle(charContainer.value!);
    containerSize.width =
      (charContainer.value?.offsetWidth || 0) -
      parseFloat(styles.paddingLeft) -
      parseFloat(styles.paddingRight);
    containerSize.height =
      (charContainer.value?.offsetHeight || 0) -
      parseFloat(styles.paddingTop) -
      parseFloat(styles.paddingBottom);
  });
  resizeObserver.observe(charContainer.value!);
});

onBeforeUnmount(() => {
  // disconect the resizeObserver, to free resources
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
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
  return timeInfo[props.settings.lang!];
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
      ...backgroundStyle,
    }"
    @click="emit('click')"
  >
    <div
      ref="charContainer"
      class="container"
      :style="{
        fontFamily: props.settings.fontFamily || 'Montserrat',
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
    --pTop: 10px;
    --pBottom: 5px;
    width: 100%;
    height: calc(100% - var(--pTop) - var(--pBottom));
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding-top: var(--pTop);
    padding-top: var(--pBottom);
  }

  .line {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: space-between;
  }

  .char {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-self: center;
    user-select: none;
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
</style>
