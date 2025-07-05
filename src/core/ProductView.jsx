import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "./Layout";
import ProductCard from "./ProductCard";
import { read, relatedList } from "./apiCore";
import moment from "moment";
import ShowImage from "./ShowImage";
import { addItem } from "./cartHelpers";


const ProductView = (props) => {
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(false);

    const [redirect, setRedirect] = useState(false);

  const addToCart = () => {
      addItem(product, ()=> {
        setRedirect(true);
      })
  }

  const shouldRedirect = (redirect) => {
    if(redirect){
      return <Navigate to="/cart" />
    }
  }

    const { productId } = useParams();

    const loadingSingleProduct = (productId) =>{
        read(productId).then(data => {
            if(data.error){
                setError(data.error);
            } else {
                setProduct(data);
                relatedList(productId).then(response => {
                    if(response.error){
                        setError(response.error);
                    } else {
                        setRelatedProducts(response);
                    }
                })
            }
        })
    }

    useEffect(()=>{
        // const productId = props.match.params.productId;
        loadingSingleProduct(productId);
    },[productId])

    const {name, price, category, createdAt, description, quantity} = product;

    const showStock = (quantity) =>{
        return quantity > 0? <span>yes</span>: <span>No</span>
    }

return (<div className="container py-5">
  <div className="row">
    {shouldRedirect(redirect)}
    {/* <!-- Product Image --> */}
    <div className="col-md-5">
      <ShowImage item={product} url="product" />
    </div>

    {/* <!-- Product Info --> */}
    <div className="col-md-7">
      <div className="card border-0">
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          
          <p className="text-muted mb-1"><strong>Description:</strong></p>
          <p>{description}</p>

          <p className="mb-2">
            <strong>Price:</strong> <span className="text-success">{price}</span>
          </p>
          
          <p className="mb-2">
            <strong>Category:</strong> <span className="text-success">{category ? category.name : "No category"}</span>

          </p>

          <p className="mb-2">
            <strong>In Stock:</strong> <span className="text-success">{showStock(quantity)}</span>
          </p>

          <p className="mb-2">
            <strong>Created:</strong> {moment(createdAt).fromNow() }
          </p>

          <button className="btn btn-primary mt-3 mb-5" onClick={addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  </div>

  {/* <!-- Related Products --> */}
  <h2>Related Products</h2>
  <div className="mt-5">
  <div className="row">
    {relatedProducts.map((p, i) => (
      <div className="col-md-4 mb-4" key={i}>
        <ProductCard product={p} />
      </div>
    ))}
  </div>
</div>

</div>);


}
export default ProductView;