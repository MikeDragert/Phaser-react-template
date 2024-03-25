import React from "react";
import "../styles/ItemContainer.css";
import DisplayItem from "./DisplayItem";


const ItemContainer = ({ items, getItemCountByType }) => {
    return (
        <div className="item-container">
            <h2 className="inventory">Inventory</h2>
            <DisplayItem items={items} getItemCountByType={getItemCountByType} />
        </div>
    );
};
export default ItemContainer;
