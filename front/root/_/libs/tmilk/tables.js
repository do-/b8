var drw; if (!drw) drw = {};

(function () {

    function appendCellSpan (html, o, key) {
        var value = o [key]
        if (value < 2) return html
        html += ' '
        html += key
        html += '='
        html += value
        return html
    }

    drw.cell = function (tag, o) {
        var html = '<'
        html += tag
        html = appendCellSpan (html, o, 'colspan')
        html = appendCellSpan (html, o, 'rowspan')
        html += '/>'
        var cell = $(html).text (o.label)
        if (o.attr) cell.attr (o.attr)
        if (o.css)  cell.css  (o.css)
        drw.setOnClick (cell, o)
        return cell
    }

    function appendHeadRow (t, cells) {
    
        var tr = $('<tr/>').appendTo (t);

        for (var i = 0; i < cells.length; i ++) {

            var cell = cells [i]

            if (!$.isPlainObject (cell)) {
                cell = {label: cell}
            }
            else {
                if (cell.off || cell.rowspan === 0 || cell.colspan === 0) continue;
            }
            
            drw.cell ('th', cell).appendTo (tr);
           
        }

    }

    function appendHeadRows (table, head) {
    
        if (!$.isArray (head [0])) head = [head]
        
        var thead = $('<thead/>').appendTo (table)

        for (var i = 0; i < head.length; i ++) {
            appendHeadRow (thead, head [i]) 
        }

    }
/*
    drw.table = function (o, head, dataSource) {
    
        if (!o) o = {}
        if (o.off) return $('')
        
        var span = $('<span/>').addClass ('drw').addClass ('table')
        
        if (o.label) span.append ($('<header>').text (o.label))
        
        var tb = o.toolbar ? drw.toolbar (o.toolbar).appendTo (span) : null
                
        var table = $('<table/>').appendTo (span)
        
        if (head) appendHeadRows (table, head)
        
        var tbody = $('<tbody/>').appendTo (table)

        span.data ('load', function (o) {
            if (!o || !o.keep) tbody.empty ()
            dataSource (tbody, tb)
        })

        span.data ('load') ()
        
        return span
        
    }
*/

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
        
    }
    
    function appendBodyRow (t, o, cells) {
    
        var tr = $('<tr/>').appendTo (t);

        for (var i = 0; i < cells.length; i ++) {

            var cell = cells [i]

            if (!$.isPlainObject (cell)) {
                cell = {label: cell}
            }
            else {
                if (cell.rowspan === 0 || cell.colspan === 0) continue;
            }
                        
            drw.cell ('td', $.extend (cell, o)).appendTo (tr);
           
        }

    }

    drw.cells = function (t, o, body) {
    
        if (!$.isArray (body [0])) body = [body]

        for (var i = 0; i < body.length; i ++) {
            appendBodyRow (t, o, body [i]) 
        }
    
    }

}) ()