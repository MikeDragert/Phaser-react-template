import React from "react";
import "../styles/ItemContainer.css";
import DisplayItem from "./DisplayItem";
import { ITEMTYPES } from "../helpers/inventoryHelpers";


const ItemContainer = ({ items, getItemCountByType}) => {

  
  let displayItems = [];
  
  let coinCount = getItemCountByType(ITEMTYPES.COIN);
  let larryCount = getItemCountByType(ITEMTYPES.DUCK)
//   console.log('the coincount is: ', coinCount)
// //<img src="../assets/icons/coin.png" alt="Coin"></img>
  let remainingItems = items.filter(item => item.item_type <= ITEMTYPES.CODEITEMMAX).map((item) => {
    let imageSrc = "../assets/icons/";
    let names = item.item_name.split('_');
    if (names.length > 1) {
      if (names[0].toLowerCase() === 'number') {
        imageSrc += `coin${names[1]}.png`
      }
      if (names[0].toLowerCase() === 'operator') {
        switch(names[1]) {
          case "+":
            imageSrc += `coinPlus.png`
            break;
          case "-":
            imageSrc += `coinSub.png`
            break;
          case "*":
            imageSrc += `coinMult.png`
            break;
          case "/":
            imageSrc += `coinDiv.png`
            break;
          case "%":
            imageSrc += `coinPercent.png`
            break;
          default:
            return "";
        }
      }

      if (names[0].toLowerCase() === 'function') {
        imageSrc += `puzzlePiece.png`
      }
      return <DisplayItem itemName={item.item_name} itemImage={imageSrc} itemCount="-1" className="grid-item" subClassName=""/>
    }
    return "";
  });

  let groupedItems = [];

  //we want two to a row...let's put divs in
  for (let index = 0; index < remainingItems.length; index+=2) {
    if (index+1 < remainingItems.length) {
      groupedItems.push(<div className="inventory">{remainingItems[index]}{remainingItems[index + 1]}</div>)
    } else {
      groupedItems.push(<div className="inventory">{remainingItems[index]}</div>)
    }
  }
  

  return (
      <div className="item-container">
          <DisplayItem itemName="Coin" itemImage="../assets/icons/coin.png" itemCount={coinCount} className="inventory" subClassName="data-grid"/>
          <DisplayItem itemName="Larry" itemImage="../assets/icons/duck.png" itemCount={larryCount} className="inventory" subClassName="data-grid"/>
          {groupedItems}
      </div>
  );
};
export default ItemContainer;
