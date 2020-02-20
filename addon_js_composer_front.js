jQuery(function($){
	"use strict";
	
	$('.wpb_gallery_slides a.prettyphoto').add('.vc_images_carousel a.prettyphoto').add('.wpb_single_image a.prettyphoto').removeClass('prettyphoto'); // Remove this class to abort prettyPhoto implementing by WPB Composer
	
	/*******************************/
	
	services_init();
	
	about_init();
	
	testimonials_init();
	
	persons_init();
	
	logos_init();
	
	blog_posts_init();
	
	rent_locations_init();
	
	/*******************************/
	
	function services_init() {
		if(jQuery().owlCarousel) {
			$(".vc_om-services").each(function(){
				if($(this).children().length > 1) {
					$(this).owlCarousel({
						items: 1,
						nav: true,
						navRewind: false,
						navText: ['',''],
						onInitialize: function() {
							var $el=$(this.$element);
							if($el.data('top-padding') != 'undefined') {
								$el.find('.om-services__item').css('padding-top', $el.data('top-padding') + 'px');
							}
							if($el.data('bottom-padding') != 'undefined') {
								$el.find('.om-services__item').css('padding-bottom', $el.data('bottom-padding') + 'px');
							}
						},
						onInitialized: function(){
							var $el=$(this.$element);
							if($el.data('top-padding') != 'undefined' || $el.data('bottom-padding') != 'undefined') {
								var top=$el.data('top-padding') != 'undefined' ? $el.data('top-padding') : $el.find('.om-services__item:first').css('padding-top');
								var bottom=$el.data('bottom-padding') != 'undefined' ? $el.data('bottom-padding') : $el.find('.om-services__item:first').css('padding-bottom');
								var diff=(top-bottom)/2;
								$el.find('.owl-nav div').css('margin-top',diff+'px');
							}
						},
						mouseDrag: false
					});
				} else {
					$(this).show();
				}
			});
		} else {
			$(".vc_om-services").show();
		}
	}

	/*******************************/
	
	function about_init() {
		if(jQuery().owlCarousel) {
			$(".vc_om-about").each(function(){
				if($(this).children().length > 1) {
					$(this).owlCarousel({
						items: 1,
						nav: true,
						navRewind: false,
						navText: ['',''],
				    animateOut: 'fadeOut',
				    animateIn: 'fadeIn',
				    mouseDrag: false
					});
				} else {
					$(this).show();
				}
			});
		} else {
			$(".vc_om-about").show();
		}
	}	
	
	/*******************************/
	
	function testimonials_init() 	{
		if(jQuery().owlCarousel) {
			$(".vc_om-testimonials").each(function(){
				if($(this).children().length > 1) {
					$(this).owlCarousel({
						items: 1,
						nav: false,
						navRewind: false,
						navText: ['',''],
				    mouseDrag: false
					});
				} else {
					$(this).show();
				}
			});
		} else {
			$(".vc_om-testimonials").show();
		}
	}
	
	/*******************************/
	
	function persons_init() 	{
		if(jQuery().owlCarousel) {
			$(".vc_om-persons").each(function(){
				if($(this).children().length > 1) {
					$(this).owlCarousel({
						items: 1,
						nav: false,
						navRewind: false,
						navText: ['',''],
				    mouseDrag: false
					});
				} else {
					$(this).show();
				}
			});
		} else {
			$(".vc_om-persons").show();
		}
	}
	
	/*******************************/
	
	function logos_init() {
		$('.vc_om-logos.vc_om-logos-layout-carousel').each(function(){
			
			var $this=$(this);
			var $inner=$('.vc_om-logos-inner',$this);
			var $container=$('.vc_om-logos-container',$this);
			$this.data('first-item',0);
			var total=$container.children('.vc_om-logos-item').length;
			
			var $controls=$('<div class="vc_om-logos-controls" />');
			var $prev=$('<a href="#" class="om-prev" />').appendTo($controls);
			var $next=$('<a href="#" class="om-next" />').appendTo($controls);
			$controls.appendTo(this);

			$next.click(function(){
				$container.stop(true,true);
				var container_w=0;
				$container.children('.vc_om-logos-item').each(function(){container_w+=$(this).width()});
				var vport=$inner.width();
				var ml=parseInt($container.css('left'));
				if(isNaN(ml))
					ml=0;

				if((ml + container_w) < vport)
					return false;

				var first=$this.data('first-item');
				var n=1;
				var m=$container.children('.vc_om-logos-item:eq('+first+')').width();
				
				for(var i=first+1; i<total; i++) {
					if((ml - m + container_w) < vport)
						break;
					var w=$container.children('.vc_om-logos-item:eq('+i+')').width();
					if(w+m < vport) {
						m+=w;
						n++;
					} else {
						break;
					}
				}
				
				$this.data('first-item', first+n);

				ml-=m;
				$container.animate({
					left: ml+'px'
				}, 300);
				
				
				return false;
			});
			
			$prev.click(function(){
				$container.stop(true,true);
				var first=$this.data('first-item');
				if(first <= 0)
					return false;
					
				var ml=parseInt($container.css('left'));
				if(isNaN(ml))
					ml=0;

				var n=1;
				var m=$container.children('.vc_om-logos-item:eq('+(first-1)+')').width();
				var vport=$inner.width();

				for(var i=first-2; i>=0; i--) {
					var w=$container.children('.vc_om-logos-item:eq('+i+')').width();
					if(m+w < vport) {
						m+=w;
						n++;
					} else {
						break;
					}
				}
				
				$this.data('first-item', first-n);

				ml+=m;
				$container.animate({
					left: ml+'px'
				}, 300);
				
				
				return false;
			});
			
		});
	}

	/*******************************/

	function blog_posts_init() {
		if(jQuery().isotopeOm) {
			$('.blog-posts.layout-shortcode').each(function() {
				
				var $container=$(this).find('section');
				
		    var args={ 
			    itemSelector: '.blog-post',
			    layoutMode: 'masonry',
			    transitionDuration: 0
			  };
  
				$container.isotopeOm(args);
				
				$container.find('img').load(function(){
					$container.isotopeOm('layout');
				});
	
	    });
		}
	}
	
	/*******************************/
	
	function rent_locations_init() {
		om_google_maps_on_load(function(){
			var setMap=function($address, geocoder, gMap, zoom, $obj){
				if($address.data('geo-lat') && $address.data('geo-lng')) {
					gMap.setCenter({lat: $address.data('geo-lat'), lng: $address.data('geo-lng')});
					gMap.setZoom(zoom);
				} else {
					geocoder.geocode({'address':$address.attr('value')}, function(results, status){
						if(status === google.maps.GeocoderStatus.OK) {
							gMap.setCenter(results[0].geometry.location);
							gMap.setZoom(zoom);
						} else if( status === google.maps.GeocoderStatus.REQUEST_DENIED) {
							$obj.html('<p style="text-align:center"><em>Google Maps Geocoding API must be enabled for specified API Key to use Locations element.</em></p>');
						}
					});
				}
			}
			$('.vc_om-rental-locations').each(function(){
				var $obj=$(this);
				var $error_container=$('<div />');
				var $map=$obj.find('.om-rental-locations__map');
				var $select=$obj.find('.om-rental-locations__select');
				var zoom=$map.data('map-zoom');
				if(!zoom) {
					zoom=16;
				}
				var map_marker=$map.data('map-marker');
				
				var locations={};
				var mapInitialized=false;
				var gMap;

				var initMap=function(){
					if(mapInitialized) {
						return;
					}
					var ready=true;
					$.each(locations,function(id, location) {
						if(!location.ready) {
							ready=false;
							return false;
						}
					});
					if(!ready) {
						return;
					}
					
					mapInitialized=true;
					
					gMap = new google.maps.Map($map.get(0), {
						center: {lat: 40, lng: -74},
						zoom: 2,
						scrollwheel: false,
						draggable: !('ontouchstart' in window)
					});
					$.each(locations,function(id, location) {
						var latlng = new google.maps.LatLng(location.lat,location.lng);
						var marker_agrs={
							position: latlng,
							title: location.name,
							map: gMap
						};
						if(map_marker) {
							marker_agrs.icon={
								url: map_marker
							};
						}
						var marker = new google.maps.Marker(marker_agrs);
						
						var infowindow = new google.maps.InfoWindow({
							content: '<b>' + location.name + '</b><br/>' + location.address,
						});
						
						marker.addListener('click', function() {
							infowindow.open(gMap, marker);
						});
					});
					
					$select.change(function(){
						var id=$(this).val();
						gMap.setCenter({lat: locations[id].lat, lng: locations[id].lng});
						gMap.setZoom(zoom);
					}).change();
				};
				
				$select.find('option').each(function(){
					var id=$(this).attr('value');
					locations[id]={
						address: $(this).data('address'),
						name: $(this).text(),
						ready: false
					};
					if($(this).data('geo-lat') && $(this).data('geo-lng')) {
						locations[id].lat=parseFloat($(this).data('geo-lat'));
						locations[id].lng=parseFloat($(this).data('geo-lng'));
						locations[id].ready=true;
					} else {
						var geocoder = new google.maps.Geocoder();
						geocoder.geocode({'address':$(this).data('address')}, function(results, status){
							if(status === google.maps.GeocoderStatus.OK) {
								locations[id].lat=results[0].geometry.location.lat();
								locations[id].lng=results[0].geometry.location.lng();
								locations[id].ready=true;
								initMap();
							} else if( status === google.maps.GeocoderStatus.REQUEST_DENIED) {
								$error_container.html('<p style="text-align:center"><em>Google Maps Geocoding API must be enabled for specified API Key to use Locations element.</em></p>').insertBefore($map);
							}
						});
					}
				});
				initMap();
				




				/*
				var $address=$select.find('option:selected');
				setMap($address, geocoder, gMap, zoom, $this);
				$select.change(function(){
					setMap($(this).find('option:selected'), geocoder, gMap, zoom, $this);
				})
				*/
			});
		});
	}
	
	
});

