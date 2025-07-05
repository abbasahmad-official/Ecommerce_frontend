import React, { useState } from "react";

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setValue(selectedValue);
    handleFilters(selectedValue);
  };

  return (
    <div>
      {prices.map((p, i) => (
        <div key={i} className="form-check">
          <input
            type="radio"
            className="form-check-input mr-2 ml-2"
            id={`price-${i}`}
            name="price"
            value={p._id}
            onChange={handleChange}
            checked={value === p._id}
          />
          <label className="form-check-label" htmlFor={`price-${i}`}>
            {p.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioBox;
