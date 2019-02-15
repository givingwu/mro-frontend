import $ from 'jquery'
import '../../includes/mixins/InputNumber'
import '../../assets/style/common.scss'

$(function () {
  // Initialize .J_SearchTab
  const $searchTab = $('.J_SearchTab')
  const $inputType = $('input[name=t]')

  $searchTab.on('click', function ($e) {
    const $target = $($e.target)
    const isListItem = $target.prop('tagName') === 'LI'

    if (isListItem) {
      $target.addClass('selected').siblings().removeClass('selected')
      const value = $target.data('type')
      value && $inputType.val(value)
    }
  })

  // Initialize .J_InputNumber
  $('.J_InputNumber').inputNumber(function callback (value) {
    console.log(value)
  })
})
