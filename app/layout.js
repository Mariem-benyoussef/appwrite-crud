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

// "use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "./redux/provider";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
import AddIcon from "@mui/icons-material/Add";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <div
          // className="max-w-3xl mx-auto text-slate-800"
          >
            <header className="p-6 border-b flex items-center justify-between bg-blue-500 rounded-bl-lg rounded-br-lg">
              <Link className="text-2xl font-bold text-white" href={"/"}>
                Tâches
              </Link>
              <Link
                className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md"
                href={"/create"}
              >
                {/* <AddIcon className="mr-2" /> */}
                Ajouter une tâche
              </Link>
            </header>
            <main className="p-4 text-lg">{children}</main>
          </div>
        </body>
      </html>
    </Providers>
  );
}
