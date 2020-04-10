if($('body').hasClass('home')) {
    
    /**
   * //////////////////////////
   * @name Saturn.js
   * @author Dev Ahmad Hasan
   * @website https://devahmad7.github.io/saturn/index.html
   * //////////////////////////
  **/
  // for all options goto https://github.com/DevAhmad7/saturn
  saturn('.grid-posts').run({
    desktop: {
    dir: "ltr",
      dotShow: true,
      dotEach: false,
      autoPlay: true,
      active: 1,
      centering: true,
      dragger: true,
      starter: 1,
      navShow: true,
      moveSpeed: 500,
      waitTime: 3000,
      moveType: 'linear',
      autoHeight: false,
      pauseOnHover: true,
      lazyLoad: true,
      navPrev: '<i class="fa fa-angle-left"></i>',
      navNext: '<i class="fa fa-angle-right"></i>' },

    laptop: {
      active: 1,
      moveSpeed: 300 },

    tablet: {
      moveAfterAnimation: true },
          phone: {
      moveAfterAnimation: true } });
      //# sourceURL=pen.js
      
} else {
    
    $('body').addClass('itemIndex');
    
}

if($('body').hasClass("item")) {
    
        $('body').removeClass('itemIndex');

}
