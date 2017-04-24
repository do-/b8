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
    
        td.css ('width', td.height () / 1.41)
        
        if (user._read_only) return
        
        var f = $('input[type=file]').hide ()
        
        td.click (function () {f.get (0).click ()})
        
        f.change (function () {
        
            var file = f.get (0).files [0]
            
            if (!file) return
            
            var reader  = new FileReader ()
            
            reader.addEventListener ("load", function () {
                            
                var img = $('<img>');
                
                img.on ('load', function () {
                
                    var src = {
                        x      : 0,
                        y      : 0,
                        width  : this.width,
                        height : this.height
                    }
                
                    var dst = {
                        width:  td.width (),
                        height: td.height ()
                    };

                    var canvas = $('<canvas>').prop (dst) [0]
                    
                    var ctx = canvas.getContext ('2d')
                    
                    ctx.imageSmoothingEnabled = true;
                    
                    var hw = dst.height / dst.width
                    
                    var dh = Math.floor (src.height - src.width  * hw)
                    var dw = Math.floor (src.width  - src.height / hw)
                    
                    if (dh > 0) { // too tall, crop vertically by dh
                        src.height -= dh
                        src.y = Math.floor (dh / 2)
                    }
                    else if (dw > 0) { // too wide, crop horizontally by dw
                        src.width -= dw
                        src.x = Math.floor (dw / 2)
                    }
                    
                    ctx.drawImage (img.get (0)
                        , src.x, src.y, src.width, src.height
                        ,     0,     0, dst.width, dst.height
                    )

                    var b64 = canvas.toDataURL ('image/jpeg', 0.95)

                    $('input[name=photo]').val (b64)

                    var url = 'url("' + b64 + '")'

                    td.css ('background-image', url)
                
                }) 
                
                img.attr ({src: reader.result});                
                
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