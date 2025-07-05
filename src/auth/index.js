import { API } from "../config";

 export const signup = user => {
    return fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  };

   export const signin = user => {
    return fetch(`${API}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json()) // ✅ FIXED: return JSON
    .catch(err => {
      console.log(err);
    });
  };

  export const authenticate = (data, next) => {
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
  }

  export const signout = next => {
  if (typeof window !== "undefined") {
    // Remove token from localStorage (client-side logout)
    localStorage.removeItem("jwt");

    // Call backend to handle server-side logout
    return fetch(`${API}/signout`, {
      method: "POST"
    })
      .then(response => {
        console.log("Signout response:", response);
        next(); // Now call the callback after server response
      })
      .catch(err => console.log("Signout error:", err));
  }
};

export const isAuthenticated = () => {
    if (typeof window === "undefined") {
        return false;
    }
    if(localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"));
        
    } else {
        return false;
    }
}
