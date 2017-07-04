define ([], function () {

    function getToolbar () {
        return $('span[data-block-name=tasks] > div.toolbar')
    }

    function recalcCreateButton () {
        var tb = getToolbar ()
        var v  = values (tb)
        var b  = $('button', tb)
        if (v.role    == 0)         return b.hide ()
        if (v.id_user != $_USER.id) return b.hide ()
        b.show ()
    }

    return function (data, view) {

        drw.title ('Текущие дела')
        
        data.role    = 0
        data.id_user = $_USER.id

        drw.table (view, data, $('body > main > article'), {}, function (data) {
        
            checkList (data, 'tasks')
                        
        })
                
        recalcCreateButton (); $('select', getToolbar ()).change (recalcCreateButton)

    }

});


