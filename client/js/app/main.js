let account;

$('#btn-is-connected').click(function() {
    ethereum.enable()
    .then(function (accounts) {
        account = accounts[0];
    })
});

ethereum.on('accountsChanged', function (accounts) {
    if(accounts[0] !== undefined) {
        login(accounts[0]);
        $('#btn-is-connected').html(formatAddress(accounts[0]));
        console.log(ethereum.isConnected());
    } else {
        logout();
    }
})

ethereum.on('networkChanged', async function (networkId) {
    if(networkId != 5777) {
        $('#btn-is-connected').html('<i class="fas fa-times"></i> ' + 'Mauvais réseau');
        $('#btn-is-connected').attr('class', 'btn btn-danger btn-rounded');
    } else {
        ethereum.enable()
        .then(function (accounts) {
            account = accounts[0];
            $('#btn-is-connected').html(formatAddress(account));
            $('#btn-is-connected').attr('class', 'btn btn-primary btn-rounded');
        })
    }
})

  
get('login').done(function(result) {
    if(result.success) {
        $('#btn-is-connected').html(formatAddress(result.data.address))
        $('#btn-is-connected').addClass('text-lowercase');
     
        const contract_address = result.data.contractAddress;
        const abi = result.data.abi;
        const rpc_server = result.data.rpcServer;
        const web3 = new Web3(new Web3.providers.WebsocketProvider(rpc_server));
        const contractInstance = new web3.eth.Contract(abi, contract_address);
        account = result.data.address;


        get('workflow').done(function(result) {
            $('#workflow').html(result.data);
        })

        // Event proposition
        contractInstance.events.ProposalRegistered()
        .on('data', async function(event){
            let proposal_id = event.returnValues.proposalId;
            contractInstance.methods.getProposal(proposal_id).call().then(function(proposal) { 
                buildTables('#template_proposal', '#list-proposals', proposal);
                $('.btn-add-vote').click(function() {
                   let proposalId = $(this).attr('data-id')
                   post('votes', {
                       from: account,
                       proposalId: proposalId
                   }).always(function(result) {
                       console.log(result)
                       if(result.success !== true) {
                           $.notify(result.message, 'error');
                       } else {
                           $.notify(result.message, 'success');
                       }
                   })
               })
            });
        })
        .on('error', console.error);

        // Event vote
        contractInstance.events.Voted()
        .on('data', async function(event){
            let proposal_id = event.returnValues.proposalId;
            let voter = event.returnValues.voter;
            contractInstance.methods.getProposal(event.returnValues.proposalId).call().then(function(proposal) { 
                let count = proposal[1];
                $('#count-vote-'+proposal_id).html(count);
                $.notify(voter + ' a voté pour : ' + proposal[0], 'success')
                // console.log(proposal)
            });
        })
        .on('error', console.error);

        // Event démarrage session enregistrement proposition
        contractInstance.events.ProposalsRegistrationStarted()
        .on('data', async function(event){
            $.notify('Démarrage de la session d\'enregistrement des propositions', 'success');
        })
        .on('error', console.error);

        // Event démarrage session vote
        contractInstance.events.VotingSessionStarted()
        .on('data', async function(event){
            $.notify('Démarrage de la session de vote', 'success');
        })
        .on('error', console.error);

        // Event fin session enregistrement proposition
        contractInstance.events.ProposalsRegistrationEnded()
        .on('data', async function(event){
            $.notify('Fin de la session d\'enregistrement des propositions', 'success');
        })
        .on('error', console.error);

        // Event fin de la session de vote
        contractInstance.events.VotingSessionEnded()
        .on('data', async function(event){
            $.notify('Fin de la session de vote', 'success');
        })
        .on('error', console.error);
    } else if(!result.success && window.location.pathname.split( '/' ).slice(-1)[0] != 'login.php') {
        window.location.href = 'login.php';
    }
})
