import { CodeObject } from '../components/CodeObject.jsx';

const ACTION = {
  SETMAX: 'setMax',
  MOVECODEOBJECTS: 'moveCodeObjects'
}

//check that and array Index Map is an array with a value[0] from min up to and including max
const arrayIndexMapValid = function(arrayIndexMap, min, max) {
  return  (
    (arrayIndexMap) &&
    (Array.isArray(arrayIndexMap)) && 
    (arrayIndexMap.length > 0) &&
    (arrayIndexMap[0] >= min) && 
    (arrayIndexMap[0] <= max)
  );
}

//execute given callback on the code list item specified in the arrayIndexMap
const executeOnCodeListItem = function(codeList, arrayIndexMap, callbacks) {
  if (arrayIndexMapValid(arrayIndexMap, 0, 8)) {
    let index = arrayIndexMap.shift();
    if (arrayIndexMap.length === 0) {
      return callbacks.key(codeList.keys[index]);
    }
    if (arrayIndexMapValid(arrayIndexMap, 0, codeList.keys[index].length - 1)) {
      let index2 = arrayIndexMap.shift();
      return executeOnCodeListParamItem(codeList.keys[index][index2], arrayIndexMap, callbacks.codeObject);
    }
  } 
  return undefined;
}

//execute given callback on the code list item specified in the arrayIndexMap recursively by checking the code object params
const executeOnCodeListParamItem = function(codeObject, arrayIndexMap, callback) {
  if (arrayIndexMapValid(arrayIndexMap, 0, codeObject.getParamsLength() - 1)) {   
    let index = arrayIndexMap.shift();
    return executeOnCodeListParamItem(codeObject.getParam(index).getValueObject(), arrayIndexMap, callback)
  }
  return (callback(codeObject));
}

//reducer for updating the code function state
//todo:  this should be refactored...
export const reducer = (state, action) => {

  let newState = {...state, keys: [...state.keys]};
  if (action.type === ACTION.MOVECODEOBJECTS) {
    
    let {fromIndexArrayMap, toIndexArrayMap, codeObject, currencyCost, indicators, copyCounter} = action.value;
    
    let codeObjectToMove = codeObject;
    if (indicators.fromBench) {{
      newState.copyCounter = copyCounter + 1;
      codeObjectToMove = codeObject.clone(`-${newState.copyCounter}`) //todo:  this has to be unique!!
    }}

    // find the container that it is going to
    if ((!indicators.toBench) || (indicators.newElement)) {
      executeOnCodeListItem(newState, toIndexArrayMap, {
        key: (keyArray) => {
          let objIndex = keyArray.indexOf(codeObjectToMove);
          if (objIndex > -1) {
            keyArray.splice(objIndex, 1)
          }
          keyArray.push(codeObjectToMove);
          return;
        },
        codeObject: (foundCodeObject) => {
          if (foundCodeObject) {
            if (foundCodeObject instanceof CodeObject) {
              foundCodeObject.removeParamObject(codeObjectToMove)
              foundCodeObject.setParamValue(codeObjectToMove)
            }
          }
          return;
        }
      });
    }
    
    if (!indicators.fromBench) {
      // find the container that it came from
      executeOnCodeListItem(newState, fromIndexArrayMap, {
        key: (keyArray) => {
          let objIndex = keyArray.indexOf(codeObject);
          if (objIndex > -1) {
            keyArray.splice(objIndex, 1)
          } 
          return;
        },
        codeObject: (foundCodeObject) => {
          if (foundCodeObject instanceof CodeObject) {
            foundCodeObject.removeParamObject(codeObject)
          }
          return;
        }
      });
    }

    newState.currentCurrency -= currencyCost;
    if (newState.currentCurrency > newState.maxCurrency) {
      newState.currentCurrency = newState.maxCurrency;
    }
    //console.log(codeObject, 'move From: ', fromIndexArrayMap, ' To: ', toIndexArrayMap, ' Current Currency: ', newState.currentCurrency, ' Currency cost: ',  currencyCost)
  };

  if (action.type === ACTION.SETMAX) {
    let newMax = action.value;
    let newCurrent = newMax - newState.maxCurrency; 
    newState.maxCurrency = newMax;
    newState.currentCurrency = newCurrent;
  };

  return newState
}

//get one of the starting codelist numbers for the name
const getListNumber = function(listName) {
  if ((listName) && (listName.toLowerCase().startsWith('key'))) {    
    let keyNumber = Number(listName.toLowerCase().replace('key', ''));
    if ((keyNumber !== undefined) && (!Number.isNaN(keyNumber))) {
      return keyNumber;
    }
  }
  return undefined;
}

//check if two code array maps are different
const areMapsDifferent = function(fromArrayMap, toArrayMap) {
  if (fromArrayMap.length === toArrayMap.length) {
    for(let index = 0; index < fromArrayMap.length; index++) {
      if (fromArrayMap[index] !== toArrayMap[index]) {
        return true;
      }
    }
    return false;
  }
  return true;
}

//check if the move of codeobject from fromArrayMap to toArrayMap is actually valid
const canMoveCodeObject = function(codeList, codeObject, fromArrayMap, toArrayMap) {
  let canMove = areMapsDifferent(fromArrayMap, toArrayMap);
  //disallow building objects in the bench side
  if ((toArrayMap.length > 1) && (toArrayMap[0] === 0)) {
    return false;
  } 
  if (canMove) {
    executeOnCodeListItem(codeList, [...toArrayMap], {
      key: (keyArray) => {
        canMove = true
      },
      codeObject: (foundCodeObject) => {
        canMove = foundCodeObject.canAcceptValue(codeObject)
      }
    });
  }
  return canMove;
}

