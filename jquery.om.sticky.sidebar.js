(function() {
  var $, win;

  $ = this.jQuery || window.jQuery;
  
  $win=$(window);

  $.fn.omStickSidebar = function(opts) {
  	
    if (opts == null) {
      opts = {};
    }

  	if(opts.disableOnTouch == null || opts.disableOnTouch == true) {
  		if(!!('ontouchstart' in window)) {
  			return this;
  		}
  	}
  	    
    var topGapEl, topGap, topGapH, minWidth;
    
    topGapEl=(opts.topGapEl == null ? false : $(opts.topGapEl));
    topGap=(opts.topGap == null ? 0 : opts.topGap)
  	topGapH=topGap;
  	
  	minWidth=(opts.minWidth == null ? false : opts.minWidth);

		var fn=function($el) {
			var $container=(opts.container == null ? $el.parent() : $(opts.container));
			
			var containerH, elH, stuckMode=false, lastScroll, containerOffset, windowH, elW, elOffset, windowW, scrollTimer, scrolling;
			
			var refreshHeight=function(){
				var pos=$el.css('position');
				if(pos == 'static' || pos == 'relative') {
					elW=$el.width();
				} else {
					var $tmp=$el.clone();
					$tmp.css({
						visibility: 'hidden',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						width: 'auto',
					}).insertBefore($el);
					elW=$tmp.width();
					$tmp.remove();
					$el.css('width',elW+'px');
				}

				containerH=$container.height();
				elH=$el.outerHeight();
				var offset=$container.offset();
				containerOffset=offset.top;
				windowH=$win.height();
				windowW=$win.width();
				if(topGapEl) {
					topGapH=topGap+topGapEl.height();
				}
			}
			refreshHeight();
			$('window, img').load(refreshHeight);
			$win.resize(refreshHeight);
			$el.on('refreshOffsets',refreshHeight);

			var lightRefreshHeight=function(){
				containerH=$container.height();
				elH=$el.outerHeight();
			}
						
			if(minWidth) {
				$win.resize(function(){
					if(windowW < minWidth && stuckMode != false ) {
						$el.css({
							position: 'relative',
							top: 'auto',
							bottom: 'auto',
							width: 'auto'
						});
						stuckMode=false;
					}
				});
			}
			
			$win.scroll(function(){
				if(minWidth && windowW < minWidth ) {
					return;
				}

				if(!scrolling) {
					lightRefreshHeight();
				}
				
				scrolling=true;
				clearTimeout(scrollTimer);
				scrollTimer=setTimeout(function(){
					scrolling=false;
				},1000);

				
				if(elH == containerH) {
					return;
				}
				
				var direction;
				scroll=$win.scrollTop();
				if(lastScroll == null || lastScroll <= scroll) {
					direction='down';
				} else {
					direction='up';
				}
				
				if(elH > windowH) {
					if(direction == 'down' && ((stuckMode == false && scroll + windowH > containerOffset + elH && scroll + windowH < containerOffset + containerH) || stuckMode == 'absolute' && scroll + windowH > containerOffset + elH + elOffset )) {
						var bottom=0;
						$el.css({
							position: 'fixed',
							top: 'auto',
							bottom: bottom+'px',
							width: elW+'px'
						});
						stuckMode='bottom';
					} else if(direction == 'down' && stuckMode == 'bottom' && scroll + windowH > containerOffset + containerH) {
						var top=containerH - elH;
						elOffset=top;
						$el.css({
							position: 'absolute',
							top: top+'px',
							bottom: 'auto',
							width: elW+'px'
						});
						stuckMode='absolute-bottom';
					} else if((direction == 'up' && stuckMode == 'bottom') || (direction == 'down' && stuckMode == 'top')) {
						var offset=$el.offset();
						var top=offset.top - containerOffset + (lastScroll - scroll);
						elOffset=top;
						$el.css({
							position: 'absolute',
							top: top+'px',
							bottom: 'auto',
							width: elW+'px'
						});
						stuckMode='absolute';
					} else if(direction == 'up' && (stuckMode == 'absolute' || stuckMode == 'absolute-bottom') && scroll < containerOffset + elOffset - topGapH) {
						var top=topGapH;
						$el.css({
							position: 'fixed',
							top: top+'px',
							bottom: 'auto',
							width: elW+'px'
						});
						stuckMode='top';
					} else if(direction == 'up' && stuckMode == 'top' && scroll < containerOffset - topGapH) {
						$el.css({
							position: 'relative',
							top: 'auto',
							bottom: 'auto',
							width: 'auto'
						});
						stuckMode=false;
					}
				} else {
					if((direction == 'down' && stuckMode == false && scroll > containerOffset - topGapH) || (direction == 'up' && stuckMode == 'absolute-bottom' && scroll < containerOffset + elOffset - topGapH)) {
						var top=topGapH;
						$el.css({
							position: 'fixed',
							top: top+'px',
							bottom: 'auto',
							width: elW+'px'
						});
						stuckMode='top';
					} else if(direction == 'up' && stuckMode == 'top' && scroll < containerOffset - topGapH) {
						$el.css({
							position: 'relative',
							top: 'auto',
							bottom: 'auto',
							width: 'auto'
						});
						stuckMode=false;
					} else if(direction == 'down' && stuckMode == 'top' && scroll + elH + topGapH > containerOffset + containerH) {
						var top=containerH - elH;
						elOffset=top;
						$el.css({
							position: 'absolute',
							top: top+'px',
							bottom: 'auto',
							width: elW+'px'
						});
						stuckMode='absolute-bottom';
					}
				}
				
				lastScroll=scroll;
			});
			
		}
    
    for (i = 0, len = this.length; i < len; i++) {
      elm = this[i];
      fn($(elm));
    }
    return this;
  };

}).call(this);
