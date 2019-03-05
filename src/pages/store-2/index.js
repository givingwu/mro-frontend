import '../../assets/style/store.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/SpecSelector'
import '../../includes/mixins/SideBar'

window.$ = $

$(function () {
  $('.J_SideBar').initSideBar()

  var infoBox = null
  $('.J_ShowProjectInfo ul li').hover(function () {
    var top = $(this).offset().top
    var left = $(this).offset().left
    var infoText = $(this).find('span').text()
    var spanWidth = $(this).find('span').width()
    if ($(this).width() < spanWidth) {
      infoBox = '<div class="project-info-box">' + infoText + '</div>'
      $('body').append(infoBox)
      $('.project-info-box').css({
        'left': left + 'px',
        'top': top - $(window).scrollTop() + 36 + 'px'
      }).addClass('show')
    }
  }, function () {
    if (infoBox) {
      $('.project-info-box').remove()
    }
  })
  $('.J_ShowMore').click(function () {
    var self = $(this)
    var $listDom = self.parent().find('.project-list')
    var listHeight = self.parent().find('.project-list ul').height()
    $listDom.css('height', listHeight + 'px')
    self.parent().toggleClass('close')
    self.toggleClass('on')
  })
})
