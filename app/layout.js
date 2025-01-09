export const metadata = {
  title: "Tâches",
  description: "Généré par next js",
};

// "use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "./redux/provider";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";

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
                Ajouter une tache
              </Link>
            </header>
            <main className="p-4 text-lg">{children}</main>
          </div>
        </body>
      </html>
    </Providers>
  );
}
