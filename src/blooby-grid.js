var bloobyGrid = (function () {

    // define private vars
    var grid = document.createElement('div'),
        gridContainer = document.createElement('div'),
        gridLineContainer = document.createElement('div')
        gridSwitch = document.createElement('div');


    // define bG Object (will return this)
    var bG = {};


    // set defaults
    bG.container         = false,
    bG.containerPosition = 'center',
    bG.columnColor         = '#8e46b3',
    bG.lineColor         = '#d1bb4c',
    bG.opacity           = 0.3,
    bG.breaks            = [
        {
            point : "(min-width: 800px)",
            columns : 12,
            gutters : .25,
            baseLineHeight : 24
        }
    ]
    bG.oldBreaks = [];

    // render grid and container elements
    grid.id          = 'grid';
    gridContainer.id = 'grid-container';
    gridLineContainer.id = 'grid-line-container';
    grid.appendChild(gridLineContainer);
    grid.appendChild(gridContainer);
    document.body.appendChild(grid);

    gridSwitch.id = 'grid-switch';
    gridSwitch.innerHTML = '<i></i><i></i><i></i><i></i>'
    document.body.appendChild(gridSwitch);

    // redefine vars
    grid                = document.getElementById('grid');
    gridContainer       = document.getElementById('grid-container');
    gridLineContainer   = document.getElementById('grid-line-container');
    gridSwitch          = document.getElementById('grid-switch');
    
    gridSwitch.addEventListener('click', function() {
        grid.classList.toggle('grid-hidden');
        gridSwitch.classList.toggle('grid-hidden');
    })



    // render the grid lines
    bG.gridRender = function(currentBreak) {
        var bp            = typeof currentBreak === 'undefined' ? bG.breaks[0] : currentBreak;
            body = document.body,
            html = document.documentElement,
            w             = window.innerWidth,
            h             = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
            lines         = Math.round(h/bp.baseLineHeight) + 40,
            colWidth      = 100/bp.columns,
            gutterSize    = colWidth * bp.gutters;

        // set configurable grid and grid container styles
        gridContainer.innerHTML      = '';
        gridLineContainer.innerHTML      = '';
        grid.style.opacity           = bG.opacity;
        gridContainer.style.maxWidth = bG.container > 0 ? bG.container + 'px' : '100%';

        // position grid container based on container position
        if(bG.container > 0) {
            switch(bG.containerPosition) {
                case 'left':
                    gridContainer.style.marginLeft = '0';
                    gridContainer.style.marginRight = '0';
                    break;
                case 'center':
                    gridContainer.style.marginLeft = 'auto';
                    gridContainer.style.marginRight = 'auto';
                    break;
                case 'right':
                    gridContainer.style.marginLeft = '0';
                    gridContainer.style.marginRight = '0';
                    break;
            }
        }
        
        // generate columns
        for( i = 0; i < bp.columns + 1; i++ ) {
            var l = document.createElement('div');
            l.style.paddingLeft     = gutterSize/2 + '%';
            l.style.paddingRight    = gutterSize/2 + '%';
            l.style.left            = i * colWidth - gutterSize/2 + '%';
            gridContainer.appendChild(l);
        }
        
        // generate base lines
        for( i = 0; i < lines; i++ ) {
            var l = document.createElement('div');
            l.setAttribute('class','bG-line');
            l.style.top             = i * bp.baseLineHeight + 'px';
            gridLineContainer.appendChild(l);
        }
    }

    // loops through breaks to find match and returns break object
    var findBreak = function(media) {
        for( i = 0; i < bG.breaks.length; i++ ) {
            if(media == bG.breaks[i].point) {
                var index = bG.activeBreakPointIndex <= i ? i + 1 : i;
                index = index >= bG.breaks.length ? index - 1 : index;
                bG.activeBreakPointIndex = index;
                return bG.breaks[index];
            }
        }
    }

    // media query change
    bG.breakChange = function(mq) {

        bG.activeBreakPoint = findBreak(mq.media);        
        bG.gridRender(bG.activeBreakPoint);

    }

    bG.gridInit = function() {

        // clear old listeners
        for ( i = 0; i < bG.oldBreaks.length; i++ ) {
            bG.oldBreaks[i].removeListener(bG.breakChange);
        }
        bG.oldBreaks = [];
        bG.activeBreakPoint = false;

        // start watching for breakpoints
        if (window.matchMedia) {

            // loop through break points
            for ( i = 0; i < bG.breaks.length; i++ ) {

                // create mediaQueryList objects for each breakpoint
                // and add event listeners to them
                var mq = window.matchMedia(bG.breaks[i].point);
                mq.addListener(bG.breakChange);

                // create a list of breakpoint objects to remove listener's from later
                bG.oldBreaks.push(mq);

                // set initial break
                if(mq.matches && !bG.activeBreakPoint) {
                    bG.activeBreakPointIndex = i + 1;
                    bG.activeBreakPoint = findBreak(mq.media);
                }

            };

            // if media query wasn't found, set to the last query
            bG.activeBreakPoint = !bG.activeBreakPoint ? bG.breaks[(bG.breaks.length-1)] : bG.activeBreakPoint;
            bG.gridRender(bG.activeBreakPoint);

        }
        else {
            alert('Your browser does not support the MediaQueryList object. Please update your browser.');
        }
    }

    return bG;
}());