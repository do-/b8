define ([], function () {

    $_DO.update_user = function () {
    
        var data = values ($('.drw.form'))
        
        if (data.password) {
        
            if (!data.password2) {
                $('input[name=password2]').focus ()
                alert ('Для страховки от опечаток необходимо ввести пароль повторно')
                return
            }

            if (data.password != data.password2) {
                $('input[type=password]').val ('')
                $('input[name=password]').focus ()
                alert ('Ошибка при 1-м или 2-м вводе пароля')
                return
            }
        
        }

        query ({type: 'users', action: 'update'}, {data: data}, showIt)

    }

    $_DO.delete_user = function () {

        query ({type: 'users', action: 'delete'}, {}, function () {
            refreshOpener ()
            window.close ()        
        })

    }    
    
    $_DO.undelete_user = function () {

        query ({type: 'users', action: 'undelete'}, {}, function () {
            refreshOpener ()
            showIt ()
        })

    }
    
    return function (done) {

        query ({type: 'users'}, {}, done)        

    }
        
});