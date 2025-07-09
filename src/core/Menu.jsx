import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import { useSelector, useDispatch } from "react-redux";
import { setCartMenuValue } from "../redux/slices/cartSlice";
import "./Sidebar.css";

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(itemTotal());
  const menuCount = useSelector((state) => state.cart.cartMenuValue);

  const isActive = (path) => ({
    color: location.pathname === path ? "#ff9900" : "#ffffff",
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
      {/* Top bar with brand and hamburger (small screen only) */}
      <div className="bg-primary px-3 py-2 d-flex justify-content-between align-items-center d-md-none">
        <Link className="text-white text-decoration-none fs-4 fw-bold" to="/">MyShop</Link>
        <div className="hamburger" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Sidebar for small screens */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={closeSidebar}></div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="list-unstyled p-3">
          <li><Link className="nav-link mb-2 mt-5" style={isActive("/")} to="/" onClick={closeSidebar}>Home</Link></li>
          <li><Link className="nav-link mt-2" style={isActive("/shop")} to="/shop" onClick={closeSidebar}>Shop</Link></li>
          <li><Link className="nav-link mt-2" style={isActive("/cart")} to="/cart" onClick={closeSidebar}>Cart <sup><small>{menuCount}</small></sup></Link></li>

          {isAuthenticated() && isAuthenticated().user.role === 0 && (
            <li><Link className="nav-link mt-2" style={isActive("/user/dashboard")} to="/user/dashboard" onClick={closeSidebar}>Dashboard</Link></li>
          )}

          {isAuthenticated() && isAuthenticated().user.role === 1 && (
            <li><Link className="nav-link mt-2 mb-2" style={isActive("/admin/dashboard")} to="/admin/dashboard" onClick={closeSidebar}>Dashboard</Link></li>
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

      {/* Standard Bootstrap navbar for large screens */}
      <nav className="navbar navbar-expand-md navbar-dark bg-primary px-3 d-none d-md-flex">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">MyShop</Link>
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/")} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/shop")} to="/shop">Shop</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/cart")} to="/cart">
                Cart <sup><small>{menuCount}</small></sup>
              </Link>
            </li>
            {isAuthenticated() && isAuthenticated().user.role === 0 && (
              <li className="nav-item">
                <Link className="nav-link" style={isActive("/user/dashboard")} to="/user/dashboard">Dashboard</Link>
              </li>
            )}
            {isAuthenticated() && isAuthenticated().user.role === 1 && (
              <li className="nav-item">
                <Link className="nav-link" style={isActive("/admin/dashboard")} to="/admin/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {!isAuthenticated() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" style={isActive("/signin")} to="/signin">Signin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" style={isActive("/signup")} to="/signup">Signup</Link>
                </li>
              </>
            )}
            {isAuthenticated() && (
              <li className="nav-item">
                <span
                  className="nav-link"
                  style={{ cursor: "pointer", color: "#ffffff" }}
                  onClick={() => signout(() => navigate("/"))}
                >
                  Signout
                </span>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Menu;
