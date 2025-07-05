import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import { useSelector, useDispatch } from 'react-redux'
import { setCartMenuValue } from '../redux/slices/cartSlice'

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(itemTotal());
  const menuCount = useSelector((state) => state.cart.cartMenuValue)

  const isActive = (path) => {
    if (location.pathname === path) {
      return { color: "#ff9900" }
    } else {
      return { color: "#ffffff" }
    }
  };

  useEffect(() => {
  const handleCartUpdate = () => {
    setCartCount(itemTotal());
    // dispatch(setCartMenuValue(itemTotal.length));
  };

  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
    window.removeEventListener("cartUpdated", handleCartUpdate);
  };
}, []);


  return (

    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link className="nav-link" style={isActive("/")} to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={isActive("/shop")} to="/shop">Shop</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={isActive("/cart")} to="/cart">Cart<sup><small>{menuCount}</small></sup></Link>
        </li>

        {isAuthenticated() && isAuthenticated().user.role === 0 && (<li className="nav-item">
          <Link className="nav-link" style={isActive("/user/dashboard")} to="/user/dashboard">DashBoard</Link>
        </li>)}
          {isAuthenticated() && isAuthenticated().user.role === 1 && (<li className="nav-item">
          <Link className="nav-link" style={isActive("/admin/dashboard")} to="/admin/dashboard">DashBoard</Link>
        </li>)}

        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/signin")} to="/signin">Signin</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/signup")} to="/signup">Signup</Link>
            </li>
          </Fragment>)}
        {isAuthenticated() && (<li className="nav-item">
          <Link className="nav-link" style={{ cursor: "pointer", color: "#ffffff" }} onClick={() => signout(() => {
            navigate("/")
          })} >Signout</Link>
        </li>)}


      </ul>
    </div>
  );
};

export default Menu;
