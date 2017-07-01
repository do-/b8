define ([], function () {

    $_DO.close_user_file = function () {
    
        window.close ()
    
    }    
    
    $_DO.download_user_file = function () {
    
        download ({type: 'user_files', part: 'content'})
    
    }    

    $_DO.delete_user_file = function () {

        query ({type: 'user_files', action: 'delete'}, {}, function () {
            refreshOpener ()
            window.close ()        
        })

    }    
    
    $_DO.undelete_user_file = function () {

        query ({type: 'user_files', action: 'undelete'}, {})

    }    

    return function (done) {

        query ({type: 'user_files'}, {}, done)        

    }
    
});