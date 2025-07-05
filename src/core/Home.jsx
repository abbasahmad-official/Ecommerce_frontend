import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore"
import ProductCard from "./ProductCard";
import Search from "./Search";


const Home = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const showProductsBySell = () => {
        getProducts("sold")
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setProductsBySell(data);
                }
            })
    }
    const showProductsByArrival = () => {
        getProducts("createdAt")
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setProductsByArrival(data);
                }
            })
    }
    useEffect(() => {
        showProductsByArrival();
        showProductsBySell();
    }, [])

 return (
    <Layout title="Home Page" description="E-commerce home page">
      <Search />
      <div className="container">
        <h3 className="mb-4">New Arrivals</h3>
        <div className="row">
          {productsByArrival.map((product, i) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={i}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <h3 className="mt-5 mb-4">Best Sellers</h3>
        <div className="row">
          {productsBySell.map((product, i) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={i}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Home;