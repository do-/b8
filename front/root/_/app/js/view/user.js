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
            
        $('title').text (user.fake ? 'Новый пользователь' : user.label)
        
        function draw () {

            $('main').empty ().append (fill (view.clone (), user))
            
            if (!user._read_only) {            
                recalc_span_password2 (); i_password ().keyup (recalc_span_password2)            
                $('input:first').focus ()
            }            

            clickOn ($('button.edit'),   function () {user._read_only = false; draw ()})
            clickOn ($('button.delete'), $_DO.delete_user, 'Удалить карточку этого пользователя?')
            clickOn ($('button.cancel'), function () {
                if (user.fake) {
                    window.close ()
                }
                else {
                    user._read_only = true  
                    draw ()
                }
            }, 'Отменить операцию?')
            
            clickOn ($('button.close'),  function () {window.close ()}, 'Закрыть эту вкладку?')
            clickOn ($('button.ok'),     $_DO.update_user, 'Сохранить данные?')

        }
        
        draw ()            
    
    }
        
});