/* Toggle/FAQ
 ---------------------------------------------------------- */
if ( typeof window[ 'vc_toggleBehaviour' ] !== 'function' ) {
	window.vc_toggleBehaviour = function ( $el ) {
		var event = function ( e ) {
			e && e.preventDefault && e.preventDefault();
			var title = jQuery( this );
			var element = title.closest( '.vc_toggle' );
			var content = element.find( '.vc_toggle_content' );
			if ( element.hasClass( 'vc_toggle_active' ) ) {
				content.slideUp( {
					duration: 200,
					complete: function () {
						element.removeClass( 'vc_toggle_active' );
					}
				} );
			} else {
				element.addClass( 'vc_toggle_active' );
				setTimeout(function(){
					content.slideDown( {
						duration: 200,
						complete: function () {
							
						}
					} );
				}, 210);
			}
		};
		if ( $el ) {
			if ( $el.hasClass( 'vc_toggle_title' ) ) {
				$el.unbind( 'click' ).click( event );
			} else {
				$el.find( ".vc_toggle_title" ).unbind( 'click' ).click( event );
			}
		} else {
			jQuery( ".vc_toggle_title" ).unbind( 'click' ).on( 'click', event );
		}
		
		jQuery('.vc_toggle.vc_toggle_active').each(function(){
			jQuery(this).find( '.vc_toggle_content').show();
		});

	}
}

