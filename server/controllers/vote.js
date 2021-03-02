const contractInstance = require('../config/init');
const storage = require('../config/storage');

module.exports = {
    all: function(req, res) {
        contractInstance.getPastEvents('Voted', {
            fromBlock: 0,
            toBlock: 'latest'
        }).then(function(events){
            let voted_historical = events;
            for (let i = 0; i < voted_historical.length; i++) {

                let proposal_id = voted_historical[i].returnValues.proposalId;
                contractInstance.methods.getProposal(proposal_id).call().then(function(proposal) { 

                    let proposal_title = proposal[0];
                    web3.eth.getBlock(voted_historical[i].blockNumber).then(function(block) { 
                        let date = block.timestamp
                        storage.historical.push({
                        hash: voted_historical[i].transactionHash,
                        voter: voted_historical[i].returnValues.voter,
                        proposal_title: proposal_title,
                        timestamp: moment(new Date(date*1000)).locale('fr').format('LL')
                        })
                    });

                });

            }
        });
        res.json({
            success: true,
            message: 'Liste des votes',
            data: storage.historical
        }); 
    },
    add: function(req, res) {
        let user_address = req.body.from;
        let proposalId = req.body.proposalId;
        contractInstance.methods.vote(proposalId).send({
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
              message: "A voté",
              data: tx
            }); 
            console.log(tx);
        })
    },
    startSession: function(req, res) {
        let user_address = req.body.from;
        let cooldown = req.body.cooldown;
        console.log(req.body);
        contractInstance.methods.openVote(cooldown).send({
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
              message: "Démarrage de la session de vote",
              data: tx
            }); 
            console.log(tx);
        })
    },
    endSession: function(req, res) {
        let user_address = req.body.from;
        contractInstance.methods.closeVote().send({
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
              message: "Fin de la session de vote",
              data: tx
            }); 
            console.log(tx);
        })
    },
    count: function(req, res) {
        let user_address = req.body.from;
        if(isOwner) {
          res.json({
            success: true,
            message: "Les votes ont été comptabilisés",
            data: proposals.sort(function(a, b) {
              return b[1] - a[1];
            })
          }); 
        }
        contractInstance.methods.setWinningProposal(1).send({
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
              message: "Vote comptabilisé",
              data: tx
            }); 
            console.log(tx);
        })
    }
}