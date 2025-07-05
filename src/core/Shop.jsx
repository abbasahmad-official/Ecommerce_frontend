import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Layout from "./Layout";
import { getCategories, getFilteredProducts } from "./apiCore";
import CheckBox from "./CheckBox";
import { prices } from "./fixedPrices";
import RadioBox from "./RadioBox";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [products, setProducts] = useState([]);
  const [size, setSize] = useState(0);

  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  // Fetch categories on mount
  useEffect(() => {
    init();
    loadFilteredResults(0, limit, myFilters.filters);
  }, []);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newSkip, limit, filters = {}) => {
    getFilteredProducts(newSkip, limit, filters).then((data) => {
      if (data.error) {
        setProducts([]);
        setSize(0);
        setError(data.error);
      } else {
        setProducts(data.data || []);
        setSize(data.size || 0);
        setSkip(newSkip);
        setError(false);
      }
    });
  };

  const loadMore = () => {
    const toSkip = skip + limit;

    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts([...products, ...(data.data || [])]);
        setSize(data.size || 0);
        setSkip(toSkip);
        setError(false);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 && size >= limit  && (
        <div className="text-center mt-3 mb-5">
          <button onClick={loadMore} className="btn btn-outline-primary">
            Load More
          </button>
        </div>
      )
    );
  };

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === "price") {
      const priceRange = handlePrice(filters);
      newFilters.filters[filterBy] = priceRange;
    }

    setMyFilters(newFilters);
    loadFilteredResults(0, limit, newFilters.filters); // Reset skip to 0 on new filter
  };

  const handlePrice = (value) => {
    const priceObj = prices.find((p) => p._id === value);
    return priceObj ? priceObj.array : [];
  };

  return (
    <Layout title="Shop" description="Find your desired products">
      <div className="row">
        <div className="col-4">
          <h4>Filter by Categories</h4>
          <ul>
            <CheckBox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>

          <h4>Filter by Price</h4>
          <ul>
            <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </ul>
        </div>

        <div className="col-8">
          <div className="mb-3">
            {products.length > 0 ? (
              <h6>{products.length} product(s) found</h6>
            ) : (
              <h6>No products found</h6>
            )}
          </div>

          <div className="row">
            {products.map((product, i) => (
              <div key={i} className="col-4 mb-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
