define ([], function () {

    var users

    return function (data, view) {
            
        $('title').text ('Пользователи')
        
        users = data.users
                
        $_F5 = function () {
        
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

            fill (view, data)
            
            var id = '#users-table'
            
            var t = $(id)
            
            if (t.length) {
                        
                var tbody = $('tbody', t)
                
                var start = $('input[name=start]')
            
                if (start.val () == 0) {
                    tbody.empty ()
                }
                else {
                    start.val (0)                
                }                
                                
                tbody.append ($('tbody', view).children ())

            }
            else {
            
                $('main').empty ().append (view)
                
                drw.toolbar_widgets ($('.toolbar'), {}, [
                
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

            }            
            
            use.lib ('tmilk/table-selector')
            
        }
        
        $_F5 ()

    }

});