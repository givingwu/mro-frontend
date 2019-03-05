import '../../assets/style/store.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/SpecSelector'
import '../../includes/mixins/SideBar'

window.$ = $

$(function () {
  $('.J_SideBar').initSideBar()
  $('.J_ShowMore').click(function () {
    var self = $(this)
    var $listDom = self.parent().find('.project-list')
    var listHeight = self.parent().find('.project-list ul').height()
    $listDom.css('height', listHeight + 'px')
    self.parent().toggleClass('close')
    self.toggleClass('on')
  })
})
