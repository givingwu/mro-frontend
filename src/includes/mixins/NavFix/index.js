import $ from 'jquery'

$.fn.navFix = function (mtop, zindex) {
  var nav = $(this)
  var dftop = nav.offset().top - $(window).scrollTop()
  $(window).scroll(function () {
    if ($(this).scrollTop() > dftop) {
      nav.css({
        position: 'fixed',
        top: mtop + 'px',
        left: '0',
        'z-index': zindex
      })
    } else {
      nav.removeAttr('style')
    }
  })
}
