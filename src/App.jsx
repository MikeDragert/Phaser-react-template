import { useRef, useState, useEffect, useReducer } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';
import WorkBench from './components/WorkBench.jsx';
import { CodeObject } from './components/CodeObject.jsx';
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';

import { EventBus } from './game/EventBus';

function App ()
{
    ///////*copied from previous appp********************************************************************* */
    //this section of code is needed to support the workbench stuff
    //  move to a helper??
     //array at 0 is the workbench
  // then keys 1 to 8
  const [loaded, setLoaded] = useState(false);
  const [workbenchOpen, setWorkbenchOpen] = useState(false);

  const initialState = {
    keys: [[],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []],
    count: 0
  }

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

  const reducer = (state, action) => {
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

  const [codeList, dispatch] = useReducer(reducer, initialState)

  const getListNumber = function(listName) {
    if ((listName) && (listName.toLowerCase().startsWith('key'))) {    
      let keyNumber = Number(listName.toLowerCase().replace('key', ''));
      if ((keyNumber !== undefined) && (!Number.isNaN(keyNumber))) {
        return keyNumber;
      }
    }
    return undefined;
  }

  const moveCodeObject = function(codeObject, fromName, toName) {
    
    let fromArrayMap = getCodeItemArrayMap(fromName)
    let toArrayMap = getCodeItemArrayMap(toName);
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

  const getCodeItemArrayMap = function(codeItemName) {
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


  const getFunctionList = function() {
    return [
      {name: "jumpPower", callback: (jumpPower) => {
        phaserRef.current.scene.setJumpPower(jumpPower);
        return
      }}
    ];
  }

  let workBench = new WorkBench(codeList, moveCodeObject, loaded, setLoaded, getFunctionList());
   ///////********************************************************************** */
  
  //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
   
    const changeScene = (event) => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            scene.changeScene();
            event.target.blur()
        }
    }

    const openWorkbench = (event) => {
      setWorkbenchOpen(true);
    }

    const closeWorkbench = (event) => {
      setWorkbenchOpen(false);
    }

    //this allows key events from the game to trigger the built workbench functions
    // we could also use this to change the drawn react components from an action in the game
    useEffect(() => {
      EventBus.on('keyEvent',  () => {
        while(phaserRef.current.scene.sendKeyEvents.length > 0){
          let keyEvent = phaserRef.current.scene.sendKeyEvents.pop();
          if ((keyEvent.keyCode === Phaser.Input.Keyboard.KeyCodes.ONE) && (keyEvent.isDown))  {
            workBench.execute1();
          }
        }
      })

      EventBus.on("touch-flag", (data) => {
        setWorkBenchState(true);
      })
    }, [phaserRef])

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {      
    }
    
    //{(!workbenchOpen) && <button className="button" onClick={openWorkbench}>Open Workbench</button>}
    // {(workBenchOpen !== undefined) && 
    //   <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    //   }
    let gameOpen = !workbenchOpen;

    return (
        <div id="app">
            
            {workbenchOpen && <div>{workBench.getReactBench()}</div>}
            {workbenchOpen && <button className="button" onClick={closeWorkbench}>Close Workbench</button>}
            <div>
              {gameOpen && <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />}
              {gameOpen && <button className="button" onClick={openWorkbench}>Open Workbench</button>}
            
              {gameOpen && <button className="button" onClick={changeScene}>Change Scene</button>}
              {gameOpen && <button type="button" onClick={() => workBench.execute1()}>Run 1</button>}
            </div>
        </div>
    )
}

export default App
