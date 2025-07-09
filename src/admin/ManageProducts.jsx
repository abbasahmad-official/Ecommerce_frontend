import React, { Fragment, useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";
import ShowImage from "../core/ShowImage";

const ManageProducts = () => {

    const [products, setProducts] = useState([]);

    const { user, token } = isAuthenticated();

    const loadProducts = async () => {
        try {
            let allproducts = await getProducts();
            setProducts(allproducts);

        } catch (error) {
            console.log(error)
        }
    }

    const removeProduct = async (productId) => {
        //export const deleteProduct = (productId, userId, token) => {
        try {
            await deleteProduct(productId, user._id, token);
            loadProducts();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProducts();
    }, [])

    return (
        <Layout
            title="Manage Products"
            description={`Manage all products`}
            className="container"
        >
            <ul>
                {products.map((product, i) => {
                    return <Fragment>
                        <li
                            key={i}
                            className="list-group-item"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ flex: 1 }}>{product.name}</span>

                            <ShowImage
                                className="me-4"
                                item={product}
                                url="product"
                                from="list"
                            />

                            <Link to={`/admin/product/update/${product._id}`}>
                                <button
                                    className="btn btn-warning btn-sm mx-2"
                                // onClick={() => onUpdate(product)}
                                >
                                    Update
                                </button>
                            </Link>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeProduct(product._id)}
                            >
                                Delete
                            </button>
                        </li>
                        <hr />
                    </Fragment>
                })}
            </ul>

            <Link className="nav-link text-primary" to="/admin/dashboard">
                Back to dashboard
            </Link>
        </Layout>
    );

}

export default ManageProducts;