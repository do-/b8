requirejs.config ({
    baseUrl: sessionStorage.getItem ('staticRoot') + '/libs',
    paths: {app: '../app'}
});

var $_F5

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

function draw_page () {

    setup_user    ()

    use.block ('main')
    
    if (!$_USER) return use.block ('logon')
       
    setup_request ()
            
    if (!$_REQUEST.type) redirect ('/users/')
    
    require (['tmilk/buttons'])    
    require (['tmilk/tables'])    
    
    showIt ()

}

requirejs (['jquery/jquery-3.1.1.min', 'less/less.min', 'core/core'], function (jq, less, core) {

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



