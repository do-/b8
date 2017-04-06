define ([], function () {

    var user
    
    function i_password () {
        return $('input[name=password]')
    }

    function recalc_span_password2 () {
        $('#span-password2').css ({visibility: i_password ().val () ? 'visible' : 'hidden'})
    }

    return function (data, view) {
    
        user = data
        
        user._read_only = (user.fake <= 0)
                
        $_F5 = function (over) {
        
            $('title').text (user.fake > 0 ? 'Новый пользователь' : user.label)

            user = $.extend (user, over)

            $('main').empty ().append (fill (view.clone (), user))

            drw.form_buttons ($('.toolbar'), user, {})

            if (user._read_only) return            

            recalc_span_password2 (); i_password ().keyup (recalc_span_password2)            

            $('input:first').focus ()

            $('input').keyup (onEnterGoToNextInput)
            
        }

        $_F5 ()            
    
    }
        
});