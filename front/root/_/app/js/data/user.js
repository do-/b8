define ([], function () {

    $_DO.update_user = function () {    

        query ({                
            type:     'users',            
            action:   'update',
        }, {data: values ($('.drw.form'))}, function (data) {use.block ('user')})

    }

    $_DO.delete_user = function () {

        query ({                
            type:     'users',            
            action:   'delete',
        }, {}, function (data) {
        
            window.opener.location.reload ();
            window.close ();
        
        })

    }
    
    return function (done) {
    
        query ({type: 'users'}, {}, done)
        
    }
        
});