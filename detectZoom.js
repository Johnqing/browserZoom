!function(window){
    var document = window.document;
    function user_agent(){
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('msie')>=0) {
            return 'ie';
        };
        if (ua.indexOf('firefox')>=0) {
            return 'firefox';
        };
        if (ua.indexOf('chrome')>=0) {
            return 'chrome';
        };
        if (ua.indexOf('opera')>=0) {
            return 'opera';
        };
    }
    /* 设备检测
    *  继续探索一种不使用mediaQuery的方法，求推荐
    */
    var mediaQueryBinarySearch = function (property, unit, a, b, maxIter, epsilon) {
        var matchMedia;
        var head, style, div;
        if (window.matchMedia) {
            matchMedia = window.matchMedia;
        } else {
            head = document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            head.appendChild(style);

            div = document.createElement('div');
            div.className = 'mediaQueryBinarySearch';
            div.style.display = 'none';
            document.body.appendChild(div);

            matchMedia = function (query) {
                style.sheet.insertRule('@media ' + query + '{.mediaQueryBinarySearch ' + '{text-decoration: underline} }', 0);
                var matched = getComputedStyle(div, null).textDecoration == 'underline';
                style.sheet.deleteRule(0);
                return {matches: matched};
            };
        }
        var ratio = binarySearch(a, b, maxIter);
        if (div) {
            head.removeChild(style);
            document.body.removeChild(div);
        }
        return ratio;

        function binarySearch(a, b, maxIter) {
            var mid = (a + b) / 2;
            if (maxIter <= 0 || b - a < epsilon) {
                return mid;
            }
            var query = "(" + property + ":" + mid + unit + ")";
            if (matchMedia(query).matches) {
                return binarySearch(mid, b, maxIter - 1);
            } else {
                return binarySearch(a, mid, maxIter - 1);
            }
        }
    };
    var zoom = {}
    zoom.ie = function(){
        return window.screen.deviceXDPI / window.screen.logicalXDPI;
    }

    zoom.firefox = function(){
        return mediaQueryBinarySearch('min--moz-device-pixel-ratio', '', 0, 10, 20, 0.0001);
    }

    zoom.opera = function(){
        return window.outerWidth / window.innerWidth;   
    }

    zoom.chrome = function(){
        if(window.devicePixelRatio) {
            return window.devicePixelRatio;
        }
        var div = document.createElement('div');
        div.innerHTML = '1';
        div.setAttribute('style','font:100px/1em sans-serif;-webkit-text-size-adjust:none;position: absolute;top:-100%;');
        document.body.appendChild(div);
        var zoom = 1000 / div.clientHeight;
        zoom = Math.round(zoom * 100) / 100;
        document.body.removeChild(div);
        return zoom;
    }

    //api
    window.detectZoom = function(){
        return zoom[user_agent()]();
    }    

}(this);
