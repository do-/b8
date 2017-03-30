define ([], function () {

    return function (data, view) {
    
        var jq = $('.auth-toolbar .user')
    
        if ($_USER) {
        
            var fio = $_USER.f
            
            if ($_USER.i) fio += ' ' + $_USER.i.substr (0, 1) + '.'
            if ($_USER.o) fio += ' ' + $_USER.o.substr (0, 1) + '.'
        
            jq.empty ().append (fill (view, {fio: fio}))
            
        }
        else {
            jq.remove ()
        }
                                                
    }
        
});