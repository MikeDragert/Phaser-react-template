import React from "react";
import "../styles/TopNavigationBar.css";
// import labberLogo from "../assets/icons/duck2.png";

const TopNavigationBar = ({ isLoggedIn, setActivePage, handleLogout }) => {
    return (
        <nav className="top-navigation-bar">
             {/* <img src={labberLogo} alt="Labber Logo" className="site-logo" /> */}
            <div className="nav-section">
                <div className="nav-boxes">
                    <div
                        className="nav-box"
                        onClick={() => setActivePage("home")}
                    >
                        Home
                    </div>
                    <div
                        className="nav-box"
                        onClick={() => setActivePage("highscores")}
                    >
                        Highscores
                    </div>
                    <div
                        className="nav-box"
                        onClick={() => setActivePage("achievements")}
                    >
                        Achievements
                    </div>
                </div>
            </div>
            {!isLoggedIn ? (
                <div className="login-regsiter-links">
                    <div
                        className="small-nav-box"
                        onClick={() => setActivePage("login")}
                    >
                        Login
                    </div>
                    <div
                        className="small-nav-box"
                        onClick={() => setActivePage("register")}
                    >
                        Register
                    </div>
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
