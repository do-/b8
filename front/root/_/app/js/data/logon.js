define ([], function () {

    $_DO.execute_logon = function () {    
    
        query (
        
            {type: 'sessions', action: 'create'},
        
            values ($('.logon.form')),
        
            function (data) {

                var d = data.content

                if (d && d.success) {
                    $_SESSION.set ('user', d.user)
                    $_SESSION.set ('timeout', d.timeout)
                }

                draw_page ()

            }
        
        )

    }

    return function (done) {    
        done ()    
    }

});