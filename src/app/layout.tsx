import type { Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Patricia Garcia - Organização de Eventos",
  description:
    "Patricia Garcia Cerimonialista — Organização de Eventos e Momentos Inesquecíveis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${lato.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://psg-cdn-perf-two.azureedge.net"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://psg-cdn-perf-two.azureedge.net" />
        <link
          rel="preconnect"
          href="https://media.licdn.com"
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#c9f0b7] text-[#0c3008]">
        {children}
      </body>
    </html>
  );
}
