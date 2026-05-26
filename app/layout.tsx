import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusMind — 跨界灵感碰撞与创新加速平台",
  description:
    "面向科研人员、产品经理和硬核创作者的跨界灵感碰撞平台。多维知识图谱对撞、第一性原理断裂测试、MVA 动态生成、学术工程双向翻译。",
  keywords: ["创新", "科研", "产品经理", "灵感", "跨界", "知识图谱", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
