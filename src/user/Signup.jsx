import React, { useState } from "react";
import Layout from "../core/Layout";
import { API } from "../config";
import { Link } from "react-router-dom";
import { signup } from "../auth";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false
  });

  const { name, email, password, error, success } = values;

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();

    signup({ name, email, password })
      .then(data => {
        if (data?.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            name: "",
            email: "",
            password: "",
            error: "",
            success: true
          });
        }
      });
  };



  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-success" style={{ display: success ? "" : "none" }}>
      New account created. Please <Link to="/signin">Signin</Link>.
    </div>
  );

  const signUpForm = () => (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow p-4">
          <h3 className="mb-4 text-center">Create Your Account</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input onChange={handleChange("name")} type="text" className="form-control" id="name" value={name} />
            </div>

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
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Signup" description="Create a new account" className="container col-md-8 offset-md-2">
      {showSuccess()}
      {showError()}
      {signUpForm()}
    </Layout>
  );
};

export default Signup;
