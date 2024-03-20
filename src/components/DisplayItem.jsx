import React from 'react';
import '../styles/DisplayItem.css';

const DisplayItem = ({ items }) => {
  console.log('DisplayItems:', items)  
  
  return (
        <div>
            {items.map(item => (
                <div key={item.type} className={`grid-item ${item.has_obtained ? 'has-item' : ''}`}>
                    {item.has_obtained && <p>{item.item_name}</p>}
                </div>
            ))}
        </div>
    );
};

export default DisplayItem;