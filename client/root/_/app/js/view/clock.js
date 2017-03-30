define ([], function () {

    var month     = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']; 
    var visbility = ['visible', 'hidden']
    var v = 0
    
    function dd (d) {
        return ((0 + d) > 9 ? '' : '0') + d        
    }
    
    function refreshClockColon () {    
        $('#clock-colon').css ({visibility: visbility [v = 1 - v]})
    }

    function refreshClock () {
    
        var d = new Date ()

        $('#clock-dmyh').text (d.getDate () + ' ' + month [d.getMonth ()] + ' ' + d.getFullYear () + ' ' + dd (d.getHours ()))    
        $('#clock-m').text (dd (d.getMinutes ()))    
        
        setTimeout (refreshClock, 1000 * (61 - d.getSeconds ()) - d.getMilliseconds ())
            
    }

    return function (data, view) {
        
        var jq = $('.clock')
    
        if ($_USER) {
        
            jq.empty ().append (view)

            refreshClock ()

            setInterval (refreshClockColon, 1500)
            
        }
        else {
            jq.remove ()
        }        
        
    }
        
});