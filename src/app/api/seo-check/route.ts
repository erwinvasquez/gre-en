import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Realizar la solicitud a la URL proporcionada
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SEO-Check-Bot/1.0",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 500 },
      )
    }

    const html = await response.text()

    // Extraer metadatos básicos usando expresiones regulares
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1] : null

    const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)
    const description = descriptionMatch ? descriptionMatch[1] : null

    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i)
    const canonical = canonicalMatch ? canonicalMatch[1] : null

    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const h1 = h1Match ? h1Match[1].replace(/<[^>]*>/g, "") : null

    // Verificar si hay metadatos Open Graph
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i)
    const ogTitle = ogTitleMatch ? ogTitleMatch[1] : null

    const ogDescriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i)
    const ogDescription = ogDescriptionMatch ? ogDescriptionMatch[1] : null

    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i)
    const ogImage = ogImageMatch ? ogImageMatch[1] : null

    // Verificar si hay metadatos Twitter Card
    const twitterCardMatch = html.match(/<meta\s+name=["']twitter:card["']\s+content=["'](.*?)["']/i)
    const twitterCard = twitterCardMatch ? twitterCardMatch[1] : null

    // Verificar si hay datos estructurados (Schema.org)
    // Modificamos esta expresión regular para evitar el uso de características de ES2018
    const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g
    const schemaMatches = html.match(schemaRegex)
    const hasSchema = schemaMatches !== null

    // Analizar problemas
    const issues = []

    if (!title) issues.push("Missing title tag")
    else if (title.length < 10) issues.push("Title is too short (less than 10 characters)")
    else if (title.length > 60) issues.push("Title is too long (more than 60 characters)")

    if (!description) issues.push("Missing meta description")
    else if (description.length < 50) issues.push("Description is too short (less than 50 characters)")
    else if (description.length > 160) issues.push("Description is too long (more than 160 characters)")

    if (!canonical) issues.push("Missing canonical URL")
    if (!h1) issues.push("Missing H1 tag")
    if (!ogTitle || !ogDescription || !ogImage) issues.push("Incomplete Open Graph metadata")
    if (!twitterCard) issues.push("Missing Twitter Card metadata")
    if (!hasSchema) issues.push("No structured data (Schema.org) found")

    // Determinar el estado general
    let status = "excellent"
    if (issues.length > 0 && issues.length <= 2) status = "good"
    else if (issues.length > 2 && issues.length <= 4) status = "needs improvement"
    else if (issues.length > 4) status = "poor"

    return NextResponse.json({
      url,
      status,
      issues,
      metadata: {
        title,
        description,
        canonical,
        h1,
        openGraph: {
          title: ogTitle,
          description: ogDescription,
          image: ogImage,
        },
        twitter: {
          card: twitterCard,
        },
        hasStructuredData: hasSchema,
      },
    })
  } catch (error) {
    console.error("Error in SEO check:", error)
    return NextResponse.json({ error: "Failed to analyze URL" }, { status: 500 })
  }
}



