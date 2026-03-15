import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Meter Viewer",
  description: "Real-time home energy usage dashboard — electricity and gas breakdown by device",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
