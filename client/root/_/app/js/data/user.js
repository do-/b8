define ([], function () {

    $_DO.update_user = function () {    

        query ({        
        
            type:     'users',            
            action:   'update',
            id:       $_REQUEST.id,
            _f:       $('input[name=f]').val (),
            _i:       $('input[name=i]').val (),
            _o:       $('input[name=o]').val (),
            _login:   $('input[name=login]').val (),
            _id_role: $('input[name=id_role]:checked').val (),
            
        }, function (data) {
        
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
    
        query ({
            type:   'users',
            id: $_REQUEST.id
        }, done)
        
    }
        
});