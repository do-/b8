define ([], function () {

    return function (data, view) {
        
        fill (view, {}, $('body'))
        
        if ($_USER && $_USER.role != 'admin') $('body > main > nav > button[name=users]').remove ()
        
        $('body > main > nav > button').each (function () {        
            var uri = '/' + this.name + '/'
            if (uri != window.location.pathname) clickOn ($(this), function () {openTab (uri)})
        })

        use.block ('clock')
        use.block ('auth_toolbar_user')
        use.block ($_REQUEST.type)
        
    }
        
});