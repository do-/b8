define ([], function () {

    return function (done) {
    
        query ({
            type: 'users',
        }, done)
        
    }
        
});