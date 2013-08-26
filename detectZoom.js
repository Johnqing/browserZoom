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
    function checkMobile(){
        var pda_user_agent_list = ['iPhone','Android','Symbian OS','Windows','BlackBerry','Opera Mobi','iPad','iPod','Windows Phone','HTC','SonyEricsson','Nokia'];
        var pda_app_name_list =['Microsoft Pocket Internet Explorer'];

        var user_agent = navigator.userAgent.toString();        
        for (var i=0; i<pda_user_agent_list.length; i++) {
            if (user_agent.indexOf(pda_user_agent_list[i]) >= 0) {
                return true;
            }
        }
        var appName = navigator.appName.toString();
        for (var i=0; i<pda_app_name_list.length; i++) {
            if (user_agent.indexOf(pda_app_name_list[i]) >= 0) {
                return true;
            }
        }

        return false;
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
    /*
    * 非完美解决恢复正常浏览器缩放比例
    * ff不支持zoom，所以采用css3的transform来进行缩放
    * transform-origin是用来改变位置
    */
    function reZoom(x){
        var zoom = Math.round(100/(x/100));
        switch(user_agent()){
            case 'firefox':
                var style = document.createElement('style');
                style.innerHTML = 'body {transform: scale('+zoom/100+');-moz-transform-origin:top left;}';
                document.body.appendChild(style);
                break;
            default:
                document.body.style.zoom = zoom +'%';
        }
    }
    //api
    window.detectZoom = function(){
        if (!checkMobile()) {
            return;
        };
        var zoom = 100;
        switch(user_agent()){
            case 'ie':
                zoom = window.screen.deviceXDPI / window.screen.logicalXDPI;
                break;
            case 'firefox':
                // 检测设备缩放比例
                zoom = mediaQueryBinarySearch('min--moz-device-pixel-ratio', '', 0, 10, 20, 0.0001);
                break;
            case 'opera':
                zoom = window.outerWidth / window.innerWidth;
                break;
            default :
                //新版chrome浏览器支持devicePixelRatio，旧版可以使用 webkit-text-size-adjust来做
                //devicePixelRatio是设备上物理像素和设备独立像素
                //
                if(window.devicePixelRatio) {
                    var dpr = window.devicePixelRatio;
                    zoom = (window.outerWidth*dpr-8)/window.innerWidth;
                }else{
                    var tempElem = document.createElement('div');
                    tempElem.innerHTML = '1';
                    tempElem.setAttribute('style','font:100px/1em sans-serif;-webkit-text-size-adjust:none;position: absolute;top:-100%;');
                    document.body.appendChild(tempElem);
                    var x = 100/tempElem.clientHeight;
                }
        }
        zoom = Math.round(zoom * 100);
        var zoomTips = document.createElement('div');
        zoomTips.innerHTML = '您当前的浏览器缩放比例为'+ zoom + "%";
        document.body.appendChild(zoomTips);
        /**
         * 如果缩放比例不合适，可以通过zoom/scale来模拟
         */
        if (zoom!=100) {
            var div = document.createElement('div');
            div.innerHTML = '<button id="reZoom">点击恢复100%</button>';
            document.body.appendChild(div);
            document.getElementById('reZoom').onclick = function(){
                reZoom(zoom);
            }
        };
    }    

}(this);