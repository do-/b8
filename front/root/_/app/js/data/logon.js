define ([], function () {

    $_DO.execute_logon = function () {    
    
        query (
        
            {type: 'sessions', action: 'create'}, {data: values ($('.logon.form'))}, function (data) {

                $_SESSION.start (data.user, data.timeout)

                location.reload ()

            }
        
        )

    }

    return function (done) {    
        done ()    
    }

});