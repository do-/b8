define ([], function () {

    return function (data, view) {
            
        drw.title ('Пользователи')

        drw.table (view, {}, $('body > main > article'), {}, function (data) {
        
            checkList (data, 'users')
                        
        })
                        
    }

});