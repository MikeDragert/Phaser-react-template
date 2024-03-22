import React from "react";
//import "./TopNavigationBar.css";
import Highscores from "./Highscores";
import Achievements from "./Achievements";

const TopNavigationBar = () => {
    return (
        <div className="top-navigation-bar">
            <Highscores />
            <Achievements />
        </div>
    );
};

export default TopNavigationBar;
