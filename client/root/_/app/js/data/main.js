define ([], function () {

    $_DO.execute_logout = function () {
        sessionStorage.clear ()
        window.location.href = '/'
    }

    return function (done) {    
        done ()    
    }
        
});