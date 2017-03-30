define ([], function () {
    
    var opt = {
        tableSelector: "span.table table", 
        hilightClass:  "selected"        
    }
    
    var column

    var getAllRows
    var getAllCells
    var getCurrentCell

    function unmarkCurrentCell () {
        getCurrentCell ().removeClass (opt.hilightClass);
    }
    
    function markCell (td) {
        if (!td || !td.length) return null       
        unmarkCurrentCell ()
        return td.addClass (opt.hilightClass)
    }

    function markFirstCell () {
        column = 0
        return markCell (getAllCells ().first ())
    }
    
    function onClick (e) {
        var cell = $(this)
        column = cell.prevAll ().length
        markCell (cell)
    }

    function prevNext (jq, dir) {
        return dir ? jq.next () : jq.prev () 
    }
    
    function moveHorz (c, dir) {
        var result = markCell (prevNext (c, dir)) 
        if (result) dir ? column ++ : column --
        return result
    }
    
    function getOtherTableRow (tr, dir) {

        var trs = getAllRows ()
        
        var i = trs.index (tr.get (0))
        
        if (dir) {
            i ++
            if (i >= trs.length) return null
        }
        else {
            i --
            if (i < 0) return null
        }

        return $(trs.get (i))

    }

    function getTableRow (tr, dir) {

        var ntr = prevNext (tr, dir).has ('td')
        
        return ntr.length ? ntr : getOtherTableRow (tr, dir)

    }
    
    function moveVert (c, dir) {

        var tr  = c.parent ();
                
        var ntr = getTableRow (tr, dir)
        if (!ntr || !ntr.length) return null
        
        var tds = $('td', ntr)
        
        var td = tds.eq (Math.min (column, tds.length - 1))
        if (!td || !td.length) return null

        markCell (td)

        var docViewTop = $(window).scrollTop ();
        var tdTop = td.offset ().top;

        if (tdTop < docViewTop) { 

            $('html,body').scrollTop (tdTop)

        }
        else {

            var docViewBottom = docViewTop + window.innerHeight;
            var tdBottom = tdTop + td.outerHeight () + 2 * parseInt (td.css ('outlineWidth'));

            if (tdBottom > docViewBottom) $('html,body').scrollTop (tdBottom - window.innerHeight)

        }
        
        return td
        
    }

/*
    37 0 00 left
    38 1 01 up
    39 2 10 right
    40 3 11 down
*/    

    function clickThis () {
    
        this.dispatchEvent (
            new MouseEvent ('click', {
                view: window, 
                bubbles: true, 
                cancelable: true
            })
        )
        
    }

    var move = [moveHorz, moveVert]
    
    function onKey (e) { 

        if (e.target.localName.toLowerCase () !== 'body') return    // global keyboard events only
        
        var c = getCurrentCell (); if (!c || !c.length) return

        if (e.which == 13) return $('.clickable', c).each (clickThis)                // enter => click. Otherwise, arrow keys

        var i = e.which - 37;      if (i & ~ 0b11) return           // assert i in [0 .. 3]
                
        var crd =  i & 0b01                                         // [horz / vert]
        var dir = (i & 0b10) >> 1                                   // [prev / next]

        if (move [crd] (c, dir)) e.preventDefault ()
        
    }    
    
    function setupEventListeners () {
        getAllCells ().click (onClick)
        $('body').keydown (onKey)
    }    
    
    function checkOptions () {
        var o =  $(this).data ('tableSelectorOptions')
        if (!o) return true 
        opt = $.extend (opt, o)
        return false
    }
   
    return function () {
        
        $('script').each (checkOptions)

        getAllRows     = function () {return $(opt.tableSelector + ' tr:has(td)')}
        getAllCells    = function () {return $(opt.tableSelector + ' td')}
        getCurrentCell = function () {return $('td.' + opt.hilightClass)}

        setupEventListeners ()                
        markFirstCell ()

    }
    
})