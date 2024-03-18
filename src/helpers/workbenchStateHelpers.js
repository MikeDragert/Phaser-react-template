import { CodeObject } from '../components/CodeObject.jsx';

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
const executeOnCodeListItem = function(keys, arrayIndexMap, callbacks) {
  if (arrayIndexMapValid(arrayIndexMap, 0, 8)) {
    let index = arrayIndexMap.shift();
    if (arrayIndexMap.length === 0) {
      callbacks.key(keys[index]);
      return;
    }
    if (arrayIndexMapValid(arrayIndexMap, 0, keys[index].length - 1)) {
      let index2 = arrayIndexMap.shift();
      executeOnCodeListParamItem(keys[index][index2], arrayIndexMap, callbacks.codeObject);
      return;
    }
  }
  return;
}

//execute given callback on the code list item specified in the arrayIndexMap recursively by checking the code object params
const executeOnCodeListParamItem = function(codeObject, arrayIndexMap, callback) {
  if (arrayIndexMapValid(arrayIndexMap, 0, codeObject.getParamsLength() - 1)) {   
    let index = arrayIndexMap.shift();
    return executeOnCodeListParamItem(codeObject.getParam(index).getValueObject(), arrayIndexMap, callback)
  }
  callback(codeObject);
  return codeObject;
}

//reducer for updating the code function state
//todo:  this should be refactored...
export const reducer = (state, action) => {
  let {fromIndexArrayMap, toIndexArrayMap, codeObject} = action.value;
  let newState = {keys: [...state.keys], count:state.count};
  let countChange = 0
  if (toIndexArrayMap.length > 0) {
    // find the container that has it
    executeOnCodeListItem(newState.keys, toIndexArrayMap, {
      key: (keyArray) => {
        countChange += keyArray.length;
        let objIndex = keyArray.indexOf(codeObject);
        if (objIndex > -1) {
          keyArray.splice(objIndex, 1)
        }
        keyArray.push(codeObject);
        countChange -= keyArray.length;
      },
      codeObject: (foundCodeObject) => {
        //todo: update counts
        console.log('to:', foundCodeObject)
        if (foundCodeObject) {
          foundCodeObject.removeParamObject(codeObject)
          if (foundCodeObject instanceof CodeObject) {
            foundCodeObject.setParamValue(codeObject)
          }
        }
      }
    });
  }

  if (fromIndexArrayMap.length > 0) {
    // find the container that has it
    executeOnCodeListItem(newState.keys, fromIndexArrayMap, {
      key: (keyArray) => {
        countChange -= keyArray.length;
        let objIndex = keyArray.indexOf(codeObject);
        if (objIndex > -1) {
          keyArray.splice(objIndex, 1)
        }         
        countChange += keyArray.length;
      },
      codeObject: (foundCodeObject) => {
        //todo: update counts
        foundCodeObject.removeParamObject(codeObject)
      }
    });
  }
  newState.count -= countChange;
  return newState;
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
  if (canMove) {
    executeOnCodeListItem(codeList.keys, [...toArrayMap], {
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

//move a code object from fromName to toName
export const moveCodeObject = function(codeList, dispatch, codeObject, fromName, toName) {
  let fromArrayMap = getCodeItemArrayMap(codeList, fromName)
  let toArrayMap = getCodeItemArrayMap(codeList, toName);
  if (canMoveCodeObject(codeList, codeObject, fromArrayMap, toArrayMap)) {
    dispatch({type: 'dont care yet', value: {fromIndexArrayMap: fromArrayMap, toIndexArrayMap: toArrayMap, codeObject}});
  }
}

//the 'bench' is actually key0
const checkKeyName = function(codeItemName) {
  if (codeItemName.toLowerCase() === 'bench'){
    return 'key0';
  }
  return codeItemName;
}

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