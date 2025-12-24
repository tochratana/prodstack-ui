"use client";

import { Toaster } from "react-hot-toast";
import { SettingsProvider } from "@/contexts/settingsContext";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <Navbar />
      <main>{children}</main>
      <Toaster position="top-right" />
    </SettingsProvider>
  );
}
