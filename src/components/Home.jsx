import React from "react";
import Phaser, { Game } from "phaser";
import { PhaserGame } from "../game/PhaserGame";
import WorkBench from "./WorkBench.jsx";
// import {
//     reducer,
//     moveCodeObject,
//     changeMaxCurrency,
// } from "../helpers/workbenchStateHelpers.js";
// import { EventBus } from "../game/EventBus";

import "../styles/App.css";
import ItemContainer from "./ItemContainer.jsx";
// import player_items from "../mock_data/player_items";
// import items from "../mock_data/items";

export const Home = ( {workBench, workbenchOpen, closeWorkbench, phaserRef, currentScene, showGame, openWorkbench, changeScene, getInventory, gameOpen, getItemCountByType} ) => {
    return (
        <div id="app">
            {workbenchOpen && <div>{workBench.getReactBench()}</div>}
            {workbenchOpen && (
                <button className="button" onClick={closeWorkbench}>
                    Close Workbench
                </button>
            )}
            <div>
                <PhaserGame
                    ref={phaserRef}
                    currentActiveScene={currentScene}
                    className={showGame ? "" : "appHidden"}
                />
                {gameOpen && (
                    <button className="button" onClick={openWorkbench}>
                        Open Workbench
                    </button>
                )}
                {gameOpen && (
                    <button className="button" onClick={changeScene}>
                        Change Scene
                    </button>
                )}
                {gameOpen && (
                    <button type="button" onClick={() => workBench.execute1()}>
                        Run 1
                    </button>
                )}
            </div>
            <div>
                <ItemContainer items={getInventory()} getItemCountByType={getItemCountByType} />
            </div>
        </div>
    );
};
