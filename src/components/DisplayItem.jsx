import React from 'react';
import '../styles/DisplayItem.css';

const DisplayItem = ({ itemName, itemImage, itemCount, className, subClassName }) => {
  return (
        <div className={className}>
            <img src={itemImage} alt={itemName} className={subClassName}></img> { (itemCount >= 0) && <h2 className={subClassName+" white-text"}>{itemCount}</h2>}
        </div>
    );
};

export default DisplayItem;