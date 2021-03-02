// Dépendances & config
const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');

const proposalController = require('./controllers/proposal');
const voteController = require('./controllers/vote');
const authController = require('./controllers/auth');
const whitelistController = require('./controllers/whitelist');
const workflowController = require('./controllers/workflow');
const ownerController = require('./controllers/owner');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Login
app.route('/login')
  .get(authController.get)
  .post(authController.login);

// Logout
app.route('/logout')
  .post(authController.logout);

// Owner
app.route('/owner')
  .get(ownerController.get);

// Proposition
app.route('/proposals')
  .get(proposalController.all)
  .post(proposalController.add);

// Votes
app.route('/votes')
  .get(voteController.all)
  .post(voteController.add);

// Workflow
app.route('/workflow')
  .get(workflowController.get);

// Liste blanche
app.route('/whitelist')
  .post(whitelistController.add);

// Commencer session proposition
app.route('/start-proposal')
  .post(proposalController.startSession);

// Fin session proposition
app.route('/end-proposal')
  .post(proposalController.endSession);

// Commencer session vote
app.route('/start-vote')
  .post(voteController.startSession);

// Fin session proposition
app.route('/end-vote')
  .post(voteController.endSession);

// Compter vote
app.route('/count-votes')
  .post(voteController.count);

app.listen(port, () => {
  console.log('Lancement serveur..')
})