import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const adminLinks = () => (
    <div className="card mb-4">
      <h5 className="card-header">Admin Links</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <Link className="nav-link text-primary" to="/create/category">
            Create Category
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link text-primary" to="/create/product">
            Create Product
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link text-primary" to="/admin/orders">
            View Orders
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link text-primary" to="/admin/products">
            Manage Products
          </Link>
        </li>
      </ul>
    </div>
  );

  const adminInfo = () => (
    <div className="card mb-4">
      <h5 className="card-header">User Information</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{name}</li>
        <li className="list-group-item">{email}</li>
        <li className="list-group-item">
          {role === 1 ? "Admin" : "Registered User"}
        </li>
      </ul>
    </div>
  );

  return (
    <Layout
      title="Dashboard"
      description={`WELCOME! ${name.toUpperCase()}`}
      className="container py-4"
    >
      <div className="row">
        <div className="col-12 col-md-3">{adminLinks()}</div>
        <div className="col-12 col-md-9">{adminInfo()}</div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
