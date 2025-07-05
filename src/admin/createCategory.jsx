import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createCategory } from "./apiAdmin";

const CreateCategory = () => {
  const [name, setName] = useState(""); 
  const [error, setError] = useState(false); 
  const [success, setSuccess] = useState(false);

  // Get user token
  const { user, token } = isAuthenticated();

  const handleChange = (event) => {
    setError(""); // Clear any error
    setSuccess(false)
    setName(event.target.value); // Update name state with the input value
  }

  const clickSubmit = (event) => {
    event.preventDefault();
    setError(""); // Reset error state
    setSuccess(false); // Reset success state
    // Make request to backend to create category (You can add the API call here)
    createCategory(user._id, token, {name})
     .then(data => {
        if (data?.error) {
          setError(data.error);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      });
  }

  const showSuccess = () => {
    if(success){
        return <h2 className="text-success">{name} category is created</h2>
    } 
  }
  
  const showError = () => {
  if (error) {
    return <h2 className="text-danger">Category should be uniquely created</h2>;
  }
};


  const createCategoryForm = () => {
    return (  // This function now returns JSX
      <form onSubmit={clickSubmit}>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input 
            type="text" 
            className="form-control" 
            id="category" 
            placeholder="Enter category name"  
            value={name} 
            onChange={handleChange} 
            autoFocus 
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Category</button>
      </form>
    );
  }

  return (
    <Layout
      title="Create new Category"
      description={`WELCOME! ${user.name.toUpperCase()} create a new category`}
      className="container"
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
            {showSuccess()}
            {showError()}
          {createCategoryForm()}  {/* Rendering the form */}
        </div>  
      </div>   
      <Link className="nav-link text-primary" to="/admin/dashboard">
                Back to dashboard
            </Link>
    </Layout>
  );
}

export default CreateCategory;
