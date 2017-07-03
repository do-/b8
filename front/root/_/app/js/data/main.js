define ([], function () {

    $_DO.logout_main = function () {
    
        sessionStorage.clear ()
        
        query ({type: 'sessions', action: 'delete'}, {}, $.noop, $.noop)
        
        redirect ('/')
        
    }

    return function (done) {
    
        if (!$_USER) {

            $_REQUEST.type = 'logon'

        }
        else {

            if (!$_REQUEST.type) redirect ('/users/')

            if ($_REQUEST.download) return use.data ($_REQUEST.type)

        }    
    
        done ()

    }
        
});