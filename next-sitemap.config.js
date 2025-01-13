/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://appwrite-crud-j9dg0c5jd-mariem-ben-youssefs-projects.vercel.app", // Remplacez par votre URL
  generateRobotsTxt: true, // (facultatif) Génère automatiquement le fichier robots.txt
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000, // Taille maximale du sitemap
  exclude: ["/secret", "/admin/*"], // Exclure des pages spécifiques
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://appwrite-crud-j9dg0c5jd-mariem-ben-youssefs-projects.vercel.app/server-sitemap.xml", // Par exemple, si vous avez des sitemaps supplémentaires
    ],
  },
};
