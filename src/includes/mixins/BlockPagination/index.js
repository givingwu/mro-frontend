import $ from 'jquery'
// getItemData
import { isUndefined, setFieldAndRefresh } from '../SpecSelector'

const extend = $.extend
const defaults = {
  ele: '.J_BlockPager',
  select: '.J_PagerSelect',
  input: '.J_PagerInput'
}

$.fn.initBlockPagination = function $BlockPagination (options) {
  const { ele, select, input } = extend({}, defaults, options)
  const $pager = $(ele)
  const $select = $pager.find(select)
  const selectField = $select.data('field') || 'pageSize'
  const $input = $pager.find(input)
  const inputField = $input.data('field') || 'pageNumber'
  let value = ''

  $select.on('change', e => {
    setFieldAndRefresh({
      [selectField]: e.target.value
    })
  })
  $input.on('input change', e => {
    value = +e.target.value.replace(/([^0-9])|$/g, '')
  })
  $input.on('focus', documentListenEnterEvent)
  $input.on('blur', documentUnlistenEnterEvent)

  function documentListenEnterEvent () {
    $(document).on(
      'keydown.pager.enter',
      (e) => {
        if (e.which === 13) {
          e.preventDefault()

          if (
            !isUndefined(value) &&
            !isNaN(value)
          ) {
            return setFieldAndRefresh({
              [inputField]: value
            })
          }

          return false
        }
      }
    )
  }

  function documentUnlistenEnterEvent () {
    $(document).off('keydown.pager.enter')
  }
}
