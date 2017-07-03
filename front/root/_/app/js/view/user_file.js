define ([], function () {

    return function (data, view) {
    
        data._read_only = 1

        drw.title (data.label)
                
        fill (view, data, $('body > main > article'))

    }

});