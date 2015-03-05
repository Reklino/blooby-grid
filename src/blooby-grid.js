var bloobyGrid = (function () {


    // define private vars
    var grid = document.createElement('div'),
        gridContainer = document.createElement('div');


    // define bG Object (will return this)
    var bG = {};


    // set defaults
    bG.line              = 24,
    bG.container         = false,
    bG.containerPosition = 'center',
    bG.lineColor         = 'pink',
    bG.opacity           = 0.25,
    bG.breaks            = [
        {
            point : "(min-width: 800px)",
            columns : 12,
            gutters : .25,
            line : 24
        },
        {
            point : "(min-width: 500px)",
            columns : 6,
            gutters : .125,
            line : 24
        },
        {
            point : "(min-width: 300px)",
            columns : 3,
            gutters : .0625,
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
    bG.gridUpdate = function(currentBreak) {
        var bp            = typeof currentBreak === 'undefined' ? bG.breaks[0] : currentBreak;
            w             = window.innerWidth,
            h             = window.innerHeight,
            lines         = Math.round(h/bp.line),
            colWidth      = 100/bp.columns,
            gutterSize    = colWidth * bp.gutters,
            grid          = document.getElementById('grid'),
            gridContainer = document.getElementById('grid-container');

        // set configurable grid and grid container styles
        gridContainer.innerHTML      = '';
        grid.style.opacity           = bG.opacity;
        gridContainer.style.maxWidth = bG.container > 0 ? bG.container + 'px' : '100%';

        // position grid container based on container position
        if(bG.container > 0) {
            switch(bG.containerPosition) {
                case 'center':
                    gridContainer.style.marginLeft = 'auto';
                    gridContainer.style.marginRight = 'auto';
                    break;
            }
        }
        
        for( i = 0; i < bp.columns + 1; i++ ) {
            var l = document.createElement('div');
            l.style.backgroundColor = bG.lineColor;
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
            l.style.backgroundColor = bG.lineColor;
            l.style.position        = 'absolute';
            l.style.height          = '0';
            l.style.borderTop       = '1px dashed rgba(0,0,0,.25)';
            l.style.top             = i * bp.line + 'px';
            l.style.width           = '100%';
            grid.appendChild(l);
        }
    }

    // loops through breaks to find match and returns break object
    var findBreak = function(media) {
        for( i = 0; i < bG.breaks.length; i++ ) {
            if(media == bG.breaks[i].point) {
                return bG.breaks[i];
            }
        }
    }

    // media query change
    bG.breakChange = function(mq) {

        bG.mq = findBreak(mq.media);        
        bG.gridUpdate(bG.mq);

    }

    bG.gridInit = function() {
        if (window.matchMedia) {

            for ( i = 0; i < bG.breaks.length; i++ ) {
                console.log(i);
                var mq = window.matchMedia(bG.breaks[i].point);
                mq.addListener(bG.breakChange);

                // set initial break
                if(mq.matches && !bG.mq) {
                    bG.mq = findBreak(mq.media);
                }

            };
            bG.mq = !bG.mq ? bG.breaks[2] : bG.mq;
            bG.gridUpdate(bG.mq);
        }
    }

    return bG;
}());