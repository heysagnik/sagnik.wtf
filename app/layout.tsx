import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const generalSans = localFont({
  src: "./fonts/GeneralSans-Variable.woff",
  variable: "--font-general-sans",
  weight: "400",
});


export const metadata: Metadata = {
  title: "Sagnik Sahoo ✦ Product Designer",
  description: "A self-taught designer who loves to create beautiful and functional interfaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${generalSans.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}