import '../../assets/style/special.scss'
import $ from 'jquery'
import '../../common'

window.$ = $

$(function () {
  $('.J_SpecialTab ul li').click(function () {
    var index = $(this).index()
    console.log($(this))
    $(this).addClass('active').siblings().removeClass('active')
    $('.J_SpecialContent').find('.J_SpecialContentList').eq(index).show().siblings().hide()
  })
})
