import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "@/app/layouts/AppLayout";
import { appRoutes } from "@/app/routes";
import { AdminLayout } from "@/app/layouts/AdminLayout";
import { DashboardPage } from "@/features/admin/pages/DashboardPage";
import { AdditionsPage } from "@/features/admin/pages/AdditionsPage";
import { LoginPage } from "@/features/admin/pages/LoginPage";
import { CategoriesPage } from "@/features/admin/pages/CategoriesPage";
import { OptionGroupsPage } from "@/features/admin/pages/OptionGroupsPage";
import { ProductDetailPage } from "@/features/admin/pages/ProductDetailPage";
import { ProductsPage } from "@/features/admin/pages/ProductsPage";
import { PromotionDetailPage } from "@/features/admin/pages/PromotionDetailPage";
import { PromotionsPage } from "@/features/admin/pages/PromotionsPage";
import { CartPage } from "@/features/cart/CartPage";
import { HomePage } from "@/features/home/HomePage";
import { MenuPage } from "@/features/menu/MenuPage";
import { AboutPage } from "@/features/about/AboutPage";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

export function App() {
  return (
    <Routes>
      <Route path="admin/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="productos/nuevo" element={<ProductDetailPage />} />
          <Route path="productos/:slug" element={<ProductDetailPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="adiciones" element={<AdditionsPage />} />
          <Route path="promociones" element={<PromotionsPage />} />
          <Route path="promociones/nueva" element={<PromotionDetailPage />} />
          <Route path="promociones/:slug" element={<PromotionDetailPage />} />
          <Route path="grupos-opciones" element={<OptionGroupsPage />} />
        </Route>
      </Route>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="nosotros" element={<AboutPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="cart" element={<Navigate to={appRoutes.cart} replace />} />
      </Route>
    </Routes>
  );
}
