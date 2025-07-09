import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Dashboard from "./user/UserDashBoard";
import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import CreateCategory from "./admin/createCategory";
import CreateProduct from "./admin/CreateProduct";
import Shop from "./core/Shop";
import ProductView from "./core/ProductView";
import Cart from "./core/Cart";
import SuccessPage from "./core/Success";
import CancelPage from "./core/Cancel";
import Orders from "./admin/Order";
import Profile from "./user/Profile";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- this enables dropdowns, modals, navbar toggle, etc.


const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute> } />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute> } />
        <Route path="/create/category" element={<AdminRoute><CreateCategory /></AdminRoute> } />
        <Route path="/create/product" element={<AdminRoute><CreateProduct /></AdminRoute> } />
        <Route path="/product/:productId" element={<ProductView /> } />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute> } />
        <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute> } />
        <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute> } />
        <Route path="/admin/product/update/:productId" element={<AdminRoute><UpdateProduct /></AdminRoute> } />


      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
