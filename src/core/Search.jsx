import React, { useEffect, useState } from "react";
import { getCategories, list } from "./apiCore";
import ProductCard from "./ProductCard";

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });

    const { categories, category, search, results, searched } = data;

    // Load categories on mount
    const loadCategories = () => {
        getCategories().then(res => {
            if (res.error) {
                console.log(res.error);
            } else {
                setData(prev => ({
                    ...prev,
                    categories: res
                }));
            }
        });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const searchData = () => {
        list({ search: search || undefined, category: category }).then(response => {
            if (response.error) {
                console.log(response.error);
            } else {
                setData(prev => ({
                    ...prev,
                    results: response,
                    searched: true
                }));
            }
        });
    };

    const searchSubmit = e => {
        e.preventDefault();
        searchData();
    };

    const handleChange = name => event => {
        setData({ ...data, [name]: event.target.value, searched: false });
    };

    const searchedProducts = () => {
  if (results.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="row">
      {results.map((product, index) => (
        <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
          <ProductCard product={product} />
          {searchedProducts()}
        </div>
      ))}
    </div>
  );
};

    const searchForm = () => {
        return (
            <form onSubmit={searchSubmit}>
                <span className="input-group-text">
                    <div className="input-group input-group-lg">
                        <div className="input-group-prepend">
                            <select className="btn mr-2" onChange={handleChange("category")}>
                                <option value="All">Search in all categories</option>
                                {categories.map((c, i) => (
                                    <option key={i} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="search"
                            className="form-control"
                            onChange={handleChange("search")}
                            placeholder="Search by name"
                        />
                    </div>
                    <div className="btn input-group-append">
                        <button className="input-group-text">Search</button>
                    </div>
                </span>
            </form>
        );
    };

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searched && results.length > 0 ? searchedProducts(results) : null}
            </div>
        </div>
    );
};

export default Search;
