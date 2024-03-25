import axios from 'axios';
axios.defaults.headers.common[{'Content-Type': 'application/json'}]

export const dbGetPlayerItems = function(playerId, saveId, callback) {
  axios.get(`/api/player_items?player_save_id=${saveId}`)  //todo: pass saveId
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving player db items:', error)
    })
}

export const dbGetLastestPlayerSave = function(playerId, callback) {
  axios.get(`/api/player_saves?player_id=${playerId}`) //todo: pass playerId
    .then((response) => {
      console.log('got', response.data)
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving player db latest save:', error)
    })
}

export const dbGetHighscores = function(callback) {
    axios.get(`/api/highscores`)
      .then((response) => {
        console.log('got', response.data)
        callback(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving highscores:', error)
      })
  }

  export const dbGetAchievements = function(callback) {
    axios.get(`/api/achievements`) 
      .then((response) => {
        console.log('got', response.data)
        callback(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving achievements:', error)
      })
  }

  export const dbGetPlayerAchievements = function(playerId, callback) {
    axios.get(`/api/player_achievements?player_id=${playerId}`) 
      .then((response) => {
        console.log('got', response.data)
        callback(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving player achievements:', error)
      })
  }

  export const dbLogin = function(username, password, callback) {
    axios.post('/api/login', { username, password })
      .then((response) => {
        console.log('Login successful');
        callback(response.data);
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  export const dbRegister = function(username, password, callback) {
    axios.post('/api/register', { username, password, email })
      .then((response) => {
        console.log('Register successful');
        callback(response.data);
      })
      .catch((error) => {
        console.error('Error registering:', error);
      });
  };
  
  export const logout = function(callback) {
    axios.post('/api/logout')
      .then((response) => {
        console.log('Logout successful');
        callback(response.data);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

//need to create new save

//need to save all player items against new save
  // ruby to handle breaking into player_items, and items
