export const ITEMTYPES = {
  ALL: 0,
  CODENUMBER: 1,
  CODEOPERATOR: 2,
  CODEFUNCTION: 3,
  DUCK: 10,
  COIN: 11
}

const INVENTORYACTION = {
  ADDITEM: 'addItem',
  CLEAR: 'clear',
  LOADLIST: 'loadList'
}


//example item
/*
{
  player_id: 1, 
  item_id: ITEMTYPES.TYPE1,
  save_id: 1,
  container_item_id: 1,
  location_x: 1,
  location_y: 1,
  map_id: 'tutorial',
  item_name: "Mystic Amulet",
  item_type: 10
  
}
*/


//need inventory stored in state.

export const inventoryReducer = (state, action) => {
  let newState = [...state]
  switch (action.type) {
    case INVENTORYACTION.ADDITEM:
      newState.push(action.data)
      break;
    case INVENTORYACTION.CLEAR:
      newState = [];
      break;
    case INVENTORYACTION.LOADLIST: 
      newState = action.data;
      break
    default:
      break;
  }

  return newState
}


//get a list of items in the inventory, as per passed in options
export const getInventory = function (inventoryList, type = ITEMTYPES.ALL) {
  if (type === ITEMTYPES.ALL) {
    return inventoryList;
  }

  return inventoryList.filter( item => item.item_type === type);
}

export const getInventoryForMap = function(inventoryList, type, mapId) {
  if (type === ITEMTYPES.ALL) {
    return inventoryList.filter( item => item.map_id === mapId);
  }
  
  return inventoryList.filter( item => item.item_type === type && item.map_id === mapId);
}

//get count of item, as per passed in options
export const getItemCountByType = function(inventoryList, type) {
  return inventoryList.filter( item => item.item_type === type).length;
} 

export const getItemCountById = function(inventoryList, itemId) {
  return inventoryList.filter( item => item.id === itemId).length;
} 

export const getItemCountByName = function(inventoryList, itemName) {
  return inventoryList.filter( item => item.item_name === itemName).length;
} 

export const getItemCountByMap = function(inventoryList, mapId) {
  return inventoryList.filter( item => item.map_id === mapId).length;
} 

//add item to inventory, update state
export const addFullItemToInventory = function(inventoryDispatch, fullItem) {
  return inventoryDispatch({type: inventoryDispatch.ADDITEM, data: fullItem});
}

export const addItemToInventory = function(inventoryDispatch, playerItem, item){
  if (playerItem.item_id === item.id) {
    fullItem = {...playerItem};
    fullItem.item_name = item.name;
    fullItem.item_type = item.type;
    fullItem.has_obtained = item.has_obtained;
    return inventoryDispatch({type: INVENTORYACTION.ADDITEM, data: fullItem})
  }
}

//save all given items 
export const loadPlayerInventory = function(inventoryDispatch, playerItemsList, itemsList) {
  let fullItemList = Object.values(playerItemsList).map( playerItem => {
    if (itemsList[playerItem.item_id]) {
      playerItem.item_name = itemsList[playerItem.item_id].name;
      playerItem.item_type = itemsList[playerItem.item_id].type;
      playerItem.has_obtained = itemsList[playerItem.item_id].has_obtained;
    } else {
      playerItem.item_name = 'UNKNOWN';
      playerItem.item_type = 0;
      playerItem.has_obtained = false;
    }
    return playerItem
  })
  return inventoryDispatch({type: INVENTORYACTION.LOADLIST, data: fullItemList})
}

//empty the inventory
export const clearInventory = function(inventoryDispatch) {
  return inventoryDispatch({type: inventoryDispatch.CLEAR, data: {}});
}

//todo: we will want to use this to push inventory to game on change
//   need to figure out what the game needs from the inventory list
export const pushInventory = function(inventoryList, map_id, callback) {
  return callback(getInventoryForMap(inventoryList, ITEMTYPES.ALL, map_id));
}