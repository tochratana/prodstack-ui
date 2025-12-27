import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClientWrapper } from "@/components/ClientWrapper";

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A modern blog platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
