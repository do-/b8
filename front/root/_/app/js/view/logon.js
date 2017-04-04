define ([], function () {

    function recalc () {    
        var h = $(window).height () - 338
        if (h < 0) h = 0
        $('header').css ('margin-top', h / 2)       
    }
    
    function inLogin    () { return $('input[name=login]')}
    function inPassword () { return $('input[name=password]')}
    function btnOK      () { return $('button')}
    
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
                            
        $('main').empty ().append (view)
        
        recalc (); $(window).resize (recalc)                
        
        inLogin ().keyup (keyUp)
        inPassword ().keyup (keyUp)

        clickOn (btnOK (), $_DO.execute_logon);
        
        inLogin ().focus ()
    
    }

});