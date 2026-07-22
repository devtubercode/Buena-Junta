import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "@/app/layouts/AppLayout";
import { appRoutes } from "@/app/routes";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { HomePage } from "@/features/home/HomePage";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

const AdminLayout = lazy(() =>
  import("@/app/layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const DashboardPage = lazy(() =>
  import("@/features/admin/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const AdditionsPage = lazy(() =>
  import("@/features/admin/additions/AdditionsPage").then((m) => ({
    default: m.AdditionsPage,
  })),
);
const CategoriesPage = lazy(() =>
  import("@/features/admin/categories/CategoriesPage").then((m) => ({
    default: m.CategoriesPage,
  })),
);
const ProductDetailPage = lazy(() =>
  import("@/features/admin/products/ProductDetailPage").then((m) => ({
    default: m.ProductDetailPage,
  })),
);
const ProductsPage = lazy(() =>
  import("@/features/admin/products/ProductsPage").then((m) => ({
    default: m.ProductsPage,
  })),
);
const PromotionDetailPage = lazy(() =>
  import("@/features/admin/promotions/PromotionDetailPage").then((m) => ({
    default: m.PromotionDetailPage,
  })),
);
const PromotionsPage = lazy(() =>
  import("@/features/admin/promotions/PromotionsPage").then((m) => ({
    default: m.PromotionsPage,
  })),
);

const MenuLayout = lazy(() =>
  import("@/features/menu/MenuLayout").then((m) => ({ default: m.MenuLayout })),
);
const MenuPage = lazy(() =>
  import("@/features/menu/MenuPage").then((m) => ({ default: m.MenuPage })),
);

const AboutPage = lazy(() =>
  import("@/features/about/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const CartPage = lazy(() =>
  import("@/features/cart/CartPage").then((m) => ({ default: m.CartPage })),
);

function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="admin/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="productos" element={<ProductsPage />} />
            <Route path="productos/:slug" element={<ProductDetailPage />} />
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="adiciones" element={<AdditionsPage />} />
            <Route path="promociones" element={<PromotionsPage />} />
            <Route path="promociones/:slug" element={<PromotionDetailPage />} />
          </Route>
        </Route>
        <Route element={<MenuLayout />}>
          <Route path="menu" element={<MenuPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="cart" element={<Navigate to={appRoutes.cart} replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
