import { useRef, useState, useEffect, useReducer } from 'react';

import Phaser, { Game } from "phaser";
import { PhaserGame } from './game/PhaserGame';
import WorkBench from './components/WorkBench.jsx';
import { reducer, moveCodeObject, changeMaxCurrency } from './helpers/workbenchStateHelpers.js';
import { EventBus } from './game/EventBus';

import './styles/App.css';



function App ()
{
  const [showGame, setShowGame] = useState(true);
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
    maxCurrency: 0,
    currentCurrency: 0,
    copyCounter: 0
  }

  const [codeList, dispatch] = useReducer(reducer, initialState)

  const moveCodeObjectJumper = function(codeObject, fromName, toName) {
    return moveCodeObject(codeList, dispatch, codeObject, fromName, toName);
  }

  const changeMaxCurrencyJumper = function(maxCurrency) {
    return changeMaxCurrency(codeList, dispatch, maxCurrency);
  }

  const getFunctionList = function() {
    return [
      {name: "jumpPower", callback: (jumpPower) => {
        phaserRef.current.scene.setJumpPower(jumpPower);
        return
      }}
    ];
  }

  let workBench = new WorkBench(codeList, moveCodeObjectJumper, changeMaxCurrencyJumper, loaded, setLoaded, getFunctionList());
  
  
  // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {

        const scene = phaserRef.current.scene;

    if (scene) {
      scene.changeScene();
    }
  };

  const moveSprite = () => {
    const scene = phaserRef.current.scene;

    if (scene && scene.scene.key === "MainMenu") {
      // Get the update logo position
      scene.moveLogo(({ x, y }) => {
        setSpritePosition({ x, y });
      });
    }
  };

  const addSprite = () => {
    const scene = phaserRef.current.scene;

    if (scene) {
      // Add more stars
      const x = Phaser.Math.Between(64, scene.scale.width - 64);
      const y = Phaser.Math.Between(64, scene.scale.height - 64);

      //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
      const star = scene.add.sprite(x, y, "star");

      //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
      //  You could, of course, do this from within the Phaser Scene code, but this is just an example
      //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
      scene.add.tween({
        targets: star,
        duration: 500 + Math.random() * 1000,
        alpha: 0,
        yoyo: true,
        repeat: -1,
      });
    }
  };


  // useEffect(() => {
  //   EventBus.on("touch-flag", (data) => {
  //     setWorkBenchState(true)
  //     console.log(data);
  //   });

  //   return () => {
  //     EventBus.removeListener("touch-flag");
  //   };
  // }, []);

  useEffect(() => {
    EventBus.on('keyEvent',  (data) => {
      //we get two keyEvent on the bus even though it was only sent once.  So, this triggers a read from the SendKeyEventsArray instead
      // of trusting the keyEvent message      
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
    //setCanMoveSprite(scene.scene.key !== "MainMenu");
  };

    const openWorkbench = (event) => {
      setWorkbenchOpen(true);
      setShowGame(false);
    }
  
    const closeWorkbench = (event) => {
      setWorkbenchOpen(false);
      setShowGame(true);
    }


    const changeShowGame = function(showGameValue) {
      setShowGame(showGameValue);
    }

    

    let gameOpen = !workbenchOpen;

    return (
        <div id="app">
          {workbenchOpen && <div>{workBench.getReactBench()}</div>}
          {workbenchOpen && <button className="button" onClick={closeWorkbench}>Close Workbench</button>}

          <div>
             <PhaserGame ref={phaserRef} currentActiveScene={currentScene} className={ showGame? '' : 'appHidden'}/>
            {gameOpen && <button className="button" onClick={openWorkbench}>Open Workbench</button>}
            {gameOpen && <button className="button" onClick={changeScene}>Change Scene</button>}
            {gameOpen && <button type="button" onClick={() => workBench.execute1()}>Run 1</button>} 
            
          </div>
        </div>
    )
}

export default App;

