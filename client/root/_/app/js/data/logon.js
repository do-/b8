define ([], function () {

    $_DO.execute_logon = function () {    
    
        query ({
        
            type:     'sessions',
            action:   'create',
            login:    $('input[name=login]').val (),
            password: $('input[name=password]').val (),
            
        }, function (data) {
        
            var d = data.data
            
            if (d.success) $_SESSION.set ('user', d.user)
            
            draw_page ()
        
        })

    }

    return function (done) {    
        done ()    
    }
        
});