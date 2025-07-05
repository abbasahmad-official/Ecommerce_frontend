import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ShowImage from "./ShowImage";
import { addItem } from "./cartHelpers";

const ProductCard = ({ product }) => {

  const [redirect, setRedirect] = useState(false);

  const addToCart = () => {
    console.log("adding to cart")
    console.log(product);
      addItem(product, ()=> {
        setRedirect(true);
      })
  }

  const shouldRedirect = (redirect) => {
    if(redirect){
      return <Navigate to="/cart" />
    }
  }

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      {shouldRedirect(redirect)}
      <ShowImage item={product} url="product" />
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title text-dark">{product.name}</h5>
          <p className="card-text text-muted small">
            {product.description?.length > 100
              ? product.description.substring(0, 100) + "..."
              : product.description}
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold fs-5 text-primary">${product.price}</span>
          <div className="d-flex align-items-center gap-2">
            <Link to={`/product/${product._id}`} className="btn btn-primary btn-sm">
              View Product
            </Link>
            <button  className="btn btn-outline-secondary btn-sm p-1" onClick={addToCart} >
              <img
                src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                alt="Add to Cart"
                width="20"
                height="20"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
