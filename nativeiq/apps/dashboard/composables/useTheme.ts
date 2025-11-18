import { onMounted } from "vue";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "nativeiq-dashboard-theme";

const applyThemeToDom = (mode: ThemeMode) => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.theme = mode;
};

export const useTheme = () => {
  const theme = useState<ThemeMode>("theme-mode", () => "dark");

  const setTheme = (mode: ThemeMode) => {
    theme.value = mode;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
    applyThemeToDom(mode);
  };

  const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
  };

  onMounted(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    setTheme(stored ?? theme.value);
  });

  return {
    theme,
    setTheme,
    toggleTheme
  };
};
