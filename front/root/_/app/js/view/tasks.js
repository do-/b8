define ([], function () {

    function getToolbar () {
        return $('span[data-block-name=tasks] > div.toolbar')
    }
    
    function recalcTb () {
    
        var tb = getToolbar ()
        var v  = values (tb)
    
        var s  = $('span#id_user_to', tb)
        if (v.role == 1) s.show (); else s.hide ();
            
    }

    return function (data, view) {

        drw.title ('Текущие дела')
        
        data.role    = 0
        data.id_user = $_USER.id
        data.id_user_to = 0

        drw.table (view, data, $('body > main > article'), {}, function (data) {
        
            checkList (data, 'tasks')
                        
        })
                
        recalcTb (); $('select', getToolbar ()).change (recalcTb)

    }

});


