define ([], function () {

    return function (data, view) {
            
        $('title').text ('Пользователи')
        
        checkList (data, 'users')

        drw.table ($('#users-table'), fill (view, data), [
            
            {
                icon:    'create',
                label:   '&Добавить',
                onClick: $_DO.create_user
            },
            
            {
                label:   'ФИО',
                name:    'q',                
            },
            {
                label:   'Login',
                name:    'login',                
            },
            
            'fake_select'

        ])
        
        use.lib ('tmilk/table-selector')
                
    }

});