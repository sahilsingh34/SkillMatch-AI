import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillMatch AI - AI Powered Job Search",
  description: "Find your next role with AI skill fingerprinting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`}>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
