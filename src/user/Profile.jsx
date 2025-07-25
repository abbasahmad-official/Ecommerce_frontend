import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Navigate, useParams } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

const Profile = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        error: false,
        success: false
    });

    const { userId } = useParams();
    const { token } = isAuthenticated();
    const { name, email, password, error, success } = values;

    const init = (userId) => {
        read(userId, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: true });
            } else {
                setValues({ ...values, name: data.name, email: data.email });
            }
        });
    };

    useEffect(() => {
        init(userId);
    }, []);

    const handleChange = name => e => {
        setValues({ ...values, error: false, [name]: e.target.value });
    };

    const clickSubmit = e => {
        e.preventDefault();
        update(userId, token, { name, email, password }).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        name: data.name,
                        email: data.email,
                        success: true
                    });
                });
            }
        });
    };

    const redirectUser = () => {
        if (success) {
            return <Navigate to="/user/dashboard" />;
        }
    };

    const profileUpdate = (name, email, password) => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    onChange={handleChange("name")}
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    type="email"
                    onChange={handleChange("email")}
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    type="password"
                    onChange={handleChange("password")}
                    className="form-control"
                    value={password}
                />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );

    return (
        <Layout
            title="Profile"
            description="Update your profile"
            className="container-fluid"
        >
            <h2 className="mb-4">Profile update</h2>
            {profileUpdate(name, email, password)}
            {redirectUser()}
        </Layout>
    );
};

export default Profile;
