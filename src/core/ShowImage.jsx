import React from "react";
import { API } from "../config";

const ShowImage = ({item, url, from=null }) => {
   return (<div className="product-img">
        <img src={`${API}/${url}/photo/${item._id}`}  alt={item.name} style={{ objectFit: "cover", height: from? "70px": "200px"}}/>
    </div>)
}

export default ShowImage;