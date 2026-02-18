export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/car/",
          "/dealer-profile/",
          "/cars/"
        ],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/"
        ]
      }
    ],
    sitemap: "https://ourauto.in/sitemap.xml",
  }
}
