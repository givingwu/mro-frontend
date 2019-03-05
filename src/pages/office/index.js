import '../../assets/style/office.scss'
import $ from 'jquery'
import '../../common'
import '../../utils/LazyLoadModule'
import '../../includes/mixins/SearchTab'
import '../../includes/mixins/CategoryMenu'
import '../../includes/mixins/OpacityBanner'
// import '../../includes/mixins/Tab'
import '../../includes/mixins/SideBar'
import '../../plugins/jquery.nav'

window.$ = $

$(function () {
  $('.J_LazyModule').initLazyModule()
  $('.J_SideBar').initSideBar()
  $(".J_PageNav ul").onePageNav({paddingTop:76});

  $.fn.navfix = function(mtop, zindex) {
    var nav = $(this)
      , mtop = mtop
      , zindex = zindex
      , dftop = nav.offset().top - $(window).scrollTop();
      $(window).scroll(function(e) {
        if($(this).scrollTop() > dftop){
          nav.css({
            position: "fixed",
            top: mtop + "px",
            left: '0',
            "z-index": zindex
          })
        }else{
          nav.removeAttr('style')
        }
      })
  }

  $('.J_NavFix').navfix(0,999);
})
