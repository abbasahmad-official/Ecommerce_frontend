import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth";
import { Link, useLocation } from "react-router-dom";
import { getStripeCheckout } from "./apiCore";
import { loadStripe } from '@stripe/stripe-js';
import { emptyCart } from "./cartHelpers";
import { API } from "../config";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`);

const Checkout = ({ products, getTotal }) => {
  const [data, setData] = useState({
    success: false,
    error: "",
    transactionId: "",
  });
  const [sessionId, setSessionId] = useState();
  const [address, setAddress] = useState("");

  const auth = isAuthenticated();
  const userId = auth?.user?._id;
  const userToken = auth?.token;
  const hasProducts = products && products.length > 0;
 
 
  const handlePayment = () => {
    if (userId && userToken && hasProducts) {
      // emptyCart();  // Empty cart before starting the checkout process

      // Get Stripe Checkout session
      getStripeCheckout(userId, userToken, products, address)
        .then((data) => { 
          setSessionId(data.id);
          stripePromise.then((stripe) => {
            return stripe.redirectToCheckout({
              sessionId: data.id,
            })
          });
        })
        .catch((err) => {
          console.error("Checkout error:", err);
          setData({ ...data, error: "Failed to initiate Stripe Checkout." });
        });
    }
  };


  return (
    <div>
      {!auth && (
        <Link to="/signin">

          <button className="btn btn-success btn-lg">Sign in to checkout</button>
        </Link>
      )}

      {auth && hasProducts && (
        <>
           <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
              rows="3"
            />
          </div>
          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={handlePayment}
            disabled={!address.trim()}
          >
            Pay with Stripe
          </button>
        </>
      )}

      {auth && !hasProducts && (
        <div className="alert alert-info mt-3">Your cart is empty.</div>
      )}

      {data.error && (
        <div className="alert alert-danger mt-3">Error: {data.error}</div>
      )}

      {data.success && (
        <div className="alert alert-success mt-3">
          Payment successful! Thank you. <br />
          Transaction ID: {data.transactionId}
        </div>
      )}
    </div>
  );
};

export default Checkout;
