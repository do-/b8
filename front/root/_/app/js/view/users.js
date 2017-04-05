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
            
            var id = '#users-table'
            
            var t = $(id)
            
            if (t.length) {
                t.replaceWith ($(id, view))
            }
            else {
                $('main').empty ().append (view)
            }
            
            use.lib ('tmilk/table-selector')
            
        }
        
        $_F5 ()

        clickOn ($('button.create'), $_DO.create_user)
        
        $('.toolbar input').keyup (onEnterUseCurrentBlock)
        $('.toolbar select').change (function () {
            $(this).blur ()
            useCurrentBlock ()
        })
    
    }
        
});