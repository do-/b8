define ([], function () {

    $_DO.update_user = function () {    

        query ({                
            type:     'users',            
            action:   'update',
        }, {data: values ($('.drw.form'))}, useCurrentBlock)

    }

    $_DO.delete_user = function () {

        query ({                
            type:     'users',            
            action:   'delete',
        }, {}, function (data) {
        
            try {
                window.opener.useCurrentBlock ();
            } catch (e) {}
            
            window.close ();
        
        })

    }    
    
    $_DO.undelete_user = function () {

        query ({                
            type:     'users',            
            action:   'undelete',
        }, {}, function (data) {
        
            try {
                window.opener.useCurrentBlock ();
            } catch (e) {}
            
            useCurrentBlock ();
        
        })

    }
    
    return function (done) {
    
        query ({type: 'users'}, {}, done)
        
    }
        
});