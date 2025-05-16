"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Copy, Check } from "lucide-react"
import { useTheme } from "next-themes"

export default function DesignSystemPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("colors")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Función para copiar texto al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Función para renderizar un bloque de código con botón de copia
  const CodeBlock = ({ code, language = "css" }: { code: string; language?: string }) => (
    <div className="relative mt-2 rounded-md bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto">
      <button
        onClick={() => copyToClipboard(code)}
        className="absolute right-2 top-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Copiar código"
      >
        {copiedText === code ? <Check size={18} /> : <Copy size={18} />}
      </button>
      <pre className="text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Sistema de Diseño</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-auto"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Esta página documenta todos los elementos visuales centralizados del proyecto, incluyendo colores, tipografía,
          espaciado, componentes y más.
        </p>
      </header>

      <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="colors">Colores</TabsTrigger>
          <TabsTrigger value="typography">Tipografía</TabsTrigger>
          <TabsTrigger value="spacing">Espaciado</TabsTrigger>
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="animations">Animaciones</TabsTrigger>
          <TabsTrigger value="utilities">Utilidades</TabsTrigger>
          <TabsTrigger value="themes">Temas</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        {/* Sección de Colores */}
        <TabsContent value="colors" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Colores Base</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Estos son los colores base del sistema, definidos como variables HSL para facilitar la manipulación de
              opacidad.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Colores base */}
              <ColorCard name="white" variable="--color-white" value="0 0% 100%" />
              <ColorCard name="black" variable="--color-black" value="0 0% 3.9%" />

              {/* Grises */}
              <ColorCard name="gray-50" variable="--color-gray-50" value="0 0% 98%" />
              <ColorCard name="gray-100" variable="--color-gray-100" value="0 0% 96.1%" />
              <ColorCard name="gray-500" variable="--color-gray-500" value="0 0% 63.9%" />
              <ColorCard name="gray-900" variable="--color-gray-900" value="0 0% 9.6%" />

              {/* Dorados */}
              <ColorCard name="gold-300" variable="--color-gold-300" value="51 100% 55%" />
              <ColorCard name="gold-500" variable="--color-gold-500" value="51 100% 45%" />
              <ColorCard name="gold-700" variable="--color-gold-700" value="51 100% 35%" />
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Colores Semánticos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <ColorCard name="primary" variable="--primary" value="var(--color-gold-500)" semantic />
              <ColorCard name="secondary" variable="--secondary" value="var(--color-gray-100)" semantic />
              <ColorCard name="accent" variable="--accent" value="var(--color-gray-100)" semantic />
              <ColorCard name="muted" variable="--muted" value="var(--color-gray-100)" semantic />
              <ColorCard name="destructive" variable="--destructive" value="var(--color-destructive-light)" semantic />
              <ColorCard name="background" variable="--background" value="var(--color-white)" semantic />
              <ColorCard name="foreground" variable="--foreground" value="var(--color-black)" semantic />
              <ColorCard name="border" variable="--border" value="var(--color-gray-300)" semantic />
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Uso de Colores</h3>
            <CodeBlock
              code={`.mi-elemento {
  /* Uso básico */
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
  
  /* Con opacidad */
  border-color: hsl(var(--primary) / 0.5); /* 50% de opacidad */
}`}
            />
          </section>
        </TabsContent>

        {/* Sección de Tipografía */}
        <TabsContent value="typography" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Familias de Fuentes</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              El sistema utiliza tres familias de fuentes principales, cada una con un propósito específico.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FontCard
                name="Inter (Sans)"
                variable="--font-sans"
                role="--font-navbar"
                sample="The quick brown fox jumps over the lazy dog"
              />
              <FontCard
                name="IBM Mono"
                variable="--font-mono"
                role="--font-headings"
                sample="The quick brown fox jumps over the lazy dog"
              />
              <FontCard
                name="Open Sans"
                variable="--font-open"
                role="--font-body"
                sample="The quick brown fox jumps over the lazy dog"
              />
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Escala de Tamaños</h3>
            <div className="space-y-4">
              {[
                { name: "xs", size: "0.75rem (12px)", variable: "--font-size-xs" },
                { name: "sm", size: "0.875rem (14px)", variable: "--font-size-sm" },
                { name: "base", size: "1rem (16px)", variable: "--font-size-base" },
                { name: "lg", size: "1.125rem (18px)", variable: "--font-size-lg" },
                { name: "xl", size: "1.25rem (20px)", variable: "--font-size-xl" },
                { name: "2xl", size: "1.5rem (24px)", variable: "--font-size-2xl" },
                { name: "3xl", size: "1.875rem (30px)", variable: "--font-size-3xl" },
                { name: "4xl", size: "2.25rem (36px)", variable: "--font-size-4xl" },
              ].map((size) => (
                <div key={size.name} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-gray-500">{size.variable}</span>
                    <span style={{ fontSize: `var(${size.variable})` }} className="font-sans">
                      Texto de ejemplo
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{size.size}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Pesos de Fuente</h3>
            <div className="space-y-4">
              {[
                { name: "normal", weight: "400", variable: "--font-weight-normal" },
                { name: "medium", weight: "500", variable: "--font-weight-medium" },
                { name: "semibold", weight: "600", variable: "--font-weight-semibold" },
                { name: "bold", weight: "700", variable: "--font-weight-bold" },
                { name: "extrabold", weight: "800", variable: "--font-weight-extrabold" },
              ].map((weight) => (
                <div key={weight.name} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-gray-500">{weight.variable}</span>
                    <span style={{ fontWeight: weight.weight }} className="font-sans">
                      Texto de ejemplo ({weight.name})
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{weight.weight}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Uso de Tipografía</h3>
            <CodeBlock
              code={`.mi-titulo {
  font-family: var(--font-headings);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.mi-parrafo {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
}`}
            />
          </section>
        </TabsContent>

        {/* Sección de Espaciado */}
        <TabsContent value="spacing" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Sistema de Espaciado</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              El sistema utiliza una escala de espaciado consistente para márgenes, padding y gaps.
            </p>

            <div className="flex flex-wrap gap-8 items-end">
              {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((size) => (
                <div key={size} className="flex flex-col items-center">
                  <div
                    className="bg-primary/20 border border-primary/30"
                    style={{
                      width: `var(--spacing-${size})`,
                      height: `var(--spacing-${size})`,
                    }}
                  ></div>
                  <span className="mt-2 text-sm text-gray-500">{size}</span>
                  <span className="text-xs text-gray-400">{size === 0 ? "0" : `${size * 0.25}rem`}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Contenedores</h3>
            <div className="space-y-4">
              {[
                { name: "sm", size: "640px", variable: "--container-sm" },
                { name: "md", size: "768px", variable: "--container-md" },
                { name: "lg", size: "1024px", variable: "--container-lg" },
                { name: "xl", size: "1280px", variable: "--container-xl" },
                { name: "2xl", size: "1536px", variable: "--container-2xl" },
              ].map((container) => (
                <div key={container.name} className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono text-sm text-gray-500">{container.variable}</span>
                  <span className="text-sm text-gray-500">{container.size}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Uso de Espaciado</h3>
            <CodeBlock
              code={`.mi-componente {
  /* Espaciado básico */
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-6);
  gap: var(--spacing-2);
  
  /* Contenedores */
  max-width: var(--container-lg);
  margin-left: auto;
  margin-right: auto;
}`}
            />
          </section>
        </TabsContent>

        {/* Sección de Componentes */}
        <TabsContent value="components" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Componentes del Sistema</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Estos componentes utilizan las variables CSS centralizadas para mantener una apariencia consistente.
            </p>

            <h3 className="text-xl font-bold mb-4">Botones</h3>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button>Botón Primario</Button>
              <Button variant="secondary">Botón Secundario</Button>
              <Button variant="outline">Botón Outline</Button>
              <Button variant="ghost">Botón Ghost</Button>
              <Button variant="link">Botón Link</Button>
              <Button variant="destructive">Botón Destructivo</Button>
            </div>

            <h3 className="text-xl font-bold mb-4">Tarjetas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tarjeta Básica</CardTitle>
                  <CardDescription>Descripción de la tarjeta</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenido de la tarjeta</p>
                </CardContent>
              </Card>

              <Card className="border-primary/50">
                <CardHeader className="bg-primary/5">
                  <CardTitle>Tarjeta con Acento</CardTitle>
                  <CardDescription>Usa el color primario</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenido de la tarjeta</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Tarjeta con Sombra</CardTitle>
                  <CardDescription>Tiene una sombra más pronunciada</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenido de la tarjeta</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-bold mb-4">Navbar</h3>
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div className="bg-navbar-bg text-navbar-text p-4 flex justify-between items-center">
                <div className="font-navbar text-lg font-bold">Logo</div>
                <div className="flex gap-4">
                  <span className="text-navbar-text hover:text-navbar-hover cursor-pointer">Inicio</span>
                  <span className="text-navbar-text hover:text-navbar-hover cursor-pointer">Productos</span>
                  <span className="text-navbar-active cursor-pointer">Contacto</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Uso de Componentes</h3>
            <CodeBlock
              language="jsx"
              code={`// Botón con variables CSS personalizadas
<button 
  style={{
    backgroundColor: 'var(--button-primary-bg)',
    color: 'var(--button-primary-text)',
    padding: 'var(--button-padding-y) var(--button-padding-x)',
    borderRadius: 'var(--button-border-radius)',
    transition: 'var(--button-transition)',
  }}
>
  Mi Botón
</button>

// O usando clases de Tailwind que usan las variables
<button className="bg-primary text-primary-foreground px-6 py-2 rounded">
  Mi Botón
</button>`}
            />
          </section>
        </TabsContent>

        {/* Sección de Animaciones */}
        <TabsContent value="animations" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Animaciones y Transiciones</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              El sistema incluye variables para duraciones, funciones de temporización y transiciones predefinidas.
            </p>

            <h3 className="text-xl font-bold mb-4">Duraciones</h3>
            <div className="space-y-6 mb-8">
              {[
                { name: "fast", value: "150ms", variable: "--duration-fast" },
                { name: "normal", value: "200ms", variable: "--duration-normal" },
                { name: "slow", value: "300ms", variable: "--duration-slow" },
              ].map((duration) => (
                <div key={duration.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-500">{duration.variable}</span>
                    <span className="text-sm text-gray-500">{duration.value}</span>
                  </div>
                  <div
                    className="h-8 bg-primary/50 w-1/4 hover:w-full"
                    style={{ transition: `width ${duration.value} var(--ease-in-out)` }}
                  ></div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Funciones de Temporización</h3>
            <div className="space-y-6 mb-8">
              {[
                { name: "ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)", variable: "--ease-in-out" },
                { name: "ease-in", value: "cubic-bezier(0.4, 0, 1, 1)", variable: "--ease-in" },
                { name: "ease-out", value: "cubic-bezier(0, 0, 0.2, 1)", variable: "--ease-out" },
                { name: "ease-linear", value: "linear", variable: "--ease-linear" },
              ].map((easing) => (
                <div key={easing.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-500">{easing.variable}</span>
                    <span className="text-sm text-gray-500">{easing.value}</span>
                  </div>
                  <div
                    className="h-8 bg-primary/50 w-1/4 hover:w-full"
                    style={{ transition: `width var(--duration-normal) ${easing.value}` }}
                  ></div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Transiciones Predefinidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <span className="font-mono text-sm text-gray-500">--transition-colors</span>
                <button
                  className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-primary hover:text-white"
                  style={{ transition: "var(--transition-colors)" }}
                >
                  Hover para ver transición de colores
                </button>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-sm text-gray-500">--transition-transform</span>
                <button
                  className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:scale-105"
                  style={{ transition: "var(--transition-transform)" }}
                >
                  Hover para ver transición de transformación
                </button>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-sm text-gray-500">--transition-opacity</span>
                <button
                  className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-50"
                  style={{ transition: "var(--transition-opacity)" }}
                >
                  Hover para ver transición de opacidad
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Uso de Animaciones</h3>
            <CodeBlock
              code={`.mi-elemento {
  /* Transición básica */
  transition: var(--transition-colors);
  
  /* Transición personalizada */
  transition: transform var(--duration-slow) var(--ease-out);
}

.mi-elemento:hover {
  background-color: hsl(var(--primary));
  transform: scale(1.05);
}`}
            />
          </section>
        </TabsContent>

        {/* Sección de Utilidades */}
        <TabsContent value="utilities" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Utilidades CSS</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              El sistema incluye clases utilitarias personalizadas que aprovechan las variables CSS.
            </p>

            <h3 className="text-xl font-bold mb-4">Clases de Altura</h3>
            <div className="space-y-4 mb-8">
              {[
                { name: "min-h-screen-navbar", description: "min-height: calc(100vh - var(--navbar-height))" },
                { name: "h-screen-navbar", description: "height: calc(100vh - var(--navbar-height))" },
                { name: "max-h-screen-navbar", description: "max-height: calc(100vh - var(--navbar-height))" },
              ].map((utility) => (
                <div key={utility.name} className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono text-sm">{utility.name}</span>
                  <span className="text-sm text-gray-500">{utility.description}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Clases de Sección</h3>
            <div className="space-y-4 mb-8">
              {[
                { name: "section-padding", description: "Padding consistente para secciones" },
                { name: "section-container", description: "Contenedor con ancho máximo y centrado" },
              ].map((utility) => (
                <div key={utility.name} className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono text-sm">{utility.name}</span>
                  <span className="text-sm text-gray-500">{utility.description}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Ejemplo de Sección</h3>
            <div className="border rounded-lg p-4 mb-8">
              <div className="bg-gray-100 dark:bg-gray-800 section-padding w-full max-w-screen-xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center">
                  Contenido de la sección con section-padding y section-container
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Uso de Utilidades</h3>
            <CodeBlock
              language="jsx"
              code={`// Sección con altura mínima que resta la altura del navbar
<section className="min-h-screen-navbar bg-background">
  {/* Contenido */}
</section>

// Sección con padding y contenedor consistentes
<section className="section-container section-padding">
  {/* Contenido */}
</section>`}
            />
          </section>
        </TabsContent>

        {/* Sección de Temas */}
        <TabsContent value="themes" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Sistema de Temas</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              El sistema soporta temas claro y oscuro mediante variables CSS y la clase .dark.
            </p>

            <div className="flex justify-center mb-8">
              <Button
                variant="outline"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                Cambiar a tema {theme === "dark" ? "claro" : "oscuro"}
              </Button>
            </div>

            <h3 className="text-xl font-bold mb-4">Comparación de Temas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-bold mb-2">Tema Claro</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-background border border-border rounded">
                    <p className="text-foreground">Texto en tema claro</p>
                  </div>
                  <Button>Botón en tema claro</Button>
                  <div className="h-8 bg-primary"></div>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                <h4 className="font-bold mb-2 text-white">Tema Oscuro</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 border border-gray-700 rounded">
                    <p className="text-gray-100">Texto en tema oscuro</p>
                  </div>
                  <Button className="bg-primary text-primary-foreground">Botón en tema oscuro</Button>
                  <div className="h-8 bg-primary"></div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Implementación de Temas</h3>
            <CodeBlock
              code={`:root {
  /* Variables para tema claro (por defecto) */
  --background: var(--color-white);
  --foreground: var(--color-black);
  --primary: var(--color-gold-500);
  /* ... */
}

.dark {
  /* Variables para tema oscuro */
  --background: var(--color-gray-950);
  --foreground: var(--color-gray-50);
  --primary: var(--color-gold-400);
  /* ... */
}

/* Uso de temas con clases de Tailwind */
.bg-background { background-color: hsl(var(--background)); }
.text-foreground { color: hsl(var(--foreground)); }`}
            />

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              El cambio de tema se implementa usando la clase <code>dark</code> en el elemento <code>html</code>, que
              activa las variables CSS específicas del tema oscuro.
            </p>
          </section>
        </TabsContent>

        {/* Sección de Tokens */}
        <TabsContent value="tokens" className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Tokens de Componentes</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Los tokens de componentes son variables CSS específicas para componentes que permiten modificar su
              apariencia desde un solo lugar.
            </p>

            <h3 className="text-xl font-bold mb-4">Tokens de Navbar</h3>
            <div className="space-y-4 mb-8">
              {[
                { name: "--navbar-height", value: "4rem (64px)" },
                { name: "--navbar-bg", value: "var(--color-white)" },
                { name: "--navbar-text", value: "var(--color-black)" },
                { name: "--navbar-font-size", value: "var(--font-size-xs)" },
                { name: "--navbar-font-weight", value: "var(--font-weight-extrabold)" },
                { name: "--navbar-text-transform", value: "uppercase" },
                { name: "--navbar-link-font-size", value: "var(--font-size-sm)" },
                { name: "--navbar-link-hover-color", value: "hsl(var(--primary))" },
              ].map((token) => (
                <div key={token.name} className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono text-sm">{token.name}</span>
                  <span className="text-sm text-gray-500">{token.value}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Tokens de Botones</h3>
            <div className="space-y-4 mb-8">
              {[
                { name: "--button-primary-bg", value: "var(--color-black)" },
                { name: "--button-primary-text", value: "var(--color-white)" },
                { name: "--button-padding-x", value: "var(--spacing-6)" },
                { name: "--button-padding-y", value: "var(--spacing-2)" },
                { name: "--button-border-radius", value: "var(--radius)" },
                { name: "--button-transition", value: "var(--transition-colors)" },
              ].map((token) => (
                <div key={token.name} className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono text-sm">{token.name}</span>
                  <span className="text-sm text-gray-500">{token.value}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Uso de Tokens de Componentes</h3>
            <CodeBlock
              code={`/* Personalizar el navbar */
:root {
  --navbar-height: 5rem; /* Cambiar altura a 80px */
  --navbar-bg: hsl(var(--primary)); /* Usar color primario como fondo */
  --navbar-text: hsl(var(--primary-foreground)); /* Texto contrastante */
}

/* Personalizar botones */
:root {
  --button-primary-bg: hsl(var(--primary));
  --button-border-radius: 9999px; /* Botones redondeados */
}`}
            />

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Al modificar estos tokens, puedes cambiar la apariencia de los componentes en todo el proyecto sin tener
              que editar cada instancia.
            </p>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para mostrar un color
function ColorCard({
  name,
  variable,
  value,
  semantic = false,
}: {
  name: string
  variable: string
  value: string
  semantic?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const copyValue = () => {
    navigator.clipboard.writeText(semantic ? `hsl(var(${variable}))` : `hsl(${value})`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border" onClick={copyValue}>
      <div
        className="h-24 cursor-pointer relative"
        style={{
          backgroundColor: semantic ? `hsl(var(${variable}))` : `hsl(${value})`,
          color: semantic
            ? variable.includes("background") || variable.includes("white")
              ? "black"
              : "white"
            : value.includes("100%") || value.includes("98%")
              ? "black"
              : "white",
        }}
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Check className="text-white" />
          </div>
        )}
      </div>
      <div className="p-3 bg-background">
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-gray-500 font-mono mt-1">{variable}</div>
        <div className="text-xs text-gray-500 font-mono mt-1 truncate">{value}</div>
      </div>
    </div>
  )
}

// Componente para mostrar una fuente
function FontCard({
  name,
  variable,
  role,
  sample,
}: {
  name: string
  variable: string
  role: string
  sample: string
}) {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border p-4">
      <div className="font-medium mb-2">{name}</div>
      <div className="text-xs text-gray-500 font-mono mb-1">{variable}</div>
      <div className="text-xs text-gray-500 font-mono mb-4">Rol: {role}</div>
      <p className="border-t pt-4" style={{ fontFamily: `var(${variable})` }}>
        {sample}
      </p>
    </div>
  )
}
