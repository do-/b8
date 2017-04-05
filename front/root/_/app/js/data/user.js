define ([], function () {

    $_DO.update_user = function () {    

        query ({type: 'users', action: 'update'}, {data: values ($('.drw.form'))}, showIt)

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