define ([], function () {

    return function (data, view) {

        drw.title ('Текущие дела')
        
        data.id_user = $_USER.id

        drw.table (view, data, $('body > main > article'), {}, function (data) {
        
            checkList (data, 'tasks')
                        
        })
                        
    }

});