import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/seo/metadata"

export async function GET() {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /api/
Disallow: /account/
Disallow: /cart/
Disallow: /_next/

# Specific rules for major bots
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /account/
Disallow: /cart/

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /account/
Disallow: /cart/

# Sitemap
Sitemap: ${siteConfig.url}/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}



