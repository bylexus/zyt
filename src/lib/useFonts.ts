import { reactive, readonly, ref, watch } from "vue";

export type FontInfo = {
  displayName: string;
  fontFamily: string;
};

export function useFonts() {
  const fontsRef = ref<FontInfo[]>([
    {
      displayName: "Sans Serif",
      fontFamily: "sans-serif",
    },
    {
      displayName: "Serif",
      fontFamily: "serif",
    },
    {
      displayName: "Monospace",
      fontFamily: "monospace",
    },
  ]);

  return {
    fonts: readonly(fontsRef),
    setFonts(newFonts: FontInfo[]) {
      fontsRef.value = newFonts;
    },
  };
}
