define ([], function () {

    return function (data, view) {
            
        $('title').text ('...')
                    
        $('body').empty ().append (view)
        
        clickOn ($('button.logout'), $_DO.execute_logout)
        clickOn ($('button[data-hotkey=F5]').hide (), showIt)
        
        use.block ('clock')
        use.block ('auth_toolbar_user')

        require (['tmilk/buttons'])        
        
    }
        
});