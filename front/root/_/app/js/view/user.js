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
        
        user._read_only = true
            
        $('title').text (user.label)
        
        function draw () {

            $('main').empty ().append (fill (view.clone (), user))
            
            if (!user._read_only) {            
                recalc_span_password2 (); i_password ().keyup (recalc_span_password2)            
                $('input:first').focus ()
            }            

            clickOn ($('button.edit'),   function () {user._read_only = false; draw ()})
            clickOn ($('button.cancel'), function () {user._read_only = true;  draw ()})
            
            clickOn ($('button.close'),  function () {window.close ()})
            clickOn ($('button.ok'),     $_DO.update_user)

        }
        
        draw ()            
    
    }
        
});