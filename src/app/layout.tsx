import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#187a7d",
};

export const metadata: Metadata = {
  title: "كافي عامر | Amer Cafe - منيو وطلب إلكتروني",
  description: "المنيو الإلكتروني الرسمي لكافي عامر - قهوة مختصة، مخبوزات طازجة، وحلويات فاخرة",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "كافي عامر",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full">
      <body
        suppressHydrationWarning
        className={`${thmanyah.variable} font-sans antialiased bg-[#0e2729] text-gray-900 min-h-[100dvh] h-full overflow-x-hidden flex justify-center`}
      >
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </body>
    </html>
  );
}
