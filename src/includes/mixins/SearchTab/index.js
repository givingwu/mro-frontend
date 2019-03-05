import $ from 'jquery'

$(function () {
  const $searchTab = $('.J_SearchTab')
  const $hotWords = $('.J_HotWordsList')
  const $form = $('.J_SearchPanel')
  const $inputType = $('#t')
  const $inputQuestion = $('#q')

  $searchTab.on('click', function (e) {
    const $target = $(e.target)
    const isListItem = $target.prop('tagName') === 'LI'

    if (isListItem) {
      $target.addClass('selected').siblings().removeClass('selected')
      const value = $target.data('type')
      value && $inputType.val(value)
    }
  })

  $hotWords.click(e => {
    const $target = $(e.target)
    const isAnchor = $target.prop('tagName') === 'A'

    if (isAnchor) {
      const value = $target.text()

      if (value) {
        $inputQuestion.val(value).text(value)
        $form.find('button').click()
      }
    }
  })
})
