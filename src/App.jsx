import { useRef, useState, useEffect, useReducer } from "react";

import Phaser, { Game } from "phaser";
import { PhaserGame } from "./game/PhaserGame";
import WorkBench from "./components/WorkBench.jsx";
import {
    reducer,
    moveCodeObject,
    changeMaxCurrency,
} from "./helpers/workbenchStateHelpers.js";
import { EventBus } from "./game/EventBus";

import "./styles/App.css";
import ItemContainer from "./components/ItemContainer.jsx";
import player_items from "./mock_data/player_items";
import items from "./mock_data/items";

//pages
import TopNavigationBar from "./components/TopNavigationBar.jsx";
import Home from "./components/Home.jsx";
import Highscores from "./components/Highscores.jsx";
import Achievements from "./components/Achievements.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
    // State to manage the active page
    const [activePage, setActivePage] = useState("home");

    // Function to switch between pages
    const navigateTo = (page) => {
        setActivePage(page);
    };

    // Render the appropriate component based on the active page
    let pageContent;
    switch (activePage) {
        case "highscores":
            pageContent = <Highscores />;
            break;
        case "achievements":
            pageContent = <Achievements />;
            break;
        case "login":
            pageContent = <Login />;
            break;
        case "register":
            pageContent = <Register />;
            break;
        default:
            pageContent = <Home />;
    }

    
    return (
        <div>
            <header>
                <TopNavigationBar />
            </header>

            <body>{pageContent}</body>
        </div>
    );
}

export default App;
