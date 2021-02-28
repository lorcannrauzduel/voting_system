const express = require('express');
const app = express();
const router = express.Router();
const port = 8000;
const config = require('./config/contract')
const Contract = require('web3-eth-contract');
const Web3 = require('web3');
const bodyParser = require('body-parser');

// Contrat
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.rpc_server));
let contractInstance = new web3.eth.Contract(config.abi, config.contract_address);

// Initialisation des variables
let ownerAddress;
let loginAddress;
let isOwner;
let isLogin;
let proposalCount;
let proposals = [];
let historical = [];


// Récupère l'adresse du owner
contractInstance.methods.owner().call().then(function(address) { 
  ownerAddress = address;
});

// Accueil
router.get('/home', function(req, res, next) {
  if(isLogin) {
    contractInstance.methods.getProposalCount().call().then(function(count) { 
      proposalCount = count;
      for (let i = 0; i < proposalCount; i++) {
        contractInstance.methods.getProposal(i).call().then(function(proposal) { 
          proposals.push(proposal)
        });
      }
    })
    res.render('index', { 
      abi: config.abi,
      rpcServer :  config.rpc_server,
      contractAddress : config.contract_address,
      proposals: proposals,
      owner: ownerAddress,
      isOwner: isOwner,
      isLogin: isLogin,
      historical: historical
    });
    proposals = [];
  } else {
    res.redirect('/login');
  }
});

// Admin
router.get('/admin', function(req, res, next) {
  if(isOwner && isLogin) {
    res.render('admin');
  } else {
    res.redirect('/home');
  }
});

// Page de connexion
router.get('/login', function(req, res, next) {
  if(!isLogin) {
    res.render('login');
  } else {
    res.redirect('/home');
  }
});

// Login
router.post('/login', function(req, res, next) {
  let loginAddress = req.body.from;
  if(loginAddress.toLowerCase() == ownerAddress.toLowerCase()) {
    isOwner = true;
  } else {
    isOwner = false;
  }
  isLogin = true;
  res.status(200).send({
    success: true,
    message: "Connecté",
    data: loginAddress
  })
});

// Enregistrer une proposition (User) 
router.post('/proposal', function(req, res, next) {
  let user_address = req.body.from;
  let description = req.body.description;
  contractInstance.methods.proposalSuggestion(description).send({
    from: user_address,
    gas: 6721975,
    gasPrice: 20000000000
  }).on('error', function(error){ 
    res.json({
      success: false,
      message: getRevertReason(error.message),
      data: null
    }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "Proposition enregistrée",
        data: tx
      }); 
  })
});

// Voter pour une proposition (User)
router.post('/vote', function(req, res, next) {
  let user_address = req.body.from;
  let proposalId = req.body.proposalId;
  contractInstance.methods.vote(proposalId).send({
    from: user_address,
    gas: 6721975,
    gasPrice: 20000000000
  }).on('error', function(error){ 
    res.json({
      success: false,
      message: "Une erreur est survenue",
      data: null
    }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "A voté",
        data: tx
      }); 
  })
});

// Event vote
  // contractInstance.events.Voted()
  // .on('data', async function(event) {
  //   historical.push({
  //     proposal_id: event.returnValues.proposalId,
  //     voter: event.returnValues.voter
  //   });
  // })
  // .on('error', console.error);

// Ajouter à la whitelist (Admin)
router.post('/whitelist', function(req, res, next) {
  let user_address = req.body.from;
  let address_eth = req.body.address;
  contractInstance.methods.addWhiteList(address_eth).send({
    from: user_address,
    gas: 6721975,
    gasPrice: 20000000000
  }).on('error', function(error){ 
      res.json({
        success: false,
        message: getRevertReason(error.message),
        data: null
      }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "Ajouté à la liste blanche",
        data: tx
      }); 
  })
});

// Démarrage de la session d'enregistrement des propositions (Admin)
router.post('/start-proposal', function(req, res, next) {
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
        message: "Une erreur est survenue",
        data: null
      }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "Démarrage de la session d'enregistrement des propositions",
        data: tx
      }); 
  })
});

// Fin de la session d'enregistrement des propositions (Admin)
router.post('/end-proposal', function(req, res, next) {
  let user_address = req.body.from;
  contractInstance.methods.closeRegistration().send({
    from: user_address,
    gas: 6721975,
    gasPrice: 20000000000
  }).on('error', function(error){ 
      res.json({
        success: false,
        message: "Une erreur est survenue",
        data: null
      }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "Fin de la session d'enregistrement des propositions",
        data: tx
      }); 
  })
});


// Démarrage de la session de vote (Admin)
router.post('/start-vote', function(req, res, next) {
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
        message: "Une erreur est survenue",
        data: null
      }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "Démarrage de la session de vote",
        data: tx
      }); 
  })
});

// Fin de la session de vote (Admin)
router.post('/end-vote', function(req, res, next) {
  let user_address = req.body.from;
  contractInstance.methods.closeVote().send({
    from: user_address,
    gas: 6721975,
    gasPrice: 20000000000
  }).on('error', function(error){ 
      res.json({
        success: false,
        message: "Une erreur est survenue",
        data: null
      }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "Fin de la session de vote",
        data: tx
      }); 
  })
});

// Comptabiliser les votes (Admin)
router.post('/get-vote', function(req, res, next) {
  let user_address = req.body.from;
  contractInstance.methods.countingVote().send({
    from: user_address,
    gas: 6721975,
    gasPrice: 20000000000
  }).on('error', function(error){ 
      res.json({
        success: false,
        message: "Une erreur est survenue",
        data: null
      }); 
  }).then( function(tx) { 
      res.json({
        success: true,
        message: "Vote comptabilisé",
        data: tx
      }); 
  })
});

// Prise en charge du JSON (POST)
app.use(bodyParser.urlencoded({
  extended: true
}));

// Configuration du moteur de template
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Routeur
app.use('/', router);


app.listen(port, () => {
  console.log('Lancement serveur..')
})

// Fonctions..

function getRevertReason(string) {
  let main_msg = "Returned error: VM Exception while processing transaction: revert ";
  let reason = string.substr(main_msg.length);
  return reason;
}