const contractInstance = require('../config/init');
const storage = require('../config/storage');

module.exports = {
    add: function(req, res) {
        let user_address = req.body.from;
        let address_eth = req.body.address;
        contractInstance.methods.addWhiteList(address_eth).send({
          from: user_address,
          gas: 6721975,
          gasPrice: 20000000000
        }).on('error', function(error){ 
            res.json({
              success: false,
              message: error.message,
              data: null
            }); 
            console.log(error);
        }).then( function(tx) { 
            res.json({
              success: true,
              message: "Ajouté à la liste blanche",
              data: tx
            }); 
            console.log(tx);
        })
    }
}