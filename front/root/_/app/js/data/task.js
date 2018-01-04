define ([], function () {
    
    return function (done) {

        query ({type: 'tasks'}, {}, done)        

    }
        
});