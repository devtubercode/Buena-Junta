# Estructura del proyecto

Arbol comentado de la estructura actual del proyecto BuenaJunta.

```txt
buenajunta/
├── package.json
│   └── Scripts, dependencias y metadata del proyecto React/Vite.
├── pnpm-lock.yaml
│   └── Lockfile de dependencias instaladas con pnpm.
├── skills-lock.json
│   └── Registro de skills/agentes instalados para el entorno de trabajo.
├── index.html
│   └── HTML base usado por Vite para montar la aplicacion.
├── vite.config.ts
│   └── Configura Vite, React, Tailwind, React Compiler y alias @ -> src.
├── eslint.config.js
│   └── Configura ESLint para TypeScript, React Hooks y React Refresh.
├── tsconfig.json
│   └── Archivo raiz de TypeScript con referencias a configuraciones app/node.
├── tsconfig.app.json
│   └── Configuracion TypeScript de la aplicacion.
├── tsconfig.node.json
│   └── Configuracion TypeScript para archivos ejecutados por Node, como Vite.
├── README.md
│   └── Documentacion general del producto, stack y comandos.
│
├── public/
│   ├── site.webmanifest
│   │   └── Manifest de la aplicacion web.
│   ├── favicon.ico
│   │   └── Favicon principal.
│   ├── favicon-16x16.png
│   │   └── Favicon pequeno.
│   ├── favicon-32x32.png
│   │   └── Favicon mediano.
│   ├── apple-touch-icon.png
│   │   └── Icono para dispositivos Apple.
│   ├── android-chrome-192x192.png
│   │   └── Icono instalable Android 192.
│   └── android-chrome-512x512.png
│       └── Icono instalable Android 512.
│
├── docs/
│   ├── architecture.md
│   │   └── Documento de arquitectura general del proyecto.
│   ├── project-structure.md
│   │   └── Este documento; arbol comentado de carpetas y archivos.
│   └── supabase/
│       ├── admin-catalog-policies.sql
│       │   └── Grants y policies para catalogo admin y bucket de imagenes.
│       ├── global-variants-migration.sql
│       │   └── Migracion para eliminar la tabla global temporal de variantes.
│       └── product-image-path-migration.sql
│           └── Migracion para mover imagen principal a products.image_path.
│
└── src/
    ├── main.tsx
    │   └── Punto de entrada React; monta BrowserRouter, AuthProvider y App.
    │
    ├── app/
    │   ├── App.tsx
    │   │   └── Define rutas publicas, rutas admin protegidas y layouts.
    │   ├── routes.ts
    │   │   └── Constantes centralizadas de rutas de la aplicacion.
    │   ├── layouts/
    │   │   └── AppLayout.tsx
    │   │       └── Layout publico con header, contenido y navegacion inferior.
    │   └── styles/
    │       └── index.css
    │           └── Tailwind, tokens, fuentes, tema y estilos globales.
    │
    ├── assets/
    │   ├── buenajunta-logo.webp
    │   │   └── Logo principal usado en header y admin.
    │   └── buenajunta-logo-white-bg.webp
    │       └── Variante del logo con fondo claro.
    │
    ├── lib/
    │   ├── supabase/
    │   │   └── client.ts
    │   │       └── Cliente Supabase configurado con variables Vite.
    │   └── types/
    │       └── database.types.ts
    │           └── Tipos de base de datos para futuras integraciones tipadas.
    │
    ├── types/
    │   └── blossom-carousel-react.d.ts
    │       └── Declaracion local para tipos de Blossom Carousel React.
    │
    ├── features/
    │   ├── admin/
    │   │   ├── AdminLayout.tsx
    │   │   │   └── Layout del panel admin con navegacion desktop/mobile.
    │   │   │
    │   │   ├── components/
    │   │   │   ├── AdminDataState.tsx
    │   │   │   │   └── Estado comun para carga y error en pantallas admin.
    │   │   │   ├── AdminDesktopNavigation.tsx
    │   │   │   │   └── Sidebar desktop colapsable del admin.
    │   │   │   ├── AdminField.tsx
    │   │   │   │   └── Wrapper de campo y clases reutilizables de inputs.
    │   │   │   ├── AdminMobileNavigation.tsx
    │   │   │   │   └── Navegacion admin adaptada a mobile.
    │   │   │   ├── AdminSection.tsx
    │   │   │   │   └── Encabezado y contenedor de secciones admin.
    │   │   │   ├── AdminSkeletons.tsx
    │   │   │   │   └── Skeletons de carga para dashboard, listas y categorias.
    │   │   │   └── adminNavigationItems.ts
    │   │   │       └── Definicion unica de items de navegacion admin.
    │   │   │
    │   │   ├── hooks/
    │   │   │   ├── useAdminResource.ts
    │   │   │   │   └── Hook base para recursos async con loading/error/reload.
    │   │   │   ├── useCategoriesData.ts
    │   │   │   │   └── Hook que carga solo categorias.
    │   │   │   ├── useDashboardData.ts
    │   │   │   │   └── Hook que carga conteos del resumen admin.
    │   │   │   ├── useOptionGroupsData.ts
    │   │   │   │   └── Hook que carga productos y grupos de opciones.
    │   │   │   ├── useOptionsData.ts
    │   │   │   │   └── Hook que carga productos, grupos y valores de opciones.
    │   │   │   ├── useProductDetailData.ts
    │   │   │   │   └── Hook que carga detalle de producto y sus variantes.
    │   │   │   ├── useProductsData.ts
    │   │   │   │   └── Hook que carga lista de productos con categoria/variantes.
    │   │   │   ├── usePromotionDetailData.ts
    │   │   │   │   └── Hook que carga detalle de promocion y datos auxiliares.
    │   │   │   └── usePromotionsData.ts
    │   │   │       └── Hook que carga lista de promociones.
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── LoginPage.tsx
    │   │   │   │   └── Login del admin con email/password.
    │   │   │   ├── DashboardPage.tsx
    │   │   │   │   └── Resumen de conteos y accesos a secciones admin.
    │   │   │   ├── ProductsPage.tsx
    │   │   │   │   └── Lista de productos con imagen, categoria y acciones.
    │   │   │   ├── ProductDetailPage.tsx
    │   │   │   │   └── Crear/editar producto, imagen y variantes.
    │   │   │   ├── CategoriesPage.tsx
    │   │   │   │   └── CRUD de categorias del menu.
    │   │   │   ├── PromotionsPage.tsx
    │   │   │   │   └── Lista de promociones con relaciones e imagen.
    │   │   │   ├── PromotionDetailPage.tsx
    │   │   │   │   └── Crear/editar promocion, vigencia, imagen y relaciones.
    │   │   │   ├── OptionGroupsPage.tsx
    │   │   │   │   └── CRUD de grupos de opciones por producto.
    │   │   │   └── OptionsPage.tsx
    │   │   │       └── CRUD de valores/opciones dentro de grupos.
    │   │   │
    │   │   ├── queries/
    │   │   │   ├── common.ts
    │   │   │   │   └── Cliente Supabase y helper comun de errores.
    │   │   │   ├── types.ts
    │   │   │   │   └── Tipos de filas, inputs y datos de pantallas admin.
    │   │   │   ├── categories.ts
    │   │   │   │   └── Consultas y mutaciones de categorias.
    │   │   │   ├── dashboard.ts
    │   │   │   │   └── Conteos para el dashboard admin.
    │   │   │   ├── products.ts
    │   │   │   │   └── Consultas y mutaciones de productos y variantes.
    │   │   │   ├── promotions.ts
    │   │   │   │   └── Consultas y mutaciones de promociones.
    │   │   │   ├── optionGroups.ts
    │   │   │   │   └── Consultas y mutaciones de grupos de opciones.
    │   │   │   ├── options.ts
    │   │   │   │   └── Consultas y mutaciones de valores de opciones.
    │   │   │   ├── media.ts
    │   │   │   │   └── Upload, eliminacion y URL publica de imagenes.
    │   │   │   └── index.ts
    │   │   │       └── Barrel de exports de queries y tipos.
    │   │   │
    │   │   └── utils/
    │   │       └── adminForms.ts
    │   │           └── Helpers para slug, precios, tags y fechas de formularios.
    │   │
    │   ├── home/
    │   │   ├── HomePage.tsx
    │   │   │   └── Home publica con promociones y seccion de menu.
    │   │   └── components/
    │   │       ├── SiteHeader.tsx
    │   │       │   └── Header publico con logo, links, carrito y tema.
    │   │       └── promotions/
    │   │           ├── PromotionsCarousel.tsx
    │   │           │   └── Carrusel de promociones de la home.
    │   │           ├── usePromotionsCarousel.ts
    │   │           │   └── Logica de autoplay, controles y movimiento reducido.
    │   │           ├── promotions.ts
    │   │           │   └── Transforma promociones del catalogo a UI.
    │   │           ├── promotionSchedule.ts
    │   │           │   └── Utilidades para dias activos y orden de promociones.
    │   │           └── types.ts
    │   │               └── Tipo de promocion usado por el carrusel.
    │   │
    │   ├── menu/
    │   │   ├── MenuPage.tsx
    │   │   │   └── Pantalla completa del menu con filtros y carrito.
    │   │   ├── components/
    │   │   │   ├── CategoryChips.tsx
    │   │   │   │   └── Selector horizontal de categorias.
    │   │   │   ├── MenuCatalogSkeleton.tsx
    │   │   │   │   └── Skeletons de menu, grid y promociones.
    │   │   │   ├── MenuSection.tsx
    │   │   │   │   └── Seccion reutilizable de menu para home.
    │   │   │   ├── ProductCard.tsx
    │   │   │   │   └── Card de producto con variantes y boton agregar.
    │   │   │   └── ProductGrid.tsx
    │   │   │       └── Grid de productos y estado vacio.
    │   │   ├── content/
    │   │   │   ├── menuContent.ts
    │   │   │   │   └── Textos estaticos de contacto e informacion.
    │   │   │   └── hooks/
    │   │   │       └── useMenuCatalog.ts
    │   │   │           └── Hook que carga el catalogo publico del menu.
    │   │   ├── store/
    │   │   │   └── useMenuFilterStore.ts
    │   │   │       └── Estado global de busqueda y categoria activa.
    │   │   ├── utils/
    │   │   │   └── productCopy.ts
    │   │   │       └── Mensajes y nombres derivados de variantes.
    │   │   └── types.ts
    │   │       └── Tipos propios del menu y reexports del catalogo.
    │   │
    │   └── cart/
    │       ├── CartPage.tsx
    │       │   └── Pantalla de carrito, validacion y envio a WhatsApp.
    │       ├── components/
    │       │   ├── CartItem.tsx
    │       │   │   └── Item editable del carrito.
    │       │   ├── CustomerOrderForm.tsx
    │       │   │   └── Formulario de datos del pedido.
    │       │   ├── OrderSummary.tsx
    │       │   │   └── Resumen de cantidad y total.
    │       │   └── QuantityControl.tsx
    │       │       └── Control de incremento/decremento de cantidad.
    │       ├── store/
    │       │   └── useCartStore.ts
    │       │       └── Store Zustand persistente del carrito.
    │       ├── utils/
    │       │   ├── cartCopy.ts
    │       │   │   └── Formateo de nombres para carrito.
    │       │   ├── money.ts
    │       │   │   └── Parseo y formato de pesos colombianos.
    │       │   └── whatsapp.ts
    │       │       └── Generacion de mensaje y URL de WhatsApp.
    │       └── types.ts
    │           └── Tipos de carrito, variantes y draft de pedido.
    │
    └── shared/
        ├── auth/
        │   ├── AuthContext.ts
        │   │   └── Contexto y contrato de autenticacion.
        │   ├── AuthProvider.tsx
        │   │   └── Proveedor de sesion Supabase, login y logout.
        │   ├── RequireAuth.tsx
        │   │   └── Guardia de rutas privadas.
        │   └── useAuth.ts
        │       └── Hook para consumir autenticacion.
        │
        ├── components/
        │   ├── AppModal.tsx
        │   │   └── Modal compartido con overlay y cierre por ESC.
        │   ├── BottomNavigation.tsx
        │   │   └── Navegacion inferior publica mobile.
        │   ├── CartButton.tsx
        │   │   └── Boton de carrito con contador.
        │   ├── EmptyState.tsx
        │   │   └── Estado vacio reutilizable.
        │   ├── SearchInput.tsx
        │   │   └── Input de busqueda reutilizable.
        │   └── ThemeSwitch.tsx
        │       └── Toggle de tema claro/oscuro.
        │
        ├── icons/
        │   ├── HotDogIcon.tsx
        │   │   └── Icono propio de perro/hotdog.
        │   ├── WhatsappIcon.tsx
        │   │   └── Icono propio de WhatsApp.
        │   ├── index.ts
        │   │   └── Barrel de iconos.
        │   └── types.ts
        │       └── Props comunes para iconos propios.
        │
        ├── notifications/
        │   ├── notify.ts
        │   │   └── API centralizada de notificaciones.
        │   └── notify.css
        │       └── Estilos de notificaciones.
        │
        ├── services/
        │   └── menuCatalog/
        │       ├── index.ts
        │       │   └── Barrel del servicio de catalogo publico.
        │       ├── menuCatalogQueries.ts
        │       │   └── Queries Supabase para categorias, productos y promociones.
        │       ├── menuCatalogService.ts
        │       │   └── Normaliza catalogo para la UI publica.
        │       └── types.ts
        │           └── Tipos del catalogo publico.
        │
        └── utils/
            ├── cn.ts
            │   └── Helper para combinar clases Tailwind.
            └── motion.ts
                └── Helper para detectar movimiento reducido.
```

