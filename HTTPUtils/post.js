const axios = require('axios');

module.exports = {
    htppPost: function htppPost(payload, webhookUrl) {
        axios.post(webhookUrl , payload )
        .then(res => {
        })
        .catch(error => {
            console.error(error)
        })
    }
};
