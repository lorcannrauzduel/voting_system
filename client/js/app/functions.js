//login 
function login(account) {
    post('login', {
        from: account
    })
    .always(function(result) {
        if(result.success !== true) {
            $.notify(result.message, 'error');
        } else {
            $.notify(result.message, 'success');
        }
    })
}

//logout
function logout(account) {
    post('logout')
    .always(function(result) {
        if(result.success !== true) {
            $.notify(result.message, 'error');
        } else {
            $.notify(result.message, 'success');
            $('#btn-is-connected').html('Se connecter à MetaMask');
            $('#btn-is-connected').attr('class', 'btn btn-primary btn-rounded');
        }
    })
}