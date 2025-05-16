# Sistema de Tokens de Componentes

Este documento describe el sistema de tokens de componentes implementado en nuestro proyecto para mantener una apariencia consistente y facilitar el mantenimiento.

## ¿Qué son los tokens de componentes?

Los tokens de componentes son variables CSS específicas para componentes que permiten modificar la apariencia de un componente desde un solo lugar. Estos tokens se basan en los tokens primitivos y semánticos, pero están enfocados en componentes específicos.

## Estructura del Sistema

Los tokens de componentes están definidos en `src/styles/variables/components.css` y se organizan por componente:

\`\`\`css
:root {
  /* Navbar */
  --navbar-font-size: var(--font-size-xs);
  --navbar-font-weight: var(--font-weight-extrabold);
  --navbar-text-transform: uppercase;
  --navbar-height: 4rem; /* 64px */
  --navbar-padding: 0.75rem; /* 12px */
  
  /* Footer */
  --footer-bg: var(--color-black);
  --footer-text: var(--color-white);
  /* ... */
}
\`\`\`

## Cómo Usar los Tokens de Componentes

### Modificar un componente

Para modificar la apariencia de un componente, simplemente cambia el valor de la variable correspondiente:

\`\`\`css
:root {
  /* Cambiar el tamaño de fuente del navbar */
  --navbar-font-size: var(--font-size-sm); /* Cambiado de xs a sm */
}
\`\`\`

### Crear tokens para nuevos componentes

Cuando crees un nuevo componente, añade sus tokens al archivo `components.css`:

\`\`\`css
:root {
  /* Mi nuevo componente */
  --mi-componente-bg: var(--color-white);
  --mi-componente-text: var(--color-black);
  --mi-componente-padding: var(--spacing-4);
}
\`\`\`

### Usar tokens en componentes

En tus componentes, usa los tokens en lugar de valores hardcodeados:

\`\`\`css
.mi-componente {
  background-color: var(--mi-componente-bg);
  color: var(--mi-componente-text);
  padding: var(--mi-componente-padding);
}
\`\`\`

## Beneficios

- **Centralización**: Todos los estilos de un componente se pueden modificar desde un solo lugar
- **Consistencia**: Los componentes mantienen una apariencia consistente
- **Mantenibilidad**: Facilita el mantenimiento y la actualización de estilos
- **Tematización**: Facilita la creación de temas alternativos

## Tokens Disponibles

### Navbar
- `--navbar-font-size`: Tamaño de fuente del navbar
- `--navbar-font-weight`: Peso de fuente del navbar
- `--navbar-text-transform`: Transformación de texto del navbar
- `--navbar-height`: Altura del navbar
- `--navbar-padding`: Padding interno del navbar

### Footer
- `--footer-bg`: Color de fondo del footer
- `--footer-text`: Color de texto del footer
- `--footer-padding-y`: Padding vertical del footer

### Buttons
- `--button-primary-bg`: Color de fondo del botón primario
- `--button-primary-text`: Color de texto del botón primario
- `--button-primary-hover-bg`: Color de fondo al hover del botón primario
- `--button-padding-x`: Padding horizontal de los botones
- `--button-padding-y`: Padding vertical de los botones
- `--button-border-radius`: Radio de borde de los botones
- `--button-transition`: Transición de los botones

### Cards
- `--card-padding`: Padding interno de las tarjetas
- `--card-border-radius`: Radio de borde de las tarjetas
- `--card-shadow`: Sombra de las tarjetas
- `--card-hover-shadow`: Sombra al hover de las tarjetas
- `--card-transition`: Transición de las tarjetas
