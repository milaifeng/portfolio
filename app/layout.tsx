import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "米莱峰博客",
  description: "这是米莱峰的个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[#1b1b1f] transition-colors duration-300`}
      >
        <Providers>
          <Header />
          <main className="max-w-6xl p-18 min-h-screen mx-auto px-6">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
