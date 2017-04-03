define ([], function () {

    $_DO.update_user = function () {    

        query ({                
            type:     'users',            
            action:   'update',
        }, {data: values ($('.drw.form'))}, function (data) {
        
            if (data.message) {
            
                if (data.field) $('input[name=' + data.field.substr (1) + ']').focus (),

                alert (data.message)

            }
            else {
                use.block ('user')
            }
        
        })

    }

    return function (done) {
    
        query ({type: 'users'}, {}, done)
        
    }
        
});