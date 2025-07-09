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
  const [myFilters, setMyFilters] = useState({ filters: { category: [], price: [] } });

  useEffect(() => {
    init();
    loadFilteredResults(0, limit, myFilters.filters);
  }, []);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) setError(data.error);
      else setCategories(data);
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
      if (!data.error) {
        setProducts([...products, ...(data.data || [])]);
        setSize(data.size || 0);
        setSkip(toSkip);
      } else {
        setError(data.error);
      }
    });
  };

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    if (filterBy === "price") {
      const priceRange = handlePrice(filters);
      newFilters.filters[filterBy] = priceRange;
    } else {
      newFilters.filters[filterBy] = filters;
    }

    setMyFilters(newFilters);
    loadFilteredResults(0, limit, newFilters.filters);
  };

  const handlePrice = (value) => {
    const priceObj = prices.find((p) => p._id === value);
    return priceObj ? priceObj.array : [];
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <div className="text-center mt-3 mb-5">
          <button onClick={loadMore} className="btn btn-outline-primary">
            Load More
          </button>
        </div>
      )
    );
  };

  return (
    <Layout title="Shop" description="Find your desired products">
      <div className="container">
        <div className="d-md-none text-end my-3">
          <button
            className="btn btn-outline-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#filterSidebar"
          >
            Filters
          </button>
        </div>

        <div className="row">
          {/* Sidebar for large screens */}
          <div className="col-md-4 d-none d-md-block">
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

          {/* Product section */}
          <div className="col-md-8">
            <div className="mb-3">
              {products.length > 0 ? (
                <h6>{products.length} product(s) found</h6>
              ) : (
                <h6>No products found</h6>
              )}
            </div>

            <div className="row">
              {products.map((product, i) => (
                <div key={i} className="col-12 col-sm-6 col-md-4 mb-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {loadMoreButton()}
          </div>
        </div>
      </div>

      {/* Bootstrap Offcanvas for mobile filters */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="filterSidebar"
        aria-labelledby="filterSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="filterSidebarLabel">Filters</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <h5>Categories</h5>
          <CheckBox
            categories={categories}
            handleFilters={(filters) => handleFilters(filters, "category")}
          />

          <h5 className="mt-4">Price</h5>
          <RadioBox
            prices={prices}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
