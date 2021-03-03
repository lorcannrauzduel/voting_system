<?php  $title = 'Voting System | Accueil';  ?>
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
                    >Propositions</a
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
                    >Historique</a
                >
            </li>
        </ul>
        <div class="tab-content mt-3 mb-5" id="ex2-content">
            <div
            class="tab-pane fade show active"
            id="ex3-pills-1"
            role="tabpanel"
            aria-labelledby="ex3-tab-1"
            >
                <h2 class="mt-3">Enregistrer une proposition</h2>
                <div class="form-outline mt-3">
                    <textarea class="form-control" id="proposal-description" rows="4"></textarea>
                    <label class="form-label" for="textAreaExample">Proposition</label>
                </div>
                <button type="button" class="btn btn-primary btn-rounded mt-3" id="btn-add-proposal">
                    Ajouter
                </button>
                <div id="list-proposals">
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
            <div
            class="tab-pane fade mb-5"
            id="ex3-pills-2"
            role="tabpanel"
            aria-labelledby="ex3-tab-2"
            >
                <h2 class="mb-3">Historique</h2>
                <div id="list-voted">
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php include 'js/mustache/template_proposal.php'; ?>
<?php include 'js/mustache/template_historical.php'; ?>
<?php include 'inc/template_scripts.php'; ?>
<?php include 'inc/template_end.php'; ?>

<!-- Script page -->
<script>
        $(document).ready(function() {

            get('proposals').done(function(result) {
                var data = result.data;
                // console.log(data);
                $('#list-proposals').html('');
                buildTablesEach('#template_proposal', '#list-proposals', data)
                // Voter une proposition
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

            // Ajouter une proposition
            $('#btn-add-proposal').click(function() {
                let description = $('#proposal-description').val();
                post('proposals', {
                    from: account,
                    description: description
                }).always(function(result) {
                    if(result.success !== true) {
                        $.notify(result.message, 'error');
                    } else {
                        $.notify(result.message, 'success');
                    }
                })
            })

            get('votes').done(function(result) {
                var data = result.data;
                $('#list-voted').html('');
                buildTablesEach('#template_historical', '#list-voted', data)
            });
            
        })
</script>
</html>