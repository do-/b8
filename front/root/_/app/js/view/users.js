define ([], function () {

    return function (data, view) {
            
        $('title').text ('Пользователи')

        drw.table (view, {}, $('body > main'), {}, function (data) {
        
            checkList (data, 'users')
                        
        })
                        
    }

});