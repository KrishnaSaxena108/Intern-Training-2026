import { Routes, Route } from "react-router-dom";

import ProductList from "../pages/ProductList";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import ProductDetails from "../pages/ProductDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/add" element={<AddProduct />} />
      <Route path="/edit/:id" element={<EditProduct />} />
      <Route path="/product/:id" element={<ProductDetails />} />
    </Routes>
  );
}

export default AppRoutes;