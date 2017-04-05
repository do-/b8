define ([], function () {

    var users

    return function (data, view) {
            
        $('title').text ('Пользователи')
        
        users = data.content.users
                
        $_F5 = function () {
        
            for (var i = 0; i < users.length; i ++) {
                var user = users [i]
                user.uri = '/user/' + user.id
            }

            fill (view, data.content)

            $('main').empty ().append (view)
            
        }
        
        $_F5 ()

        clickOn ($('button.create'), $_DO.create_user)

        use.lib ('tmilk/table-selector')
    
    }
        
});