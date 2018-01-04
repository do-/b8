define ([], function () {
    
    return function (data, view) {
    
        user = data
        
        user._read_only = (user.fake <= 0)
                
        $_F5 = function (over) {
        
            drw.title (user.fake > 0 ? 'Новый пользователь' : user.label)
        
            user = $.extend (user, over)
            
            $('body > main > article').empty ().append (fill (view.clone (), user))
            
            setup_photo ()

            drw.form_buttons ($('.toolbar'), user, {})

            if (user._read_only) {
                
                use.block ('user_files')
            
            }
            else {
                        
                recalc_span_password2 (); i_password ().keyup (recalc_span_password2)            

                $('input:first').focus ()

                $('input').keyup (onEnterGoToNextInput)
                
            }
            
        }

        $_F5 ()
    
    }
        
});