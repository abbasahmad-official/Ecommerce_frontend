import { API } from "../config";
import queryString from "query-string";

export const getProducts = (sortBy) => {
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
      method: "GET",
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  };

   export const getCategories = (userId, token, product) => {
    return fetch(`${API}/categories`, {
      method: "GET",
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  };

     export const getFilteredProducts = (skip, limit, filters) => {
      const data = {skip, limit, filters}
    return fetch(`${API}/products/by/search`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  };
  
  export const list = (params) => {
    const query = queryString.stringify(params);
    console.log("query in apiCore", query)
    return fetch(`${API}/products/search?${query}`, {
      method: "GET",
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  };
  export const read = (productId) => {
    return fetch(`${API}/product/${productId}`, {
      method: "GET",
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  }

  export const relatedList = (productId) => {
    return fetch(`${API}/products/related/${productId}`, {
      method: "GET",
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  }
 
  export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${API}/braintree/getToken/${userId}`, {
      method: "GET",
       headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  }

   export const getStripeCheckout = (userId, token, items, adress) => {
    return fetch(`${API}/stripe/checkout/${userId}`, {
      method: "POST",
       headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({items, adress})
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  }

   export const createOrder = async (userId, token, createOrderData) => {
    return fetch(`${API}/order/create/${userId}`, {
      method: "POST",
       headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({order: createOrderData})
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  }