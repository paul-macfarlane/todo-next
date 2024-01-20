import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Next",
  description: "App for what you need to do next. Built with Next!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} flex`}>
          <Navbar />

          <main className="flex flex-grow flex-col justify-between p-4 sm:p-20 overflow-auto">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
