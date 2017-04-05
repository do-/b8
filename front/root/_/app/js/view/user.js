define ([], function () {

    var user
    
    function i_password () {
        return $('input[name=password]')
    }

    function recalc_span_password2 () {
        $('#span-password2').css ({visibility: i_password ().val () ? 'visible' : 'hidden'})
    }

    return function (data, view) {
    
        user = data.content
        
        user._read_only = (user.fake == 0)
            
        $('title').text (user.fake > 0 ? 'Новый пользователь' : user.label)
                
        $_F5 = function () {

            $('main').empty ().append (fill (view.clone (), user))

            if (!user._read_only) {            
                recalc_span_password2 (); i_password ().keyup (recalc_span_password2)            
                $('input:first').focus ()
                $('input').keyup (onEnterGoToNextInput)
            }            

            clickOn ($('button.edit'),   function () {user._read_only = false; $_F5 ()})
            clickOn ($('button.delete'), $_DO.delete_user)
            clickOn ($('button.cancel'), function () {
                if (user.fake > 0) {
                    window.close ()
                }
                else {
                    user._read_only = true  
                    $_F5 ()
                }
            })

            clickOn ($('button.close'),  function () {window.close ()})
            clickOn ($('button.ok'),     $_DO.update_user)

        }

        $_F5 ()            
    
    }
        
});