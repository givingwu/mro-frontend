import '../../assets/style/store.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/SpecSelector'
import '../../includes/mixins/SideBar'

window.$ = $

$(function () {
  $('.J_SideBar').initSideBar()
})
