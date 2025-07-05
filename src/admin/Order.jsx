import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const {user, token} = isAuthenticated();

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if(data.error){
                console.log(data.error);
            } else {
                setOrders(data)
            }
        })
    }
   
    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if(data.error){
                console.log("status update failed");
            } else {
                setStatusValues(data);
                console.log(data);
            }
        })
    }

 useEffect(()=>{
    loadOrders();
    loadStatusValues();
 }, [])   

 const showOrdersLength = () => {
    if(orders.length > 0 ){
        return <h2 className="text-danger display-2">Total orders: {orders.length}</h2>
    } else {
     return <h2 className="text-danger ">No orders</h2>   
    }
 }
 const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
        <div className="input-group-prepend">
            <div className="input-group-text">{key}</div>
        </div>
        <input type="text" value={value} className="form-control" readOnly/>
    </div>
 )

 const handleStatusChange = (e, orderId) => {
    // console.log(e);
    updateOrderStatus(user._id, token, orderId, e.target.value).then(data =>{
         if(data.error){
            console.log("update order status failed");
        } else {
            loadOrders();
        }
    }
       
    )
 }

const showStatus = (o) => (
    <div className="form-group">
    <h4 className="mark mb-4">Status: {o.status}</h4>
    <select className="form-control"  onChange={(e)=>handleStatusChange(e, o._id)} >
        <option>update status</option>
        {statusValues.map((status, i)=>(
            <option key={i} value={status}>{status}</option>
        ))}
    </select>
    </div>
)

  return (
    <Layout
      title="Orders"
      description={`WELCOME! ${user.name.toUpperCase()} manage orders`}
      className="container"
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
            {showOrdersLength()}
            {orders.map((o, i)=>{
                return (
                 <div className="mt-5" key={i}style={{borderBottom: "4px solid indigo"}} >
                    <h2 className="mb-5">
                        <span className="bg-primary">Order Id: {o._id}</span>
                    </h2>

                    <ul className="list-group mb-2">
                        <li className="list-group-item">{showStatus(o)}</li>
                        <li className="list-group-item">Transaction Id: {o.transaction_id}</li>
                        <li className="list-group-item">Amount {o.amount}</li>
                        <li className="list-group-item">Ordered by {o.user.name}</li>
                        <li className="list-group-item">ordered on: {moment(o.createdAt).fromNow()}</li>
                        <li className="list-group-item">Delivery adress: {o.address}</li>
                        
                    </ul>
                    <h4 className="mb-4 mt-4 font-italic">Total products in the order: {o.products.length}</h4>
                    {o.products.map((p, pindex)=> (
                       <div className="mb-4" key={pindex} style={{padding: "20px", border: "1px solid indigo"}}>
                            {showInput("product name", p.name)}
                            {showInput("product price", p.price)}
                            {showInput("product total", p.count)}
                            {showInput("product id", p._id)}
                        </div>
                    )
                    )}
                 </div>
                )
            })}
        </div>  
      </div>   
      <Link className="nav-link text-primary" to="/admin/dashboard">
                Back to dashboard
            </Link>
    </Layout>
  );

}

export default Orders;