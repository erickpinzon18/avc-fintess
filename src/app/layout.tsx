import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "AVC Fitness - Tu Casa Fitness",
  description: "Supera tus límites en AVC Fitness. CrossFit, Funcional, Halterofilia y más. Únete a nuestra comunidad fitness.",
  icons: {
    icon: [
      { url: '/assets/favico/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favico/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favico/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/assets/favico/favicon.ico' },
    ],
    apple: [
      { url: '/assets/favico/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/assets/favico/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/assets/favico/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/assets/favico/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/assets/favico/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/assets/favico/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/assets/favico/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/assets/favico/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/assets/favico/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
