import $ from 'jquery'
import { parse } from 'querystring'
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

  const qsData = parse(location.search.replace(/\?/g, '')) || {}
  const minPage = 1
  const currPage = +qsData.pageNo || minPage
  const maxPage = $input.data('page-max') || $input.attr('data-page-max')
  const inputField = $input.data('field') || 'pageNumber'
  let value = ''

  $select.on('change', e => {
    setFieldAndRefresh({
      [selectField]: e.target.value
    })
  })
  $input.on('input change', e => {
    value = +e.target.value.replace(/([^0-9|\-])|$/g, '')
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
            !isNaN(value) &&
            value !== currPage
          ) {
            if (value > maxPage) value = maxPage
            if (value < minPage) value = minPage
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
