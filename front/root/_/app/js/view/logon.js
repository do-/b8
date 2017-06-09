define ([], function () {

    function inLogin    () { return $('input[name=login]')}
    function inPassword () { return $('input[name=password]')}
    
    function keyUp (e) {
        if (e.which != 13) return
        if (!inLogin    ().val ()) return inLogin ().focus ()
        if (!inPassword ().val ()) return inPassword ().focus ()
        $_DO.execute_logon ()
    }
    
    return function (data, view) {
    
        $('.logout').remove ()
            
        $('title').text ('Вход в систему')

        $('div.auth-toolbar').toggleClass ('logon', true)
        
        fill (view, {}, $('main'))
                                            
        inLogin ().keyup (keyUp)
        inPassword ().keyup (keyUp)
        
        inLogin ().focus ()
    
    }

});