//react requirements
import { useRef, useState, useEffect, useReducer } from "react";

//phaser components
import Phaser, { Game } from "phaser";
import { PhaserGame } from "./game/PhaserGame";
import WorkBench from "./components/WorkBench.jsx";

import { ITEMTYPES } from "./helpers/inventoryHelpers.js";
import { EventBus } from "./game/EventBus";
import { HooksGame } from "./Hooks/HooksGame.js";

//styles
import "./styles/App.css";

//mocks
import player_items from "./mock_data/player_items";
import items from "./mock_data/items";

//pages
import TopNavigationBar from "./components/TopNavigationBar.jsx";
import { Home } from "./components/Home.jsx";
import Highscores from "./components/Highscores.jsx";
import Achievements from "./components/Achievements.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

export function App() {
    const {
        workBench,
        workbenchOpen,
        closeWorkbench,
        phaserRef,
        currentScene,
        showGame,
        openWorkbench,
        changeScene,
        inventoryList,
        gameOpen,
        getInventory,
        highscores,
        allAchievements,
        playerAchievements,
        handleLogin,
        handleLogout,
        handleRegister,
        setUsername,
        setPassword,
        setEmail,
        isLoggedIn,
        isRegistered,
        handleCheckEmail,
        username, 
        email,
        isEmailChecked,
        password,
        error,
    } = HooksGame();

    // State to manage the active page
    const [activePage, setActivePage] = useState("");

    // Function to switch between pages
    const navigateTo = (page) => {
        setActivePage(page);
    };

    // Render the appropriate component based on the active page
    let pageContent;
    switch (activePage) {
        case "highscores":
            pageContent = <Highscores highscores={highscores} />;
            break;
        case "achievements":
            pageContent = <Achievements allAchievements={allAchievements} playerAchievements={playerAchievements} />;
            break;
        case "login":
            pageContent = <Login handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} isLoggedIn={isLoggedIn} username={username} password={password} error={error}/>;
            break;
        case "register":
            pageContent = <Register handleRegister={handleRegister} setUsername={setUsername} setPassword={setPassword} setEmail={setEmail}isLoggedIn={isRegistered} handleCheckEmail={handleCheckEmail} username={username} password={password} email={email} isEmailChecked={isEmailChecked} error={error} />;
            break;
        default:
            pageContent = <Home workBench={workBench} workbenchOpen={workbenchOpen} closeWorkbench={closeWorkbench} phaserRef={phaserRef} currentScene={currentScene} showGame={showGame} openWorkbench={openWorkbench} changeScene={changeScene} getInventory={getInventory} inventoryList={inventoryList} gameOpen={gameOpen} />;
    }


    return (
        <div>
            <header>
                <TopNavigationBar
                    isLoggedIn={isLoggedIn}
                    setActivePage={setActivePage}
                    handleLogout={handleLogout}
                />
            </header>
            {pageContent}
        </div>
    );
}