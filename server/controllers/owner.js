const contractInstance = require('../config/init');
const storage = require('../config/storage');
        
module.exports = {
    get: function(req, res) {
        contractInstance.methods.owner().call().then(function(address) { 
            storage.ownerAddress = address;
            res.json({
                success: true,
                message: "Adresse de l'owner",
                data: storage.ownerAddress
            }); 
        });
    }
}