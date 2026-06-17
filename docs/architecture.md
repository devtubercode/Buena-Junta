# Arquitectura del proyecto

Este proyecto usa una arquitectura feature-first ligera para una app React/Vite de tamano pequeno a mediano. La idea es que cada funcionalidad tenga su propio espacio y que lo compartido viva en carpetas explicitas.

## Objetivos

- Mantener `src/app` pequeno y enfocado en composicion global.
- Agrupar cada funcionalidad dentro de `src/features`.
- Evitar componentes, datos y utilidades mezclados en una sola carpeta.
- Dejar las integraciones externas aisladas en `src/lib`.
- Mantener estilos globales y tema en un unico punto claro.

## Estructura actual

```txt
src/
  app/
    App.tsx
    styles/
      index.css
  assets/
    hero.png
    react.svg
    vite.svg
  features/
    home/
      HomePage.tsx
      components/
        SiteHeader.tsx
    menu/
      components/
        MenuSection.tsx
      data/
        menu.ts
      types.ts
    promotions/
      components/
        PromotionsCarousel.tsx
      data/
        promotions.ts
      types.ts
  lib/
    supabase/
      client.ts
  shared/
    utils/
      motion.ts
  types/
    blossom-carousel-react.d.ts
  main.tsx
```

## Responsabilidades

### `src/main.tsx`

Es el entrypoint de Vite. Debe encargarse solo de montar React e importar estilos globales necesarios.

Actualmente importa:

- `@blossom-carousel/core/style.css`
- `src/app/styles/index.css`
- `App`

### `src/app`

Contiene la composicion raiz de la aplicacion.

- `App.tsx` decide que pantalla o layout principal se renderiza.
- `styles/index.css` contiene Tailwind, tema, fuentes, tokens y estilos globales.

No debe contener logica de negocio ni componentes especificos de una funcionalidad.

### `src/features`

Cada carpeta representa una funcionalidad o area de producto.

Ejemplos actuales:

- `home`: pantalla de inicio y secciones propias de la home.
- `menu`: datos normalizados y render del menu extraido del PDF de BuenaJunta.
- `promotions`: carrusel, datos y tipos de promociones.

Regla practica: si una pieza solo tiene sentido para una funcionalidad, debe vivir dentro de esa feature.

### `src/shared`

Contiene utilidades o componentes reutilizables por varias features.

Ejemplo actual:

- `shared/utils/motion.ts`: helper para `prefers-reduced-motion`.

No se debe poner aqui codigo que solo usa una feature. Primero debe vivir cerca de donde se usa; se mueve a `shared` cuando exista reutilizacion real.

### `src/lib`

Contiene clientes e integraciones externas.

Ejemplo actual:

- `lib/supabase/client.ts`: instancia del cliente Supabase.

La regla es que una feature no configure SDKs directamente. Debe importar un cliente o servicio desde `lib`.

### `src/assets`

Contiene assets estaticos importados desde componentes, como imagenes locales.

Cuando una imagen sea exclusiva de una feature y empiece a crecer el volumen de assets, se puede mover a una carpeta `assets` dentro de esa feature.

### `src/types`

Contiene declaraciones globales o parches de tipos para dependencias externas.

Ejemplo actual:

- `blossom-carousel-react.d.ts`: declaracion local porque el paquete instalado expone tipos incompletos en su publicacion actual.

## Reglas para crecer el proyecto

### Crear una nueva pantalla

Crear una nueva feature si la pantalla representa una nueva area de producto.

Ejemplo:

```txt
src/features/menu/
  MenuPage.tsx
  components/
  data/
  types.ts
```

Luego `src/app/App.tsx` puede decidir como renderizarla o, si se agrega router, registrar la ruta desde la capa `app`.

### Crear un componente

- Si solo lo usa una feature: `src/features/<feature>/components`.
- Si lo usan dos o mas features: `src/shared/components`.
- Si es parte de un sistema UI general, moverlo a `src/shared/ui`.

No mover componentes a `shared` antes de tener reutilizacion real.

### Crear datos mock o constantes de una feature

Usar:

```txt
src/features/<feature>/data/
```

Ejemplo actual:

```txt
src/features/promotions/data/promotions.ts
```

Cuando esos datos pasen a backend, la feature puede reemplazar el archivo `data` por hooks o servicios sin afectar otras features.

### Crear tipos

- Tipos exclusivos de una feature: `src/features/<feature>/types.ts`.
- Tipos compartidos por muchas features: `src/shared/types`.
- Tipos globales o declaraciones de paquetes: `src/types`.

### Crear integraciones externas

Usar `src/lib/<servicio>`.

Ejemplos futuros:

```txt
src/lib/supabase/
src/lib/analytics/
src/lib/payments/
```

Las features deben depender de funciones o clientes ya preparados, no de configuracion global del SDK.

## Convenciones de imports

Actualmente el proyecto usa imports relativos. Mantenerlos cortos y locales:

```ts
import { SiteHeader } from "./components/SiteHeader";
import { promotions } from "../data/promotions";
```

Si los imports empiezan a tener muchos `../../../`, se puede considerar configurar aliases como `@/features`, `@/shared` y `@/lib`, pero no es necesario todavia.

## Estilos y tema

El tema global vive en:

```txt
src/app/styles/index.css
```

Alli estan:

- Import de Google Fonts.
- Import de Tailwind.
- `@theme inline` para tokens Tailwind.
- Variables de color light/dark.
- Fuentes `Manrope` y `Fraunces`.
- Reset global minimo.
- Soporte para `prefers-reduced-motion`.

Los componentes deben preferir clases Tailwind semanticas:

```tsx
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
```

Esto permite que light/dark cambie sin tocar los componentes.

## Dependencias relevantes

- React: UI.
- Vite: build/dev server.
- Tailwind CSS v4: estilos y tema.
- Blossom Carousel: carrusel de promociones.
- Supabase: backend futuro para datos.

## Checklist antes de cerrar cambios

Ejecutar:

```sh
pnpm lint
pnpm build
```

Para cambios visuales, verificar tambien:

- Mobile alrededor de 375px.
- Desktop alrededor de 1280px.
- Sin overflow horizontal.
- Sin errores de consola.
- Interacciones principales funcionando.
