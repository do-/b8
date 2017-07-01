define ([], function () {

    return function (data, view) {
    
        data._read_only = 1

        $('title').text (data.label)
                
        fill (view, data, $('main'))

    }

});