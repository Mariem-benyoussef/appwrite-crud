export const metadata = {
  title: "Tâches - Gestion et Suivi des Activités | Mon Application",
  description:
    "Gérez vos tâches et suivez vos activités efficacement avec notre plateforme. Planifiez, attribuez et suivez l'avancement des projets en temps réel.",
  keywords:
    "gestion des tâches, suivi des activités, gestion de projet, tâches à accomplir, productivity, planification",
  author: "Votre Nom ou Nom de l'entreprise",
  robots: "index, follow",
  openGraph: {
    title: "Tâches - Gestion et Suivi des Activités",
    description:
      "Organisez vos tâches et projets avec notre outil de gestion efficace. Suivez l'avancement en temps réel.",
    url: "https://votre-site.com/taches",
    site_name: "Mon Application",
    type: "website",
    //image: "/images/og-image.jpg", // Si vous avez une image spécifique pour l'Open Graph
  },
};

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./redux/provider";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <div>
            <Header />
            <main className="p-4 text-lg">{children}</main>
          </div>
        </body>
      </html>
    </Providers>
  );
}
