import type { Metadata } from "next";
import { Onest, Playwrite_CA, Prompt } from "next/font/google";
import "./globals.css";

// ff: base readable, accent fancy, mono alt
const onest = Onest({ variable: "--ff-sans", subsets: ["latin"] });
const playwright = Playwrite_CA({
  variable: "--ff-accent"
});
const prompt = Prompt({ variable: "--ff-mono", subsets: ["latin"], weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  title: "c2chat",
  description: "clean chat with gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${prompt.variable} ${playwright.variable} antialiased`}> 
        {children}
      </body>
    </html>
  );
}
