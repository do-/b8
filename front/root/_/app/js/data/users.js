define ([], function () {

    $_DO.create_user = function () {    

        query ({action: 'create'}, {}, function (data) {        
            
            var uri = '/user/' + data.data.id        
        
            openTab (uri, uri)        
        
        })

    }

    return function (done) {
    
        query ({}, {search: values ($('.toolbar'))}, done)
        
    }
        
});