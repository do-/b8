define ([], function () {

    $_DO.execute_logout = function () {
    
        sessionStorage.clear ()
        
        query ({
            type:     'sessions',
            action:   'delete'
        }, $_DO.nothing, $_DO.nothing)
        
        window.location.href = '/'
        
    }

    return function (done) {    
        done ()    
    }
        
});