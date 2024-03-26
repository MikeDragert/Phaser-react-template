import axios from "axios";
axios.defaults.headers.common[{ "Content-Type": "application/json" }];

export const dbGetPlayerItems = function (playerId, playerSaveId, callback) {
    axios
        .get(`/api/player_items?player_save_id=${playerSaveId}`)
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.error("Error retrieving player db items:", error);
        });
};

export const dbGetLastestPlayerSave = function (playerId, callback) {
    axios
        .get(`/api/player_saves?player_id=${playerId}`)
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.error("Error retrieving player db latest save:", error);
        });
};

export const dbCreateNewPlayerSave = function (playerId, save_point, callback) {
    axios
        .post(`/api/players/${playerId}/player_saves`, {
            save_point: save_point,
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.error("Error creating new save point:", error);
        });
};

//not sure if working yet
export const dbSavePlayerItems = function (
    playerId,
    playerSaveId,
    items,
    callback
) {
    let updatedItems = items.map((item) => {
        item.player_save_id = playerSaveId;
        return item;
    });
    let sendParams = { data: JSON.stringify(updatedItems) };
    axios
        .post(`/api/players/${playerId}/player_items`, sendParams)
        .then((response) => {
            //console.log('got', response.data)
            callback(response.data);
        })
        .catch((error) => {
            console.error("Error saving player items to save point:", error);
        });
};

// export const dbGetHighscores = function (callback) {
//     axios
//         .get(`/api/players/scores`)
//         .then((response) => {
//                 callback(response.data);
//             })
//             .catch((error) => {
//                 console.error("Error retrieving achievements:", error);
//             });
// };

export const dbGetAchievements = () => {
    return axios.get(`/api/achievements`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error retrieving achievements:", error);
            throw error;
        });
};

export const dbGetPlayerAchievements = (playerId) => {
    return axios.get(`/api/player_achievements?player_id=${playerId}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error retrieving player achievements:", error);
            throw error;
        });
};


// export const dbLogin = function (username, password, callback) {
//     axios
//         .post("/api/login", { username, password })
//         .then((response) => {
//             console.log("Login successful");
//             callback(response.data);
//         })
//         .catch((error) => {
//             console.error("Error logging in:", error);
//         });
// };

// export const dbRegister = function (username, password, callback) {
//     axios
//         .post("/api/register", { username, password, email })
//         .then((response) => {
//             console.log("Register successful");
//             callback(response.data);
//         })
//         .catch((error) => {
//             console.error("Error registering:", error);
//         });
// };

// export const logout = function (callback) {
//     axios
//         .post("/api/logout")
//         .then((response) => {
//             console.log("Logout successful");
//             callback(response.data);
//         })
//         .catch((error) => {
//             console.error("Error logging out:", error);
//         });
// };
