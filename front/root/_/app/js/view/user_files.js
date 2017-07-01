define ([], function () {

    return function (data, view) {
   
        drw.table (view, {}, $('#user-files-table'), {type: 'users', part: 'files'}, function (data) {

            $.each (data.user_files, function () {

                var parts = this.label.split ('.')

                this.ext = parts [parts.length - 1]
                
                setUri (this, 'user_file')

            })

        })

    }

})