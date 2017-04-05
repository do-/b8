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
    
    $(function () {

        $('body').keydown (function (e) {

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

}) ()