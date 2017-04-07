define ([], function () {

    var users   

    return function (data, view) {
            
        $('title').text ('Пользователи')
        
        users = data.users
                       
        for (var i = 0; i < users.length; i ++) {
            var user = users [i]
            if (user.id) {
                user.uri = '/user/' + user.id
                delete user.id
            }
            else {
                user.id = 'next'
            }
        }

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