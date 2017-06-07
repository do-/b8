requirejs.config ({
    baseUrl: sessionStorage.getItem ('staticRoot') + '/libs',
    paths: {app: '../app/js'}
});

var $_F5

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

function draw_page () {

    setup_request ()
    
    if (!$_USER) delete $_REQUEST.download

    if (!$_REQUEST.download) use.block ('main')
    
    if (!$_USER) return use.block ('logon')
                   
    if (!$_REQUEST.type) redirect ('/users/')
    
    if ($_REQUEST.download) return use.data ($_REQUEST.type)

    require (['tmilk/buttons', 'tmilk/tables'], showIt)
    
}

requirejs (['elu/elu'], function (jq, less, core) {

    clearTimeout (window.alarm)
    
    var keepAliveTimer;
    
    $(document).ajaxSuccess (function (event, request, settings) {
    
        var timeout = sessionStorage.getItem ('timeout')
        
        if (!timeout) return

        if (timeout < 1) timeout = 1
        
        if (keepAliveTimer) clearTimeout (keepAliveTimer)
        
        keepAliveTimer = setTimeout (function () {
        
            query ({type: undefined}, {}, $_DO.nothing, $_DO.nothing)
        
        }, 1000 * (60 * timeout - 1))

    });
    
    try {

        draw_page ()

    }
    catch (e) {
    
        if ((typeof e === 'string' || e instanceof String) && e.match (/^core\.ok\./)) {
            // do nothing
        }
        else {
            darn (e)
        }
        
    }    

});



