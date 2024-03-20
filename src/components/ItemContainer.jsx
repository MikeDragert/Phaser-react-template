import React from "react";
import "../styles/ItemContainer.css";
import DisplayItem from "./components/item";

const ItemContainer = ({ items }) => {
    return (
        <div className="item-container">
            <h2 className="inventory">Inventory</h2>
            <DisplayItem />
        </div>
    );
};
export default ItemContainer;
