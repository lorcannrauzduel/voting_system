<?php include 'inc/template_start.php'; ?>
<?php include 'inc/template_navbar.php'; ?>

    <div class="container">
        <div class="d-flex justify-content-center mt-5 pt-5">

        <div class="card text-center" style="width: 35rem">
            <div class="card-body">
                <h5 class="card-title">Bienvenue sur notre système de vote décentralisé !</h5>
                <img src="https://media.newscentermaine.com/assets/WTSP/images/518d3c7f-739e-4f43-b9cc-99a10db8957a/518d3c7f-739e-4f43-b9cc-99a10db8957a_750x422.jpg" alt="" style="object-fit: contain;" width="350px" height="350px">
                <p class="card-text">
                    Merci de vous connectez avec votre portefeuille Metamask pour avoir accès à l'application.
                </p>            
                <button type="button" class="btn btn-primary btn-rounded mt-1 mb-3" id="btn-connect">Se connecter à Metamask</button>
            </div>
        </div>
        </div>
    </div>

<?php include 'inc/template_scripts.php'; ?>
<?php include 'inc/template_end.php'; ?>
<!-- Script page -->
<script>
        $(document).ready(function() {
                $('#btn-connect').click(function() {
                    ethereum.enable()
                    .then(function (accounts) {
                        account = accounts[0];
                        login(account);
                        // window.location.href = 'index.php';
                    })
                    .catch(function (error) {
                        console.error(error);
                    })
                })
        })
</script>