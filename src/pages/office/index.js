import '../../assets/style/office.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/SearchTab'
import '../../includes/mixins/CategoryMenu'
import '../../includes/mixins/OpacityBanner'
import '../../includes/mixins/SideBar'
import '../../includes/mixins/NavFix'
import '../../plugins/jquery.nav'

window.$ = $

$(function () {
  $('.J_SideBar').initSideBar()
  $('.J_PageNav ul').onePageNav({
    paddingTop: 76
  })
  $('.J_NavFix').navFix(0, 999)
})
