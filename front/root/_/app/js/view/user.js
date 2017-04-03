define ([], function () {

    var user

    return function (data, view) {
    
        user = data.content
        
        user._read_only = true
            
        $('title').text (user.label)
        
        function draw () {

            $('main').empty ().append (fill (view.clone (), user))
            
            $('input:first').focus ()

            clickOn ($('button.edit'),   function () {user._read_only = false; draw ()})
            clickOn ($('button.cancel'), function () {user._read_only = true;  draw ()})
            
            clickOn ($('button.close'),  function () {window.close ()})
            clickOn ($('button.ok'),     $_DO.update_user)

        }
        
        draw ()            
    
    }
        
});