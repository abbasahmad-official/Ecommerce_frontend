import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartMenuValue } from "../redux/slices/cartSlice";
import { itemTotal } from "./cartHelpers";


const Layout = ({
    title = "Title",
    description = "Description",
    className,
    children
}) => {
    const dispatch = useDispatch()
     useEffect(() => {
    const count = itemTotal(); // reads from localStorage
    dispatch(setCartMenuValue(count));
  }, []);
    return(
    <div style={{paddingTop: "20px"}}>
        <div className="container-fluid py-5 p-5 mb-4 bg-light rounded-3">
            <h2 className="display-5 fw-bold">{title}</h2>
            <p className="col-md-8 fs-4">{description}</p>
        </div>
        <div className={className}>{children}</div>
    </div>
)};

export default Layout;