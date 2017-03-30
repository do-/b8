function draw_page () {

    setup_user    ()

    use.block ('main')
    
    if (!$_USER) return use.block ('logon')
       
    setup_request ()
            
    if (!$_REQUEST.type) redirect ('/users/')
    
    use.block ($_REQUEST.type)
    
    require (['tmilk/buttons'])

}

requirejs.config({
    baseUrl: '_/libs',
    paths: {
        app: '../app'
    }
});

requirejs (['jquery/jquery-3.1.1.min', 'less/less.min', 'core/core'], function (jq, less, core) {

    clearTimeout (window.timeBomb)
    
    try {

        draw_page ()

    }
    catch (e) {
        darn (e)
//        if (!e.match (/^core\.ok\./)) darn (e)
    }
    

});



