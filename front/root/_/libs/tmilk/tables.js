var drw; if (!drw) drw = {};

drw.title = function (s) {
    
    $('title, body > div.auth-toolbar > div.title').text (s)

};

(function () {

    drw.table = function (template, data, container, tia, check) {
    
        var htmlId = ('' + Math.random ()).replace ('0.', '')
        
        template.prop ('id', htmlId)
        
        var sel = '#' + htmlId
        
        var tpTbody = $('tbody', template).clone ()
               
        $('tbody', template).empty ()

        container.empty ().append (fill (template, {fake: 0}))
        
        function tb () {return $(sel + ' .toolbar')}

        function load () {

            var tbody = $('tbody', $(sel))
                    
            if ($(this).attr ('name') != 'start') {

                tbody.empty ()
            
                $('input[name=start]', tb ()).val (0)

            }

            query (tia, {search: values (tb ())}, function (data) {

                check (data)

                tbody.append (fill (tpTbody, data).children ())

                use.lib ('tmilk/table-selector')

            })

        }
        
        $('input, select', tb ()).change (load)
        
        load ()

    }

}) ()