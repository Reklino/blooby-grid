var bloobyGrid = (function () {

    // define private vars
    var grid = document.createElement('div'),
        gridContainer = document.createElement('div'),
        gridLineContainer = document.createElement('div');


    // define bG Object (will return this)
    var bG = {};


    // set defaults
    bG.baseLineHeight    = 24,
    bG.container         = false,
    bG.containerPosition = 'center',
    bG.lineColor         = '#4f5979',
    bG.opacity           = 0.15,
    bG.breaks            = [
        {
            point : "(min-width: 800px)",
            columns : 12,
            gutters : .25,
            baseLineHeight : 24
        }
    ];


    // render grid and container elements
    grid.id          = 'grid';
    gridContainer.id = 'grid-container';
    gridLineContainer.id = 'grid-line-container';
    grid.appendChild(gridLineContainer);
    grid.appendChild(gridContainer);
    document.body.appendChild(grid);



    // render the grid lines
    bG.gridRender = function(currentBreak) {
        var bp            = typeof currentBreak === 'undefined' ? bG.breaks[0] : currentBreak;
            w             = window.innerWidth,
            h             = window.innerHeight,
            lines         = Math.round(h/bp.baseLineHeight),
            colWidth      = 100/bp.columns,
            gutterSize    = colWidth * bp.gutters,
            grid          = document.getElementById('grid'),
            gridContainer = document.getElementById('grid-container'),
            gridLineContainer = document.getElementById('grid-line-container');

        // set configurable grid and grid container styles
        gridContainer.innerHTML      = '';
        gridLineContainer.innerHTML      = '';
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
            l.style.paddingLeft     = gutterSize/2 + '%';
            l.style.paddingRight    = gutterSize/2 + '%';
            l.style.left            = i * colWidth - gutterSize/2 + '%';
            gridContainer.appendChild(l);
        }
        
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
                var index = bG.mqi <= i ? i + 1 : i;
                index = index >= bG.breaks.length ? index - 1 : index;
                bG.mqi = index;
                return bG.breaks[index];
            }
        }
    }

    // media query change
    bG.breakChange = function(mq) {

        bG.mq = findBreak(mq.media);        
        bG.gridRender(bG.mq);

    }

    bG.gridInit = function() {

        // create stylesheet
        bG.sheet = (function() {
            // Create the <style> tag
            var style = document.createElement("style");

            // WebKit hack
            style.appendChild(document.createTextNode(""));

            // Add the <style> element to the page
            document.head.appendChild(style);

            return style.sheet;
        })();
        bG.sheet.insertRule("\
            #grid {\
                position: absolute;\
                top: 0;\
                left: 0;\
                width: 100%;\
                height: 100%;\
                pointer-events: none;\
            }\
            ", 0);
        bG.sheet.insertRule("\
            #grid-container {\
                position: relative;\
                width: 100%;\
                height: 100%;\
            }\
        ", 0);
        bG.sheet.insertRule("\
            #grid-container div {\
                border: 1px solid " + bG.lineColor + ";\
                border-width: 0 1px;\
                position: absolute;\
                width: 0;\
                height: 100%;\
            }\
        ", 1);
        bG.sheet.insertRule("\
            #grid-container div:before {\
                content:'';\
                background-color:white;\
                position: absolute;\
                width: 0;\
                border-right: 1px solid rgba(0,0,0,.25);\
                height: 100%;\
            }\
        ", 1);
        bG.sheet.insertRule("\
            #grid-line-container {\
                position: absolute;\
                width: 100%;\
                height: 100%;\
            }\
        ", 0);
        bG.sheet.insertRule("\
            #grid-line-container div {\
                background-color:" + bG.lineColor + ";\
                position: absolute;\
                width: 100%;\
                border-top: 1px solid rgba(0,0,0,.25);\
                height: 0;\
            }\
        ", 2);

        // start watching for breakpoints
        if (window.matchMedia) {

            // loop through break points
            for ( i = 0; i < bG.breaks.length; i++ ) {

                // add event listeners to break points
                var mq = window.matchMedia(bG.breaks[i].point);
                mq.addListener(bG.breakChange);

                // set initial break
                if(mq.matches && !bG.mq) {
                    bG.mqi = i + 1;
                    bG.mq = findBreak(mq.media);
                }

            };

            // if media query wasn't found, set to the last query
            bG.mq = !bG.mq ? bG.breaks[(bG.breaks.length-1)] : bG.mq;
            bG.gridRender(bG.mq);
        }
    }

    return bG;
}());