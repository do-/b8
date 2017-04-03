requirejs.config({
    baseUrl: '_/libs',
    paths: {
        app: '../app'
    }
});

function draw_page () {

    setup_user    ()

    use.block ('main')
    
    if (!$_USER) return use.block ('logon')
       
    setup_request ()
            
    if (!$_REQUEST.type) redirect ('/users/')
    
    use.block ($_REQUEST.type)
    
    require (['tmilk/buttons'])

}

requirejs (['jquery/jquery-3.1.1.min', 'less/less.min', 'core/core'], function (jq, less, core) {

    clearTimeout (window.timeBomb)
    
    var keepAliveTimer;
    
    $(document).ajaxSuccess (function (event, request, settings) {
    
        var timeout = sessionStorage.getItem ('timeout')
        
        if (!timeout) return
        
        if (keepAliveTimer) clearTimeout (keepAliveTimer)
        
        keepAliveTimer = setTimeout (function () {
        
            query ({type: undefined}, {}, $_DO.nothing, $_DO.nothing)
        
        }, 1000 * (60 * timeout - 1))

    });
    
    try {

        draw_page ()

    }
    catch (e) {
        darn (e)
//        if (!e.match (/^core\.ok\./)) darn (e)
    }
    

});



