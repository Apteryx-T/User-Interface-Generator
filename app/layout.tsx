import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Element Lab · 视频视觉组件库",
  description: "从封面风格生成弹窗、贴画、特效文字与空间交互按钮。",
  metadataBase: new URL("https://ui-style-lab.openai.site"),
  openGraph: {
    title: "ELEMENT LAB · 视频视觉组件库",
    description: "从一张封面，提取一套可透明导出的视觉元素库。",
    images: [{ url: "/og.png", width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELEMENT LAB · 视频视觉组件库",
    description: "弹窗、贴画、花字与空间交互按钮，一套生成。",
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
