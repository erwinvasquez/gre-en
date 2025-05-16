# Sistema de Animaciones

Este documento describe el sistema de animaciones centralizado utilizado en el proyecto, explicando su arquitectura, uso y cómo realizar modificaciones.

## Arquitectura del Sistema

El sistema de animaciones está dividido en dos partes complementarias que trabajan juntas:

### 1. Configuración Visual (CSS)

**Ubicación**: `src/styles/tokens/animation-tokens.css`

Esta parte define todas las **variables CSS** que controlan el aspecto visual de las animaciones:

- Duraciones (qué tan rápido ocurre una animación)
- Curvas de temporización (cómo progresa la animación en el tiempo)
- Distancias (cuánto se mueve un elemento)
- Valores de filtros (desenfoque, escala, rotación)

Ejemplo:
\`\`\`css
:root {
  --animation-duration-base: 1000ms;
  --animation-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
\`\`\`

### 2. Configuración Lógica (TypeScript)

**Ubicación**: `src/lib/animation-config.ts`

Esta parte define la **interfaz programática** del sistema:

- Tipos TypeScript para autocompletado y validación
- Valores predeterminados para hooks y componentes
- Configuración de thresholds para detección de scroll
- Funciones utilitarias para generar clases CSS

Ejemplo:
\`\`\`typescript
export const DEFAULT_SCROLL_DETECTION: ScrollDetectionConfig = {
  threshold: 0.1,
  rootMargin: "0px",
  once: true,
  // ...
}
\`\`\`

### 3. Implementación CSS

**Ubicación**: `src/styles/animations/scroll-animations.css`

Este archivo contiene las clases CSS y keyframes que implementan las animaciones, utilizando las variables definidas en `animation-tokens.css`.

## Razón de esta División

Esta arquitectura sigue un patrón común en sistemas de diseño modernos:

1. **Separación de responsabilidades**:
   - CSS maneja el aspecto visual (cómo se ve y se comporta la animación)
   - TypeScript maneja la lógica (cuándo y cómo se activa la animación)

2. **Flexibilidad para diferentes roles**:
   - Diseñadores pueden modificar variables CSS sin tocar código TypeScript
   - Desarrolladores pueden modificar la lógica sin afectar el aspecto visual

3. **Compatibilidad técnica**:
   - Las variables CSS pueden ser utilizadas directamente en estilos
   - Los tipos y constantes TypeScript proporcionan seguridad de tipos y autocompletado

## Cómo Modificar el Sistema

### Modificar Aspectos Visuales

Para cambiar cómo se ven o comportan las animaciones:

1. Edita `src/styles/tokens/animation-tokens.css`
2. Modifica las variables CSS según sea necesario

Ejemplos:
- Para hacer todas las animaciones más rápidas: reduce `--animation-duration-base`
- Para cambiar la curva de rebote: modifica `--animation-easing-bounce`

### Modificar Aspectos Lógicos

Para cambiar cuándo o cómo se activan las animaciones:

1. Edita `src/lib/animation-config.ts`
2. Modifica las constantes o tipos según sea necesario

Ejemplos:
- Para cambiar cuándo se activan las animaciones: modifica `threshold` en `DEFAULT_SCROLL_DETECTION`
- Para cambiar cuándo una sección se considera activa: modifica `threshold` en `DEFAULT_SECTION_DETECTION`

### Añadir Nuevas Animaciones

Para añadir un nuevo tipo de animación:

1. Añade clases CSS y keyframes en `src/styles/animations/scroll-animations.css`
2. Añade el nuevo tipo a `AnimationType` en `src/lib/animation-config.ts`
3. Opcionalmente, añade variables específicas en `src/styles/tokens/animation-tokens.css`

## Valores Disponibles

### Duraciones

| Nombre | Valor | Variable CSS |
|--------|-------|--------------|
| fastest | 200ms | `--animation-duration-fastest` |
| fast | 400ms | `--animation-duration-fast` |
| normal | 1000ms | `--animation-duration-normal` |
| slow | 1500ms | `--animation-duration-slow` |
| slower | 2000ms | `--animation-duration-slower` |
| slowest | 3000ms | `--animation-duration-slowest` |

### Curvas de Temporización (Easing)

| Nombre | Descripción | Variable CSS |
|--------|-------------|--------------|
| linear | Velocidad constante | `--animation-easing-linear` |
| in | Aceleración al inicio | `--animation-easing-in` |
| out | Desaceleración al final | `--animation-easing-out` |
| in-out | Aceleración y desaceleración | `--animation-easing-in-out` |
| bounce | Efecto de rebote | `--animation-easing-bounce` |
| elastic | Efecto elástico | `--animation-easing-elastic` |

### Thresholds

| Nombre | Valor | Ubicación |
|--------|-------|-----------|
| Animaciones generales | 0.1 | `DEFAULT_SCROLL_DETECTION.threshold` |
| Detección de secciones | 0.6 | `DEFAULT_SECTION_DETECTION.threshold` |

## Mejores Prácticas

1. **Mantén la consistencia**: Usa las variables y constantes existentes en lugar de valores hardcodeados
2. **Documenta los cambios**: Si añades nuevas variables o tipos, actualiza esta documentación
3. **Prueba en diferentes dispositivos**: Las animaciones pueden comportarse diferente en móviles vs. escritorio
4. **Considera la accesibilidad**: Algunas personas prefieren animaciones reducidas o ninguna animación

## Evolución Futura

En el futuro, este sistema podría evolucionar hacia un enfoque más unificado siguiendo las mejores prácticas de la industria:

1. Definir tokens en un formato neutral (JSON/YAML)
2. Generar automáticamente variables CSS y constantes TypeScript
3. Mantener una única fuente de verdad para todos los tokens

## Uso Básico

### Usando el Componente AnimatedElement

\`\`\`jsx
<AnimatedElement 
  animation="fade-in" 
  duration="slow" 
  delay={300}
>
  Este contenido aparecerá gradualmente cuando entre en el viewport
</AnimatedElement>
\`\`\`

### Usando Clases CSS Directamente

\`\`\`jsx
<div className="animate-on-scroll fade-in duration-slow delay-300">
  Este contenido aparecerá gradualmente cuando entre en el viewport
</div>
\`\`\`

### Usando el Hook useScrollAnimation

\`\`\`jsx
function MyComponent() {
  const elementRef = useScrollAnimation({
    threshold: 0.2,
    once: true
  });
  
  return (
    <div ref={elementRef} className="animate-on-scroll fade-in">
      Este contenido aparecerá gradualmente cuando entre en el viewport
    </div>
  );
}
