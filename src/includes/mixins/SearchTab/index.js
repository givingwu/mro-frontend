import $ from 'jquery'

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
