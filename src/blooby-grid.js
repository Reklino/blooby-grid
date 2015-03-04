var bloobyGrid = (function () {


    // define private vars
    var grid = document.createElement('div'),
        gridContainer = document.createElement('div');


    // define bloobyGrid Object (will return this)
    var bloobyGrid = {};


    // set defaults
    bloobyGrid.line              = 24,
    bloobyGrid.container         = false,
    bloobyGrid.containerPosition = 'center',
    bloobyGrid.lineColor         = 'pink',
    bloobyGrid.opacity           = 0.25,
    bloobyGrid.breaks            = [
        {
            point : "(min-width: 800px)",
            columns : 12,
            gutters : .25,
            line : 24
        }
    ];



    // render grid and container elements
    grid.id          = 'grid';
    gridContainer.id = 'grid-container';

    grid.style.position          = 'absolute';
    gridContainer.style.position = 'relative';

    grid.style.top             = 0;
    grid.style.left            = 0;
    grid.style.width           = '100%';
    gridContainer.style.width  = '100%';
    grid.style.height          = '100%';
    gridContainer.style.height = '100%';
    
    grid.appendChild(gridContainer);
    document.body.appendChild(grid);



    // render the grid lines
    bloobyGrid.gridInit = function(currentBreak) {
        var bp            = typeof currentBreak === 'undefined' ? bloobyGrid.breaks[0] : currentBreak;
            w             = window.innerWidth,
            h             = window.innerHeight,
            lines         = Math.round(h/bp.line),
            colWidth      = 100/bp.columns,
            gutterSize    = colWidth * bp.gutters,
            grid          = document.getElementById('grid'),
            gridContainer = document.getElementById('grid-container');

        // set configurable grid and grid container styles
        gridContainer.innerHTML      = '';
        grid.style.opacity           = bloobyGrid.opacity;
        gridContainer.style.maxWidth = bloobyGrid.container > 0 ? bloobyGrid.container + 'px' : '100%';

        // position grid container based on container position
        if(bloobyGrid.container > 0) {
            switch(bloobyGrid.containerPosition) {
                case 'center':
                    gridContainer.style.marginLeft = 'auto';
                    gridContainer.style.marginRight = 'auto';
                    break;
            }
        }
        
        for( i = 0; i < bp.columns + 1; i++ ) {
            var l = document.createElement('div');
            l.style.backgroundColor = bloobyGrid.lineColor;
            l.style.position        = 'absolute';
            l.style.paddingLeft     = gutterSize/2 + '%';
            l.style.paddingRight    = gutterSize/2 + '%';
            l.style.width           = '0';
            l.style.borderLeft      = '1px dashed rgba(0,0,0,.25)';
            l.style.borderRight     = '1px dashed rgba(0,0,0,.25)';
            l.style.left            = i * colWidth - gutterSize/2 + '%';
            l.style.height          = '100%';
            gridContainer.appendChild(l);
        }
        
        for( i = 0; i < lines; i++ ) {
            var l = document.createElement('div');
            l.style.backgroundColor = bloobyGrid.lineColor;
            l.style.position        = 'absolute';
            l.style.height          = '0';
            l.style.borderTop       = '1px dashed rgba(0,0,0,.25)';
            l.style.top             = i * bp.line + 'px';
            l.style.width           = '100%';
            grid.appendChild(l);
        }
    }

    // watch for break points
    if (window.matchMedia) {
        for (var i = bloobyGrid.breaks.length - 1; i >= 0; i--) {
            var mq = window.matchMedia(bloobyGrid.breaks[i].point);
            mq.addListener(bloobyGrid.breakChange);
        };
    }

    // loops through breaks to find next appropriate match
    var findBreak = function(mq) {
        for( i = 0; i < bloobyGrid.breaks.length; i++ ) {
            var newBreak;
            if(mq.media == bloobyGrid.breaks[i].point) {
                newBreak = bloobyGrid.breaks[i];
                break;
            }
        }
        bloobyGrid.gridInit(newBreak);
    }

    // media query change
    bloobyGrid.breakChange = function(mq) {

        if (mq.matches) {
            bloobyGrid.gridInit();
        }
        else {
            findBreak(mq);
        }

    }

    return bloobyGrid;
}());