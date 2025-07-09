import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { updateItem, removeItem } from "./cartHelpers";
import Checkout from "./Checkout";
import { useSelector, useDispatch } from 'react-redux';
import { setCartMenuValue } from '../redux/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(storedCart);
    dispatch(setCartMenuValue(storedCart.length));
  }, []);

  const handleChange = (itemId) => (event) => {
    let newCount = parseInt(event.target.value);
    if (isNaN(newCount) || newCount <= 0) newCount = 1;

    const updatedItems = items.map((item) =>
      item._id === itemId ? { ...item, count: newCount } : item
    );

    setItems(updatedItems);
    updateItem(itemId, newCount);
    dispatch(setCartMenuValue(updatedItems.length));
  };

  const removeItems = (itemId) => {
    const updatedCart = removeItem(itemId);
    setItems(updatedCart);
    dispatch(setCartMenuValue(updatedCart.length));
  };

  const getTotal = () =>
    items.reduce((acc, item) => acc + item.count * item.price, 0).toFixed(2);

  return (
    <Layout>
      <div className="container py-4">
        <h3 className="mb-4">You have {items.length} items in cart</h3>

        {/* Table for medium and up */}
        <div className="d-none d-md-block">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th style={{ width: "100px" }}>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>Rs {item.price}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.count > 0 ? item.count : 1}
                        min="1"
                        onChange={handleChange(item._id)}
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
        </div>

        {/* Card layout for small screens */}
        <div className="d-block d-md-none">
          {items.length === 0 ? (
            <p>No product added to cart.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text mb-1">Price: Rs {item.price}</p>
                  <div className="d-flex align-items-center mb-2">
                    <label className="me-2 mb-0">Qty:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={item.count > 0 ? item.count : 1}
                      min="1"
                      onChange={handleChange(item._id)}
                      style={{ width: "70px" }}
                    />
                  </div>
                  <p>Total: Rs {(item.count * item.price).toFixed(2)}</p>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItems(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total + Checkout */}
        {items.length > 0 && (
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-4">
            <h4>Total: Rs {getTotal()}</h4>
            <div className="mt-3 mt-md-0">
              <Checkout products={items} getTotal={getTotal} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
