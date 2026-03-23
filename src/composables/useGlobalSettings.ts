import { useStore } from "@/composables/useStore";

export interface GlobalSettings {
  countryCode: string;
  contentLanguage: "en" | "zh";
}

export const globalSettingsRef = useStore<GlobalSettings>("global/settings", {
  countryCode: "",
  contentLanguage: "en",
});

export function useGlobalSettings() {
  const init = async () => {
    await globalSettingsRef.init();
    return globalSettingsRef.value;
  };

  const updateSettings = async (updates: Partial<GlobalSettings>) => {
    Object.assign(globalSettingsRef.value, updates);
    await globalSettingsRef.save();
  };

  return {
    settings: globalSettingsRef,
    init,
    updateSettings,
  };
}
