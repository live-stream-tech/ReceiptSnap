import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "ReceiptSnap - 証憑管理・確定申告サポート",
  description:
    "フリーランス・個人事業主向けの証憑管理アプリ。領収書・請求書をアップロードして、決算書PDFを自動生成。電子帳簿保存法対応。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReceiptSnap",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
