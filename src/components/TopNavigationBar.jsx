import React from "react";
//import "./styles/TopNavigationBar.css";

const TopNavigationBar = ({ isLoggedIn, setActivePage, handleLogout }) => {

    return (
        <nav className="top-navigation-bar">
            <span className="site-title">Welcome to Labber!</span>
            <div className="nav-section">
                <ul>
                    <li>
                    <div onClick={()=>setActivePage("home")}>Home</div>
                    </li>
                    <li>
                    <div onClick={()=>setActivePage('highscores')}>Highscores</div>
                    </li>
                    <li>
                        <div onClick={()=>setActivePage("achievements")}>Achievements</div>
                    </li>
                </ul>
            </div>
            {!isLoggedIn ? (
                <div className="login-regsiter-links">
                    <ul>
                        <li>
                        <div onClick={()=>setActivePage("login")}>Login</div>
                        </li>
                        <li>
                        <div onClick={()=>setActivePage("register")}>Register</div>
                        </li>
                    </ul>
                </div>
            ) : (
                <div className="logout-link">
                    <div onClick={handleLogout}>Logout</div>
                </div>
            )}
        </nav>
    );
};

export default TopNavigationBar;
