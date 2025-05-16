# Sistema de Colores y Temas

Este documento describe la arquitectura, uso y personalización del sistema de colores y temas de la aplicación.

## Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Variables de Color Base](#variables-de-color-base)
3. [Variables Semánticas por Tema](#variables-semánticas-por-tema)
4. [Integración con Tailwind](#integración-con-tailwind)
5. [Guías de Personalización](#guías-de-personalización)
6. [Implementación del Cambio de Tema](#implementación-del-cambio-de-tema)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Ejemplos Prácticos](#ejemplos-prácticos)

## Arquitectura del Sistema

El sistema de colores sigue una arquitectura de tres niveles que separa los colores base de su uso semántico y su implementación en Tailwind:

\`\`\`
┌─────────────────────────┐
│ Nivel 1: Colores Base   │ → src/styles/variables/base.css
│ (Variables Primitivas)  │   Define todos los colores base en formato HSL
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ Nivel 2: Colores        │ → src/styles/themes/light.css y dark.css
│ Semánticos (Por Tema)   │   Asigna colores base a roles semánticos
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ Nivel 3: Configuración  │ → tailwind.config.ts
│ de Tailwind             │   Mapea variables CSS a clases de Tailwind
└─────────────────────────┘
\`\`\`

Esta arquitectura permite:
- Cambiar colores base y afectar a todos los lugares donde se usan
- Modificar asignaciones semánticas sin cambiar los colores base
- Mantener coherencia entre temas claro y oscuro
- Usar los colores fácilmente con clases de Tailwind

## Variables de Color Base

Las variables de color base se definen en `src/styles/variables/base.css` usando el formato HSL (Hue, Saturation, Lightness):

\`\`\`css
:root {
  /* Colores base */
  --color-white: 0 0% 100%;
  --color-black: 0 0% 3.9%;

  /* Colores adicionales */
  --color-carbon-gray: 215 28% 17%;
  --color-bone-white: 60 9% 98%;
  --color-forest-green: 150 63% 30%;
  --color-lime-green: 120 61% 50%;
  --color-deep-blue: 220 70% 40%;
  --color-light-gray: 220 14% 96%;

  /* Paleta de grises */
  --color-gray-50: 0 0% 98%;
  --color-gray-100: 0 0% 96.1%;
  /* ... más valores de gris ... */

  /* Colores de acento - Dorado */
  --color-gold-300: 51 100% 55%;
  --color-gold-400: 51 100% 50%;
  --color-gold-500: 51 100% 45%; /* #E6C200 - dorado intermedio */
  --color-gold-600: 51 100% 40%;
  --color-gold-700: 51 100% 35%;

  /* Colores semánticos */
  --color-destructive-light: 0 84.2% 60.2%;
  --color-destructive-dark: 0 62.8% 30.6%;

  /* Colores para gráficos */
  --color-chart-1-light: 12 76% 61%;
  --color-chart-2-light: 173 58% 39%;
  /* ... más colores para gráficos ... */
}
\`\`\`

### Nomenclatura de Variables

- `--color-[nombre]`: Colores base generales
- `--color-[nombre]-[número]`: Variaciones de un color (ej: `--color-gray-500`)
- `--color-[nombre]-[light/dark]`: Variantes para temas específicos

### Formato HSL

Los colores se definen en formato HSL sin la función `hsl()`:
- `H`: Tono (0-360)
- `S`: Saturación (0-100%)
- `L`: Luminosidad (0-100%)

Ejemplo: `215 28% 17%` representa:
- Tono: 215 (azul)
- Saturación: 28%
- Luminosidad: 17%

Este formato facilita la manipulación de colores y es compatible con Tailwind.

## Variables Semánticas por Tema

Las variables semánticas asignan colores base a roles específicos en la interfaz. Se definen en archivos separados para cada tema:

### Tema Claro (`src/styles/themes/light.css`)

\`\`\`css
:root {
  /* Colores semánticos - Tema claro */
  --background: var(--color-bone-white);
  --foreground: var(--color-carbon-gray);

  --card: var(--color-white);
  --card-foreground: var(--color-carbon-gray);

  --primary: var(--color-forest-green);
  --primary-foreground: var(--color-white);

  --secondary: var(--color-deep-blue);
  --secondary-foreground: var(--color-white);

  --accent: var(--color-lime-green);
  --accent-foreground: var(--color-carbon-gray);

  /* ... más variables semánticas ... */
}
\`\`\`

### Tema Oscuro (`src/styles/themes/dark.css`)

\`\`\`css
.dark {
  /* Colores semánticos - Tema oscuro */
  --background: var(--color-carbon-gray);
  --foreground: var(--color-bone-white);

  --card: var(--color-gray-900);
  --card-foreground: var(--color-gray-50);

  --primary: var(--color-forest-green);
  --primary-foreground: var(--color-white);

  /* ... más variables semánticas ... */
}
\`\`\`

### Roles Semánticos Principales

| Variable | Descripción | Uso típico |
|----------|-------------|------------|
| `--background` | Color de fondo principal | Fondo de página |
| `--foreground` | Color de texto principal | Texto general |
| `--primary` | Color principal de la marca | Botones principales, acentos |
| `--secondary` | Color secundario | Botones secundarios |
| `--accent` | Color de acento | Destacados, elementos interactivos |
| `--muted` | Color atenuado | Fondos secundarios, texto menos importante |
| `--card` | Fondo de tarjetas | Componentes tipo tarjeta |
| `--destructive` | Color de error/peligro | Mensajes de error, botones de eliminar |
| `--border` | Color de bordes | Bordes de elementos |

## Integración con Tailwind

El sistema se integra con Tailwind a través de la configuración en `tailwind.config.ts`:

\`\`\`typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        /* ... más colores ... */
      },
    },
  },
}
\`\`\`

### Uso en Clases de Tailwind

Esto permite usar los colores semánticos directamente en clases de Tailwind:

\`\`\`jsx
<button className="bg-primary text-primary-foreground">
  Botón Principal
</button>

<div className="bg-background text-foreground">
  Contenido con colores de tema
</div>

<div className="border-border">
  Elemento con borde temático
</div>
\`\`\`

### Ventajas de este Enfoque

1. **Cambio automático de tema**: Los colores se actualizan automáticamente al cambiar de tema
2. **Consistencia**: Todos los componentes usan la misma paleta de colores
3. **Mantenibilidad**: Cambiar un color semántico afecta a todos los lugares donde se usa

## Guías de Personalización

### 1. Cambiar Colores Base

Para cambiar un color base (afecta a todos los lugares donde se usa):

1. Abre `src/styles/variables/base.css`
2. Localiza la variable de color que quieres modificar
3. Cambia los valores HSL

\`\`\`css
/* Ejemplo: Cambiar el verde forestal a un tono más azulado */
:root {
  --color-forest-green: 160 63% 30%; /* Cambiado de 150 63% 30% */
}
\`\`\`

### 2. Cambiar Asignaciones Semánticas

Para cambiar qué color base se usa para un rol semántico:

1. Abre `src/styles/themes/light.css` y/o `src/styles/themes/dark.css`
2. Localiza la variable semántica que quieres modificar
3. Cambia la referencia al color base

\`\`\`css
/* Ejemplo: Cambiar el color primario a dorado en lugar de verde */
:root {
  --primary: var(--color-gold-500); /* Cambiado de var(--color-forest-green) */
}
\`\`\`

### 3. Añadir un Nuevo Color Base

Para añadir un nuevo color base:

1. Abre `src/styles/variables/base.css`
2. Añade la nueva variable de color
3. Usa un nombre descriptivo y sigue la convención de nomenclatura

\`\`\`css
:root {
  /* Añadir un nuevo color púrpura */
  --color-royal-purple: 270 70% 40%;
}
\`\`\`

### 4. Añadir un Nuevo Rol Semántico

Para añadir un nuevo rol semántico:

1. Añade la variable en ambos archivos de tema
2. Actualiza la configuración de Tailwind si es necesario

\`\`\`css
/* En light.css */
:root {
  --highlight: var(--color-gold-400);
  --highlight-foreground: var(--color-black);
}

/* En dark.css */
.dark {
  --highlight: var(--color-gold-600);
  --highlight-foreground: var(--color-white);
}
\`\`\`

\`\`\`typescript
// En tailwind.config.ts
colors: {
  // ... colores existentes ...
  highlight: {
    DEFAULT: "hsl(var(--highlight))",
    foreground: "hsl(var(--highlight-foreground))",
  },
}
\`\`\`

## Implementación del Cambio de Tema

El cambio de tema se implementa mediante:

1. **Clase CSS en el elemento HTML**: La clase `dark` se añade/elimina del elemento `<html>`
2. **Estado en Redux**: El estado del tema se almacena en Redux
3. **Persistencia**: La preferencia se guarda en localStorage

### Componentes Clave

- `src/components/theme-toggle/ThemeToggle.tsx`: Botón para cambiar el tema
- `src/providers/ThemeProvider.tsx`: Proveedor que gestiona el estado del tema
- `src/redux/slices/themeSlice.ts`: Slice de Redux para el estado del tema

### Flujo de Cambio de Tema

1. Usuario hace clic en el botón de cambio de tema
2. Se dispara la acción Redux para cambiar el tema
3. El reducer actualiza el estado
4. El ThemeProvider detecta el cambio y actualiza la clase en el HTML
5. Las variables CSS del tema correspondiente se aplican
6. La preferencia se guarda en localStorage

## Mejores Prácticas

### 1. Mantener la Coherencia entre Temas

- Asegúrate de que ambos temas (claro y oscuro) tengan las mismas variables semánticas
- Mantén un contraste adecuado en ambos temas
- Prueba todos los cambios en ambos temas

### 2. Usar Variables Semánticas, No Colores Base

\`\`\`jsx
// ✅ CORRECTO: Usar variables semánticas
<div className="bg-primary text-primary-foreground">

// ❌ INCORRECTO: Usar colores base directamente
<div className="bg-[#2D8B4E] text-white">
\`\`\`

### 3. Seguir la Jerarquía de Tres Niveles

- Nivel 1: Define colores base en `base.css`
- Nivel 2: Asigna roles semánticos en archivos de tema
- Nivel 3: Usa las variables semánticas en componentes

### 4. Considerar la Accesibilidad

- Mantén un ratio de contraste mínimo de 4.5:1 para texto normal
- Prueba con herramientas de accesibilidad
- Considera usuarios con daltonismo

## Ejemplos Prácticos

### Ejemplo 1: Cambiar el Color Primario

Para cambiar el color primario de verde a azul:

\`\`\`css
/* En src/styles/variables/base.css (opcional, si quieres añadir un nuevo color) */
:root {
  --color-royal-blue: 225 70% 40%;
}

/* En src/styles/themes/light.css */
:root {
  --primary: var(--color-royal-blue); /* o var(--color-deep-blue) si ya existe */
}

/* En src/styles/themes/dark.css */
.dark {
  --primary: var(--color-royal-blue); /* o var(--color-deep-blue) si ya existe */
}
\`\`\`

### Ejemplo 2: Crear un Tema de Alto Contraste

\`\`\`css
/* En src/styles/themes/high-contrast.css (nuevo archivo) */
.high-contrast {
  --background: var(--color-black);
  --foreground: var(--color-white);
  
  --primary: var(--color-gold-400);
  --primary-foreground: var(--color-black);
  
  --secondary: var(--color-lime-green);
  --secondary-foreground: var(--color-black);
  
  /* ... más variables ... */
}
\`\`\`

### Ejemplo 3: Ajustar Colores para una Campaña Especial

\`\`\`css
/* En un nuevo archivo src/styles/campaigns/christmas.css */
:root.christmas {
  --primary: var(--color-red-500);
  --secondary: var(--color-green-500);
  --accent: var(--color-gold-400);
  
  /* Colores específicos de campaña */
  --campaign-highlight: var(--color-red-400);
  --campaign-background: linear-gradient(to bottom, hsl(var(--color-green-900)), hsl(var(--color-green-800)));
}
\`\`\`

### Ejemplo 4: Personalización por Cliente

Para implementar temas específicos por cliente:

\`\`\`css
/* En src/styles/clients/client-a.css */
:root.client-a {
  --primary: var(--color-blue-500);
  --secondary: var(--color-purple-500);
  --accent: var(--color-cyan-400);
  
  /* Logo y colores de marca */
  --client-logo-primary: var(--color-blue-600);
  --client-logo-secondary: var(--color-blue-400);
}
\`\`\`

---

## Recursos Adicionales

- [Guía de Tailwind sobre Temas](https://tailwindcss.com/docs/dark-mode)
- [Calculadora de Contraste WCAG](https://contrast-ratio.com/)
- [Herramienta de Conversión de Colores](https://convertacolor.com/)
