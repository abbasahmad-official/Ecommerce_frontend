import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";

const CreateProduct = () => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: new FormData(),
  });

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    formData,
  } = values;

  const init = () => {
    getCategories()
     .then(data => {
        if(data.error){
            setValues({...values, error: data.error})
        } else {
            setValues({...values, categories:data,formData: new FormData()})
        }
     })
  }

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      error: "",
      createdProduct: "",
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true, error: "", createdProduct: "" });

    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        event.target.reset(); // Clear file input
        setValues({
          ...values,
          name: "",
          description: "",
          price: "",
          quantity: "",
          category: "",
          shipping: "",
          photo: "",
          loading: false,
          error: "",
          createdProduct: data.name,
          formData: new FormData(),
        });
      }
    });
  };

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h3>Loading...</h3>
      </div>
    );

  const showError = () =>
    error && (
      <div className="alert alert-danger">
        <h3>{error}</h3>
      </div>
    );

  const showSuccess = () =>
    createdProduct && (
      <div className="alert alert-info">
        <h3>{`${createdProduct} product has been created`}</h3>
      </div>
    );

  const newPostForm = () => (
    <form className="p-4 border rounded" encType="multipart/form-data" onSubmit={clickSubmit}>
      <div className="mb-3">
        <label htmlFor="photo" className="form-label">Product Photo</label>
        <input type="file" onChange={handleChange("photo")} className="form-control" id="photo" name="photo" accept="image/*" />
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Product Name</label>
        <input type="text" onChange={handleChange("name")} value={name} className="form-control" id="name" name="name" placeholder="Enter product name" />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea className="form-control" onChange={handleChange("description")} value={description} id="description" name="description" rows="3" placeholder="Enter product description"></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="price" className="form-label">Price</label>
        <input type="number" onChange={handleChange("price")} value={price} className="form-control" id="price" name="price" placeholder="Enter price" />
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <select className="form-select" id="category" name="category" onChange={handleChange("category")} value={category}>
          <option value="">Select category</option>
          {categories && categories.map((c,i)=>(<option key={i} value={c._id}>{c.name}</option>))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="shipping" className="form-label">Shipping</label>
        <select className="form-select" id="shipping" name="shipping" onChange={handleChange("shipping")} value={shipping}>
          <option value="">Select shipping</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="quantity" className="form-label">Quantity</label>
        <input type="number" onChange={handleChange("quantity")} value={quantity} className="form-control" id="quantity" name="quantity" placeholder="Enter quantity" />
      </div>

      <button type="submit" className="btn btn-primary">Create Product</button>
    </form>
  );

  return (
    <Layout
      title="Create new Product"
      description={`WELCOME! ${user.name.toUpperCase()}, create a new product`}
      className="container"
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
        </div>
      </div>
      <Link className="nav-link text-primary mb-4" to="/admin/dashboard">
                Back to dashboard
            </Link>
    </Layout>
  );
};

export default CreateProduct;