// determine the currency cost of the move we are about to do
//we need to do this BEFORE entering the dispatch to move the items
const findCurrencyCostOfMove = function(codeList, codeObject, fromArrayMap, toArrayMap, indicators) {

  let fromIndexArrayMap = [...fromArrayMap];
  let toIndexArrayMap = [...toArrayMap];

  if (indicators.newElement) return 0;  //this is intilization and should not affect currencyCount

  let currencyCost = 0;
  //if it's not already there, then refund cost
  if (indicators.toBench) {
    currencyCost += executeOnCodeListItem(codeList, toIndexArrayMap, {
      key: (keyArray) => {
        //if it's not already there, then refund cost
        return (keyArray.includes(codeObject)) ? 0 : -codeObject.getFullCost();
      },
      codeObject: (foundCodeObject) => {
        return (foundCodeObject) && (foundCodeObject instanceof CodeObject) && foundCodeObject.hasParamCodeObject(codeObject) 
          ? 0 
          : -codeObject.getFullCost(); 
      }
    });
  }

  //if it's still on the bench, then charge cost
  if (indicators.fromBench) {
    currencyCost += executeOnCodeListItem(codeList, fromIndexArrayMap, {
      key: (keyArray) => {
        return (keyArray.includes(codeObject)) ?  codeObject.cost : 0;
      },
      codeObject: (foundCodeObject) => {
        return (foundCodeObject) && (foundCodeObject instanceof CodeObject) && foundCodeObject.hasParamCodeObject(codeObject) 
          ? codeObject.cost
          : 0; 
      }
    });
  }
  return currencyCost;
};

//move a code object from fromName to toName
export const moveCodeObject = function(codeList, dispatch, codeObject, fromName, toName) {
  let fromArrayMap = getCodeItemArrayMap(codeList, fromName)
  let toArrayMap = getCodeItemArrayMap(codeList, toName);

  let indicators = {
    newElement: ((fromArrayMap === undefined) || (fromArrayMap.length === 0)),
    fromBench: ((fromArrayMap.length === 1) && (fromArrayMap[0] === 0)),
    toBench: ((toArrayMap.length === 1) && (toArrayMap[0] === 0))
  }

  if (canMoveCodeObject(codeList, codeObject, fromArrayMap, toArrayMap)) {
    let currencyCost = findCurrencyCostOfMove(codeList, codeObject, fromArrayMap, toArrayMap, indicators);
    
    if (currencyCost <= codeList.currentCurrency) {
      dispatch({
        type: ACTION.MOVECODEOBJECTS, 
        value: {
          fromIndexArrayMap: 
          fromArrayMap, 
          toIndexArrayMap: 
          toArrayMap, 
          codeObject, 
          currencyCost, 
          indicators, 
          copyCounter: codeList.copyCounter
        }
      });
    }
  }
}

//dispatch to change the max currency
export const changeMaxCurrency = function(codeList, dispatch, maxCurrency) {
  dispatch({type: ACTION.SETMAX, value: maxCurrency});
}

//the 'bench' is actually key0
const checkKeyName = function(codeItemName) {
  if (codeItemName.toLowerCase() === 'bench'){
    return 'key0';
  }
  return codeItemName;
}

// search the whole data tree for a codeItemName, return the arrayIndexMap if found
const searchTreeForCodeObject = function(codeList, codeItemName) {
  for (let index = 0; index < codeList.keys.length; index++) {
    for (let keyIndex = 0; keyIndex < codeList.keys[index].length; keyIndex++) {
      let indexMap = [index, keyIndex];
      let foundIndexMap = getItemArrayMapCheckParam(codeItemName, codeList.keys[index][keyIndex], indexMap);
      if (foundIndexMap) return foundIndexMap;
    }
  }
  return [];
}

//this gets the arrayIndexMap for the code item, ONLY if it is in the top level of the keys object
const getBaseKeyListMap = function(codeItemName) {
  let listNumber = getListNumber(codeItemName)
  if (listNumber !== undefined) {
    return [listNumber]
  }
  return undefined;
}

// get the item array map out of the codelist
const getCodeItemArrayMap = function(codeList, codeItemName) {
  if (codeItemName === undefined) {
    return [];
  }
  codeItemName = checkKeyName(codeItemName);
  let itemArrayMap = getBaseKeyListMap(codeItemName);
  if (itemArrayMap) {
    return itemArrayMap;
  }
  return searchTreeForCodeObject(codeList, codeItemName)
}

//get the item array map recursively by checking the code object params
const getItemArrayMapCheckParam = function(codeItemName, codeObject, indexMap) {
  if (codeObject.name === codeItemName) {
    return indexMap;
  }
  for (let index = 0; index < codeObject.getParamsLength(); index++) {
    let newIndexMap = [...indexMap];
    newIndexMap.push(index);
    if (codeObject.getParam(index).isCodeObject()) {
      let foundIndexMap = getItemArrayMapCheckParam(codeItemName, codeObject.getParam(index).getValueObject(), newIndexMap);
      if (foundIndexMap) return foundIndexMap;        
    }
  }
  return undefined;
}