define ([], function () {

    $_DO.create_tasks = function () {

        query ({action: 'create'}, {}, function (data) {        
            
            var uri = '/task/' + data.id
        
            openTab (uri, uri)        
        
        })

    }    
    
    return function (done) {

        query ({}, {}, done)        

    }
        
});