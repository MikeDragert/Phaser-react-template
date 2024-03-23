import axios from 'axios';
axios.defaults.headers.common[{'Content-Type': 'application/json'}]

export const getPlayerDbItems = function(playerId, callback) {
  axios.get(`/api/player_items`)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving player db items:', error)
    })
}