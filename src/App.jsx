import { useRef, useState, useEffect, useReducer } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';
import WorkBench from './components/WorkBench.jsx';
import { reducer, moveCodeObject } from './helpers/workbenchStateHelpers.js';
import { EventBus } from './game/EventBus';

function App ()
{
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

  const [codeList, dispatch] = useReducer(reducer, initialState)

  const moveCodeObjectJumper = function(codeObject, fromName, toName) {
    return moveCodeObject(codeList, dispatch, codeObject, fromName, toName);
  }

  const getFunctionList = function() {
    return [
      {name: "jumpPower", callback: (jumpPower) => {
        phaserRef.current.scene.setJumpPower(jumpPower);
        return
      }}
    ];
  }

  let workBench = new WorkBench(codeList, moveCodeObjectJumper, loaded, setLoaded, getFunctionList());

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
