import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TradeProvider } from "@/lib/trade-store";
import { JournalProvider } from "@/lib/journal-store";
import { RulesProvider } from "@/lib/rules-store";

const inter = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TraderOS — Analytics Platform",
  description: "Professional trading journal, analytics and community platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <TradeProvider>
          <JournalProvider>
            <RulesProvider>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 ml-[220px] overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
            </RulesProvider>
          </JournalProvider>
        </TradeProvider>
      </body>
    </html>
  );
}
