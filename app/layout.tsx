import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GenCard — Crea Design Professionali Online",
  description: "L'editor di design più potente per il tuo business. Crea volantini, poster e grafica professionale in minuti con l'editor canvas drag-and-drop. Template gratis, export PNG e PDF.",
  keywords: ["gencard ai", "volantini online", "editor grafico", "design volantini", "crea volantini gratis", "flyer maker", "poster maker"],
  authors: [{ name: "Anatolii Spagna" }],
  openGraph: {
    title: "GenCard — Crea Design Professionali",
    description: "Editor canvas professionale per volantini e poster. Semplice come Canva, potente come Adobe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
