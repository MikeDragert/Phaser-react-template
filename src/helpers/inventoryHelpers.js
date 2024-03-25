export const ITEMTYPES = {
  ALL: 0,
  CODENUMBER: 1,
  CODEOPERATOR: 2,
  CODEFUNCTION: 3,
  CODEITEMMAX: 9,
  DUCK: 10,
  COIN: 11
}

const INVENTORYACTION = {
  ADDITEM: 'addItem',
  CLEAR: 'clear',
  LOADLIST: 'loadList'
}

const itemMap = {
  //tileNumber : {name: itemName, type: itemType}
  // 158: {name:'Coin', type: ITEMTYPES.COIN}
  "coin": ITEMTYPES.COIN,
}

export const inventoryReducer = (state, action) => {
  let newState = [...state]
  switch (action.type) {
    case INVENTORYACTION.ADDITEM:
      newState.push(action.data)
      break;
    case INVENTORYACTION.CLEAR:
      if (action.data.mapId) {
        newState = newState.filter(item => item.map_id !== action.data.mapId);
      } else {
        newState = [];
      }
      break;
    case INVENTORYACTION.LOADLIST: 
      newState = action.data;
      break
    default:
      break;
  }
  return newState
}

export const getAllCodeItems = function(inventoryList) {
  return inventoryList.filter( item => item.item_type < ITEMTYPES.CODEITEMMAX);
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
  return inventoryDispatch({type: INVENTORYACTION.ADDITEM, data: fullItem});
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

export const addItemFromSceneToInventory = function(inventoryDispatch, sceneItem) {
  let newItem = generateItem(sceneItem);
  // todo, extra things we should set if they are available
  // newItem.player_id = 1, 
  // newItem.item_id = 0;
  // newItem.save_id = 0;
  addFullItemToInventory(inventoryDispatch, newItem);
}

const generateItem = function(sceneItem) {
  let name = sceneItem.item.name.split("-")[0];

  return {
    player_id: undefined, 
    item_id: undefined,
    save_id: undefined,
    container_item_id: 0,
    location_x: sceneItem.item.x,
    location_y: sceneItem.item.y,
    map_id: sceneItem.sceneName,
    item_name: name,
    item_type: itemMap[name],
    has_obtained: true
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
  return inventoryDispatch({type: INVENTORYACTION.CLEAR, data: {}});
}

export const clearInventoryForScene = function(inventoryDispatch, mapId) {
  return inventoryDispatch({type: INVENTORYACTION.CLEAR, data: {mapId} });
}

export const getInventoryForScene = function(inventoryList, mapId){
  return inventoryList.filter(item => item.map_id === mapId);
}

//todo: we will want to use this to push inventory to game on change
//   need to figure out what the game needs from the inventory list
export const pushInventory = function(inventoryList, map_id, callback) {
  return callback(getInventoryForMap(inventoryList, ITEMTYPES.ALL, map_id));
}