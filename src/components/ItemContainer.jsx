import React, { useState } from 'react';
import '../styles/ItemContainer.css'
import player_items from '../mock_data/PlayerItems';


    console.log(items);

const ItemContainer = () => { 
    const [itemsState, setItemsState] = useState(items);
    return (
        <div className='item-container'>
            <h2 className='inventory' >Inventory</h2>
            {Object.entries(itemsState).map(([id, item]) => (
                <div key={id} className='grid-item'>
                    <p>Item ID: {item.item_id}</p>
                    <p>Player ID: {item.player_id}</p>
                    {/* Display other item properties here */}
                </div>
            ))}
        </div>
    );
};
export default ItemContainer;