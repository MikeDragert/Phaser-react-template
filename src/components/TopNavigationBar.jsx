import React from "react";
//import "./styles/TopNavigationBar.css";

const TopNavigationBar = ({ isLoggedIn }) => {
    return (
        <nav className="top-navigation-bar">
            <span className="site-title">Welcome to Labber!</span>
            <div className="nav-section">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/highscores">Highscores</a>
                    </li>
                    <li>
                        <a href="/achievements">Achievements</a>
                    </li>
                </ul>
            </div>
            {!isLoggedIn ? (
                <div className="login-regsiter-links">
                    <ul>
                        <li>
                            <a href="/login">Login</a>
                        </li>
                        <li>
                            <a href="/register">Register</a>
                        </li>
                    </ul>
                </div>
            ) : (
                <div className="logout-link">
                    <a href="/logout">Logout</a>
                </div>
            )}
        </nav>
    );
};

export default TopNavigationBar;
