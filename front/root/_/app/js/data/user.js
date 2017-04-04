define ([], function () {

    $_DO.update_user = function () {    

        query ({                
            type:     'users',            
            action:   'update',
        }, {data: values ($('.drw.form'))}, function (data) {
        
            if (data.message) {
            
                if (data.field) $('input[name=' + data.field + ']').focus (),

                alert (data.message)

            }
            else {
                use.block ('user')
            }
        
        })

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