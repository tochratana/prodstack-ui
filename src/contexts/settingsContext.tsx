"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

export type Mode = "light" | "dark" | "system";

export interface ThemeStyles {
  light: Record<string, unknown>;
  dark: Record<string, unknown>;
}

export interface Settings {
  mode: Mode;
  theme: {
    styles?: ThemeStyles;
  };
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

const DEFAULT_SETTINGS: Settings = {
  mode: "light",
  theme: {
    styles: {
      light: {},
      dark: {},
    },
  },
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    }
    setMounted(true);
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
