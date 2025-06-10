# Sistema de Variables CSS

Este documento describe el sistema de variables CSS implementado en nuestro proyecto para mantener una apariencia consistente y facilitar el mantenimiento.

## Estructura del Sistema

El sistema de variables CSS está organizado en varios archivos:

\`\`\`
src/styles/
├── index.css                # Archivo principal que importa todos los demás
├── font-optimization.css    # Optimización de carga de fuentes
├── variables/
│   ├── base.css            # Colores base y dimensiones
│   ├── typography.css      # Variables de tipografía
│   ├── animations.css      # Animaciones y transiciones
│   └── layout.css          # Espaciado, contenedores y z-index
└── themes/
    ├── light.css           # Tema claro
    └── dark.css            # Tema oscuro
\`\`\`

## Cómo Usar las Variables

### Colores

Los colores están definidos en formato HSL para facilitar la manipulación de opacidad:

\`\`\`css
/* Uso de colores */
.mi-elemento {
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
  border-color: hsl(var(--border));
}

/* Con opacidad */
.mi-elemento-transparente {
  background-color: hsl(var(--primary) / 0.5); /* 50% de opacidad */
}
\`\`\`

### Tipografía

#### Familias de Fuentes

Tenemos tres familias de fuentes principales:
- `--font-sans` (Inter): Para interfaces y texto general
- `--font-mono` (IBM Mono): Para código y datos técnicos
- `--font-open` (Open Sans): Para texto de lectura

Y tres roles semánticos:
- `--font-navbar`: Para la barra de navegación (actualmente usa Inter)
- `--font-headings`: Para títulos (actualmente usa IBM Mono)
- `--font-body`: Para el cuerpo del texto (actualmente usa Open Sans)

Puedes usar estas variables directamente en CSS:

\`\`\`css
.mi-titulo {
  font-family: var(--font-headings);
}
\`\`\`

O usar las clases utilitarias de Tailwind:

```html
<h1 class="font-headings">Mi Título</h1>
<p class="font-body">Mi párrafo</p>
