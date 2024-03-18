import { CodeObject } from '../components/CodeObject.jsx';

const executeOnCodeListItem = function(keys, arrayIndexMap, callbacks) {
  if ((Array.isArray(arrayIndexMap)) && (arrayIndexMap.length > 0)) {
    if ((arrayIndexMap[0] >= 0) && (arrayIndexMap[0] < keys.length)) {
      let index = arrayIndexMap.shift();
      if (arrayIndexMap.length === 0) {
        callbacks.key(keys[index]);
        return;
      }
      if ((arrayIndexMap[0] >= 0) && (arrayIndexMap[0] < keys.length)) {
        let index2 = arrayIndexMap.shift();
        return executeOnCodeListParamItem(keys[index][index2], arrayIndexMap, callbacks.codeObject)
      }
    }
  }
  return;
}

const executeOnCodeListParamItem = function(codeObject, arrayIndexMap, callback) {
  if ((Array.isArray(arrayIndexMap)) && (arrayIndexMap.length > 0)) {
    if ((arrayIndexMap[0] >= 0) && (arrayIndexMap[0] < codeObject.getParamsLength())) {
      let index = arrayIndexMap.shift();
      return executeOnCodeListParamItem(codeObject.getParam(index).getValueObject(), arrayIndexMap, callback)
    }
  }
  callback(codeObject);
  return codeObject;
}

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


const getListNumber = function(listName) {
  if ((listName) && (listName.toLowerCase().startsWith('key'))) {    
    let keyNumber = Number(listName.toLowerCase().replace('key', ''));
    if ((keyNumber !== undefined) && (!Number.isNaN(keyNumber))) {
      return keyNumber;
    }
  }
  return undefined;
}

export const moveCodeObject = function(codeList, dispatch, codeObject, fromName, toName) {
  
  let fromArrayMap = getCodeItemArrayMap(codeList, fromName)
  let toArrayMap = getCodeItemArrayMap(codeList, toName);
  let canMove = false;

  //need to check if there is actually a change

  if (fromArrayMap.length === toArrayMap.length) {
    for(let index = 0; index < fromArrayMap.length; index++) {
      if (fromArrayMap[index] !== toArrayMap[index]) {
        canMove = true;
        break;
      }
    }
  } else {
    canMove = true;
  }

  if (canMove) {
    //console.log('Can we move item from: ', fromArrayMap, 'To: ', toArrayMap)
    executeOnCodeListItem(codeList.keys, [...toArrayMap], {
      key: (keyArray) => {
        canMove = true
      },
      codeObject: (foundCodeObject) => {
        canMove = foundCodeObject.canAcceptValue(codeObject)
      }
    });
  }

  if (canMove) {
    console.log('Moving item from: ', fromArrayMap, 'To: ', toArrayMap)
    dispatch({type: 'dont care', value: {fromIndexArrayMap: fromArrayMap, toIndexArrayMap: toArrayMap, codeObject}});
  }
}

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

const getCodeItemArrayMap = function(codeList, codeItemName) {
  if (codeItemName === undefined) {
    return [];
  }

  //check if it's one of the base keyX name or "bench" (which is really key[0])
  if (codeItemName.toLowerCase() === 'bench'){
    codeItemName = 'key0';
  }

  let listNumber = getListNumber(codeItemName)
  if (listNumber !== undefined) {
    return [listNumber]
  }

  //if we got here, then it's not one of the top level key[] containers, and so we have to search the whole data tree
  for(let index = 0; index < codeList.keys.length; index++)
  {
    for (let keyIndex = 0; keyIndex < codeList.keys[index].length; keyIndex++) {
      let indexMap = [index, keyIndex];
      let foundIndexMap = getItemArrayMapCheckParam(codeItemName, codeList.keys[index][keyIndex], indexMap);
      if (foundIndexMap) return foundIndexMap;
    }
  }
  return [];
}
