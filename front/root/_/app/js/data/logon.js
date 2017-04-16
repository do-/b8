define ([], function () {

    $_DO.execute_logon = function () {    
    
        query (
        
            {type: 'sessions', action: 'create'}, {data: values ($('.logon.form'))}, function (data) {

                var d = data
                
                if (d.timeout < 1) d.timeout = 1

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