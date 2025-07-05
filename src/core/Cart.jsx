import React, { Fragment, useEffect, useState } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import ProductCard from "./ProductCard";
import { getCart, updateItem, removeItem } from "./cartHelpers";
import Checkout from "./Checkout";
import { useSelector, useDispatch } from 'react-redux'
import { setCartMenuValue } from '../redux/slices/cartSlice'

const Cart = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);

  // Only load the cart once on mount (useEffect runs once)
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(storedCart);
dispatch(setCartMenuValue(storedCart.length));
  }, []); // Empty dependency array makes sure this runs only once

  const handleChange = (itemId) => (event) => {
    let newCount = parseInt(event.target.value);
    if (isNaN(newCount) || newCount <= 0) {
      newCount = 1;
    }

    // Update cart in localStorage and state
    const updatedItems = items.map((item) => {
      if (item._id === itemId) {
        return { ...item, count: newCount };
      }
      return item;
    });

    setItems(updatedItems);
    updateItem(itemId, newCount);
    dispatch(setCartMenuValue(updatedItems.length));
  };

  const removeItems = (itemId) => {
    const updatedCart = removeItem(itemId);
    setItems(updatedCart);
    dispatch(setCartMenuValue(updatedCart.length));
  };

  const getTotal = () => (
    items.reduce((acc, item) => acc + item.count * item.price, 0).toFixed(2)
  );

  

  return (
    <div>
     <Layout>
      <h3 className="mb-5 mt-3">You have {items.length} items in cart</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={item.count > 0 ? item.count : 1}
                    min="1"
                    onChange={handleChange(item._id)}
                    style={{ width: "60px" }}
                  />
                </td>
                <td>Rs {(item.count * item.price).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItems(item._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No product added to cart
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {items.length > 0 && (
        <div className="d-flex justify-content-between">
          <h3>Total: Rs {getTotal()}</h3>
          <Checkout products={items} getTotal={getTotal} />
        </div>
      )}
      </Layout> 
    </div>
  );
};

export default Cart;