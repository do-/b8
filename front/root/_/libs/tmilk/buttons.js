var drw; if (!drw) drw = {};

(function () {

    var cyr = 'ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ'
    var lat = "QWERTYUIOP[]ASDFGHJKL;'ZXCVBNM,."
    var c2l = {}    
    for (var i = 0; i < cyr.length; i ++) c2l [cyr.charAt (i)] = lat.charAt (i)
    
    function getKeyName (scanCode) {
    
        switch (scanCode) {
            case 13: return 'Enter'
            case 27: return 'Esc'
            case 32: return 'Space'
            case 46: return 'Del'
            case 188: return '<'
            case 190: return '>'
            case 186: return ';'
            case 222: return "'"
            case 219: return '['
            case 221: return ']'
        }
    
        if (scanCode >= 65 && scanCode <= 90) return String.fromCharCode (scanCode)

        if (scanCode >= 112 && scanCode <= 123) return 'F' + (scanCode - 111)
        
        return null
    
    }
    
    var yet

    $(function () {
    
        if (!yet) $('body').keydown (function (e) {

            var code = getKeyName (e.which);

            if (!code) return;
            
            if (e.altKey)  code = 'Alt-'  + code
            if (e.ctrlKey) code = 'Ctrl-' + code

            var b = $("button[data-hotkey='" + code + "']")

            if (!b || !b.length) return
            
            b.click ()
            
            e.preventDefault ()
            e.stopImmediatePropagation ()
            e.stopPropagation ()

        })
        
        yet = true

    })
    
    drw.setOnClick = function (el, o) {
    
        var h = $.isPlainObject (o) ? o.onClick : o
        
        if ($.isFunction (h)) {
            el.click (h).toggleClass ('clickable', true)
        }
        else {
            el.off ('click').toggleClass ('clickable', false)
        }
        
        return el
    
    }
    
    drw.button = function (o) {
    
        var b = $('<button type=button/>')
        
        if (o.onClick && o.question) {
            var h = o.onClick
            o.onClick = function () {if (confirm (o.question)) h ()}
        }
        
        drw.setOnClick (b, o)
        
        var amp = o.label.indexOf ('&')
        
        if (amp < 0) {
            var label = o.label
            if (o.hotkey) {
                label += ' (' + o.hotkey + ')'
                b.attr ('data-hotkey', o.hotkey)
            }
            b.text (label)
        }
        else {
            var pre  = o.label.substr (0, amp)
            var key  = o.label.charAt (amp + 1)
            var post = o.label.substr (amp + 2)
            b.html (pre + '<u>' + key + '</u>' + post);
            key = key.toUpperCase ()
            var l = c2l [key]
            if (l) key = l
            b.attr ('data-hotkey', 'Alt-' + key)
        }
        
        if (o.icon) b.addClass ('icon').addClass (o.icon)
        
        return b
        
    }
    
    function showItOnEnter (e) {
        if (isEnterPressed (e)) showIt (e)
    }

    function showItAndBlur (e) {
        $(this).blur ()
        showIt (e)
    }    

    function toolbar_input (o) {
        return $('<input class="widget" />')
            .keyup (showItOnEnter)
            .attr ({name: o.name})
            .before (o.label + ': ')
    }

    function toolbar_select (o) {
    
        var s = $('<select class="widget" />')
            .change (showItAndBlur)
            .attr ({name: o.name})

        for (var i = 0; i < o.values.length; i ++) 
            $('<option>')
            .text (o.values [i].label)
            .attr ({value: o.values [i].id})
            .appendTo (s)
            
        return s
        
    }
    
    function toolbar_widget (w) {
        if (w.icon)   return drw.button (w)
        if (w.values) return toolbar_select (w)
        return toolbar_input (w)        
    }
        
    drw.toolbar_widgets = function (tb, o, a) {
    
        for (var i = 0; i < a.length; i ++) tb.append (toolbar_widget (a [i]))
    
    }

    drw.form_buttons = function (tb, data, o) {
    
        if (data._read_only) {       
        
            if (data.fake == 0) {
            
                tb.append (drw.button ({
                    icon: 'edit',
                    label: 'Редактировать',
                    hotkey: 'F4',
                    onClick: function () {$_F5 ({_read_only: false})}
                }))

                tb.append (drw.button ({
                    icon: 'delete',
                    label: 'Удалить',
                    hotkey: 'Ctrl-Del',
                    onClick: $_DO ['delete_' + $_REQUEST.type],
                    question: 'Удалить эту запись?'
                }))

            }

            if (data.fake == -1) tb.append (drw.button ({
                icon: 'undelete',
                label: 'Восстановить',
                onClick: $_DO ['undelete_' + $_REQUEST.type],
                question: 'Восстановить эту запись?'
            }))

            tb.append (drw.button ({
                icon: 'close',
                label: 'Закрыть',
                hotkey: 'Esc',
                onClick: window.close,
                question: 'Закрыть эту вкладку?'
            }))

        }
        
        else {               

            tb.append (drw.button ({
                icon: 'ok',
                label: 'Применить',
                hotkey: 'Ctrl-Enter',
                onClick: $_DO ['update_' + $_REQUEST.type],
                question: 'Сохранить данные?'
            }))
        
            tb.append (drw.button ({
                icon: 'cancel',
                label: 'Отменить',
                hotkey: 'Esc',
                onClick: data.fake > 0 ? window.close : function () {$_F5 ({_read_only: true})},
                question: 'Отменить эту операцию?'
            }))    
            
        }
           
    }

}) ()