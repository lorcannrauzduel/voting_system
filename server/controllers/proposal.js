const contractInstance = require('../config/init');
const storage = require('../config/storage');

module.exports = {
    all: function(req, res) {
        contractInstance.methods.getProposalCount().call().then(function(count) { 
        storage.proposals = [];
        proposalCount = count;
            for (let i = 0; i < proposalCount; i++) {
                contractInstance.methods.getProposal(i).call().then(function(proposal) { 
                storage.proposals.push(proposal)
                });
            }
        })
        res.json({
            success: false,
            message: 'Liste propositions',
            data: storage.proposals
        });
    },
    add: function(req, res) {
        let user_address = req.body.from;
        let description = req.body.description;
        contractInstance.methods.proposalSuggestion(description).send({
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
        }).then(function(tx) { 
            res.json({
            success: true,
            message: "Proposition enregistrée",
            data: tx
            }); 
            console.log(tx);
        })
    },
    startSession: function(req, res) {
        let user_address = req.body.from;
        let cooldown = req.body.cooldown;
        console.log(req.body);
        contractInstance.methods.proposalRegistration(cooldown).send({
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
        }).then(function(tx) { 
            res.json({
              success: true,
              message: "Démarrage de la session d'enregistrement des propositions",
              data: tx
            }); 
            console.log(tx);
        })
    },
    endSession: function(req, res) {
        let user_address = req.body.from;
        contractInstance.methods.closeRegistration().send({
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
        }).then(function(tx) { 
            res.json({
              success: true,
              message: "Fin de la session d'enregistrement des propositions",
              data: tx
            }); 
            console.log(tx);
        })
    }
}