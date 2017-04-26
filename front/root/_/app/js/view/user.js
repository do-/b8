define ([], function () {

    var user
    
    function i_password () {
        return $('input[name=password]')
    }

    function recalc_span_password2 () {
        $('#span-password2').css ({visibility: i_password ().val () ? 'visible' : 'hidden'})
    }
    
    function setup_photo () {
    
        var td = $('td[data-image]'); if (!td.length) return
                
        if (user.photo) {

            Base64img.measure (user.photo, function (dim) {dim.adjustWidth (td)})

        }
        else {
        
            td.text (td.attr ('title')).css ({'text-align': 'center'});
        
        }
        
        if (user._read_only) return                
        
        var f = $('input[type=file]')

        td.click (function () {f.get (0).click ()}) // open file dialog by click on the photo
        
        function loadImage (file) {
        
            if (!file) return
            
            if (file.type != 'image/jpeg') return alert ('Некорректный тип файла. Требуется фото в формате JPEG.')

            var reader = new FileReader ()
            
            reader.addEventListener ("load", function () {
            
                Base64img.measure (reader.result, function (dim) {

                    dim.adjustWidth (td)

                    var b64 = Base64img.resize (this, {width:  2 * td.width (), height: 2 * td.height ()}, 'image/jpeg', 0.95)

                    $('input[name=photo]').val (b64)

                    td.css ('background-image', 'url("' + b64 + '")').text ('')

                })                
                
            }, false)
    
            reader.readAsDataURL (file)

        }        
        
        f.change (function () {loadImage (f.get (0).files [0])})
        
        td.on ("dragover", blockEvent).on ("dragleave", blockEvent).on ("drop", function (e) {
        
            loadImage (blockEvent (e).originalEvent.dataTransfer.files [0])

        });

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