import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { BaseMeta } from "./base-meta";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BaseSignals - On-chain Behavioral Signals for Base",
  description: "Detect user intent and behavior on Base network",
  other: {
    "base:app_id": "6952a1d74d3a403912ed851e",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BaseMeta />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

