"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Navbar />
      <main>{children}</main>
    </ThemeProvider>
  );
}
