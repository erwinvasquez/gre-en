import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/seo/metadata"

export async function GET() {
  const today = new Date().toISOString().split("T")[0]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${siteConfig.url}/es</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteConfig.url}/es" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/en" />
  </url>
  <url>
    <loc>${siteConfig.url}/es/products</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteConfig.url}/es/products" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/en/products" />
  </url>
  <url>
    <loc>${siteConfig.url}/es/tools</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteConfig.url}/es/tools" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/en/tools" />
  </url>
  <url>
    <loc>${siteConfig.url}/en</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteConfig.url}/es" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/en" />
  </url>
  <url>
    <loc>${siteConfig.url}/en/products</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteConfig.url}/es/products" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/en/products" />
  </url>
  <url>
    <loc>${siteConfig.url}/en/tools</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteConfig.url}/es/tools" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.url}/en/tools" />
  </url>
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}



