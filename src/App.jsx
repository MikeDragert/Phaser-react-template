import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
   
    const changeScene = (event) => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            scene.changeScene();
            console.log('button pressed')
            event.target.blur()
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
       
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div>
                
            </div>
        </div>
    )
}

export default App
