var $_REQUEST = {}, $_DO = {nothing: function () {}}, $_USER

function darn (o) {
    if (console) console.log (o)
    return o
}

function redirect (url) {
    window.location.href = url
    throw 'core.ok.redirect'
}

function setup_request () {

    var parts = window.location.pathname.split ('/').filter (function (s) {return s > ' '});

    $_REQUEST.type = parts [0]
    $_REQUEST.id   = parts [1]

}

var $_SESSION = {

    get: function (key) {

        try {
            return JSON.parse (sessionStorage.getItem (key))
        }
        catch (e) {
            console.log (e)
            return undefined
        }        
    },
    
    set: function (key, object) {
        sessionStorage.setItem (key, JSON.stringify (object))
    }

}

function setup_user () {    
    $_USER = $_SESSION.get ('user');   
}

function en_unplural (s) {

    if (s.match (/(status|goods)$/)) return s

    var table = [
        [/tives$/,          'tive'],
        [/ives$/,            'ife'],
        [/ves$/,               'f'],
        [/ies$/,               'y'],
        [/ice$/,            'ouse'],
        [/men$/,             'man'],
        [/eet(h?)$/,       'oot$1'],
        [/(o|ch|sh|ss|x)es$/, '$1'],
        [/s$/,                  '']
    ]

    for (i = 0; i < table.length; i++) {
        var re = table [i] [0]
        if (!s.match (re)) continue
        return s.replace (re, table [i] [1])
    }
    
    return s;
    
}

function fire (f) {f ()}

var use = {
    lib: function (name) {require ([name], fire)}
}

use.block = function (name) {

    var html = $('<span>')
                        
    html.load ('_/app/html/' + name + '.html', function () {
        
        require (['app/js/data/' + name], function (f) {
            
            f (function (data) {
                
                require (['app/js/view/' + name], function (g) {

                    g (data, html.children ())
                        
                })

            })
            
        })
        
    })
        
}

function values (jq) {
    var o = {};
    var a = jq.clone ().wrap ('<form/>').parent ().serializeArray ()
    for (var i = 0; i < a.length; i ++) o['-' + a[i].name] = a[i].value    
    return o
}

function query (tia, data, done, fail) {

    var url = '/_back/?';
    if (!('type' in tia) && $_REQUEST.type) tia.type = $_REQUEST.type
    if (!('id' in tia) && $_REQUEST.id) tia.id = $_REQUEST.id

    $.ajax (url + $.param (tia), {
        dataType:    'json',
        method:      'POST',
        processData: false,
        contentType: 'application/json',
        timeout:     1000,
        data:        JSON.stringify (data)
    })

    .done (function (data) {
    
        if (false) {
// todo
        }
        else {
            done (data)
        }
    
    })
    
    .fail (function (jqXHR) {
    
        if (fail) return fail ()
    
        if (jqXHR.status == 401) {
            sessionStorage.clear ()
            location.reload ()
        } 
        else {
            alert ('Error')
        }    
    
    })

}

function fill (jq, data) {

    function eachAttr (jq, a, data, todo) {

        jq.find ('*').addBack ().filter ('[' + a + ']').each (function () {
            var me   = $(this)
            var name = me.attr (a)
            todo (me.removeAttr (a), name, data [name])
        })

    }

    eachAttr (jq, 'data-list',   data, function (me, n, v) {
    
        if (!v) {
            console.log ('Empty value as data-list in ' + me.get(0).outerHTML)
            me.remove ()
            return
        }
    
        if (!$.isArray (v)) {
            console.log ('Not a list as data-list for ' + me.get(0).outerHTML + ': ', v)
            me.remove ()
            return
        }
        
        var list = $([]); for (var i = 0; i < v.length; i ++) list = list.add (fill (me.clone (), v [i]))

        me.replaceWith (list)
        
    })
    
    eachAttr (jq, 'data-text',   data, function (me, n, v) {me.text (v)})
    eachAttr (jq, 'data-id',     data, function (me, n, v) {me.attr ('data-id', v)})
    eachAttr (jq, 'data-value',  data, function (me, n, v) {me.val (v)})
    eachAttr (jq, 'data-key',    data, function (me, n, v) {me.text (me.text () + ' (' + n + ')'); me.attr ('data-hotkey', n)})
    eachAttr (jq, 'data-off',    data, function (me, n, v) {if (v) me.remove ()})
    eachAttr (jq, 'data-on',     data, function (me, n, v) {if (!v) me.remove ()})
    eachAttr (jq, 'data-uri',    data, function (me, n, v) {me.attr ('data-href', v).find (':not(:has(*))').wrapInner ('<span class="anchor"/>')})
    
    clickOn ($('span.anchor', jq), onDataUriDblClick)

    $('input:text, input:password, textarea', jq).each (function () {$(this).val (data [this.name])})
    $('input:radio', jq).each (function () {var me = $(this); me.prop ('checked', me.val () == data [this.name])})

    if (data._read_only) {    
    
        $('input:text, input:password, textarea', jq).each (function () {
            if (this.type == 'hidden') return
            var me = $(this)
            me.replaceWith ($('<span />').text (me.val ()))
        })   

        $('input:radio', jq).not (':checked').parent ().remove ()
        $('input:radio', jq).remove ()
        
    }

    return jq

}

function openTab (url, name) {
    var a    = window.document.createElement ("a");
    a.target = name;
    a.href   = url;
    var e    = window.document.createEvent("MouseEvents");
    e.initMouseEvent ("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent  (e);
};

function onDataUriDblClick (e) {
    var uri = $(this).closest('[data-href]').attr ('data-href')
    if (!uri) return
    openTab (uri, uri)
}

function clickOn (jq, onClick) {
    jq.toggleClass ('clickable', true).unbind ('click').click (onClick)
}

function clickOff (jq, onClick) {
    jq.toggleClass ('clickable', false).unbind ('click')
}