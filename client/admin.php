<?php include 'inc/template_start.php'; ?>
<?php include 'inc/template_navbar.php'; ?>

    <div class="container">
        <div class="d-flex justify-content-center mt-5 mb-5">
            <button class="btn btn-light btn-rounded" id="workflow">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </button>
        </div>
        <ul class="nav nav-tabs nav-fill" id="ex1" role="tablist">
            <li class="nav-item" role="presentation">
                <a
                    class="nav-link active"
                    id="ex3-tab-1"
                    data-mdb-toggle="pill"
                    href="#ex3-pills-1"
                    role="tab"
                    aria-controls="ex3-pills-1"
                    aria-selected="true"
                    >Liste blanche</a
                >
            </li>
            <li class="nav-item" role="presentation">
                <a
                    class="nav-link"
                    id="ex3-tab-2"
                    data-mdb-toggle="pill"
                    href="#ex3-pills-2"
                    role="tab"
                    aria-controls="ex3-pills-2"
                    aria-selected="false"
                    >Propositions</a
                >
            </li>
            <li class="nav-item" role="presentation">
                <a
                    class="nav-link"
                    id="ex3-tab-3"
                    data-mdb-toggle="pill"
                    href="#ex3-pills-3"
                    role="tab"
                    aria-controls="ex3-pills-3"
                    aria-selected="false"
                    >Vote</a
                >
            </li>
        </ul>
        <div class="tab-content mt-3" id="ex2-content">
            <div
            class="tab-pane fade show active"
            id="ex3-pills-1"
            role="tabpanel"
            aria-labelledby="ex3-tab-1"
            >
                <h2 class="mb-3">Liste blanche</h2>
                <div class="form-outline">
                    <input type="text" class="form-control" id="address-eth"/>
                    <label class="form-label" for="address-eth">Adresse Ethereum</label>
                </div>
                <button type="button" class="btn btn-primary btn-rounded mt-3" id="btn-add-whitelist">Ajouter</button>

            </div>
            <div
            class="tab-pane fade"
            id="ex3-pills-2"
            role="tabpanel"
            aria-labelledby="ex3-tab-2"
            >
                <h2 class="mb-3">Propositions</h2>
                <div class="form-outline">
                    <input type="number" class="form-control" id="proposal-cooldown"/>
                    <label class="form-label" for="proposal-cooldown">Durée</label>
                </div>
                <button type="button" class="btn btn-primary btn-rounded mt-3" id="btn-start-proposal">Démarrer session</button>
                <button type="button" class="btn btn-danger btn-rounded mt-3" id="btn-end-proposal">Stopper session</button>
            </div>
            <div
            class="tab-pane fade"
            id="ex3-pills-3"
            role="tabpanel"
            aria-labelledby="ex3-tab-3"
            >
                <h2 class="mb-3">Vote</h2>
                <div class="form-outline">
                    <input type="number" class="form-control" id="vote-cooldown"/>
                    <label class="form-label" for="vote-cooldown">Durée</label>
                </div>
                <button type="button" class="btn btn-primary btn-rounded mt-3" id="btn-start-vote">Démarrer session</button>
                <button type="button" class="btn btn-danger btn-rounded mt-3" id="btn-end-vote">Stopper session</button>
                <button type="button" class="btn btn-warning btn-rounded mt-3" id="btn-get-vote">Compter les votes</button>
                <div class="mt-3" id="list-proposals">
                </div>
            </div>
        </div>
    </div>

<?php include 'inc/template_scripts.php'; ?>
<?php include 'inc/template_end.php'; ?>

<!-- Script page -->
<script>
        $(document).ready(function() {

            // Ajouter à la liste blanche
            $('#btn-add-whitelist').click(function() {
                let address_eth = $('#address-eth').val();
                post('whitelist', {
                    from: account,
                    address: address_eth
                }).always(function(result) {
                    if(result.success !== true) {
                        $.notify(result.message, 'error');
                    } else {
                        $.notify(result.message, 'success');
                    }
                })
            }) 

            // Démarrer session enregistrement proposition
            $('#btn-start-proposal').click(function() {
                let cooldown = $('#proposal-cooldown').val();
                post('start-proposal', {
                    from: account,
                    cooldown: cooldown
                }).always(function(result) {
                    if(result.success !== true) {
                        $.notify(result.message, 'error');
                    }
                })
            }) 

            // Fin session enregistrement proposition
            $('#btn-end-proposal').click(function() {
                post('end-proposal', {
                    from: account
                }).always(function(result) {
                    if(result.success !== true) {
                        $.notify(result.message, 'error');
                    }
                })
            }) 
            
            // Démarrer session vote
            $('#btn-start-vote').click(function() {
                let cooldown = $('#vote-cooldown').val();
                post('start-vote', {
                    from: account,
                    cooldown: cooldown
                }).always(function(result) {
                    if(result.success !== true) {
                        $.notify(result.message, 'error');
                    }
                })
            })

            // Fin session vote
            $('#btn-end-vote').click(function() {
                post('end-vote', {
                    from: account
                }).always(function(result) {
                    if(result.success !== true) {
                        $.notify(result.message, 'error');
                    }
                })
            }) 

            // Comptabiliser vote
            $('#btn-get-vote').click(function() {
                post('count-votes', {
                    from: account
                }).always(function(result) {
                    console.log(result);
                    let max = result.data.length > 3 ? 3 : result.data.length;
                    if(result.success !== true) {
                        $.notify(result.message, 'error');
                    } else {
                        $.notify(result.message, 'success');
                        $('#list-proposals').append('<hr>')
                        $('#list-proposals').append('<h3>Liste des '+max+' meilleurs propositions</h3>');
                        buildTablesEach('#template_proposal', '#list-proposals', result.data, max);
                    }
                })
            }) 

        })
</script>
</html>