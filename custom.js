"use strict";

jQuery(function($){

	if(!!('ontouchstart' in window))
		jQuery('html').addClass('touch');
	else
		jQuery('html').addClass('no-touch');
		
	/***********************************/
	
	$(window).bind('resize load', function(){
		var timer=$(this).data('resize_delay_timer');
		if(timer)	{
			clearTimeout(timer);
			timer=false;
		}
		
		timer=setTimeout(function(){
			$(window).trigger('resize_delay');
		}, 200);
		$(this).data('resize_delay_timer', timer);
	});

	/***********************************/
		
	function responsiveListener_init(){
		var $win=$(window);
		if($('#wheelsberry-responsive-mobile-css').length) {
			var lastWindowSize=$win.width();
			$win.data('mobile-view',(lastWindowSize<768));
			
			$win.resize(function(){
				var w=$(this).width();
				if(
					(w>=768 && lastWindowSize < 768) ||
					(w<=767 && lastWindowSize > 767)
				){
					$win.data('mobile-view',(w<768));
				}
				lastWindowSize=w;
			});
		} else {
			$win.data('mobile-view', false);
		}
	}
	
	/***********************************/

	$.extend($.easing, {
    easeInOutOM: function (x, t, b, c, d) {
      if (t==0) return b;
      if (t==d) return b+c;
      if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
 		}
	});
		
	/***********************************/
	
	var if_header_sticky=$('.header').hasClass('header__menu--sticky');
	var admin_bar_height=$('#wpadminbar').height();
	function get_sticky_header_gap() {
		if( $(window).data('mobile-view') != true ) {
			return admin_bar_height + ( if_header_sticky ? $('.header').height() : 0 );
		} else {
			return 0;
		}
	}
		
	/***********************************/	
	
	responsiveListener_init();
	
	menu_init();
	
	cars_slider_init();
	
	reserve_form_init();
	
	sliced_gallery_init();
	
	masonry_gallery_init();
	
	responsive_embed_init();
	
	gallery_init(); // important to init after all isotope initializations
	
	commentform_fast_validation_init();
	
	back_to_top_init();
	
	post_share();
	
	/***********************************/
	
	function menu_init() {

		// Primary Menu
		
		$('ul.primary-menu a[href="#"]').removeAttr('href');
		
		$('ul.primary-menu-fallback.show-dropdown-symbol li').each(function(){
			if($(this).children('.sub-menu').length)
				$(this).addClass('menu-item-has-children');
		});
		
		$('.primary-menu li.megamenu-enable .sub-menu .sub-menu').addClass('megamenu-sub');
		
		var args={
			popUpSelector: '.sub-menu',
			autoArrows: false,
			delay: 150,
			animation: {opacity: 'show'},
			animationOut: {},
			speed: 0,
			speedOut: 0,
			disableHI: true,
			onBeforeHide: function(){
				jQuery(this).parent().removeClass('omHover');
			},
			onShow: function(){
				jQuery(this).parent().addClass('omHover');
			}
		};
	
		$('ul.primary-menu').superfish(args);

		// Mobile menu		
		
		var $overlay=$('<div class="mobile-menu-overlay" />');
		$('ul.primary-mobile-menu a[href="#"]').removeAttr('href');
		
		$('ul.primary-mobile-menu').superfish({
			autoArrows: false,
			delay: 500,
			animation: {opacity: 'show', height: 'show'},
			animationOut: {opacity: 'hide', height: 'hide'},
			speed: 150,
			speedOut: 200,
			disableHI: true,
			event: 'click'
		});
		
		$('.mobile-menu-control').click(function(){
			if($('.mobile-menu-container').hasClass('active')) {
				$overlay.stop(true,true).fadeOut(300, function(){
					$(this).detach();
				});
				$(this).css('top',top + 'px').removeClass('active');
				$('.mobile-menu-container').removeClass('active');
			} else {
				var top=$(this).offset().top;
				$('.mobile-menu-container').css('padding-top',$('.header').height() + 'px');
				$overlay.stop(true,true).appendTo('body');
				$overlay.fadeIn(300);
				$(this).css('top',top + 'px').addClass('active');
				$('.mobile-menu-container').addClass('active');
			}

		});
		
		// one page navigation
		
		if(jQuery().onePageNavOm) {
			$('ul.primary-menu').onePageNavOm({
		    currentClass: 'current-menu-item',
		    changeHash: false,
		    scrollSpeed: 350,
		    scrollThreshold: 0.5,
		    filter: '[href*="#"]',
		    offset: get_sticky_header_gap
			});
			
			$('ul.primary-mobile-menu').onePageNavOm({
		    currentClass: 'current-menu-item',
		    changeHash: false,
		    scrollSpeed: 350,
		    scrollThreshold: 0.5,
		    filter: '[href*="#"]',
		    offset: 0,
		    begin: function(){
		    	$('.mobile-menu-control').click();
		    }
			});
		}

		// Sticky Menu
		var $header=$('.header');
		var $header_wrapper=$('.header-wrapper');
		var timer;
		var transition_duration=parseFloat($('.header__inner').css('transition-duration'));
		if(isNaN(transition_duration)) {
			transition_duration=0;
		} else {
			transition_duration*=1000;
		}
		if($header.hasClass('header__menu--sticky')) {
			var header_stuck=false;
			$(window).scroll(function(){
				var st=$(window).scrollTop();
				if(st > 0 && !header_stuck) {
					if(timer) {
						clearTimeout(timer);
					}
					$header_wrapper.css('height', $header.height() + 'px');
					$header.addClass('header--stuck');
					header_stuck=true;
				} else if(st == 0 && header_stuck) {
					$header.removeClass('header--stuck');
					timer=setTimeout(function(){
						$header_wrapper.css('height', 'auto');
					},transition_duration);
					header_stuck=false;
				}
			});
		}
		
		// scroll position on load with stiky menu fix
		if(document.location.hash != '') {
			var hash=document.location.hash;
			var $obj=$(hash);
			if($obj.length) {
				var gap=get_sticky_header_gap();
				if(gap) {
					$(window).load(function(){
						setTimeout(function(){
							$('html, body').scrollTop($obj.offset().top - gap);
						},50);
					});
				}
			}
		}
	}
	
	/*************************************/
	
	function cars_slider_init() {
		
		if(jQuery().owlCarousel) {
			$('.cars-slider__inner').each(function(){
				if($(this).children().length > 1) {
					$(this).owlCarousel({
						items: 1,
						nav: true,
						navRewind: false,
						navText: ['',''],
						mouseDrag: false
					});
				} else {
					$(this).show();
				}
			});
		} else {
			$('.cars-slider__inner').show();
		}
		
		$('.cars-slider__item-reserve-button').click(function(){
			$('.reservation.reservation--hidden').slideDown(200);
			$('#reservation-form__car-select').val($(this).data('car-id')).change();
			
			var st=$('#reservation').offset().top - get_sticky_header_gap();
			$('html, body').animate({scrollTop:st}, 500, 'easeInOutOM');
		});
	}
	
	/*************************************/
	
	function reserve_form_init() {
		
		if(!$('#reservation').length) {
			return false;
		}
		
		// first step
		var $cf7_extra_elements=$('<input type="hidden" name="extra-options" />');
		$('#reservation-form-step-1 :input[name]').each(function(){
			$cf7_extra_elements = $cf7_extra_elements.add( $('<input type="hidden" />').attr('name',$(this).attr('name')) );
		});
		
		$('#reservation-form__car-select-label').click(function(){
			$(this).remove();
		});
		
		$('#reservation-form__car-select').change(function(){
			if($(this).val() == '') {
				$('#reservation-form__car-select-label').show();
			} else {
				$('#reservation-form__car-select-label').hide();
				if($('.reservation').hasClass('reservation--short')) {
					$('.reservation-form__more').slideDown(300,function(){
						$('.content-columns__sidebar aside').trigger('refreshOffsets');
					});
				}
			}
		}).change();
		
		if(jQuery().select2) {
			$('#reservation-form__pick-up-location-select').select2();
			$('#reservation-form__drop-off-location-select').select2();
		}
			
		if(jQuery().datepicker) {
			var dpArgs={
				nextText: '',
				prevText: '',
				minDate: 0,
				dateFormat: $('#reservation-form__pick-up-date-input').data('date-format'),
				beforeShow: function(input, dp){
					$(dp.dpDiv).css('min-width',$(input).outerWidth() - 2 + 'px');
				},
				onSelect: function(date) {
					$('#reservation-form__drop-off-date-input').datepicker('option', 'minDate', date);
					$(this).trigger('change');
				}
			}
			if(typeof(objectL10n) != 'undefined') {
				$.extend(dpArgs, {
			    monthNames: objectL10n.monthNames,
			    monthNamesShort: objectL10n.monthNamesShort,
			    dayNames: objectL10n.dayNames,
			    dayNamesShort: objectL10n.dayNamesShort,
			    dayNamesMin: objectL10n.dayNamesMin,
			    firstDay: objectL10n.firstDay,
					isRTL: objectL10n.isRTL
				});
			}
			$('#reservation-form__pick-up-date-input').datepicker(dpArgs);
			dpArgs.onSelect=null;
			$('#reservation-form__drop-off-date-input').datepicker(dpArgs);
		}
		
		$('#reservation-form-step-1').submit(function(e){
			e.preventDefault();

			var $form=$(this);
			
			var submit=true;
			$('.reservation-form input[type="text"], .reservation-form select').each(function(){
				if($(this).val() == '') {
					$(this).parents('.reservation-form__field-inner').addClass('error');
					submit=false;
				} else {
					$(this).parents('.reservation-form__field-inner').removeClass('error');
				}
			});
			if(submit) {
				$('.reservation-form__submit-button').attr('disabled','disabled');

				var animationDelay=0;
				if($('.reservation-form__required-notice').is(':visible')) {
					animationDelay=100;
					$('.reservation-form__required-notice').slideUp(animationDelay);
				}
				$form.find('.ajax-loading').show();
				setTimeout(function(){
					$.ajax({
						type: 'POST',
						url: wheelsberryAjax.ajaxurl,
						data: {
							action: 'wheelsberry_reservation_form_details',
							form_data: $form.serializeArray()
						},
						dataType: 'html'
					}).always(function(){
						$('.reservation-form__submit-button').attr('disabled',false);
						$('.reservation-form .ajax-loading').hide();
					}).done(function(data){

						$('#reservation-form-step-1 :input[name]').each(function(){
							var name=$(this).attr('name');
							var val;
							if($(this).prop('tagName') == 'SELECT') {
								val=$(this).find('option:selected').text();
							} else {
								val=$(this).val();
							}
							$cf7_extra_elements.filter('[name="'+name+'"]').val(val);
						});

						$('.your-booking__details').html(data);

						init_extra_options();

						$('.your-booking').slideDown(200,function(){
							$('.content-columns__sidebar aside').trigger('refreshOffsets');
						});
						var st=$('#your-booking').offset().top - get_sticky_header_gap();
						$('html, body').animate({scrollTop:st}, 500, 'easeInOutOM');
					});
				}, animationDelay);
			} else {
				$('.reservation-form__required-notice').slideDown(200);
			}
		});
		
		$('.reservation-form input[type="text"], .reservation-form select').change(function(){
			if($(this).val() != '') {
				$(this).parents('.reservation-form__field-inner').removeClass('error');
			}
		});


		// second step
		var init_extra_options=function(){
			var $extra_options=$('.your-booking__extras-options .rent-option-item input[type="checkbox"]');
			var $extra_options_input=$cf7_extra_elements.filter('[name="extra-options"]');
			var update_extra_options=function(){
				var values=[];
				$extra_options.filter(':checked').each(function(){
					values.push( $(this).parents('.rent-option-item').find('.rent-option-name').text() );
				});
				$extra_options_input.val(values.join(', '));
			}
			$extra_options.change(update_extra_options);
		}
		
		// final step / contact form 7
		
		var $form=$('.your-booking__personal form').append($cf7_extra_elements);

		$('.your-booking__personal .wpcf7').on('wpcf7:mailsent',function(){
			$('#reservation-form-step-1').slideUp(200);
			$('#your-booking').slideUp(200);
			$('#booking-success-message').slideDown(200,function(){
				$('.content-columns__sidebar aside').trigger('refreshOffsets');
			});
			var st=$('#reservation').offset().top - get_sticky_header_gap();
			$('html, body').animate({scrollTop:st}, 500, 'easeInOutOM');
		});
	}
	
	/*************************************/
	
	function gallery_init() {
		if(jQuery().omSlider) {
			jQuery('.custom-gallery').each(function(){
				var $items=jQuery(this).find('.items');
				var num=$items.find('.item').length;
				if(num > 1) {
					
					var active=0;
					var hash=document.location.hash.replace('#','');
					if(hash != '') {
						var $active=$items.find('.item[rel='+hash+']');
						if($active.length)
							active=$active.index();
					}
					jQuery(this).append('<div class="controls"><div class="control-prev"><a href="#" class="prev"></a></div><div class="control-next"><a href="#" class="next"></a></div><div class="control-progress"><div class="progress"></div></div></div>');
					var $controls=jQuery(this).find('.controls');
					$controls.find('.total').html(num);
					var args={
						speed: 400,
						next: $controls.find('.next'),
						prev: $controls.find('.prev'),
						active: active,
						before: function(currSlide, nextSlide, currSlideNum, nextSlideNum){
							$controls.find('.progress').css('width',Math.round(nextSlideNum/(num-1)*100)+'%');
						}
					};
					
					$('.prev, .next', $controls).mousedown(function(){
						$(this).addClass('mousedown');
					}).mouseup(function(){
						$(this).removeClass('mousedown');
					});
						
					/*
					var $blog=jQuery(this).parents('.blogroll.layout-grid');
					if($blog.length && jQuery().isotopeOm ) {
						var $iso=$blog.find('section');
						args.after=function(){
							$iso.isotopeOm('layout');
						};
					}
					*/
					$items.omSlider(args);
	
				}
			});
		}
	}
	
	
	/*************************************/
	
	function sliced_gallery_init() {
		
		jQuery(window).bind('resize load', function(){
			sliced_gallery_resize();
		});
		sliced_gallery_resize();
		
	}
	
	function sliced_gallery_resize(){
		
		$('.gallery-sliced').each(function(){
			var $cont=$(this);
			var w=$cont.width();
			
			//var mar=Math.floor(w*0.01);
			var mar=0;

			//2
			var $box=$cont.find('.gallery-sliced-box-2');
			if($box.length) {
				var h1=Math.floor(w*0.6666*0.66579634464751958224543080939948);
				$box.find('.img-1, .img-2').css('height',h1+'px');
			}
			
			//3
			var $box=$cont.find('.gallery-sliced-box-3');
			if($box.length) {
				$box.find('.img-2').css('margin-bottom',mar+'px');
				var h2=Math.floor(w*0.3333*0.65274151436031331592689295039164);
				var h1 = h2*2+mar;
				$box.find('.img-1').css('height',h1+'px');
				$box.find('.img-2, .img-3').css('height',h2+'px');
			}
						
			//4
			var $box=$cont.find('.gallery-sliced-box-4');
			if($box.length) {
				$box.find('.img-2, .img-3').css('margin-bottom',mar+'px');
				var h2=Math.floor(w*0.3333*0.56396866840731070496083550913838);
				var h1 = h2*3+mar*2;
				$box.find('.img-1').css('height',h1+'px');
				$box.find('.img-2, .img-3, .img-4').css('height',h2+'px');
			}
			
			//5
			var $box=$cont.find('.gallery-sliced-box-5');
			if($box.length) {
				var h1 = Math.floor(w*0.3333*0.6649076517150);
				var h2 = Math.floor(w*0.5*0.66550522648083);
				$box.find('.img-1, .img-2, .img-3').css('height',h1+'px');
				$box.find('.img-4, .img-5').css('height',h2+'px');
			}
		});
		
	}
	
	/******************************/
	
	function masonry_gallery_init() {

		if(jQuery().isotopeOm) {
			$('.gallery-masonry').each(function() {
				
				var $container=$(this).find('.items');
				
		    var args={ 
			    itemSelector: '.item',
			    layoutMode: 'masonry'
			  };
			  
				$container.isotopeOm(args);
				
				$container.find('img').load(function(){
					$container.isotopeOm('layout');
				});

	    });
		}
	}
	
	/********************************/
	
	function responsive_embed_init() {
		$('.responsive-embed').each(function(){
			var $obj=$(this).children(':first');
			if($obj.length) {
				var w=parseInt($obj.attr('width'));
				var h=parseInt($obj.attr('height'));
				if(!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
					var r=h/w;
					$(this).css('padding-bottom',(r*100)+'%');
				}
			}
		});
	}
	
	/*******************************/
	
	function commentform_fast_validation_init() {
		
		$('#commentform').submit(function(){
			var stop=false;
			$(this).find('input.required, textarea.required').each(function(){
				if($(this).val() == '') {
					$(this).addClass('error').on('keyup.validation', function(){
						$(this).removeClass('error').off('keyup.validation');
					});
					stop=true;
				}
			});
			if(stop)
				return false;
		});
		
	}

	/****************************************/
	
	function back_to_top_init() {
		
		var $button=$('.om-back-to-top');
		$button.click(function(){
			$('html, body').animate({scrollTop:0}, 500);
			return false;
		});
		
		
		var button_visible=false;
		var button_timer;
		var last_st=0;
 		if($button.length) {
 			var fn=function(){
				var st=jQuery(window).scrollTop();
				if(st > 300 && st < last_st && !button_visible) {
					$button.addClass('active');
					button_visible=true;
				} else if( ( st > last_st || st < 300 ) && button_visible) {
					$button.removeClass('active');
					button_visible=false;
				}
				last_st=st;
 			}
			$(window).scroll(fn);
			fn();
		}
		
	}

	/****************************************/
	
	function post_share() {
		
		$('.post-share-button').click(function(e){
			var winWidth = 560;
			var winHeight = 400;
      var winTop = (screen.height / 2) - (winHeight / 2);
      var winLeft = (screen.width / 2) - (winWidth / 2);
			window.open($(this).attr('href'), 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
			
			e.preventDefault();
		});
		
	}
	
});

/***********************************/

function lightbox_init(args_)
{
	var args={
		deeplinking: false,
		overlay_gallery: false,
		opacity: 1,
		theme: 'om_theme',
		horizontal_padding: 0,
		markup: '<div class="pp_pic_holder">'+
						'<div class="pp_content_container">'+
							'<div class="pp_content">'+
								'<div class="pp_loaderIcon"></div>'+
								'<div class="pp_details">'+
									'<div class="pp_nav">'+
										'<a href="#" class="pp_arrow_previous">Previous</a>'+
										'<p class="currentTextHolder">0/0</p>'+
										'<a href="#" class="pp_arrow_next">Next</a>'+
									'</div>'+
									'{pp_social}'+
									'<a href="#" class="pp_expand" title="Expand the image">Expand</a>'+
									'<a class="pp_close" href="#">Close</a>'+
								'</div>'+
								'<div class="pp_fade">'+
									'<div class="pp_hoverContainer">'+
										'<a class="pp_next" href="#">next</a>'+
										'<a class="pp_previous" href="#">previous</a>'+
									'</div>'+
									'<div id="pp_full_res"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="ppt">&nbsp;</div>'+
					'</div>'+
					'<div class="pp_overlay"></div>'
	};
	if(args_)
		jQuery.extend(args, args_);
	
	//prettyPhoto
	if(jQuery().prettyPhoto) {
		jQuery('a[rel^=prettyPhoto]').addClass('pp_worked_up').prettyPhoto(args);
		jQuery('a[data-rel^=prettyPhoto]').addClass('pp_worked_up').prettyPhoto(jQuery.extend(args, {hook: 'data-rel'}));
		var $tmp=jQuery('a').filter(function(){ return /\.(jpe?g|png|gif|bmp)$/i.test(jQuery(this).attr('href')); }).not('.pp_worked_up');
		$tmp.each(function(){
			if(typeof(jQuery(this).attr('title')) == 'undefined')
				jQuery(this).attr('title',''); 
		});
		$tmp.prettyPhoto(args); 
	}
}

/***********************************/

function om_local_scroll_init() {

	jQuery('.wpb_text_column a, a.vc_btn3, .vc_om-click-icon-box a, .vc_om-click-icon-box2 a, .vc_om-teaser a, .vc_om-teaser2 a, .vc_call_to_action a, .vc_om-click-box').filter('[href*="#"]').click(function(e){
		var URI = location.href.replace(/#.*/, ''); // local url without hash
		if(this.href && this.hash && this.href.replace(this.hash,'') === URI) {
			var id=this.hash.slice(1);
			var $target=jQuery('#'+id);
			if(!$target.length) {
				$target=jQuery('a[name="'+id+'"]');
			}
				
			if($target.length) {
				e.preventDefault();
				
				var offset=$target.offset().top;
				var wh=jQuery(window).height();
				var dh=jQuery(document).height();
				if(offset > dh-wh)
					offset=dh-wh;
				if(offset < 0)
					offset=0;
				jQuery('html, body').animate({scrollTop:offset}, 1000, 'easeInOutOM');
			}
		}
		
	});
	
}

/***********************************/

function om_sidebar_slide_init() {
	var topGapEl=false;
	if(jQuery('.header').hasClass('header__menu--sticky')) {
		topGapEl='.header';
	}
	jQuery(".content-columns__sidebar aside").omStickSidebar({
		container: '.content-columns',
		topGapEl: topGapEl,
		topGap: jQuery('#wpadminbar').height(),
		minWidth: 768
	});
}

/********************************/

function om_google_maps_api_loaded() {
	jQuery(window).trigger('google_maps_api_loaded');
	jQuery(window).data('google_maps_api_loaded',true);
}

function om_google_maps_on_load(fn) {
	if(jQuery(window).data('google_maps_api_loaded')) {
		fn();
	} else {
		jQuery(window).on('google_maps_api_loaded',fn);
	}
}
