var drw; if (!drw) drw = {};

(function () {

    function refresh_table_body (t, view) {

        var tbody = $('tbody', t)
        
        var start = $('input[name=start]')
        
        if (start.val () == 0) {
            tbody.empty ()
        }
        else {
            start.val (0)                
        }                
                        
        tbody.append ($('tbody', view).children ())

    }
    
    function draw_new_table (view, widgets) {

        drw.toolbar_widgets ($('.toolbar', view), {}, widgets)

        $('main').empty ().append (view)
            
    }
    
    drw.table = function (t, view, widgets) {
    
        if (t.length) refresh_table_body (t, view); else draw_new_table (view, widgets)
        
        use.lib ('tmilk/table-selector')
        
    }

}) ()