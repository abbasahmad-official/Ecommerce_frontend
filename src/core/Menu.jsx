import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import { useSelector, useDispatch } from 'react-redux';
import { setCartMenuValue } from '../redux/slices/cartSlice';

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(itemTotal());
  const menuCount = useSelector((state) => state.cart.cartMenuValue);

  const isActive = (path) => {
    return {
      color: location.pathname === path ? "#ff9900" : "#ffffff"
    };
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(itemTotal());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary px-3">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand" to="/">MyShop</Link>

        {/* Hamburger toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Centered nav links */}
          <ul className="navbar-nav mx-auto text-center">
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

          {/* Right-side auth links */}
          <ul className="navbar-nav ms-auto text-center">
            {!isAuthenticated() && (
              <Fragment>
                <li className="nav-item">
                  <Link className="nav-link" style={isActive("/signin")} to="/signin">Signin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" style={isActive("/signup")} to="/signup">Signup</Link>
                </li>
              </Fragment>
            )}

            {isAuthenticated() && (
              <li className="nav-item">
                <span
                  className="nav-link"
                  style={{ cursor: "pointer", color: "#ffffff" }}
                  onClick={() => {
                    signout(() => navigate("/"));
                  }}
                >
                  Signout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
