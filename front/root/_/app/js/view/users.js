define ([], function () {

    return function (data, view) {
            
        $('title').text ('Пользователи')
        
        var users = data.content.users
        
        for (var i = 0; i < users.length; i ++) {
            var user = users [i]
            user.uri = '/user/' + user.id
        }
        
        fill (view, data.content)
    
        $('main').empty ().append (view)

        clickOn ($('button.create'), $_DO.create_user)

        use.lib ('tmilk/table-selector')
    
    }
        
});