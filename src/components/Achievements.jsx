import React from "react";
//import "./Achievements.css";

const Achievements = ({ allAchievements, playerAchievements }) => {
    const isAchievementObtained = (achievementId) => {
        return playerAchievements.some(
            (achievement) => achievement.achievement_id === achievementId
        );
    };

    return (
        <div>
            <h1>Achievements</h1>
            <ul>
                {allAchievements.map((achievement) => (
                    <li
                        key={achievement.id}
                        style={{
                            color: isAchievementObtained(achievement.id)
                                ? "black"
                                : "grey",
                        }}
                    >
                        {achievement.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Achievements;
