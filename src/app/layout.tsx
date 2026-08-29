import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import LayoutContent from "@/components/LayoutContent";

const thmanyah = localFont({
  src: [
    {
      path: "../fonts/thmanyahsans-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/thmanyahsans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/thmanyahsans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/thmanyahsans-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/thmanyahsans-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-thmanyah",
});

export const metadata: Metadata = {
  title: "كافي عامر | Amer Cafe - منيو وطلب إلكتروني",
  description: "المنيو الإلكتروني الرسمي لكافي عامر - قهوة مختصة، مخبوزات طازجة، وحلويات فاخرة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${thmanyah.variable} font-sans antialiased bg-[#0e2729] text-gray-900 min-h-screen`}
      >
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </body>
    </html>
  );
}
