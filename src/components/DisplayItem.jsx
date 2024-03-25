import React from 'react';
import '../styles/DisplayItem.css';

const DisplayItem = ({ items }) => {
  
  return (
        <div>
            {items.map(item => (
                <div key={item.type} className="grid-item has-item">
                    <p>{item.item_name}</p>
                </div>
            ))}
        </div>
    );
};

export default DisplayItem;