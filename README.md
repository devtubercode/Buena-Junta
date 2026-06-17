# BuenaJunta

Aplicación web mobile-first para el menú digital y flujo de pedidos de BuenaJunta.

El proyecto se creó para que los clientes puedan consultar la carta desde el celular, elegir productos con sus opciones, armar un carrito y enviar el pedido por WhatsApp de forma clara. También sirve como base técnica para una futura migración del catálogo y los pedidos hacia Supabase sin reescribir la interfaz.

## Propósito

BuenaJunta necesita una experiencia rápida para mesa, QR y compra directa:

- Mostrar una home comercial con promociones y productos destacados.
- Separar el menú digital completo de la pantalla comercial.
- Permitir búsqueda y filtro por categorías.
- Manejar productos con presentaciones o sabores sin confundir al usuario.
- Mantener un carrito persistente entre rutas y recargas.
- Generar un mensaje de pedido legible para WhatsApp.
- Conservar una arquitectura preparada para conectar datos reales desde Supabase.

## Funcionalidades

- Rutas con React Router:
  - `/`: home comercial.
  - `/menu`: menú digital completo.
  - `/carrito`: carrito de compras.
  - `/cart`: alias hacia `/carrito`.
- Catálogo local normalizado con categorías, productos, precios, imágenes y promociones.
- Filtros por categoría con chips horizontales.
- Búsqueda por nombre, descripción, categoría y opciones del producto.
- Cards de producto con botón de agregar al carrito.
- Selección de variantes como sabor o presentación antes de agregar.
- Microcopy contextual para productos con variantes, por ejemplo `Jugo en leche sabor a piña`.
- Carrito global con Zustand y persistencia en `localStorage`.
- Edición de cantidades, eliminación de productos y observaciones por producto.
- Formulario de pedido con responsable, mesa o punto de entrega y observaciones generales.
- Cálculo de subtotales y total en pesos colombianos.
- Envío del pedido por WhatsApp al número configurado.
- Notificaciones con Flashy.js centralizadas en `notify`.
- Tema claro/oscuro con tokens CSS compartidos.
- Iconografía SVG propia en `src/shared/icons`.
- Cliente Supabase preparado para una etapa futura.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS
- Flashy.js
- Supabase JS
- Blossom Carousel

## Estructura

```txt
src/
  app/
    App.tsx
    layouts/AppLayout.tsx
    routes.ts
    styles/index.css
  features/
    cart/
      components/
      store/useCartStore.ts
      utils/
      CartPage.tsx
    home/
    menu/
      components/
      data/menu.ts
      services/menuRepository.ts
      utils/productCopy.ts
    promotions/
  shared/
    components/
    icons/
    notifications/notify.ts
  lib/
    supabase/client.ts
```

## Cómo ejecutar

Instalar dependencias:

```bash
pnpm install
```

Iniciar desarrollo:

```bash
pnpm dev
```

Compilar producción:

```bash
pnpm build
```

Revisar lint:

```bash
pnpm lint
```

Previsualizar build:

```bash
pnpm preview
```

## Configuración

El pedido por WhatsApp se genera en:

```txt
src/features/cart/utils/whatsapp.ts
```

El catálogo local está en:

```txt
src/features/menu/data/menu.ts
```

La capa que normaliza productos para la UI está en:

```txt
src/features/menu/services/menuRepository.ts
```

Las notificaciones se disparan desde:

```txt
src/shared/notifications/notify.ts
```

## Supabase

El proyecto incluye un cliente Supabase en `src/lib/supabase/client.ts`.

Variables esperadas:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

En esta etapa la UI usa datos locales. La estructura ya separa el repositorio de datos para que más adelante `menuRepository` pueda leer categorías, productos, promociones y pedidos desde Supabase.

## Notas de producto

- El carrito no se limpia automáticamente después de abrir WhatsApp, porque abrir WhatsApp no garantiza que el pedido haya sido enviado.
- La mesa es opcional y se puede escribir manualmente.
- Las variantes se redactan en singular cuando corresponden a una sola elección.
- Los productos no disponibles no deben poder agregarse al carrito.
- Los textos visibles están pensados para una experiencia simple, cercana y clara en móvil.

## Verificación recomendada

Antes de entregar cambios:

```bash
pnpm lint
pnpm build
```

También conviene probar manualmente:

- Navegación entre `/`, `/menu` y `/carrito`.
- Agregar producto simple.
- Agregar producto con sabor o presentación.
- Editar cantidades y observaciones.
- Validar envío vacío o sin responsable.
- Abrir WhatsApp y revisar el mensaje generado.
