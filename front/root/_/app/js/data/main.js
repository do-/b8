define ([], function () {

    $_DO.execute_logout = function () {
    
        sessionStorage.clear ()
        
        query ({type: 'sessions', action: 'delete'}, {}, $.noop, $.noop)
        
        redirect ('/')
        
    }

    return function (done) {    
        done ()    
    }
        
});