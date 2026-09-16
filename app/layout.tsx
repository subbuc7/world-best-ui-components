import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Best UI Components",
  description: "Premium UI components with live previews and source code."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
