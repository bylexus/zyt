<script lang="ts" setup>
import useSettings, { Settings } from "../lib/useSettings";
import { tr } from "../lib/i18n";

const settings = defineModel<Settings>("settings", { default: useSettings() });
const show = defineModel<boolean>();
const emit = defineEmits(["toggle-fullscreen"]);

function createSettingsUrl(settings: Settings) {
  let query = Object.keys(settings)
    .map((key) => {
      let value = settings[key];
      return `${key}=${
        value === false || value === null ? "" : encodeURIComponent(value)
      }`;
    })
    .join("&");
  let base = location.href.replace(/\?.*/, "");
  return `${base}?${query}`;
}
</script>
<template>
  <div
    :class="{
      'settings-dialog': true,
      show: show,
    }"
  >
    <div class="content">
      <!-- Sprache -->
      <div>
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
      <div>
        <label>
          <div>{{ tr("FONT") }}</div>
          <select
            :value="settings.fontFamily"
            @change="settings.fontFamily = $event.target?.value"
          >
            <option value="Audiowide">Audiowide</option>
            <option value="Black Ops One">Black Ops One</option>
            <option value="Bree Serif">Bree Serif</option>
            <option value="Bungee Inline">Bungee Inline</option>
            <option value="Crushed">Crushed</option>
            <option value="Faster One">Faster One</option>
            <option value="Libre Baskerville">Libre Baskerville</option>
            <option value="Macondo Swash Caps">Macondo Swash Caps</option>
            <option value="Merienda One">Merienda One</option>
            <option value="Monoton">Monoton</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Roboto Mono">Roboto Mono</option>
            <option value="Spicy Rice">Spicy Rice</option>
            <option value="Stardos Stencil">Stardos Stencil</option>
            <option value="Syncopate">Syncopate</option>
            <option value="Ubuntu">Ubuntu</option>
            <option value="Ultra">Ultra</option>
            <option value="Wallpoet">Wallpoet</option>
          </select>
        </label>
      </div>

      <!-- uppercase -->
      <div>
        <label>
          <div>{{ tr("UPPERCASE") }}</div>
          <input
            type="checkbox"
            :checked="settings.upperCase"
            @change="settings.upperCase = $event.target?.checked === true"
          />
        </label>
      </div>

      <!-- Colors -->
      <div>
        <div>
          <label>
            <div>{{ tr("BACKGROUND") }}</div>
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
          <label>
            <div>{{ tr("ANGLE") }}</div>
            <input
              type="number" min="0" max="360"
              :value="settings.bgAngle"
              @input="settings.bgAngle = $event.target?.value"
            />
          </label>
        </div>

        <div>
          <label>
            <div>{{ tr("FG_ACTIVE") }}</div>
            <input
              type="color"
              :value="settings.fgActiveColor"
              @input="settings.fgActiveColor = $event.target?.value"
            />
          </label>
        </div>

        <div>
          <label>
            <div>{{ tr("FG_DIMMED") }}</div>
            <input
              type="color"
              :value="settings.fgDimmedColor"
              @input="settings.fgDimmedColor = $event.target?.value"
            />
          </label>
        </div>
      </div>

      <!-- fg active shadow -->
      <fieldset>
        <legend>{{ tr("FG_ACTIVE_SHADOW") }}</legend>
        <div>
          <label>
            dX:
            <input
              type="number"
              :value="settings.activeShadowX"
              @change="settings.activeShadowX = $event.target?.value"
            />
          </label>
          <label>
            dY:
            <input
              type="number"
              :value="settings.activeShadowY"
              @change="settings.activeShadowY = $event.target?.value"
            />
          </label>

          <label>
            {{ tr("BLUR") }}:
            <input
              type="number"
              :value="settings.activeShadowBlur"
              @change="settings.activeShadowBlur = $event.target?.value"
            />
          </label>
          <label>
            <input
              type="color"
              :value="settings.activeShadowColor"
              @input="settings.activeShadowColor = $event.target?.value"
            />
          </label>
        </div>
      </fieldset>

      <!-- fg dimmed shadow -->
      <fieldset>
        <legend>{{ tr("FG_DIMMED_SHADOW") }}</legend>
        <div>
          <label>
            dX:
            <input
              type="number"
              :value="settings.dimmedShadowX"
              @change="settings.dimmedShadowX = $event.target?.value"
            />
          </label>
          <label>
            dY:
            <input
              type="number"
              :value="settings.dimmedShadowY"
              @change="settings.dimmedShadowY = $event.target?.value"
            />
          </label>

          <label>
            {{ tr("BLUR") }}:
            <input
              type="number"
              :value="settings.dimmedShadowBlur"
              @change="settings.dimmedShadowBlur = $event.target?.value"
            />
          </label>
          <label>
            <input
              type="color"
              :value="settings.dimmedShadowColor"
              @input="settings.dimmedShadowColor = $event.target?.value"
            />
          </label>
        </div>
      </fieldset>
    </div>

    <div class="buttons">
      <a :href="createSettingsUrl(settings)" target="_blank">{{
        tr("CLOCK_URL")
      }}</a>
      <a href="https://github.com/bylexus/zyt" target="_blank">{{
        tr("INFO_ON_GITHUB")
      }}</a>
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
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: rgba(200, 200, 200, 0.9);
  transform: translateX(-100%);
  transition: transform 0.25s ease;

  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "content"
    "buttons";

  &.show {
    transform: translateX(0);
  }

  .content {
    padding: 1em;
    grid-area: content;
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
    width: 100%;
    height: 70%;
    top: 30%;
    transform: translateY(100%);
    &.show {
      transform: translateY(0);
    }
  }
}
</style>
