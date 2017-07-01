define ([], function () {
    
    $_DO.create_user_files = function () {
    
        var fi = $('input[type=file]')
        
        var fi0 = fi.get (0)
        
        fi.off ('change').change (function () {

            Base64file.upload (fi0.files [0], {
                data: {id_user: $_REQUEST.id},
                type: 'user_files',
                onprogress: function (x, y) {darn ([x, y])},
                onloadend: $_F5 // showIt 
            })

        })
        
        click (fi0)

    } 
        
    return fire
        
});