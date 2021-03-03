const contractInstance = require('../contract/instance').contractInstance;
const config = require('../contract/instance').config;
const storage = require('../storage/app');
module.exports = {
    get: function(req, res) {
        if(storage.isLogin) {
            res.json({
              success: true,
              message: "Connecté",
              data: {
                address: storage.loginAddress,
                contractAddress: config.contract_address,
                rpcServer: config.rpc_server,
                abi: config.abi
              }
            })
          } else {
            res.json({
              success: false,
              message: "Non connecté",
              data: storage.loginAddress
            })
          }
    },
    login: function(req, res) {
        contractInstance.methods.owner().call().then(function(address) { 
            storage.ownerAddress = address;
            storage.loginAddress = req.body.from;
            if(storage.loginAddress.toLowerCase() == storage.ownerAddress.toLowerCase()) {
                storage.isOwner = true;
            } else {
                storage.isOwner = false;
            }
            if(storage.loginAddress !== null) {
                storage.isLogin = true;
                message = "Connecté";
            if(storage.isOwner) {
                message = "Connecté en admin";
            }
            } else {
                storage.isLogin = false
                message = "Erreur de connexion"
            }
            res.json({
                success: storage.isLogin,
                message: message,
                data: storage.loginAddress
            })
        });
    },
    logout: function(req, res) {
        storage.isLogin = false;
        res.json({
          success: true,
          message: "Déconnexion",
          data: null
        })
    },

}