import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "@/app/layouts/AppLayout";
import { appRoutes } from "@/app/routes";
import { CartPage } from "@/features/cart/CartPage";
import { HomePage } from "@/features/home/HomePage";
import { MenuPage } from "@/features/menu/MenuPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="cart" element={<Navigate to={appRoutes.cart} replace />} />
      </Route>
    </Routes>
  );
}
