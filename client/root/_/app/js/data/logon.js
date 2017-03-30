define ([], function () {

    $_DO.execute_logon = function () {    
    
        query ({
        
            type:     'logon',
            action:   'execute_json',
            login:    $('input[name=login]').val (),
            password: $('input[name=password]').val (),
            
        }, function (data) {

            if (data.success) {
                $_SESSION.set ('user', data.user)
                sessionStorage.setItem ('sid', data.sid)
            }
            
            draw_page ()
        
        })

    }

    return function (done) {    
        done ()    
    }
        
});