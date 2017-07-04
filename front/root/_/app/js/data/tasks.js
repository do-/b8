define ([], function () {

    function noCreate () {
    
        if (!confirm ('Оформляя дело, необходимо быть уверенным, что это не породит дубликата. Перейти к списку инициированных Вами дел?')) return;
        
        $('select[name=role]').val (1).trigger ('change')
        $('select[name=id_user]').val ($_USER.id)
        $('select[name=id_user_to]').focus ()
    
    }

    $_DO.create_tasks = function () {
    
        var v  = values ($('span[data-block-name=tasks] > div.toolbar'))
        
        if (v.role != 1)            return noCreate ()
        if (v.id_user != $_USER.id) return noCreate ()

        if (v.id_user_to == 0) throw '#id_user_to#: Пожалуйста, укажите адресата. Возможно, при этом выяснится, что дело уже оформлено.'

        if (v.id_user_to == $_USER.id && !confirm ('Вы уверены, что хотите адресовать дело самому себе?')) return

        query ({action: 'create'}, {data: {id_user_to: v.id_user_to}}, function (data) {        
            
            var uri = '/task/' + data.id
        
            openTab (uri, uri)        
        
        })

    }    
    
    return function (done) {

        query ({}, {}, done)        

    }
        
});