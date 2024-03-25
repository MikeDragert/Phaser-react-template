import React from 'react';
import '../styles/DisplayItem.css';
import { ITEMTYPES } from '../helpers/inventoryHelpers';

const DisplayItem = ({ items, getItemCountByType }) => {
  
  let displayItems = [];
  
  let coinCount = getItemCountByType(ITEMTYPES.COIN);
  let larryCount = getItemCountByType(ITEMTYPES.DUCK)
  console.log('the coincount is: ', coinCount)


  displayItems.push(<article><img src="../assets/icons/coin.png" alt="Coin"></img> <span>{coinCount}</span> </article>)
  
  // if (items.includes())



  console.log(items);


  return (
        <div>683636
            {displayItems}
        </div>
    );
};

export default DisplayItem;