import React, { useReducer } from "react";

export const ITEMTYPES = {
  ALL: 0,
  CODENUMBER: 1,
  CODEOPERATOR: 2,
  CODEFUNCTION: 3,
  CODEITEMMAX: 9,
  DUCK: 10,
  COIN: 11,
};

export const inventoryHelpers = () => {
  const ITEMTYPES = {
    ALL: 0,
    CODENUMBER: 1,
    CODEOPERATOR: 2,
    CODEFUNCTION: 3,
    CODEITEMMAX: 9,
    DUCK: 10,
    COIN: 11,
  };

  const INVENTORYACTION = {
    ADDITEM: "addItem",
    CLEAR: "clear",
    LOADLIST: "loadList",
  };

  const initialInventoryState = [];

  const itemMap = {
    //tileNumber : {name: itemName, type: itemType}
    // 158: {name:'Coin', type: ITEMTYPES.COIN}
    coin: ITEMTYPES.COIN,
    Number_1: ITEMTYPES.CODENUMBER,
    Number_2: ITEMTYPES.CODENUMBER,
    Number_3: ITEMTYPES.CODENUMBER,
    Number_4: ITEMTYPES.CODENUMBER,
    Number_5: ITEMTYPES.CODENUMBER,
    Number_6: ITEMTYPES.CODENUMBER,
    Number_7: ITEMTYPES.CODENUMBER,
    Number_8: ITEMTYPES.CODENUMBER,
    Number_9: ITEMTYPES.CODENUMBER,
    Number_10: ITEMTYPES.CODENUMBER,
    "Operator_+": ITEMTYPES.CODEOPERATOR,
    "Operator_-": ITEMTYPES.CODEOPERATOR,
    "Operator_*": ITEMTYPES.CODEOPERATOR,
    "Operator_/": ITEMTYPES.CODEOPERATOR,
    "Operator_%": ITEMTYPES.CODEOPERATOR,
    Function_jumpPower: ITEMTYPES.CODEFUNCTION,
    Function_playerSize: ITEMTYPES.CODEFUNCTION,
    Function_passKey: ITEMTYPES.CODEFUNCTION,
    Larry: ITEMTYPES.DUCK,
  };

  //inventory sort, to be called from dispatch
  const sortInventory = function(newInventoryList) {
    return newInventoryList.sort( (item1, item2) => {
      if (item1.item_type !== item2.item_type) {
        return item1.item_type - item2.item_type;
      }

      if (item1.item_name === item2.item_name) {
        return 0;
      }
      let item1NameArray = item1.item_name.split('_');
      let item2NameArray = item2.item_name.split('_');

      let haveTwoCodeNumbers = (
        (item1NameArray.length > 1) &&
        (item2NameArray.length > 1) &&
        (item1NameArray[0].toLowerCase() === 'number') && 
        (item2NameArray[0].toLowerCase() === 'number') &&
        (!Number.isNaN(Number(item1NameArray[1]))) &&
        (!Number.isNaN(Number(item2NameArray[1])))
      );
     
      if (haveTwoCodeNumbers) {
        return Number(item1NameArray[1]) - Number(item2NameArray[1]);
      }

      if (item1.item_name < item2.item_name) {
        return -1;
      }

      return 1;
    });
  }

  const inventoryReducer = (state, action) => {
    let newState = [...state];
    switch (action.type) {
      case INVENTORYACTION.ADDITEM:
        newState.push(action.data);
        sortInventory(newState);
        break;
      case INVENTORYACTION.CLEAR:
        if (action.data.mapId) {
          newState = newState.filter(
            (item) => item.map_id !== action.data.mapId
          );
        } else {
          newState = [];
        }
        break;
      case INVENTORYACTION.LOADLIST:
        newState = action.data;
        sortInventory(newState);
        break;
      default:
        break;
    }
    return newState;
  };

  const getAllCodeItems = function () {
    return inventoryList.filter(
      (item) => item.item_type < ITEMTYPES.CODEITEMMAX
    );
  };


  //get a list of items in the inventory, as per passed in options
  const getInventory = function (type = ITEMTYPES.ALL) {
    if (type === ITEMTYPES.ALL) {
      return inventoryList;
    }
    return inventoryList.filter((item) => item.item_type === type);
  };

  const getInventoryForMap = function (type, mapId) {
    if (type === ITEMTYPES.ALL) {
      return inventoryList.filter((item) => item.map_id === mapId);
    }

    return inventoryList.filter(
      (item) => item.item_type === type && item.map_id === mapId
    );
  };

  //get count of item, as per passed in options
  const getItemCountByType = function (type) {
    return inventoryList.filter((item) => item.item_type === type).length;
  };

  const getItemCountById = function (itemId) {
    return inventoryList.filter((item) => item.id === itemId).length;
  };

  const getItemCountByName = function (itemName) {
    return inventoryList.filter((item) => item.item_name === itemName).length;
  };

  const getItemCountByMap = function (mapId) {
    return inventoryList.filter((item) => item.map_id === mapId).length;
  };

  //add item to inventory, update state
  const addFullItemToInventory = function (fullItem) {
    return inventoryDispatch({ type: INVENTORYACTION.ADDITEM, data: fullItem });
  };

  const addItemToInventory = function (playerItem, item) {
    if (playerItem.item_id === item.id) {
      fullItem = { ...playerItem };
      fullItem.item_name = item.name;
      fullItem.item_type = item.type;
      return inventoryDispatch({
        type: INVENTORYACTION.ADDITEM,
        data: fullItem,
      });
    }
  };

  const addItemFromSceneToInventory = function (sceneItem) {
    let newItem = generateItem(sceneItem);
    // todo, extra things we should set if they are available
    // newItem.player_id = 1,
    // newItem.item_id = 0;
    // newItem.save_id = 0;
    addFullItemToInventory(newItem);
  };

  const generateItem = function (sceneItem) {
    let name = "";
    let unique_item_name = "";
    if (sceneItem.item.name === undefined) {
      name = sceneItem.item.properties.name;
      unique_item_name = sceneItem.item.properties.name;
    } else {
      name = sceneItem.item.name.split("-")[0];
      unique_item_name = sceneItem.item.name;
    }

    return {
      player_id: undefined,
      item_id: undefined,
      save_id: undefined,
      container_item_id: 0,
      location_x: sceneItem.item.x,
      location_y: sceneItem.item.y,
      map_id: sceneItem.sceneName,
      unique_item_name: unique_item_name,
      // name must be Number_1 ...
      item_name: name,
      item_type: itemMap[name],
    };
  };

  //save all given items
  const loadPlayerInventory = function (playerItemsList, itemsList) {
    let fullItemList = Object.values(playerItemsList).map((playerItem) => {
      if (itemsList[playerItem.item_id]) {
        playerItem.item_name = itemsList[playerItem.item_id].name;
        playerItem.item_type = itemsList[playerItem.item_id].type;
      } else {
        playerItem.item_name = "UNKNOWN";
        playerItem.item_type = 0;
      }
      return playerItem;
    });
    return inventoryDispatch({
      type: INVENTORYACTION.LOADLIST,
      data: fullItemList,
    });
  };

  //empty the inventory
  const clearInventory = function () {
    return inventoryDispatch({ type: INVENTORYACTION.CLEAR, data: {} });
  };

  const clearInventoryForScene = function (mapId) {
    return inventoryDispatch({ type: INVENTORYACTION.CLEAR, data: { mapId } });
  };

  const getInventoryForScene = function (mapId) {
    return inventoryList.filter((item) => item.map_id === mapId);
  };

  //todo: we will want to use this to push inventory to game on change
  //   need to figure out what the game needs from the inventory list
  const pushInventory = function (map_id, callback) {
    return callback(getInventoryForMap(ITEMTYPES.ALL, map_id));
  };

  const [inventoryList, inventoryDispatch] = useReducer(
    inventoryReducer,
    initialInventoryState
  );

  return {
    ITEMTYPES,
    inventoryList,
    getAllCodeItems,
    getInventory,
    getInventoryForMap,
    getItemCountByType,
    getItemCountById,
    getItemCountByName,
    getItemCountByMap,
    addFullItemToInventory,
    addItemToInventory,
    addItemFromSceneToInventory,
    loadPlayerInventory,
    clearInventory,
    clearInventoryForScene,
    getInventoryForScene,
    pushInventory,
  };
};

