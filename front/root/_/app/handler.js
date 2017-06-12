requirejs.config ({
    baseUrl: sessionStorage.getItem ('staticRoot') + '/libs',
    paths: {app: '../app/js'}
});

function setBackUri (data, o) {

    if (!data) return

    if ($.isArray (data)) {
        for (var i = 0; i < data.length; i ++) setBackUri (data [i], o)
    }
    else {
        if (o.id = data.id) data.uri = sessionStorage.getItem ('dynamicRoot') + '/?' + $.param (o)
    }

}

function setUri (data, type) {

    if (!type) type = en_unplural ($_REQUEST.type)

    if ($.isArray (data)) {
        for (var i = 0; i < data.length; i ++) setUri (data [i], type)
    }
    else {
        if (data.id) data.uri = '/' + type + '/' + data.id
    }

}

function checkList (data, name) {

    var list = data [name]
    
    setUri (list)
    
    if (list.length > data.portion) list.splice (list.length - 1, 1, {id: 'next'})
    
}

function setup_request () {

    var parts = window.location.pathname.split ('/').filter (function (s) {return s > ' '});
    
    if (parts [0] == 'download') {
        parts.shift ()
        $_REQUEST.download = true
    }

    $_REQUEST.type = parts [0]
    $_REQUEST.id   = parts [1]

}

requirejs (['elu/elu', 'tmilk/buttons', 'tmilk/tables'], function (jq, less, core) {

    clearTimeout (window.alarm)
    
    $_SESSION.beforeExpiry ($_SESSION.keepAlive)
    
    setup_request ()
    
    use.block ('main')

});