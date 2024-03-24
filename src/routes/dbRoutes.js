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

//need to create new save

//need to save all player items against new save
  // ruby to handle breaking into player_items, and items
