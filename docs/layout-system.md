# Sistema de Layout

Este documento describe el sistema de layout utilizado en el proyecto, que sigue las mejores prácticas de desarrollo moderno.

## Componentes Principales

El sistema de layout se basa en dos componentes principales:

### 1. Section

El componente `Section` define una sección semántica del documento. No impone restricciones de ancho al contenido, permitiendo elementos de ancho completo.

\`\`\`tsx
import { Section } from "@/components/ui/section";

<Section id="hero" fullHeight={false}>
  {/* Contenido de ancho completo */}
</Section>
\`\`\`

#### Propiedades

| Propiedad   | Tipo                         | Predeterminado | Descripción                                           |
|-------------|------------------------------|----------------|-------------------------------------------------------|
| id          | string                       | -              | ID único para la sección                              |
| fullHeight  | boolean                      | true           | Si la sección debe ocupar al menos la altura completa |
| noPadding   | boolean                      | false          | Si la sección no debe tener padding vertical          |
| centered    | boolean                      | false          | Si el contenido debe centrarse                        |
| as          | "section" \| "div" \| "article" | "section"      | Elemento HTML a renderizar                            |
| bgColor     | string                       | -              | Color de fondo opcional                               |
| className   | string                       | -              | Clases CSS adicionales                                |

### 2. Container

El componente `Container` limita el ancho del contenido y lo centra horizontalmente. Está diseñado para usarse dentro de `Section`.

\`\`\`tsx
import { Container } from "@/components/ui/container";

<Container size="default">
  {/* Contenido de ancho limitado */}
</Container>
\`\`\`

#### Propiedades

| Propiedad   | Tipo                                           | Predeterminado | Descripción                                    |
|-------------|------------------------------------------------|----------------|------------------------------------------------|
| size        | "small" \| "default" \| "medium" \| "large" \| "full" | "default"      | Tamaño del contenedor (ancho máximo)           |
| withPadding | boolean                                        | true           | Si el contenedor debe tener padding horizontal |
| centered    | boolean                                        | true           | Si el contenedor debe centrarse                |
| as          | React.ElementType                              | "div"          | Elemento HTML a renderizar                     |
| className   | string                                         | -              | Clases CSS adicionales                         |

## Patrones de Uso

### Patrón Básico

\`\`\`tsx
<Section id="about">
  <Container>
    <h2>Acerca de Nosotros</h2>
    <p>Contenido limitado en ancho y centrado.</p>
  </Container>
</Section>
\`\`\`

### Imagen de Ancho Completo con Contenido Limitado

\`\`\`tsx
<Section id="hero" noPadding>
  {/* Imagen de ancho completo */}
  <img 
    src="/images/hero.jpg" 
    alt="Hero" 
    className="w-full h-80 object-cover"
  />
  
  {/* Contenido limitado */}
  <Container className="py-12">
    <h1 className="text-4xl font-bold">Bienvenido a Nuestra Web</h1>
    <p className="mt-4">Este contenido tiene un ancho máximo y está centrado.</p>
  </Container>
</Section>
\`\`\`

### Sección con Fondo de Color

\`\`\`tsx
<Section id="features" bgColor="bg-gray-100">
  <Container>
    <h2 className="text-3xl font-bold">Características</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Tarjetas de características */}
    </div>
  </Container>
</Section>
\`\`\`

### Contenedores Anidados

\`\`\`tsx
<Section id="pricing">
  <Container size="large">
    <h2 className="text-3xl font-bold text-center">Precios</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {/* Para cada tarjeta de precio, usamos un contenedor más pequeño */}
      <Container size="small" className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">Plan Básico</h3>
        <p className="mt-2">Descripción del plan</p>
      </Container>
      
      {/* Más tarjetas... */}
    </div>
  </Container>
</Section>
\`\`\`

## Tamaños de Contenedor

El componente `Container` ofrece varios tamaños predefinidos:

| Tamaño  | Clase Tailwind | Ancho Máximo |
|---------|----------------|--------------|
| small   | max-w-3xl      | 768px        |
| default | max-w-5xl      | 1024px       |
| medium  | max-w-6xl      | 1280px       |
| large   | max-w-7xl      | 1536px       |
| full    | max-w-none     | Sin límite   |

## Mejores Prácticas

1. **Usa `Section` para definir secciones semánticas** de tu página.
2. **Usa `Container` para limitar el ancho del contenido** dentro de las secciones.
3. **Para elementos de ancho completo**, colócalos directamente dentro de `Section`, fuera de `Container`.
4. **Para contenido principal**, colócalo dentro de `Container` para mantener una buena legibilidad.
5. **Ajusta el tamaño del contenedor** según la densidad de información y el tipo de contenido.
