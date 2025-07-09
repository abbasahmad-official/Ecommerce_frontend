import React, { useEffect, useState } from "react";
import { getCategories, list } from "./apiCore";
import ProductCard from "./ProductCard";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  useEffect(() => {
    getCategories().then((res) => {
      if (res.error) {
        console.log(res.error);
      } else {
        setData((prev) => ({
          ...prev,
          categories: res,
        }));
      }
    });
  }, []);

  const searchData = () => {
    list({ search: search || undefined, category: category }).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        setData((prev) => ({
          ...prev,
          results: response,
          searched: true,
        }));
      }
    });
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchedProducts = () => {
    if (results.length === 0) {
      return <p>No products found.</p>;
    }

    return (
      <div className="row">
        {results.map((product, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit} className="mb-4">
      <div className="row g-2">
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            onChange={handleChange("category")}
            value={category}
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control"
            onChange={handleChange("search")}
            placeholder="Search by name"
            value={search}
          />
        </div>

        <div className="col-12 col-md-2 d-grid">
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="container py-3">
      {searchForm()}
      {searched && searchedProducts()}
    </div>
  );
};

export default Search;
