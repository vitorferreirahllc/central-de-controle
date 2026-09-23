import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "H Performance LLC | Central de Resultados",
  description: "Central de resultados de clientes — H Performance LLC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem("theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
