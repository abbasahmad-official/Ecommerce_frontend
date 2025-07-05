import React, {useState, useEffect} from "react";

const CheckBox = ({ categories, handleFilters }) => {
    const [checked, setChecked] = useState([]);

    const handleChange = c => () => {
        const currentCategoryId = checked.indexOf(c); // if not found return -1
        const newCheckedCategoryId = [...checked];
        if(currentCategoryId === -1){
            newCheckedCategoryId.push(c);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        // console.log(newCheckedCategoryId);
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    }
    

    return categories.map((c, i) => (
        <li className="list-unstyled" key={i}>
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={`category-${i}`}
                    onChange={handleChange(c._id)}
                    checked={checked.indexOf(c._id) !== -1}
                />
                <label
                    className="form-check-label"
                    htmlFor={`category-${i}`}
                >
                    {c.name}
                </label>
            </div>
        </li>
    ));
};


export default CheckBox;