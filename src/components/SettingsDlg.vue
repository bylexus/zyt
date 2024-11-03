<script lang="ts" setup>
import { Settings, createSettingsUrl, createSettingsJson } from "../lib/useSettings";
import { tr } from "../lib/i18n";
import { FontInfo } from "../lib/useFonts";

const props = defineProps<{ fonts: FontInfo[] }>();

const settings = defineModel<Settings>("settings", { required: true });
const show = defineModel<boolean>();
const emit = defineEmits(["toggle-fullscreen"]);
</script>
<template>
  <div
    :class="{
      'settings-dialog': true,
      show: show,
    }"
  >
    <div class="content">
      <h5>{{ tr("SETTINGS") }}</h5>
      <!-- Sprache -->
      <div class="field">
        <label>
          <div>{{ tr("LANG") }}</div>
          <select
            :value="settings.lang"
            @change="settings.lang = $event.target?.value"
          >
            <option value="zueri">Züri-Düütsch</option>
            <option value="bern">Bärn-Düütsch</option>
            <option value="deutsch_std">Standard-Deutsch</option>
            <option value="english_std">English Standard</option>
          </select>
        </label>
      </div>

      <!-- Schrift -->
      <div class="field">
        <label>
          <div>{{ tr("FONT") }}</div>
          <select
            :value="settings.fontFamily"
            @change="settings.fontFamily = $event.target?.value"
          >
            <option
              v-for="font in props.fonts"
              :key="font.fontFamily"
              :value="font.fontFamily"
            >
              {{ font.displayName }}
            </option>
          </select>
        </label>
      </div>

      <!-- uppercase -->
      <div class="field">
        <label>
          <input
            type="checkbox"
            :checked="settings.upperCase"
            @change="settings.upperCase = $event.target?.checked === true"
          />
          <span>{{ tr("UPPERCASE") }}</span>
        </label>
      </div>

      <!-- Colors -->
      <div class="field">
        <label>
          <div>{{ tr("BACKGROUND_GRADIENT") }}</div>
          <input
            type="color"
            :value="settings.bgColor1"
            @input="settings.bgColor1 = $event.target?.value"
          />
          <input
            type="color"
            :value="settings.bgColor2"
            @input="settings.bgColor2 = $event.target?.value"
          />
        </label>
        <label style="margin-left: 5px">
          <span>{{ tr("ANGLE") }}: </span>
          <input
            type="number"
            min="0"
            max="360"
            :value="settings.bgAngle"
            @input="settings.bgAngle = $event.target?.value"
          />
        </label>
      </div>

      <div class="field">
        <label>
          <div>{{ tr("FG_ACTIVE") }}</div>
          <input
            type="color"
            :value="settings.fgActiveColor"
            @input="settings.fgActiveColor = $event.target?.value"
          />
        </label>
        <label style="margin-left: 5px">
          <span>{{ tr("OPACITY") }}: </span>
          <input
            type="number"
            min="0"
            max="1"
            :value="settings.fgActiveOpacity"
            @input="settings.fgActiveOpacity = $event.target?.value"
          />
        </label>
      </div>

      <div class="field">
        <label>
          <div>{{ tr("FG_DIMMED") }}</div>
          <input
            type="color"
            :value="settings.fgDimmedColor"
            @input="settings.fgDimmedColor = $event.target?.value"
          />
        </label>
        <label style="margin-left: 5px">
          <span>{{ tr("OPACITY") }}</span>
          <input
            type="number"
            min="0"
            max="1"
            :value="settings.fgDimmedOpacity"
            @input="settings.fgDimmedOpacity = $event.target?.value"
          />
        </label>
      </div>

      <!-- fg active shadow -->
      <fieldset class="field">
        <legend>{{ tr("FG_ACTIVE_SHADOW") }}</legend>
        <div style="display: flex; flex-direction: column">
          <label>
            <div>dX:</div>
            <input
              type="number"
              :value="settings.activeShadowX"
              @change="settings.activeShadowX = $event.target?.value"
            />
          </label>
          <label>
            <div>dY:</div>
            <input
              type="number"
              :value="settings.activeShadowY"
              @change="settings.activeShadowY = $event.target?.value"
            />
          </label>

          <label>
            <div>{{ tr("BLUR") }}:</div>
            <input
              type="number"
              :value="settings.activeShadowBlur"
              @change="settings.activeShadowBlur = $event.target?.value"
            />
          </label>
          <label>
            <div>{{ tr("COLOR") }}:</div>
            <input
              type="color"
              :value="settings.activeShadowColor"
              @input="settings.activeShadowColor = $event.target?.value"
            />
          </label>
        </div>
      </fieldset>

      <!-- fg dimmed shadow -->
      <fieldset class="field">
        <legend>{{ tr("FG_DIMMED_SHADOW") }}</legend>
        <div>
          <label>
            <div>dX:</div>
            <input
              type="number"
              :value="settings.dimmedShadowX"
              @change="settings.dimmedShadowX = $event.target?.value"
            />
          </label>
          <label>
            <div>dY:</div>
            <input
              type="number"
              :value="settings.dimmedShadowY"
              @change="settings.dimmedShadowY = $event.target?.value"
            />
          </label>

          <label>
            <div>{{ tr("BLUR") }}:</div>
            <input
              type="number"
              :value="settings.dimmedShadowBlur"
              @change="settings.dimmedShadowBlur = $event.target?.value"
            />
          </label>
          <label>
            <div>{{ tr("COLOR") }}:</div>
            <input
              type="color"
              :value="settings.dimmedShadowColor"
              @input="settings.dimmedShadowColor = $event.target?.value"
            />
          </label>
        </div>
      </fieldset>

      <div class="field">
        <a :href="createSettingsUrl(settings)" target="_blank">{{
          tr("CLOCK_URL")
        }}</a>
        <a :href="createSettingsJson(settings)" download="zyt.json">{{
          tr("CLOCK_JSON")
        }}</a>
        <a href="https://github.com/bylexus/zyt" target="_blank">{{
          tr("INFO_ON_GITHUB")
        }}</a>
      </div>
    </div>

    <div class="buttons">
      <button @click="emit('toggle-fullscreen')">
        {{ tr("TOGGLE_FULLSCREEN") }}
      </button>
      <button type="button" @click.stop="show = false">
        {{ tr("CLOSE") }}
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.settings-dialog {
  z-index: 100;
  font-family: sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 50vw;
  height: 100vh;
  overflow: auto;
  opacity: 0;
  background-color: rgba(200, 200, 200, 0.95);
  transform: translateX(-100vw);
  transition: transform 0.25s ease, opacity 0.25s ease;

  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "content"
    "buttons";

  &.show {
    opacity: 1;
    transform: translateX(0);
  }

  .content {
    padding: 1em;
    grid-area: content;

    .field {
      margin-bottom: 1em;
    }
    fieldset {
      border: 1px solid grey;
    }
    a {
      display: inline-block;
      padding: 0.1rem 0.2rem;
      background-color: #aaa;
      border: 1px solid #333;
      border-radius: 3px;
      margin-right: 0.2rem;
    }
  }

  .buttons {
    padding: 1em;
    grid-area: buttons;
    display: flex;
    justify-content: end;
    gap: 5px;
  }
}

@media screen and (orientation: portrait) {
  .settings-dialog {
    width: 100vw;
    height: 70vh;
    top: 30vh;
    transform: translateY(100vh);
    &.show {
      transform: translateY(0);
    }
  }
}
</style>
