import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "../components/NavigationBar";

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "A modern dashboard application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors">
        <NavigationBar />
        <div className="pt-10 pb-12 px-2 sm:px-6 min-h-screen max-w-6xl mx-auto w-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
