import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI Style Lab · 封面风格 UI 生成器",
  description: "从一张封面提取视觉基因，生成风格统一的 UI 模板。",
  metadataBase: new URL("https://ui-style-lab.openai.site"),
  openGraph: {
    title: "UI STYLE LAB",
    description: "一张封面，生成一套 UI。",
    images: [{ url: "/og.png", width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI STYLE LAB",
    description: "一张封面，生成一套 UI。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
