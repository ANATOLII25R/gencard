import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VolantinoAI — Crea Volantini Professionali Online",
  description: "L'editor di volantini più potente per il tuo business. Crea design professionali in minuti con l'editor canvas drag-and-drop. Template gratis, export PNG e PDF.",
  keywords: ["volantini online", "editor grafico", "design volantini", "crea volantini gratis", "flyer maker"],
  authors: [{ name: "VolantinoAI" }],
  openGraph: {
    title: "VolantinoAI — Crea Volantini Professionali",
    description: "Editor canvas professionale per volantini. Semplice come Canva, potente come Adobe.",
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
