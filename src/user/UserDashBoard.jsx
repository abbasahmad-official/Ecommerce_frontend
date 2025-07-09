import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getpurchaseHistory } from "./apiUser";
import moment from "moment";

const Dashboard = () => {
  const [history, setHistory] = useState([]);

  const {
    token,
    user: { _id, name, email, role },
  } = isAuthenticated();

  useEffect(() => {
    getpurchaseHistory(_id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setHistory(data);
      }
    });
  }, [_id, token]);

  const userLinks = () => (
    <div className="card mb-4">
      <h5 className="card-header">User Links</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <Link className="nav-link text-primary" to="/cart">
            My Cart
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link text-primary" to={`/profile/${_id}`}>
            Update Profile
          </Link>
        </li>
      </ul>
    </div>
  );

  const userInfo = () => (
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

  const purchaseHistory = (history) => (
    <div className="card mb-4">
      <h5 className="card-header">Purchase History</h5>
      <ul className="list-group list-group-flush">
        {history.length === 0 ? (
          <li className="list-group-item text-muted">No purchase history</li>
        ) : (
          history.map((h, i) => (
            <li className="list-group-item" key={i}>
              {h.products.map((p, idx) => (
                <div key={idx} className="mb-3 border-bottom pb-2">
                  <h6 className="mb-1">🛒 {p.name}</h6>
                  <p className="mb-1 text-muted">Price: ${p.price}</p>
                  <small className="text-muted">
                    Purchased: {moment(p.createdAt).fromNow()}
                  </small>
                </div>
              ))}
            </li>
          ))
        )}
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
        {/* On mobile: full width, on md+ screens: split */}
        <div className="col-12 col-md-3">{userLinks()}</div>

        <div className="col-12 col-md-9">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
