define ([], function () {

    return function (data, view) {
            
        $('title').text ('...')
        
        fill (view, {}, $('body'))

        clickOn ($('div.logout button'), $_DO.execute_logout)
        
        use.block ('clock')
        use.block ('auth_toolbar_user')
        
    }
        
});