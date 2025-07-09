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
      <Link className="navbar-brand" to="/">MyShop</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
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
    </nav>
  );
};

export default Menu;
