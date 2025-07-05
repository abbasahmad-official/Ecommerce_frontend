import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCart, emptyCart } from "./cartHelpers";
import { createOrder } from "./apiCore";
import { isAuthenticated } from "../auth/index";

const SuccessPage = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false); // ✅ NEW
  const userId = isAuthenticated().user._id;
  const token = isAuthenticated().token;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");
  const address = query.get("address");

  const Products = getCart() || [];

  const totalAmount = Products.reduce((total, product) => {
    return total + product.price * product.count;
  }, 0);

  // Step 1: Fetch transaction details
  useEffect(() => {
    if (!sessionId) {
      setError("Session ID not found.");
      return;
    }

    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stripe/transaction/${sessionId}`);
        const data = await response.json();

        if (data.status === "succeeded") {
          setTransactionData(data);
        } else {
          setError("Payment was not successful.");
        }
      } catch (err) {
        setError("Error fetching transaction details.");
      }
    };

    fetchTransactionDetails();
  }, [sessionId]);

  // Step 2: Create Order ONLY ONCE after transactionData is set
  useEffect(() => {
    if (transactionData && !orderCreated) {
      const createOrderData = {
        products: Products,
        transaction_id: transactionData.transactionId,
        amount: totalAmount,
        address: address,
      };

      createOrder(userId, token, createOrderData)
        .then(() => {
          emptyCart();
          setOrderCreated(true); // ✅ So it doesn't repeat
        })
        .catch((err) => {
          console.error("Error creating order:", err);
        });
    }
  }, [transactionData, orderCreated]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Payment Successful!</h2>
      {transactionData ? (
        <div>
          <p>Transaction ID: {transactionData.transactionId}</p>
          <p>{JSON.stringify(transactionData)}</p>
          <p>{JSON.stringify(Products)}</p>
        </div>
      ) : (
        <p>Loading transaction details...</p>
      )}
    </div>
  );
};

export default SuccessPage;
