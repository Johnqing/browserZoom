browserZoom

===========

浏览器缩放检测插件

#当用户缩放以后提示用户浏览器已经进行缩放，请恢复正常缩放比例

#IE8: screen.deviceXDPI / screen.logicalXDPI (or, for the zoom level relative to default zoom, screen.systemXDPI / screen.logicalXDPI)
#IE7: var body = document.body,r = body.getBoundingClientRect(); return (r.left-r.right)/body.offsetWidth; (thanks to this example or this answer)
#FF3.5 ONLY: screen.width / media query screen width (see below) (takes advantage of the fact that screen.width uses device pixels but MQ width uses CSS pixels--thanks to Quirksmode widths)
#FF3.6: no known method
#FF4+: media queries binary search (see below)
#WebKit: measure the preferred size of a div with -webkit-text-size-adjust:none.
#WebKit: (broken since r72591) document.width / jQuery(document).width() (thanks to Dirk van Oosterbosch above). To get ratio in terms of device pixels (instead of relative to default zoom), multiply by window.devicePixelRatio.
#Old WebKit? (unverified): parseInt(getComputedStyle(document.documentElement,null).width) / document.documentElement.clientWidth (from this answer)
#Opera: document.documentElement.offsetWidth / width of a position:fixed; width:100% div. from here (Quirksmode's widths table says it's a bug; innerWidth should be CSS px). We use the position:fixed element to get the width of the viewport including the space where the scrollbars are; document.documentElement.clientWidth excludes this width. This is broken since sometime in 2011; I know no way to get the zoom level in Opera anymore.
