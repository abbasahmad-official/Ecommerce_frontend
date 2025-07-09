import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import { useSelector, useDispatch } from 'react-redux';
import { setCartMenuValue } from '../redux/slices/cartSlice';
import './Sidebar.css'; // Make sure to create this file

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(itemTotal());
  const menuCount = useSelector((state) => state.cart.cartMenuValue);

  const isActive = (path) => ({
    color: location.pathname === path ? "#ff9900" : "#ffffff"
  });

  useEffect(() => {
    const handleCartUpdate = () => setCartCount(itemTotal());
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <nav className="navbar navbar-dark bg-primary px-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">MyShop</Link>

          {/* Custom Hamburger */}
          <div className="hamburger d-md-none" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Sidebar and overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={closeSidebar}></div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="list-unstyled p-3">
          <li><Link className="nav-link" style={isActive("/")} to="/" onClick={closeSidebar}>Home</Link></li>
          <li><Link className="nav-link" style={isActive("/shop")} to="/shop" onClick={closeSidebar}>Shop</Link></li>
          <li><Link className="nav-link" style={isActive("/cart")} to="/cart" onClick={closeSidebar}>Cart <sup><small>{menuCount}</small></sup></Link></li>

          {isAuthenticated() && isAuthenticated().user.role === 0 && (
            <li><Link className="nav-link" style={isActive("/user/dashboard")} to="/user/dashboard" onClick={closeSidebar}>Dashboard</Link></li>
          )}

          {isAuthenticated() && isAuthenticated().user.role === 1 && (
            <li><Link className="nav-link" style={isActive("/admin/dashboard")} to="/admin/dashboard" onClick={closeSidebar}>Dashboard</Link></li>
          )}

          {!isAuthenticated() && (
            <Fragment>
              <li><Link className="nav-link" style={isActive("/signin")} to="/signin" onClick={closeSidebar}>Signin</Link></li>
              <li><Link className="nav-link" style={isActive("/signup")} to="/signup" onClick={closeSidebar}>Signup</Link></li>
            </Fragment>
          )}

          {isAuthenticated() && (
            <li>
              <span
                className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
                onClick={() => {
                  signout(() => {
                    navigate("/");
                    closeSidebar();
                  });
                }}
              >
                Signout
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Menu;
