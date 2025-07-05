import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { updateProduct, getCategories, getProduct } from "./apiAdmin";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { user, token } = isAuthenticated();
  const { productId } = useParams();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: null,
    loading: false,
    error: "",
    createdProduct: "",
  });

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    photo,
    loading,
    error,
    createdProduct,
  } = values;

  // Fetch product and categories
  useEffect(() => {
    const init = async () => {
      try {
        const product = await getProduct(productId);
        const categoryData = await getCategories();

        if (categoryData.error) {
          setValues((v) => ({ ...v, error: categoryData.error }));
        } else {
          setValues((v) => ({
            ...v,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category._id,
            shipping: product.shipping.toString(),
            quantity: product.quantity,
            categories: categoryData,
          }));
        }
      } catch (err) {
        setValues((v) => ({ ...v, error: "Failed to load product" }));
        console.error(err);
      }
    };

    init();
  }, [productId]);

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setValues((v) => ({ ...v, [name]: value, error: "", createdProduct: "" }));
  };

  const clickSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.set("name", name);
    form.set("description", description);
    form.set("price", price);
    form.set("category", category);
    form.set("shipping", shipping);
    form.set("quantity", quantity);
    if (photo) form.set("photo", photo); // optional

    setValues((v) => ({ ...v, loading: true }));

    try {
      const data = await updateProduct(productId, user._id, token, form);
      if (data.error) {
        setValues((v) => ({ ...v, error: data.error, loading: false }));
      } else {
        setValues({
          name: "",
          description: "",
          price: "",
          quantity: "",
          category: "",
          shipping: "",
          photo: null,
          loading: false,
          error: "",
          createdProduct: data.name,
          categories,
        });

        // Optional delay to show success message
        setTimeout(() => {
          navigate("/admin/products");
        }, 300);
      }
    } catch (err) {
      setValues((v) => ({ ...v, error: "Update failed", loading: false }));
    }
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
        <h3>{`${createdProduct} is updated`}</h3>
      </div>
    );

  const productForm = () => (
    <form className="p-4 border rounded" onSubmit={clickSubmit} encType="multipart/form-data">
      <div className="mb-3">
        <label className="form-label">Product Photo</label>
        <input
          type="file"
          className="form-control"
          onChange={handleChange("photo")}
          accept="image/*"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={handleChange("name")}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={handleChange("description")}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={handleChange("price")}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={category}
          onChange={handleChange("category")}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Shipping</label>
        <select
          className="form-select"
          value={shipping}
          onChange={handleChange("shipping")}
        >
          <option value="">Select shipping</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Quantity</label>
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={handleChange("quantity")}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Update Product
      </button>
    </form>
  );

  return (
    <Layout
      title="Update Product"
      description={`Welcome ${user.name}, ready to update the product?`}
      className="container"
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {productForm()}
        </div>
      </div>
      <Link className="nav-link text-primary mt-4" to="/admin/dashboard">
        Back to dashboard
      </Link>
    </Layout>
  );
};

export default UpdateProduct;
