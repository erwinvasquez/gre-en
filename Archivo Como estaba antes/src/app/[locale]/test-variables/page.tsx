"use client"

import { useEffect } from "react"
import "@/styles/test-variables.css"

export default function TestVariablesPage() {
  // Asegurarse de que los estilos se carguen correctamente
  useEffect(() => {
    console.log("Página de prueba de variables CSS cargada")
  }, [])

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="test-container">
        <h1 className="test-heading">Prueba de Variables CSS</h1>

        <p className="test-paragraph">
          Esta página demuestra el uso de nuestro nuevo sistema de variables CSS. Los colores, tipografía, espaciado y
          otros estilos se controlan mediante variables CSS centralizadas.
        </p>

        <h2 className="test-heading" style={{ fontSize: "var(--font-size-2xl)" }}>
          Tipografía
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Familia de fuentes */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg">Familias de fuentes</h3>
            <div className="space-y-2">
              <p style={{ fontFamily: "var(--font-sans)" }}>
                <span className="text-sm text-gray-500 block">Inter (--font-sans):</span>
                The quick brown fox jumps over the lazy dog
              </p>
              <p style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-sm text-gray-500 block">IBM Mono (--font-mono):</span>
                The quick brown fox jumps over the lazy dog
              </p>
              <p style={{ fontFamily: "var(--font-open)" }}>
                <span className="text-sm text-gray-500 block">Open Sans (--font-open):</span>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>

          {/* Tamaños de fuente */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg">Tamaños de fuente</h3>
            <div className="space-y-2">
              <p style={{ fontSize: "var(--font-size-xs)" }}>
                <span className="text-gray-500">--font-size-xs:</span> Texto extra pequeño
              </p>
              <p style={{ fontSize: "var(--font-size-sm)" }}>
                <span className="text-gray-500">--font-size-sm:</span> Texto pequeño
              </p>
              <p style={{ fontSize: "var(--font-size-base)" }}>
                <span className="text-gray-500">--font-size-base:</span> Texto base
              </p>
              <p style={{ fontSize: "var(--font-size-lg)" }}>
                <span className="text-gray-500">--font-size-lg:</span> Texto grande
              </p>
              <p style={{ fontSize: "var(--font-size-xl)" }}>
                <span className="text-gray-500">--font-size-xl:</span> Texto extra grande
              </p>
              <p style={{ fontSize: "var(--font-size-2xl)" }}>
                <span className="text-gray-500">--font-size-2xl:</span> 2XL
              </p>
            </div>
          </div>

          {/* Pesos de fuente */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg">Pesos de fuente</h3>
            <div className="space-y-2">
              <p style={{ fontWeight: "var(--font-weight-normal)" }}>
                <span className="text-gray-500">--font-weight-normal:</span> Peso normal
              </p>
              <p style={{ fontWeight: "var(--font-weight-medium)" }}>
                <span className="text-gray-500">--font-weight-medium:</span> Peso medio
              </p>
              <p style={{ fontWeight: "var(--font-weight-semibold)" }}>
                <span className="text-gray-500">--font-weight-semibold:</span> Peso semi-negrita
              </p>
              <p style={{ fontWeight: "var(--font-weight-bold)" }}>
                <span className="text-gray-500">--font-weight-bold:</span> Peso negrita
              </p>
              <p style={{ fontWeight: "var(--font-weight-extrabold)" }}>
                <span className="text-gray-500">--font-weight-extrabold:</span> Peso extra-negrita
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Altura de línea */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg">Altura de línea</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">--line-height-none (1):</p>
                <p style={{ lineHeight: "var(--line-height-none)" }} className="bg-gray-100 dark:bg-gray-800 p-2">
                  Este es un ejemplo de texto con altura de línea none. Este es un ejemplo de texto con altura de línea
                  none. Este es un ejemplo de texto con altura de línea none.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">--line-height-tight (1.25):</p>
                <p style={{ lineHeight: "var(--line-height-tight)" }} className="bg-gray-100 dark:bg-gray-800 p-2">
                  Este es un ejemplo de texto con altura de línea tight. Este es un ejemplo de texto con altura de línea
                  tight. Este es un ejemplo de texto con altura de línea tight.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">--line-height-normal (1.5):</p>
                <p style={{ lineHeight: "var(--line-height-normal)" }} className="bg-gray-100 dark:bg-gray-800 p-2">
                  Este es un ejemplo de texto con altura de línea normal. Este es un ejemplo de texto con altura de
                  línea normal. Este es un ejemplo de texto con altura de línea normal.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">--line-height-relaxed (1.625):</p>
                <p style={{ lineHeight: "var(--line-height-relaxed)" }} className="bg-gray-100 dark:bg-gray-800 p-2">
                  Este es un ejemplo de texto con altura de línea relaxed. Este es un ejemplo de texto con altura de
                  línea relaxed. Este es un ejemplo de texto con altura de línea relaxed.
                </p>
              </div>
            </div>
          </div>

          {/* Espaciado de letras */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg">Espaciado de letras</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">--letter-spacing-tighter (-0.05em):</p>
                <p
                  style={{ letterSpacing: "var(--letter-spacing-tighter)" }}
                  className="bg-gray-100 dark:bg-gray-800 p-2"
                >
                  Este es un ejemplo de texto con espaciado de letras más ajustado.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">--letter-spacing-normal (0):</p>
                <p
                  style={{ letterSpacing: "var(--letter-spacing-normal)" }}
                  className="bg-gray-100 dark:bg-gray-800 p-2"
                >
                  Este es un ejemplo de texto con espaciado de letras normal.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">--letter-spacing-wide (0.025em):</p>
                <p style={{ letterSpacing: "var(--letter-spacing-wide)" }} className="bg-gray-100 dark:bg-gray-800 p-2">
                  Este es un ejemplo de texto con espaciado de letras amplio.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">--letter-spacing-widest (0.1em):</p>
                <p
                  style={{ letterSpacing: "var(--letter-spacing-widest)" }}
                  className="bg-gray-100 dark:bg-gray-800 p-2"
                >
                  Este es un ejemplo de texto con espaciado de letras muy amplio.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="test-heading" style={{ fontSize: "var(--font-size-2xl)" }}>
          Roles de tipografía
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Fuente para Navbar</h3>
            <p style={{ fontFamily: "var(--font-navbar)" }} className="text-lg">
              Esta es la fuente para la barra de navegación (Inter)
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Fuente para Títulos</h3>
            <p style={{ fontFamily: "var(--font-headings)" }} className="text-lg">
              Esta es la fuente para títulos (IBM Mono)
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Fuente para Cuerpo</h3>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-lg">
              Esta es la fuente para el cuerpo del texto (Open Sans)
            </p>
          </div>
        </div>

        <h2 className="test-heading" style={{ fontSize: "var(--font-size-2xl)" }}>
          Colores
        </h2>

        <div className="flex flex-wrap gap-4 mb-8">
          {["primary", "secondary", "accent", "muted", "destructive"].map((color) => (
            <div key={color} className="text-center">
              <div className="w-16 h-16 rounded-md mb-2" style={{ backgroundColor: `hsl(var(--${color}))` }}></div>
              <span className="text-sm">{color}</span>
            </div>
          ))}
        </div>

        <h2 className="test-heading" style={{ fontSize: "var(--font-size-2xl)" }}>
          Espaciado
        </h2>

        <div className="flex items-end gap-2 mb-8">
          {[2, 4, 6, 8, 12].map((size) => (
            <div key={size} className="text-center">
              <div
                className="bg-primary/20 border border-primary/30"
                style={{
                  width: `var(--spacing-${size})`,
                  height: `var(--spacing-${size})`,
                }}
              ></div>
              <span className="text-xs mt-1 block">{size}</span>
            </div>
          ))}
        </div>

        <h2 className="test-heading" style={{ fontSize: "var(--font-size-2xl)" }}>
          Componentes
        </h2>

        <div className="flex gap-4 mb-8">
          <button className="test-button">Botón Primario</button>
          <button
            className="test-button"
            style={{
              backgroundColor: "hsl(var(--secondary))",
              color: "hsl(var(--secondary-foreground))",
            }}
          >
            Botón Secundario
          </button>
        </div>

        <h2 className="test-heading" style={{ fontSize: "var(--font-size-2xl)" }}>
          Animaciones y Transiciones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Transiciones</h3>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md mb-4 w-full"
              style={{ transition: "var(--transition-colors)" }}
            >
              Transición de colores (hover)
            </button>
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-full hover:scale-105"
              style={{ transition: "var(--transition-transform)" }}
            >
              Transición de transformación (hover)
            </button>
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md w-full hover:opacity-50"
              style={{ transition: "var(--transition-opacity)" }}
            >
              Transición de opacidad (hover)
            </button>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Duraciones</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">--duration-fast (150ms):</p>
                <div
                  className="h-8 bg-primary/50 hover:w-full w-1/4"
                  style={{ transition: `width var(--duration-fast) var(--ease-in-out)` }}
                ></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">--duration-normal (200ms):</p>
                <div
                  className="h-8 bg-primary/50 hover:w-full w-1/4"
                  style={{ transition: `width var(--duration-normal) var(--ease-in-out)` }}
                ></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">--duration-slow (300ms):</p>
                <div
                  className="h-8 bg-primary/50 hover:w-full w-1/4"
                  style={{ transition: `width var(--duration-slow) var(--ease-in-out)` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <p className="test-paragraph">
          Este es solo un ejemplo de cómo podemos usar nuestras variables CSS para crear componentes consistentes y
          fáciles de mantener.
        </p>
      </div>
    </div>
  )
}


