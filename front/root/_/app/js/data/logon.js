define ([], function () {

    $_DO.execute_logon = function () {    
    
        query (
        
            {type: 'sessions', action: 'create'},
        
            values ($('.logon.form')),
        
            function (data) {

                var d = data.data

                if (d && d.success) $_SESSION.set ('user', d.user)

                draw_page ()

            }
        
        )

    }

    return function (done) {    
        done ()    
    }
        
});