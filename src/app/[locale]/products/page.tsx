import type { Metadata } from "next"
import type { PokemonsResponse, SimplePokemon } from "@/app/pokemons"
import Image from "next/image"
import { getPageMetadata } from "@/lib/seo/metadata"
import { generatePageSchema } from "@/lib/seo/schema"
import { SchemaOrg } from "@/components/seo/SchemaOrg"
import { getTranslations } from "next-intl/server"

// Generar metadatos para la página de productos
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getPageMetadata("products", "/products", params.locale)
}

const getPokemons = async (limit = 20, offset = 0): Promise<SimplePokemon[]> => {
  const data: PokemonsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`).then(
    (res) => res.json(),
  )

  const pokemons = data.results.map((pokemon) => ({
    id: pokemon.url.split("/").at(-2)!,
    name: pokemon.name,
  }))

  return pokemons
}

export default async function ProductsPage({ params }: { params: { locale: string } }) {
  const pokemons = await getPokemons(100)

  // Obtener traducciones para metadatos
  const t = await getTranslations({ locale: params.locale, namespace: "Metadata" })

  // Generar Schema.org para la página de productos
  const pageSchema = await generatePageSchema({
    title: t("products.title"),
    description: t("products.description"),
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com"}/${params.locale}/products`,
    locale: params.locale,
    breadcrumbs: [
      {
        name: t("home.title"),
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com"}/${params.locale}`,
      },
      {
        name: t("products.title"),
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com"}/${params.locale}/products`,
      },
    ],
  })

  return (
    <div className="flex flex-col">
      {/* Schema.org específico para esta página */}
      <SchemaOrg schema={pageSchema} />

      <h1 className="text-3xl text-center mt-20">{t("products.title")}</h1>
      <div className=" flex flex-wrap gap-10 items-center justify-center">
        {pokemons.map((pokemon) => (
          <Image
            key={pokemon.id}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
            width={100}
            height={100}
            alt={pokemon.name}
            priority={false}
          />
        ))}
      </div>
    </div>
  )
}




