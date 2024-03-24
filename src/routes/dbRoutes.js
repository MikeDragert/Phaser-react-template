import axios from 'axios';
axios.defaults.headers.common[{'Content-Type': 'application/json'}]

export const dbGetPlayerItems = function(playerId, playerSaveId, callback) {
  axios.get(`/api/player_items?player_save_id=${playerSaveId}`)  
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving player db items:', error)
    })
}

export const dbGetLastestPlayerSave = function(playerId, callback) {
  axios.get(`/api/player_saves?player_id=${playerId}`) 
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving player db latest save:', error)
    })
}

export const dbCreateNewPlayerSave = function(playerId, save_point, callback) {
  axios.post(`/api/players/${playerId}/player_saves`, {save_point: save_point})
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error creating new save point:', error)
    })
}

//not sure if working yet
export const dbSavePlayerItems = function(playerId, playerSaveId, items, callback) {
  let updatedItems = items.map(item => {
    item.player_save_id = playerSaveId;
    return item;
  })
  console.log('saving items', updatedItems)
  let sendParams = {data: JSON.stringify(updatedItems)};
  console.log('sending: ', sendParams)
  axios.post(`/api/players/${playerId}/player_items`, sendParams)
  .then((response) => {
    console.log('got', response.data)
    //callback(response.data);
  })
  .catch((error) => {
    console.error('Error saving player items to save point:', error)
  })
}

