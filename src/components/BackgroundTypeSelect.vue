<script setup lang="ts">
import { ref } from "vue";
import { tr } from "../lib/i18n";
import type {
  Background,
  GradientBackground,
  ColorBackground,
} from "../lib/useSettings";

const props = defineProps<{
  backgroundSetting: Background | undefined;
}>();

const emit = defineEmits<{
  (e: "settings-changed", setting: Background): void;
}>();

function emitTypeChanged(type: "color" | "gradient") {
  if (type === "color") {
    emit("settings-changed", {
      ...(props.backgroundSetting || {}),
      ...{
        type: "color",
        color: (props.backgroundSetting as ColorBackground)?.color || "#000000",
      },
    });
  }
  if (type === "gradient") {
    emit("settings-changed", {
      ...(props.backgroundSetting || {}),
      ...{
        type: "gradient",
        angle: (props.backgroundSetting as GradientBackground)?.angle || 180,
        colors: (props.backgroundSetting as GradientBackground)?.colors || [],
      },
    });
  }
}

function emitColorBackground(color: string) {
  emit("settings-changed", {
    ...(props.backgroundSetting || {}),
    ...{ type: "color", color },
  });
}

function addColorStop() {
  const colors = (props.backgroundSetting as GradientBackground)?.colors || [];
  const newColorEntry = {
    color: "#000000",
    offset: colors.length === 0 ? 0 : 100,
  };
  colors.push(newColorEntry);
  emit("settings-changed", {
    ...(props.backgroundSetting || {}),
    ...{
      type: "gradient",
      angle: (props.backgroundSetting as GradientBackground)?.angle || 180,
      colors: colors,
    },
  });
}

function emitGradientColorChanged(color: string, index: number) {
  const colors = (props.backgroundSetting as GradientBackground)?.colors || [];
  const changedColor = colors[index];
  changedColor.color = color;
  emit("settings-changed", {
    ...(props.backgroundSetting || {}),
    ...{
      type: "gradient",
      angle: (props.backgroundSetting as GradientBackground)?.angle || 180,
      colors: colors,
    },
  });
}

function emitGradientOffsetChanged(offset: number, index: number) {
  const colors = (props.backgroundSetting as GradientBackground)?.colors || [];
  const changedColor = colors[index];
  changedColor.offset = offset;
  emit("settings-changed", {
    ...(props.backgroundSetting || {}),
    ...{
      type: "gradient",
      angle: (props.backgroundSetting as GradientBackground)?.angle || 180,
      colors: colors,
    },
  });
}

function removeColor(index: number) {
  const colors = (props.backgroundSetting as GradientBackground)?.colors || [];
  colors.splice(index, 1);
  emit("settings-changed", {
    ...(props.backgroundSetting || {}),
    ...{
      type: "gradient",
      angle: (props.backgroundSetting as GradientBackground)?.angle || 180,
      colors: colors,
    },
  });
}
</script>

<template>
  <div>
    <div>
      <label
        >{{ tr("COLOR") }}
        <input
          type="radio"
          value="color"
          :checked="
            !props.backgroundSetting ||
            props.backgroundSetting?.type === 'color'
          "
          @change.prevent.stop="emitTypeChanged('color')"
        />
      </label>
      <label
        >{{ tr("GRADIENT") }}
        <input
          type="radio"
          value="color"
          :checked="props.backgroundSetting?.type === 'gradient'"
          @change.prevent.stop="emitTypeChanged('gradient')"
        />
      </label>
    </div>
    <!-- type gradient -->
    <div v-if="props.backgroundSetting?.type === 'gradient'">
      <div>
        <label>
          {{ tr("ANGLE") }}
          <input
            type="range"
            min="0"
            max="360"
            :value="props.backgroundSetting?.angle"
            @input.prevent="
              emit('settings-changed', {
                ...(props.backgroundSetting || {}),
                angle: Number(($event.target as HTMLInputElement)?.value),
              })
            "
          />
          <input
            type="number"
            min="0"
            max="360"
            :value="props.backgroundSetting?.angle"
            @change.prevent="
              emit('settings-changed', {
                ...(props.backgroundSetting || {}),
                angle: Number(($event.target as HTMLInputElement)?.value),
              })
            "
          />
        </label>
        <button type="button" @click="addColorStop">+</button>
      </div>
      <div
        v-for="(color, index) in (props.backgroundSetting as GradientBackground)?.colors"
        :key="index"
      >
        <input
          type="color"
          :value="color.color"
          @input.prevent="
            emitGradientColorChanged(
              ($event.target as HTMLInputElement)?.value,
              index
            )
          "
        />
        <input
          type="range"
          min="0"
          max="100"
          :value="color.offset"
          @input.prevent="
            emitGradientOffsetChanged(
              Number(($event.target as HTMLInputElement)?.value),
              index
            )
          "
        />
        <input
          type="number"
          min="0"
          max="100"
          :value="color.offset"
          @change.prevent="
            emitGradientOffsetChanged(
              Number(($event.target as HTMLInputElement)?.value),
              index
            )
          "
        />
        <button type="button" @click="removeColor(index)">-</button>
      </div>
    </div>

    <!-- type color -->
    <div
      v-if="
        !props.backgroundSetting || props.backgroundSetting?.type === 'color'
      "
    >
      <input
        type="color"
        :value="props.backgroundSetting?.color || '#000000'"
        @input.prevent="
          emitColorBackground(($event.target as HTMLInputElement)?.value)
        "
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
input {
  min-width: 80px;
}
</style>
