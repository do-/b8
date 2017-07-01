define ([], function () {

    $_DO.create_users = function () {    

        query ({action: 'create'}, {}, function (data) {        
            
            var uri = '/user/' + data.id
        
            openTab (uri, uri)        
        
        })

    }    

    return fire
        
});