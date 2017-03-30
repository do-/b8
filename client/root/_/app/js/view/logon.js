define ([], function () {

    function recalc () {    
        var h = $(window).height () - 338
        if (h < 0) h = 0
        $('header').css ('margin-top', h / 2)       
    }
    
    function inLogin    () { return $('input[name=login]')}
    function inPassword () { return $('input[name=password]')}
    function btnOK      () { return $('button')}
    
    function isPasswordDisabled () {
        var is = (inLogin ().val () == '')
//        inPassword ().prop ('disabled', is)
        return is
    }

    return function (data, view) {
    
        $('.logout').remove ()
            
        $('title').text ('Вход в сиситему')

        $('div.auth-toolbar').toggleClass ('logon', true)
                            
        $('main').empty ().append (view)
        
        recalc (); $(window).resize (recalc)
        
        inLogin ().blur (isPasswordDisabled)

        inLogin ().keyup (function (e) {
            if (!isPasswordDisabled () && (e.which == 13)) inPassword ().val ('').focus ()
        })

        inPassword ().keyup (function (e) {
            var isBanned = (inLogin ().val () == '') || (inPassword ().val () == '')
            if (isBanned) {
                clickOff (btnOK ())
            }
            else {
                clickOn (btnOK (), $_DO.execute_logon)
                if (e.which == 13) $_DO.execute_logon ()
            }
        })
        
        inLogin ().focus ()
    
    }

});