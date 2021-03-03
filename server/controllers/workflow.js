const contractInstance = require('../contract/instance').contractInstance;
const storage = require('../storage/app');
    
module.exports = {
    get: function(req, res) {
        contractInstance.methods.getVotingStatus().call().then(function(status) { 
            storage.votingStatus = storage.workflow[status];
            res.json({
                success: true,
                message: "Etat du système",
                data: storage.votingStatus
            }); 
        })
    }
}