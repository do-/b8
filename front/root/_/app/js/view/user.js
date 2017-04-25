define ([], function () {

    var user
    
    function i_password () {
        return $('input[name=password]')
    }

    function recalc_span_password2 () {
        $('#span-password2').css ({visibility: i_password ().val () ? 'visible' : 'hidden'})
    }
    
    function setup_photo () {
    
        var td = $('td[data-image]')        

        Base64img.measure (td.css ('background-image'), function (dim) {dim.adjustWidth (td)})
        
        if (user._read_only) return
        
        var f = $('input[type=file]').hide ()
        
        td.click (function () {f.get (0).click ()})
        
        f.change (function () {
        
            var file = f.get (0).files [0]
            
            if (!file) return
            
            var reader  = new FileReader ()
            
            reader.addEventListener ("load", function () {
            
                Base64img.measure (reader.result, function (dim) {

                    dim.adjustWidth (td)

                    var b64 = Base64img.resize (this, {width:  2 * td.width (), height: 2 * td.height ()}, 'image/jpeg', 0.95)

                    $('input[name=photo]').val (b64)

                    td.css ('background-image', 'url("' + b64 + '")')

                })                
                
            }, false)
    
            reader.readAsDataURL (file)

        })

    }

    return function (data, view) {
    
        user = data
        
        user._read_only = (user.fake <= 0)
                
        $_F5 = function (over) {
        
            $('title').text (user.fake > 0 ? 'Новый пользователь' : user.label)

            user = $.extend (user, over)

            $('main').empty ().append (fill (view.clone (), user))
            
            setup_photo ()

            drw.form_buttons ($('.toolbar'), user, {})

            if (user._read_only) return            

            recalc_span_password2 (); i_password ().keyup (recalc_span_password2)            

            $('input:first').focus ()

            $('input').keyup (onEnterGoToNextInput)
            
        }

        $_F5 ()            
    
    }
        
});