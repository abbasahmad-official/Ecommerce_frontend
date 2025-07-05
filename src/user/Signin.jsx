import React, { useState } from "react";
import Layout from "../core/Layout";
import { API } from "../config";
import { Navigate } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth";

const Signin = () => {
  const [values, setValues] = useState({
    email: "john@gmail.com",
    password: "john@gmail.com1",
    error: "",
    loading: false,
    redirectToReferer: false
    

  });

  const { email, password, error, loading, redirectToReferer } = values;
  const {user} = isAuthenticated();

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();

    signin({ email, password })
      .then(data => {
        if (data?.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, ()=>{
            setValues({
           ...values,
            redirectToReferer: true
          });
          })
        }
      });
  };



  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showLoading = () => 
    loading && (<div className="alert alert-info">
      <h2>loading...</h2>
      </div>);
  
  const redirectUser = () => {
    if(redirectToReferer) { 
      if(user && user.role === 1){
      return <Navigate to="/admin/dashboard" replace />
      } else {
        return <Navigate to="/user/dashboard" replace />
      }
    }  
  }

  const signUpForm = () => (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow p-4">
          <h3 className="mb-4 text-center">Create Your Account</h3>
          <form>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input onChange={handleChange("email")} type="email" className="form-control" id="email" value={email} />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input onChange={handleChange("password")} type="password" className="form-control" id="password" value={password} />
            </div>

            <div className="d-grid">
              <button onClick={clickSubmit} type="submit" className="btn btn-primary">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Signin" description="Enter credentials" className="container col-md-8 offset-md-2">
      {showLoading()}
      {showError()}
      {signUpForm()}
      {redirectUser()}
    </Layout>
  );

};

export default Signin;
